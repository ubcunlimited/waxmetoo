import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <section className="bg-[#3B2F2A] py-16">
        <div className="container">
          <p className="section-label text-[#CFA7A0] mb-3">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl text-white">Terms & Conditions</h1>
          <p className="text-[#D8C6B6] font-body mt-3">Last updated: April 2025</p>
        </div>
      </section>
      <section className="py-14 bg-[#F7F3EE]">
        <div className="container max-w-3xl">
          <div className="prose prose-lg max-w-none font-body text-[#4A4A4A] space-y-6">
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using the Wax Me Too website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">2. Booking and Appointments</h2>
              <p>Appointments are subject to availability. We reserve the right to refuse service to anyone. By booking an appointment, you agree to our cancellation policy: cancellations or rescheduling must be made at least 24 hours in advance. Late cancellations or no-shows may be subject to a fee.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">3. Health and Safety</h2>
              <p>Clients are responsible for disclosing any relevant health conditions, medications, or skin sensitivities prior to receiving services. Wax Me Too is not liable for adverse reactions resulting from undisclosed health information. Certain medications and skin conditions may contraindicate waxing services.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">4. Pricing</h2>
              <p>Prices are subject to change without notice. Pricing is displayed on our services page. The displayed prices are for reference only; final pricing may vary by location. We reserve the right to modify pricing at any time.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">5. Promotions and Offers</h2>
              <p>Promotional offers, including the new client discount, are subject to availability and may be modified or discontinued at any time. Offers cannot be combined with other promotions unless explicitly stated. New client offers are valid for first-time clients only.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">6. Intellectual Property</h2>
              <p>All content on this website, including text, graphics, logos, images, and software, is the property of Wax Me Too and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">7. Limitation of Liability</h2>
              <p>Wax Me Too shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services or website. Our total liability shall not exceed the amount paid for the specific service giving rise to the claim.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">8. Privacy</h2>
              <p>Your use of our website and services is also governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>
            </div>
            <div id="ai-disclosure" className="bg-[#D8C6B6] rounded-lg p-6">
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">9. AI Content Disclosure</h2>
              <p className="font-600 text-[#3B2F2A] mb-2">Transparency Notice Regarding AI-Assisted Content</p>
              <p>Some content on this website, including certain educational articles, service descriptions, and informational copy, may have been drafted or refined with the assistance of artificial intelligence (AI) tools. All AI-assisted content is reviewed, edited, and approved by our team prior to publication to ensure accuracy, brand alignment, and compliance with our standards.</p>
              <p className="mt-3">AI-generated content on this site is intended to be informational and educational. It does not constitute medical advice. Always consult a qualified professional for medical or health-related decisions. We are committed to transparency and will continue to update our disclosure practices as AI technology and best practices evolve.</p>
              <p className="mt-3 text-sm text-[#4A4A4A]">If you have questions about specific content on this site, please contact us at: content@waxmetoo.com</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">10. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the State of Utah, without regard to its conflict of law provisions.</p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">11. Contact</h2>
              <p>For questions regarding these Terms and Conditions, please contact us at: legal@waxmetoo.com</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
