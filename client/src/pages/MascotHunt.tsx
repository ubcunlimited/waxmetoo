import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

const mascotStanding = "/manus-storage/mascot_v2_transparent_835c9480.png";
const mascotPeeking  = "/manus-storage/mascot_peeking_t_26e6c284.png";

const LS_KEY = "wmt_mascot_found";

function clearLocalStorage() {
  try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
}

/** Human-readable labels for each page ID */
const PAGE_LABELS: Record<string, { label: string; path: string; hint: string }> = {
  home:        { label: "Home",          path: "/",              hint: "Check near the hero section" },
  services:    { label: "Services",      path: "/services",      hint: "Peek around the pricing cards" },
  blog:        { label: "Blog",          path: "/blog",          hint: "She loves reading articles" },
  blogpost:    { label: "Blog Post",     path: "/blog",          hint: "Open any blog post and look carefully" },
  firstvisit:  { label: "First Visit",   path: "/first-visit",   hint: "She's welcoming new clients" },
  beforecare:  { label: "Before Care",   path: "/before-care",   hint: "Hiding in the prep tips" },
  aftercare:   { label: "After Care",    path: "/after-care",    hint: "Tucked in the recovery section" },
  faq:         { label: "FAQ",           path: "/faq",           hint: "Between the questions" },
  locations:   { label: "Locations",     path: "/locations",     hint: "Near the map or location cards" },
  about:       { label: "About",         path: "/about",         hint: "Somewhere in our story" },
  winafreewax: { label: "Win a Free Wax",path: "/win-a-free-wax",hint: "She wants to win too!" },
};
const ALL_PAGE_IDS = Object.keys(PAGE_LABELS);

