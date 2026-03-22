import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const SECTIONS = [
  {
    title: "Information We Collect",
    body: "GitaVerse does not collect personal information at this time. Your conversations are processed to provide AI-powered guidance and are not stored beyond your session unless required for functionality.",
  },
  {
    title: "How We Use Your Data",
    body: "Any information submitted through the chat interface is used solely to generate responses inspired by the Bhagavad Gita. We do not sell, share, or distribute your data to third parties.",
  },
  {
    title: "Cookies & Local Storage",
    body: "We use browser local storage to remember your session preferences (such as message count) so your experience is consistent across visits. No tracking cookies are used.",
  },
  {
    title: "Third-Party Services",
    body: "GitaVerse uses AI services to generate responses. These services process your messages in real time to produce guidance. Please refer to the respective service providers for their data practices.",
  },
  {
    title: "Your Rights",
    body: "You have the right to stop using GitaVerse at any time. Since we do not store personal data, there is no account to delete. Simply clear your browser's local storage to remove all locally stored preferences.",
  },
  {
    title: "Contact",
    body: "If you have any questions about this Privacy Policy, please reach out to us. We are committed to handling your information responsibly and transparently.",
  },
];

export default function PrivacyPolicy() {
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
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
            Privacy Policy
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
