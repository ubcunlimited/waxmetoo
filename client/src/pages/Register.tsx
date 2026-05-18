import { useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const mascotStanding = "/manus-storage/mascot_v2_transparent_983f0933.webp";

export default function Register() {
  const { isAuthenticated, loading } = useAuth();

  // If already logged in, redirect to mascot hunt
  useEffect(() => {
    if (!loading && isAuthenticated) {
      window.location.href = "/mascot-hunt";
    }
  }, [isAuthenticated, loading]);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#3D1A1A] to-[#6B2D2D] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #A8B3AA 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #D4A0A0 0%, transparent 40%)`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-[#A8B3AA] inline-block" />
            Where's Waldo — Wax Me Too Edition
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Create Your Account to<br />
            <span className="text-[#D4A0A0]">Join the Mascot Hunt</span>
          </h1>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            Sign in or create a free account to track your finds across all 11 pages.
            Find every hidden mascot and earn a <strong className="text-white">15% discount</strong> on your next wax!
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Mascot image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-[#A8B3AA]/20 flex items-center justify-center">
                <img
                  src={mascotStanding}
                  alt="Wax Me Too mascot"
                  className="w-40 h-auto object-contain drop-shadow-lg"
                />
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#D4A0A0]/60" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-[#A8B3AA]/60" />
            </div>
          </div>

          {/* Sign-in card */}
          <div className="bg-white rounded-2xl shadow-md border border-[#E8E0D8] p-8">
            <h2 className="text-2xl font-bold text-[#3D1A1A] mb-2">
              Sign In to Play
            </h2>
            <p className="text-[#7A6A5A] text-sm mb-6">
              We use secure single sign-on — no password to remember. Your hunt progress is saved automatically once you're signed in.
            </p>

            <a
              href={getLoginUrl()}
              className="block w-full text-center bg-[#3D1A1A] hover:bg-[#5A2828] text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-200 mb-4"
            >
              Sign In / Create Account
            </a>

            <p className="text-xs text-center text-[#9A8A7A]">
              By signing in you agree to our{" "}
              <Link href="/terms" className="underline hover:text-[#3D1A1A]">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-[#3D1A1A]">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#3D1A1A] text-center mb-8">
            How the Mascot Hunt Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Create Your Account",
                desc: "Sign in with your Manus account. It's free and takes seconds.",
                color: "#D4A0A0",
              },
              {
                step: "02",
                title: "Hunt Across 11 Pages",
                desc: "Our mascot is hiding somewhere on every page of the site. She's sneaky — look carefully!",
                color: "#A8B3AA",
              },
              {
                step: "03",
                title: "Earn Your Discount",
                desc: "Find all 11 mascots and unlock a one-time 15% discount code to use at booking.",
                color: "#D4A0A0",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-xl border border-[#E8E0D8] p-6 text-center shadow-sm"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-4"
                  style={{ backgroundColor: item.color }}
                >
                  {item.step}
                </div>
                <h3 className="font-semibold text-[#3D1A1A] mb-2">{item.title}</h3>
                <p className="text-sm text-[#7A6A5A]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Already have progress */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[#7A6A5A]">
            Already have an account?{" "}
            <a href={getLoginUrl()} className="text-[#3D1A1A] font-semibold underline hover:text-[#6B2D2D]">
              Sign in to see your progress
            </a>
            {" "}or{" "}
            <Link href="/mascot-hunt" className="text-[#3D1A1A] font-semibold underline hover:text-[#6B2D2D]">
              view the hunt tracker
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
