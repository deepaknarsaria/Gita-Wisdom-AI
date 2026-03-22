import { useLocation } from "wouter";

export default function AppFooter() {
  const [, setLocation] = useLocation();

  return (
    <footer className="w-full border-t border-orange-100/80 bg-orange-50/40 shrink-0">
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col items-center gap-6 text-center">

        <span className="text-lg text-primary/40 select-none">🕉</span>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <button
            onClick={() => setLocation("/about")}
            className="text-sm text-foreground/55 hover:text-primary transition-colors font-medium"
          >
            About
          </button>
          <span className="text-foreground/20 text-xs">•</span>
          <button
            onClick={() => setLocation("/daily-wisdom")}
            className="text-sm text-foreground/55 hover:text-primary transition-colors font-medium"
          >
            Daily Wisdom
          </button>
          <span className="text-foreground/20 text-xs">•</span>
          <button
            onClick={() => setLocation("/privacy-policy")}
            className="text-sm text-foreground/55 hover:text-primary transition-colors font-medium"
          >
            Privacy Policy
          </button>
          <span className="text-foreground/20 text-xs">•</span>
          <button
            onClick={() => setLocation("/terms")}
            className="text-sm text-foreground/55 hover:text-primary transition-colors font-medium"
          >
            Terms
          </button>
        </nav>

        <p className="text-xs text-foreground/35 tracking-wide">
          Built with inspiration from the Bhagavad Gita
        </p>

      </div>
    </footer>
  );
}
