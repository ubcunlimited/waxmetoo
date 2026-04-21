import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="bg-[#3B2F2A] py-16">
        <div className="container">
          <p className="section-label text-[#CFA7A0] mb-3">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl text-white">Privacy Policy</h1>
          <p className="text-[#D8C6B6] font-body mt-3">Last updated: April 2025</p>
        </div>
      </section>
      <section className="py-14 bg-[#F7F3EE]">
        <div className="container max-w-3xl">
          <div className="prose prose-lg max-w-none font-body text-[#4A4A4A] space-y-6">
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">1. Information We Collect</h2>
              <p>Wax Me Too ("we," "our," or "us") collects information you provide directly to us when you book an appointment, contact us, or sign up for communications. This includes your name, email address, phone number, and any other information you choose to provide.</p>
              <p>We also collect certain information automatically when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about your visit.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to: provide, maintain, and improve our services; process bookings and appointments; send you confirmations, reminders, and service-related communications; send promotional communications (with your consent); respond to your comments and questions; and comply with legal obligations.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">3. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">4. Booking Platform</h2>
              <p>Our online booking is powered by Mangomint. When you book an appointment through our website, you may be directed to Mangomint's platform. Please review Mangomint's privacy policy for information about how they handle your data.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">5. Cookies and Tracking</h2>
              <p>We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">6. Data Security</h2>
              <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">7. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at the information provided below.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">8. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at: privacy@waxmetoo.com</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
