"use client";

import { useEffect, useRef, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

/* ========================================================================
   Malikan Tours — Shuttle / Book Your Transfer
   Mirrors the structure of the Accommodation booking page and writes
   to its own Firestore collection: "shuttleBookings".
   ======================================================================== */

const ROUTE_PRICES: Record<string, number> = {
  kmia: 850,
  ortambo: 2200,
  local: 350,
  custom: 0,
};

const ROUTE_LABELS: Record<string, string> = {
  kmia: "Kruger Mpumalanga Airport (KMIA) Transfer",
  ortambo: "OR Tambo International Transfer",
  local: "Local Transfer — Marloth Park & Kruger Gate",
  custom: "Custom Route",
};

const FEATURES = [
  {
    title: "Door-to-Door",
    text: "We collect and drop off exactly where you need — accommodation, airport terminal, or gate.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" /><circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /></svg>
    ),
  },
  {
    title: "Flight Tracking",
    text: "We monitor arrival times so delays never mean a missed pickup.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1 .1-1.3.5l-.7.9c-.3.4-.2 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.4 5.9c.3.5.9.6 1.3.3l.9-.7c.4-.3.5-.8.4-1.3Z" /></svg>
    ),
  },
  {
    title: "Comfortable Vehicles",
    text: "Air-conditioned shuttles with room for luggage, gear, and the whole group.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2v-4.586a1 1 0 0 0-.293-.707l-4.414-4.414A1 1 0 0 0 15.586 7H14" /><path d="M14 17H9" /><path d="M14 7H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
    ),
  },
  {
    title: "Fixed Pricing",
    text: "No surge, no surprises. Your quote at booking is the price you pay.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
    ),
  },
];

