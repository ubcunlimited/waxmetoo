/**
 * MascotEasterEgg — Where's Waldo-style hidden mascot
 *
 * Renders a tiny (~80px tall, ≈2 inches at 96dpi) version of the Wax Me Too
 * mascot at a fixed position on the page. Each page passes its own unique
 * position and transform so she appears in a different sneaky spot every time.
 *
 * She is intentionally low-opacity and partially clipped to make her hard to
 * spot — the game is to find her on every page!
 *
 * On hover the opacity rises and a tooltip appears: "You found me! 💅"
 */

import { useState } from "react";

interface MascotEasterEggProps {
  /** Inline style position — e.g. { bottom: "120px", right: "18px" } */
  style?: React.CSSProperties;
  /** Optional CSS transform to rotate / flip / skew her */
  transform?: string;
  /** Height in px (default 82 ≈ 2 inches at 96dpi). Width auto-scales 2:3 ratio. */
  size?: number;
  /** z-index (default 40) */
  zIndex?: number;
  /** Base opacity when not hovered (default 0.55 — hard to spot but not invisible) */
  baseOpacity?: number;
}

const MASCOT_URL = "/manus-storage/mascot_v2_transparent_835c9480.png";

export default function MascotEasterEgg({
  style,
  transform,
  size = 82,
  zIndex = 40,
  baseOpacity = 0.55,
}: MascotEasterEggProps) {
  const [found, setFound] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        zIndex,
        cursor: "pointer",
        userSelect: "none",
        lineHeight: 0,
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setFound(true)}
    >
      {/* Tooltip — only appears on hover */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3B2F2A",
            color: "#FBF8F5",
            fontSize: "11px",
            fontWeight: 700,
            whiteSpace: "nowrap",
            padding: "4px 12px",
            borderRadius: "20px",
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(59,47,42,0.22)",
            zIndex: zIndex + 1,
          }}
        >
          {found ? "Found me again! 💅" : "You found me! 💅"}
        </div>
      )}

      {/* Mascot image */}
      <img
        src={MASCOT_URL}
        alt="Hidden mascot — you found her!"
        width={Math.round(size * (2 / 3))}
        height={size}
        style={{
          display: "block",
          transform: hovered
            ? (transform ? `${transform} scale(1.18)` : "scale(1.18)")
            : (transform ?? "none"),
          opacity: hovered ? 1 : baseOpacity,
          filter: hovered
            ? "drop-shadow(0 2px 6px rgba(59,47,42,0.35))"
            : "drop-shadow(0 1px 2px rgba(59,47,42,0.12)) saturate(0.7)",
          transition: "transform 0.25s ease, opacity 0.25s ease, filter 0.25s ease",
        }}
      />
    </div>
  );
}
