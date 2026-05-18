import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X } from "lucide-react";

const COOKIE_KEY = "wmt_cookie_consent";

type ConsentState = "accepted" | "rejected" | "pending";

export default function CookieConsent() {
  const [state, setState] = useState<ConsentState>("pending");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY) as ConsentState | null;
    if (stored === "accepted" || stored === "rejected") {
      setState(stored);
      setVisible(false);
    } else {
      // Small delay so it doesn't flash immediately on page load
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setState("accepted");
    setVisible(false);
    // Fire GA consent update if GA is loaded
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    }
  };

  const reject = () => {
    localStorage.setItem(COOKIE_KEY, "rejected");
    setState("rejected");
    setVisible(false);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    }
  };

  const dismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[9998] bg-[#1a1a1a] text-white border-t border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon + Text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0 mt-0.5">🍪</span>
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="font-semibold text-white">We use cookies.</span>{" "}
            We use necessary cookies to make our site work. With your consent, we also use analytics
            cookies (Google Analytics) to understand how visitors interact with our site. You can
            manage your preferences below or read our{" "}
            <Link
              href="/privacy-policy"
              className="text-[#d4a5a5] underline underline-offset-2 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={accept}
            className="px-4 py-2 bg-[#c9847a] hover:bg-[#b8736a] text-white text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#c9847a] focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
          >
            Accept All
          </button>
          <button
            onClick={reject}
            className="px-4 py-2 bg-transparent border border-white/30 hover:border-white/60 text-white text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#1a1a1a]"
          >
            Reject Optional
          </button>
        </div>

        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close cookie banner"
          className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
