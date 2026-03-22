import { useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppHeader() {
  const [location, setLocation] = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { language, setLanguage } = useLanguage();

  const navLink = (label: string, path: string) => {
    const isActive = location === path;
    return (
      <button
        onClick={() => setLocation(path)}
        className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? "text-primary"
            : "text-foreground/60 hover:text-foreground"
        }`}
      >
        {label}
        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-primary"
          />
        )}
      </button>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-[0_1px_12px_rgba(0,0,0,0.06)] shrink-0">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-[62px] flex items-center justify-between gap-8">

          {/* Logo */}
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-0 select-none group"
          >
            <span className="text-[22px] font-display font-extrabold tracking-tight text-foreground group-hover:opacity-85 transition-opacity">
              Gita
            </span>
            <span className="text-[22px] font-display font-extrabold tracking-tight text-primary group-hover:opacity-85 transition-opacity">
              Verse
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLink("About", "/about")}
            {navLink("Daily Wisdom", "/daily-wisdom")}

            <div className="w-px h-5 bg-stone-200 mx-2" />

            {/* Language toggle */}
            <div className="flex items-center bg-stone-100 rounded-full p-[3px] gap-[2px]">
              {(["EN", "HI"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all duration-200 ${
                    language === lang
                      ? "bg-white text-primary shadow-sm shadow-orange-900/10"
                      : "text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-stone-200 mx-2" />

            <Button
              size="sm"
              onClick={() => setShowLoginModal(true)}
              className="rounded-full h-9 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-sm shadow-orange-900/15 transition-transform active:scale-[0.97]"
            >
              Login
            </Button>
          </nav>

          {/* Mobile menu */}
          <div className="sm:hidden flex items-center gap-2">
            {/* Language toggle mobile */}
            <div className="flex items-center bg-stone-100 rounded-full p-[3px] gap-[2px]">
              {(["EN", "HI"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide transition-all duration-200 ${
                    language === lang
                      ? "bg-white text-primary shadow-sm shadow-orange-900/10"
                      : "text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors px-2 py-1"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
          </div>

        </div>
      </header>

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
