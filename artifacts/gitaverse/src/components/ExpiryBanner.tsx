import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, RefreshCw, X } from "lucide-react";

export type ExpiryStatus =
  | { kind: "expiring"; daysLeft: number }
  | { kind: "expired" }
  | null;

export function checkAndHandleExpiry(): ExpiryStatus {
  const expiryRaw = localStorage.getItem("expiryDate");
  const plan = localStorage.getItem("plan");

  if (!expiryRaw || plan === "free" || !plan) return null;

  const expiry = new Date(expiryRaw);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    // Auto-reset to free plan
    localStorage.setItem("plan", "free");
    localStorage.setItem("chatLimit", "5");
    localStorage.setItem("chatsUsed", "0");
    localStorage.removeItem("expiryDate");
    return { kind: "expired" };
  }

  if (daysLeft <= 3) {
    return { kind: "expiring", daysLeft };
  }

  return null;
}

interface ExpiryBannerProps {
  status: ExpiryStatus;
  onDismiss: () => void;
}

export default function ExpiryBanner({ status, onDismiss }: ExpiryBannerProps) {
  const [, setLocation] = useLocation();

  const handleRenew = () => {
    onDismiss();
    setLocation("/");
    setTimeout(() => {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const isExpired = status?.kind === "expired";
  const daysLeft = status?.kind === "expiring" ? status.daysLeft : 0;

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className={`relative z-40 w-full px-4 py-3 flex items-center justify-between gap-3 ${
            isExpired
              ? "bg-red-500 text-white"
              : "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
          }`}
        >
          {/* Left: icon + message */}
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertTriangle className="w-4 h-4 shrink-0 opacity-90" />
            <p className="text-[13px] font-medium leading-snug truncate">
              {isExpired
                ? "Your plan has expired. Upgrade to continue your Gita journey."
                : daysLeft === 1
                ? "Your plan expires tomorrow! Renew now to keep uninterrupted guidance."
                : `Your plan expires in ${daysLeft} days. Renew to continue uninterrupted guidance.`}
            </p>
          </div>

          {/* Right: CTA + dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRenew}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all active:scale-95 ${
                isExpired
                  ? "bg-white text-red-600 hover:bg-red-50"
                  : "bg-white text-orange-600 hover:bg-orange-50"
              }`}
            >
              <RefreshCw className="w-3 h-3" />
              Renew Plan
            </button>
            <button
              onClick={onDismiss}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