export default function ShuttlePage() {
  const dateRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [refNum, setRefNum] = useState("0000");
  const [route, setRoute] = useState("");
  const [summaryDate, setSummaryDate] = useState("—");
  const [summaryTime, setSummaryTime] = useState("—");

  useEffect(() => {
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

    const today = new Date().toISOString().split("T")[0];
    dateRef.current?.setAttribute("min", today);

    return () => io?.disconnect();
  }, []);

  const handleShuttleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const transferDate = formData.get("transferdate") as string;
    const transferTime = formData.get("transfertime") as string;
    const passengers = parseInt(formData.get("passengers") as string) || 1;
    const routeType = formData.get("route") as string;
    const pickupLocation = formData.get("pickup") as string;
    const dropoffLocation = formData.get("dropoff") as string;
    const fullName = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const requests = formData.get("requests") as string;

    if (!transferDate || !transferTime || !routeType || !pickupLocation || !dropoffLocation || !fullName || !email || !phone) {
      setSubmitError("Please fill in all required fields.");
      return;
    }
    if (!email.includes("@")) {
      setSubmitError("Please enter a valid email address containing an @ sign.");
      return;
    }

    const newRef = String(Math.floor(1000 + Math.random() * 9000));
    const pricePerPerson = ROUTE_PRICES[routeType] || 0;
    const estimatedTotal = pricePerPerson * passengers;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "shuttleBookings"), {
        reference: `ST-${newRef}`,
        route: routeType,
        routeLabel: ROUTE_LABELS[routeType] || routeType,
        transferDate,
        transferTime,
        passengers,
        pickupLocation,
        dropoffLocation,
        pricePerPerson,
        estimatedTotal,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        specialRequests: requests,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setRefNum(newRef);
      setSummaryDate(
        new Date(transferDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
      );
      setSummaryTime(transferTime);
      setSubmitted(true);
      form.reset();
      setRoute("");
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong saving your booking. Please try again or call 079 644 5310.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="hero accom-hero" id="top">
        <div className="hero-bg">
          <img src="/hero.jpg" alt="Shuttle vehicle ready for an airport transfer" />
          <div className="hero-bg-overlay"></div>
        </div>
        <div className="hero-inner">
          <div className="hero-copy reveal">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-current">Shuttle Transfers</span>
            </nav>
            <h1 className="h-display">Book your <em>transfer.</em></h1>
            <p className="lede">Reliable shuttle transfers between airports, accommodation, and the Kruger gates. Fixed pricing, flight tracking, and a driver who's always on time.</p>
            <div className="hero-actions">
              <a href="#book" className="btn btn-primary">Book your transfer <span className="btn-arrow">→</span></a>
              <a href="#routes" className="btn btn-ghost on-dark">View routes</a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ROUTES INTRO ==================== */}
      <section className="section" id="routes" style={{ background: "linear-gradient(135deg, rgba(169,121,28,.04), rgba(201,162,39,.02))" }}>
        <div className="wrap tented-section">
          <div className="tented-image-wrap reveal">
            <img src="https://i.imgur.com/CDqJIoL.jpeg" alt="Shuttle route through Kruger National Park" />
          </div>
          <div className="tented-content reveal">
            <span className="eyebrow-note">Shuttle Transfers</span>
            <h2 className="h-display">Skip the car hire hassle.</h2>
            <p>Whether you're flying into KMIA or OR Tambo, or just need a lift between camps and the gate, our shuttle service gets you there safely — no navigating unfamiliar roads after a long flight.</p>
            <p>Every route below is a fixed, per-person price so you know exactly what you'll pay before you book.</p>
            <div className="tented-meta">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              Serving Kruger National Park &amp; Mpumalanga
            </div>
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
            <h2 className="h-section" style={{ color: "#fff", marginTop: "14px" }}>Transfer Features</h2>
            <p className="lede" style={{ marginTop: "18px", marginInline: "auto" }}>Everything you need for an easy, on-time transfer.</p>
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
            <span className="eyebrow-note">Book Your Transfer</span>
            <h2 className="h-section" style={{ marginTop: "14px" }}>Reserve your shuttle.</h2>
            <p className="lede" style={{ marginTop: "18px", marginInline: "auto", color: "var(--ink-on-dark-dim)" }}>Tell us your route and pickup details — we'll confirm within 24 hours.</p>
          </div>

          {!submitted ? (
            <div className="accom-booking-form reveal">
              <form onSubmit={handleShuttleSubmit}>
                <p style={{ marginBottom: "24px", color: "var(--ink-on-dark-dim)", fontSize: ".88rem" }}><strong>Fields marked with * are required</strong></p>
                <div className="accom-form-group">
                  <label htmlFor="route">Route *</label>
                  <select id="route" name="route" required value={route} onChange={(e) => setRoute(e.target.value)}>
                    <option value="" disabled>Select a route</option>
                    <option value="kmia">Kruger Mpumalanga Airport (KMIA) — R 850 pp</option>
                    <option value="ortambo">OR Tambo International — R 2 200 pp</option>
                    <option value="local">Local Transfer (Marloth Park &amp; Kruger Gate) — R 350 pp</option>
                    <option value="custom">Custom Route — quote on request</option>
                  </select>
                </div>

                <div className="accom-form-row">
                  <div className="accom-form-group">
                    <label htmlFor="pickup">Pickup Location *</label>
                    <input type="text" id="pickup" name="pickup" placeholder="e.g. KMIA Arrivals, or your lodge name" required />
                  </div>
                  <div className="accom-form-group">
                    <label htmlFor="dropoff">Drop-off Location *</label>
                    <input type="text" id="dropoff" name="dropoff" placeholder="e.g. Marloth Park, Kruger Gate" required />
                  </div>
                </div>

                <div className="accom-form-row">
                  <div className="accom-form-group">
                    <label htmlFor="transferdate">Transfer Date *</label>
                    <input ref={dateRef} type="date" id="transferdate" name="transferdate" required />
                  </div>
                  <div className="accom-form-group">
                    <label htmlFor="transfertime">Transfer Time *</label>
                    <input type="time" id="transfertime" name="transfertime" required />
                  </div>
                </div>

                <div className="accom-form-group">
                  <label htmlFor="passengers">Number of Passengers *</label>
                  <select id="passengers" name="passengers" required defaultValue="">
                    <option value="" disabled>Select passengers</option>
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4 Passengers</option>
                    <option value="5">5 Passengers</option>
                    <option value="6">6 Passengers</option>
                    <option value="7">7 Passengers</option>
                    <option value="8">8 Passengers</option>
                  </select>
                </div>

                <div className="accom-form-group">
                  <label htmlFor="fullname">Full Name *</label>
                  <input type="text" id="fullname" name="fullname" placeholder="Your full name" required />
                </div>
                <div className="accom-form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" placeholder="you@example.com" required />
                </div>
                <div className="accom-form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input type="tel" id="phone" name="phone" inputMode="numeric" pattern="[0-9]*" placeholder="0796445310" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ""); }} required />
                </div>
                <div className="accom-form-group">
                  <label htmlFor="requests">Special Requests</label>
                  <input type="text" id="requests" name="requests" placeholder="Flight number, extra luggage, child seat, etc." />
                </div>

                {submitError && (
                  <p style={{ color: "#fca5a5", fontSize: ".9rem", marginBottom: "16px" }} role="alert">{submitError}</p>
                )}

                <button type="submit" className="accom-booking-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : <>Book Now <span style={{ marginLeft: "6px" }}>→</span></>}
                </button>
              </form>
            </div>
          ) : (
            <div className="accom-booking-form reveal" style={{ textAlign: "center" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(169,121,28,.10)", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <h3 className="h-display" style={{ color: "#fff", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>Request received</h3>
              <p style={{ color: "var(--ink-on-dark-dim)", marginTop: "12px", marginBottom: "24px" }}>
                Thank you. We'll contact you within 24 hours to confirm your transfer.
              </p>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--line-dark)", borderRadius: "4px", padding: "24px", maxWidth: "380px", margin: "0 auto 24px", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--line-dark)", fontSize: ".9rem" }}>
                  <span style={{ color: "var(--ink-on-dark-dim)" }}>Reference</span>
                  <span style={{ color: "#fff", fontWeight: 500 }}>ST-{refNum}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--line-dark)", fontSize: ".9rem" }}>
                  <span style={{ color: "var(--ink-on-dark-dim)" }}>Date</span>
                  <span style={{ color: "#fff", fontWeight: 500 }}>{summaryDate}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: ".9rem" }}>
                  <span style={{ color: "var(--ink-on-dark-dim)" }}>Time</span>
                  <span style={{ color: "#fff", fontWeight: 500 }}>{summaryTime}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                <a href="tel:0796445310" className="btn btn-primary">Call us now <span className="btn-arrow">→</span></a>
                <button onClick={() => setSubmitted(false)} className="btn btn-ghost on-dark">Book another transfer</button>
              </div>
            </div>
          )}
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
            <h2 className="h-display" style={{ color: "#fff", marginTop: "14px", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>Not sure which route you need?</h2>
            <p style={{ color: "var(--ink-on-dark-dim)", marginTop: "16px", maxWidth: "48ch", marginInline: "auto" }}>Call us and we'll confirm the best pickup point and timing for your flight or stay.</p>
            <div className="hero-actions" style={{ marginTop: "30px" }}>
              <a href="tel:0796445310" className="btn btn-primary">Call 079 644 5310 <span className="btn-arrow">→</span></a>
              <a href="mailto:info@malikantours.co.za" className="btn btn-ghost on-dark">Email us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}