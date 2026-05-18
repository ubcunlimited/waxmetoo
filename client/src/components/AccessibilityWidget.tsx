/**
 * ADA Accessibility Widget
 * Matches the design from terminalbroker.com:
 * - Fixed bottom-right floating button
 * - Dark panel with 4 accordion sections: Vision, Color & Contrast, Motor & Navigation, Cognitive
 * - Settings persisted to localStorage
 * - Skip-to-main-content link (WCAG 2.4.1)
 */
import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Eye, Contrast, MousePointer2, Brain, Accessibility } from "lucide-react";

const STORAGE_KEY = "wmt_a11y_settings";

interface A11ySettings {
  fontSize: number;         // 0 = default, 1 = large, 2 = x-large
  highContrast: boolean;
  invertColors: boolean;
  grayscale: boolean;
  dyslexiaFont: boolean;
  highlightLinks: boolean;
  bigCursor: boolean;
  reduceMotion: boolean;
  readingGuide: boolean;
  focusMode: boolean;
}

const DEFAULT_SETTINGS: A11ySettings = {
  fontSize: 0,
  highContrast: false,
  invertColors: false,
  grayscale: false,
  dyslexiaFont: false,
  highlightLinks: false,
  bigCursor: false,
  reduceMotion: false,
  readingGuide: false,
  focusMode: false,
};

