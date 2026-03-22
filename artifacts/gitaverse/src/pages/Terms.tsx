import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const PARAGRAPHS = [
  "GitaVerse provides AI-generated guidance inspired by the Bhagavad Gita.",
  "This app is for informational and self-reflection purposes only and should not be considered professional or medical advice.",
  "Users are responsible for how they use the information provided.",
  "We may update features and services over time.",
];

export default function Terms() {
  return (
    <PageLayout>
      <div className="w-full max-w-xl mx-auto px-6 sm:px-8 py-16 md:py-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200 flex items-center justify-center mb-5 shadow-sm">
            <ScrollText className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
            Terms & Conditions
          </h1>
          <div className="w-10 h-0.5 bg-primary/30 rounded-full mt-2" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          {PARAGRAPHS.map((text, i) => (
            <p
              key={i}
              className="text-[16px] md:text-[17px] text-foreground/70 leading-[1.85]"
            >
              {text}
            </p>
          ))}
        </motion.div>

      </div>
    </PageLayout>
  );
}
