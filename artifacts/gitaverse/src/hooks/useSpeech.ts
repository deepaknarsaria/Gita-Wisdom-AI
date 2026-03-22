import { useState, useEffect, useCallback, useRef } from "react";

// Map of Hinglish words → phonetically clearer English spellings for TTS
const HINGLISH_PHONETICS: [RegExp, string][] = [
  // Section headers — remove them entirely, replace with a pause
  [/\[(EMPATHY|GITA INSIGHT|GITA TEACHING|ACTION STEPS|STEP-BY-STEP GUIDANCE|GITA REFERENCE[S]?|REFLECTION QUESTION|CLOSING (?:LINE|WISDOM)|ROOT CAUSE)\]/gi, "."],

  // Emojis and special symbols
  [/📖/g, ""],
  [/🌸|🪷|🌺|🕉️|🙏|✨|⭐|💛|🌙/g, ""],
  [/•/g, "."],

  // Common Hinglish connectors and particles
  [/\bkyunki\b/gi, "kyoon-ki"],
  [/\bkyun\b/gi, "kyoon"],
  [/\baur\b/gi, "or"],
  [/\bpehle\b/gi, "peh-lay"],
  [/\bphir\b/gi, "fir"],
  [/\bsirf\b/gi, "sirf"],
  [/\bkuch\b/gi, "kooch"],
  [/\bkoi\b/gi, "koy"],
  [/\btoh\b/gi, "toe"],
  [/\bbhi\b/gi, "bhee"],
  [/\bwoh\b/gi, "vo"],
  [/\bwahi\b/gi, "voh-hee"],
  [/\bwahin\b/gi, "vo-heen"],
  [/\byeh\b/gi, "yay"],
  [/\bvoh\b/gi, "vo"],
  [/\bna\b/gi, "naa"],
  [/\bnahi\b/gi, "naa-hee"],
  [/\bnahin\b/gi, "naa-heen"],
  [/\bnahi[ñn]\b/gi, "naa-heen"],
  [/\bkaro\b/gi, "kah-ro"],
  [/\bkarna\b/gi, "kahr-naa"],
  [/\bkarte ho\b/gi, "kahr-tay ho"],
  [/\bkarte\b/gi, "kahr-tay"],
  [/\bkarti\b/gi, "kahr-tee"],
  [/\bkar\b/gi, "kahr"],
  [/\bkiya\b/gi, "ki-yaa"],
  [/\bkiye\b/gi, "ki-yay"],

  // Common verb forms
  [/\bhain\b/gi, "hay"],
  [/\bhai\b/gi, "hay"],
  [/\btha\b/gi, "thaa"],
  [/\bthi\b/gi, "thee"],
  [/\bho\b/gi, "ho"],
  [/\bhoga\b/gi, "ho-gaa"],
  [/\bhoti\b/gi, "ho-tee"],
  [/\bhota\b/gi, "ho-taa"],
  [/\bhote\b/gi, "ho-tay"],
  [/\bhue\b/gi, "hoo-ay"],
  [/\bhua\b/gi, "hoo-aa"],
  [/\bmilti\b/gi, "mil-tee"],
  [/\bmilta\b/gi, "mil-taa"],
  [/\bmil\b/gi, "mil"],
  [/\baata\b/gi, "aa-taa"],
  [/\baati\b/gi, "aa-tee"],
  [/\baate\b/gi, "aa-tay"],
  [/\bjaana\b/gi, "jaa-naa"],
  [/\bjaate\b/gi, "jaa-tay"],
  [/\bjata\b/gi, "jaa-taa"],
  [/\bjaati\b/gi, "jaa-tee"],
  [/\bsochna\b/gi, "soch-naa"],
  [/\bsochte\b/gi, "soch-tay"],
  [/\bsochne\b/gi, "soch-nay"],
  [/\bsocho\b/gi, "so-cho"],
  [/\bsoch\b/gi, "soch"],
  [/\bdekhna\b/gi, "dek-naa"],
  [/\bdekhte\b/gi, "dek-tay"],
  [/\bdekho\b/gi, "dek-o"],
  [/\bdekha\b/gi, "dek-aa"],
  [/\bsamajhna\b/gi, "suh-muj-naa"],
  [/\bsamjhate\b/gi, "suh-muj-aa-tay"],
  [/\bsamjhaya\b/gi, "suh-muj-aa-yaa"],
  [/\bsamjhte\b/gi, "suh-muj-tay"],
  [/\bsamajh\b/gi, "suh-muj"],
  [/\bsikhaya\b/gi, "seek-aa-yaa"],
  [/\bsikhate\b/gi, "seek-aa-tay"],
  [/\bseekh\b/gi, "seekh"],

  // Pronouns and common nouns
  [/\baap\b/gi, "aap"],
  [/\bmain\b/gi, "meh"],
  [/\bmein\b/gi, "meh"],
  [/\bhum\b/gi, "hoom"],
  [/\btum\b/gi, "toom"],
  [/\bapna\b/gi, "ap-naa"],
  [/\bapne\b/gi, "ap-nay"],
  [/\bapni\b/gi, "ap-nee"],
  [/\buska\b/gi, "us-kaa"],
  [/\buske\b/gi, "us-kay"],
  [/\buski\b/gi, "us-kee"],
  [/\biska\b/gi, "is-kaa"],
  [/\biske\b/gi, "is-kay"],
  [/\biski\b/gi, "is-kee"],
  [/\bkya\b/gi, "kyaa"],
  [/\bkab\b/gi, "kub"],
  [/\bkahan\b/gi, "kuh-haan"],
  [/\bkaise\b/gi, "kay-say"],

  // Spiritual / context-specific terms
  [/\bdhyan\b/gi, "dhyaan"],
  [/\bdharna\b/gi, "dhahr-naa"],
  [/\bshuruaat\b/gi, "shoo-roo-aat"],
  [/\bshuru\b/gi, "shoo-roo"],
  [/\bchhodo\b/gi, "cho-do"],
  [/\bchhod\b/gi, "chod"],
  [/\bchalo\b/gi, "chah-lo"],
  [/\bbaat\b/gi, "baat"],
  [/\bbaatein\b/gi, "baa-tayn"],
  [/\bzindagi\b/gi, "zin-duh-gee"],
  [/\bjiwan\b/gi, "jee-vun"],
  [/\bman\b/gi, "mun"],
  [/\bmaan\b/gi, "maan"],
  [/\bdil\b/gi, "dil"],
  [/\bkhud\b/gi, "khud"],
  [/\bbahut\b/gi, "buh-hut"],
  [/\bbada\b/gi, "buh-daa"],
  [/\bbadi\b/gi, "buh-dee"],
  [/\bbade\b/gi, "buh-day"],
  [/\baccha\b/gi, "ach-chaa"],
  [/\bacchi\b/gi, "ach-chee"],
  [/\bsahi\b/gi, "saa-hee"],
  [/\bsach\b/gi, "such"],
  [/\bpoochho\b/gi, "pooch-o"],
  [/\bpoochh\b/gi, "pooch"],

  // Common suffixes/postpositions
  [/\bmein\b/gi, "meh"],
  [/\bko\b/gi, "ko"],
  [/\bse\b/gi, "say"],
  [/\bne\b/gi, "nay"],
  [/\bpe\b/gi, "pay"],
  [/\bpar\b/gi, "pur"],
  [/\btak\b/gi, "tuk"],

  // Particles/fillers TTS mangles
  [/\bji\b/gi, "jee"],
  [/\bji haan\b/gi, "jee haan"],
  [/\bwaise\b/gi, "vai-say"],
  [/\bfilhaal\b/gi, "fil-haal"],

  // Clean up artifacts
  [/\.{2,}/g, "."],
  [/\s{2,}/g, " "],
];

