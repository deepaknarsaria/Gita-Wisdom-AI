import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Chat from "@/pages/Chat";
import About from "@/pages/About";
import DailyWisdom from "@/pages/DailyWisdom";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import SavedGuidance from "@/pages/SavedGuidance";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import ExpiryBanner, { checkAndHandleExpiry, ExpiryStatus } from "@/components/ExpiryBanner";
import { onOpenEmailPopup } from "@/lib/emailPopup";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function initFreePlan() {
  if (!localStorage.getItem("plan")) {
    localStorage.setItem("plan", "free");
    localStorage.setItem("chatLimit", "5");
    localStorage.setItem("chatsUsed", "0");
  }
}

// Rendered inside WouterRouter so ExpiryBanner can use useLocation
function AppShell({ emailOpen, setEmailOpen }: { emailOpen: boolean; setEmailOpen: (v: boolean) => void }) {
  const [expiryStatus, setExpiryStatus] = useState<ExpiryStatus>(null);

  useEffect(() => {
    const status = checkAndHandleExpiry();
    setExpiryStatus(status);
  }, []);

  return (
    <>
      <ExpiryBanner status={expiryStatus} onDismiss={() => setExpiryStatus(null)} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/chat" component={Chat} />
        <Route path="/about" component={About} />
        <Route path="/daily-wisdom" component={DailyWisdom} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms" component={Terms} />
        <Route path="/saved" component={SavedGuidance} />
        <Route component={NotFound} />
      </Switch>
      <EmailCaptureModal open={emailOpen} onClose={() => setEmailOpen(false)} />
    </>
  );
}

function App() {
  const [emailOpen, setEmailOpen] = useState(false);

  useEffect(() => {
    initFreePlan();
    return onOpenEmailPopup(() => setEmailOpen(true));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppShell emailOpen={emailOpen} setEmailOpen={setEmailOpen} />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
