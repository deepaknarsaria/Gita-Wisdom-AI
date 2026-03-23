import { createPortal } from "react-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2, Mail, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "gitaverse_email";
const DISMISSED_KEY = "gitaverse_email_dismissed";

export function hasEmailCaptured(): boolean {
  return !!localStorage.getItem(STORAGE_KEY);
}

export function hasEmailDismissed(): boolean {
  return !!localStorage.getItem(DISMISSED_KEY);
}

interface EmailCaptureModalProps {
  open: boolean;
  onClose: () => void;
}

function EmailCaptureContent({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    localStorage.setItem(STORAGE_KEY, trimmed);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="email-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleDismiss}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.40)",
          backdropFilter: "blur(4px)",
          cursor: "pointer",
        }}
      />

      {/* Modal */}
      <motion.div
        key="email-modal"
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          pointerEvents: "none",
        }}
      >
        <div
          className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl shadow-orange-900/10 overflow-hidden"
          style={{ pointerEvents: "auto" }}
        >
          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-foreground/40 hover:text-foreground/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 px-7 pt-8 pb-6 text-center border-b border-orange-100/60">
                  <div className="w-12 h-12 rounded-full bg-white border border-orange-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Flower2 className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground leading-tight mb-2">
                    Get Deeper Gita Guidance
                  </h2>
                  <p className="text-sm text-foreground/60 font-medium leading-relaxed">
                    Enter your email to save your progress and receive wisdom updates.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-7 pt-6 pb-8 flex flex-col gap-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="Your email address"
                      autoFocus
                      className="w-full rounded-2xl border border-orange-200 bg-orange-50/30 pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                    {error && (
                      <p className="text-xs text-red-500 mt-1.5 pl-1">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-2xl py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md shadow-orange-900/15 transition-transform active:scale-[0.98]"
                  >
                    Continue
                  </Button>

                  <p className="text-center text-[11px] text-muted-foreground/50 font-light">
                    No spam · Unsubscribe anytime · Inspired by Bhagavad Gita
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center px-8 py-16 text-center gap-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg shadow-orange-900/20"
                >
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <p className="font-display text-xl font-bold text-foreground leading-tight">
                    You're on the list!
                  </p>
                  <p className="text-sm text-foreground/50 mt-2 leading-relaxed">
                    Daily Gita wisdom is on its way to your inbox. 🙏
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

export default function EmailCaptureModal({ open, onClose }: EmailCaptureModalProps) {
  return createPortal(
    <AnimatePresence>{open && <EmailCaptureContent onClose={onClose} />}</AnimatePresence>,
    document.body
  );
}
