import { motion, AnimatePresence } from "framer-motion";
import { Flower2, Check, Infinity, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaywallModalProps {
  open: boolean;
}

export default function PaywallModal({ open }: PaywallModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-orange-900/10 overflow-hidden border border-orange-100">

              {/* Header */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 px-8 pt-10 pb-8 text-center border-b border-orange-100">
                <div className="w-14 h-14 rounded-full bg-white border border-orange-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <Flower2 className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2 leading-tight">
                  Continue Your Journey<br />with GitaVerse
                </h2>
                <p className="text-sm text-foreground/60 font-medium leading-relaxed">
                  Unlock unlimited guidance inspired by Bhagavad Gita
                </p>
              </div>

              {/* Plans */}
              <div className="px-8 py-6 flex flex-col gap-4">

                {/* Free Plan */}
                <div className="rounded-2xl border border-border/60 p-5 bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Free</span>
                    <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full font-medium">Current Plan</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground/70">
                    <MessageCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">5 messages / day</span>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="rounded-2xl border-2 border-primary/30 p-5 bg-gradient-to-br from-orange-50/60 to-amber-50/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-bl-xl">
                    Premium
                  </div>
                  <div className="mb-4">
                    <span className="text-sm font-semibold text-primary uppercase tracking-wider">GitaVerse Premium</span>
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {[
                      { icon: Infinity, text: "Unlimited chat" },
                      { icon: Zap,      text: "Deeper Gita insights" },
                      { icon: Check,    text: "Priority responses" },
                    ].map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground/80 font-medium">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <div className="px-8 pb-8">
                <Button
                  className="w-full rounded-2xl h-13 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-orange-900/15 transition-transform active:scale-[0.98]"
                >
                  Upgrade Now
                </Button>
                <p className="text-center text-[11px] text-muted-foreground/60 mt-3 font-medium">
                  Cancel anytime · Secure payment
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
