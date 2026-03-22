import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";
import { Sparkles, MessageSquare, ArrowRight, Loader2, BookOpen, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import CalmMode from "@/components/CalmMode";
import EmailCaptureModal, { hasEmailCaptured, hasEmailDismissed } from "@/components/EmailCaptureModal";
import { useLanguage } from "@/contexts/LanguageContext";
import heroLotus from "@/assets/hero-lotus.png";

const MOODS = [
  { emoji: "😔", label: "Stressed",  prompt: "I feel stressed and overwhelmed" },
  { emoji: "😕", label: "Confused",  prompt: "I feel confused about my life decisions" },
  { emoji: "😡", label: "Angry",     prompt: "How to control anger" },
  { emoji: "😞", label: "Sad",       prompt: "I feel low and unmotivated" },
  { emoji: "😌", label: "Peaceful",  prompt: "How to maintain inner peace" },
];

const LIFE_AREAS = [
  {
    emoji: "💼",
    label: "Career",
    questions: [
      "I feel lost in my career",
      "How to choose the right path in life",
      "How to stay motivated at work",
      "Should I quit my job and follow my passion?",
    ],
  },
  {
    emoji: "❤️",
    label: "Relationships",
    questions: [
      "How to deal with a difficult relationship",
      "How to forgive someone who hurt me",
      "How to let go of someone I love",
      "How to build stronger bonds with family",
    ],
  },
  {
    emoji: "🧠",
    label: "Mind",
    questions: [
      "How to stop overthinking",
      "How to control anxiety and fear",
      "My mind is never at peace — what to do?",
      "How to build self-confidence",
    ],
  },
  {
    emoji: "🧘",
    label: "Peace",
    questions: [
      "How to find inner peace",
      "How to maintain calm in difficult situations",
      "How to detach from outcomes",
      "What is the meaning of true happiness?",
    ],
  },
  {
    emoji: "💰",
    label: "Money",
    questions: [
      "How to overcome financial stress",
      "What does Gita say about wealth and greed?",
      "How to stop worrying about money",
      "How to build a balanced approach to success",
    ],
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [isStarting, setIsStarting] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [calmOpen, setCalmOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const { t } = useLanguage();

  // Exit intent — show email capture when cursor leaves to top of page
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasEmailCaptured() && !hasEmailDismissed()) {
        setIsEmailOpen(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

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
      <div className="relative z-10 flex-1 flex items-center justify-center py-12 px-6 sm:px-8">
        <div className="w-full max-w-6xl flex flex-col items-center">

          {/* Hero: two-column on desktop, stacked on mobile */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-4">

            {/* Left: text content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50/90 backdrop-blur-sm border border-orange-200/60 text-orange-800 text-sm font-medium mb-8 shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="tracking-wide">AI-Powered Vedic Wisdom</span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-5 drop-shadow-sm tracking-tight leading-none">
                Gita<span className="bg-gradient-to-br from-primary to-orange-400 bg-clip-text text-transparent">Verse</span>
              </h1>

              <p className="text-lg md:text-xl text-foreground/70 max-w-md mb-4 font-light leading-relaxed">
                Get clarity in life with Gita wisdom
              </p>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-50/70 border border-orange-200/50 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                <p className="text-sm text-orange-800/80 font-medium italic tracking-wide">
                  Not just AI — guidance inspired by the Bhagavad Gita
                </p>
              </div>
              <p className="text-base text-foreground/50 max-w-md mb-10 font-light leading-relaxed">
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
                <span className="font-bold tracking-wide">{t.askKrishnaBtn}</span>
                {!isStarting && <ArrowRight className="w-4 h-4 ml-3" />}
              </Button>

              {/* Social proof + trust */}
              <div className="flex flex-col items-center lg:items-start gap-2 mt-5">
                <p className="text-[13px] text-foreground/60 font-medium tracking-wide">
                  {t.joinUsers}
                </p>
                <p className="text-[11px] text-muted-foreground/50 font-light tracking-wide">
                  {t.notGenericAI}
                </p>
              </div>

              {/* Calm Mode button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                onClick={() => setCalmOpen(true)}
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-foreground/40 hover:text-primary hover:bg-orange-50/70 border border-transparent hover:border-orange-100 transition-all duration-300"
              >
                <Wind className="w-3.5 h-3.5" />
                {t.takeAPause}
              </motion.button>
            </motion.div>

            {/* Right: hero lotus image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative flex items-center justify-center order-first lg:order-last"
            >
              {/* Soft glow behind image */}
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-orange-200/40 via-amber-100/20 to-transparent blur-3xl scale-110" />

              {/* Floating ring decoration */}
              <div className="absolute w-[85%] h-[85%] rounded-full border border-orange-200/40 animate-[spin_30s_linear_infinite]" />
              <div className="absolute w-[70%] h-[70%] rounded-full border border-orange-100/30 animate-[spin_20s_linear_infinite_reverse]" />

              <img
                src={heroLotus}
                alt="Glowing lotus — symbol of clarity and wisdom"
                className="relative z-10 w-full max-w-[340px] lg:max-w-[420px] drop-shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Demo Video Section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mt-16 w-full max-w-3xl mx-auto"
          >
            {/* Section header */}
            <div className="text-center mb-7">
              <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-2">Product Demo</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight mb-3">
                See GitaVerse in Action
              </h2>
              <p className="text-sm text-foreground/50 max-w-md mx-auto font-light leading-relaxed">
                Watch how GitaVerse helps you get clarity in life using Bhagavad Gita wisdom.
              </p>
            </div>

            {/* Video embed container */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-orange-100 shadow-xl shadow-orange-900/8 bg-gradient-to-br from-stone-900 via-orange-950 to-stone-900">
              {/* 16:9 aspect ratio */}
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>

                {/* ── Swap this block with a real YouTube embed when ready ── */}
                {/* To use YouTube: replace the div below with:
                    <iframe
                      src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=0&rel=0"
                      title="GitaVerse Demo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                */}

                {/* Placeholder — remove once real video is added */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
                  {/* Subtle lotus watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] text-[160px] select-none pointer-events-none">🪷</div>

                  {/* Play button */}
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg hover:bg-white/20 transition-colors cursor-pointer group">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[18px] border-l-white/80 ml-1 group-hover:border-l-white transition-colors" />
                  </div>

                  {/* Text */}
                  <div className="relative z-10 text-center">
                    <p className="text-white/80 font-semibold text-base mb-1">Demo Video Coming Soon</p>
                    <p className="text-white/40 text-sm font-light">Your video will appear here</p>
                  </div>

                  {/* Bottom pill */}
                  <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 border border-white/10 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-[11px] text-white/50 font-medium tracking-wide">gitaverse.replit.app</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="text-center text-[11px] text-foreground/35 mt-3 font-light tracking-wide">
              No signup required to try · Free to start
            </p>
          </motion.div>

          {/* Mood-Based Guidance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-14 w-full"
          >
            <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest text-center mb-5">
              {t.howFeeling}
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

          {/* Daily Shloka */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
            className="mt-12 w-full"
          >
            <div className="relative rounded-3xl overflow-hidden border border-orange-100 bg-gradient-to-br from-orange-50/90 via-amber-50/60 to-stone-50/80 shadow-md shadow-orange-900/5 px-7 py-8 text-center">
              {/* Subtle lotus watermark */}
              <div className="absolute right-4 top-4 text-orange-200 text-5xl leading-none select-none pointer-events-none opacity-50">🕉</div>

              {/* Header */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <BookOpen className="w-3.5 h-3.5 text-primary/60" />
                <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">
                  {t.todaysGitaWisdom}
                </p>
              </div>

              {/* Shloka line */}
              <p className="text-2xl md:text-3xl font-bold text-foreground leading-snug mb-5 tracking-tight font-serif italic">
                "Apne karm par focus karo,<br className="hidden sm:block" /> results par nahi."
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 justify-center mb-5 opacity-25">
                <div className="h-px w-10 bg-foreground" />
                <div className="w-1 h-1 rounded-full bg-foreground" />
                <div className="h-px w-10 bg-foreground" />
              </div>

              {/* Explanation */}
              <p className="text-sm text-foreground/60 max-w-md mx-auto leading-relaxed mb-5 font-light">
                Bhagavad Gita sikhati hai ki jab hum apne actions par focus karte hain, tab stress kam hota hai.
              </p>

              {/* Reference */}
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/70 border border-orange-100 text-[11px] font-semibold text-primary/70 tracking-wide shadow-sm">
                <span className="w-1 h-1 rounded-full bg-primary/50 inline-block" />
                Bhagavad Gita · Chapter 2, Verse 47
              </span>
            </div>
          </motion.div>

          {/* Life Areas */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-12 w-full"
          >
            <h2 className="text-base font-semibold text-foreground/70 text-center mb-5 tracking-wide">
              {t.chooseTopic}
            </h2>

            {/* Category tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
              {LIFE_AREAS.map(({ emoji, label }) => {
                const isActive = selectedArea === label;
                return (
                  <motion.button
                    key={label}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedArea(isActive ? null : label)}
                    disabled={isStarting}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 disabled:opacity-50
                      ${isActive
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                        : "bg-white/80 text-foreground/70 border-orange-100 hover:border-orange-300 hover:bg-white hover:shadow-sm backdrop-blur-sm"
                      }`}
                  >
                    <span className="text-base leading-none">{emoji}</span>
                    <span>{label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Questions panel */}
            <AnimatePresence mode="wait">
              {selectedArea && (() => {
                const area = LIFE_AREAS.find(a => a.label === selectedArea)!;
                return (
                  <motion.div
                    key={selectedArea}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {area.questions.map((q, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.015, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStartChat(q)}
                        disabled={isStarting}
                        className="glass-card text-left px-5 py-4 rounded-2xl flex items-center justify-between group hover:bg-white/95 hover:shadow-md hover:border-orange-200 transition-all duration-300 disabled:opacity-50"
                      >
                        <span className="text-foreground/80 font-medium pr-3 leading-snug text-sm">{q}</span>
                        <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm shrink-0">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {calmOpen && <CalmMode onClose={() => setCalmOpen(false)} />}
      <EmailCaptureModal open={isEmailOpen} onClose={() => setIsEmailOpen(false)} />

    </PageLayout>
  );
}
