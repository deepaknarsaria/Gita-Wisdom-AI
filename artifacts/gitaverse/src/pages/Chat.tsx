import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useGetOpenaiConversation } from "@workspace/api-client-react";
import { Send, Flower2, Loader2, Sparkles, Bookmark, BookmarkCheck, Volume2, Pause, Zap, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStream } from "@/hooks/use-chat-stream";
import PaywallModal from "@/components/PaywallModal";
import EmailCaptureModal, { hasEmailCaptured, hasEmailDismissed } from "@/components/EmailCaptureModal";
import AppHeader from "@/components/AppHeader";
import { useSavedGuidance } from "@/hooks/useSavedGuidance";
import { useToast } from "@/hooks/use-toast";
import { useSpeech } from "@/hooks/useSpeech";
import { useLanguage } from "@/contexts/LanguageContext";

const FREE_LIMIT = 5;
const STORAGE_KEY = "gitaverse_free_used";
const PREMIUM_KEY = "gitaverse_premium";

// --- Plan limit helpers ---
function getActivePlan(): string | null {
  return localStorage.getItem(PREMIUM_KEY) || null;
}
function getChatLimit(): number | "unlimited" {
  const raw = localStorage.getItem("gitaverse_chat_limit");
  if (!raw) return FREE_LIMIT;
  if (raw === "unlimited") return "unlimited";
  return parseInt(raw, 10);
}
function getPlanChatsUsed(): number {
  const plan = getActivePlan();
  if (plan) return parseInt(localStorage.getItem("gitaverse_chats_used") || "0", 10);
  return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
}
function incrementChats(isPaidPlan: boolean) {
  if (isPaidPlan) {
    const next = parseInt(localStorage.getItem("gitaverse_chats_used") || "0", 10) + 1;
    localStorage.setItem("gitaverse_chats_used", String(next));
  } else {
    const next = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10) + 1;
    localStorage.setItem(STORAGE_KEY, String(next));
  }
}

