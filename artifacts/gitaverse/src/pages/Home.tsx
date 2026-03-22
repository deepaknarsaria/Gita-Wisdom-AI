import { useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { Sparkles, MessageSquare, ArrowRight, Loader2, X, Clock } from "lucide-react";
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
  const [showLoginModal, setShowLoginModal] = useState(false);
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
              onClick={() => setShowLoginModal(true)}
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
      <footer className="relative z-10 w-full border-t border-orange-100/80 bg-orange-50/40">
        <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col items-center gap-6 text-center">

          {/* Logo mark */}
          <span className="text-lg text-primary/40 select-none">🕉</span>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <button
              onClick={() => setLocation("/about")}
              className="text-sm text-foreground/55 hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <span className="text-foreground/20 text-xs">•</span>
            <button
              onClick={() => setLocation("/daily-wisdom")}
              className="text-sm text-foreground/55 hover:text-primary transition-colors font-medium"
            >
              Daily Wisdom
            </button>
            <span className="text-foreground/20 text-xs">•</span>
            <button className="text-sm text-foreground/55 hover:text-primary transition-colors font-medium">
              Privacy Policy
            </button>
            <span className="text-foreground/20 text-xs">•</span>
            <button className="text-sm text-foreground/55 hover:text-primary transition-colors font-medium">
              Terms
            </button>
          </nav>

          {/* Tagline */}
          <p className="text-xs text-foreground/35 tracking-wide">
            Built with inspiration from the Bhagavad Gita
          </p>

        </div>
      </footer>

      {/* Login Modal */}
      {createPortal(
        <AnimatePresence>
          {showLoginModal && (
            <>
              <motion.div
                key="login-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLoginModal(false)}
                style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
              />
              <motion.div
                key="login-modal"
                initial={{ opacity: 0, scale: 0.93, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: 24 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
              >
                <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl shadow-orange-900/10 border border-orange-100 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 px-7 pt-8 pb-7 border-b border-orange-100/60 relative">
                    <button
                      onClick={() => setShowLoginModal(false)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-orange-100/60 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-full bg-white border border-orange-200 flex items-center justify-center shadow-sm">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="font-display text-xl font-bold text-foreground">Login</h2>
                    </div>
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-primary/70 bg-primary/8 border border-primary/15 px-2.5 py-0.5 rounded-full mt-1">
                      Coming Soon
                    </span>
                  </div>

                  {/* Body */}
                  <div className="px-7 py-7">
                    <p className="text-[15px] text-foreground/70 leading-relaxed mb-7">
                      We are building a personalized experience for you. Login feature will be available soon.
                    </p>
                    <Button
                      onClick={() => setShowLoginModal(false)}
                      className="w-full rounded-2xl h-11 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-orange-900/10 transition-transform active:scale-[0.98]"
                    >
                      Got it
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}
