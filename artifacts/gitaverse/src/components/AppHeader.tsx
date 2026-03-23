import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { openEmailPopup } from "@/lib/emailPopup";
import { LogOut, ChevronDown } from "lucide-react";

function logoutUser() {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("plan");
  localStorage.removeItem("chatLimit");
  localStorage.removeItem("chatsUsed");
  localStorage.removeItem("expiryDate");
  localStorage.removeItem("gitaverse_visited");
  localStorage.removeItem("gitaverse_email");
  localStorage.removeItem("gitaverse_email_dismissed");
  location.reload();
}

export default function AppHeader() {
  const [location, setLocation] = useLocation();
  const { language, setLanguage } = useLanguage();
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem("userEmail"));
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowConfirm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoginClick = () => openEmailPopup();

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

  const UserMenu = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => { setShowMenu(p => !p); setShowConfirm(false); }}
        className={`flex items-center gap-1 font-medium text-foreground/70 hover:text-foreground transition-colors ${mobile ? "text-xs max-w-[120px]" : "text-sm max-w-[200px]"}`}
      >
        <span className="truncate">Hi, {mobile ? userEmail!.split("@")[0] : userEmail}</span>
        <ChevronDown className={`shrink-0 transition-transform duration-200 ${showMenu ? "rotate-180" : ""} ${mobile ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${mobile ? "right-0" : "right-0"} top-full mt-2 w-52 rounded-2xl bg-white border border-stone-100 shadow-xl shadow-black/8 z-50 overflow-hidden`}
          >
            <div className="px-4 py-3 border-b border-stone-100">
              <p className="text-[11px] text-muted-foreground/60 font-medium">Signed in as</p>
              <p className="text-[12px] font-semibold text-foreground truncate mt-0.5">{userEmail}</p>
            </div>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <div className="px-4 py-3 flex flex-col gap-2">
                <p className="text-[12px] text-foreground/70 font-medium leading-snug">
                  Sure you want to logout? Your plan will be removed.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={logoutUser}
                    className="flex-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1.5 transition-colors"
                  >
                    Yes, logout
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-foreground/70 text-xs font-bold py-1.5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

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
              <UserMenu />
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
              <UserMenu mobile />
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
