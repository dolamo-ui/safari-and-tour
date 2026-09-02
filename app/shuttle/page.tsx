"use client";

import { useEffect } from "react";
const AIRPORTS = [
  {
    img: "/hero.jpg",
    alt: "OR Tambo International Airport exterior",
    badge: "Johannesburg",
    title: "OR Tambo International Airport",
    desc: "South Africa's busiest hub. We collect from both domestic and international terminals with live flight tracking to adjust for delays.",
    meta: [
      { icon: "pin", text: "To Kruger / Accommodation / Hotel" },
      { icon: "clock", text: "~4.5 hours to Kruger" },
      { icon: "users", text: "1–12 passengers" },
    ],
  },
  {
    img: "/hero3.jpg",
    alt: "Kruger Mpumalanga International Airport",
    badge: "Nelspruit",
    title: "Kruger Mpumalanga International Airport",
    desc: "The closest commercial airport to Kruger. Ideal for travellers connecting from Cape Town or Durban who want to minimise road time.",
    meta: [
      { icon: "pin", text: "To Kruger Gate / Lodges / Hotels" },
      { icon: "clock", text: "~1 hour to Kruger" },
      { icon: "users", text: "1–12 passengers" },
    ],
  },
  {
    img: "/gallery5.jpg",
    alt: "Skukuza Airport in the bush",
    badge: "Inside Kruger",
    title: "Skukuza Airport",
    desc: "The only commercial airport located inside Kruger National Park. Land in the heart of the reserve and step straight into safari mode.",
    meta: [
      { icon: "pin", text: "To Camps / Lodges / Rest Camps" },
      { icon: "clock", text: "Minutes to your camp" },
      { icon: "users", text: "1–8 passengers" },
    ],
  },
];

const AREAS = [
  {
    title: "Hotels",
    text: "City hotels, bush lodges and boutique guesthouses across the region.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3" /><path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3" /><path d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9" /></svg>
    ),
  },
  {
    title: "Lodges",
    text: "Private game lodges and tented camps inside and around Kruger.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20" /><path d="M6 18v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8" /><path d="M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" /></svg>
    ),
  },
  {
    title: "Kruger Gates",
    text: "All major park gates: Phabeni, Numbi, Kruger, Malelane and more.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
  },
  {
    title: "Nearby Areas",
    text: "Hazyview, White River, Graskop, Sabie and the Panorama Route.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16.2 7.8l-2 6.3" /><path d="M9.8 7.8l-2 6.3" /><path d="M12 12v.01" /></svg>
    ),
  },
];

function MetaIcon({ kind }: { kind: string }) {
  if (kind === "pin") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3" /><path d="M12 21v-5.4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V21" /><path d="M8 13.6V11a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10" /></svg>
    );
  }
  if (kind === "clock") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  );
}

