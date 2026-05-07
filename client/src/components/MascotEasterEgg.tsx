/**
 * MascotEasterEgg — Where's Waldo-style hidden mascot
 *
 * Renders INLINE (scrolls with the page, not fixed).
 * Each pageId gets a unique pose, size, and offset so she peeks
 * behind real elements. Click her to record the find.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

// ─── Asset URLs ──────────────────────────────────────────────────────────────
const STANDING = "/manus-storage/mascot_v2_transparent_835c9480.png";
const LAYING   = "/manus-storage/mascot_laying_t_4ff4c059.png";
const PEEKING  = "/manus-storage/mascot_peeking_t_26e6c284.png";
const SITTING  = "/manus-storage/mascot_sitting_t_2696d23e.png";

// ─── Per-page config ──────────────────────────────────────────────────────────
type Cfg = {
  src: string;
  /** Width of the rendered image in px */
  w: number;
  /** Absolute offset applied to the container (which has position:relative on parent) */
  offset: React.CSSProperties;
  /** Base opacity */
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function MascotEasterEgg({ pageId }: { pageId: string }) {
  const cfg = CONFIGS[pageId];
  const { isAuthenticated } = useAuth();
  const [found, setFound] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const recordFind = trpc.mascot.recordFind.useMutation({
    onSuccess: () => setFound(true),
  });

  if (!cfg) return null;

  const handleClick = () => {
    if (!found) {
      if (isAuthenticated) recordFind.mutate({ pageId });
      setFound(true);
    }
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3800);
  };

  return (
    /* Zero-height wrapper so the mascot doesn't push layout */
    <div style={{ position: "relative", height: 0, overflow: "visible", pointerEvents: "none" }}>
      <div style={{ ...cfg.offset, pointerEvents: "auto", lineHeight: 0 }}>
        {/* Pop-up bubble */}
        {showPopup && (
          <div style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3B2F2A",
            color: "#fff",
            borderRadius: 14,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: "nowrap",
            zIndex: 9999,
            boxShadow: "0 4px 18px rgba(0,0,0,0.22)",
            pointerEvents: "auto",
          }}>
            {isAuthenticated
              ? <>💅 Found! <Link href="/mascot-hunt" style={{ color: "#CFA7A0", textDecoration: "underline" }}>See progress</Link></>
              : <><Link href="/register" style={{ color: "#CFA7A0", textDecoration: "underline" }}>Create account</Link> to track finds!</>
            }
          </div>
        )}

        {/* Mascot image */}
        <img
          src={cfg.src}
          alt="Hidden mascot"
          width={cfg.w}
          onClick={handleClick}
          style={{
            cursor: "pointer",
            display: "block",
            opacity: cfg.opacity,
            filter: `saturate(0.65) drop-shadow(0 1px 3px rgba(59,47,42,0.15))`,
            transition: "opacity 0.22s, filter 0.22s, transform 0.2s",
            /* preserve any transform from offset (e.g. scaleX(-1)) */
            transform: (cfg.offset.transform as string) ?? "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.filter = "saturate(1) drop-shadow(0 3px 8px rgba(59,47,42,0.3))";
            const base = (cfg.offset.transform as string) ?? "";
            e.currentTarget.style.transform = base ? `${base} scale(1.12)` : "scale(1.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = String(cfg.opacity);
            e.currentTarget.style.filter = "saturate(0.65) drop-shadow(0 1px 3px rgba(59,47,42,0.15))";
            e.currentTarget.style.transform = (cfg.offset.transform as string) ?? "none";
          }}
        />
      </div>
    </div>
  );
}