function cleanForSpeech(text: string): string {
  let out = text;

  // 1. Strip markdown formatting
  out = out
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 2. Apply Hinglish phonetic replacements
  for (const [pattern, replacement] of HINGLISH_PHONETICS) {
    out = out.replace(pattern, replacement);
  }

  // 3. Clean up leftover punctuation and spacing
  out = out
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .replace(/\.(\s*\.)+/g, ".")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();

  return out;
}

function stripMarkdown(text: string): string {
  return cleanForSpeech(text);
}

export type SpeechState = "idle" | "playing" | "paused";

export function useSpeech() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [state, setState] = useState<SpeechState>("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setActiveId(null);
    setState("idle");
  }, []);

  const speak = useCallback((id: string, text: string) => {
    window.speechSynthesis?.cancel();

    const clean = cleanForSpeech(text);
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = "en-US";
    utter.rate = 0.82;
    utter.pitch = 1.0;
    utter.volume = 1.0;

    // Pick a calm English voice — prefer slower, clearer voices
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find(v => /samantha|karen|daniel|moira|victoria|google uk english female/i.test(v.name)) ??
      voices.find(v => v.lang === "en-US" && v.localService) ??
      voices.find(v => v.lang.startsWith("en") && v.localService) ??
      voices.find(v => v.lang.startsWith("en")) ??
      voices[0];
    if (preferred) utter.voice = preferred;

    utter.onstart = () => {
      setActiveId(id);
      setState("playing");
    };
    utter.onpause = () => setState("paused");
    utter.onresume = () => setState("playing");
    utter.onend = () => {
      setActiveId(null);
      setState("idle");
      utteranceRef.current = null;
    };
    utter.onerror = () => {
      setActiveId(null);
      setState("idle");
      utteranceRef.current = null;
    };

    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, []);

  const toggle = useCallback(
    (id: string, text: string) => {
      if (activeId === id) {
        if (state === "playing") {
          window.speechSynthesis?.pause();
          setState("paused");
        } else if (state === "paused") {
          window.speechSynthesis?.resume();
          setState("playing");
        }
      } else {
        speak(id, text);
      }
    },
    [activeId, state, speak]
  );

  return { activeId, state, toggle, stop };
}
