import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Flower2, Flame, Heart, Compass, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const PRINCIPLES = [
  { icon: Flame,   label: "Karma",      desc: "Right action without attachment to outcomes." },
  { icon: Compass, label: "Dharma",     desc: "Living in alignment with your true purpose and duty." },
  { icon: Shield,  label: "Discipline", desc: "Building a focused, steady mind through consistent effort." },
  { icon: Heart,   label: "Detachment", desc: "Acting fully while releasing the grip of results." },
];

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <PageLayout>
      {/* Ambient background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_hsl(42_60%_98%),_hsl(42_40%_95%))] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 sm:px-8 py-16 md:py-24">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200 flex items-center justify-center mb-6 shadow-sm">
            <Flower2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
            About GitaVerse
          </h1>
          <div className="w-12 h-0.5 bg-primary/30 rounded-full mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-6 text-foreground/75 text-[17px] leading-[1.85] mb-14"
        >
          <p>
            GitaVerse is an AI-powered life guidance platform inspired by the timeless wisdom of the{" "}
            <span className="text-foreground font-medium">Bhagavad Gita</span>.
          </p>
          <p>
            Our goal is to help people find clarity in life, overcome stress, and make better decisions
            using practical insights from Gita teachings.
          </p>
          <p>
            Unlike generic AI tools, GitaVerse focuses on real-life problems and provides guidance
            based on principles like <span className="text-foreground font-medium">karma, dharma, discipline,</span> and{" "}
            <span className="text-foreground font-medium">detachment</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6 text-center">
            Core Principles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PRINCIPLES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-2xl border border-orange-100 bg-white/70 backdrop-blur px-5 py-5 shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-0.5">{label}</p>
                  <p className="text-sm text-foreground/60 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-14 text-center"
        >
          <Button
            onClick={() => setLocation("/")}
            className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-white text-base font-medium shadow-md shadow-orange-900/10"
          >
            Start Your Journey
          </Button>
        </motion.div>

      </div>
    </PageLayout>
  );
}
