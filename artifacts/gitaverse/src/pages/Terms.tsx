import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: "By accessing and using GitaVerse, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please refrain from using the service.",
  },
  {
    title: "Nature of Guidance",
    body: "GitaVerse provides AI-generated guidance inspired by the Bhagavad Gita for informational and reflective purposes only. This is not professional advice — legal, medical, financial, or psychological. Always seek appropriate professional counsel for serious matters.",
  },
  {
    title: "Appropriate Use",
    body: "You agree to use GitaVerse only for lawful, personal purposes. You shall not use the service to generate harmful content, spam, or anything that violates applicable laws or the spirit of dharmic principles.",
  },
  {
    title: "Intellectual Property",
    body: "All design, branding, and original content on GitaVerse is the property of GitaVerse. The Bhagavad Gita itself is an ancient scripture in the public domain. AI-generated responses are provided as-is for personal use.",
  },
  {
    title: "Limitation of Liability",
    body: "GitaVerse is provided 'as is' without warranties of any kind. We are not liable for any decisions you make based on the guidance provided. Use the insights as a starting point for your own reflection.",
  },
  {
    title: "Changes to Terms",
    body: "We reserve the right to modify these Terms at any time. Continued use of GitaVerse after changes are posted constitutes your acceptance of the updated Terms.",
  },
];

export default function Terms() {
  return (
    <PageLayout>
      <div className="w-full max-w-2xl mx-auto px-6 sm:px-8 py-16 md:py-24">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200 flex items-center justify-center mb-6 shadow-sm">
            <ScrollText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
            Terms & Conditions
          </h1>
          <div className="w-12 h-0.5 bg-primary/30 rounded-full mt-2 mb-4" />
          <p className="text-sm text-muted-foreground/70">Last updated: March 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-8"
        >
          {SECTIONS.map(({ title, body }, i) => (
            <div key={i} className="rounded-2xl border border-orange-100 bg-white/70 backdrop-blur px-6 py-6 shadow-sm">
              <h2 className="font-semibold text-foreground text-base mb-2">{title}</h2>
              <p className="text-[15px] text-foreground/65 leading-relaxed">{body}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </PageLayout>
  );
}
