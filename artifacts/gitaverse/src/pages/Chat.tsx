import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useGetOpenaiConversation } from "@workspace/api-client-react";
import { Send, ArrowLeft, Flower2, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStream } from "@/hooks/use-chat-stream";

export default function Chat() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const idParam = searchParams.get("id");
  const initialPrompt = searchParams.get("prompt");
  const conversationId = idParam ? parseInt(idParam, 10) : 0;

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasSentInitial, setHasSentInitial] = useState(false);

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

  // Handle initial prompt from URL
  useEffect(() => {
    if (initialPrompt && conversation && !hasSentInitial && conversation.messages.length === 0) {
      setHasSentInitial(true);
      sendMessage(initialPrompt);
      
      // Clean up URL to avoid resending on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('prompt');
      window.history.replaceState({}, '', url.toString());
    }
  }, [initialPrompt, conversation, hasSentInitial, sendMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    
    const userMessage = input;
    setInput("");
    
    // We visually clear the input instantly, the streaming hook handles the rest
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
                
                <div className={`max-w-[88%] sm:max-w-[80%] rounded-[1.5rem] px-5 py-4 md:px-6 md:py-4.5 text-[15px] md:text-[16px] leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-primary to-orange-500 text-white rounded-br-[4px] shadow-md shadow-orange-900/10' 
                    : 'bg-white border border-orange-900/5 text-foreground rounded-bl-[4px] shadow-sm shadow-orange-900/5'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm md:prose-base prose-orange max-w-none prose-p:leading-relaxed prose-headings:font-display">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
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

      {/* Input Area */}
      <footer className="relative z-10 shrink-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-6 pt-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
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
          <p className="text-center text-[11px] md:text-xs text-muted-foreground/80 mt-4 font-medium tracking-wide">
            AI can make mistakes. Reflect deeply on the guidance received.
          </p>
        </div>
      </footer>
    </div>
  );
}
