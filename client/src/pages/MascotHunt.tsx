import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

const mascotStanding = "/manus-storage/mascot_v2_transparent_835c9480.png";
const mascotPeeking = "/manus-storage/mascot_peeking_t_26e6c284.png";

/** Human-readable labels for each page ID */
const PAGE_LABELS: Record<string, { label: string; path: string; hint: string }> = {
  home: { label: "Home", path: "/", hint: "Check near the hero section" },
  services: { label: "Services", path: "/services", hint: "Peek around the pricing cards" },
  blog: { label: "Blog", path: "/blog", hint: "She loves reading articles" },
  blogpost: { label: "Blog Post", path: "/blog", hint: "Open any blog post and look carefully" },
  firstvisit: { label: "First Visit", path: "/first-visit", hint: "She's welcoming new clients" },
  beforecare: { label: "Before Care", path: "/before-care", hint: "Hiding in the prep tips" },
  aftercare: { label: "After Care", path: "/after-care", hint: "Tucked in the recovery section" },
  faq: { label: "FAQ", path: "/faq", hint: "Between the questions" },
  locations: { label: "Locations", path: "/locations", hint: "Near the map or location cards" },
  about: { label: "About", path: "/about", hint: "Somewhere in our story" },
  winafreewax: { label: "Win a Free Wax", path: "/win-a-free-wax", hint: "She wants to win too!" },
};

const ALL_PAGE_IDS = Object.keys(PAGE_LABELS);

export default function MascotHunt() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [copied, setCopied] = useState(false);

  const { data: progress, isLoading: progressLoading } = trpc.mascot.getProgress.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
        {/* Header */}
        <section className="bg-gradient-to-br from-[#3D1A1A] to-[#6B2D2D] text-white py-16 text-center px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-[#A8B3AA] inline-block" />
            Mascot Hunt Tracker
          </div>
          <h1 className="text-4xl font-bold mb-3">Track Your Finds</h1>
          <p className="text-white/80 max-w-md mx-auto">
            Sign in to track your mascot finds and earn your 15% discount when you find all 11!
          </p>
        </section>

        {/* Sign-in prompt */}
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

  const found = progress?.found ?? [];
  const total = progress?.total ?? 11;
  const complete = progress?.complete ?? false;
  const reward = progress?.reward ?? null;
  const foundCount = found.length;
  const progressPct = Math.round((foundCount / total) * 100);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#3D1A1A] to-[#6B2D2D] text-white py-16 text-center px-6">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-[#A8B3AA] inline-block" />
          Mascot Hunt Tracker
        </div>
        <h1 className="text-4xl font-bold mb-3">Your Mascot Hunt</h1>
        <p className="text-white/80 max-w-md mx-auto">
          {complete
            ? "You found them all! Congratulations — your reward is below."
            : `You've found ${foundCount} of ${total} hidden mascots. Keep exploring!`}
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress bar */}
        <div className="bg-white rounded-2xl border border-[#E8E0D8] shadow-sm p-6 mb-8">
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
              Find all {total} to unlock a <strong>15% discount</strong> on your next wax!
            </p>
          )}
        </div>

        {/* Reward card (shown when complete) */}
        {complete && reward && (
          <div className="bg-gradient-to-br from-[#3D1A1A] to-[#6B2D2D] text-white rounded-2xl p-8 mb-8 text-center shadow-lg">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-2xl font-bold mb-2">You Found All 11 Mascots!</h2>
            <p className="text-white/80 mb-6">
              Here's your one-time <strong>{reward.discountPercent}% discount code</strong> to use at booking. Mention it when you book your appointment.
            </p>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-4">
              <p className="text-xs text-white/60 mb-1 uppercase tracking-wider">Your Discount Code</p>
              <p className="text-2xl font-mono font-bold tracking-widest">{reward.discountCode}</p>
            </div>
            <button
              onClick={() => handleCopy(reward.discountCode)}
              className="bg-white text-[#3D1A1A] font-semibold py-2.5 px-8 rounded-xl hover:bg-white/90 transition-colors"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
            <p className="text-xs text-white/50 mt-4">
              Valid for one use. Cannot be combined with other offers.
              Earned on {new Date(reward.claimedAt).toLocaleDateString()}.
            </p>
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
                  className={`relative bg-white rounded-xl border p-4 transition-all duration-200 ${
                    isFound
                      ? "border-[#A8B3AA] shadow-sm"
                      : "border-[#E8E0D8] hover:border-[#D4A0A0] hover:shadow-sm"
                  }`}
                >
                  {/* Status badge */}
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isFound
                          ? "bg-[#A8B3AA]/20 text-[#4A6B5A]"
                          : "bg-[#F0EBE3] text-[#9A8A7A]"
                      }`}
                    >
                      {isFound ? "✓ Found" : "Not yet found"}
                    </span>
                    {isFound && (
                      <span className="text-lg">💅</span>
                    )}
                  </div>

                  <h3 className="font-semibold text-[#3D1A1A] text-sm mb-1">{info.label}</h3>

                  {isFound ? (
                    <p className="text-xs text-[#A8B3AA]">You found her here!</p>
                  ) : (
                    <p className="text-xs text-[#9A8A7A] italic">{info.hint}</p>
                  )}

                  {/* Link to page */}
                  <Link
                    href={info.path}
                    className="absolute inset-0 rounded-xl"
                    aria-label={`Go to ${info.label}`}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {!complete && (
          <div className="mt-10 text-center bg-white rounded-2xl border border-[#E8E0D8] p-8 shadow-sm">
            <img src={mascotStanding} alt="Mascot" className="w-20 mx-auto mb-4 opacity-80" />
            <h3 className="font-bold text-[#3D1A1A] mb-2">Keep Hunting!</h3>
            <p className="text-sm text-[#7A6A5A] mb-4">
              She's hiding on every page — some are easier to spot than others. Click a page card above to go find her!
            </p>
            <Link
              href="/"
              className="inline-block bg-[#3D1A1A] hover:bg-[#5A2828] text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
            >
              Start from the Homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
