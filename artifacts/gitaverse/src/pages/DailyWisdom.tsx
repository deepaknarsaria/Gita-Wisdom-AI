import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Flower2, ArrowLeft, BookOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const WISDOMS = [
  {
    quote: "Apne karm par focus karo, results par nahi.",
    explanation:
      "Bhagavad Gita humein sikhati hai ki jab hum apne actions par focus karte hain, tab stress kam hota hai aur clarity badhti hai. Result hamesha hamare haath mein nahi hota — lekin effort hamesha hota hai.",
    reference: "Bhagavad Gita, Chapter 2, Verse 47",
  },
  {
    quote: "Mann ko control karo — yahi sabse bada kaam hai.",
    explanation:
      "Krishna kehte hain ki jo apne mann ko saadh leta hai, uske liye duniya mein koi kaam mushkil nahi. Ek focused mind hi asal shakti hai.",
    reference: "Bhagavad Gita, Chapter 6",
  },
  {
    quote: "Attachment hi dukh ki jad hai — pyaar karo, pakdo mat.",
    explanation:
      "Gita detachment ka matlab nahi sikhati ki dil laga lo mat. Sikhati hai ki kisi bhi cheez ya insaan ko itna mat pakdo ki unka jaana tumhe toda de.",
    reference: "Bhagavad Gita, Chapter 12",
  },
  {
    quote: "Apna dharma chhodo mat, chahe rasta mushkil ho.",
    explanation:
      "Har insaan ka ek purpose hota hai. Gita kehti hai ki apna sach ka raasta nahi chodna chahiye — even when it's hard. Yahi asli strength hai.",
    reference: "Bhagavad Gita, Chapter 18",
  },
  {
    quote: "Daro mat — jo hua, sahi hua. Jo hoga, sahi hoga.",
    explanation:
      "Gita humein yaad dilati hai ki sab kuch ek badi planning ka hissa hai. Jab hum yeh samjhate hain, toh fear automatically kam ho jaata hai.",
    reference: "Bhagavad Gita, Chapter 2",
  },
  {
    quote: "Khud ko jaano — yahi sabse badi seekh hai.",
    explanation:
      "Krishna ne Arjun ko pehle khud ko samajhne ki baat ki. Jo insaan apni strengths aur weaknesses ko jaanta hai, woh decisions better leta hai.",
    reference: "Bhagavad Gita, Chapter 18",
  },
  {
    quote: "Har ek din ek naya mauka hai — waste mat karo.",
    explanation:
      "Gita sikhati hai ki waqt ki value karo. Har din mein chota action lena bhi ek bada change la sakta hai — bas shuru karo.",
    reference: "Bhagavad Gita, Chapter 6",
  },
];

function getDayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % WISDOMS.length;
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DailyWisdom() {
  const [, setLocation] = useLocation();
  const wisdom = WISDOMS[getDayIndex()];

  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_hsl(42_60%_98%),_hsl(42_40%_95%))] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full border-b border-orange-100/60 bg-white/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="text-2xl font-display font-bold tracking-tight text-foreground select-none hover:opacity-80 transition-opacity"
          >
            Gita<span className="text-primary">Verse</span>
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground hover:bg-orange-50 rounded-full px-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 md:py-20">
        <div className="w-full max-w-lg">

          {/* Label + date */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center text-center mb-10"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200 flex items-center justify-center mb-5 shadow-sm">
              <Flower2 className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Today's Wisdom
            </h1>
            <p className="text-xs text-muted-foreground/70 font-medium tracking-wide">
              {formatDate()}
            </p>
          </motion.div>

          {/* Wisdom card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-[2rem] border border-orange-100 shadow-xl shadow-orange-900/6 overflow-hidden"
          >
            {/* Quote section */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 px-8 pt-10 pb-8 text-center border-b border-orange-100/60">
              <span className="text-5xl text-primary/20 font-display leading-none select-none">"</span>
              <p className="font-display text-xl md:text-2xl font-semibold text-foreground leading-snug -mt-2">
                {wisdom.quote}
              </p>
              <span className="text-5xl text-primary/20 font-display leading-none select-none">"</span>
            </div>

            {/* Explanation + reference */}
            <div className="px-8 py-8 flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  What it means
                </p>
                <p className="text-[16px] text-foreground/75 leading-relaxed">
                  {wisdom.explanation}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-orange-100/60">
                <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-semibold text-primary">
                  {wisdom.reference}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Next change note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground/50"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Wisdom refreshes every day</span>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Button
              onClick={() => setLocation("/")}
              className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-white text-base font-medium shadow-md shadow-orange-900/10"
            >
              Seek Deeper Guidance
            </Button>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-orange-100/50 py-6 text-center">
        <p className="text-xs text-muted-foreground/60 tracking-wide">
          Inspired by Bhagavad Gita · GitaVerse
        </p>
      </footer>
    </div>
  );
}
