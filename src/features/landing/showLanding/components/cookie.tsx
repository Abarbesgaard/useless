import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function Cookie() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your experience. By continuing to visit
            this site you agree to our use of cookies.{" "}
            <a href="/privacy" className="underline hover:text-foreground">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={declineCookies}>
            Decline
          </Button>
          <Button size="sm" onClick={acceptCookies}>
            Accept
          </Button>
          <Button variant="ghost" size="sm" onClick={declineCookies}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
