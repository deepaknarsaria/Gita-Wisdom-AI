import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { Sparkles, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const MOODS = [
  { emoji: "😔", label: "Stressed",  prompt: "I feel stressed and overwhelmed" },
  { emoji: "😕", label: "Confused",  prompt: "I feel confused about my life decisions" },
  { emoji: "😡", label: "Angry",     prompt: "How to control anger" },
  { emoji: "😞", label: "Sad",       prompt: "I feel low and unmotivated" },
  { emoji: "😌", label: "Peaceful",  prompt: "How to maintain inner peace" },
];

const SUGGESTED_PROMPTS = [
  "I feel lost in my career",
  "How to handle stress and anxiety?",
  "How to stop overthinking?",
  "What is the true purpose of life?"
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [isStarting, setIsStarting] = useState(false);
  const createConversation = useCreateOpenaiConversation();

  const handleStartChat = async (prompt?: string) => {
    try {
      setIsStarting(true);
      const conv = await createConversation.mutateAsync({
        data: { title: prompt ? `Guidance: ${prompt.slice(0, 20)}...` : "New Session" }
      });
      const url = `/chat?id=${conv.id}${prompt ? `&prompt=${encodeURIComponent(prompt)}` : ""}`;
      setLocation(url);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      setIsStarting(false);
    }
  };

  return (
    <PageLayout className="overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Ethereal background"
          className="w-full h-full object-cover opacity-[0.35] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/75 to-background" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-16 px-6 sm:px-8">
        <div className="w-full max-w-3xl flex flex-col items-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center w-full"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50/90 backdrop-blur-sm border border-orange-200/60 text-orange-800 text-sm font-medium mb-10 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="tracking-wide">AI-Powered Vedic Wisdom</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-6 drop-shadow-sm tracking-tight leading-none">
              Gita<span className="bg-gradient-to-br from-primary to-orange-400 bg-clip-text text-transparent">Verse</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 max-w-xl mx-auto mb-4 font-light leading-relaxed">
              Get clarity in life with Gita wisdom
            </p>

            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-50/70 border border-orange-200/50 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              <p className="text-sm text-orange-800/80 font-medium italic tracking-wide">
                Not just AI — guidance inspired by the Bhagavad Gita
              </p>
            </div>
            <p className="text-base text-foreground/50 max-w-lg mx-auto mb-12 font-light leading-relaxed">
              Find peace, purpose, and practical guidance — inspired by timeless Bhagavad Gita teachings.
            </p>

            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg font-medium bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-500 shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => handleStartChat()}
              disabled={isStarting}
            >
              {isStarting ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <MessageSquare className="w-5 h-5 mr-3" />
              )}
              Start Chatting
              {!isStarting && <ArrowRight className="w-4 h-4 ml-3" />}
            </Button>
          </motion.div>

          {/* Mood-Based Guidance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-14 w-full"
          >
            <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest text-center mb-5">
              How are you feeling today?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {MOODS.map(({ emoji, label, prompt }) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStartChat(prompt)}
                  disabled={isStarting}
                  className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 border border-orange-100 shadow-sm hover:bg-white hover:border-orange-300 hover:shadow-md transition-all duration-200 disabled:opacity-50 backdrop-blur-sm"
                >
                  <span className="text-xl leading-none">{emoji}</span>
                  <span className="text-sm font-semibold text-foreground/75">{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Suggested Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-14 w-full"
          >
            <div className="flex items-center justify-center gap-4 mb-7 opacity-60">
              <div className="h-px bg-border flex-1 max-w-[50px]" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Or seek guidance on
              </p>
              <div className="h-px bg-border flex-1 max-w-[50px]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartChat(prompt)}
                  disabled={isStarting}
                  className="glass-card text-left px-5 py-4 rounded-2xl flex items-center justify-between group hover:bg-white/95 hover:shadow-md hover:border-orange-200 transition-all duration-300 disabled:opacity-50"
                >
                  <span className="text-foreground/80 font-medium pr-3 leading-snug text-sm">{prompt}</span>
                  <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

    </PageLayout>
  );
}
