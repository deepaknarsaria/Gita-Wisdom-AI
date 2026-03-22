import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Trash2, Flower2, BookOpen } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useSavedGuidance } from "@/hooks/useSavedGuidance";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/contexts/LanguageContext";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SavedGuidance() {
  const { items, removeItem } = useSavedGuidance();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeItem(id);
      setRemovingId(null);
    }, 250);
  };

  return (
    <PageLayout>
      {/* Header */}
      <div className="w-full border-b border-orange-100/60 bg-white/60 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 py-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-5">
            <Bookmark className="w-3.5 h-3.5 text-primary/70" />
            <span className="text-[11px] font-bold text-primary/70 uppercase tracking-widest">{t.savedGuidance}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-3">
            {t.yourSavedWisdom}
          </h1>
          <p className="text-base text-foreground/50 font-light max-w-md mx-auto">
            {t.savedWisdomSubtitle}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 sm:px-8 py-10">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-5"
          >
            <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-primary/50" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground/60 mb-1">No saved guidance yet</p>
              <p className="text-sm text-muted-foreground/50 font-light">
                Tap the bookmark icon on any AI response in chat to save it here.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-5">
            <p className="text-xs text-muted-foreground/50 font-medium uppercase tracking-widest text-right">
              {items.length} saved {items.length === 1 ? "item" : "items"}
            </p>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: removingId === item.id ? 0 : 1, y: 0, scale: removingId === item.id ? 0.97 : 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="relative bg-white border border-orange-100/70 rounded-2xl px-6 py-5 shadow-sm shadow-orange-900/4 group"
                >
                  {/* Lotus avatar */}
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200/60 flex items-center justify-center shrink-0 mt-0.5">
                      <Flower2 className="w-4 h-4 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Date */}
                      <p className="text-[11px] text-primary/50 font-semibold tracking-wide mb-2 uppercase">
                        {formatDate(item.savedAt)}
                      </p>

                      {/* Content */}
                      <div className="prose prose-sm prose-orange max-w-none text-foreground/75 prose-p:leading-relaxed prose-p:my-2 prose-headings:font-display prose-li:my-1">
                        <ReactMarkdown>{item.content}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-foreground/20 hover:text-red-400 hover:bg-red-50 transition-all duration-200 mt-0.5 opacity-0 group-hover:opacity-100"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
