import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { openEmailPopup } from "@/lib/emailPopup";
import { LogOut, ChevronDown, Sparkles, TrendingUp } from "lucide-react";

function logoutUser() {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("plan");
  localStorage.removeItem("chatLimit");
  localStorage.removeItem("chatsUsed");
  localStorage.removeItem("expiryDate");
  localStorage.removeItem("gitaverse_visited");
  localStorage.removeItem("gitaverse_email");
  localStorage.removeItem("gitaverse_email_dismissed");
  window.location.reload();
}

function formatExpiry(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

interface UserMenuProps {
  email: string;
  mobile?: boolean;
}

function UserMenu({ email, mobile = false }: UserMenuProps) {
  const [, setLocation] = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Read plan data fresh on each render
  const plan = localStorage.getItem("plan") || "free";
  const chatLimitRaw = localStorage.getItem("chatLimit");
  const chatsUsed = parseInt(localStorage.getItem("chatsUsed") || "0", 10);
  const expiryDate = localStorage.getItem("expiryDate");

  const isPremium = chatLimitRaw === "unlimited";
  const limit = isPremium ? null : parseInt(chatLimitRaw || "5", 10);
  const pct = limit ? Math.min((chatsUsed / limit) * 100, 100) : 0;
  const isNearLimit = pct >= 80;

  const planLabel: Record<string, string> = {
    free: "Free Plan",
    basic: "Basic Plan",
    pro: "Pro Plan",
    premium: "Premium Plan",
  };

  const planBadge: Record<string, string> = {
    free: "bg-stone-100 text-stone-500",
    basic: "bg-blue-100 text-blue-700",
    pro: "bg-orange-100 text-primary",
    premium: "bg-amber-100 text-amber-700",
  };

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

  const handleUpgrade = () => {
    setShowMenu(false);
    setLocation("/");
    setTimeout(() => {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => { setShowMenu(p => !p); setShowConfirm(false); }}
        className={`flex items-center gap-1 font-medium text-foreground/70 hover:text-foreground transition-colors ${mobile ? "text-xs max-w-[120px]" : "text-sm max-w-[200px]"}`}
      >
        <span className="truncate">Hi, {mobile ? email.split("@")[0] : email}</span>
        <ChevronDown className={`shrink-0 transition-transform duration-200 ${showMenu ? "rotate-180" : ""} ${mobile ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white border border-stone-100 shadow-xl shadow-black/10 z-50 overflow-hidden"
          >
            {/* User email header */}
            <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/50 px-5 py-4 border-b border-orange-100/60">
              <p className="text-[10px] text-muted-foreground/55 font-medium uppercase tracking-wider mb-0.5">Signed in as</p>
              <p className="text-[13px] font-semibold text-foreground truncate">{email}</p>
            </div>

            {/* Plan details */}
            <div className="px-5 py-4 border-b border-stone-100 flex flex-col gap-3">

              {/* Plan name + badge */}
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-bold text-foreground">
                  {planLabel[plan] ?? "Free Plan"}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${planBadge[plan] ?? planBadge.free}`}>
                  {plan}
                </span>
              </div>

              {/* Usage */}
              {isPremium ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-[12px] text-foreground/60 font-medium">Unlimited Access</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-foreground/50 font-medium">Messages used</span>
                    <span className={`text-[11px] font-bold tabular-nums ${isNearLimit ? "text-red-500" : "text-foreground/70"}`}>
                      {chatsUsed} / {limit}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isNearLimit ? "bg-red-400" : "bg-gradient-to-r from-primary to-orange-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {isNearLimit && (
                    <p className="text-[10px] text-red-400 font-medium">
                      {limit! - chatsUsed <= 0 ? "Limit reached — upgrade to continue" : `${limit! - chatsUsed} message${limit! - chatsUsed === 1 ? "" : "s"} remaining`}
                    </p>
                  )}
                </div>
              )}

              {/* Expiry */}
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                <span className="text-[11px] text-foreground/40 font-medium">
                  {expiryDate
                    ? `Valid till: ${formatExpiry(expiryDate)}`
                    : plan === "free"
                    ? "Free plan · Upgrade for more"
                    : "Active plan"}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-5 py-3.5 flex flex-col gap-2">
              {!showConfirm ? (
                <>
                  {plan !== "premium" && (
                    <button
                      onClick={handleUpgrade}
                      className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white text-[13px] font-semibold py-2.5 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-orange-900/15"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Upgrade Plan
                    </button>
                  )}
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-[13px] font-medium text-foreground/55 py-2.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <p className="text-[12px] text-foreground/55 font-medium text-center leading-snug">
                    Sure you want to logout? Your plan will be reset.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={logoutUser}
                      className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 transition-colors"
                    >
                      Yes, logout
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-foreground/60 text-xs font-bold py-2 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppHeader() {
  const [location, setLocation] = useLocation();
  const { language, setLanguage } = useLanguage();
  const [userEmail, setUserEmail] = useState<string | null>(() => localStorage.getItem("userEmail"));

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

  const navLink = (label: string, path: string) => {
    const isActive = location === path;
    return (
      <button
        onClick={() => setLocation(path)}
        className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
          isActive ? "text-primary" : "text-foreground/60 hover:text-foreground"
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
            <UserMenu email={userEmail} />
          ) : (
            <Button
              size="sm"
              onClick={() => openEmailPopup()}
              className="rounded-full h-9 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold shadow-sm shadow-orange-900/15 transition-transform active:scale-[0.97]"
            >
              Login / Signup
            </Button>
          )}
        </nav>

        {/* Mobile menu */}
        <div className="sm:hidden flex items-center gap-2">
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
            <UserMenu email={userEmail} mobile />
          ) : (
            <button
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors px-2 py-1"
              onClick={() => openEmailPopup()}
            >
              Login / Signup
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