function formatForShare(text: string): string {
  const clean = text
    .replace(/\[(EMPATHY|GITA INSIGHT|GITA TEACHING|ACTION STEPS|STEP-BY-STEP GUIDANCE|GITA REFERENCE[S]?|REFLECTION QUESTION|CLOSING (?:LINE|WISDOM)|ROOT CAUSE)\]/gi, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `💫 *GitaVerse Wisdom*\n\n${clean}\n\n🌿 _Get your own Gita guidance at GitaVerse_`;
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
  const [activePlan] = useState<string | null>(getActivePlan);
  const [chatsUsed, setChatsUsed] = useState<number>(getPlanChatsUsed);
  const [isPremium, setIsPremium] = useState<boolean>(() => !!getActivePlan());
  const [deepGuidance, setDeepGuidance] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { language } = useLanguage();

  const canShowEmail = () => !hasEmailCaptured() && !hasEmailDismissed();

  const openEmailIfEligible = () => {
    if (canShowEmail()) setIsEmailOpen(true);
  };

  const { data: conversation, isLoading, isError } = useGetOpenaiConversation(conversationId, {
    query: {
      enabled: !!conversationId,
      refetchInterval: false,
    }
  });

  const { sendMessage, streamingMessage, isStreaming } = useChatStream(conversationId);
  const { saveItem, isAlreadySaved } = useSavedGuidance();
  const { toast } = useToast();
  const { activeId: speakingId, state: speechState, toggle: toggleSpeech, stop: stopSpeech } = useSpeech();

  // Exit intent — show email capture when cursor leaves to top of page
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && canShowEmail()) {
        setIsEmailOpen(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, streamingMessage]);

  // Sync chatsUsed: take whichever is higher — localStorage or DB user message count
  useEffect(() => {
    if (conversation && !activePlan) {
      const dbUserCount = (conversation.messages as any[]).filter(m => m.role === "user").length;
      const stored = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      const synced = Math.max(stored, dbUserCount);
      localStorage.setItem(STORAGE_KEY, String(synced));
      setChatsUsed(synced);
    }
  }, [conversation?.id]);

  // Handle initial prompt from URL
  useEffect(() => {
    if (initialPrompt && conversation && !hasSentInitial && conversation.messages.length === 0) {
      setHasSentInitial(true);
      const next = chatsUsed + 1;
      setChatsUsed(next);
      incrementChats(!!activePlan);
      sendMessage(initialPrompt, false, language);
      
      // Clean up URL to avoid resending on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('prompt');
      window.history.replaceState({}, '', url.toString());
    }
  }, [initialPrompt, conversation, hasSentInitial, sendMessage]);

  const chatLimit = getChatLimit();
  const isLimitReached =
    chatLimit !== "unlimited" && chatsUsed >= (chatLimit as number);

  const handleUpgrade = () => {
    localStorage.setItem(PREMIUM_KEY, "true");
    setIsPremium(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    if (isLimitReached) {
      setIsPaywallOpen(true);
      return;
    }

    const next = chatsUsed + 1;
    setChatsUsed(next);
    incrementChats(!!activePlan);

    const userMessage = input;
    setInput("");
    await sendMessage(userMessage, deepGuidance, language);
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

      <AppHeader />

      {/* Chat identity bar */}
      <div className="relative z-10 w-full border-b border-orange-100/50 bg-white/60 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex flex-col items-center text-center gap-0.5">
          <div className="flex items-center gap-2">
            <Flower2 className="w-4 h-4 text-primary/70" />
            <h2 className="font-display text-[17px] font-bold text-foreground tracking-tight">Ask Krishna</h2>
            {isPremium && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-primary/10 to-orange-400/10 border border-primary/20">
                <Sparkles className="w-2.5 h-2.5 text-primary" />
                <span className="text-[10px] font-semibold text-primary tracking-wide">Premium</span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground/60 font-medium tracking-wide">
            Get life guidance inspired by Bhagavad Gita
          </p>
        </div>
      </div>

      {/* Usage Bar */}
      {(() => {
        if (chatLimit === "unlimited") {
          return (
            <div className="relative z-10 w-full bg-gradient-to-r from-amber-50/80 to-orange-50/60 border-b border-amber-100/60">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                <span className="text-[11px] font-semibold text-amber-700 tracking-wide">Unlimited access active</span>
              </div>
            </div>
          );
        }
        const limit = chatLimit as number;
        const used = chatsUsed;
        const pct = Math.min((used / limit) * 100, 100);
        const planLabel = activePlan
          ? activePlan.charAt(0).toUpperCase() + activePlan.slice(1)
          : "Free";
        const isNearLimit = pct >= 80;
        return (
          <div className="relative z-10 w-full bg-white/60 backdrop-blur-sm border-b border-orange-100/50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
              <span className={`text-[11px] font-medium shrink-0 ${isNearLimit ? "text-red-500" : "text-foreground/50"}`}>
                {planLabel} plan
              </span>
              {/* Progress bar */}
              <div className="flex-1 h-1.5 rounded-full bg-orange-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isNearLimit ? "bg-red-400" : "bg-gradient-to-r from-primary to-orange-400"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={`text-[11px] font-semibold shrink-0 tabular-nums ${isNearLimit ? "text-red-500" : "text-foreground/60"}`}>
                {used} / {limit}
              </span>
              {isNearLimit && (
                <button
                  onClick={() => setIsPaywallOpen(true)}
                  className="text-[10px] font-bold text-primary underline underline-offset-2 shrink-0 hover:text-orange-600 transition-colors"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Chat Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-8">
          
          {allMessages.length === 0 && !streamingMessage && !isStreaming && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center h-full min-h-[45vh] text-center mt-6"
            >
              {/* Lotus icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-50 rounded-full flex items-center justify-center mb-7 shadow-md shadow-orange-900/8 border border-orange-200/60">
                <Flower2 className="w-10 h-10 text-primary" />
              </div>

              {/* Title */}
              <h3 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
                Ask Krishna
              </h3>
              <p className="text-sm font-medium text-primary/70 tracking-widest uppercase mb-8">
                Guidance inspired by Bhagavad Gita
              </p>

              {/* Divider with om */}
              <div className="flex items-center gap-3 mb-8 opacity-30">
                <div className="h-px w-12 bg-foreground/30" />
                <span className="text-base">🕉</span>
                <div className="h-px w-12 bg-foreground/30" />
              </div>

              {/* Verse */}
              <p className="text-foreground/55 max-w-sm text-[15px] font-light leading-relaxed italic">
                "You have the right to perform your actions, but never to the fruits of your actions."
              </p>
              <p className="text-xs font-semibold text-muted-foreground/50 mt-3 tracking-widest uppercase">
                — Bhagavad Gita 2.47
              </p>
            </motion.div>
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

                  {/* Action buttons for AI messages */}
                  {msg.role === 'assistant' && (
                    <div className="flex justify-start items-center gap-2 px-1 mt-1">

                      {/* Listen / Pause button */}
                      {(() => {
                        const msgId = String(msg.id ?? idx);
                        const isThisSpeaking = speakingId === msgId;
                        const isPlaying = isThisSpeaking && speechState === "playing";
                        const isPaused = isThisSpeaking && speechState === "paused";
                        return (
                          <button
                            onClick={() => toggleSpeech(msgId, msg.content)}
                            title={isPlaying ? "Pause" : isPaused ? "Resume" : "Listen"}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200
                              ${isThisSpeaking
                                ? "text-primary bg-orange-50 border border-orange-200"
                                : "text-foreground/30 hover:text-primary hover:bg-orange-50 hover:border-orange-100 border border-transparent"
                              }`}
                          >
                            {isPlaying
                              ? <><Pause className="w-3.5 h-3.5" /> Pause</>
                              : isPaused
                              ? <><Volume2 className="w-3.5 h-3.5" /> Resume</>
                              : <><Volume2 className="w-3.5 h-3.5" /> Listen</>
                            }
                          </button>
                        );
                      })()}

                      {/* Divider dot */}
                      <span className="w-1 h-1 rounded-full bg-foreground/15" />

                      {/* Save button */}
                      <button
                        onClick={() => {
                          if (!isAlreadySaved(msg.content)) {
                            saveItem(msg.content);
                            toast({
                              description: "✓ Saved to your guidance",
                              duration: 2000,
                            });
                          }
                        }}
                        title={isAlreadySaved(msg.content) ? "Already saved" : "Save this guidance"}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200
                          ${isAlreadySaved(msg.content)
                            ? "text-primary/70 bg-orange-50 border border-orange-100 cursor-default"
                            : "text-foreground/30 hover:text-primary hover:bg-orange-50 hover:border-orange-100 border border-transparent"
                          }`}
                      >
                        {isAlreadySaved(msg.content)
                          ? <><BookmarkCheck className="w-3.5 h-3.5" /> Saved</>
                          : <><Bookmark className="w-3.5 h-3.5" /> Save</>
                        }
                      </button>

                      {/* Divider dot */}
                      <span className="w-1 h-1 rounded-full bg-foreground/15" />

                      {/* Share button */}
                      {(() => {
                        const msgId = String(msg.id ?? idx);
                        const isCopied = copiedId === msgId;
                        return (
                          <button
                            onClick={async () => {
                              const shareText = formatForShare(msg.content);
                              try {
                                await navigator.clipboard.writeText(shareText);
                              } catch {
                                const el = document.createElement("textarea");
                                el.value = shareText;
                                document.body.appendChild(el);
                                el.select();
                                document.execCommand("copy");
                                document.body.removeChild(el);
                              }
                              setCopiedId(msgId);
                              toast({
                                description: "Copied! Share this wisdom with others 🙏",
                                duration: 3000,
                              });
                              setTimeout(() => setCopiedId(null), 3000);
                            }}
                            title="Copy & share this wisdom"
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200
                              ${isCopied
                                ? "text-green-600 bg-green-50 border border-green-200"
                                : "text-foreground/30 hover:text-primary hover:bg-orange-50 hover:border-orange-100 border border-transparent"
                              }`}
                          >
                            {isCopied
                              ? <><Check className="w-3.5 h-3.5" /> Copied!</>
                              : <><Share2 className="w-3.5 h-3.5" /> Share</>
                            }
                          </button>
                        );
                      })()}
                    </div>
                  )}
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

      <PaywallModal
        open={isLimitReached || isPaywallOpen}
        onUpgrade={() => { handleUpgrade(); setIsPaywallOpen(false); }}
        onClose={() => { setIsPaywallOpen(false); openEmailIfEligible(); }}
      />
      <EmailCaptureModal open={isEmailOpen} onClose={() => setIsEmailOpen(false)} />

      {/* Input Area */}
      <footer className="relative z-10 shrink-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-6 pt-10 px-4 sm:px-6">
        {/* Deep Guidance Active Banner */}
        <AnimatePresence>
          {deepGuidance && isPremium && (
            <motion.div
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 6, height: 0 }}
              className="max-w-3xl mx-auto mb-3 overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-400/30 rounded-2xl px-4 py-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                <p className="text-xs font-semibold text-amber-700 tracking-wide">
                  Deep Guidance Mode active — responses will be longer and more thorough
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            <>
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

              {/* Deep Guidance Button Row */}
              <div className="flex items-center justify-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!isPremium) {
                      setIsPaywallOpen(true);
                    } else {
                      setDeepGuidance(prev => !prev);
                    }
                  }}
                  className={`group relative flex items-center gap-2 rounded-2xl border px-4 py-2.5 transition-all duration-200 ${
                    deepGuidance && isPremium
                      ? "bg-amber-500 border-amber-400 text-white shadow-md shadow-amber-500/25 hover:bg-amber-600"
                      : "bg-white border-orange-200/80 text-foreground/70 hover:border-orange-300 hover:bg-orange-50/60"
                  }`}
                >
                  <Zap className={`w-4 h-4 shrink-0 ${deepGuidance && isPremium ? "fill-white text-white" : "text-amber-500"}`} />
                  <span className="text-sm font-semibold">
                    {deepGuidance && isPremium ? "Deep Guidance: ON" : "Get Deep Guidance"}
                  </span>
                  {!(deepGuidance && isPremium) && (
                    <span className="ml-1 inline-flex items-center rounded-full bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-bold text-amber-700 tracking-wide uppercase">
                      Premium
                    </span>
                  )}
                  {deepGuidance && isPremium && (
                    <span className="ml-1 text-xs font-medium text-white/80">· click to turn off</span>
                  )}
                </button>
              </div>
            </>
          )}
          {!isLimitReached && (
            <p className="text-center text-[11px] md:text-xs text-muted-foreground/80 mt-4 font-medium tracking-wide">
              AI can make mistakes. Reflect deeply on the guidance received.
            </p>
          )}
          {!isLimitReached && chatLimit !== "unlimited" && (
            <p className="text-center text-[11px] text-muted-foreground/50 mt-1 tracking-wide">
              {(chatLimit as number) - chatsUsed} {activePlan ? `${activePlan} plan` : "free"} {((chatLimit as number) - chatsUsed) === 1 ? "message" : "messages"} remaining
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
