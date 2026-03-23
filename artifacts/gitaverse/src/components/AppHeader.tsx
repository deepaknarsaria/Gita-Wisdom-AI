import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { openEmailPopup } from "@/lib/emailPopup";

export default function AppHeader() {
  const [location, setLocation] = useLocation();
  const { language, setLanguage } = useLanguage();
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem("userEmail"));

  // Keep in sync when email is captured in same tab or another tab
  useEffect(() => {
    const onCaptured = (e: Event) => setUserEmail((e as CustomEvent).detail);
    const onStorage = () => setUserEmail(localStorage.getItem("userEmail"));
    window.addEventListener("userEmailCaptured", onCaptured);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("userEmailCaptured", onCaptured);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLoginClick = () => {
    if (userEmail) {
      alert("You are already logged in");
    } else {
      openEmailPopup();
    }
  };

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

            {userEmail ? (
              <span className="text-sm font-medium text-foreground/70 truncate max-w-[200px]">
                Hi, {userEmail}
              </span>
            ) : (
              <Button
                size="sm"
                onClick={handleLoginClick}
                className="rounded-full h-9 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-sm shadow-orange-900/15 transition-transform active:scale-[0.97]"
              >
                Login / Signup
              </Button>
            )}
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
            {userEmail ? (
              <span className="text-xs font-medium text-foreground/60 truncate max-w-[120px]">
                Hi, {userEmail.split("@")[0]}
              </span>
            ) : (
              <button
                className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors px-2 py-1"
                onClick={handleLoginClick}
              >
                Login / Signup
              </button>
            )}
          </div>

        </div>
      </header>

    </>
  );
}
