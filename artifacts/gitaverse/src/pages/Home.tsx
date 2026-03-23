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
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
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

          {/* Hero: centered, minimal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full flex flex-col items-center text-center mb-4 pt-8 pb-2"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50/90 backdrop-blur-sm border border-orange-200/60 text-orange-800 text-sm font-medium mb-10 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="tracking-wide">AI-Powered Vedic Wisdom</span>
            </div>

            {/* Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-6 drop-shadow-sm tracking-tight leading-none">
              Gita<span className="bg-gradient-to-br from-primary to-orange-400 bg-clip-text text-transparent">Verse</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl md:text-2xl text-foreground/65 max-w-lg mb-5 font-light leading-relaxed">
              Get clarity in life with Gita wisdom
            </p>

            {/* Trust pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-50/70 border border-orange-200/50 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              <p className="text-sm text-orange-800/80 font-medium italic tracking-wide">
                Not just AI — guidance inspired by the Bhagavad Gita
              </p>
            </div>

            {/* Description */}
            <p className="text-base text-foreground/45 max-w-md mb-12 font-light leading-relaxed">
              Find peace, purpose, and practical guidance — inspired by timeless Bhagavad Gita teachings.
            </p>

            {/* CTA */}
            <Button
              size="lg"
              className="rounded-full px-12 py-7 text-lg font-medium bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-500 shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
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
            <div className="flex flex-col items-center gap-2 mt-6">
              <p className="text-[13px] text-foreground/55 font-medium tracking-wide">
                {t.joinUsers}
              </p>
              <p className="text-[11px] text-muted-foreground/45 font-light tracking-wide">
                {t.notGenericAI}
              </p>
            </div>

            {/* Calm Mode button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              onClick={() => setCalmOpen(true)}
              className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-foreground/35 hover:text-primary hover:bg-orange-50/70 border border-transparent hover:border-orange-100 transition-all duration-300"
            >
              <Wind className="w-3.5 h-3.5" />
              {t.takeAPause}
            </motion.button>
          </motion.div>

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

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-16 w-full"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-2">Trusted by Users</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
                What People Are Saying
              </h2>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  quote: "GitaVerse helped me reduce overthinking and focus on action.",
                  name: "Rahul",
                  role: "Student",
                  initial: "R",
                },
                {
                  quote: "I feel calmer after using this app daily.",
                  name: "Priya",
                  role: "Working Professional",
                  initial: "P",
                },
                {
                  quote: "The guidance feels practical and relatable.",
                  name: "Amit",
                  role: "Entrepreneur",
                  initial: "A",
                },
              ].map(({ quote, name, role, initial }) => (
                <motion.div
                  key={name}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex flex-col gap-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-100 shadow-md shadow-orange-900/5 px-6 py-6"
                >
                  {/* Quote mark */}
                  <span className="absolute top-4 right-5 text-4xl text-orange-200/70 font-serif leading-none select-none">"</span>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-sm text-foreground/70 leading-relaxed font-light flex-1">
                    "{quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2 border-t border-orange-50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground leading-none mb-0.5">{name}</p>
                      <p className="text-[11px] text-foreground/45 font-light">{role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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

          {/* Pricing Section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-16 w-full"
          >
            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-2">Simple Pricing</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight mb-3">
                Choose Your Path to Clarity
              </h2>
              <p className="text-sm text-foreground/50 font-light">
                Start free, upgrade for deeper Gita guidance
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

              {/* BASIC */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col rounded-2xl border border-orange-100 bg-white/80 backdrop-blur-sm shadow-sm shadow-orange-900/5 px-7 py-8"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-4">Basic</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-display font-bold text-foreground">₹199</span>
                </div>
                <p className="text-[11px] text-foreground/40 font-light mb-6">per 30 days</p>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {["50 chats / 30 days", "Standard guidance"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/65">
                      <span className="w-4 h-4 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-primary" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleStartChat()}
                  className="w-full py-3 rounded-full border-2 border-orange-200 text-primary text-sm font-semibold hover:bg-orange-50 transition-colors"
                >
                  Start Basic
                </button>
              </motion.div>

              {/* PRO — Most Popular */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col rounded-2xl border-2 border-primary bg-gradient-to-b from-orange-50/80 to-white/90 backdrop-blur-sm shadow-xl shadow-primary/10 px-7 py-8 relative"
              >
                {/* Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-orange-400 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                    Most Popular
                  </span>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Pro</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-display font-bold text-foreground">₹299</span>
                </div>
                <p className="text-[11px] text-foreground/40 font-light mb-6">per 30 days</p>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {["150 chats / 30 days", "Better structured answers", "Faster responses"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/75">
                      <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-primary" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleStartChat()}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-primary to-orange-400 text-white text-sm font-bold hover:from-primary/90 hover:to-orange-500 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                  Choose Pro
                </button>
              </motion.div>

              {/* PREMIUM — Best Value */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/60 to-white/90 backdrop-blur-sm shadow-md shadow-amber-900/8 px-7 py-8 relative"
              >
                {/* Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                    Best Value
                  </span>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-4">Premium</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-display font-bold text-foreground">₹399</span>
                </div>
                <p className="text-[11px] text-foreground/40 font-light mb-6">per 30 days</p>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {["Unlimited chats", "Deep Gita insights", "Priority responses"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/75">
                      <span className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-amber-600" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleStartChat()}
                  className="w-full py-3 rounded-full border-2 border-amber-400 text-amber-700 text-sm font-bold hover:bg-amber-50 transition-colors"
                >
                  Go Premium
                </button>
              </motion.div>

            </div>

            {/* Footer note */}
            <p className="text-center text-[11px] text-foreground/35 mt-5 font-light">
              No hidden fees · Cancel anytime · Payments secure
            </p>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-16 w-full max-w-2xl mx-auto pb-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-2">Got Questions?</p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            {/* Accordion items */}
            <div className="flex flex-col gap-3">
              {[
                {
                  q: "Is this based on Bhagavad Gita?",
                  a: "Yes, all guidance is inspired by Gita principles explained in a modern, practical way — making ancient wisdom relevant to everyday life.",
                },
                {
                  q: "Is this a religious app?",
                  a: "No. GitaVerse is a life guidance tool that draws from Gita wisdom to help with practical problems — stress, relationships, purpose, and decisions. It is for everyone.",
                },
                {
                  q: "Is it free to use?",
                  a: "You can start with free chats right away — no signup needed. Premium unlocks Deep Guidance Mode for a more in-depth, structured response.",
                },
                {
                  q: "Can I trust the advice?",
                  a: "GitaVerse is designed for self-reflection and clarity, not professional advice. Think of it as a wise friend sharing Gita-inspired perspective — the final decision is always yours.",
                },
              ].map(({ q, a }, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-orange-100 bg-white/80 backdrop-blur-sm overflow-hidden shadow-sm shadow-orange-900/4"
                >
                  <button
                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left group"
                  >
                    <span className="text-sm font-semibold text-foreground/85 leading-snug">
                      {q}
                    </span>
                    <motion.div
                      animate={{ rotate: faqOpen === idx ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-orange-50 group-hover:bg-primary/10 transition-colors"
                    >
                      <span className="text-primary text-lg leading-none font-light">+</span>
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {faqOpen === idx && (
                      <motion.div
                        key="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm text-foreground/60 leading-relaxed font-light border-t border-orange-50 pt-3">
                          {a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {calmOpen && <CalmMode onClose={() => setCalmOpen(false)} />}
      <EmailCaptureModal open={isEmailOpen} onClose={() => setIsEmailOpen(false)} />

    </PageLayout>
  );
}