function loadSettings(): A11ySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(s: A11ySettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function applySettings(s: A11ySettings) {
  const root = document.documentElement;
  // Font size
  const sizes = ["", "1.1em", "1.25em"];
  root.style.fontSize = sizes[s.fontSize] || "";
  // High contrast
  root.classList.toggle("a11y-high-contrast", s.highContrast);
  // Invert colors
  root.classList.toggle("a11y-invert", s.invertColors);
  // Grayscale
  root.classList.toggle("a11y-grayscale", s.grayscale);
  // Dyslexia font
  root.classList.toggle("a11y-dyslexia", s.dyslexiaFont);
  // Highlight links
  root.classList.toggle("a11y-highlight-links", s.highlightLinks);
  // Big cursor
  root.classList.toggle("a11y-big-cursor", s.bigCursor);
  // Reduce motion
  root.classList.toggle("a11y-reduce-motion", s.reduceMotion);
  // Focus mode (dim non-focused content)
  root.classList.toggle("a11y-focus-mode", s.focusMode);
}

type SectionKey = "vision" | "color" | "motor" | "cognitive" | null;

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>(null);
  const [settings, setSettings] = useState<A11ySettings>(loadSettings);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Apply settings on mount and whenever they change
  useEffect(() => {
    applySettings(settings);
    saveSettings(settings);
  }, [settings]);

  // Close panel on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const toggle = (key: keyof A11ySettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setFontSize = (size: number) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  const resetAll = () => {
    setSettings({ ...DEFAULT_SETTINGS });
  };

  const toggleSection = (s: SectionKey) => {
    setActiveSection(prev => prev === s ? null : s);
  };

  const ToggleButton = ({
    label, active, onClick
  }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#c9847a] ${
        active
          ? "bg-[#c9847a] text-white font-semibold"
          : "bg-white/10 text-gray-200 hover:bg-white/20"
      }`}
    >
      {active ? "✓ " : ""}{label}
    </button>
  );

  const SectionHeader = ({
    id, icon: Icon, label
  }: { id: SectionKey; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => toggleSection(id)}
      aria-expanded={activeSection === id}
      className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-100 hover:bg-white/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#c9847a]"
    >
      <span className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#c9847a]" />
        {label}
      </span>
      <ChevronDown className={`w-4 h-4 transition-transform ${activeSection === id ? "rotate-180" : ""}`} />
    </button>
  );

  return (
    <>
      {/* Skip to main content — WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:right-0 focus:z-[10000] focus:bg-blue-600 focus:text-white focus:text-center focus:py-3 focus:text-base focus:font-semibold focus:no-underline"
      >
        Skip to main content
      </a>

      {/* Floating trigger button */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(prev => !prev)}
        aria-label="Open accessibility options"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="fixed bottom-6 right-6 z-[9999] w-12 h-12 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-white/20 rounded-xl shadow-xl flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#c9847a] focus:ring-offset-2"
      >
        <Accessibility className="w-6 h-6 text-white" />
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility options"
          aria-modal="false"
          className="fixed bottom-24 right-6 z-[9999] w-72 bg-[#1e1e1e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#252525]">
            <span className="flex items-center gap-2 text-white font-semibold text-sm">
              <Accessibility className="w-4 h-4 text-[#c9847a]" />
              Accessibility
            </span>
            <button
              onClick={() => { setOpen(false); triggerRef.current?.focus(); }}
              aria-label="Close accessibility panel"
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#c9847a]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sections */}
          <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">

            {/* VISION */}
            <div>
              <SectionHeader id="vision" icon={Eye} label="Vision" />
              {activeSection === "vision" && (
                <div className="px-2 pb-2 space-y-1.5 mt-1">
                  <p className="text-xs text-gray-400 px-1 mb-2">Text Size</p>
                  <div className="flex gap-1.5">
                    {["Default", "Large", "X-Large"].map((label, i) => (
                      <button
                        key={i}
                        onClick={() => setFontSize(i)}
                        aria-pressed={settings.fontSize === i}
                        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#c9847a] ${
                          settings.fontSize === i
                            ? "bg-[#c9847a] text-white"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <ToggleButton label="Dyslexia-Friendly Font" active={settings.dyslexiaFont} onClick={() => toggle("dyslexiaFont")} />
                  <ToggleButton label="Highlight Links" active={settings.highlightLinks} onClick={() => toggle("highlightLinks")} />
                </div>
              )}
            </div>

            {/* COLOR & CONTRAST */}
            <div>
              <SectionHeader id="color" icon={Contrast} label="Color & Contrast" />
              {activeSection === "color" && (
                <div className="px-2 pb-2 space-y-1.5 mt-1">
                  <ToggleButton label="High Contrast" active={settings.highContrast} onClick={() => toggle("highContrast")} />
                  <ToggleButton label="Invert Colors" active={settings.invertColors} onClick={() => toggle("invertColors")} />
                  <ToggleButton label="Grayscale" active={settings.grayscale} onClick={() => toggle("grayscale")} />
                </div>
              )}
            </div>

            {/* MOTOR & NAVIGATION */}
            <div>
              <SectionHeader id="motor" icon={MousePointer2} label="Motor & Navigation" />
              {activeSection === "motor" && (
                <div className="px-2 pb-2 space-y-1.5 mt-1">
                  <ToggleButton label="Large Cursor" active={settings.bigCursor} onClick={() => toggle("bigCursor")} />
                  <ToggleButton label="Reduce Motion" active={settings.reduceMotion} onClick={() => toggle("reduceMotion")} />
                  <ToggleButton label="Reading Guide" active={settings.readingGuide} onClick={() => toggle("readingGuide")} />
                </div>
              )}
            </div>

            {/* COGNITIVE */}
            <div>
              <SectionHeader id="cognitive" icon={Brain} label="Cognitive & Learning" />
              {activeSection === "cognitive" && (
                <div className="px-2 pb-2 space-y-1.5 mt-1">
                  <ToggleButton label="Focus Mode" active={settings.focusMode} onClick={() => toggle("focusMode")} />
                  <ToggleButton label="Dyslexia-Friendly Font" active={settings.dyslexiaFont} onClick={() => toggle("dyslexiaFont")} />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 bg-[#252525]">
            <button
              onClick={resetAll}
              className="w-full text-xs text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#c9847a] rounded"
            >
              Reset All Settings
            </button>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Settings are saved in your browser and apply across all pages.
            </p>
          </div>
        </div>
      )}

      {/* Reading guide line (follows mouse) */}
      {settings.readingGuide && <ReadingGuide />}
    </>
  );
}

function ReadingGuide() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onMove = (e: MouseEvent) => setY(e.clientY);
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      aria-hidden="true"
      style={{ top: y - 12 }}
      className="fixed left-0 right-0 z-[9990] pointer-events-none h-6 bg-yellow-300/20 border-y border-yellow-400/40"
    />
  );
}
