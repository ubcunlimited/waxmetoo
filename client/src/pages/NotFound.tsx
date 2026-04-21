import { Link } from "wouter";
import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center justify-center bg-[#F7F3EE]">
        <div className="container text-center py-20">
          <p className="section-label text-[#CFA7A0] mb-4">404 — Page Not Found</p>
          <h1 className="font-display text-6xl md:text-8xl text-[#3B2F2A] mb-4">Oops.</h1>
          <p className="font-body text-[#4A4A4A] text-lg mb-8 max-w-md mx-auto">
            We couldn't find the page you're looking for. It may have moved or no longer exists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <span className="btn-primary">Back to Home</span>
            </Link>
            <Link href="/services">
              <span className="btn-outline">View Services</span>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
