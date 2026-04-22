/**
 * Giveaway Email Confirmation Page
 * Route: /win-a-free-wax/confirm?token=...
 *
 * Reads the token from the URL search params and calls trpc.giveaway.confirm.
 * Shows success or error state.
 */

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { CheckCircle, XCircle, Loader2, ChevronRight, Gift } from "lucide-react";

export default function GiveawayConfirm() {
  const [location] = useLocation();
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [status, setStatus] = useState<"loading" | "success" | "already" | "error">("loading");
  const [firstName, setFirstName] = useState<string | null>(null);
  const hasRun = useRef(false);

  const confirmMutation = trpc.giveaway.confirm.useMutation({
    onSuccess(data) {
      if (data.success) {
        setFirstName(data.firstName ?? null);
        setStatus(data.reason === "already_confirmed" ? "already" : "success");
      } else {
        setStatus("error");
      }
    },
    onError() {
      setStatus("error");
    },
  });

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setStatus("error");
      return;
    }
    confirmMutation.mutate({ token });
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #3B2F2A 0%, #5a3e38 100%)" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ background: "rgba(207,167,160,0.2)", border: "1px solid rgba(207,167,160,0.4)" }}>
          <Gift size={16} style={{ color: "#CFA7A0" }} />
          <span className="text-sm font-medium" style={{ color: "#CFA7A0", letterSpacing: "0.05em" }}>
            Win a Free Wax
          </span>
        </div>
        <h1 className="font-serif mb-3" style={{ color: "#F7F3EE", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          Entry Confirmation
        </h1>
        <p style={{ color: "#D8C6B6" }}>Wax Me Too Monthly Giveaway</p>
      </section>

      {/* Status Card */}
      <section className="py-20 px-6" style={{ background: "#F7F3EE" }}>
        <div className="max-w-lg mx-auto">
          <div
            className="rounded-2xl p-10 shadow-lg text-center"
            style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
          >
            {status === "loading" && (
              <>
                <Loader2
                  size={48}
                  className="mx-auto mb-4 animate-spin"
                  style={{ color: "#CFA7A0" }}
                />
                <h2 className="font-serif text-2xl mb-3" style={{ color: "#3B2F2A" }}>
                  Confirming Your Entry…
                </h2>
                <p className="text-sm" style={{ color: "#A8B3AA" }}>
                  Just a moment while we verify your confirmation link.
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(207,167,160,0.15)" }}
                >
                  <CheckCircle size={40} style={{ color: "#CFA7A0" }} />
                </div>
                <h2 className="font-serif text-2xl mb-3" style={{ color: "#3B2F2A" }}>
                  You're In{firstName ? `, ${firstName}` : ""}! 🎉
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#4A4A4A" }}>
                  Your entry has been confirmed! You're now eligible to win a complimentary waxing service. We draw one winner at the start of each month — good luck!
                </p>
                <div
                  className="rounded-xl px-4 py-3 text-sm mb-8"
                  style={{ background: "#F7F3EE", color: "#A8B3AA" }}
                >
                  If you win, we'll notify you at the email address you provided.
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://app.mangomint.com/waxmetoo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                    style={{ background: "#CFA7A0", color: "#ffffff" }}
                  >
                    Book an Appointment
                  </a>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                    style={{ background: "#F7F3EE", color: "#3B2F2A", border: "1.5px solid #D8C6B6" }}
                  >
                    Back to Home <ChevronRight size={14} />
                  </Link>
                </div>
              </>
            )}

            {status === "already" && (
              <>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(168,179,170,0.15)" }}
                >
                  <CheckCircle size={40} style={{ color: "#A8B3AA" }} />
                </div>
                <h2 className="font-serif text-2xl mb-3" style={{ color: "#3B2F2A" }}>
                  Already Confirmed{firstName ? `, ${firstName}` : ""}!
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#4A4A4A" }}>
                  Your entry was already confirmed. You're in the drawing — we'll notify you if you win!
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium"
                  style={{ color: "#CFA7A0" }}
                >
                  Back to Home <ChevronRight size={14} />
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(229,115,115,0.1)" }}
                >
                  <XCircle size={40} style={{ color: "#e57373" }} />
                </div>
                <h2 className="font-serif text-2xl mb-3" style={{ color: "#3B2F2A" }}>
                  Invalid or Expired Link
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#4A4A4A" }}>
                  This confirmation link is invalid or has expired. Confirmation links are valid for 48 hours. Please enter the giveaway again to receive a new link.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/win-a-free-wax"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                    style={{ background: "#CFA7A0", color: "#ffffff" }}
                  >
                    <Gift size={16} /> Enter Again
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
                    style={{ background: "#F7F3EE", color: "#3B2F2A", border: "1.5px solid #D8C6B6" }}
                  >
                    Back to Home
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
