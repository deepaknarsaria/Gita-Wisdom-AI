import { useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const [, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <header className="w-full border-b border-orange-100/60 bg-white/80 backdrop-blur-md shrink-0 z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="text-2xl font-display font-bold tracking-tight text-foreground select-none hover:opacity-80 transition-opacity"
          >
            Gita<span className="text-primary">Verse</span>
          </button>

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

          <div className="sm:hidden">
            <Button size="sm" variant="ghost" className="text-foreground/60 text-sm">
              Menu
            </Button>
          </div>
        </div>
      </header>

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
    </>
  );
}
