/**
 * WAX ME TOO — Blog Post Detail Page
 * Design: Modern Feminine Craft
 * Real blog content pulled from waxmetoo.blogspot.com and SEO-optimized
 */

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { blogPosts, BOOKING_URL } from "@/lib/data";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// SEO-optimized article content for each real blog post
function getArticleContent(slug: string): string {
  switch (slug) {
    case "win-complimentary-bikini-wax-summer":
      return `
        <p>Summer is just around the corner, and at <strong>Wax Me Too</strong> — Utah's premier professional waxing studio — we're celebrating the season with something special: a chance to win a complimentary bikini wax. All you have to do is fill out a quick form on our website. Winners are announced by text monthly, sometimes sooner!</p>

        <h2>Why Waxing Is the Ultimate Summer Upgrade</h2>
        <p>Picture yourself floating on crystal-clear water at the beach or poolside, completely confident in your swimsuit. That's the Wax Me Too promise. Professional waxing removes hair from the root, leaving your skin silky smooth for 3–6 weeks — no razor burns, no nicks, no daily shaving routine.</p>
        <p>And if you're feeling adventurous, you can always upgrade your bikini wax to a full <strong>Brazilian wax</strong> for a small additional fee. Once you experience the results, you'll wonder why you waited so long.</p>

        <h2>The Real Benefits of Professional Waxing</h2>
        <p>Waxing isn't just about aesthetics — it's a long-term investment in your skin. Here's what regular waxing clients experience over time:</p>
        <ul>
          <li><strong>Finer, sparser regrowth.</strong> With each waxing session, hair grows back progressively finer and softer. Long-term clients often report that their appointments become noticeably more comfortable after just a few sessions.</li>
          <li><strong>No more daily shaving.</strong> Say goodbye to the morning razor routine and hello to weeks of smooth, carefree skin.</li>
          <li><strong>Better skin texture.</strong> Waxing acts as a mild exfoliant, removing dead skin cells along with unwanted hair and leaving skin visibly smoother.</li>
          <li><strong>Long-lasting results.</strong> Unlike shaving, which only lasts a day or two, a professional wax keeps you smooth for 3–6 weeks depending on your hair growth cycle.</li>
        </ul>

        <h2>Summer Skin Care: What the Experts Recommend</h2>
        <p>Beyond waxing, protecting your skin during summer months is essential. After your wax, always apply SPF to freshly waxed areas before sun exposure — skin is more sensitive immediately after a waxing service. Stay hydrated, moisturize daily with a fragrance-free lotion, and exfoliate gently 2–3 times per week starting 48 hours after your appointment to prevent ingrown hairs.</p>

        <h2>About Wax Me Too Salons</h2>
        <p>Wax Me Too has been serving Utah since 2007. We are a locally run, women-owned business — and the <strong>first waxing-only salon to open in Utah</strong>. Today, we have 6 locations across the state: Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. From Weber County to Utah County, and from Washington County to Mesquite, Nevada, we're Utah's most trusted name in professional waxing.</p>
        <p>Ready to enter the giveaway? Visit our website, scroll to the bottom of the page, and fill out the form. Your smooth summer starts here.</p>
      `;

    case "st-george-premier-waxing-salon":
      return `
        <p>Hello, St. George! Let's take a journey back to 2007, when <strong>Wax Me Too Salons</strong> — Utah's pioneering waxing-only studio — first opened its doors in Draper. By 2008, we proudly extended our services to the beautiful city of St. George. And now, in 2024, we remain the <strong>premier waxing salon in Southern Utah</strong>, operating out of Salon Aubri McKai with two full treatment rooms on the upper floor.</p>

        <h2>Who We Serve in St. George</h2>
        <p>Our St. George clientele is as diverse as the city itself. From students at Dixie State and Utah Tech to working professionals, retirees living the good life in the most beautiful desert area of the state, and visitors from nearby Mesquite, Nevada — we welcome everyone. Whether you're a longtime patron or considering waxing for the first time, the Wax Me Too experience is designed to make you feel comfortable, confident, and cared for.</p>

        <h2>Our Signature Services</h2>
        <p>We specialize in the ever-popular <strong>Brazilian wax</strong>, catering to both men and women. Yes — gentlemen, we offer the renowned "Manzilian" service as well. But our expertise doesn't stop there. Our licensed estheticians excel in:</p>
        <ul>
          <li>Eyebrow design, waxing, and tinting</li>
          <li>Full body waxing — from brows to toes and anything in between</li>
          <li>Brow treatments featuring <strong>The London Brow Company</strong> product line</li>
        </ul>

        <h2>Introducing The London Brow Company — Exclusively at Wax Me Too</h2>
        <p>We are proud to be the <strong>exclusive salon in the entire state of Utah</strong> to carry The London Brow Company's extraordinary product line. These products are renowned for their exceptional quality, vegan formulations, and commitment to cruelty-free, sustainable production. Every product is crafted with care for both your skin and the environment.</p>
        <p>At Wax Me Too, we align with brands that share our values — and The London Brow Company embodies exactly that: outstanding results, ethical practices, and a deep respect for animal welfare.</p>

        <h2>What Sets Wax Me Too Apart</h2>
        <p>In a market full of waxing options, here's what makes Wax Me Too different:</p>
        <ul>
          <li><strong>Locally owned and operated by women.</strong> We're not a franchise. We're not backed by outside investors. When you wax with us, you're supporting Utah women directly.</li>
          <li><strong>Sinks in every treatment room.</strong> We believe your esthetician should wash her hands in front of you before every service — and our rooms are designed to make that possible.</li>
          <li><strong>No memberships. No pressure.</strong> Transparent pricing, no stored credit card details, and a "no hairs left behind" guarantee on every service.</li>
          <li><strong>Privacy and dignity.</strong> We step out of the room while you prepare, ensuring you always feel comfortable and respected.</li>
        </ul>

        <h2>Book Your St. George Waxing Appointment</h2>
        <p>Our St. George studio is located inside Salon Aubri McKai. We serve clients from across Washington County and neighboring Mesquite, Nevada. Book online at waxmetoo.com — it takes just a few clicks to find your preferred esthetician, service, and time slot.</p>
      `;

    case "vacation-waxing-prep-guide":
      return `
        <p>Sunscreen — check. Sunglasses — check. Itsy bitsy bikini — check. Razor? Throw that away.</p>
        <p>Whether you're jetting off to a tropical beach or escaping Utah's winter for a sunny resort, pre-vacation waxing is the single best thing you can do for your skin before you go. At <strong>Wax Me Too</strong>, Utah's professional waxing studio since 2007, we've helped thousands of clients step into paradise with smooth, confident skin. Here's everything you need to know.</p>

        <h2>Timing Is Everything: When to Book Before Your Trip</h2>
        <p>The golden rule of pre-vacation waxing: <strong>book your appointment 2–3 days before you leave.</strong> This gives your skin time to settle after the service while ensuring you arrive at your destination completely hair-free. That means up to 2–3 weeks of smooth skin without a single thought about shaving.</p>
        <p>One important note: your hair needs to be at least <strong>¼ inch long</strong> (roughly 10 days of growth from your last shave) for the wax to grip effectively. If you've been shaving regularly, stop at least 10 days before your appointment.</p>
        <p>If you're a first-time waxer, we strongly recommend <strong>not waiting until the day before your vacation</strong> to try it out. While most clients experience only mild, temporary redness, a small number may have a skin reaction. Give yourself time to see how your skin responds before your trip.</p>

        <h2>Questions to Ask Before Choosing a Waxing Salon</h2>
        <p>Not all waxing salons are created equal. Before booking, here are the key questions to ask:</p>
        <ul>
          <li><strong>Is there a sink in the treatment room?</strong> Your esthetician should wash her hands in front of you before beginning. This is a non-negotiable hygiene standard at Wax Me Too.</li>
          <li><strong>Do they use gloves?</strong> Gloves provide an extra layer of protection and are standard practice at our studios.</li>
          <li><strong>Do they double-dip?</strong> Reusing the same applicator stick in the wax pot is a serious hygiene violation. At Wax Me Too, we use fresh, single-use applicators for every client — always.</li>
          <li><strong>How experienced are their estheticians?</strong> Mastering the Brazilian wax takes real skill and practice. Our team has years of experience and specializes exclusively in waxing.</li>
        </ul>

        <h2>The Brazilian Wax: Your Best Vacation Investment</h2>
        <p>For beach and pool vacations, the <strong>Brazilian wax</strong> is the ultimate pre-trip service. Here's why:</p>
        <ul>
          <li><strong>Weeks of smooth, confident skin.</strong> No worrying about stubble peeking out of your swimsuit. No razor burns. No ingrown hairs from shaving in a hotel bathroom.</li>
          <li><strong>Long-lasting results.</strong> A single Brazilian wax provides 3–6 weeks of smoothness — more than enough to cover your entire trip and then some.</li>
          <li><strong>Hygienic and comfortable.</strong> Waxing removes hair from the root, reducing the risk of irritation and ingrown hairs compared to shaving.</li>
          <li><strong>Customizable.</strong> Whether you prefer a completely bare look or a neatly trimmed style, our estheticians will work to your preferences.</li>
        </ul>

        <h2>Pre-Vacation Waxing for Men Too</h2>
        <p>Men are increasingly choosing waxing as their preferred grooming method before vacations. Popular services include:</p>
        <ul>
          <li><strong>Back and chest waxing</strong> — for a clean, polished look at the beach or pool</li>
          <li><strong>The Manzilian</strong> — our Brazilian wax service for men, performed with the same expertise and discretion</li>
          <li><strong>Arm and leg waxing</strong> — for athletes and anyone who prefers a smooth, low-maintenance look</li>
        </ul>

        <h2>Book at Any of Our 6 Utah Locations</h2>
        <p>Wax Me Too has 6 convenient locations across Utah: Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Book online at waxmetoo.com and select your preferred location, esthetician, and time. New clients receive 20% off their first service.</p>
      `;

    case "military-discounts-wax-me-too-layton":
      return `
        <p>At <strong>Wax Me Too in Layton, Utah</strong>, we have always held a deep respect for the men and women who serve our country. Located just minutes from <strong>Hill Air Force Base</strong>, our Layton studio has been a trusted destination for military personnel and their families since we opened our doors in that community.</p>

        <h2>Meet Liz: Retired Air Force Master Sergeant, Waxing Expert</h2>
        <p>In 2018, we welcomed a remarkable addition to our Layton team: <strong>Liz</strong>, a retired Air Force Master Sergeant whose dedication to service seamlessly transitioned into a passion for esthetics. After retiring from the Air Force, Liz pursued her dream of mastering the art of skincare and waxing, completing her esthetics education before joining our team.</p>
        <p>Now in 2024, we celebrate six years of Liz's tenure as one of our most beloved waxing professionals. Her precision, professionalism, and genuine care for every client reflect the same values she carried throughout her military career. Clients who book with Liz often become long-term regulars — and it's easy to see why.</p>

        <h2>Our Military Discount Program</h2>
        <p>As a gesture of gratitude to our nation's heroes, <strong>Wax Me Too Layton proudly offers special pricing for all active military personnel and their families.</strong> When booking online, simply look for the "military discount" option on our most popular services. It's our humble way of saying thank you to those who have given so much in service to our country.</p>
        <p>We understand the unique challenges faced by military families — the demanding schedules, the deployments, the constant transitions. Our flexible booking system and extended hours (open early to late, Monday through Saturday) are designed to accommodate even the busiest schedules.</p>

        <h2>What Makes Our Layton Studio Special</h2>
        <p>Our Layton location at <strong>360 S Fort Lane #101</strong> is one of our flagship studios. Here's what sets it apart:</p>
        <ul>
          <li><strong>A team of six expert estheticians</strong>, each bringing a unique blend of skill and passion to their craft</li>
          <li><strong>Flexible scheduling</strong> — our estheticians set their own hours, which means more availability for clients with non-traditional schedules</li>
          <li><strong>Family-first culture</strong> — we believe in supporting our team members' personal lives, which translates to a happier, more dedicated staff</li>
          <li><strong>No memberships, no pressure</strong> — just honest, transparent pricing and exceptional service every time</li>
        </ul>

        <h2>Booking Your Appointment</h2>
        <p>Book online at waxmetoo.com and select the Layton location. You'll see a full list of our estheticians, available services, and appointment times. Military personnel: look for the military discount option when selecting your service. We're honored to serve you.</p>
      `;

    case "why-waxing-is-best-hair-removal":
      return `
        <p>When it comes to hair removal, the options seem endless — shaving, depilatory creams, laser, threading, sugaring. But for millions of people, professional waxing remains the gold standard. At <strong>Wax Me Too</strong>, Utah's waxing-only studio since 2007, we've seen firsthand why clients who try professional waxing rarely go back to anything else.</p>

        <h2>Why Waxing Outperforms Other Hair Removal Methods</h2>
        <p>The fundamental difference between waxing and shaving is simple: waxing removes hair <strong>from the root</strong>, while shaving only cuts it at the surface. This single distinction creates a cascade of benefits:</p>
        <ul>
          <li><strong>Longer-lasting results.</strong> Shaving lasts 1–3 days. Waxing lasts 3–6 weeks. The math speaks for itself.</li>
          <li><strong>Finer regrowth over time.</strong> With consistent waxing, hair grows back progressively finer, softer, and sparser. Long-term clients often report that their hair barely grows back at all in some areas after years of regular waxing.</li>
          <li><strong>No razor burn or stubble.</strong> Waxed skin is genuinely smooth — not the sandpaper-like texture that appears within hours of shaving.</li>
          <li><strong>Exfoliation benefit.</strong> Waxing removes a layer of dead skin cells along with the hair, leaving skin visibly smoother and more radiant.</li>
        </ul>

        <h2>What to Look for in a Professional Waxing Salon</h2>
        <p>Not all waxing experiences are equal. The quality of your results depends heavily on the skill of your esthetician and the standards of the salon. Here's what separates a great waxing studio from a mediocre one:</p>
        <ul>
          <li><strong>No double-dipping.</strong> Reusing the same applicator stick in the wax pot is a hygiene violation that can spread bacteria. At Wax Me Too, we use fresh, single-use applicators for every client — no exceptions.</li>
          <li><strong>Sinks in the treatment room.</strong> Your esthetician should wash her hands in your presence before beginning any service. Our treatment rooms are all equipped with sinks for exactly this reason.</li>
          <li><strong>Experienced estheticians.</strong> Brazilian waxing is a skill that takes time to master. Our team specializes exclusively in waxing, which means they perform these services every day and have refined their technique over years of practice.</li>
          <li><strong>Privacy and dignity.</strong> A professional salon respects your comfort. At Wax Me Too, we step out of the room while you prepare, and we ensure you never feel rushed or uncomfortable.</li>
        </ul>

        <h2>The Brazilian Wax: Utah's Most Popular Service</h2>
        <p>Among all waxing services, the <strong>Brazilian wax</strong> is consistently our most requested. It's also the service that generates the most questions from first-time clients — and understandably so. Here's what you should know:</p>
        <ul>
          <li>The appointment is scheduled for 30 minutes, though the actual waxing typically takes about 15 minutes. The extra time ensures you never feel rushed.</li>
          <li>Our estheticians are licensed professionals who perform this service daily. To them, it's simply their craft — and they're exceptionally good at it.</li>
          <li>First-time clients are often surprised by how manageable the experience is. Most describe it as a quick, sharp sensation that passes immediately — and it gets easier with every subsequent visit.</li>
        </ul>

        <h2>Wax Me Too: Utah's Waxing Specialists Since 2007</h2>
        <p>We opened Utah's first waxing-only salon in 2007 and have grown to 6 locations across the state. Our studios are locally owned and operated by women — not a franchise, not backed by outside investors. When you wax with us, you're supporting Utah women and receiving the expertise of a team that does nothing but wax, all day, every day.</p>
      `;

    case "bridal-waxing-guide":
      return `
        <p>Your wedding day is one of the most photographed, most celebrated days of your life. Every detail matters — from your dress to your flowers to your skin. At <strong>Wax Me Too</strong>, Utah's premier waxing studio, we've helped hundreds of brides achieve flawless, radiant skin for their big day. Here's everything you need to know about pre-wedding waxing.</p>

        <h2>Why Brides Should Start Waxing Early</h2>
        <p>We recommend that brides-to-be begin their waxing regimen <strong>at least 2–3 sessions before the wedding day</strong> — ideally starting 2–3 months in advance. Here's why:</p>
        <ul>
          <li><strong>Session 1: The assessment.</strong> Your first waxing session allows you to see how your skin responds to the service. Most clients experience mild, temporary redness that fades within a few hours. This session also gives your esthetician a chance to understand your hair growth patterns and customize your service.</li>
          <li><strong>Session 2: The improvement.</strong> By your second wax, you'll notice a significant reduction in discomfort. Hair grows back finer and sparser after the first removal, making the second session noticeably more comfortable.</li>
          <li><strong>Session 3: The perfection.</strong> By the third session, stubborn hairs that were in different growth phases have been captured, leaving behind only soft, baby-fine regrowth. This is the session that delivers the flawless result you want for your honeymoon.</li>
        </ul>

        <h2>Bridal Waxing Services: From Brows to Toes</h2>
        <p>A complete bridal waxing plan goes far beyond the Brazilian. Here's what our brides typically include in their pre-wedding regimen:</p>
        <ul>
          <li><strong>Eyebrow design and waxing.</strong> Your brows frame your face in every wedding photo. Our estheticians are experts at creating the perfect brow shape for your face structure — clean, defined, and camera-ready.</li>
          <li><strong>Brazilian or bikini wax.</strong> For your honeymoon and wedding night, a Brazilian wax ensures you feel completely confident and carefree.</li>
          <li><strong>Leg waxing.</strong> Silky-smooth legs under your wedding dress — no stubble, no razor burn, no last-minute shaving stress.</li>
          <li><strong>Arm waxing.</strong> For strapless or sleeveless gowns, smooth arms make a beautiful difference in photos.</li>
          <li><strong>Upper lip and facial waxing.</strong> For a flawless, makeup-ready complexion on your wedding day.</li>
        </ul>

        <h2>Timing Your Pre-Wedding Wax</h2>
        <p>For your final pre-wedding waxing appointment, we recommend booking <strong>2–3 days before your wedding</strong>. This gives your skin time to settle and any minor redness to fully resolve, while ensuring you're completely smooth for the big day.</p>
        <p>Avoid scheduling your wax the day before — while most clients are fine, we want to give your skin the best possible chance to look its absolute best.</p>

        <h2>Book Your Bridal Consultation</h2>
        <p>Wax Me Too has 6 locations across Utah: Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Book online at waxmetoo.com and mention that you're a bride — our estheticians love helping brides prepare for their special day. New clients receive 20% off their first service.</p>
        <p>Say "I do" to smooth, glowing skin. We can't wait to be part of your wedding journey.</p>
      `;

    case "south-jordan-waxing-salon-relocation":
      return `
        <p><strong>Wax Me Too</strong> is pleased to announce the relocation of our South Jordan studio to a beautiful new address: <strong>3674 W South Jordan Pkwy, South Jordan, Utah 84095</strong>. Our new space features two fully operational treatment rooms and is conveniently located for residents of both South Jordan and West Jordan.</p>

        <h2>The Same Expert Team, a Better Space</h2>
        <p>Our South Jordan location proudly stands as Wax Me Too's 6th Utah studio. The move to our new address allows us to serve more clients with greater comfort and privacy — two fully equipped treatment rooms mean shorter wait times and a more relaxed experience for everyone.</p>
        <p>Our team of experienced estheticians remains the same. The expertise, the standards, and the commitment to your comfort haven't changed — just the address.</p>

        <h2>8 Reasons Wax Me Too South Jordan Is Different</h2>
        <p>In a market full of waxing options, here's what makes our South Jordan studio stand apart:</p>
        <ul>
          <li><strong>1. Local, female-owned and operated.</strong> We're not a franchise. We're not governed by outside investors. When you choose Wax Me Too, you're supporting Utah women and receiving service tailored to your needs — not dictated by a corporate playbook.</li>
          <li><strong>2. Hygiene you can see.</strong> Our estheticians wash their hands in front of you before every service. Our treatment rooms are sanitized between every client. We never double-dip — ever.</li>
          <li><strong>3. No awkward positions.</strong> Unlike some salons that require uncomfortable positions during intimate waxing services, we ensure a relaxed, dignified experience throughout your appointment.</li>
          <li><strong>4. No memberships, no pressure.</strong> Transparent pricing, no monthly fees, no contracts. Our Brazilian wax is $60 — no hidden charges, no upselling pressure.</li>
          <li><strong>5. Experienced estheticians only.</strong> Mastering the Brazilian wax takes real skill. We don't train new graduates on clients. Our team has the experience to deliver clean, complete results every time.</li>
          <li><strong>6. Privacy and dignity.</strong> We step out of the room while you prepare, giving you the time and space to settle in comfortably before your service begins.</li>
          <li><strong>7. No rush.</strong> We schedule Brazilian waxes for 30-minute appointments even though the service typically takes 15 minutes. You'll never feel rushed or hurried out the door.</li>
          <li><strong>8. Complete cleanup.</strong> You won't leave our salon with any residue or discomfort. Our three-step cleanup process ensures you leave feeling fresh and confident.</li>
        </ul>

        <h2>Serving South Jordan, West Jordan, and Beyond</h2>
        <p>Our new South Jordan location is easily accessible from throughout the Salt Lake Valley's southwest corridor. Whether you're coming from South Jordan, West Jordan, Herriman, or Riverton, we're conveniently located to serve you.</p>

        <h2>Book Your Appointment</h2>
        <p>Book online at waxmetoo.com and select the South Jordan location. You'll find our full list of services, estheticians, and available appointment times. New clients receive 20% off their first service — we'd love to welcome you to the Wax Me Too family.</p>
      `;

    default:
      return `
        <p>${"This article is coming soon. Check back for the full content."}</p>
      `;
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const related = blogPosts.filter(p => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-4xl text-[#3B2F2A] mb-4">Article not found</h1>
          <Link href="/blog"><span className="btn-primary cursor-pointer">Back to Journal</span></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#3B2F2A] py-12">
        <div className="container">
          <Link href="/blog">
            <span className="flex items-center gap-2 text-[#D8C6B6] text-sm font-body mb-6 cursor-pointer hover:text-[#CFA7A0] transition-colors">
              <ArrowLeft size={14} /> Back to Journal
            </span>
          </Link>
          <FadeUp>
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-body font-semibold text-[#CFA7A0] uppercase tracking-wide">{post.category}</span>
                <span className="text-[#D8C6B6]">·</span>
                <span className="text-xs text-[#D8C6B6] font-body flex items-center gap-1">
                  <Clock size={11} /> {post.readTime}
                </span>
                <span className="text-[#D8C6B6]">·</span>
                <span className="text-xs text-[#D8C6B6] font-body">{post.date}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-white leading-tight">{post.title}</h1>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Article */}
      <section className="py-16 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Content */}
            <div className="lg:col-span-2">
              <FadeUp>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full rounded-lg object-cover aspect-[16/9] mb-8"
                />
                <div
                  className="prose prose-lg max-w-none"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#4A4A4A",
                    lineHeight: "1.8",
                  }}
                  dangerouslySetInnerHTML={{ __html: getArticleContent(post.slug) }}
                />
              </FadeUp>

              {/* CTA in article */}
              <FadeUp delay={100}>
                <div className="mt-10 bg-[#CFA7A0] rounded-lg p-6">
                  <h3 className="font-display text-2xl text-[#3B2F2A] mb-2">Ready to book?</h3>
                  <p className="text-[#3B2F2A]/80 font-body text-sm mb-4">New clients receive 20% off their first service.</p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Book Your Appointment
                  </a>
                </div>
              </FadeUp>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FadeUp>
                <div className="bg-white rounded-lg p-5 shadow-sm border-t-4 border-[#CFA7A0]">
                  <h3 className="font-display text-xl text-[#3B2F2A] mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    {[
                      { label: "First Visit Guide", href: "/first-visit" },
                      { label: "Before Care", href: "/before-care" },
                      { label: "After Care", href: "/after-care" },
                      { label: "FAQ Center", href: "/faq" },
                      { label: "Services & Pricing", href: "/services" },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>
                          <span className="text-sm font-body text-[#4A4A4A] hover:text-[#CFA7A0] transition-colors cursor-pointer flex items-center gap-1">
                            <ArrowRight size={12} /> {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>

              <FadeUp delay={100}>
                <div className="bg-[#3B2F2A] rounded-lg p-5">
                  <p className="text-xs font-body font-semibold text-[#CFA7A0] uppercase tracking-wide mb-2">New Client Special</p>
                  <p className="font-display text-xl text-white mb-2">20% off your first service</p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose text-sm py-2.5 w-full text-center block mt-3">
                    Book Now
                  </a>
                </div>
              </FadeUp>

              <FadeUp delay={150}>
                <div className="bg-white rounded-lg p-5 shadow-sm border-t-4 border-[#A8B3AA]">
                  <h3 className="font-display text-lg text-[#3B2F2A] mb-3">Our Locations</h3>
                  <ul className="space-y-1.5 text-sm font-body text-[#4A4A4A]">
                    {["Layton", "Salt Lake City", "South Jordan", "Draper", "Orem", "St. George"].map(loc => (
                      <li key={loc} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CFA7A0] flex-shrink-0" />
                        {loc}, Utah
                      </li>
                    ))}
                  </ul>
                  <Link href="/locations">
                    <span className="text-xs text-[#CFA7A0] hover:underline cursor-pointer mt-3 block">View all locations →</span>
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-14 bg-white">
        <div className="container">
          <FadeUp>
            <h2 className="font-display text-3xl text-[#3B2F2A] mb-8">More from the Journal</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p, i) => (
              <FadeUp key={p.id} delay={i * 70}>
                <Link href={`/blog/${p.slug}`}>
                  <div className="blog-card cursor-pointer">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-body font-semibold text-[#CFA7A0] uppercase tracking-wide">{p.category}</span>
                      <h3 className="font-display text-lg text-[#3B2F2A] mt-1 leading-snug">{p.title}</h3>
                      <p className="text-xs text-[#4A4A4A]/60 font-body mt-1">{p.date}</p>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
