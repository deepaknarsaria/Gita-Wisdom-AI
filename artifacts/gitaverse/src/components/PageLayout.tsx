import type { ReactNode } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${className ?? ""}`}>
      <AppHeader />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
