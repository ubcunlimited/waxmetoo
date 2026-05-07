/**
 * MascotEasterEgg — Where's Waldo-style hidden mascot
 *
 * Renders a tiny (48px) version of the Wax Me Too mascot at a fixed position
 * on the page. Each page passes its own unique position and transform so she
 * appears in a different spot every time.
 *
 * On hover a fun tooltip appears: "You found me! 💅"
 */

import { useState } from "react";

interface MascotEasterEggProps {
  /** Tailwind/inline style position — e.g. { bottom: "120px", right: "18px" } */
  style?: React.CSSProperties;
  /** Optional CSS transform to rotate / flip her */
  transform?: string;
  /** Size in px (default 48) */
  size?: number;
  /** z-index (default 40) */
  zIndex?: number;
}

const MASCOT_URL = "/manus-storage/mascot_transparent_2e3ceae0.png";

export default function MascotEasterEgg({
  style,
  transform,
  size = 48,
  zIndex = 40,
}: MascotEasterEggProps) {
  const [found, setFound] = useState(false);
  const [showTip, setShowTip] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        zIndex,
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onClick={() => setFound(true)}
      title="You found me! 💅"
    >
      {/* Tooltip */}
      {showTip && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3B2F2A",
            color: "#FBF8F5",
            fontSize: "11px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            padding: "4px 10px",
            borderRadius: "20px",
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(59,47,42,0.18)",
          }}
        >
          {found ? "Found me again! 💅" : "You found me! 💅"}
        </div>
      )}

      {/* Mascot image */}
      <img
        src={MASCOT_URL}
        alt="Hidden mascot — you found her!"
        width={size}
        height={size * 1.5}
        style={{
          display: "block",
          transform: transform ?? "none",
          opacity: 0.92,
          filter: "drop-shadow(0 1px 3px rgba(59,47,42,0.22))",
          transition: "transform 0.2s ease, opacity 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLImageElement).style.transform =
            (transform ?? "") + " scale(1.15)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLImageElement).style.transform =
            transform ?? "none";
        }}
      />
    </div>
  );
}
