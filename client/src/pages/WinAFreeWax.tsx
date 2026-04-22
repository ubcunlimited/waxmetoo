/**
 * Win a Free Wax — Giveaway Landing Page
 * Route: /win-a-free-wax
 *
 * Collects first name, last name, and email.
 * On submit, calls trpc.giveaway.enter and shows success/error state.
 */

import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Gift, CheckCircle, Mail, ChevronRight, Star, Calendar, MapPin } from "lucide-react";

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
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "#CFA7A0", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "#D8C6B6", transform: "translate(-30%, 30%)" }}
        />

        <div className="relative z-10 text-center px-6 py-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(207,167,160,0.2)", border: "1px solid rgba(207,167,160,0.4)" }}>
            <Gift size={16} style={{ color: "#CFA7A0" }} />
            <span className="text-sm font-medium" style={{ color: "#CFA7A0", letterSpacing: "0.05em" }}>
              Monthly Giveaway
            </span>
          </div>
          <h1
            className="font-serif mb-4"
            style={{ color: "#F7F3EE", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", lineHeight: 1.15 }}
          >
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
                <div
                  className="rounded-2xl p-8 shadow-lg"
                  style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
                >
                  <h2 className="font-serif text-2xl mb-2" style={{ color: "#3B2F2A" }}>
                    Enter the Giveaway
                  </h2>
                  <p className="text-sm mb-6" style={{ color: "#A8B3AA" }}>
                    Fill out the form below. You'll receive a confirmation email — click the link inside to complete your entry.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* First Name */}
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#3B2F2A" }}
                      >
                        First Name <span style={{ color: "#CFA7A0" }}>*</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          border: errors.firstName ? "1.5px solid #e57373" : "1.5px solid #D8C6B6",
                          background: "#F7F3EE",
                          color: "#3B2F2A",
                        }}
                        placeholder="Jane"
                      />
                      {errors.firstName && (
                        <p className="text-xs mt-1" style={{ color: "#e57373" }}>{errors.firstName}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#3B2F2A" }}
                      >
                        Last Name <span style={{ color: "#CFA7A0" }}>*</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          border: errors.lastName ? "1.5px solid #e57373" : "1.5px solid #D8C6B6",
                          background: "#F7F3EE",
                          color: "#3B2F2A",
                        }}
                        placeholder="Smith"
                      />
                      {errors.lastName && (
                        <p className="text-xs mt-1" style={{ color: "#e57373" }}>{errors.lastName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#3B2F2A" }}
                      >
                        Email Address <span style={{ color: "#CFA7A0" }}>*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={{
                          border: errors.email ? "1.5px solid #e57373" : "1.5px solid #D8C6B6",
                          background: "#F7F3EE",
                          color: "#3B2F2A",
                        }}
                        placeholder="jane@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs mt-1" style={{ color: "#e57373" }}>{errors.email}</p>
                      )}
                    </div>

                    {/* Form-level error */}
                    {errors.form && (
                      <div
                        className="rounded-xl px-4 py-3 text-sm"
                        style={{ background: "#fef2f2", color: "#e57373", border: "1px solid #fecaca" }}
                      >
                        {errors.form}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={enterMutation.isPending}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                      style={{
                        background: enterMutation.isPending ? "#D8C6B6" : "#CFA7A0",
                        color: "#ffffff",
                        cursor: enterMutation.isPending ? "not-allowed" : "pointer",
                      }}
                    >
                      {enterMutation.isPending ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Gift size={16} />
                          Enter the Giveaway
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center" style={{ color: "#A8B3AA" }}>
                      By entering, you agree to receive a one-time confirmation email. No spam, ever.
                      See our{" "}
                      <Link href="/privacy" className="underline" style={{ color: "#CFA7A0" }}>
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </form>
                </div>
              ) : (
                /* Success State */
                <div
                  className="rounded-2xl p-8 shadow-lg text-center"
                  style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
                >
                  {submitReason === "already_confirmed" ? (
                    <>
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: "#F7F3EE" }}
                      >
                        <CheckCircle size={32} style={{ color: "#A8B3AA" }} />
                      </div>
                      <h2 className="font-serif text-2xl mb-3" style={{ color: "#3B2F2A" }}>
                        You're Already Entered!
                      </h2>
                      <p className="text-sm leading-relaxed mb-6" style={{ color: "#4A4A4A" }}>
                        This email address is already confirmed and entered in the giveaway. Good luck — we draw a winner each month!
                      </p>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ background: "rgba(207,167,160,0.15)" }}
                      >
                        <Mail size={32} style={{ color: "#CFA7A0" }} />
                      </div>
                      <h2 className="font-serif text-2xl mb-3" style={{ color: "#3B2F2A" }}>
                        {submitReason === "resent" ? "Confirmation Email Resent!" : "Check Your Email!"}
                      </h2>
                      <p className="text-sm leading-relaxed mb-6" style={{ color: "#4A4A4A" }}>
                        {submitReason === "resent"
                          ? `We've resent your confirmation email to ${form.email}. Click the link inside to confirm your entry.`
                          : `We've sent a confirmation email to ${form.email}. Click the link inside to complete your entry and be eligible to win!`}
                      </p>
                      <div
                        className="rounded-xl px-4 py-3 text-sm mb-6"
                        style={{ background: "#F7F3EE", color: "#A8B3AA" }}
                      >
                        Didn't receive it? Check your spam folder, or{" "}
                        <button
                          onClick={() => { setSubmitted(false); setSubmitReason(null); }}
                          className="underline"
                          style={{ color: "#CFA7A0" }}
                        >
                          try again
                        </button>
                        .
                      </div>
                    </>
                  )}
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium"
                    style={{ color: "#CFA7A0" }}
                  >
                    Back to Home <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* Right: Info Panel */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl mb-3" style={{ color: "#3B2F2A" }}>
                  How It Works
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "#4A4A4A" }}>
                  Every month, we draw one lucky winner from all confirmed entries. The winner receives a complimentary waxing service at any of our six Utah locations — a $25–$80 value!
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {[
                  {
                    icon: <Gift size={18} style={{ color: "#CFA7A0" }} />,
                    title: "1. Enter Your Info",
                    desc: "Fill out the simple form with your name and email address.",
                  },
                  {
                    icon: <Mail size={18} style={{ color: "#CFA7A0" }} />,
                    title: "2. Confirm Your Email",
                    desc: "Click the confirmation link we send you to secure your entry.",
                  },
                  {
                    icon: <Calendar size={18} style={{ color: "#CFA7A0" }} />,
                    title: "3. Monthly Drawing",
                    desc: "One winner is randomly selected at the start of each month.",
                  },
                  {
                    icon: <Star size={18} style={{ color: "#CFA7A0" }} />,
                    title: "4. Enjoy Your Free Wax!",
                    desc: "Winners are notified by email and can book at any location.",
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(207,167,160,0.15)" }}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-0.5" style={{ color: "#3B2F2A" }}>
                        {step.title}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "#A8B3AA" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Locations note */}
              <div
                className="rounded-xl p-4 flex items-start gap-3"
                style={{ background: "rgba(168,179,170,0.12)", border: "1px solid #A8B3AA" }}
              >
                <MapPin size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#A8B3AA" }} />
                <p className="text-xs leading-relaxed" style={{ color: "#4A4A4A" }}>
                  Redeemable at any of our{" "}
                  <Link href="/locations" className="underline font-medium" style={{ color: "#3B2F2A" }}>
                    6 Utah locations
                  </Link>
                  : Layton, South Jordan, Orem, Salt Lake City, Draper, and St. George.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-12 px-6 text-center" style={{ background: "#3B2F2A" }}>
        <p className="font-serif text-xl mb-2" style={{ color: "#F7F3EE" }}>
          Can't wait to win? Book your appointment today.
        </p>
        <p className="text-sm mb-6" style={{ color: "#A8B3AA" }}>
          Professional waxing services starting at $12 — From Brows to Toes & Anything in Between!™
        </p>
        <a
          href="https://app.mangomint.com/waxmetoo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm transition-all"
          style={{ background: "#CFA7A0", color: "#ffffff" }}
        >
          Book Now <ChevronRight size={16} />
        </a>
      </section>
    </Layout>
  );
}
