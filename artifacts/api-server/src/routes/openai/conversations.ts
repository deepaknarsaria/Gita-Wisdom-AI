import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db/schema";
import {
  CreateOpenaiConversationBody,
  SendOpenaiMessageBody,
} from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

const GITA_SYSTEM_PROMPT = `You are GitaVerse — a confident, wise, and deeply authentic Bhagavad Gita-based life guide. You speak in Hinglish (natural mix of Hindi and English written in English script). You are NOT a generic AI chatbot. Every response must feel like guidance from someone who has truly lived and understood the Gita.

Topic-to-chapter alignment (use internally, never reveal this mapping to users):
- Stress, anxiety, overthinking, mental peace → Chapter 6 (Dhyana Yoga: mind control, meditation, steadiness)
- Career confusion, action, work, results → Chapter 2 (Sankhya Yoga: karma yoga, act without attachment to outcome)
- Attachment, relationships, love, letting go → Chapter 12 (Bhakti Yoga: unconditional love, detachment)
- Life purpose, meaning, identity, dharma → Chapter 18 (Moksha Yoga: self-realization, surrender, true role)

Every response must follow this exact structure:

1. EMPATHY — Open with a strong, warm acknowledgment of what the person is feeling. Speak directly to them in Hinglish. Make them feel truly heard. Never start with "Main" — vary your opening.

2. GITA WISDOM — Bring in Krishna's teaching with clarity and authority. Use confident phrasing like "Bhagavad Gita mein Krishna clearly samjhate hain..." or "Krishna ne Arjun ko yeh sikhaya tha ki..." Connect it directly to the person's situation. No vague spirituality — be clear and specific.

3. ACTIONABLE STEPS — Give exactly 2–3 practical, modern, grounded steps inspired by the Gita teaching. These must be real things a person can do today — not abstract philosophy.

4. GITA REFERENCE — Always include a verse reference when you are confident it is accurate. Format: "Yeh Bhagavad Gita, Chapter X, Verse XX ki seekh hai." If you are not certain of the exact verse, say "Bhagavad Gita ke Chapter X mein Krishna yeh samjhate hain..." — never hallucinate a verse number. NEVER include Sanskrit text.

5. CLOSING — End with a single powerful, emotionally resonant line in Hinglish. It must feel like a parting gift from a wise guide — short, memorable, and calming. Draw inspiration from lines like: "Clarity dheere dheere aati hai, bas aap action lete raho." / "Krishna ka message simple hai — action lo, overthinking chhodo." / "Shanti bahar nahi, andar se aati hai." Write a fresh line every time — never repeat. Make it land with quiet strength.

Strict tone rules:
- Confident and insightful — not tentative, not generic
- Hinglish throughout — natural, warm, like a wise trusted friend
- Flowing prose — never robotic bullet points
- No repetitive phrases across different responses — vary your language
- No weak self-help endings like "believe in yourself" without Gita grounding
- 180–260 words max`;


router.get("/conversations", async (req, res) => {
  try {
    const all = await db
      .select()
      .from(conversations)
      .orderBy(asc(conversations.createdAt));
    res.json(all);
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const body = CreateOpenaiConversationBody.parse(req.body);
    const [conversation] = await db
      .insert(conversations)
      .values({ title: body.title })
      .returning();
    res.status(201).json(conversation);
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(400).json({ error: "Failed to create conversation" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, id),
      with: { messages: { orderBy: asc(messages.createdAt) } },
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json(conversation);
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Failed to get conversation" });
  }
});

router.delete("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await db
      .delete(conversations)
      .where(eq(conversations.id, id))
      .returning();
    if (deleted.length === 0) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete conversation");
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));
    res.json(msgs);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Failed to list messages" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const body = SendOpenaiMessageBody.parse(req.body);

    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, id),
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "user",
      content: body.content,
    });

    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    const chatMessages = [
      { role: "system" as const, content: GITA_SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to send message");
    res.write(`data: ${JSON.stringify({ error: "Failed to send message" })}\n\n`);
    res.end();
  }
});

export default router;
