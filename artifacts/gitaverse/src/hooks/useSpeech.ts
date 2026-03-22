import { useState, useEffect, useCallback, useRef } from "react";

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
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

    const clean = stripMarkdown(text);
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 0.88;
    utter.pitch = 1.0;
    utter.volume = 1.0;

    // Pick a calm English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      v => /samantha|karen|daniel|moira|victoria|google uk english female/i.test(v.name)
    ) ?? voices.find(v => v.lang.startsWith("en")) ?? voices[0];
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
