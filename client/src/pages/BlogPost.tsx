import FadeUp from "@/components/FadeUp";
/**
 * WAX ME TOO — Blog Post Detail Page
 * Design: Modern Feminine Craft
 * Real blog content pulled from waxmetoo.blogspot.com and SEO-optimized
 */

import { useEffect, useRef, useState, useMemo } from "react";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, Clock, Hash, Calendar, Check, Copy, ArrowRight, ExternalLink, ChevronDown, ChevronRight, BookOpen, Tag } from "lucide-react";
import Layout from "@/components/Layout";
import { blogPosts, BOOKING_URL } from "@/lib/data";
import MascotEasterEgg from "@/components/MascotEasterEgg";
import { useBreadcrumbSchema } from "@/hooks/useBreadcrumbSchema";

// SEO helper — sets document title and meta description dynamically
function useSEO(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} | Wax Me Too — Utah's Professional Waxing Studio`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
    return () => {
      document.title = 'Wax Me Too — Professional Waxing Studio | Utah';
    };
  }, [title, description]);
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-semibold border transition-all duration-200 ${
        copied
          ? 'bg-[#A8B3AA] border-[#A8B3AA] text-white'
          : 'bg-white border-[#D8C6B6] text-[#4A4A4A] hover:bg-[#F7F3EE] hover:border-[#CFA7A0]'
      }`}
      aria-label="Copy link"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
}


// SEO-optimized article content for each real blog post
function getArticleContent(slug: string): string {
  switch (slug) {
    case "win-complimentary-bikini-wax-summer": // image updated to beach bikini fun photo
      return `
        <p>Summer is just around the corner, and at <strong>Wax Me Too</strong> — Utah's premier professional waxing studio — we're celebrating the season with something special: a chance to win a complimentary bikini wax. All you have to do is fill out a quick form on our website. Winners are announced by text monthly, sometimes sooner!</p>
<img src="https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&auto=format&fit=crop" alt="Woman laughing and having fun at the beach in a bikini, summer confidence" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <p>Why are we giving away free bikini waxes? Because summer is the perfect time to treat yourself — and we want to help you feel beach-ready and confident all season long.</p>

        <h2>Get Beach-Ready with a Summer Upgrade</h2>
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
<img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop" alt="Professional waxing studio in St. George Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />

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
          <li><strong>No memberships. No pressure.</strong> Transparent pricing and a "no hairs left behind" guarantee on every service.</li>
          <li><strong>Privacy and dignity.</strong> We step out of the room while you prepare, ensuring you always feel comfortable and respected.</li>
        </ul>

        <h2>Book Your St. George Waxing Appointment</h2>
        <p>Our St. George studio is located inside Salon Aubri McKai. We serve clients from across Washington County and neighboring Mesquite, Nevada. Book online at waxmetoo.com — it takes just a few clicks to find your preferred esthetician, service, and time slot.</p>
      `;

    case "vacation-waxing-prep-guide":
      return `
        <p>Sunscreen — check. Sunglasses — check. Itsy bitsy bikini — check. Razor? Throw that away.</p>
<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop" alt="Vacation ready smooth skin waxing prep" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <p>Whether you're jetting off to a tropical beach or escaping Utah's winter for a sunny resort, pre-vacation waxing is the single best thing you can do for your skin before you go. At <strong>Wax Me Too</strong>, Utah's professional waxing studio since 2007, we've helped thousands of clients step into paradise with smooth, confident skin. Here's everything you need to know.</p>

        <h2>Timing Is Everything: When to Book Before Your Trip</h2>
        <p>The golden rule of pre-vacation waxing: <strong>book your appointment 2–3 days before you leave.</strong> This gives your skin time to settle after the service while ensuring you arrive at your destination completely hair-free. That means up to 2–3 weeks of smooth skin without a single thought about shaving.</p>
        <p>One important note: your hair needs to be at least <strong>¼ inch long</strong> (roughly 10 days of growth after shaving, or 3 to 4 weeks after waxing) for the wax to grip effectively. If you've been shaving regularly, stop at least 10 days before your appointment.</p>
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
        <p>Wax Me Too has 6 convenient locations across Utah: Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Book online at waxmetoo.com and select your preferred location, esthetician, and time. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "military-discounts-wax-me-too-layton":
      return `
        <p>At <strong>Wax Me Too in Layton, Utah</strong>, we have always held a deep respect for the men and women who serve our country. Located just minutes from <strong>Hill Air Force Base</strong>, our Layton studio has been a trusted destination for military personnel and their families since we opened our doors in that community.</p>
<img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop" alt="Military discount waxing services at Wax Me Too Layton" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />

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
<img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop" alt="Professional waxing hair removal treatment" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />

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
<img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop" alt="Bridal waxing preparation for wedding day" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />

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
        <p>Wax Me Too has 6 locations across Utah: Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Book online at waxmetoo.com and mention that you're a bride — our estheticians love helping brides prepare for their special day. First-time clients get their Brazilian wax for $50.</p>
        <p>Say "I do" to smooth, glowing skin. We can't wait to be part of your wedding journey.</p>
      `;

    case "south-jordan-waxing-salon-relocation":
      return `
        <p><strong>Wax Me Too</strong> is pleased to announce the relocation of our South Jordan studio to a beautiful new address: <strong>3674 W South Jordan Pkwy, South Jordan, Utah 84095</strong>. Our new space features two fully operational treatment rooms and is conveniently located for residents of both South Jordan and West Jordan.</p>
<img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop" alt="South Jordan waxing salon new location" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />

        <h2>The Same Expert Team, a Better Space</h2>
        <p>Our South Jordan location proudly stands as Wax Me Too's 6th Utah studio. The move to our new address allows us to serve more clients with greater comfort and privacy — two fully equipped treatment rooms mean shorter wait times and a more relaxed experience for everyone.</p>
        <p>Our team of experienced estheticians remains the same. The expertise, the standards, and the commitment to your comfort haven't changed — just the address.</p>

        <h2>8 Reasons Wax Me Too South Jordan Is Different</h2>
        <p>In a market full of waxing options, here's what makes our South Jordan studio stand apart:</p>
        <ul>
          <li><strong>1. Local, female-owned and operated.</strong> We're not a franchise. We're not governed by outside investors. When you choose Wax Me Too, you're supporting Utah women and receiving service tailored to your needs — not dictated by a corporate playbook.</li>
          <li><strong>2. Hygiene you can see.</strong> Our estheticians wash their hands in front of you before every service. Our treatment rooms are sanitized between every client. We never double-dip — ever.</li>
          <li><strong>3. No awkward positions.</strong> Unlike some salons that require uncomfortable positions during intimate waxing services, we ensure a relaxed, dignified experience throughout your appointment.</li>
          <li><strong>4. No memberships, no pressure.</strong> Transparent pricing, no monthly fees, no contracts. Our Brazilian wax is $65 — no hidden charges, no upselling pressure.</li>
          <li><strong>5. Experienced estheticians only.</strong> Mastering the Brazilian wax takes real skill. We don't train new graduates on clients. Our team has the experience to deliver clean, complete results every time.</li>
          <li><strong>6. Privacy and dignity.</strong> We step out of the room while you prepare, giving you the time and space to settle in comfortably before your service begins.</li>
          <li><strong>7. No rush.</strong> We schedule Brazilian waxes for 30-minute appointments even though the service typically takes 15 minutes. You'll never feel rushed or hurried out the door.</li>
          <li><strong>8. Complete cleanup.</strong> You won't leave our salon with any residue or discomfort. Our three-step cleanup process ensures you leave feeling fresh and confident.</li>
        </ul>

        <h2>Serving South Jordan, West Jordan, and Beyond</h2>
        <p>Our new South Jordan location is easily accessible from throughout the Salt Lake Valley's southwest corridor. Whether you're coming from South Jordan, West Jordan, Herriman, or Riverton, we're conveniently located to serve you.</p>

        <h2>Book Your Appointment</h2>
        <p>Book online at waxmetoo.com and select the South Jordan location. You'll find our full list of services, estheticians, and available appointment times. First-time clients get their Brazilian wax for $50 — we'd love to welcome you to the Wax Me Too family.</p>
      `;

    case "south-jordan-6th-location-opening":
      return `
        <p>Big news for the Salt Lake Valley's south end: <strong>Wax Me Too</strong> is proud to announce the opening of our <strong>6th Utah location in South Jordan</strong>. This milestone marks a new chapter for Utah's original waxing-only studio — and we couldn't be more excited to bring our signature services to this vibrant, growing community.</p>
<img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop" alt="Wax Me Too South Jordan grand opening" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Why South Jordan?</h2>
        <p>South Jordan has experienced remarkable growth over the past decade, and with that growth has come a demand for high-quality, professional beauty services. We heard you, South Jordan — and we answered. Our new studio is conveniently located at <strong>3674 W South Jordan Pkwy</strong>, easily accessible for residents of South Jordan, West Jordan, Herriman, and Riverton.</p>
        <h2>What to Expect at Our South Jordan Studio</h2>
        <p>Every Wax Me Too location is built on the same foundation: exceptional hygiene, expert estheticians, transparent pricing, and a warm, welcoming atmosphere. Our South Jordan studio features two fully equipped treatment rooms, ensuring minimal wait times and maximum privacy for every client.</p>
        <ul>
          <li><strong>No double-dipping.</strong> Fresh applicators for every client, every time.</li>
          <li><strong>Sinks in every room.</strong> Your esthetician washes her hands in front of you before every service.</li>
          <li><strong>No memberships.</strong> Transparent pricing, no hidden fees, no pressure.</li>
          <li><strong>your first Brazilian wax for $50.</strong> Your first service at any Wax Me Too location comes with a 20% new client discount.</li>
        </ul>
        <h2>Book Your Appointment</h2>
        <p>Ready to experience Utah's most trusted waxing studio? Book online at waxmetoo.com and select the South Jordan location. We can't wait to welcome you.</p>
      `;

    case "free-bikini-wax-layton-utah":
      return `
        <p>Here's something to brighten your day: <strong>Wax Me Too in Layton</strong> is giving away a free bikini wax. No strings attached, no membership required — just a chance to experience Utah's most trusted waxing studio on us.</p>
<img src="https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&auto=format&fit=crop" alt="Free bikini wax promotion Layton Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>How to Enter</h2>
        <p>Entering is simple. Visit our website, fill out the short entry form, and you're in. Winners are selected monthly and notified by text message. Some months we draw winners even more frequently — so the sooner you enter, the better your chances.</p>
        <h2>Why We Do This</h2>
        <p>At Wax Me Too, we believe that every woman deserves to feel confident and cared for. Giveaways like this are our way of saying thank you to our incredible community — and of giving new clients a risk-free way to discover what professional waxing can do for them.</p>
        <p>If you've been curious about waxing but haven't taken the plunge, this is the perfect opportunity. Our licensed estheticians at the Layton studio are experts at making first-time clients feel comfortable, informed, and at ease from the moment they walk in.</p>
        <h2>About Wax Me Too Layton</h2>
        <p>Our Layton studio is located at <strong>360 S Fort Lane #101</strong>, just minutes from Hill Air Force Base. We proudly offer <strong>military discounts</strong> for active service members and their families. Our team of experienced estheticians specializes in Brazilian waxing, eyebrow design, and full body waxing — from brows to toes and anything in between.</p>
      `;

    case "wax-me-too-difference-local-salon":
      return `
        <p>In a market full of waxing options — from franchise chains to spa add-ons — what makes <strong>Wax Me Too</strong> different? The answer is everything. From our founding philosophy to our daily operations, we've built a waxing studio that puts clients first in ways that most salons simply don't.</p>
<img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop" alt="What makes Wax Me Too different from other salons" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>We Are Utah's Original Waxing-Only Studio</h2>
        <p>When we opened our first location in Draper in 2007, we were doing something no one in Utah had done before: opening a salon dedicated entirely to waxing. No haircuts, no manicures, no distractions — just professional waxing, done exceptionally well.</p>
        <p>That singular focus has defined us ever since. Our estheticians don't split their time between services. They wax all day, every day, which means they've performed thousands of Brazilian waxes, eyebrow designs, and full body waxing services. That level of specialization translates directly into better results for you.</p>
        <h2>8 Things That Set Us Apart</h2>
        <ul>
          <li><strong>Local, women-owned and operated.</strong> We're not a franchise. Every decision is made by the women who built this business from the ground up.</li>
          <li><strong>No double-dipping, ever.</strong> We use fresh applicators for every client. This is non-negotiable.</li>
          <li><strong>Sinks in every treatment room.</strong> Your esthetician washes her hands in front of you before every service.</li>
          <li><strong>No memberships or pressure.</strong> Transparent pricing, no contracts, no monthly fees.</li>
          <li><strong>Privacy and dignity.</strong> We step out while you prepare. You'll never feel rushed or uncomfortable.</li>
          <li><strong>Experienced estheticians only.</strong> We don't train new graduates on clients.</li>
          <li><strong>No hairs left behind guarantee.</strong> We check our work before you leave.</li>
          <li><strong>First-time client offer.</strong> Get your first Brazilian wax for $50. We want you to experience the Wax Me Too difference risk-free.</li>
        </ul>
        <h2>6 Locations Across Utah</h2>
        <p>With studios in Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George, we're Utah's most accessible professional waxing studio. Book online at waxmetoo.com — first-time clients get their Brazilian wax for $50.</p>
      `;

    case "summer-waxing-utah-guide":
      return `
        <p>Summer in Utah means outdoor adventures, pool days, and hiking trails — and all of it is better with smooth, confident skin. At <strong>Wax Me Too</strong>, Utah's professional waxing studio since 2007, we help thousands of clients get summer-ready every year. Here's your complete guide to summer waxing in Utah.</p>
<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop" alt="Summer waxing guide Utah smooth skin" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>The Best Services for Summer</h2>
        <p>Summer calls for a full-body approach to waxing. Here are the services our clients book most frequently as the temperatures rise:</p>
        <ul>
          <li><strong>Brazilian wax.</strong> The ultimate summer service — weeks of smooth, confident skin for pool days, beach trips, and everything in between.</li>
          <li><strong>Bikini wax.</strong> For those who prefer a more conservative clean-up, our bikini wax removes hair from the sides and top for a neat, swimsuit-ready look.</li>
          <li><strong>Leg waxing.</strong> Full or half legs — silky smooth for shorts season without the daily shaving routine.</li>
          <li><strong>Underarm waxing.</strong> Smooth underarms that last 3–4 weeks — no more daily razor maintenance.</li>
          <li><strong>Eyebrow design.</strong> Summer photos deserve perfectly shaped brows. Our estheticians are experts at creating the ideal brow shape for your face.</li>
        </ul>
        <h2>Summer Waxing Tips</h2>
        <p>Getting the most out of your summer wax requires a little preparation:</p>
        <ul>
          <li><strong>Book 2–3 days before your trip or event.</strong> This gives your skin time to settle after the service.</li>
          <li><strong>Let hair grow to ¼ inch.</strong> Stop shaving at least 10 days before your appointment for best results.</li>
          <li><strong>Exfoliate 24 hours before.</strong> Gentle exfoliation helps the wax grip hair more effectively.</li>
          <li><strong>Avoid sun exposure immediately after.</strong> Freshly waxed skin is more sensitive to UV rays — apply SPF before heading outdoors.</li>
          <li><strong>Moisturize daily.</strong> Hydrated skin holds wax results longer and reduces the risk of ingrown hairs.</li>
        </ul>
        <h2>Book at Any of Our 6 Utah Locations</h2>
        <p>Wax Me Too has studios in Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Book online and enjoy your first Brazilian wax for $50.</p>
      `;

    case "wax-me-too-happy-faces-community":
      return `
        <p>At <strong>Wax Me Too</strong>, our greatest reward isn't a five-star review or a full appointment book — it's the look on a client's face when they leave our studio feeling confident, cared for, and completely smooth. After nearly two decades of serving Utah, we've collected thousands of those moments, and we never take a single one for granted.</p>
<img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop" alt="Happy clients at Wax Me Too Utah community" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Why Client Happiness Drives Everything We Do</h2>
        <p>From the moment you book your appointment to the moment you walk out our door, every detail of the Wax Me Too experience is designed around your comfort and satisfaction. We know that waxing — especially for first-time clients — can feel intimidating. Our entire team is trained to make that experience as warm, professional, and reassuring as possible.</p>
        <p>We've heard it hundreds of times: "I was so nervous, but my esthetician made me feel completely at ease." That's not an accident. It's the result of years of intentional culture-building, ongoing training, and a genuine commitment to treating every client with dignity and respect.</p>
        <h2>Our Community of Loyal Clients</h2>
        <p>Many of our clients have been coming to Wax Me Too for years — some since we first opened in 2007. They've followed us as we've grown from one location in Draper to six studios across Utah. They've referred their friends, their sisters, their mothers. They've trusted us with some of their most personal grooming needs, and we don't take that trust lightly.</p>
        <h2>Thank You, Utah</h2>
        <p>To every client who has ever walked through our doors: thank you. You are the reason we do what we do. We're honored to be part of your self-care routine, and we look forward to many more years of serving Utah's most amazing community.</p>
        <p>Book your next appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "draper-waxing-salon-expansion":
      return `
        <p>Exciting news for our Draper community: <strong>Wax Me Too Draper</strong> has expanded, and we're thrilled to welcome even more clients to our flagship studio. Our Draper location holds a special place in our hearts — it's where it all began in 2007, when we opened Utah's very first waxing-only salon.</p>
