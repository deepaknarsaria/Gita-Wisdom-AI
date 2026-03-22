import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useGetOpenaiConversation } from "@workspace/api-client-react";
import { Send, ArrowLeft, Flower2, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStream } from "@/hooks/use-chat-stream";
import PaywallModal from "@/components/PaywallModal";

const FREE_LIMIT = 5;
const STORAGE_KEY = "gitaverse_free_used";
const PREMIUM_KEY = "gitaverse_premium";

function getStoredCount(): number {
  return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
}
function setStoredCount(n: number) {
  localStorage.setItem(STORAGE_KEY, String(n));
}
function getIsPremium(): boolean {
  return localStorage.getItem(PREMIUM_KEY) === "true";
}

export default function Chat() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const idParam = searchParams.get("id");
  const initialPrompt = searchParams.get("prompt");
  const conversationId = idParam ? parseInt(idParam, 10) : 0;

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasSentInitial, setHasSentInitial] = useState(false);
  const [freeUsed, setFreeUsed] = useState<number>(getStoredCount);
  const [isPremium, setIsPremium] = useState<boolean>(getIsPremium);

  const { data: conversation, isLoading, isError } = useGetOpenaiConversation(conversationId, {
    query: {
      enabled: !!conversationId,
      refetchInterval: false,
    }
  });

  const { sendMessage, streamingMessage, isStreaming } = useChatStream(conversationId);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, streamingMessage]);

  // Sync freeUsed: take whichever is higher — localStorage or DB user message count
  useEffect(() => {
    if (conversation) {
      const dbUserCount = (conversation.messages as any[]).filter(m => m.role === "user").length;
      const stored = getStoredCount();
      const synced = Math.max(stored, dbUserCount);
      setStoredCount(synced);
      setFreeUsed(synced);
    }
  }, [conversation?.id]);

  // Handle initial prompt from URL
  useEffect(() => {
    if (initialPrompt && conversation && !hasSentInitial && conversation.messages.length === 0) {
      setHasSentInitial(true);
      const next = getStoredCount() + 1;
      setStoredCount(next);
      setFreeUsed(next);
      sendMessage(initialPrompt);
      
      // Clean up URL to avoid resending on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('prompt');
      window.history.replaceState({}, '', url.toString());
    }
  }, [initialPrompt, conversation, hasSentInitial, sendMessage]);

  const isLimitReached = !isPremium && freeUsed >= FREE_LIMIT;

  const handleUpgrade = () => {
    localStorage.setItem(PREMIUM_KEY, "true");
    setIsPremium(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming || isLimitReached) return;
    
    const next = freeUsed + 1;
    setFreeUsed(next);
    setStoredCount(next);

    const userMessage = input;
    setInput("");
    await sendMessage(userMessage);
  };

  if (!conversationId) {
    setLocation("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !conversation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
        <p className="text-xl text-destructive mb-4">Could not load conversation.</p>
        <Button onClick={() => setLocation("/")} variant="outline" className="rounded-full px-8">Return Home</Button>
      </div>
    );
  }

  const allMessages = conversation.messages || [];

  return (
    <div className="flex flex-col h-[100dvh] bg-background relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,_hsl(42_50%_99%),_hsl(42_40%_96%))] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 md:px-6 h-16 md:h-20 bg-white/70 backdrop-blur-xl border-b border-border/40 shrink-0 shadow-sm shadow-orange-900/5">
        <div className="flex items-center max-w-3xl mx-auto w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setLocation("/")}
            className="mr-3 rounded-full hover:bg-orange-50 hover:text-primary text-foreground transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <h2 className="font-display font-semibold text-lg md:text-xl text-foreground leading-tight">GitaVerse</h2>
            <p className="text-[11px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider">Timeless Wisdom</p>
          </div>
          {isPremium && (
            <div className="ml-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/10 to-orange-400/10 border border-primary/20">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[11px] font-semibold text-primary tracking-wide">Premium</span>
            </div>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-8">
          
          {allMessages.length === 0 && !streamingMessage && !isStreaming && (
            <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center opacity-90 mt-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center mb-6 text-primary shadow-inner border border-orange-100">
                <Flower2 className="w-10 h-10" />
              </div>
              <h3 className="font-display text-3xl font-medium text-foreground mb-4">Seek and you shall find</h3>
              <p className="text-foreground/70 max-w-md text-lg font-light leading-relaxed">
                "You have the right to work, but never to the fruit of work. You should never engage in action for the sake of reward, nor should you long for inaction."
              </p>
              <p className="text-sm font-medium text-muted-foreground/80 mt-4 tracking-wide uppercase">— Bhagavad Gita 2.47</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {allMessages.map((msg, idx) => (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-900/5 border border-orange-100 mt-1">
                    <Flower2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                )}
                
                <div className="flex flex-col gap-1 max-w-[88%] sm:max-w-[80%]">
                  {msg.role === 'assistant' && (
                    <span className="text-[11px] font-medium text-orange-500/70 tracking-wide px-1 select-none">
                      Guidance inspired by Bhagavad Gita
                    </span>
                  )}
                  <div className={`rounded-[1.5rem] px-6 py-5 md:px-8 md:py-6 text-[16px] md:text-[17px] leading-loose ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-primary to-orange-500 text-white rounded-br-[4px] shadow-md shadow-orange-900/10' 
                      : 'bg-white border border-orange-900/5 text-foreground rounded-bl-[4px] shadow-sm shadow-orange-900/5'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-base md:prose-lg prose-orange max-w-none prose-p:leading-loose prose-p:my-3 prose-li:my-2 prose-ul:my-4 prose-ul:space-y-2 prose-headings:font-display [&_li]:leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-loose">{msg.content}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Streaming Message Placeholder */}
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 w-full justify-start"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-900/5 border border-orange-100 mt-1">
                  <Flower2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div className="max-w-[88%] sm:max-w-[80%] rounded-[1.5rem] rounded-bl-[4px] px-5 py-4 md:px-6 md:py-4.5 bg-white border border-orange-900/5 text-foreground shadow-sm shadow-orange-900/5 text-[15px] md:text-[16px] leading-relaxed">
                  {streamingMessage ? (
                     <div className="prose prose-sm md:prose-base prose-orange max-w-none prose-p:leading-relaxed prose-headings:font-display">
                       <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                     </div>
                  ) : (
                    <div className="flex space-x-1.5 items-center h-6 px-1">
                      <div className="typing-dot w-2 h-2 bg-primary/60 rounded-full" />
                      <div className="typing-dot w-2 h-2 bg-primary/60 rounded-full" />
                      <div className="typing-dot w-2 h-2 bg-primary/60 rounded-full" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </main>

      <PaywallModal open={isLimitReached} onUpgrade={handleUpgrade} />

      {/* Input Area */}
      <footer className="relative z-10 shrink-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-6 pt-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {isLimitReached ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 rounded-[2rem] border border-orange-200 bg-orange-50/80 backdrop-blur px-6 py-5 text-center shadow-lg shadow-orange-900/5"
            >
              <Flower2 className="w-6 h-6 text-primary opacity-70" />
              <p className="text-[15px] font-medium text-foreground/80 leading-snug">
                You've reached your free limit.{" "}
                <span className="text-primary font-semibold">Upgrade to continue your journey.</span>
              </p>
            </motion.div>
          ) : (
            <form 
              onSubmit={handleSubmit}
              className="relative flex items-end gap-2 bg-white rounded-[2rem] border border-orange-900/10 shadow-xl shadow-orange-900/5 p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all duration-300"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Seek your guidance..."
                className="flex-1 max-h-32 min-h-[52px] bg-transparent border-none resize-none focus:outline-none py-3.5 pl-6 pr-2 text-base text-foreground placeholder:text-muted-foreground/70"
                rows={1}
                disabled={isStreaming}
              />
              
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim() || isStreaming}
                className="rounded-full w-12 h-12 md:w-14 md:h-14 mb-0.5 shrink-0 bg-primary hover:bg-primary/90 text-white shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:shadow-none"
              >
                <Send className="w-5 h-5 md:w-6 md:h-6 ml-0.5" />
              </Button>
            </form>
          )}
          {!isLimitReached && (
            <p className="text-center text-[11px] md:text-xs text-muted-foreground/80 mt-4 font-medium tracking-wide">
              AI can make mistakes. Reflect deeply on the guidance received.
            </p>
          )}
          {!isLimitReached && (
            <p className="text-center text-[11px] text-muted-foreground/50 mt-1 tracking-wide">
              {FREE_LIMIT - freeUsed} free {FREE_LIMIT - freeUsed === 1 ? "message" : "messages"} remaining
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
