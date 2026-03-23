import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Flower2, Zap, MessageCircle, Infinity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaywallModalProps {
  open: boolean;
  onUpgrade: () => void;
  onClose?: () => void;
}

const PLANS = [
  {
    key: "basic",
    label: "Basic",
    price: "₹199",
    chats: "50 chats",
    icon: MessageCircle,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    key: "pro",
    label: "Pro",
    price: "₹299",
    chats: "150 chats",
    icon: Zap,
    color: "text-primary",
    bg: "bg-orange-50",
    border: "border-orange-200",
    highlight: true,
  },
  {
    key: "premium",
    label: "Premium",
    price: "₹399",
    chats: "Unlimited",
    icon: Infinity,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-300",
  },
];

function PaywallContent({ onUpgrade, onClose }: { onUpgrade: () => void; onClose?: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(5px)",
          cursor: "pointer",
        }}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.93, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 28 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
        }}
      >
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-orange-900/15 overflow-hidden border border-orange-100">

          {/* Header */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50/60 px-8 pt-9 pb-7 text-center border-b border-orange-100/60">
            <div className="w-13 h-13 rounded-full bg-white border border-orange-200 flex items-center justify-center mx-auto mb-4 shadow-sm w-12 h-12">
              <Flower2 className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-1.5 leading-tight">
              Continue Your Journey<br />with GitaVerse
            </h2>
            <p className="text-[13px] text-foreground/55 font-medium">
              You've used your free messages. Choose a plan to continue.
            </p>
          </div>

          {/* Plans */}
          <div className="px-6 pt-5 pb-3 flex flex-col gap-3">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.key}
                  className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 ${
                    plan.highlight
                      ? "border-primary/30 bg-gradient-to-r from-orange-50/80 to-amber-50/50"
                      : `${plan.border} ${plan.bg}/50`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${plan.bg} shrink-0`}>
                      <Icon className={`w-4 h-4 ${plan.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{plan.label}</span>
                        {plan.highlight && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-primary px-1.5 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-foreground/50 font-medium">{plan.chats}</span>
                    </div>
                  </div>
                  <span className={`text-base font-extrabold ${plan.color}`}>{plan.price}</span>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="px-6 pb-7 pt-2">
            <Button
              onClick={onUpgrade}
              className="w-full rounded-2xl h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-orange-900/15 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              View Plans & Pay
              <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-center text-[11px] text-muted-foreground/50 mt-3 font-medium">
              Secure payment via Razorpay · Instant activation
            </p>
          </div>

        </div>
      </motion.div>
    </>
  );
}

export default function PaywallModal({ open, onUpgrade, onClose }: PaywallModalProps) {
  return createPortal(
    <AnimatePresence>{open && <PaywallContent onUpgrade={onUpgrade} onClose={onClose} />}</AnimatePresence>,
    document.body
  );
}