<img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop" alt="Wax Me Too Draper waxing salon expansion" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>More Space, Same Excellence</h2>
        <p>The expansion adds additional treatment rooms to our Draper studio, meaning shorter wait times, greater scheduling flexibility, and the same exceptional service our clients have come to expect. Whether you're a longtime regular or considering your first visit, our Draper team is ready to welcome you.</p>
        <h2>Our Draper Studio: Where It All Started</h2>
        <p>Draper has been home to Wax Me Too since day one. Located at <strong>177 West 12300 South</strong>, our Draper studio is conveniently situated for clients throughout the Salt Lake Valley's south end — including Sandy, Riverton, and South Jordan. We're proud of our roots in this community and grateful for the loyal clients who have supported us from the very beginning.</p>
        <h2>Book Your Appointment</h2>
        <p>Book online at waxmetoo.com and select the Draper location. First-time clients get their Brazilian wax for $50. We'd love to see you in our newly expanded space.</p>
      `;

    case "salt-lake-city-waxing-salon":
      return `
        <p>Salt Lake City, we're here for you. <strong>Wax Me Too</strong> is proud to serve the heart of Utah's capital with professional waxing services at our Salt Lake City studio, located inside Miri Lash Studio at <strong>1850 S 300 West, Suite A</strong>.</p>
<img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop" alt="Professional waxing salon Salt Lake City Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Professional Waxing in the Heart of Salt Lake City</h2>
        <p>Our Salt Lake City location brings the same Wax Me Too experience that has made us Utah's most trusted waxing studio to the urban core. Whether you're a downtown professional, a University of Utah student, or a resident of the Sugarhouse or Liberty Wells neighborhoods, we're conveniently located to serve you.</p>
        <h2>Our Services in Salt Lake City</h2>
        <p>Our SLC studio offers the full Wax Me Too menu — from our signature Brazilian wax to eyebrow design, full leg waxing, underarm waxing, and men's waxing services. Our licensed estheticians specialize exclusively in waxing, bringing years of focused expertise to every appointment.</p>
        <h2>Why Choose Wax Me Too in Salt Lake City?</h2>
        <ul>
          <li><strong>Utah's original waxing-only studio</strong> — we've been doing this since 2007</li>
          <li><strong>No double-dipping</strong> — fresh applicators for every client</li>
          <li><strong>Sinks in every treatment room</strong> — hygiene you can see</li>
          <li><strong>No memberships, no pressure</strong> — transparent pricing always</li>
          <li><strong>your first Brazilian wax for $50</strong></li>
        </ul>
        <p>Book online at waxmetoo.com and select the Salt Lake City location. We look forward to welcoming you.</p>
      `;

    case "layton-waxing-salon-new-location":
      return `
        <p>We have exciting news for our Davis County clients: <strong>Wax Me Too Layton</strong> has moved to a beautiful new location at <strong>360 S Fort Lane #101, Layton, Utah 84041</strong>. Our new space is larger, more comfortable, and better equipped to serve our growing Layton community.</p>
<img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop" alt="Wax Me Too new Layton waxing salon location" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>A New Home in Layton</h2>
        <p>Our Layton studio has always been one of our busiest locations — and for good reason. Situated near Hill Air Force Base, we serve a diverse community of clients including military personnel and their families, for whom we proudly offer special military discounts.</p>
        <p>The new space features multiple treatment rooms with sinks, ensuring the hygiene standards our clients have come to expect. Our team of six experienced estheticians brings the same expertise and warmth to the new location that made our previous studio so beloved.</p>
        <h2>Serving Davis County and Beyond</h2>
        <p>Our Layton studio serves clients from throughout Davis County — including Layton, Clearfield, Syracuse, Clinton, and Kaysville — as well as clients from Weber County to the north. We're Utah's northernmost waxing studio, and we're proud to bring professional waxing expertise to this community.</p>
        <h2>Book at Our New Layton Location</h2>
        <p>Book online at waxmetoo.com and select the Layton location. Military personnel: look for the military discount option when selecting your service. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "layton-waxing-salon-new-team":
      return `
        <p>Great news for our Layton clients: our team is growing! <strong>Wax Me Too Layton</strong> has welcomed several talented new estheticians to our studio, expanding our capacity and bringing fresh expertise to our already exceptional team.</p>
<img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop" alt="New esthetician team at Wax Me Too Layton" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Meet Our Growing Layton Team</h2>
        <p>At Wax Me Too, we don't just hire estheticians — we hire specialists. Every member of our team has demonstrated a genuine passion for waxing and a commitment to client care that aligns with our values. Our new team members have completed extensive training in our signature techniques and are ready to deliver the Wax Me Too experience you know and love.</p>
        <h2>What This Means for You</h2>
        <p>More team members means more availability. If you've ever struggled to find an appointment time that works for your schedule, our expanded team makes it easier than ever to book at a time that's convenient for you. We offer early morning, evening, and weekend appointments to accommodate even the busiest schedules.</p>
        <h2>The Wax Me Too Standard</h2>
        <p>Every esthetician at Wax Me Too — new or veteran — upholds the same non-negotiable standards: no double-dipping, sinks in every treatment room, privacy and dignity for every client, and a genuine commitment to your comfort and satisfaction.</p>
        <p>Book your appointment online at waxmetoo.com and select the Layton location. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "layton-waxing-milly-speaks-spanish":
      return `
        <p>¡Buenas noticias para nuestra comunidad hispanohablante! <strong>Wax Me Too Layton</strong> is proud to announce that our esthetician Milly is available to serve Spanish-speaking clients. For clients who are more comfortable communicating in Spanish, Milly's bilingual expertise ensures a comfortable, clear, and professional waxing experience from start to finish.</p>
<img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop" alt="Spanish speaking esthetician at Wax Me Too Layton" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Breaking Down Language Barriers in Beauty</h2>
        <p>At Wax Me Too, we believe that every client deserves to feel understood, comfortable, and fully informed during their appointment. For first-time waxing clients especially, being able to ask questions and understand the process in your native language makes a significant difference in the experience.</p>
        <p>Milly brings not only bilingual communication skills but also years of waxing expertise to every appointment. Her clients — both English and Spanish-speaking — consistently praise her gentle technique, attention to detail, and warm, reassuring manner.</p>
        <h2>Our Layton Studio</h2>
        <p>Located at <strong>360 S Fort Lane #101, Layton, Utah</strong>, our Layton studio serves clients from throughout Davis County and beyond. We offer the full Wax Me Too menu — Brazilian wax, eyebrow design, full body waxing, and men's waxing services — all with the hygiene standards and client care that have made us Utah's most trusted waxing studio.</p>
        <p>To book with Milly, visit waxmetoo.com and select the Layton location. ¡Te esperamos!</p>
      `;

    case "hair-removal-layton-utah":
      return `
        <p>If you're searching for professional hair removal in Layton, Utah, your search ends here. <strong>Wax Me Too Layton</strong> has been serving Davis County since our founding in 2007, and we've established ourselves as the most trusted name in professional waxing in Northern Utah.</p>