export default function ShuttlePage() {
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

    return () => io?.disconnect();
  }, []);

  function handleShuttleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Thank you! We will contact you shortly to confirm your shuttle booking.");
  }

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="hero shuttle-hero" id="top">
        <div className="hero-bg">
          <img src="/hero2.jpg" alt="Airport shuttle vehicle on a scenic African road" />
          <div className="hero-bg-overlay"></div>
        </div>
        <div className="hero-inner">
          <div className="hero-copy reveal">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-current">Shuttle Services</span>
            </nav>
            <h1 className="h-display">Travel with <em>comfort.</em></h1>
            <p className="lede">Reliable airport transfers and shuttle services across Gauteng, Mpumalanga and the Kruger region. Punctual, safe, and driven by guides who know every route.</p>
            <div className="hero-actions">
              <a href="#book-shuttle" className="btn btn-primary">Book a shuttle <span className="btn-arrow">→</span></a>
              <a href="#airports" className="btn btn-ghost on-dark">View routes</a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== INTRO ==================== */}
      <section className="section" style={{ background: "linear-gradient(135deg, rgba(169,121,28,.04), rgba(201,162,39,.02))" }}>
        <div className="wrap shuttle-intro-section">
          <div className="shuttle-intro-visual reveal">
            <img src="/gallery3.jpg" alt="Comfortable shuttle interior with luggage space" />
          </div>
          <div className="shuttle-intro-content reveal">
            <span className="eyebrow-note">Airport Transfers</span>
            <h2 className="h-display">We bridge the gap between the runway and the bush.</h2>
            <p>Whether you're landing at OR Tambo after a long-haul flight or touching down at Skukuza for a direct safari connection, we make sure the last leg of your journey is the easiest one.</p>
            <p>Our fleet is maintained to high standards, drivers are licensed and experienced, and every booking is confirmed with a name board, flight tracking, and a direct contact number. No queues, no confusion — just a smooth handoff from terminal to tent.</p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ==================== AIRPORT CARDS ==================== */}
      <section className="section" id="airports">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: "60px" }}>
            <span className="eyebrow-note">Airport Routes</span>
            <h2 className="h-section" style={{ marginTop: "14px" }}>Pick your airport. We'll handle the rest.</h2>
            <p className="lede" style={{ marginTop: "18px", marginInline: "auto" }}>Direct transfers from South Africa's key gateways to Kruger, lodges, hotels and private residences.</p>
          </div>

          <div className="shuttle-airport-grid">
            {AIRPORTS.map((a) => (
              <article className="shuttle-airport-card reveal" key={a.title}>
                <div className="shuttle-airport-visual">
                  <img src={a.img} alt={a.alt} />
                  <span className="shuttle-airport-badge">{a.badge}</span>
                </div>
                <div className="shuttle-airport-body">
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                  <div className="shuttle-airport-meta">
                    {a.meta.map((m) => (
                      <span key={m.text}>
                        <MetaIcon kind={m.icon} />
                        {m.text}
                      </span>
                    ))}
                  </div>
                  <a href="#book-shuttle" className="shuttle-airport-btn">Book Transfer <span>→</span></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SURROUNDING AREAS ==================== */}
      <section className="section shuttle-areas-section">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: "20px" }}>
            <span className="eyebrow-note" style={{ color: "var(--gold-bright)" }}>Beyond the Airports</span>
            <h2 className="h-section" style={{ color: "#fff", marginTop: "14px" }}>Surrounding Areas We Serve</h2>
            <p className="lede" style={{ marginTop: "18px", marginInline: "auto", color: "var(--ink-on-dark-dim)" }}>Hotels, lodges, private homes and remote camps — if it's on the map, we'll get you there.</p>
          </div>
          <div className="shuttle-areas-grid">
            {AREAS.map((a) => (
              <div className="shuttle-area-item reveal" key={a.title}>
                <div className="shuttle-area-icon">{a.icon}</div>
                <h4>{a.title}</h4>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BOOKING FORM ==================== */}
      <section className="section shuttle-booking-band" id="book-shuttle">
        <div className="wrap shuttle-booking-grid">
          <div className="reveal">
            <span className="eyebrow-note">Book Your Transfer</span>
            <h2 className="h-display" style={{ marginTop: "14px", fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)" }}>Tell us your flight. We'll be there when you land.</h2>
            <p style={{ color: "var(--ink-dim)", marginTop: "18px", maxWidth: "46ch", lineHeight: 1.7 }}>Fill in your details and we'll confirm your pickup time, driver contact and vehicle type within a few hours. No prepayment required for most routes.</p>
            <div style={{ marginTop: "34px", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--gold-soft)", border: "1px solid rgba(169,121,28,.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </span>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: ".95rem" }}>Phone or WhatsApp</p>
                  <p style={{ color: "var(--ink-dim)", fontSize: ".9rem" }}>079 644 5310 — same-day bookings welcome</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--gold-soft)", border: "1px solid rgba(169,121,28,.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                </span>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--ink)", fontSize: ".95rem" }}>Email your itinerary</p>
                  <p style={{ color: "var(--ink-dim)", fontSize: ".9rem" }}>info@malikantours.co.za — we'll reply with a fixed quote</p>
                </div>
              </div>
            </div>
          </div>
          <div className="shuttle-booking-form-wrap reveal">
            <form onSubmit={handleShuttleSubmit}>
              <div className="shuttle-form-row">
                <div className="shuttle-form-group">
                  <label htmlFor="from">Pickup From</label>
                  <select id="from" name="from" required defaultValue="">
                    <option value="" disabled>Select airport</option>
                    <option value="ortambo">OR Tambo International</option>
                    <option value="kmia">Kruger Mpumalanga International</option>
                    <option value="skukuza">Skukuza Airport</option>
                    <option value="other">Other (specify below)</option>
                  </select>
                </div>
                <div className="shuttle-form-group">
                  <label htmlFor="to">Drop-off To</label>
                  <select id="to" name="to" required defaultValue="">
                    <option value="" disabled>Select destination</option>
                    <option value="kruger">Kruger National Park</option>
                    <option value="hotel">Hotel / Lodge</option>
                    <option value="residence">Private Residence</option>
                    <option value="other">Other (specify below)</option>
                  </select>
                </div>
              </div>
              <div className="shuttle-form-row">
                <div className="shuttle-form-group">
                  <label htmlFor="date">Transfer Date</label>
                  <input type="date" id="date" name="date" required />
                </div>
                <div className="shuttle-form-group">
                  <label htmlFor="time">Pickup Time</label>
                  <input type="time" id="time" name="time" required />
                </div>
              </div>
              <div className="shuttle-form-row">
                <div className="shuttle-form-group">
                  <label htmlFor="passengers">Passengers</label>
                  <select id="passengers" name="passengers" required defaultValue="">
                    <option value="" disabled>Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7+">7+</option>
                  </select>
                </div>
                <div className="shuttle-form-group">
                  <label htmlFor="flight">Flight Number</label>
                  <input type="text" id="flight" name="flight" placeholder="e.g. SA 324" />
                </div>
              </div>
              <div className="shuttle-form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="shuttle-form-group">
                <label htmlFor="contact">Phone / WhatsApp</label>
                <input type="tel" id="contact" name="contact" placeholder="079 644 5310" required />
              </div>
              <div className="shuttle-form-group">
                <label htmlFor="notes">Additional Notes</label>
                <input type="text" id="notes" name="notes" placeholder="Extra luggage, child seats, specific hotel name..." />
              </div>
              <button type="submit" className="shuttle-booking-submit">Request Transfer <span style={{ marginLeft: "6px" }}>→</span></button>
            </form>
          </div>
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section
        className="section-tight"
        style={{
          borderTop: "1px solid var(--line-dark)",
          borderBottom: "1px solid var(--line-dark)",
          background: "radial-gradient(ellipse 60% 100% at 90% 0%, rgba(201,162,39,.18), transparent 60%), linear-gradient(120deg, #14110B, #1D1811)",
          color: "#fff",
        }}
      >
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center" }}>
            <span className="eyebrow-note">Need a custom route?</span>
            <h2 className="h-display" style={{ color: "#fff", marginTop: "14px", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>We do inter-provincial and long-distance too.</h2>
            <p style={{ color: "var(--ink-on-dark-dim)", marginTop: "16px", maxWidth: "52ch", marginInline: "auto" }}>Gauteng to Mpumalanga, Limpopo drop-offs, cross-border into Mozambique or Eswatini — if it's on the road, we can quote it.</p>
            <div className="hero-actions" style={{ marginTop: "30px" }}>
              <a href="tel:0796445310" className="btn btn-primary">Call for a quote <span className="btn-arrow">→</span></a>
              <a href="mailto:info@malikantours.co.za" className="btn btn-ghost on-dark">Email your route</a>
            </div>
          </div>
        </div>
      </section>

      {/* Page-specific styles, scoped so they never collide with global classes reused on other pages */}
      {/* Shuttle page styles moved to globals.css.
      <style jsx>{`
        .shuttle-hero {
          min-height: 68vh;
        }
        .shuttle-hero :global(.hero-copy h1) {
          max-width: 18ch;
        }

        .shuttle-intro-section {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
          gap: 70px;
          align-items: center;
        }
        .shuttle-intro-visual {
          position: relative;
          border-radius: 4px;
          overflow: hidden;
          aspect-ratio: 16 / 10;
          background: linear-gradient(135deg, #14110b, #1d1811);
          border: 1px solid var(--line);
        }
        .shuttle-intro-visual :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .shuttle-intro-content :global(.eyebrow-note) {
          margin-bottom: 16px;
          display: block;
        }
        .shuttle-intro-content :global(h2) {
          font-size: clamp(1.9rem, 3.4vw, 2.6rem);
          margin-bottom: 18px;
        }
        .shuttle-intro-content :global(p) {
          color: var(--ink-dim);
          max-width: 52ch;
          margin-bottom: 16px;
        }
        .shuttle-intro-content :global(p:last-of-type) {
          margin-bottom: 0;
        }

        .shuttle-airport-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }
        .shuttle-airport-card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 4px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .shuttle-airport-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(20, 17, 11, 0.14);
          border-color: var(--gold);
        }
        .shuttle-airport-visual {
          position: relative;
          height: 220px;
          background: linear-gradient(135deg, #14110b, #1d1811);
          overflow: hidden;
        }
        .shuttle-airport-visual :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .shuttle-airport-card:hover .shuttle-airport-visual :global(img) {
          transform: scale(1.08);
        }
        .shuttle-airport-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: var(--gold);
          color: #fff;
          padding: 6px 12px;
          border-radius: 2px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .shuttle-airport-body {
          padding: 28px;
        }
        .shuttle-airport-body :global(h3) {
          font-family: var(--serif);
          font-size: 1.3rem;
          margin-bottom: 10px;
          color: var(--ink);
        }
        .shuttle-airport-body :global(p) {
          color: var(--ink-dim);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .shuttle-airport-meta {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }
        .shuttle-airport-meta :global(span) {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--ink-faint);
        }
        .shuttle-airport-meta :global(svg) {
          flex-shrink: 0;
          color: var(--gold);
        }
        .shuttle-airport-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5em;
          background: var(--gold);
          color: #fff;
          padding: 0.8em 1.5em;
          border-radius: 2px;
          font-family: var(--sans);
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s;
          border: 1px solid var(--gold);
          width: 100%;
          justify-content: center;
        }
        .shuttle-airport-btn:hover {
          background: #8f671a;
          transform: translateY(-2px);
        }

        .shuttle-areas-section {
          background: linear-gradient(135deg, rgba(20, 17, 11, 0.88), rgba(20, 17, 11, 0.92)), url("/background.jpg") center/cover no-repeat fixed;
          color: #fff;
          position: relative;
        }
        .shuttle-areas-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 40px;
        }
        .shuttle-area-item {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--line-dark-strong);
          border-radius: 4px;
          padding: 28px 24px;
          text-align: center;
          transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .shuttle-area-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--gold-bright);
          transform: translateY(-4px);
        }
        .shuttle-area-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(201, 162, 39, 0.15);
          border: 1px solid rgba(201, 162, 39, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: var(--gold-bright);
        }
        .shuttle-area-icon :global(svg) {
          width: 22px;
          height: 22px;
        }
        .shuttle-area-item :global(h4) {
          font-family: var(--serif);
          font-size: 1.1rem;
          margin-bottom: 8px;
          color: #fff;
        }
        .shuttle-area-item :global(p) {
          font-size: 0.85rem;
          color: var(--ink-on-dark-dim);
          line-height: 1.6;
        }

        .shuttle-booking-band {
          background: #fff;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .shuttle-booking-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 60px;
          align-items: center;
        }
        .shuttle-booking-form-wrap {
          background: var(--bg-warm);
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: clamp(32px, 5vw, 48px);
        }
        .shuttle-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .shuttle-form-group {
          margin-bottom: 20px;
        }
        .shuttle-form-group :global(label) {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--ink-faint);
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .shuttle-form-group :global(input),
        .shuttle-form-group :global(select) {
          width: 100%;
          padding: 14px 16px;
          background: #fff;
          border: 1px solid var(--line-strong);
          border-radius: 2px;
          color: var(--ink);
          font-family: var(--sans);
          font-size: 0.95rem;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .shuttle-form-group :global(input:focus),
        .shuttle-form-group :global(select:focus) {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 0 3px var(--gold-soft);
        }
        .shuttle-form-group :global(input::placeholder) {
          color: var(--ink-faint);
          opacity: 0.7;
        }
        .shuttle-booking-submit {
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
        .shuttle-booking-submit:hover {
          background: #8f671a;
          transform: translateY(-2px);
        }

        @media (max-width: 980px) {
          .shuttle-intro-section {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .shuttle-intro-visual {
            max-width: 540px;
          }
          .shuttle-airport-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin-inline: auto;
          }
          .shuttle-areas-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .shuttle-booking-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .shuttle-areas-grid {
            grid-template-columns: 1fr;
          }
          .shuttle-form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style> */}
    </>
  );
}