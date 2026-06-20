/**
 * MascotHuntBadge — floating bottom-left counter badge
 *
 * Shows "🔍 X / 11" live as the user finds mascots.
 * Reads from localStorage (wmt_mascot_found) so it updates instantly
 * when a mascot is clicked anywhere on the site.
 * Links to /mascot-hunt for full progress view.
 * Hidden on the /mascot-hunt page itself.
 */

import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";

const LS_KEY = "wmt_mascot_found";
const TOTAL = 11;

function getFoundCount(): number {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return 0;
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

export default function MascotHuntBadge() {
  const [location] = useLocation();
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [visible, setVisible] = useState(false);

  const refresh = useCallback(() => {
    const c = getFoundCount();
    setCount((prev) => {
      if (c > prev) {
        // Trigger pulse animation when count increases
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }
      return c;
    });
    setVisible(c > 0);
  }, []);

  // Read on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Listen for storage events (cross-tab updates) and a custom event
  // dispatched by MascotEasterEgg when a mascot is found on the same tab
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY) refresh();
    };
    const onFound = () => refresh();

    window.addEventListener("storage", onStorage);
    window.addEventListener("mascot-found", onFound);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("mascot-found", onFound);
    };
  }, [refresh]);

  // Re-read on route change (in case user navigated away and back)
  useEffect(() => {
    refresh();
  }, [location, refresh]);

  // Hide on the mascot-hunt page itself (it has its own full progress view)
  if (location === "/mascot-hunt") return null;
  // Don't render until at least one mascot found
  if (!visible) return null;

  const complete = count >= TOTAL;

  return (
    <Link href="/mascot-hunt">
      <div
        role="status"
        aria-label={`Mascot hunt: ${count} of ${TOTAL} found`}
        style={{
          position: "fixed",
          bottom: 24,
          left: 20,
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: complete
            ? "linear-gradient(135deg, #3D6B4A, #2A4F35)"
            : "linear-gradient(135deg, #3B2F2A, #5A2828)",
          color: "#fff",
          borderRadius: 999,
          padding: "9px 16px 9px 12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.28)",
          cursor: "pointer",
          textDecoration: "none",
          userSelect: "none",
          transition: "transform 0.15s, box-shadow 0.15s",
          transform: pulse ? "scale(1.18)" : "scale(1)",
          border: complete ? "2px solid #A8B3AA" : "2px solid rgba(255,255,255,0.12)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.08)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 28px rgba(0,0,0,0.35)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.28)";
        }}
      >
        {/* Icon */}
        <span style={{ fontSize: 18, lineHeight: 1 }}>
          {complete ? "🎉" : "🔍"}
        </span>

        {/* Count */}
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>
          {count}
          <span style={{ opacity: 0.65, fontWeight: 400 }}> / {TOTAL}</span>
        </span>

        {/* Label */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            opacity: 0.8,
            borderLeft: "1px solid rgba(255,255,255,0.25)",
            paddingLeft: 8,
            marginLeft: 2,
          }}
        >
          {complete ? "Claim reward!" : "Hunt"}
        </span>
      </div>
    </Link>
  );
}