<img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop" alt="Professional hair removal waxing in Layton Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Professional Waxing Services in Layton, UT</h2>
        <p>Our Layton studio at <strong>360 S Fort Lane #101</strong> offers a comprehensive menu of waxing services for women and men:</p>
        <ul>
          <li><strong>Brazilian wax</strong> — Utah's most popular waxing service, performed by specialists who do this every day</li>
          <li><strong>Bikini wax</strong> — clean, neat, and customizable to your preferences</li>
          <li><strong>Eyebrow design and waxing</strong> — perfectly shaped brows that frame your face</li>
          <li><strong>Full leg waxing</strong> — silky smooth from ankle to hip</li>
          <li><strong>Underarm waxing</strong> — 3–4 weeks of smooth, carefree underarms</li>
          <li><strong>Men's waxing</strong> — including back, chest, and the Manzilian</li>
          <li><strong>Full body waxing</strong> — from brows to toes and anything in between</li>
        </ul>
        <h2>Why Layton Clients Choose Wax Me Too</h2>
        <p>We are Utah's original waxing-only studio — not a spa that offers waxing as an afterthought. Our estheticians specialize exclusively in waxing, performing these services every day and refining their technique with every appointment. The result is a level of expertise that generalist salons simply cannot match.</p>
        <p>We also offer <strong>military discounts</strong> for active service members and their families — a small token of appreciation for those who serve near Hill Air Force Base.</p>
        <h2>Book Your Layton Appointment</h2>
        <p>Book online at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "how-often-should-you-wax":
      return `
        <p>One of the most common questions we hear at <strong>Wax Me Too</strong> is: "How often should I wax?" The answer depends on several factors — your hair growth cycle, the area being waxed, and your personal preferences. Here's everything you need to know to establish the perfect waxing schedule.</p>
<img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop" alt="How often should you wax waxing schedule guide" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>The General Rule: Every 4–6 Weeks</h2>
        <p>For most clients, we recommend waxing every <strong>4–6 weeks</strong>. This timing aligns with the natural hair growth cycle and ensures that hair is at the optimal length for waxing — long enough for the wax to grip effectively, but not so long that the service becomes uncomfortable.</p>
        <p>However, this is a guideline, not a rule. Some clients with faster hair growth may need to come in every 3–4 weeks, while others with slower growth may find that 6–8 weeks works perfectly for them.</p>
        <h2>Why Consistency Matters</h2>
        <p>The more consistently you wax, the better your results become over time. Here's why:</p>
        <ul>
          <li><strong>Hair grows back finer and sparser.</strong> With each waxing session, the hair follicle is weakened, leading to progressively finer, softer regrowth.</li>
          <li><strong>Less discomfort over time.</strong> First-time waxers often notice a significant reduction in discomfort by their second or third session.</li>
          <li><strong>More predictable regrowth.</strong> Consistent waxing synchronizes your hair growth cycles, leading to more uniform results.</li>
        </ul>
        <h2>Waxing Schedule by Body Area</h2>
        <p>Different areas of the body have different hair growth rates:</p>
        <ul>
          <li><strong>Bikini/Brazilian:</strong> Every 4–5 weeks</li>
          <li><strong>Eyebrows:</strong> Every 3–4 weeks</li>
          <li><strong>Legs:</strong> Every 4–6 weeks</li>
          <li><strong>Underarms:</strong> Every 3–4 weeks (underarm hair grows faster)</li>
          <li><strong>Upper lip/facial:</strong> Every 3–4 weeks</li>
        </ul>
        <h2>Book Your Next Appointment</h2>
        <p>Wax Me Too has 6 locations across Utah. Book online at waxmetoo.com — we recommend scheduling your next appointment before you leave the studio to ensure you get your preferred time slot.</p>
      `;

    case "ingrown-hair-prevention-waxing":
      return `
        <p>Ingrown hairs are one of the most common concerns among waxing clients — and one of the most preventable. At <strong>Wax Me Too</strong>, our licensed estheticians have helped thousands of clients achieve smooth, ingrown-free skin through proper waxing technique and aftercare education. Here's your complete guide to preventing ingrown hairs.</p>
<img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop" alt="Ingrown hair prevention tips after waxing" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>What Causes Ingrown Hairs?</h2>
        <p>Ingrown hairs occur when a hair grows back into the skin rather than up through the follicle. They're most common in areas where hair is coarse and curly — like the bikini area, underarms, and legs. Contributing factors include:</p>
        <ul>
          <li>Dead skin cells blocking the hair follicle</li>
          <li>Tight clothing that creates friction against freshly waxed skin</li>
          <li>Dry skin that doesn't allow hair to break through the surface</li>
          <li>Improper waxing technique (another reason to choose an experienced esthetician)</li>
        </ul>
        <h2>How to Prevent Ingrown Hairs After Waxing</h2>
        <ul>
          <li><strong>Exfoliate regularly.</strong> Begin gentle exfoliation 48 hours after your wax and continue 2–3 times per week. This removes dead skin cells that can trap growing hairs.</li>
          <li><strong>Moisturize daily.</strong> Hydrated skin allows hair to grow through the surface more easily. Use a fragrance-free, non-comedogenic lotion on waxed areas daily.</li>
          <li><strong>Avoid heat.</strong> Skip hot showers, saunas, and intense exercise for 24 hours after waxing — heat can cause inflammation that contributes to ingrown hairs.</li>
          <li><strong>Don't shave between appointments.</strong> Shaving between waxing sessions disrupts the hair growth cycle and increases the risk of ingrown hairs.</li>
        </ul>
        <h2>Professional Waxing Reduces Ingrown Hair Risk</h2>
        <p>Proper waxing technique significantly reduces the risk of ingrown hairs compared to shaving. When hair is removed from the root (as in waxing), it grows back with a tapered tip that's less likely to curl back into the skin. Shaving creates a blunt cut that's more prone to ingrowth.</p>
        <p>Book your appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "waxing-aftercare-guide":
      return `
        <p>Your waxing appointment doesn't end when you leave the studio. What you do in the 24–48 hours after your wax has a significant impact on your results, your skin's health, and your comfort. Here's <strong>Wax Me Too's</strong> complete aftercare guide.</p>
<img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop" alt="Waxing aftercare guide smooth skin care" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>The First 24 Hours: What to Avoid</h2>
        <p>Freshly waxed skin is temporarily more sensitive and vulnerable. In the first 24 hours after your appointment, avoid:</p>
        <ul>
          <li><strong>Hot showers or baths.</strong> Stick to lukewarm water — heat can cause inflammation and irritation on freshly waxed skin.</li>
          <li><strong>Sun exposure.</strong> Waxed skin is more susceptible to UV damage. If you must be in the sun, apply SPF 30 or higher to waxed areas.</li>
          <li><strong>Swimming pools or hot tubs.</strong> Chlorine and bacteria in pools can irritate open follicles.</li>
          <li><strong>Intense exercise.</strong> Sweat and friction can cause irritation and increase the risk of ingrown hairs.</li>
          <li><strong>Fragranced products.</strong> Avoid perfumes, scented lotions, and deodorants on waxed areas for 24 hours.</li>
        </ul>
        <h2>Days 2–7: Building Your Aftercare Routine</h2>
        <ul>
          <li><strong>Moisturize daily.</strong> Apply a fragrance-free, non-comedogenic lotion to waxed areas every day to keep skin hydrated and supple.</li>
          <li><strong>Begin gentle exfoliation at 48 hours.</strong> Use a soft washcloth or gentle exfoliating scrub 2–3 times per week to prevent ingrown hairs.</li>
          <li><strong>Avoid shaving.</strong> Shaving between waxing appointments disrupts the hair growth cycle and can lead to coarser regrowth and more ingrown hairs.</li>
        </ul>
        <h2>When to Call Us</h2>
        <p>Mild redness and sensitivity are completely normal after waxing and typically resolve within a few hours. If you experience persistent redness, bumps, or irritation lasting more than 48 hours, contact your esthetician. We're always here to help.</p>
        <p>Book your next appointment at waxmetoo.com before your current results fade. We recommend scheduling 4–6 weeks out.</p>
      `;

    case "waxing-before-care-guide":
      return `
        <p>The secret to a great waxing experience starts before you ever walk through our door. Proper preparation ensures the wax can grip hair effectively, reduces discomfort, and minimizes the risk of irritation. Here's <strong>Wax Me Too's</strong> complete before-care guide.</p>
