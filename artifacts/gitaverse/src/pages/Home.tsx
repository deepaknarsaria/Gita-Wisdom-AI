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
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/50 border border-orange-200 text-orange-800 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Vedic Wisdom</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-6 drop-shadow-sm">
            Gita<span className="text-primary">Verse</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-sans font-light leading-relaxed">
            Find clarity, peace, and purpose. Receive timeless guidance inspired by the Bhagavad Gita for your modern life.
          </p>

          <Button 
            size="lg" 
            className="rounded-full px-8 py-7 text-lg font-semibold bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-500 shadow-xl shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300"
            onClick={() => handleStartChat()}
            disabled={isStarting}
          >
            {isStarting ? (
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <MessageSquare className="w-6 h-6 mr-2" />
            )}
            Start Your Journey
            {!isStarting && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-20 w-full max-w-3xl"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-center mb-6">
            Or seek guidance on
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStartChat(prompt)}
                disabled={isStarting}
                className="glass-card text-left px-6 py-4 rounded-2xl flex items-center justify-between group hover:bg-white transition-all duration-300 disabled:opacity-50"
              >
                <span className="text-foreground font-medium pr-4">{prompt}</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
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
