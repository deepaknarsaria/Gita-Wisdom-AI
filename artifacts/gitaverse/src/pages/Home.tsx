import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { Sparkles, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Ethereal background" 
          className="w-full h-full object-cover opacity-[0.35] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl px-6 sm:px-8 lg:px-12 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center w-full"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50/80 backdrop-blur-sm border border-orange-200/60 text-orange-800 text-sm font-medium mb-10 shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="tracking-wide">AI-Powered Vedic Wisdom</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-8 drop-shadow-sm tracking-tight">
            Gita<span className="text-primary bg-clip-text text-transparent bg-gradient-to-br from-primary to-orange-400">Verse</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-12 font-sans font-light leading-relaxed">
            Find clarity, peace, and purpose. Receive timeless guidance inspired by the Bhagavad Gita for your modern life.
          </p>

          <Button 
            size="lg" 
            className="rounded-full px-10 py-8 text-xl font-medium bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-500 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all duration-300"
            onClick={() => handleStartChat()}
            disabled={isStarting}
          >
            {isStarting ? (
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            ) : (
              <MessageSquare className="w-6 h-6 mr-3" />
            )}
            Start Your Journey
            {!isStarting && <ArrowRight className="w-5 h-5 ml-3" />}
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-24 w-full"
        >
          <div className="flex items-center justify-center gap-4 mb-8 opacity-70">
            <div className="h-px bg-border flex-1 max-w-[60px]"></div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest text-center">
              Or seek guidance on
            </p>
            <div className="h-px bg-border flex-1 max-w-[60px]"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartChat(prompt)}
                disabled={isStarting}
                className="glass-card text-left px-6 py-5 rounded-2xl flex items-center justify-between group hover:bg-white/95 hover:shadow-lg hover:border-orange-200 transition-all duration-300 disabled:opacity-50"
              >
                <span className="text-foreground/90 font-medium pr-4 leading-snug">{prompt}</span>
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