<img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop" alt="Waxing before care preparation guide" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Hair Length: The Most Important Factor</h2>
        <p>For waxing to work effectively, your hair needs to be at least <strong>¼ inch long</strong> — roughly the length of a grain of rice. This is approximately 10 days of growth after shaving, or 3 to 4 weeks after waxing. If your hair is too short, the wax won't be able to grip it properly, leading to incomplete results.</p>
        <p>If your hair is longer than ½ inch, don't worry — we can trim it for you. Just let your esthetician know when you arrive.</p>
        <h2>The Week Before Your Appointment</h2>
        <ul>
          <li><strong>Stop shaving.</strong> Allow at least 10 days of growth from your last shave before your appointment.</li>
          <li><strong>Exfoliate gently.</strong> Light exfoliation 24–48 hours before your appointment helps remove dead skin cells and allows the wax to grip hair more effectively. Avoid harsh scrubs that could irritate the skin.</li>
          <li><strong>Moisturize daily.</strong> Well-hydrated skin waxes more easily and with less discomfort.</li>
          <li><strong>Avoid retinol and AHA/BHA products.</strong> These can thin the skin and increase sensitivity. Stop using them on the area to be waxed 3–5 days before your appointment.</li>
        </ul>
        <h2>The Day of Your Appointment</h2>
        <ul>
          <li><strong>Shower and cleanse the area.</strong> Come to your appointment with clean skin, free of lotions, oils, and perfumes.</li>
          <li><strong>Avoid caffeine and alcohol.</strong> Both can increase skin sensitivity.</li>
          <li><strong>Take an OTC pain reliever if desired.</strong> Some clients find that taking ibuprofen 30–45 minutes before their appointment reduces discomfort.</li>
        </ul>
        <h2>Book Your Appointment</h2>
        <p>Ready to experience the Wax Me Too difference? Book online at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "waxing-faq-utah":
      return `
        <p>Have questions about waxing? You're not alone. At <strong>Wax Me Too</strong>, we hear the same questions from new clients every day — and we love answering them. Here are the answers to the most frequently asked questions about professional waxing in Utah.</p>
<img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop" alt="Waxing FAQ questions answered Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Does waxing hurt?</h2>
        <p>This is the question we hear most often. The honest answer: it depends. Most clients describe the sensation as a quick, sharp sting that passes immediately. The bikini and Brazilian areas tend to be more sensitive than legs or arms. The good news: it gets significantly easier with each subsequent visit. By your third or fourth wax, most clients find the experience quite manageable.</p>
        <h2>How long does hair need to be?</h2>
        <p>Hair should be at least ¼ inch long — roughly 10 days of growth after shaving, or 3 to 4 weeks after waxing. If you're not sure, it's always better to let it grow a bit longer rather than coming in too soon.</p>
        <h2>How long do results last?</h2>
        <p>Most clients enjoy smooth skin for 3–6 weeks after a professional wax. Results vary based on individual hair growth rates and the area waxed.</p>
        <h2>Can I wax if I'm pregnant?</h2>
        <p>Yes, waxing is generally safe during pregnancy. However, skin can be more sensitive during pregnancy, so we recommend letting your esthetician know. We'll take extra care to ensure your comfort throughout the service.</p>
        <h2>Do you offer waxing for men?</h2>
        <p>Absolutely. We offer a full menu of men's waxing services, including back waxing, chest waxing, eyebrow waxing, and the Manzilian — our Brazilian wax service for men. Our estheticians are experienced and professional, and our treatment rooms are private and comfortable.</p>
        <h2>What is your hygiene policy?</h2>
        <p>We never double-dip — fresh applicators are used for every client, every time. Our estheticians wash their hands in front of you before every service. Treatment rooms are sanitized between every client. These are non-negotiable standards at every Wax Me Too location.</p>
        <p>Have more questions? Visit our full FAQ page at waxmetoo.com, or call any of our 6 Utah locations.</p>
      `;

    case "waxing-for-men-manzilian-guide":
      return `
        <p>Men's waxing has gone mainstream — and for good reason. From athletes seeking peak performance to professionals who simply prefer a cleaner look, more men than ever are discovering the benefits of professional waxing. At <strong>Wax Me Too</strong>, we've been serving male clients since our founding in 2007, and we're proud to offer a comprehensive menu of men's waxing services.</p>
<img src="https://images.unsplash.com/photo-1621607505282-d1e5f5b0f1e7?w=800&auto=format&fit=crop" alt="Men's waxing manzilian guide Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>The Manzilian: Our Most Popular Men's Service</h2>
        <p>The <strong>Manzilian</strong> — our Brazilian wax service for men — is our most requested men's service. It's performed with the same expertise, discretion, and professionalism as our women's Brazilian wax, by licensed estheticians who specialize in this service.</p>
        <p>First-time male clients are often surprised by how professional and comfortable the experience is. Our estheticians are matter-of-fact, skilled, and focused entirely on delivering excellent results. There's no judgment, no awkwardness — just professional service in a private, comfortable treatment room.</p>
        <h2>Other Men's Waxing Services</h2>
        <ul>
          <li><strong>Back waxing.</strong> One of our most popular men's services — a clean, smooth back for beach season or everyday confidence.</li>
          <li><strong>Chest waxing.</strong> Smooth, defined chest without the daily maintenance of shaving.</li>
          <li><strong>Eyebrow waxing and design.</strong> Clean, well-groomed brows that frame your face without looking overdone.</li>
          <li><strong>Arm and leg waxing.</strong> Popular among cyclists, swimmers, and athletes who prefer a smooth, low-maintenance look.</li>
          <li><strong>Ear and nose waxing.</strong> Quick, effective, and surprisingly comfortable.</li>
        </ul>
        <h2>Why Men Choose Waxing Over Shaving</h2>
        <p>The benefits of waxing over shaving are the same for men as for women: longer-lasting results (3–6 weeks vs. 1–3 days), finer regrowth over time, no razor burn, and no daily maintenance. For active men, waxing also eliminates the chafing and irritation that can come from shaving.</p>
        <p>Book your men's waxing appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "waxing-sensitive-skin-guide":
      return `
        <p>If you have sensitive skin, you may have hesitated to try waxing — worried about redness, irritation, or reactions. The good news: with the right preparation, the right esthetician, and the right aftercare, even sensitive skin can be waxed safely and comfortably. Here's <strong>Wax Me Too's</strong> guide to waxing with sensitive skin.</p>
<img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop" alt="Waxing for sensitive skin guide tips" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>What Makes Skin Sensitive to Waxing?</h2>
        <p>Several factors can increase skin sensitivity during waxing:</p>
        <ul>
          <li>Retinol or AHA/BHA skincare products (these thin the skin)</li>
          <li>Recent sun exposure or sunburn</li>
          <li>Certain medications (including Accutane, blood thinners, and some antibiotics)</li>
          <li>Hormonal fluctuations (including pregnancy and menstruation)</li>
          <li>Eczema, psoriasis, or other skin conditions in the area to be waxed</li>
        </ul>
        <h2>How to Prepare Sensitive Skin for Waxing</h2>
        <ul>
          <li><strong>Discontinue retinol and AHA/BHA products</strong> on the area to be waxed at least 5 days before your appointment.</li>
          <li><strong>Avoid sun exposure</strong> for 24 hours before your appointment.</li>
          <li><strong>Stay well-hydrated.</strong> Hydrated skin is more resilient and waxes more comfortably.</li>
          <li><strong>Tell your esthetician.</strong> Always let your esthetician know about your skin sensitivities, medications, and skincare routine. This allows us to choose the most appropriate wax formulation and technique for your skin.</li>
        </ul>
        <h2>Our Approach to Sensitive Skin</h2>
        <p>At Wax Me Too, we use professional-grade wax formulations that are gentle on sensitive skin. Our estheticians are trained to recognize signs of sensitivity and adjust their technique accordingly. We'd rather take an extra moment to ensure your comfort than rush through a service that leaves your skin unhappy.</p>
        <p>Book your appointment at waxmetoo.com and mention your sensitive skin in the notes field when booking. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "waxing-while-pregnant-utah":
      return `
        <p>Pregnancy brings many changes to your body — including changes to your skin, your hair growth patterns, and your sensitivity to pain. Many expectant mothers wonder whether it's safe to continue waxing during pregnancy. The short answer: yes, waxing is generally safe during pregnancy, with a few important considerations.</p>
<img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop" alt="Waxing while pregnant safety guide Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Is Waxing Safe During Pregnancy?</h2>
        <p>Waxing does not pose any known risks to your pregnancy. The wax is applied externally and does not penetrate the skin in any way that could affect your baby. However, pregnancy does affect the waxing experience in several ways:</p>
        <ul>
          <li><strong>Increased skin sensitivity.</strong> Hormonal changes during pregnancy can make skin more sensitive than usual, meaning waxing may be more uncomfortable than before pregnancy.</li>
          <li><strong>Increased blood flow.</strong> Greater blood flow to the skin during pregnancy can cause more pronounced redness and sensitivity after waxing.</li>
          <li><strong>Faster hair growth.</strong> Many pregnant women experience accelerated hair growth due to hormonal changes.</li>
        </ul>
        <h2>Tips for Waxing During Pregnancy</h2>
        <ul>
          <li><strong>Tell your esthetician you're pregnant.</strong> This is important — we'll take extra care to ensure your comfort and use the gentlest possible technique.</li>
          <li><strong>Schedule early in your pregnancy</strong> if possible, when sensitivity is typically lower.</li>
          <li><strong>Avoid waxing if you have varicose veins</strong> in the area to be waxed.</li>
          <li><strong>Listen to your body.</strong> If at any point you feel uncomfortable, let your esthetician know and we'll adjust accordingly.</li>
        </ul>
        <h2>Book Your Prenatal Waxing Appointment</h2>
        <p>Our licensed estheticians at all 6 Wax Me Too locations are experienced in working with pregnant clients. Book online at waxmetoo.com and mention your pregnancy in the notes field. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "first-brazilian-wax-step-by-step":
      return `
        <p>So you've decided to try your first Brazilian wax. Congratulations — you're about to discover why millions of women (and men) swear by this service. At <strong>Wax Me Too</strong>, we've guided thousands of first-time clients through their first Brazilian wax, and we're here to walk you through exactly what to expect.</p>
<img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop" alt="First Brazilian wax what to expect step by step" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Step 1: Booking Your Appointment</h2>
        <p>Book online at waxmetoo.com and select "Brazilian Wax" from the service menu. Choose your preferred location from our 6 Utah studios, select an esthetician, and pick a time that works for you. The appointment is scheduled for 30 minutes, though the actual waxing typically takes about 15 minutes — the extra time ensures you never feel rushed.</p>
        <h2>Step 2: Preparing for Your Appointment</h2>
        <p>In the days before your appointment:</p>
        <ul>
          <li>Stop shaving at least 10 days before your appointment to allow ¼ inch of growth</li>
          <li>Exfoliate gently 24–48 hours before your appointment</li>
          <li>Shower and cleanse the area on the day of your appointment</li>
        </ul>
        <h2>Step 3: Arriving at the Studio</h2>
        <p>When you arrive, you'll be greeted by your esthetician, who will briefly review the service with you and answer any questions. You'll be shown to a private treatment room where you'll have complete privacy to prepare.</p>
        <h2>Step 4: The Service</h2>
        <p>Your esthetician will cleanse the area, apply warm wax in small sections, and remove it quickly and efficiently. The sensation is a quick, sharp sting that passes immediately — most clients are surprised by how manageable it is. Your esthetician will work methodically to ensure complete coverage and clean results.</p>
        <h2>Step 5: Aftercare</h2>
        <p>After your service, your esthetician will apply a soothing aftercare product and review aftercare instructions with you. Avoid heat, sun exposure, and pools for 24 hours.</p>
        <p>Ready to book? Visit waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "15-minute-brazilian-wax-experience":
      return `
        <p>At <strong>Wax Me Too</strong>, we schedule Brazilian wax appointments for 30 minutes — but the actual waxing typically takes about 15 minutes. Why the extra time? Because we believe you should never feel rushed. The 30-minute appointment gives you time to settle in, ask questions, and leave without feeling hurried out the door.</p>
<img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop" alt="Quick 15 minute Brazilian wax experience" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>What Happens in Those 15 Minutes?</h2>
        <p>Our estheticians have refined their Brazilian wax technique over years of daily practice. Here's what happens during a typical appointment:</p>
        <ul>
          <li><strong>Minutes 1–2: Preparation.</strong> Your esthetician cleanses the area and applies a light pre-wax oil to protect the skin.</li>
          <li><strong>Minutes 3–12: Waxing.</strong> Working in small, precise sections, your esthetician applies warm wax and removes it quickly and efficiently. The technique is methodical and thorough — no hairs left behind.</li>
          <li><strong>Minutes 13–15: Finishing.</strong> Your esthetician applies a soothing post-wax product and reviews aftercare instructions with you.</li>
        </ul>
        <h2>Why Speed Doesn't Mean Rushing</h2>
        <p>The efficiency of our service is a reflection of expertise, not haste. Our estheticians perform Brazilian waxes every day — they've refined their technique to be both fast and thorough. The result is a service that's quick, comfortable, and complete.</p>
        <h2>First-Time Clients: What to Expect</h2>
        <p>If this is your first Brazilian wax, your appointment may take slightly longer as your esthetician takes time to explain each step and ensure your comfort throughout. That's completely normal — and we'd rather take the extra time than rush you through an experience that deserves care and attention.</p>
        <p>Book your Brazilian wax at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "naked-and-afraid-first-brazilian":
      return `
        <p>We've all heard the horror stories. A friend's terrible experience at a discount salon. A Reddit thread full of waxing nightmares. If you're considering your first Brazilian wax and feeling a little "naked and afraid," we completely understand — and we're here to set the record straight.</p>
