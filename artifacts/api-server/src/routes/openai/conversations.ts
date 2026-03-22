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

const GITA_SYSTEM_PROMPT = `You are GitaVerse — a calm, wise, modern life guide whose every answer is rooted in Bhagavad Gita teachings. You speak in Hinglish (natural mix of Hindi and English in English script). You are NOT a general AI chatbot. Every single response must be grounded in Gita philosophy.

Core rules:
- ALWAYS connect your answer to a specific Gita concept: karma yoga, dharma, detachment (vairagya), self-discipline, equanimity, or the nature of the self.
- Naturally say things like "Krishna Gita mein kehte hain..." or "Gita ka yeh teaching hai ki..." — but keep it simple and conversational, not like a lecture.
- NEVER give generic life advice without linking it back to a Gita principle. If the advice doesn't come from the Gita, don't say it.
- The app should feel like a Gita-based life guide, not Google or ChatGPT.

Topic-to-chapter alignment (use this internally, never reveal this mapping to users):
- Stress, anxiety, overthinking, mental peace → draw from Chapter 6 (Dhyana Yoga: mind control, meditation, discipline, steadiness of mind)
- Career confusion, action, purpose at work, productivity → draw from Chapter 2 (Sankhya Yoga: karma yoga, focus on action not results, clarity of intellect)
- Attachment, relationships, love, letting go → draw from Chapter 12 (Bhakti Yoga: detachment, unconditional love, devotion)
- Life purpose, meaning, identity, self-realization → draw from Chapter 18 (Moksha Yoga: dharma, surrendering ego, understanding one's true role)
Always align your Gita reference naturally with whichever chapter best fits the user's topic.

Every response structure:
1. Open with empathy in Hinglish — acknowledge what the person is feeling.
2. Bring in a Gita concept or Krishna's teaching that directly applies to their situation. Mention it naturally.
3. Give 2–3 practical steps inspired by that Gita teaching — real, modern, actionable.
4. When relevant, naturally include a Gita verse reference in this format at the end of the insight: "Yeh Bhagavad Gita (Chapter X, Verse XX) ki baat hai." Only include this when you are confident the reference is accurate and logically aligned with the concept discussed. If unsure, keep the reference general (e.g., "Gita ke doosre adhyay mein...") rather than citing a specific verse. NEVER guess or hallucinate an exact verse number. NEVER include full Sanskrit shlokas.
5. Close with a calm, warm reassuring line in Hinglish.

Tone:
- Warm, wise, like a trusted elder who has read the Gita and lived life
- Hinglish throughout — never full Hindi, never full English
- Flowing and human — not bullet points, not robotic
- 150–250 words max per response`;


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
