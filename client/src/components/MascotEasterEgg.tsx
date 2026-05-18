/**
 * MascotEasterEgg — Where's Waldo-style hidden mascot
 *
 * Renders INLINE (scrolls with the page, not fixed).
 * Each pageId gets a unique pose, size, and offset so she peeks
 * behind real elements.
 *
 * Behaviour on click:
 *  1. Plays a "caught!" scale-up + spin-out animation
 *  2. Records the find via tRPC (if authenticated)
 *  3. Persists found state in localStorage so she stays gone after refresh
 *  4. Shows a brief celebration bubble, then the mascot fades out entirely
 */

import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

// ─── Asset URLs ──────────────────────────────────────────────────────────────
const STANDING = "/manus-storage/mascot_v2_transparent_983f0933.webp";
const LAYING   = "/manus-storage/mascot_laying_t_601867ad.webp";
const PEEKING  = "/manus-storage/mascot_peeking_t_5bcdcc1a.webp";
const SITTING  = "/manus-storage/mascot_sitting_t_9c3d0cab.webp";

// ─── localStorage key ─────────────────────────────────────────────────────────
const LS_KEY = "wmt_mascot_found";

function getFoundPages(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function markPageFound(pageId: string): void {
  try {
    const pages = getFoundPages();
    pages.add(pageId);
    localStorage.setItem(LS_KEY, JSON.stringify(Array.from(pages)));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

// ─── Per-page config ──────────────────────────────────────────────────────────
type Cfg = {
  src: string;
  /** Width of the rendered image in px */
  w: number;
  /** Absolute offset applied to the container (which has position:relative on parent) */
  offset: React.CSSProperties;
  /** Base opacity while hiding */
  opacity: number;
};

const CONFIGS: Record<string, Cfg> = {
  home: {
    src: LAYING, w: 280,
    offset: { position: "absolute", bottom: -30, right: "6%", zIndex: 5 },
    opacity: 0.52,
  },
  services: {
    src: PEEKING, w: 150,
    offset: { position: "absolute", top: 10, left: -35, zIndex: 5 },
    opacity: 0.48,
  },
  blog: {
    src: SITTING, w: 140,
    offset: { position: "absolute", bottom: -50, right: "4%", zIndex: 5 },
    opacity: 0.50,
  },
  blogpost: {
    src: PEEKING, w: 130,
    offset: { position: "absolute", top: 20, right: -28, zIndex: 5, transform: "scaleX(-1)" },
    opacity: 0.48,
  },
  firstvisit: {
    src: STANDING, w: 120,
    offset: { position: "absolute", bottom: -90, left: "2%", zIndex: 5 },
    opacity: 0.46,
  },
  beforecare: {
    src: LAYING, w: 220,
    offset: { position: "absolute", bottom: -10, left: "10%", zIndex: 5, transform: "scaleX(-1)" },
    opacity: 0.50,
  },
  aftercare: {
    src: SITTING, w: 130,
    offset: { position: "absolute", top: -45, right: "1%", zIndex: 5 },
    opacity: 0.48,
  },
  faq: {
    src: PEEKING, w: 140,
    offset: { position: "absolute", top: 50, right: -30, zIndex: 5 },
    opacity: 0.50,
  },
  locations: {
    src: LAYING, w: 240,
    offset: { position: "absolute", bottom: -20, left: "50%", zIndex: 5, transform: "translateX(-50%)" },
    opacity: 0.52,
  },
  about: {
    src: SITTING, w: 125,
    offset: { position: "absolute", top: -35, left: "0%", zIndex: 5 },
    opacity: 0.47,
  },
  winafreewax: {
    src: STANDING, w: 115,
    offset: { position: "absolute", bottom: -95, right: "0%", zIndex: 5 },
    opacity: 0.48,
  },
};

// ─── Keyframe injection (once) ────────────────────────────────────────────────
const STYLE_ID = "mascot-keyframes";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes mascot-caught {
      0%   { transform: var(--base-transform, none) scale(1); opacity: var(--base-opacity, 0.5); }
      25%  { transform: var(--base-transform, none) scale(1.35) rotate(-8deg); opacity: 1; }
      55%  { transform: var(--base-transform, none) scale(1.2) rotate(6deg); opacity: 1; }
      80%  { transform: var(--base-transform, none) scale(0.9) rotate(-4deg); opacity: 0.6; }
      100% { transform: var(--base-transform, none) scale(0) rotate(15deg); opacity: 0; }
    }
    @keyframes mascot-bubble-in {
      0%   { opacity: 0; transform: translateX(-50%) translateY(6px) scale(0.85); }
      60%  { opacity: 1; transform: translateX(-50%) translateY(-2px) scale(1.04); }
      100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
    }
    @keyframes mascot-bubble-out {
      0%   { opacity: 1; transform: translateX(-50%) scale(1); }
      100% { opacity: 0; transform: translateX(-50%) scale(0.8) translateY(-8px); }
    }
  `;
  document.head.appendChild(s);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MascotEasterEgg({ pageId }: { pageId: string }) {
  const cfg = CONFIGS[pageId];
  const { isAuthenticated } = useAuth();

  // Initialise from localStorage so she stays gone after a page refresh
  const [alreadyFound, setAlreadyFound] = useState<boolean>(() =>
    getFoundPages().has(pageId)
  );
  const [catching, setCatching] = useState(false);   // animation playing
  const [gone, setGone] = useState(alreadyFound);    // fully removed from DOM
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleLeaving, setBubbleLeaving] = useState(false);
  const [hovered, setHovered] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const recordFind = trpc.mascot.recordFind.useMutation();

  // Sync gone with alreadyFound on mount (handles SSR / hydration edge cases)
  useEffect(() => {
    if (getFoundPages().has(pageId)) {
      setAlreadyFound(true);
      setGone(true);
    }
  }, [pageId]);

  if (!cfg || gone) return null;

  const baseTransform = (cfg.offset.transform as string) ?? "none";

  const handleClick = () => {
    if (catching || alreadyFound) return;

    // 1. Persist to localStorage immediately
    markPageFound(pageId);
    setAlreadyFound(true);
    // Notify the floating badge on the same tab
    window.dispatchEvent(new CustomEvent("mascot-found"));

    // 2. Record via tRPC (fire-and-forget; localStorage is the source of truth for UI)
    if (isAuthenticated) {
      recordFind.mutate({ pageId });
    }

    // 3. Play the caught animation
    setCatching(true);
    setShowBubble(true);

    // 4. Start bubble exit after 2.4 s, then remove mascot from DOM after 3.2 s
    setTimeout(() => setBubbleLeaving(true), 2400);
    setTimeout(() => {
      setShowBubble(false);
      setBubbleLeaving(false);
      setGone(true);
    }, 3200);
  };

  return (
    /* Zero-height wrapper so the mascot doesn't push layout */
    <div style={{ position: "relative", height: 0, overflow: "visible", pointerEvents: "none" }}>
      <div style={{ ...cfg.offset, pointerEvents: "auto", lineHeight: 0 }}>

        {/* Celebration bubble */}
        {showBubble && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              left: "50%",
              background: "#3B2F2A",
              color: "#fff",
              borderRadius: 14,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
              zIndex: 9999,
              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              pointerEvents: "auto",
              animation: bubbleLeaving
                ? "mascot-bubble-out 0.4s ease-in forwards"
                : "mascot-bubble-in 0.35s ease-out forwards",
            }}
          >
            {isAuthenticated ? (
              <>💅 Found her!{" "}
                <Link href="/mascot-hunt" style={{ color: "#CFA7A0", textDecoration: "underline" }}>
                  See progress
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" style={{ color: "#CFA7A0", textDecoration: "underline" }}>
                  Create account
                </Link>{" "}to track finds!
              </>
            )}
          </div>
        )}

        {/* Mascot image */}
        <img
          ref={imgRef}
          src={cfg.src}
          alt="Hidden mascot — click to catch her!"
          width={cfg.w}
          onClick={handleClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            cursor: catching ? "default" : "pointer",
            display: "block",
            // CSS custom properties carry the base transform into the keyframe
            ["--base-transform" as string]: baseTransform,
            ["--base-opacity" as string]: String(cfg.opacity),
            opacity: hovered && !catching ? 1 : cfg.opacity,
            filter: hovered && !catching
              ? "saturate(1) drop-shadow(0 3px 8px rgba(59,47,42,0.3))"
              : "saturate(0.65) drop-shadow(0 1px 3px rgba(59,47,42,0.15))",
            transform: hovered && !catching
              ? (baseTransform !== "none" ? `${baseTransform} scale(1.12)` : "scale(1.12)")
              : baseTransform,
            transition: catching ? "none" : "opacity 0.22s, filter 0.22s, transform 0.2s",
            animation: catching ? "mascot-caught 1.1s ease-in-out forwards" : "none",
          }}
        />
      </div>
    </div>
  );
}