<img src="https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&auto=format&fit=crop" alt="First Brazilian wax nervous guide what to expect" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>The Truth About Your First Brazilian Wax</h2>
        <p>Here's what actually happens at a professional waxing studio like <strong>Wax Me Too</strong>:</p>
        <ul>
          <li><strong>Your esthetician has done this thousands of times.</strong> To her, it's simply her craft. She's not judging you, she's not uncomfortable, and she's completely focused on delivering excellent results.</li>
          <li><strong>You'll have complete privacy.</strong> We step out of the room while you prepare, giving you time to settle in before the service begins.</li>
          <li><strong>The discomfort is manageable.</strong> Yes, there's a sensation — a quick, sharp sting that passes immediately. Most first-time clients are genuinely surprised by how manageable it is.</li>
          <li><strong>It gets easier every time.</strong> By your second or third wax, most clients find the experience significantly more comfortable as hair grows back finer and the follicles weaken.</li>
        </ul>
        <h2>What Makes Wax Me Too Different</h2>
        <p>The horror stories you've heard usually involve salons that cut corners — double-dipping applicators, rushing through services, or using low-quality wax. At Wax Me Too, we've built our entire reputation on doing the opposite.</p>
        <ul>
          <li>No double-dipping — ever</li>
          <li>Sinks in every treatment room</li>
          <li>Experienced estheticians who specialize exclusively in waxing</li>
          <li>30-minute appointments so you never feel rushed</li>
          <li>A genuine commitment to your comfort and dignity</li>
        </ul>
        <p>Ready to take the plunge? Book at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "bikini-wax-types-explained":
      return `
        <p>Not all bikini waxes are the same — and knowing the difference helps you choose the service that's right for you. At <strong>Wax Me Too</strong>, we offer several bikini waxing options, each designed to meet different preferences and comfort levels. Here's your complete guide to bikini wax types.</p>
<img src="https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&auto=format&fit=crop" alt="Bikini wax types explained Brazilian vs regular" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Bikini Line Wax</h2>
        <p>The most conservative option, a <strong>bikini line wax</strong> removes hair from the sides and top of the bikini area — essentially, anything that would be visible outside a standard swimsuit. This is a great starting point for first-time waxers who want to try waxing without committing to a more comprehensive service.</p>
        <h2>Full Bikini Wax</h2>
        <p>A <strong>full bikini wax</strong> goes further than the bikini line, removing more hair from the sides and top for a cleaner, more thorough result. Some hair is left in the front, but the overall look is neater and more defined than a standard bikini line wax.</p>
        <h2>Brazilian Wax</h2>
        <p>The <strong>Brazilian wax</strong> is our most popular service — and for good reason. It removes all or nearly all hair from the bikini area, front to back, leaving you completely smooth. Clients can choose to leave a small strip or triangle in the front, or opt for a completely bare look. The Brazilian wax is the gold standard for beach vacations, honeymoons, and anyone who simply prefers the feeling of complete smoothness.</p>
        <h2>Which Should You Choose?</h2>
        <p>If you're new to waxing, we generally recommend starting with a bikini line or full bikini wax to see how your skin responds. If you're ready to go all-in, the Brazilian is an excellent choice — and our estheticians are experts at making first-time Brazilian clients feel comfortable and at ease.</p>
        <p>Book your bikini wax at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "eyebrow-design-waxing-guide":
      return `
        <p>Your eyebrows frame your face. They communicate expression, define your features, and — when perfectly shaped — can transform your entire look. At <strong>Wax Me Too</strong>, eyebrow design is one of our signature services, and our estheticians are experts at creating the ideal brow shape for every face.</p>
<img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop" alt="Eyebrow design waxing shaping guide" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>The Art of Eyebrow Design</h2>
        <p>Great eyebrow design is about more than just removing stray hairs. It's about understanding the natural architecture of your face and enhancing it. Our estheticians consider:</p>
        <ul>
          <li><strong>Face shape.</strong> Different face shapes call for different brow shapes. Oval faces can carry almost any brow shape; round faces benefit from higher arches; square faces look great with softer, more rounded brows.</li>
          <li><strong>Natural brow structure.</strong> We work with your natural brow, not against it — enhancing what you have rather than imposing an arbitrary shape.</li>
          <li><strong>Your preferences.</strong> Do you want a bold, defined brow or a softer, more natural look? We'll work with you to achieve exactly the shape you're envisioning.</li>
        </ul>
        <h2>The London Brow Company</h2>
        <p>Wax Me Too is proud to be the <strong>exclusive Utah retailer</strong> of The London Brow Company's product line — a premium, vegan, cruelty-free collection of brow products. From tinting to lamination to finishing products, The London Brow Company offers everything you need to maintain your perfect brows between appointments.</p>
        <h2>Eyebrow Tinting</h2>
        <p>Pair your eyebrow wax with an eyebrow tint for a complete brow transformation. Tinting adds definition, depth, and fullness to your brows — perfect for clients with lighter or sparser hair. Results last 4–6 weeks.</p>
        <h2>Book Your Brow Appointment</h2>
        <p>Book your eyebrow wax, tint, or design appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "underarm-waxing-guide-utah":
      return `
        <p>Underarm waxing is one of the most practical and popular waxing services — and one of the most underrated. At <strong>Wax Me Too</strong>, underarm waxing is a quick, affordable service that delivers 3–4 weeks of smooth, carefree underarms. Here's everything you need to know.</p>
<img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop" alt="Underarm waxing guide smooth underarms Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Why Wax Your Underarms?</h2>
        <p>The benefits of underarm waxing over shaving are significant:</p>
        <ul>
          <li><strong>3–4 weeks of smoothness</strong> vs. 1–3 days with shaving</li>
          <li><strong>No razor burn</strong> or irritation in a sensitive area</li>
          <li><strong>Finer regrowth over time</strong> — with consistent waxing, underarm hair grows back progressively softer and sparser</li>
          <li><strong>No daily maintenance</strong> — skip the morning razor routine</li>
          <li><strong>Better deodorant performance</strong> — deodorant adheres more effectively to smooth skin</li>
        </ul>
        <h2>What to Expect</h2>
        <p>Underarm waxing is one of our quickest services — typically taking just 5–10 minutes. The underarm area is sensitive, so you'll feel a quick sting with each pull, but the service is over before you know it. Most clients find underarm waxing significantly less uncomfortable than bikini waxing.</p>
        <h2>Aftercare Tips for Underarms</h2>
        <ul>
          <li>Avoid deodorant for 24 hours after your wax</li>
          <li>Avoid heat and sweating for 24 hours</li>
          <li>Begin gentle exfoliation 48 hours after your wax to prevent ingrown hairs</li>
        </ul>
        <p>Book your underarm waxing appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "3-worst-things-waxing-salon":
      return `
        <p>Not all waxing salons are created equal. In an industry with minimal regulation and wide variation in standards, knowing what to look for — and what to avoid — can make the difference between a great experience and a nightmare. Here are the <strong>3 worst things a waxing salon can do</strong>, and why you'll never encounter them at <strong>Wax Me Too</strong>.</p>
<img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop" alt="What to avoid at a waxing salon red flags" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>1. Double-Dipping</h2>
        <p>Double-dipping — reusing the same applicator stick in the wax pot after it's touched a client's skin — is the single most egregious hygiene violation in the waxing industry. Every time a used applicator goes back into the wax pot, bacteria from the previous client's skin are introduced into the wax. That wax then gets applied to the next client.</p>
        <p>At Wax Me Too, we use a fresh, single-use applicator for every application. No exceptions, no shortcuts. This is non-negotiable.</p>
        <h2>2. No Sink in the Treatment Room</h2>
        <p>Your esthetician should wash her hands in front of you before beginning any service. If there's no sink in the treatment room, that's simply not possible. A salon without sinks in treatment rooms is a salon that's cutting corners on hygiene.</p>
        <p>Every Wax Me Too treatment room is equipped with a sink. You'll see your esthetician wash her hands before she touches you — every single time.</p>
        <h2>3. Rushing Through Services</h2>
        <p>A Brazilian wax that's rushed is a Brazilian wax that's incomplete. Estheticians who are overbooked or undertrained often rush through services, leaving hairs behind and clients feeling unsatisfied.</p>
        <p>At Wax Me Too, we schedule Brazilian waxes for 30-minute appointments even though the service typically takes 15 minutes. You'll never feel rushed, and you'll never leave with hairs we missed.</p>
        <h2>The Wax Me Too Standard</h2>
        <p>These aren't just policies — they're the foundation of everything we do. Book at waxmetoo.com and experience the difference that genuine standards make.</p>
      `;

    case "brazilian-wax-benefits-vs-shaving":
      return `
        <p>The debate between waxing and shaving has a clear winner — and it's not even close. At <strong>Wax Me Too</strong>, we've helped thousands of clients make the switch from shaving to professional waxing, and the transformation in their skin, their confidence, and their daily routine is remarkable. Here's a comprehensive comparison.</p>
<img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop" alt="Brazilian wax benefits vs shaving comparison" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Results Duration</h2>
        <p><strong>Shaving:</strong> 1–3 days. Shaving cuts hair at the surface, leaving a blunt tip that's visible (and prickly) within hours.</p>
        <p><strong>Brazilian wax:</strong> 3–6 weeks. Waxing removes hair from the root, leaving skin genuinely smooth for weeks.</p>
        <h2>Hair Texture Over Time</h2>
        <p><strong>Shaving:</strong> Hair grows back the same — or coarser — with every shave. The blunt cut creates the illusion of thicker, darker regrowth.</p>
        <p><strong>Brazilian wax:</strong> Hair grows back progressively finer and sparser with each waxing session. Long-term waxers often report barely noticeable regrowth after years of consistent waxing.</p>
        <h2>Skin Quality</h2>
        <p><strong>Shaving:</strong> Razor burn, nicks, ingrown hairs, and irritation are common — especially in sensitive areas like the bikini zone.</p>
        <p><strong>Brazilian wax:</strong> Waxing acts as a mild exfoliant, removing dead skin cells along with hair and leaving skin visibly smoother. When done correctly, waxing significantly reduces the risk of ingrown hairs compared to shaving.</p>
        <h2>Daily Maintenance</h2>
        <p><strong>Shaving:</strong> Daily or near-daily maintenance required. Razor replacement, shaving cream, post-shave care — it adds up in time and money.</p>
        <p><strong>Brazilian wax:</strong> One appointment every 4–6 weeks. No daily routine, no razor burns, no stubble.</p>
        <h2>The Verdict</h2>
        <p>For anyone who shaves regularly, switching to professional waxing is one of the best decisions you can make for your skin and your routine. Book your first Brazilian wax at waxmetoo.com — first-time clients get their Brazilian wax for $50.</p>
      `;

    case "brazilian-waxing-salon-qa":
      return `
        <p>Thinking about trying a Brazilian wax but still have questions? You're not alone. At <strong>Wax Me Too</strong>, we answer these questions every day — and we love helping new clients feel informed and confident before their first appointment. Here are the answers to the questions we hear most often.</p>
<img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop" alt="Brazilian waxing salon Q&A questions answered" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Q: What exactly is a Brazilian wax?</h2>
        <p>A: A Brazilian wax removes all or nearly all hair from the bikini area — front, back, and everything in between. Clients can choose to leave a small strip or triangle in the front, or opt for a completely bare look. It's the most comprehensive bikini waxing service available.</p>
        <h2>Q: How long does the appointment take?</h2>
        <p>A: We schedule Brazilian wax appointments for 30 minutes. The actual waxing typically takes about 15 minutes — the extra time ensures you never feel rushed.</p>
        <h2>Q: How much does it cost?</h2>
        <p>A: Our Brazilian wax is $65. First-time clients get their Brazilian wax for $50 — see our full pricing at waxmetoo.com.</p>
        <h2>Q: How long does hair need to be?</h2>
        <p>A: At least ¼ inch — roughly 10 days of growth after shaving, or 3 to 4 weeks after waxing. If you're not sure, err on the side of more growth rather than less.</p>
        <h2>Q: Will it hurt?</h2>
        <p>A: There's a sensation — a quick, sharp sting that passes immediately. Most clients are surprised by how manageable it is. It gets significantly easier with each subsequent visit.</p>
        <h2>Q: How do I prepare?</h2>
        <p>A: Stop shaving at least 10 days before your appointment. Exfoliate gently 24–48 hours before. Shower and cleanse the area on the day of your appointment.</p>
        <p>Ready to book? Visit waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "prevention-magazine-bikini-wax-tips":
      return `
        <p>When <em>Prevention</em> magazine featured professional waxing tips, the advice aligned perfectly with what we've been telling our clients at <strong>Wax Me Too</strong> for years. Great waxing results come down to preparation, technique, and aftercare — and all three matter enormously.</p>
<img src="https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&auto=format&fit=crop" alt="Bikini wax tips from Prevention magazine" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Pre-Wax Preparation: The Foundation of Great Results</h2>
        <p>The most important thing you can do before a bikini wax is let your hair grow. <em>Prevention</em> recommends at least ¼ inch of growth — and we agree completely. Hair that's too short won't grip the wax properly, leading to incomplete results and a more uncomfortable experience.</p>
        <p>Beyond hair length, gentle exfoliation 24–48 hours before your appointment helps remove dead skin cells that can interfere with the wax's grip. And staying well-hydrated — both by drinking water and moisturizing your skin — makes for a smoother, more comfortable wax.</p>
        <h2>Choosing the Right Salon</h2>
        <p>Not all waxing salons are equal. <em>Prevention</em>'s advice: look for a salon that uses fresh applicators for every client (no double-dipping), has sinks in the treatment rooms, and employs experienced estheticians who specialize in waxing. That's exactly what you'll find at every Wax Me Too location.</p>
        <h2>Post-Wax Care</h2>
        <p>After your wax, avoid heat, sun exposure, and tight clothing for 24 hours. Begin gentle exfoliation 48 hours after your appointment and continue 2–3 times per week to prevent ingrown hairs. Moisturize daily to keep skin hydrated and smooth.</p>
        <p>Book your bikini wax at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "throw-away-your-razor":
      return `
        <p>It's time to have a serious conversation about your razor. That daily ritual of shaving — the nicks, the razor burn, the stubble that appears within hours — is it really serving you? At <strong>Wax Me Too</strong>, we've been helping Utah women (and men) throw away their razors since 2007. Here's why you should join them.</p>
