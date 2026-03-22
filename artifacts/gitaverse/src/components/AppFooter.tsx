import { useLocation } from "wouter";

const NAV_LINKS = [
  { label: "About",             path: "/about" },
  { label: "Daily Wisdom",      path: "/daily-wisdom" },
  { label: "Privacy Policy",    path: "/privacy-policy" },
  { label: "Terms & Conditions",path: "/terms" },
];

export default function AppFooter() {
  const [, setLocation] = useLocation();

  return (
    <footer className="w-full bg-stone-50 border-t border-stone-100 shrink-0">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 flex flex-col items-center gap-8">

        {/* Brand */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[20px] font-display font-extrabold tracking-tight text-foreground select-none">
            Gita<span className="text-primary">Verse</span>
          </span>
          <p className="text-[13px] text-foreground/45 tracking-wide">
            Built with inspiration from the Bhagavad Gita
          </p>
        </div>

        {/* Divider */}
        <div className="w-full max-w-xs h-px bg-stone-200" />

        {/* Nav links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {NAV_LINKS.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => setLocation(path)}
              className="text-[13px] font-medium text-foreground/50 hover:text-primary transition-colors duration-200"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-[12px] text-foreground/30 tracking-wide">
          © {new Date().getFullYear()} GitaVerse. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
