/**
 * Win a Free Wax — Giveaway Landing Page
 * Route: /win-a-free-wax
 *
 * Collects first name, last name, and email.
 * On submit, calls trpc.giveaway.enter and shows success/error state.
 * Includes social share panel with pre-filled links.
 */

import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Gift, CheckCircle, Mail, ChevronRight, Star, Calendar, MapPin, Share2, Copy, Check } from "lucide-react";

const SHARE_TEXT = "I just entered to win a free wax at Wax Me Too! Enter for your chance to win a complimentary waxing service — one winner every month! 🎁";
const SHARE_URL = "https://waxmetoo.com/win-a-free-wax";

function SocialSharePanel() {
  const [copied, setCopied] = useState(false);

  const encodedText = encodeURIComponent(SHARE_TEXT);
  const encodedUrl = encodeURIComponent(SHARE_URL);

  const shareLinks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      bg: "#1877F2",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: `https://www.instagram.com/`,
      bg: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      bg: "#000000",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
      bg: "#E60023",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      ),
    },
  ];

  function handleCopy() {
    navigator.clipboard.writeText(`${SHARE_TEXT} ${SHARE_URL}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "#ffffff", border: "1px solid #A8B3AA", borderTop: "3px solid #A8B3AA" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Share2 size={18} style={{ color: "#A8B3AA" }} />
        <h3 className="font-serif text-lg" style={{ color: "#3B2F2A" }}>
          Share & Help a Friend Win!
        </h3>
      </div>
      <p className="text-xs leading-relaxed mb-4" style={{ color: "#A8B3AA" }}>
        Know someone who deserves a free wax? Share the giveaway with friends — the more the merrier!
      </p>

      {/* Pre-filled message preview */}
      <div
        className="rounded-xl px-4 py-3 text-xs leading-relaxed mb-4 italic"
        style={{ background: "#F7F3EE", color: "#4A4A4A", border: "1px solid #D8C6B6" }}
      >
        "{SHARE_TEXT}"
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {shareLinks.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-white text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ background: s.bg }}
          >
            {s.icon}
            {s.name}
          </a>
        ))}
      </div>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all"
        style={{
          background: copied ? "rgba(168,179,170,0.15)" : "#F7F3EE",
          color: copied ? "#A8B3AA" : "#3B2F2A",
          border: `1.5px solid ${copied ? "#A8B3AA" : "#D8C6B6"}`,
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied to clipboard!" : "Copy shareable message"}
      </button>
    </div>
  );
}

export default function WinAFreeWax() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitReason, setSubmitReason] = useState<"created" | "resent" | "already_confirmed" | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const enterMutation = trpc.giveaway.enter.useMutation({
    onSuccess(data) {
      if (data.reason === "already_confirmed") {
        setSubmitReason("already_confirmed");
      } else if (data.reason === "resent") {
        setSubmitReason("resent");
      } else {
        setSubmitReason("created");
      }
      setSubmitted(true);
    },
    onError(err) {
      setErrors({ form: err.message || "Something went wrong. Please try again." });
    },
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.trim()) {
      e.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    enterMutation.mutate({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      origin: window.location.origin,
    });
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative min-h-[480px] flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #3B2F2A 0%, #5a3e38 50%, #3B2F2A 100%)",
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "#CFA7A0", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: "#A8B3AA", transform: "translate(-30%, 30%)" }} />

        <div className="relative z-10 text-center px-6 py-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(168,179,170,0.2)", border: "1px solid rgba(168,179,170,0.4)" }}>
            <Gift size={16} style={{ color: "#A8B3AA" }} />
            <span className="text-sm font-medium" style={{ color: "#A8B3AA", letterSpacing: "0.05em" }}>Monthly Giveaway</span>
          </div>
          <h1 className="font-serif mb-4" style={{ color: "#F7F3EE", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", lineHeight: 1.15 }}>
            Win a Free Wax
          </h1>
          <p className="text-lg leading-relaxed mb-2" style={{ color: "#D8C6B6" }}>
            Enter for your chance to win a complimentary waxing service — on us!
          </p>
          <p className="text-sm" style={{ color: "#A8B3AA" }}>
            One winner drawn each month from all confirmed entries.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6" style={{ background: "#F7F3EE" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left: Form or Success */}
            <div>
              {!submitted ? (
                <div className="rounded-2xl p-8 shadow-lg" style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}>
                  <h2 className="font-serif text-2xl mb-2" style={{ color: "#3B2F2A" }}>Enter the Giveaway</h2>
                  <p className="text-sm mb-6" style={{ color: "#A8B3AA" }}>
                    Fill out the form below. You'll receive a confirmation email — click the link inside to complete your entry.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-1" style={{ color: "#3B2F2A" }}>
                        First Name <span style={{ color: "#CFA7A0" }}>*</span>
                      </label>
                      <input
                        id="firstName" type="text" autoComplete="given-name"
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{ border: errors.firstName ? "1.5px solid #e57373" : "1.5px solid #D8C6B6", background: "#F7F3EE", color: "#3B2F2A" }}
                        placeholder="Jane"
                      />
                      {errors.firstName && <p className="text-xs mt-1" style={{ color: "#e57373" }}>{errors.firstName}</p>}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-1" style={{ color: "#3B2F2A" }}>
                        Last Name <span style={{ color: "#CFA7A0" }}>*</span>
                      </label>
                      <input
                        id="lastName" type="text" autoComplete="family-name"
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{ border: errors.lastName ? "1.5px solid #e57373" : "1.5px solid #D8C6B6", background: "#F7F3EE", color: "#3B2F2A" }}
                        placeholder="Smith"
                      />
                      {errors.lastName && <p className="text-xs mt-1" style={{ color: "#e57373" }}>{errors.lastName}</p>}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: "#3B2F2A" }}>
                        Email Address <span style={{ color: "#CFA7A0" }}>*</span>
                      </label>
                      <input
                        id="email" type="email" autoComplete="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{ border: errors.email ? "1.5px solid #e57373" : "1.5px solid #D8C6B6", background: "#F7F3EE", color: "#3B2F2A" }}
                        placeholder="jane@example.com"
                      />
                      {errors.email && <p className="text-xs mt-1" style={{ color: "#e57373" }}>{errors.email}</p>}
                    </div>

                    {errors.form && (
                      <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#fef2f2", color: "#e57373", border: "1px solid #fecaca" }}>
                        {errors.form}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={enterMutation.isPending}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                      style={{ background: enterMutation.isPending ? "#D8C6B6" : "#CFA7A0", color: "#ffffff", cursor: enterMutation.isPending ? "not-allowed" : "pointer" }}
                    >
                      {enterMutation.isPending ? (
                        <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
                      ) : (
                        <><Gift size={16} />Enter the Giveaway</>
                      )}
                    </button>

                    <p className="text-xs text-center" style={{ color: "#A8B3AA" }}>
                      By entering, you agree to receive a one-time confirmation email. No spam, ever. See our{" "}
                      <Link href="/privacy" className="underline" style={{ color: "#CFA7A0" }}>Privacy Policy</Link>.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="rounded-2xl p-8 shadow-lg text-center" style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}>
                  {submitReason === "already_confirmed" ? (
                    <>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#F7F3EE" }}>
                        <CheckCircle size={32} style={{ color: "#A8B3AA" }} />
                      </div>
                      <h2 className="font-serif text-2xl mb-3" style={{ color: "#3B2F2A" }}>You're Already Entered!</h2>
                      <p className="text-sm leading-relaxed mb-6" style={{ color: "#4A4A4A" }}>
                        This email address is already confirmed and entered in the giveaway. Good luck — we draw a winner each month!
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(207,167,160,0.15)" }}>
                        <Mail size={32} style={{ color: "#CFA7A0" }} />
                      </div>
                      <h2 className="font-serif text-2xl mb-3" style={{ color: "#3B2F2A" }}>
                        {submitReason === "resent" ? "Confirmation Email Resent!" : "Check Your Email!"}
                      </h2>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: "#4A4A4A" }}>
                        {submitReason === "resent"
                          ? `We've resent your confirmation email to ${form.email}. Click the link inside to confirm your entry.`
                          : `We've sent a confirmation email to ${form.email}. Click the link inside to complete your entry!`}
                      </p>
                      <div className="rounded-xl px-4 py-3 text-sm mb-4" style={{ background: "#F7F3EE", color: "#A8B3AA" }}>
                        Didn't receive it? Check your spam folder, or{" "}
                        <button onClick={() => { setSubmitted(false); setSubmitReason(null); }} className="underline" style={{ color: "#CFA7A0" }}>try again</button>.
                      </div>
                    </>
                  )}
                  <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "#CFA7A0" }}>
                    Back to Home <ChevronRight size={14} />
                  </Link>
                </div>
              )}

              {/* Social Share — always visible */}
              <div className="mt-6">
                <SocialSharePanel />
              </div>
            </div>

            {/* Right: Info Panel */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl mb-3" style={{ color: "#3B2F2A" }}>How It Works</h2>
                <p className="text-sm leading-relaxed" style={{ color: "#4A4A4A" }}>
                  Every month, we draw one lucky winner from all confirmed entries. The winner receives a complimentary waxing service at any of our six Utah locations — a $25–$80 value!
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <Gift size={18} style={{ color: "#CFA7A0" }} />, title: "1. Enter Your Info", desc: "Fill out the simple form with your name and email address.", sage: false },
                  { icon: <Mail size={18} style={{ color: "#A8B3AA" }} />, title: "2. Confirm Your Email", desc: "Click the confirmation link we send you to secure your entry.", sage: true },
                  { icon: <Calendar size={18} style={{ color: "#CFA7A0" }} />, title: "3. Monthly Drawing", desc: "One winner is randomly selected at the start of each month.", sage: false },
                  { icon: <Star size={18} style={{ color: "#A8B3AA" }} />, title: "4. Enjoy Your Free Wax!", desc: "Winners are notified by email and can book at any location.", sage: true },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: "#ffffff", border: `1px solid ${step.sage ? "#A8B3AA40" : "#D8C6B6"}` }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: step.sage ? "rgba(168,179,170,0.15)" : "rgba(207,167,160,0.15)" }}>
                      {step.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: "#3B2F2A" }}>{step.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#A8B3AA" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "rgba(168,179,170,0.12)", border: "1px solid #A8B3AA" }}>
                <MapPin size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#A8B3AA" }} />
                <p className="text-xs leading-relaxed" style={{ color: "#4A4A4A" }}>
                  Redeemable at any of our{" "}
                  <Link href="/locations" className="underline font-medium" style={{ color: "#3B2F2A" }}>6 Utah locations</Link>
                  : Layton, South Jordan, Orem, Salt Lake City, Draper, and St. George.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-12 px-6 text-center" style={{ background: "linear-gradient(135deg, #3B2F2A 0%, #4a3d38 100%)" }}>
        <p className="font-serif text-xl mb-2" style={{ color: "#F7F3EE" }}>Can't wait to win? Book your appointment today.</p>
        <p className="text-sm mb-6" style={{ color: "#A8B3AA" }}>Professional waxing services starting at $12 — From Brows to Toes &amp; Anything in Between!™</p>
        <a href="https://app.mangomint.com/waxmetoo" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all"
          style={{ background: "linear-gradient(90deg, #CFA7A0, #A8B3AA)", color: "#3B2F2A" }}>
          Book Now <ChevronRight size={16} />
        </a>
      </section>
    </Layout>
  );
}
