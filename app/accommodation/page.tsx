"use client";

import { useEffect, useRef } from "react";

const GALLERY_IMAGES = [
  { src: "/accomodation1.jpg", alt: "Accommodation view 1" },
  { src: "/accomodation2.jpg", alt: "Accommodation view 2" },
  { src: "/accomodation3.jpg", alt: "Accommodation view 3" },
  { src: "/accomodation4.jpg", alt: "Accommodation view 4" },
  { src: "/accomodation5.jpg", alt: "Accommodation view 5" },
  { src: "/accomodation6.jpg", alt: "Accommodation view 6" },
  { src: "/accomodation7.jpg", alt: "Accommodation view 7" },
  { src: "/accomodation8.jpg", alt: "Accommodation view 8" },
  { src: "/accomodation9.jpg", alt: "Accommodation view 9" },
];

const FEATURES = [
  {
    title: "Comfortable Beds",
    text: "Proper mattresses, quality linen, and mosquito nets. Sleep soundly after a day in the bush.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" /></svg>
    ),
  },
  {
    title: "Bathroom Facilities",
    text: "En-suite bathrooms with hot running water, flush toilets, and solar-powered lighting.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21v-5.4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V21" /><path d="M14 13.8V11a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2.8" /><path d="M20 21v-8a2 2 0 0 0-2-2h-1.6" /><path d="M4 21v-8a2 2 0 0 1 2-2h1.6" /><path d="M10 9V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v5" /></svg>
    ),
  },
  {
    title: "Meals & Dining",
    text: "Home-cooked breakfasts and dinners served in the boma or under the stars. Dietary requirements catered for.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
    ),
  },
  {
    title: "Campfire Experience",
    text: "Gather around the fire each evening. Share stories, stargaze, and listen to the bush come alive after dark.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-4.8 0-9 3.86-9 9 0 2.12.74 4.07 1.97 5.61L3 21l3.39-1.97A8.93 8.93 0 0 0 12 21c4.97 0 9-3.86 9-9s-4.03-9-9-9Z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
    ),
  },
  {
    title: "Wildlife Experience",
    text: "Game drives led by qualified guides. Spot the Big Five and learn tracking from people who grew up doing it.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" /><path d="M8 14v.5" /><path d="M16 14v.5" /><path d="M11.25 16.25h1.5L12 17l-.75-.75Z" /></svg>
    ),
  },
  {
    title: "Solar Power",
    text: "Off-grid solar energy keeps lights on and devices charged without disturbing the natural environment.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3" /><path d="M9.8 7.8l-2 6.3" /><path d="M12 12v.01" /></svg>
    ),
  },
];