<img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop" alt="Throw away your razor switch to waxing" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>The Real Cost of Shaving</h2>
        <p>Think about how much time you spend shaving. Five minutes a day, every day, adds up to over 30 hours a year. Add in the cost of razors, shaving cream, and aftershave products, and you're spending hundreds of dollars annually on a method that delivers results lasting less than 24 hours.</p>
        <p>Now compare that to professional waxing: one 30-minute appointment every 4–6 weeks. The time savings alone are significant — but the skin benefits are even more compelling.</p>
        <h2>What Happens When You Switch to Waxing</h2>
        <p>Clients who make the switch from shaving to professional waxing consistently report:</p>
        <ul>
          <li>Smoother skin that lasts weeks, not hours</li>
          <li>No more razor burn or ingrown hairs</li>
          <li>Progressively finer, sparser regrowth over time</li>
          <li>More confidence in swimwear and intimate situations</li>
          <li>A simplified daily routine — no more shaving in the shower</li>
        </ul>
        <h2>Ready to Make the Switch?</h2>
        <p>Your first step: stop shaving now and let your hair grow to at least ¼ inch (about 10 days). Then book your first appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
        <p>Throw away your razor. You won't miss it.</p>
      `;

    case "pre-vacation-waxing-checklist":
      return `
        <p>Vacation is coming — and your skin deserves to be ready. Whether you're heading to a tropical beach, a ski resort, or a European adventure, pre-vacation waxing ensures you arrive at your destination feeling confident, smooth, and completely carefree. Here's <strong>Wax Me Too's</strong> complete pre-vacation waxing checklist.</p>
<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop" alt="Pre-vacation waxing checklist travel ready" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>4–6 Weeks Before: Book Your Appointment</h2>
        <p>Don't wait until the last minute. Book your pre-vacation waxing appointment 4–6 weeks in advance to secure your preferred esthetician and time slot. If this is your first wax, we strongly recommend doing a trial run well before your trip to see how your skin responds.</p>
        <h2>10 Days Before: Stop Shaving</h2>
        <p>Hair needs to be at least ¼ inch long for waxing to work effectively. Stop shaving at least 10 days before your appointment to ensure optimal hair length.</p>
        <h2>2–3 Days Before Your Appointment: Prepare Your Skin</h2>
        <ul>
          <li>Exfoliate gently to remove dead skin cells</li>
          <li>Moisturize daily to keep skin hydrated</li>
          <li>Avoid retinol and AHA/BHA products on areas to be waxed</li>
        </ul>
        <h2>Day of Appointment</h2>
        <ul>
          <li>Shower and cleanse the area</li>
          <li>Avoid caffeine and alcohol</li>
        </ul>
        <h2>After Your Appointment</h2>
        <ul>
          <li>Avoid sun exposure for 24 hours</li>
          <li>Skip the pool or hot tub for 24 hours</li>
          <li>Pack SPF for freshly waxed areas</li>
        </ul>
        <h2>Book Your Pre-Vacation Wax</h2>
        <p>Wax Me Too has 6 locations across Utah. Book online at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "spring-adventure-waxing-utah":
      return `
        <p>Spring in Utah means hiking the red rock canyons of Moab, biking the trails of Park City, and finally shedding the layers that have kept you covered all winter. It also means it's time to get your skin ready for the season ahead. At <strong>Wax Me Too</strong>, spring is one of our busiest seasons — and for good reason.</p>
<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop" alt="Spring adventure waxing Utah outdoor ready" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Spring Waxing Services</h2>
        <p>As the temperatures rise and the outdoor adventures begin, here are the services our clients book most frequently in spring:</p>
        <ul>
          <li><strong>Brazilian wax</strong> — get ready for swimsuit season before the summer rush</li>
          <li><strong>Leg waxing</strong> — silky smooth legs for shorts, skirts, and hiking trails</li>
          <li><strong>Eyebrow design</strong> — refresh your brows after a winter of neglect</li>
          <li><strong>Underarm waxing</strong> — smooth underarms for tank tops and outdoor activities</li>
          <li><strong>Back waxing (men)</strong> — get beach-ready before the season starts</li>
        </ul>
        <h2>Spring Skin Care Tips</h2>
        <p>After a dry Utah winter, your skin needs some extra attention before waxing season:</p>
        <ul>
          <li><strong>Hydrate intensively.</strong> Winter air is notoriously drying. Moisturize daily for 2–3 weeks before your first spring wax.</li>
          <li><strong>Exfoliate regularly.</strong> Remove the buildup of dead skin cells from winter to allow the wax to grip hair effectively.</li>
          <li><strong>Protect with SPF.</strong> As UV exposure increases in spring, protect freshly waxed skin with sunscreen.</li>
        </ul>
        <h2>Book Your Spring Appointment</h2>
        <p>Spring appointments fill up fast — book early at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "holiday-waxing-on-top-of-the-world":
      return `
        <p>The holidays are a time for family gatherings, festive parties, and — at <strong>Wax Me Too</strong> — a full calendar of clients getting holiday-ready. Whether you're attending an office party, a family reunion, or a New Year's Eve celebration, professional waxing is the finishing touch that makes you feel your absolute best.</p>
<img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop" alt="Holiday waxing special on top of the world" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Holiday Waxing Services</h2>
        <p>The most popular holiday waxing services at Wax Me Too:</p>
        <ul>
          <li><strong>Eyebrow design and waxing.</strong> Perfectly shaped brows for every holiday photo. Our estheticians are experts at creating clean, defined brows that frame your face beautifully.</li>
          <li><strong>Brazilian wax.</strong> For holiday getaways, New Year's Eve celebrations, and everything in between.</li>
          <li><strong>Full leg waxing.</strong> Silky smooth legs for holiday dresses and party outfits.</li>
          <li><strong>Facial waxing.</strong> Upper lip, chin, and sideburns — a flawless complexion for holiday photos.</li>
        </ul>
        <h2>Book Early for the Holidays</h2>
        <p>The holiday season is our busiest time of year. We strongly recommend booking your holiday appointments at least 2–3 weeks in advance to secure your preferred time slot. Our online booking system makes it easy — visit waxmetoo.com and select your preferred location, esthetician, and service.</p>
        <h2>Gift Cards Available</h2>
        <p>Looking for the perfect holiday gift? Wax Me Too gift cards are available at all 6 locations. Give the gift of smooth, confident skin — it's a present that's always appreciated.</p>
      `;

    case "sundance-film-festival-waxing-utah":
      return `
        <p>Every January, Park City transforms into one of the world's most glamorous destinations as the <strong>Sundance Film Festival</strong> brings celebrities, filmmakers, and film lovers from around the globe to Utah. And every January, <strong>Wax Me Too</strong> sees a surge of clients getting festival-ready.</p>
<img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop" alt="Sundance Film Festival waxing Utah Park City" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Looking Your Best at Sundance</h2>
        <p>Whether you're attending screenings, parties, or simply soaking in the festival atmosphere on Main Street, looking and feeling your best matters. Professional waxing is a key part of the pre-festival beauty routine for many of our clients — and it's easy to see why.</p>
        <p>A Brazilian wax, perfectly shaped brows, and smooth legs give you the confidence to focus on the films, the conversations, and the experiences — not your appearance. That's the Wax Me Too promise.</p>
        <h2>Pre-Festival Waxing Tips</h2>
        <ul>
          <li><strong>Book 2–3 days before the festival begins.</strong> This gives your skin time to settle after the service.</li>
          <li><strong>Include eyebrow design.</strong> Festival photos are everywhere — make sure your brows are camera-ready.</li>
          <li><strong>Consider a full leg wax.</strong> Park City in January means layers, but the après-ski parties mean showing some skin.</li>
        </ul>
        <h2>Book at Our Draper or Salt Lake City Location</h2>
        <p>Our Draper and Salt Lake City studios are the most convenient for Sundance attendees. Book online at waxmetoo.com — first-time clients get their Brazilian wax for $50.</p>
      `;

    case "valentines-day-waxing-rippp-and-swear":
      return `
        <p>Valentine's Day is coming — and at <strong>Wax Me Too</strong>, we have a saying: "Rip it and swear by it." Because once you experience the results of a professional Brazilian wax, you'll never go back to shaving. And there's no better time to make the switch than before Valentine's Day.</p>
<img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop" alt="Valentine's Day waxing special Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>The Valentine's Day Brazilian: Why It's Worth It</h2>
        <p>Valentine's Day is one of our busiest times of year — and it's not hard to understand why. Whether you're celebrating with a long-term partner or someone new, feeling confident and smooth makes the occasion even more special.</p>
        <p>A Brazilian wax provides weeks of smooth, carefree skin — no last-minute shaving, no razor burn, no stubble. Just smooth, confident skin that lets you focus on what matters.</p>
        <h2>Book Early — Valentine's Week Fills Up Fast</h2>
        <p>Valentine's Day appointments at Wax Me Too fill up weeks in advance. We strongly recommend booking at least 2 weeks before February 14th to secure your preferred time slot. Book online at waxmetoo.com and select your preferred location from our 6 Utah studios.</p>
        <h2>New Client Special</h2>
        <p>Never tried a Brazilian wax before? Valentine's Day is the perfect occasion for your first experience. First-time clients get their Brazilian wax for $50 — and our estheticians are experts at making first-timers feel comfortable and at ease.</p>
        <p>Rip it. Swear by it. Book at waxmetoo.com.</p>
      `;

    case "valentines-day-free-brazilian-2013":
      return `
        <p>Love is in the air — and so is the chance to win a free Brazilian wax. At <strong>Wax Me Too</strong>, we're celebrating Valentine's Day 2013 with a special giveaway: one lucky winner will receive a complimentary Brazilian wax at any of our Utah locations.</p>
<img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop" alt="Valentine's Day free Brazilian wax 2013" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>How to Enter</h2>
        <p>Entering is simple. Visit our website, fill out the entry form, and you're automatically in the drawing. The winner will be notified by text message before Valentine's Day — giving you plenty of time to book your appointment and get smooth for the occasion.</p>
        <h2>Why a Brazilian Wax Makes the Perfect Valentine's Gift</h2>
        <p>Whether you're treating yourself or someone special, a Brazilian wax is a gift that keeps giving — literally. Professional waxing provides 3–6 weeks of smooth, confident skin, making it one of the most practical and appreciated beauty gifts you can give.</p>
        <p>And for first-time clients, our Valentine's giveaway is the perfect opportunity to experience professional waxing risk-free. Our licensed estheticians are experts at making new clients feel comfortable, informed, and completely at ease.</p>
        <h2>About Wax Me Too</h2>
        <p>Wax Me Too has been Utah's premier waxing-only studio since 2007. We were the first waxing-only salon in Utah, and we remain the most trusted name in professional waxing across the state. Book at waxmetoo.com.</p>
      `;

    case "valentines-day-free-wax-giveaway-2017":
      return `
        <p>Happy Valentine's Day from <strong>Wax Me Too</strong>! To celebrate the season of love, we're giving away a free waxing service to one lucky winner. Whether you're treating yourself or someone special, this is your chance to experience Utah's most trusted waxing studio on us.</p>