// ─── Congratulations Modal ────────────────────────────────────────────────────
function CongratsModal({
  onClose,
  existingReward,
}: {
  onClose: () => void;
  existingReward: { discountCode: string; discountPercent: number; claimedAt: Date } | null;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState("");

  const utils = trpc.useUtils();
  const claim = trpc.mascot.claimReward.useMutation({
    onSuccess: () => {
      utils.mascot.getProgress.invalidate();
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    claim.mutate({ fullName: fullName.trim(), phone: phone.trim(), email: email.trim() });
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const reward = claim.data ?? (existingReward ? {
    discountCode: existingReward.discountCode,
    discountPercent: existingReward.discountPercent,
    claimedAt: existingReward.claimedAt,
  } : null);

  return (
    /* Backdrop */
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(30,15,10,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#FAF8F5",
          borderRadius: 20,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute", top: 14, right: 16,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 22, color: "#9A8A7A", lineHeight: 1,
          }}
        >×</button>

        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #3D1A1A, #6B2D2D)",
          padding: "28px 28px 24px",
          textAlign: "center",
          color: "#fff",
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: "Cormorant Garamond, serif" }}>
            You Found All 11 Mascots!
          </h2>
          <p style={{ margin: "8px 0 0", opacity: 0.8, fontSize: 14 }}>
            Congratulations — you've earned a <strong>20% discount</strong> on your next wax!
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px 28px" }}>
          {reward ? (
            /* Already claimed — show code */
            <div>
              <p style={{ textAlign: "center", color: "#5A4A3A", fontSize: 14, marginBottom: 16 }}>
                Your one-time discount code is ready. Mention it when you book your appointment.
              </p>
              <div style={{
                background: "linear-gradient(135deg, #3D1A1A, #6B2D2D)",
                borderRadius: 14, padding: "16px 20px", textAlign: "center", marginBottom: 16,
              }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>
                  Your {reward.discountPercent}% Discount Code
                </p>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "monospace", letterSpacing: 3 }}>
                  {reward.discountCode}
                </p>
              </div>
              <button
                onClick={() => handleCopy(reward.discountCode)}
                style={{
                  width: "100%", padding: "12px", borderRadius: 12,
                  background: copied ? "#A8B3AA" : "#3D1A1A",
                  color: "#fff", fontWeight: 700, fontSize: 14,
                  border: "none", cursor: "pointer", transition: "background 0.2s",
                }}
              >
                {copied ? "✓ Copied!" : "Copy Code"}
              </button>
              <p style={{ textAlign: "center", fontSize: 11, color: "#9A8A7A", marginTop: 10 }}>
                Valid for one use · Cannot be combined with other offers ·
                Earned {new Date(reward.claimedAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            /* Not yet claimed — show form */
            <form onSubmit={handleSubmit}>
              <p style={{ color: "#5A4A3A", fontSize: 14, marginBottom: 18, textAlign: "center" }}>
                Enter your details below and we'll send your 20% discount code straight to your inbox!
              </p>

              {[
                { label: "Full Name", value: fullName, setter: setFullName, type: "text",  placeholder: "Jane Smith" },
                { label: "Phone",     value: phone,    setter: setPhone,    type: "tel",   placeholder: "(801) 555-0100" },
                { label: "Email",     value: email,    setter: setEmail,    type: "email", placeholder: "jane@example.com" },
              ].map(({ label, value, setter, type, placeholder }) => (
                <div key={label} style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#5A4A3A", marginBottom: 5 }}>
                    {label} <span style={{ color: "#C0392B" }}>*</span>
                  </label>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    required
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 10,
                      border: "1.5px solid #E0D8CF", fontSize: 14, color: "#3B2F2A",
                      background: "#fff", outline: "none", boxSizing: "border-box",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#A8B3AA")}
                    onBlur={(e) => (e.target.style.borderColor = "#E0D8CF")}
                  />
                </div>
              ))}

              {error && (
                <p style={{ color: "#C0392B", fontSize: 13, marginBottom: 12, textAlign: "center" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={claim.isPending}
                style={{
                  width: "100%", padding: "13px", borderRadius: 12,
                  background: claim.isPending ? "#9A8A7A" : "#3D1A1A",
                  color: "#fff", fontWeight: 700, fontSize: 15,
                  border: "none", cursor: claim.isPending ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {claim.isPending ? "Claiming…" : "Claim My 20% Discount 🎉"}
              </button>

              <p style={{ textAlign: "center", fontSize: 11, color: "#9A8A7A", marginTop: 10 }}>
                One-time use · Cannot be combined with other offers
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MascotHunt() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [showCongrats, setShowCongrats] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [justReset, setJustReset]       = useState(false);

  const utils = trpc.useUtils();

  const { data: progress, isLoading: progressLoading } = trpc.mascot.getProgress.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const resetHunt = trpc.mascot.resetHunt.useMutation({
    onSuccess: () => {
      clearLocalStorage();
      window.dispatchEvent(new CustomEvent("mascot-found")); // refresh badge
      utils.mascot.getProgress.invalidate();
      setResetConfirm(false);
      setJustReset(true);
      setTimeout(() => setJustReset(false), 3000);
    },
  });

  // Auto-open congrats modal when all found and no reward yet
  useEffect(() => {
    if (progress?.complete && !progress.reward && !showCongrats) {
      setShowCongrats(true);
    }
  }, [progress?.complete, progress?.reward]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3D1A1A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <section className="bg-gradient-to-br from-[#3D1A1A] to-[#6B2D2D] text-white py-16 text-center px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-[#A8B3AA] inline-block" />
            Mascot Hunt Tracker
          </div>
          <h1 className="text-4xl font-bold mb-3">Track Your Finds</h1>
          <p className="text-white/80 max-w-md mx-auto">
            Sign in to track your mascot finds and earn your 20% discount when you find all 11!
          </p>
        </section>
        <div className="max-w-md mx-auto px-6 py-16 text-center">
          <img src={mascotPeeking} alt="Mascot peeking" className="w-28 mx-auto mb-6 opacity-80" />
          <h2 className="text-xl font-bold text-[#3D1A1A] mb-3">Sign In to See Your Progress</h2>
          <p className="text-[#7A6A5A] text-sm mb-6">
            Your mascot finds are saved to your account. Create a free account or sign in to track your progress.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-block bg-[#3D1A1A] hover:bg-[#5A2828] text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Sign In / Create Account
          </a>
          <div className="mt-4">
            <Link href="/register" className="text-sm text-[#7A6A5A] underline hover:text-[#3D1A1A]">
              Learn how the hunt works
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const found      = progress?.found ?? [];
  const total      = progress?.total ?? 11;
  const complete   = progress?.complete ?? false;
  const reward     = progress?.reward ?? null;
  const foundCount = found.length;
  const progressPct = Math.round((foundCount / total) * 100);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Congratulations modal */}
      {showCongrats && (
        <CongratsModal
          onClose={() => setShowCongrats(false)}
          existingReward={reward}
        />
      )}

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#3D1A1A] to-[#6B2D2D] text-white py-16 text-center px-6">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-[#A8B3AA] inline-block" />
          Mascot Hunt Tracker
        </div>
        <h1 className="text-4xl font-bold mb-3">Your Mascot Hunt</h1>
        <p className="text-white/80 max-w-md mx-auto">
          {complete
            ? "You found them all! Claim your 20% discount below."
            : `You've found ${foundCount} of ${total} hidden mascots. Keep exploring!`}
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Reset success banner */}
        {justReset && (
          <div className="bg-[#A8B3AA]/20 border border-[#A8B3AA] text-[#3D5A40] rounded-xl px-5 py-3 mb-6 text-sm font-medium text-center">
            Hunt reset! All mascots are hiding again — good luck finding them! 🔍
          </div>
        )}

        {/* Progress bar */}
        <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-[#3D1A1A]">
              {foundCount} / {total} Mascots Found
            </span>
            <span className="text-sm text-[#7A6A5A]">{progressPct}% complete</span>
          </div>
          <div className="w-full h-3 bg-[#F0EBE3] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progressPct}%`,
                background: complete
                  ? "linear-gradient(90deg, #A8B3AA, #6B9E7A)"
                  : "linear-gradient(90deg, #D4A0A0, #3D1A1A)",
              }}
            />
          </div>
          {!complete && (
            <p className="text-xs text-[#9A8A7A] mt-2">
              Find all {total} to unlock a <strong>20% discount</strong> on your next wax!
            </p>
          )}
        </div>

        {/* Reward card (shown when complete and already claimed) */}
        {complete && reward && (
          <div className="bg-gradient-to-br from-[#3D1A1A] to-[#6B2D2D] text-white rounded-2xl p-8 mb-6 text-center shadow-lg">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold mb-2">You Found All 11 Mascots!</h2>
            <p className="text-white/80 mb-5">
              Your <strong>{reward.discountPercent}% discount code</strong> is below. Mention it when you book.
            </p>
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-4">
              <p className="text-xs text-white/60 mb-1 uppercase tracking-wider">Your Discount Code</p>
              <p className="text-2xl font-mono font-bold tracking-widest">{reward.discountCode}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(reward.discountCode);
              }}
              className="bg-white text-[#3D1A1A] font-semibold py-2.5 px-8 rounded-xl hover:bg-white/90 transition-colors"
            >
              Copy Code
            </button>
            <p className="text-xs text-white/50 mt-4">
              Valid for one use · Cannot be combined with other offers ·
              Earned {new Date(reward.claimedAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Claim button (complete but not yet claimed) */}
        {complete && !reward && (
          <div className="bg-white rounded-2xl border-2 border-[#D4A0A0] shadow-sm p-6 mb-6 text-center">
            <div className="text-3xl mb-2">🎊</div>
            <h2 className="text-xl font-bold text-[#3D1A1A] mb-2">All 11 Found — Claim Your Reward!</h2>
            <p className="text-[#7A6A5A] text-sm mb-4">
              Enter your details to receive your 20% discount code.
            </p>
            <button
              onClick={() => setShowCongrats(true)}
              className="bg-[#3D1A1A] hover:bg-[#5A2828] text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Claim My 20% Discount 🎉
            </button>
          </div>
        )}

        {/* Page grid */}
        <h2 className="text-xl font-bold text-[#3D1A1A] mb-4">
          {complete ? "All Pages — Found!" : "Pages to Explore"}
        </h2>

        {progressLoading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E8E0D8] p-4 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ALL_PAGE_IDS.map((pageId) => {
              const info = PAGE_LABELS[pageId];
              const isFound = found.includes(pageId);
              return (
                <div
                  key={pageId}
                  className={`group relative bg-white rounded-xl border p-4 transition-all duration-200 ${
                    isFound
                      ? "border-[#A8B3AA] shadow-sm"
                      : "border-[#E8E0D8] hover:border-[#D4A0A0] hover:shadow-md cursor-pointer"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isFound
                        ? "bg-[#A8B3AA]/20 text-[#4A6B5A]"
                        : "bg-[#F0EBE3] text-[#9A8A7A]"
                    }`}>
                      {isFound ? "✓ Found" : "Not yet found"}
                    </span>
                    {isFound && <span className="text-lg">💅</span>}
                    {!isFound && (
                      <span className="text-xs text-[#C0A898] opacity-0 group-hover:opacity-100 transition-opacity duration-150 select-none">
                        💡 hint
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#3D1A1A] text-sm mb-1">{info.label}</h3>

                  {isFound ? (
                    <p className="text-xs text-[#A8B3AA]">You found her here!</p>
                  ) : (
                    /* Hint: hidden by default, revealed on hover */
                    <div className="relative h-5 overflow-visible">
                      {/* Placeholder so the card keeps its height */}
                      <p className="text-xs text-[#C8BEB4] italic select-none">
                        Hover for a hint…
                      </p>
                      {/* Tooltip bubble */}
                      <div
                        className="
                          absolute bottom-full left-0 mb-2 z-20
                          bg-[#3D1A1A] text-white text-xs rounded-lg px-3 py-2
                          shadow-lg pointer-events-none whitespace-nowrap
                          opacity-0 group-hover:opacity-100
                          translate-y-1 group-hover:translate-y-0
                          transition-all duration-200
                        "
                        style={{ maxWidth: "220px", whiteSpace: "normal" }}
                      >
                        <span className="text-[#CFA7A0] mr-1">🔍</span>
                        {info.hint}
                        {/* Arrow */}
                        <span
                          className="absolute top-full left-4"
                          style={{
                            width: 0, height: 0,
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderTop: "6px solid #3D1A1A",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <Link href={info.path} className="absolute inset-0 rounded-xl" aria-label={`Go to ${info.label}`} />
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-2xl border border-[#E8E0D8] p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <img src={mascotStanding} alt="Mascot" className="w-14 opacity-75" />
            <div>
              <p className="font-semibold text-[#3D1A1A] text-sm">
                {complete ? "Hunt complete! 🎉" : "Keep hunting!"}
              </p>
              <p className="text-xs text-[#7A6A5A]">
                {complete
                  ? "You found all 11 hidden mascots."
                  : `${total - foundCount} mascot${total - foundCount !== 1 ? "s" : ""} still hiding.`}
              </p>
            </div>
          </div>

          {/* Reset hunt */}
          <div>
            {!resetConfirm ? (
              <button
                onClick={() => setResetConfirm(true)}
                className="text-sm text-[#9A8A7A] hover:text-[#C0392B] border border-[#E8E0D8] hover:border-[#C0392B] px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Reset Hunt
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#7A6A5A]">Are you sure?</span>
                <button
                  onClick={() => resetHunt.mutate()}
                  disabled={resetHunt.isPending}
                  className="text-xs bg-[#C0392B] hover:bg-[#A93226] text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  {resetHunt.isPending ? "Resetting…" : "Yes, reset"}
                </button>
                <button
                  onClick={() => setResetConfirm(false)}
                  className="text-xs border border-[#E8E0D8] px-3 py-1.5 rounded-lg hover:bg-[#F5F0EA] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[#9A8A7A] mt-4">
          Resetting clears your progress so you can play again. Your reward code (if already claimed) is not affected.
        </p>
      </div>
    </div>
  );
}
