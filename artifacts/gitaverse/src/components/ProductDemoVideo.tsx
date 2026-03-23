import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENE_DURATIONS = [4000, 5000, 6000, 4000, 4000, 4000];

// Custom typewriter component
const TypewriterText = ({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          currentText += text[currentIndex];
          setDisplayedText(currentText);
          currentIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, 50); // 50ms per character
      
      return () => clearInterval(intervalId);
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [text, delay]);

  return <span className={className}>{displayedText}</span>;
};

export default function ProductDemoVideo() {
  const [currentScene, setCurrentScene] = useState(0);

  // Scene progression
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScene((prev) => (prev + 1) % SCENE_DURATIONS.length);
    }, SCENE_DURATIONS[currentScene]);

    return () => clearTimeout(timer);
  }, [currentScene]);

  // Persistent background orbs
  const orbs = [
    { id: 1, size: "15vw", x: "10vw", y: "20vh", duration: 8, delay: 0 },
    { id: 2, size: "25vw", x: "70vw", y: "60vh", duration: 12, delay: 2 },
    { id: 3, size: "10vw", x: "80vw", y: "15vh", duration: 10, delay: 5 },
    { id: 4, size: "20vw", x: "20vw", y: "70vh", duration: 15, delay: 1 },
  ];

  const brand = {
    primary: "#F97316",
    accent: "#FCD34D",
    bg: "#1C0A00",
    textLight: "#FEF3C7",
  };

  const fonts = {
    display: "'Cinzel', serif",
    body: "'Inter', sans-serif",
  };

  const renderScene = () => {
    switch (currentScene) {
      case 0: // Brand Opening
        return (
          <motion.div
            key="scene-0"
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              className="text-7xl md:text-9xl mb-6"
            >
              🪷
            </motion.div>
            <motion.h1
              style={{ fontFamily: fonts.display, color: brand.textLight }}
              className="text-5xl md:text-8xl font-bold tracking-wider mb-4 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              GitaVerse
            </motion.h1>
            <motion.p
              style={{ fontFamily: fonts.body, color: brand.accent }}
              className="text-lg md:text-2xl font-light tracking-widest text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              Ancient Wisdom. Modern Guidance.
            </motion.p>
          </motion.div>
        );

      case 1: // Problem: User Question
        return (
          <motion.div
            key="scene-1"
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="w-full max-w-2xl flex justify-start">
              <motion.div
                className="bg-stone-800 rounded-3xl rounded-tl-none p-6 shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: "#292524", color: brand.textLight }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
              >
                <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: brand.textLight, opacity: 0.3 }}></div>
                <p style={{ fontFamily: fonts.body }} className="text-xl md:text-3xl leading-relaxed font-light">
                  <TypewriterText text="I'm overwhelmed with stress at work. What should I do?" delay={1} />
                </p>
              </motion.div>
            </div>
          </motion.div>
        );

      case 2: // Krishna's Answer
        return (
          <motion.div
            key="scene-2"
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Show previous bubble faded in background for context */}
            <div className="w-full max-w-3xl flex justify-start mb-8 opacity-40 transform scale-95 origin-left">
              <div className="bg-stone-800 rounded-3xl rounded-tl-none p-4" style={{ backgroundColor: "#292524", color: brand.textLight }}>
                <p style={{ fontFamily: fonts.body }} className="text-lg md:text-xl">I'm overwhelmed with stress at work. What should I do?</p>
              </div>
            </div>

            <div className="w-full max-w-3xl flex justify-end">
              <motion.div
                className="rounded-3xl rounded-tr-none p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md"
                style={{ 
                  background: `linear-gradient(135deg, ${brand.primary} 0%, #B45309 100%)`, 
                  color: brand.textLight 
                }}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.5 }}
              >
                <motion.div 
                  className="absolute inset-0 opacity-30 mix-blend-overlay"
                  animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🦚</span>
                  <span style={{ fontFamily: fonts.display }} className="text-lg md:text-xl font-bold tracking-wider">Krishna AI</span>
                </div>
                
                <p style={{ fontFamily: fonts.body }} className="text-xl md:text-3xl leading-relaxed font-medium text-white shadow-sm">
                  <TypewriterText text="Karm karo, result ki chinta mat karo. Bhagavad Gita 2.47 — Tu sirf apna karm kar, fal ki chinta mat kar. Focus on your actions, not the outcome." delay={1.2} />
                </p>
              </motion.div>
            </div>
          </motion.div>
        );

      case 3: // Feature: Daily Wisdom
        return (
          <motion.div
            key="scene-3"
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="px-4 py-1 rounded-full mb-8 border border-amber-500/30"
              style={{ backgroundColor: `${brand.accent}20`, color: brand.accent, fontFamily: fonts.display }}
            >
              Daily Shloka
            </motion.div>
            
            <motion.div
              className="w-full max-w-4xl p-10 md:p-16 rounded-3xl relative overflow-hidden backdrop-blur-xl border border-white/10"
              style={{ backgroundColor: "rgba(28, 10, 0, 0.6)", color: brand.textLight, perspective: 1000 }}
              initial={{ rotateX: 45, opacity: 0, z: -100 }}
              animate={{ rotateX: 0, opacity: 1, z: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.6 }}
            >
              <motion.div 
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 50%, ${brand.primary}30 0%, transparent 70%)` }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <p style={{ fontFamily: fonts.display }} className="text-3xl md:text-6xl text-center leading-tight relative z-10 font-bold text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-orange-500">
                "Yoga karo, sukh-dukh mein sama raho."
              </p>
            </motion.div>
          </motion.div>
        );

      case 4: // Feature: Plans
        return (
          <motion.div
            key="scene-4"
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
            initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
            animate={{ clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)" }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.h2
              style={{ fontFamily: fonts.display, color: brand.textLight }}
              className="text-4xl md:text-6xl mb-12 font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Choose Your Path
            </motion.h2>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-5xl justify-center items-center">
              {[
                { name: "Basic", price: "₹199", color: "#9CA3AF", delay: 0.8 },
                { name: "Pro", price: "₹299", color: brand.primary, delay: 1.0, popular: true },
                { name: "Premium", price: "₹399", color: brand.accent, delay: 1.2 },
              ].map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, delay: plan.delay }}
                  className={`w-full md:w-1/3 p-8 rounded-3xl border flex flex-col items-center relative overflow-hidden backdrop-blur-md ${plan.popular ? 'scale-110 md:scale-110 z-20' : 'scale-100 z-10'}`}
                  style={{ 
                    backgroundColor: "rgba(28, 10, 0, 0.8)", 
                    borderColor: plan.popular ? brand.primary : 'rgba(255,255,255,0.1)',
                    boxShadow: plan.popular ? `0 0 30px ${brand.primary}40` : 'none'
                  }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 w-full py-1 text-center text-xs font-bold uppercase tracking-widest bg-orange-600 text-white" style={{ fontFamily: fonts.body }}>
                      Most Popular
                    </div>
                  )}
                  <h3 style={{ fontFamily: fonts.display, color: plan.color }} className="text-2xl mt-4 mb-2 font-bold">{plan.name}</h3>
                  <div style={{ fontFamily: fonts.body, color: brand.textLight }} className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg opacity-50 font-normal">/mo</span></div>
                  <div className="w-full h-px bg-white/10 mb-6"></div>
                  <div className="w-full h-10 rounded-full bg-white/5 mt-auto"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 5: // CTA Closing
        return (
          <motion.div
            key="scene-5"
            className="absolute inset-0 flex flex-col items-center justify-center z-10 overflow-hidden"
            initial={{ opacity: 0, filter: "brightness(0)" }}
            animate={{ opacity: 1, filter: "brightness(1)" }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at 50% 50%, ${brand.accent}40 0%, transparent 60%)` }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            />
            
            <div className="relative z-20 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                transition={{ duration: 1.5, type: "spring" }}
                className="text-8xl md:text-[150px] mb-8 drop-shadow-[0_0_30px_rgba(252,211,77,0.8)]"
              >
                🪷
              </motion.div>
              
              <motion.h2
                style={{ fontFamily: fonts.display, color: brand.textLight }}
                className="text-6xl md:text-8xl font-bold tracking-widest mb-6 text-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                Ask Krishna Now
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="px-8 py-4 rounded-full border-2 bg-black/30 backdrop-blur-xl"
                style={{ borderColor: brand.accent, color: brand.accent, fontFamily: fonts.body }}
              >
                <span className="text-2xl md:text-3xl font-light tracking-widest">gitaverse.replit.app</span>
              </motion.div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden" 
      style={{ backgroundColor: brand.bg }}
    >
      {/* Persistent Background Elements (Outside AnimatePresence) */}
      <div className="absolute inset-0 opacity-20 mix-blend-screen overflow-hidden pointer-events-none">
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full blur-3xl"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${brand.accent} 0%, ${brand.primary} 50%, transparent 100%)`,
            }}
            animate={{
              x: [orb.x, `calc(${orb.x} + ${Math.random() * 20 - 10}vw)`, orb.x],
              y: [orb.y, `calc(${orb.y} + ${Math.random() * 20 - 10}vh)`, orb.y],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-0" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />

      {/* Global Background Gradient reacting to scene */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{
          background: currentScene === 5 
            ? `radial-gradient(circle at 50% 50%, ${brand.primary}40 0%, transparent 70%)` 
            : currentScene === 2
            ? `radial-gradient(circle at 100% 50%, ${brand.primary}20 0%, transparent 70%)`
            : `radial-gradient(circle at 50% 0%, ${brand.accent}10 0%, transparent 60%)`
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Scene Content */}
      <AnimatePresence mode="wait">
        {renderScene()}
      </AnimatePresence>
    </div>
  );
}
