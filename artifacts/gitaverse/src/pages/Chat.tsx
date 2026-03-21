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
        <Button onClick={() => setLocation("/")} variant="outline">Return Home</Button>
      </div>
    );
  }

  const allMessages = conversation.messages || [];

  return (
    <div className="flex flex-col h-screen bg-background relative">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,_hsl(35_60%_98%),_hsl(40_33%_96%))] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center px-4 md:px-6 h-16 border-b border-border/50 bg-white/60 backdrop-blur-md shrink-0 shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setLocation("/")}
          className="mr-4 hover:bg-orange-50 text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">GitaVerse</h2>
          <p className="text-xs text-muted-foreground font-medium">Timeless Wisdom</p>
        </div>
      </header>

      {/* Chat Area */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-0 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-4">
          
          {allMessages.length === 0 && !streamingMessage && !isStreaming && (
            <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center opacity-80 mt-12">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-primary">
                <Flower2 className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-3">Seek and you shall find</h3>
              <p className="text-muted-foreground max-w-md">
                "You have the right to work, but never to the fruit of work. You should never engage in action for the sake of reward, nor should you long for inaction."
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2">— Bhagavad Gita 2.47</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {allMessages.map((msg, idx) => (
              <motion.div
                key={msg.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-primary/30 flex items-center justify-center shrink-0 shadow-sm border border-white">
                    <Flower2 className="w-5 h-5 text-orange-700" />
                  </div>
                )}
                
                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-white border border-border/60 text-foreground rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm md:prose-base prose-orange max-w-none">
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 w-full justify-start"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-200 to-primary/30 flex items-center justify-center shrink-0 shadow-sm border border-white">
                  <Flower2 className="w-5 h-5 text-orange-700" />
                </div>
                <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-tl-sm px-5 py-4 bg-white border border-border/60 text-foreground shadow-sm">
                  {streamingMessage ? (
                     <div className="prose prose-sm md:prose-base prose-orange max-w-none">
                       <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                     </div>
                  ) : (
                    <div className="flex space-x-1 items-center h-6">
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="relative z-10 shrink-0 bg-gradient-to-t from-background via-background to-transparent pb-6 pt-10 px-4 md:px-0">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 bg-white rounded-3xl border border-border/60 shadow-lg shadow-orange-900/5 p-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 ml-1 mb-1">
              <User className="w-5 h-5 text-secondary-foreground/60" />
            </div>
            
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
              className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none resize-none focus:outline-none py-3 px-2 text-foreground placeholder:text-muted-foreground"
              rows={1}
              disabled={isStreaming}
            />
            
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isStreaming}
              className="rounded-full w-12 h-12 mb-0.5 shrink-0 bg-primary hover:bg-primary/90 transition-transform active:scale-95"
            >
              <Send className="w-5 h-5 ml-1" />
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-3 font-medium">
            AI can make mistakes. Reflect deeply on the guidance received.
          </p>
        </div>
      </footer>
    </div>
  );
}