export default function AccommodationPage() {
  const checkinRef = useRef<HTMLInputElement>(null);
  const checkoutRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // ---- Reveal-on-scroll ----
    const revealEls = document.querySelectorAll(".reveal");
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach((el) => io?.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }

    // ---- Minimum date for check-in / check-out ----
    const today = new Date().toISOString().split("T")[0];
    const checkin = checkinRef.current;
    const checkout = checkoutRef.current;
    checkin?.setAttribute("min", today);
    checkout?.setAttribute("min", today);

    const onCheckinChange = () => {
      if (!checkin || !checkout) return;
      checkout.setAttribute("min", checkin.value);
      if (checkout.value && checkout.value < checkin.value) {
        checkout.value = checkin.value;
      }
    };
    checkin?.addEventListener("change", onCheckinChange);

    return () => {
      io?.disconnect();
      checkin?.removeEventListener("change", onCheckinChange);
    };
  }, []);

  function handleBookingSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Thank you! We will contact you shortly to confirm your booking.");
  }

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="hero accom-hero" id="top">
        <div className="hero-bg">
          <img src="/hero.jpg" alt="Tented safari camp at sunrise in the African bush" />
          <div className="hero-bg-overlay"></div>
        </div>
        <div className="hero-inner">
          <div className="hero-copy reveal">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-current">Accommodation</span>
            </nav>
            <h1 className="h-display">Stay in the <em>wild.</em></h1>
            <p className="lede">Experience nature like never before. Our tented camps and safari lodges put you right where the action is — surrounded by bush, sky, and the sounds of Africa.</p>
            <div className="hero-actions">
              <a href="#book" className="btn btn-primary">Book accommodation <span className="btn-arrow">→</span></a>
              <a href="#tented" className="btn btn-ghost on-dark">Explore stays</a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TENTED ACCOMMODATION ==================== */}
      <section className="section" id="tented" style={{ background: "linear-gradient(135deg, rgba(169,121,28,.04), rgba(201,162,39,.02))" }}>
        <div className="wrap tented-section">
          <div className="tented-image-wrap reveal">
            <img src="/accomodation.jpg" alt="Luxury tented camp in Kruger National Park" />
          </div>
          <div className="tented-content reveal">
            <span className="eyebrow-note">Tented Accommodation</span>
            <h2 className="h-display">Sleep where the wild things are.</h2>
            <p>Our tented accommodation in Kruger National Park offers the perfect balance of raw nature and genuine comfort. Fall asleep to the call of hyenas and wake to birdsong — all from a proper bed with quality linen and an en-suite bathroom.</p>
            <p>Each tent is positioned for privacy and views, with a private deck where you can watch game move through the bush at dawn and dusk. It's camping, elevated.</p>
            <div className="tented-meta">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              Kruger National Park, Mpumalanga
            </div>
          </div>
        </div>
      </section>

      {/* ==================== IMAGE GALLERY ==================== */}
      <section className="section-tight" style={{ background: "#fff" }}>
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="eyebrow-note">Gallery</span>
            <h2 className="h-section" style={{ marginTop: "14px" }}>Your camp, your view.</h2>
          </div>
          <div className="accom-gallery-grid">
            {GALLERY_IMAGES.map((img) => (
              <div className="accom-gallery-item reveal" key={img.src}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section
        className="section"
        style={{
          background: "linear-gradient(135deg, rgba(20,17,11,.88), rgba(20,17,11,.92)), url('/background.jpg') center/cover no-repeat fixed",
          minHeight: "auto",
        }}
      >
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
            <span className="eyebrow-note" style={{ color: "var(--gold-bright)" }}>What to expect</span>
            <h2 className="h-section" style={{ color: "#fff", marginTop: "14px" }}>Accommodation Features</h2>
            <p className="lede" style={{ marginTop: "18px", marginInline: "auto" }}>Everything you need for a comfortable stay in the bush — nothing you don't.</p>
          </div>
          <div className="accom-features-grid">
            {FEATURES.map((f) => (
              <div className="accom-feature-card reveal" key={f.title}>
                <div className="accom-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BOOKING FORM ==================== */}
      <section className="section accom-booking-section" id="book">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="eyebrow-note">Book Your Stay</span>
            <h2 className="h-section" style={{ marginTop: "14px" }}>Reserve your spot in the wild.</h2>
            <p className="lede" style={{ marginTop: "18px", marginInline: "auto", color: "var(--ink-on-dark-dim)" }}>Tell us when and for how long — we'll handle the rest.</p>
          </div>
          <div className="accom-booking-form reveal">
            <form onSubmit={handleBookingSubmit}>
              <div className="accom-form-row">
                <div className="accom-form-group">
                  <label htmlFor="checkin">Check-in Date</label>
                  <input ref={checkinRef} type="date" id="checkin" name="checkin" required />
                </div>
                <div className="accom-form-group">
                  <label htmlFor="checkout">Check-out Date</label>
                  <input ref={checkoutRef} type="date" id="checkout" name="checkout" required />
                </div>
              </div>
              <div className="accom-form-row">
                <div className="accom-form-group">
                  <label htmlFor="guests">Number of Guests</label>
                  <select id="guests" name="guests" required defaultValue="">
                    <option value="" disabled>Select guests</option>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                    <option value="6+">6+ Guests</option>
                  </select>
                </div>
                <div className="accom-form-group">
                  <label htmlFor="accom-type">Accommodation Type</label>
                  <select id="accom-type" name="accom-type" required defaultValue="">
                    <option value="" disabled>Select type</option>
                    <option value="tented">Tented Camp — Kruger</option>
                    <option value="lodge">Safari Lodge</option>
                    <option value="group">Group Booking</option>
                  </select>
                </div>
              </div>
              <div className="accom-form-group">
                <label htmlFor="fullname">Full Name</label>
                <input type="text" id="fullname" name="fullname" placeholder="Your full name" required />
              </div>
              <div className="accom-form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="you@example.com" required />
              </div>
              <div className="accom-form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="079 644 5310" required />
              </div>
              <div className="accom-form-group">
                <label htmlFor="requests">Special Requests</label>
                <input type="text" id="requests" name="requests" placeholder="Dietary requirements, accessibility needs, etc." />
              </div>
              <button type="submit" className="accom-booking-submit">Book Now <span style={{ marginLeft: "6px" }}>→</span></button>
            </form>
          </div>
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section
        className="section-tight"
        style={{
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          background: "radial-gradient(ellipse 60% 100% at 90% 0%, rgba(201,162,39,.18), transparent 60%), linear-gradient(120deg, #14110B, #1D1811)",
          color: "#fff",
        }}
      >
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center" }}>
            <span className="eyebrow-note">Questions?</span>
            <h2 className="h-display" style={{ color: "#fff", marginTop: "14px", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>Not sure which stay suits you?</h2>
            <p style={{ color: "var(--ink-on-dark-dim)", marginTop: "16px", maxWidth: "48ch", marginInline: "auto" }}>Call us and we'll talk through the options — no pressure, just honest advice from people who know the camps.</p>
            <div className="hero-actions" style={{ marginTop: "30px" }}>
              <a href="tel:0796445310" className="btn btn-primary">Call 079 644 5310 <span className="btn-arrow">→</span></a>
              <a href="mailto:info@malikantours.co.za" className="btn btn-ghost on-dark">Email us</a>
            </div>
          </div>
        </div>
      </section>

      {/* Page-specific styles moved to globals.css.
      <style jsx>{`
        .accom-hero {
          min-height: 70vh;
        }
        .accom-hero :global(.hero-copy h1) {
          max-width: 16ch;
        }
        .accom-hero :global(.hero-copy .lede) {
          max-width: 52ch;
        }

        .tented-section {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 60px;
          align-items: center;
        }
        .tented-image-wrap {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          aspect-ratio: 4 / 3;
          background: linear-gradient(135deg, #14110b, #1d1811);
          border: 1px solid var(--line);
        }
        .tented-image-wrap :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .tented-image-wrap:hover :global(img) {
          transform: scale(1.05);
        }
        .tented-content :global(.eyebrow-note) {
          margin-bottom: 16px;
          display: block;
        }
        .tented-content :global(h2) {
          font-size: clamp(1.9rem, 3.4vw, 2.6rem);
          margin-bottom: 20px;
        }
        .tented-content :global(p) {
          color: var(--ink-dim);
          max-width: 52ch;
          margin-bottom: 16px;
        }
        .tented-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 24px;
          color: var(--gold);
          font-size: 0.9rem;
          font-weight: 500;
        }
        .tented-meta :global(svg) {
          flex-shrink: 0;
        }

        .accom-gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 30px;
        }
        .accom-gallery-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid var(--line);
        }
        .accom-gallery-item :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .accom-gallery-item:hover :global(img) {
          transform: scale(1.1);
        }
        .accom-gallery-item::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(20, 17, 11, 0.6) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .accom-gallery-item:hover::after {
          opacity: 1;
        }

        .accom-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .accom-feature-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 40px 32px;
          text-align: center;
          transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .accom-feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(20, 17, 11, 0.12);
          border-color: var(--gold);
        }
        .accom-feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--gold-soft);
          border: 1px solid rgba(169, 121, 28, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: var(--gold);
        }
        .accom-feature-icon :global(svg) {
          width: 26px;
          height: 26px;
        }
        .accom-feature-card :global(h3) {
          font-family: var(--serif);
          font-size: 1.25rem;
          margin-bottom: 10px;
          color: var(--ink);
        }
        .accom-feature-card :global(p) {
          color: var(--ink-dim);
          font-size: 0.9rem;
          line-height: 1.7;
        }

        .accom-booking-section {
          background: linear-gradient(135deg, rgba(20, 17, 11, 0.88), rgba(20, 17, 11, 0.92)), url("/background.jpg") center/cover no-repeat fixed;
          color: #fff;
          position: relative;
        }
        .accom-booking-section :global(.eyebrow-note) {
          color: var(--gold-bright);
        }
        .accom-booking-section :global(h2) {
          color: #fff;
        }
        .accom-booking-form {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--line-dark-strong);
          border-radius: 4px;
          padding: clamp(32px, 5vw, 54px);
          backdrop-filter: blur(8px);
        }
        .accom-form-group {
          margin-bottom: 24px;
        }
        .accom-form-group :global(label) {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--ink-on-dark-dim);
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .accom-form-group :global(input),
        .accom-form-group :global(select) {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--line-dark);
          border-radius: 2px;
          color: #fff;
          font-family: var(--sans);
          font-size: 0.95rem;
          transition: border-color 0.3s, background 0.3s;
        }
        .accom-form-group :global(input:focus),
        .accom-form-group :global(select:focus) {
          outline: none;
          border-color: var(--gold);
          background: rgba(255, 255, 255, 0.1);
        }
        .accom-form-group :global(input::placeholder) {
          color: var(--ink-on-dark-dim);
          opacity: 0.6;
        }
        .accom-form-group :global(select option) {
          background: #1d1811;
          color: #fff;
        }
        .accom-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .accom-booking-submit {
          width: 100%;
          padding: 16px;
          background: var(--gold);
          color: #fff;
          border: none;
          border-radius: 2px;
          font-family: var(--sans);
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 0.02em;
        }
        .accom-booking-submit:hover {
          background: #8f671a;
          transform: translateY(-2px);
        }

        @media (max-width: 980px) {
          .accom-hero :global(.hero-inner) {
            padding-top: calc(var(--pad) + 140px);
          }
        }
        @media (max-width: 900px) {
          .tented-section {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .tented-image-wrap {
            max-width: 540px;
          }
          .accom-gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .accom-features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .accom-form-row {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .accom-features-grid {
            grid-template-columns: 1fr;
          }
          .accom-gallery-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
        }
      `}</style> */}
    </>
  );
}