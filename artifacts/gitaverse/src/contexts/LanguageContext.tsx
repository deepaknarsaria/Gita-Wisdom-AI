import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "EN" | "HI";

const STORAGE_KEY = "language";

const translations = {
  EN: {
    askKrishnaBtn: "Ask Krishna Now",
    todaysGitaWisdom: "Today's Gita Wisdom",
    chooseTopic: "Choose a topic or ask your own question",
    savedGuidance: "Saved Guidance",
    yourSavedWisdom: "Your Saved Wisdom",
    savedWisdomSubtitle: "Revisit the guidance that resonated with you, whenever you need it.",
    howFeeling: "How are you feeling today?",
    takeAPause: "Take a 1-min Pause",
    joinUsers: "🙏 Join 100+ users finding clarity with GitaVerse",
    notGenericAI: "Guidance inspired by Bhagavad Gita — not generic AI",
  },
  HI: {
    askKrishnaBtn: "कृष्ण से पूछें",
    todaysGitaWisdom: "आज का गीता ज्ञान",
    chooseTopic: "एक विषय चुनें या अपना प्रश्न पूछें",
    savedGuidance: "सहेजा गया मार्गदर्शन",
    yourSavedWisdom: "आपका सहेजा गया ज्ञान",
    savedWisdomSubtitle: "जब भी जरूरत हो, उस मार्गदर्शन को दोबारा पढ़ें जो आपके दिल को छू गया।",
    howFeeling: "आज आप कैसा महसूस कर रहे हैं?",
    takeAPause: "1 मिनट का विराम लें",
    joinUsers: "🙏 100+ लोग GitaVerse से स्पष्टता पा रहे हैं",
    notGenericAI: "भगवद् गीता से प्रेरित मार्गदर्शन — सामान्य AI नहीं",
  },
} as const;

export type Translations = typeof translations.EN;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "EN",
  setLanguage: () => {},
  t: translations.EN,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "HI" ? "HI" : "EN";
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
