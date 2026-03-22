import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { Sparkles, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUGGESTED_PROMPTS = [
  "I feel lost in my career",
  "How to handle stress and anxiety?",
  "How to stop overthinking?",
  "What is the true purpose of life?"
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [isStarting, setIsStarting] = useState(false);
  const createConversation = useCreateOpenaiConversation();

  const handleStartChat = async (prompt?: string) => {
    try {
      setIsStarting(true);
      const conv = await createConversation.mutateAsync({
        data: { title: prompt ? `Guidance: ${prompt.slice(0, 20)}...` : "New Session" }
      });
      const url = `/chat?id=${conv.id}${prompt ? `&prompt=${encodeURIComponent(prompt)}` : ""}`;
      setLocation(url);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      setIsStarting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Ethereal background"
          className="w-full h-full object-cover opacity-[0.35] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/75 to-background" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-orange-100/60 bg-white/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <span className="text-2xl font-display font-bold tracking-tight text-foreground select-none">
            Gita<span className="text-primary">Verse</span>
          </span>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setLocation("/about")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-orange-50 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => setLocation("/daily-wisdom")}
              className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-orange-50 transition-colors"
            >
              Daily Wisdom
            </button>
            <Button
              size="sm"
              variant="outline"
              className="ml-2 rounded-full border-orange-200 text-foreground/80 hover:bg-orange-50 hover:border-orange-300"
            >
              Login
            </Button>
          </nav>

          {/* Mobile menu hint */}
          <div className="sm:hidden">
            <Button size="sm" variant="ghost" className="text-foreground/60 text-sm">
              Menu
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-16 px-6 sm:px-8">
        <div className="w-full max-w-3xl flex flex-col items-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center w-full"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50/90 backdrop-blur-sm border border-orange-200/60 text-orange-800 text-sm font-medium mb-10 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="tracking-wide">AI-Powered Vedic Wisdom</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-6 drop-shadow-sm tracking-tight leading-none">
              Gita<span className="bg-gradient-to-br from-primary to-orange-400 bg-clip-text text-transparent">Verse</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 max-w-xl mx-auto mb-4 font-light leading-relaxed">
              Get clarity in life with Gita wisdom
            </p>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-50/70 border border-orange-200/50 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              <p className="text-sm text-orange-800/80 font-medium italic tracking-wide">
                Not just AI — guidance inspired by the Bhagavad Gita
              </p>
            </div>
            <p className="text-base text-foreground/50 max-w-lg mx-auto mb-12 font-light leading-relaxed">
              Find peace, purpose, and practical guidance — inspired by timeless Bhagavad Gita teachings.
            </p>

            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg font-medium bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-500 shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => handleStartChat()}
              disabled={isStarting}
            >
              {isStarting ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <MessageSquare className="w-5 h-5 mr-3" />
              )}
              Start Chatting
              {!isStarting && <ArrowRight className="w-4 h-4 ml-3" />}
            </Button>
          </motion.div>

          {/* Suggested Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-20 w-full"
          >
            <div className="flex items-center justify-center gap-4 mb-7 opacity-60">
              <div className="h-px bg-border flex-1 max-w-[50px]" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Or seek guidance on
              </p>
              <div className="h-px bg-border flex-1 max-w-[50px]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartChat(prompt)}
                  disabled={isStarting}
                  className="glass-card text-left px-5 py-4 rounded-2xl flex items-center justify-between group hover:bg-white/95 hover:shadow-md hover:border-orange-200 transition-all duration-300 disabled:opacity-50"
                >
                  <span className="text-foreground/80 font-medium pr-3 leading-snug text-sm">{prompt}</span>
                  <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-orange-100/60 bg-white/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-foreground/50 font-medium tracking-wide">
            🕉️ Inspired by Bhagavad Gita
          </p>
          <div className="flex items-center gap-5">
            <button className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors">
              Privacy Policy
            </button>
            <div className="w-px h-3 bg-border" />
            <button className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