<img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop" alt="Valentine's Day free wax giveaway 2017" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>How to Enter</h2>
        <p>Visit our website and fill out the entry form. It takes less than a minute, and you'll be entered to win a complimentary waxing service at any of our Utah locations. Winners are notified by text message.</p>
        <h2>Valentine's Day Waxing: Our Most Popular Services</h2>
        <p>As Valentine's Day approaches, here are the services our clients book most frequently:</p>
        <ul>
          <li><strong>Brazilian wax</strong> — the ultimate Valentine's Day service</li>
          <li><strong>Eyebrow design</strong> — perfectly shaped brows for Valentine's Day photos</li>
          <li><strong>Full leg waxing</strong> — silky smooth legs for Valentine's evening</li>
          <li><strong>Facial waxing</strong> — a flawless complexion for the occasion</li>
        </ul>
        <h2>Book Your Valentine's Appointment</h2>
        <p>Valentine's week fills up fast. Book your appointment now at waxmetoo.com — first-time clients get their Brazilian wax for $50. And don't forget to enter our giveaway for a chance to win a free service!</p>
      `;

    case "free-bikini-wax-drawing-utah":
      return `
        <p>Here's your chance to win a free bikini wax from <strong>Wax Me Too</strong> — Utah's premier professional waxing studio. We're running a monthly drawing, and entering takes less than a minute.</p>
