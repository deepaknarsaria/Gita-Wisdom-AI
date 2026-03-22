import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

type Phase = "inhale" | "exhale";

const PHASE_DURATION = 4; // seconds per phase

export default function CalmMode({ onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [countdown, setCountdown] = useState(PHASE_DURATION);
  const [elapsed, setElapsed] = useState(0); // total seconds elapsed
  const TOTAL = 60;

  useEffect(() => {
    const tick = setInterval(() => {
      setElapsed(e => {
        const next = e + 1;
        if (next >= TOTAL) {
          clearInterval(tick);
          onClose();
        }
        return next;
      });

      setCountdown(c => {
        if (c <= 1) {
          setPhase(p => (p === "inhale" ? "exhale" : "inhale"));
          return PHASE_DURATION;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [onClose]);

  const progress = ((TOTAL - elapsed) / TOTAL) * 100;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="calm-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-stone-50 via-amber-50/60 to-orange-50/40"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center text-foreground/30 hover:text-foreground/60 hover:bg-stone-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-stone-100">
          <motion.div
            className="h-full bg-orange-300/60"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.9, ease: "linear" }}
          />
        </div>

        <div className="flex flex-col items-center gap-10 px-8 text-center max-w-sm">

          {/* Instruction */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-col gap-2"
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary/50">Calm Mode</p>
            <h2 className="text-xl font-semibold text-foreground/70 leading-relaxed">
              Close your eyes. Take a deep breath.
            </h2>
          </motion.div>

          {/* Breathing circle */}
          <div className="relative flex items-center justify-center">
            {/* Outer pulse ring */}
            <motion.div
              animate={
                phase === "inhale"
                  ? { scale: 1.45, opacity: 0.18 }
                  : { scale: 1.0, opacity: 0.08 }
              }
              transition={{ duration: PHASE_DURATION - 0.3, ease: "easeInOut" }}
              className="absolute w-44 h-44 rounded-full bg-orange-300"
            />
            {/* Middle ring */}
            <motion.div
              animate={
                phase === "inhale"
                  ? { scale: 1.25, opacity: 0.25 }
                  : { scale: 1.0, opacity: 0.12 }
              }
              transition={{ duration: PHASE_DURATION - 0.3, ease: "easeInOut" }}
              className="absolute w-44 h-44 rounded-full bg-orange-200"
            />
            {/* Core circle */}
            <motion.div
              animate={
                phase === "inhale"
                  ? { scale: 1.12, backgroundColor: "hsl(30 90% 72%)" }
                  : { scale: 0.88, backgroundColor: "hsl(30 60% 82%)" }
              }
              transition={{ duration: PHASE_DURATION - 0.3, ease: "easeInOut" }}
              className="relative w-44 h-44 rounded-full bg-orange-300 flex flex-col items-center justify-center shadow-lg shadow-orange-200/50"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-white/90 text-[13px] font-bold uppercase tracking-widest">
                    {phase === "inhale" ? "Inhale" : "Exhale"}
                  </span>
                  <span className="text-white text-4xl font-light mt-1">{countdown}</span>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Breathing guide text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-sm text-foreground/45 font-light leading-relaxed tracking-wide"
          >
            Inhale for 4 seconds… Exhale for 4 seconds…
          </motion.p>

          {/* Gita quote */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-3 opacity-20 mb-1">
              <div className="h-px w-8 bg-foreground" />
              <span className="text-sm">🕉</span>
              <div className="h-px w-8 bg-foreground" />
            </div>
            <p className="text-base font-medium text-foreground/60 italic leading-relaxed">
              "Shanti andar se aati hai, bahar se nahi."
            </p>
            <p className="text-[11px] font-semibold text-primary/40 uppercase tracking-widest">
              — Bhagavad Gita
            </p>
          </motion.div>

          {/* Timer hint */}
          <p className="text-[11px] text-foreground/25 tracking-wide">
            {Math.max(0, TOTAL - elapsed)}s remaining · press ✕ to exit
          </p>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