<img src="https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&auto=format&fit=crop" alt="Free bikini wax drawing contest Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>How to Enter</h2>
        <p>Visit our website and fill out the entry form. Winners are selected monthly and notified by text message. Some months, we draw winners more frequently — so the sooner you enter, the better your chances.</p>
        <h2>Why We Do Giveaways</h2>
        <p>At Wax Me Too, we believe that every woman deserves to feel confident and cared for. Our monthly giveaways are our way of saying thank you to our incredible Utah community — and of giving new clients a risk-free way to discover what professional waxing can do for them.</p>
        <p>If you've been curious about waxing but haven't taken the plunge, winning a free bikini wax is the perfect way to try it without any commitment. Our licensed estheticians will make you feel comfortable, informed, and completely at ease from the moment you walk in.</p>
        <h2>About Wax Me Too</h2>
        <p>Wax Me Too has been Utah's most trusted waxing studio since 2007. We have 6 locations across the state — Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Book at waxmetoo.com. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "waxing-south-jordan-utah-opening":
      return `
        <p>The wait is over, South Jordan! <strong>Wax Me Too</strong> is thrilled to announce the opening of our South Jordan studio — bringing Utah's premier professional waxing experience to the heart of the Salt Lake Valley's southwest corridor.</p>
<img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop" alt="Wax Me Too South Jordan Utah grand opening" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Welcome to Wax Me Too South Jordan</h2>
        <p>Our South Jordan studio is located at <strong>3674 W South Jordan Pkwy</strong>, conveniently situated for residents of South Jordan, West Jordan, Herriman, and Riverton. The studio features fully equipped treatment rooms with sinks, ensuring the hygiene standards our clients have come to expect at every Wax Me Too location.</p>
        <h2>Grand Opening Special</h2>
        <p>To celebrate our South Jordan opening, we're offering a special grand opening discount for new clients. Visit waxmetoo.com and book at the South Jordan location to take advantage of this limited-time offer.</p>
        <h2>The Wax Me Too Experience</h2>
        <p>Every Wax Me Too location is built on the same foundation: exceptional hygiene, expert estheticians, transparent pricing, and a warm, welcoming atmosphere. Our South Jordan team brings years of waxing expertise and a genuine passion for client care to every appointment.</p>
        <ul>
          <li>No double-dipping — ever</li>
          <li>Sinks in every treatment room</li>
          <li>No memberships, no pressure</li>
          <li>your first Brazilian wax for $50</li>
        </ul>
        <p>Book your South Jordan appointment at waxmetoo.com. We can't wait to welcome you.</p>
      `;

    case "south-jordan-waxing-grand-opening":
      return `
        <p>South Jordan, we're officially open! <strong>Wax Me Too</strong> is proud to welcome our South Jordan community to our newest studio. After months of preparation, we're ready to bring Utah's most trusted waxing experience to this vibrant, growing community.</p>
<img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop" alt="South Jordan waxing grand opening celebration" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Meet Your South Jordan Team</h2>
        <p>Our South Jordan studio is staffed by experienced, licensed estheticians who share the same passion for professional waxing that has defined Wax Me Too since 2007. They've been trained in our signature techniques and are committed to the hygiene standards, client care, and attention to detail that our clients have come to expect.</p>
        <h2>Services Available at South Jordan</h2>
        <p>Our South Jordan studio offers the full Wax Me Too menu:</p>
        <ul>
          <li>Brazilian wax and bikini waxing</li>
          <li>Eyebrow design, waxing, and tinting</li>
          <li>Full body waxing — legs, arms, back, chest</li>
          <li>Men's waxing services including the Manzilian</li>
          <li>Facial waxing</li>
        </ul>
        <h2>Book Your Appointment</h2>
        <p>Book online at waxmetoo.com and select the South Jordan location. First-time clients get their Brazilian wax for $50. We're so excited to be part of the South Jordan community — we can't wait to meet you.</p>
      `;

    case "utah-waxing-salon-established-2007":
      return `
        <p>In 2007, two best friends with a shared vision opened Utah's first waxing-only salon in Draper. They called it <strong>Wax Me Too</strong>. Nearly two decades later, that vision has grown into a network of 6 studios across Utah — and the values that guided those first appointments still guide every service we provide today.</p>
<img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop" alt="Wax Me Too Utah waxing salon established 2007" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>The Story of Wax Me Too</h2>
        <p>Before Wax Me Too, professional waxing in Utah was an afterthought — a service offered alongside haircuts and manicures at general beauty salons. The quality was inconsistent, the hygiene standards were often questionable, and clients had no way of knowing whether they were in the hands of a true specialist or a generalist who waxed occasionally.</p>
        <p>Our founders saw an opportunity to do something different: create a salon dedicated entirely to waxing, staffed by estheticians who specialized exclusively in this craft, and built on hygiene standards that clients could trust.</p>
        <h2>What We Stand For</h2>
        <ul>
          <li><strong>Specialization.</strong> We do one thing, and we do it exceptionally well.</li>
          <li><strong>Hygiene.</strong> No double-dipping, sinks in every room, sanitized between every client.</li>
          <li><strong>Transparency.</strong> No memberships, no hidden fees, no pressure.</li>
          <li><strong>Community.</strong> Women-owned, locally operated, deeply invested in Utah.</li>
        </ul>
        <h2>Thank You, Utah</h2>
        <p>To every client who has trusted us with their waxing needs since 2007: thank you. You are the reason we do what we do. Book your next appointment at waxmetoo.com.</p>
      `;

    case "st-george-waxing-salon-utah":
      return `
        <p>Southern Utah's most trusted waxing studio is right here in St. George. <strong>Wax Me Too St. George</strong> has been serving Washington County since 2008 — just one year after we opened Utah's first waxing-only salon in Draper. We know Southern Utah, we love this community, and we're proud to be your go-to destination for professional waxing.</p>
<img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop" alt="Professional waxing salon St. George Utah" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Our St. George Studio</h2>
        <p>Located inside Salon Aubri McKai at <strong>175 W 900 S #9, St. George, UT 84770</strong>, our studio features two fully equipped treatment rooms on the upper floor. We serve clients from throughout Washington County — including St. George, Washington, Hurricane, and Santa Clara — as well as visitors from nearby Mesquite, Nevada.</p>
        <h2>Our Services in St. George</h2>
        <p>We offer the full Wax Me Too menu in St. George:</p>
        <ul>
          <li>Brazilian wax and bikini waxing</li>
          <li>Eyebrow design, waxing, and tinting featuring The London Brow Company</li>
          <li>Full body waxing for women and men</li>
          <li>The Manzilian — men's Brazilian wax</li>
          <li>Facial waxing</li>
        </ul>
        <h2>The London Brow Company — Exclusively at Wax Me Too</h2>
        <p>We are proud to be the exclusive Utah retailer of <strong>The London Brow Company</strong> — a premium, vegan, cruelty-free brow product line. Available at our St. George location and select other Wax Me Too studios.</p>
        <h2>Book Your St. George Appointment</h2>
        <p>Book online at waxmetoo.com and select the St. George location. First-time clients get their Brazilian wax for $50.</p>
      `;

    case "mens-eyebrow-waxing-metrosexual":
      return `
        <p>Gentlemen, it's time to talk about your eyebrows. Well-groomed brows are no longer the exclusive domain of women — and they haven't been for years. At <strong>Wax Me Too</strong>, men's eyebrow waxing is one of our fastest-growing services, and the results speak for themselves.</p>
<img src="https://images.unsplash.com/photo-1621607505282-d1e5f5b0f1e7?w=800&auto=format&fit=crop" alt="Men's eyebrow waxing grooming metrosexual guide" style="width:100%;border-radius:0.75rem;margin:2rem 0;object-fit:cover;max-height:420px;box-shadow:0 4px 16px rgba(59,47,42,0.08);" />
        <h2>Why Men Should Wax Their Eyebrows</h2>
        <p>Your eyebrows frame your face. Overgrown, unruly brows can make you look older, more tired, and less polished than you actually are. A clean, well-shaped brow — even a subtle one — makes a significant difference in your overall appearance.</p>
        <p>The key for men's eyebrow waxing is subtlety. We're not here to give you a dramatic arch or a heavily defined shape. We're here to clean up the edges, remove the strays, and give your natural brow a neat, groomed appearance that looks intentional without looking overdone.</p>
        <h2>What to Expect</h2>
        <p>Men's eyebrow waxing at Wax Me Too takes about 10–15 minutes. Your esthetician will assess your natural brow shape and discuss your preferences before beginning. The service removes stray hairs above, below, and between the brows, leaving a clean, natural-looking result.</p>
        <h2>The Unibrow: We Can Help</h2>
        <p>If you're dealing with a unibrow, we can take care of that too — quickly, cleanly, and with results that last 3–4 weeks. No more daily tweezing or shaving between the brows.</p>
        <h2>Book Your Men's Eyebrow Wax</h2>
        <p>Book at waxmetoo.com and select "Men's Eyebrow Wax" from the service menu. First-time clients get their Brazilian wax for $50.</p>
      `;

    default:
      return `
        <p>${"This article is coming soon. Check back for the full content."}</p>
      `;
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const post = blogPosts.find(p => p.slug === slug);
  const postTags: string[] = (post as any)?.tags ?? [];

  // Blog archive: group all posts by year → month
  const archiveTree = useMemo(() => {
    const tree: Record<number, Record<number, typeof blogPosts>> = {};
    blogPosts.forEach(p => {
      const d = new Date(p.date);
      const y = d.getFullYear();
      const m = d.getMonth();
      if (!tree[y]) tree[y] = {};
      if (!tree[y][m]) tree[y][m] = [];
      tree[y][m].push(p);
    });
    return tree;
  }, []);

  const sortedYears = useMemo(() => Object.keys(archiveTree).map(Number).sort((a, b) => b - a), [archiveTree]);
  const [expandedYears, setExpandedYears] = useState<Set<number>>(() => {
    const currentYear = new Date().getFullYear();
    return new Set([currentYear, currentYear - 1]);
  });

  const toggleYear = (year: number) => {
    setExpandedYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const recentPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 4);

  // Tag-based related posts: score by shared tags, fall back to category
  const related = blogPosts
    .filter(p => p.slug !== slug)
    .map(p => {
      const pTags: string[] = (p as any).tags ?? [];
      const sharedTags = postTags.filter(t => pTags.includes(t)).length;
      const sameCategory = p.category === post?.category ? 1 : 0;
      return { post: p, score: sharedTags * 2 + sameCategory };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => r.post);

  // Dynamic SEO meta
  useSEO(
    post?.title ?? 'Blog',
    post?.excerpt ?? 'Read the latest waxing tips, news, and guides from Wax Me Too — Utah\'s professional waxing studio since 2007.'
  );

  useBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Journal", url: "/blog" },
    { name: post?.title ?? "Article", url: `/blog/${slug}` },
  ]);

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
      {/* Hero — full-width image with gradient overlay */}
      <section className="relative overflow-hidden" style={{ minHeight: '380px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.image})` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(59,47,42,0.92) 0%, rgba(59,47,42,0.75) 55%, rgba(59,47,42,0.35) 100%)' }} />
        <div className="relative container py-14 md:py-20">
          <Link href="/blog">
            <span className="inline-flex items-center gap-2 text-[#D8C6B6] text-sm font-body mb-8 cursor-pointer hover:text-[#CFA7A0] transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Journal
            </span>
          </Link>
          <FadeUp>
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs font-body font-semibold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(168,179,170,0.2)", border: "1px solid rgba(168,179,170,0.4)", color: "#A8B3AA" }}>{post.category}</span>
                <span className="flex items-center gap-1 text-xs text-[#D8C6B6] font-body">
                  <Clock size={11} /> {post.readTime}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#D8C6B6] font-body">
                  <Calendar size={11} /> {post.date}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl text-white leading-tight mb-4">{post.title}</h1>
              <p className="text-[#D8C6B6] font-body text-base leading-relaxed max-w-xl">{post.excerpt}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Article */}
      <section className="py-14 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Content */}
            <div className="lg:col-span-2">
              <FadeUp>
                {/* Article body */}
                <div
                  className="prose prose-lg max-w-none"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#4A4A4A",
                    lineHeight: "1.9",
                    fontSize: "1.0625rem",
                  }}
                  dangerouslySetInnerHTML={{ __html: getArticleContent(post.slug) }}
                />
              </FadeUp>

              {/* Tags section */}
              {postTags.length > 0 && (
                <FadeUp delay={80}>
                  <div className="mt-10 pt-8 border-t border-[#D8C6B6]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-body font-semibold text-[#A8B3AA] uppercase tracking-widest mr-1">
                        <Hash size={13} /> Tags
                      </span>
                      {postTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => navigate(`/blog?tag=${encodeURIComponent(tag)}`)}
                          className="text-xs px-3 py-1.5 rounded-full border border-[#D8C6B6] bg-white text-[#4A4A4A] hover:bg-[#CFA7A0] hover:border-[#CFA7A0] hover:text-white transition-all duration-200 font-body cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              )}

              {/* Social Share */}
              <FadeUp delay={90}>
                <div className="mt-8 pt-6 border-t border-[#D8C6B6]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-body font-semibold text-[#A8B3AA] uppercase tracking-widest">Share this post</span>
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-semibold bg-[#1877F2] text-white hover:bg-[#1565d8] transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                    {/* Pinterest */}
                    <a
                      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&media=${encodeURIComponent(post.image)}&description=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-semibold bg-[#E60023] text-white hover:bg-[#c0001d] transition-colors"
                      aria-label="Pin on Pinterest"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                      Pinterest
                    </a>
                    {/* X / Twitter */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-semibold bg-[#000000] text-white hover:bg-[#333] transition-colors"
                      aria-label="Share on X"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      X
                    </a>
                    {/* Copy Link */}
                    <CopyLinkButton />
                  </div>
                </div>
              </FadeUp>

              {/* CTA in article */}
              <FadeUp delay={100}>
                <div className="mt-10 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #3B2F2A 0%, #5a4540 100%)' }}>
                  <div className="p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                      <p className="text-xs font-body font-semibold uppercase tracking-widest mb-2" style={{ color: "#A8B3AA" }}>New Client Special</p>
                      <h3 className="font-display text-2xl text-white mb-2">Ready to get smooth?</h3>
                      <p className="text-[#D8C6B6] font-body text-sm">First time at Wax Me Too? Get your Brazilian wax for $50 at any of our 6 Utah locations.</p>
                    </div>
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose whitespace-nowrap shrink-0">
                      Book Your Appointment
                    </a>
                  </div>
                </div>
              </FadeUp>

              {/* Tag-based Related Posts */}
              {related.length > 0 && (
                <FadeUp delay={120}>
                  <div className="mt-14">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px flex-1 bg-[#D8C6B6]" />
                      <h2 className="font-display text-2xl text-[#3B2F2A] whitespace-nowrap">You Might Also Like</h2>
                      <div className="h-px flex-1 bg-[#D8C6B6]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {related.map((p, i) => (
                        <FadeUp key={p.id} delay={i * 60}>
                          <Link href={`/blog/${p.slug}`}>
                            <div className="group cursor-pointer rounded-xl overflow-hidden border border-[#D8C6B6] bg-white hover:shadow-md transition-shadow duration-300">
                              <div className="aspect-[4/3] overflow-hidden">
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              <div className="p-4">
                                <span className="text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "#A8B3AA" }}>{p.category}</span>
                                <h3 className="font-display text-base text-[#3B2F2A] mt-1 leading-snug group-hover:text-[#A8B3AA] transition-colors line-clamp-2">{p.title}</h3>
                                <p className="text-xs text-[#A8B3AA] font-body mt-2 flex items-center gap-1">
                                  <Clock size={10} /> {p.readTime}
                                </p>
                                {/* Show shared tags */}
                                {(() => {
                                  const pTags: string[] = (p as any).tags ?? [];
                                  const shared = postTags.filter(t => pTags.includes(t)).slice(0, 2);
                                  return shared.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {shared.map(t => (
                                        <span key={t} className="text-xs bg-[#F7F3EE] text-[#A8B3AA] px-2 py-0.5 rounded-full">#{t}</span>
                                      ))}
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            </div>
                          </Link>
                        </FadeUp>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-28 space-y-5" style={{ maxHeight: 'calc(100vh - 7rem)', overflowY: 'auto', paddingRight: '4px' }}>

              {/* Book Now CTA */}
              <FadeUp>
                <div className="bg-[#3B2F2A] rounded-xl p-5">
                  <p className="text-xs font-body font-semibold uppercase tracking-wide mb-2" style={{ color: "#A8B3AA" }}>New Client Special</p>
                  <p className="font-display text-xl text-white mb-1">Brazilian wax for $50 — first visit only</p>
                  <p className="text-xs text-[#D8C6B6] font-body mb-3">6 Utah locations. Book online in minutes.</p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose text-sm py-2.5 w-full text-center block">
                    Book Now
                  </a>
                </div>
              </FadeUp>

              {/* Related Service */}
              {(post as any).relatedService && (
                <FadeUp delay={60}>
                  <div className="bg-[#F7F3EE] rounded-xl p-4 border border-[#D8C6B6]">
                    <p className="text-xs font-body font-semibold text-[#A8B3AA] uppercase tracking-wide mb-2 flex items-center gap-1"><Tag size={11} /> Related Service</p>
                    <Link href={(post as any).relatedService}>
                      <span className="flex items-center gap-2 text-[#3B2F2A] font-display text-base hover:text-[#CFA7A0] transition-colors cursor-pointer">
                        <ExternalLink size={13} className="text-[#CFA7A0]" />
                        View Service & Pricing
                      </span>
                    </Link>
                  </div>
                </FadeUp>
              )}

              {/* Quick Links */}
              <FadeUp delay={80}>
                <div className="bg-white rounded-xl p-4 shadow-sm" style={{ borderTop: "4px solid", borderImage: "linear-gradient(90deg, #CFA7A0, #A8B3AA) 1" }}>
                  <h3 className="font-display text-base text-[#3B2F2A] mb-3">Quick Links</h3>
                  <ul className="space-y-1.5">
                    {[
                      { label: "First Visit Guide", href: "/first-visit" },
                      { label: "Before Care", href: "/before-care" },
                      { label: "After Care", href: "/after-care" },
                      { label: "FAQ Center", href: "/faq" },
                      { label: "Services & Pricing", href: "/services" },
                      { label: "All Locations", href: "/locations" },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>
                          <span className="text-sm font-body text-[#4A4A4A] hover:text-[#A8B3AA] transition-colors cursor-pointer flex items-center gap-1.5">
                            <ArrowRight size={11} style={{ color: "#A8B3AA" }} /> {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>

              {/* Recent Posts */}
              <FadeUp delay={100}>
                <div className="bg-white rounded-xl p-4 shadow-sm border-t-4 border-[#A8B3AA]">
                  <h3 className="font-display text-base text-[#3B2F2A] mb-3 flex items-center gap-2"><BookOpen size={14} className="text-[#A8B3AA]" /> Recent Posts</h3>
                  <ul className="space-y-3">
                    {recentPosts.map(p => (
                      <li key={p.slug}>
                        <Link href={`/blog/${p.slug}`}>
                          <div className="flex gap-2.5 group cursor-pointer">
                            <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-body font-semibold text-[#3B2F2A] group-hover:text-[#CFA7A0] transition-colors leading-snug line-clamp-2">{p.title}</p>
                              <p className="text-xs text-[#A8B3AA] font-body mt-0.5">{new Date(p.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/blog">
                    <span className="text-xs hover:underline cursor-pointer mt-3 block" style={{ color: "#A8B3AA" }}>View all posts →</span>
                  </Link>
                </div>
              </FadeUp>

              {/* Blog Archive Tree */}
              <FadeUp delay={120}>
                <div className="bg-white rounded-xl p-4 shadow-sm" style={{ borderTop: "4px solid #A8B3AA" }}>
                  <h3 className="font-display text-base text-[#3B2F2A] mb-3 flex items-center gap-2"><Calendar size={14} style={{ color: "#A8B3AA" }} /> Blog Archive</h3>
                  <div className="space-y-1" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {sortedYears.map(year => {
                      const yearPosts = Object.values(archiveTree[year]).flat();
                      const isExpanded = expandedYears.has(year);
                      return (
                        <div key={year}>
                          <button
                            onClick={() => toggleYear(year)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#F7F3EE] transition-colors group"
                          >
                            <span className="text-sm font-body font-semibold text-[#3B2F2A] group-hover:text-[#CFA7A0] transition-colors">{year}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-[#A8B3AA] font-body">{yearPosts.length}</span>
                              {isExpanded ? <ChevronDown size={12} className="text-[#CFA7A0]" /> : <ChevronRight size={12} className="text-[#A8B3AA]" />}
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="ml-3 border-l border-[#D8C6B6] pl-3 space-y-0.5 mb-1">
                              {Object.keys(archiveTree[year]).map(Number).sort((a, b) => b - a).map(month => {
                                const monthPosts = archiveTree[year][month];
                                return (
                                  <div key={month}>
                                    <p className="text-xs font-body font-semibold text-[#A8B3AA] uppercase tracking-wide py-1">{monthNames[month]}</p>
                                    <ul className="space-y-0.5">
                                      {monthPosts.map(p => (
                                        <li key={p.slug}>
                                          <Link href={`/blog/${p.slug}`}>
                                            <span className={`text-xs font-body block py-0.5 px-1 rounded transition-colors cursor-pointer line-clamp-1 ${
                                              p.slug === slug
                                                ? 'text-[#CFA7A0] font-semibold bg-[#F7F3EE]'
                                                : 'text-[#4A4A4A] hover:text-[#CFA7A0] hover:bg-[#F7F3EE]'
                                            }`}>
                                              {p.title}
                                            </span>
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Link href="/blog">
                    <span className="text-xs text-[#CFA7A0] hover:underline cursor-pointer mt-3 block">← Back to Journal</span>
                  </Link>
                </div>
              </FadeUp>

            </div>
          </div>
        </div>
      </section>

    <MascotEasterEgg pageId="blogpost" />
    </Layout>
  );
}
