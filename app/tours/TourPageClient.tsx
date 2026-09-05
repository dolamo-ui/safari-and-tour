"use client";

import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "../lib/currency";

/* ==================== Tour data ====================
   Ids and per-person prices match the "Select Tour" dropdown on the
   booking page (see bookingpage.tsx tourNames / tourPrices) so pricing
   stays consistent across the site.

   NOTE ON CURRENCY: most tours below keep their original ZAR base price
   and go through `formatPrice()` (live ZAR → USD conversion), same as
   before. The tours sourced from the Thabo Lietsiso flyers are flagged
   with `currency: "USD"` — their `price` is already a USD number (the
   flyer's ZAR price, doubled) and is rendered directly as `$amount`,
   bypassing the ZAR→USD conversion. */

type Category = "Safari" | "Getaway" | "Retreat" | "Hiking" | "Heritage" | "Day Trip" | "Cross-Border";

type Tour = {
  id: string;
  name: string;
  category: Category;
  location: string;
  duration: string;
  groupSize: string;
  price: number;
  /** "USD" = price is already a raw USD number, shown as-is.
   *  Omitted / "ZAR" = price is a ZAR base value run through formatPrice(). */
  currency?: "ZAR" | "USD";
  tag: string;
  desc: string;
  image: string;
};

const galleryFallbacks = [
  "/gallery.jpg",
  "/gallery1.jpg",
  "/gallery2.jpg",
  "/gallery3.jpg",
  
  "/gallery5.jpg",
  "/gallery7.jpg",
];

const tours: Tour[] = [
  {
    id: "qwaqwa",
    name: "Qwa Qwa Retreat",
    category: "Retreat",
    location: "Golden Gate, Free State",
    duration: "3 days, 2 nights",
    groupSize: "2–8 guests",
    price: 689,
    currency: "USD",
    tag: "Lefatshe la Basotho",
    desc: "A half-day tour of a Basotho cultural village, Golden Gate Highlands game park, abseiling and canoeing, with stays at Kaira Lodge. Some activities are seasonal.",
    image: "https://i.imgur.com/M8aTgcw.jpeg",
  },
  {
    id: "mpumalanga",
    name: "Mpumalanga Retreat",
    category: "Retreat",
    location: "Graskop, Mpumalanga",
    duration: "3 days, 2 nights",
    groupSize: "2–8 guests",
    price: 689,
    currency: "USD",
    tag: "Place of the rising sun",
    desc: "A half-day tour of Kruger National Park, three rondovels, God's Window and the Graskop Big Swing, staying at accommodation on or near Graskop along the Panoramic Route.",
    image: "https://i.imgur.com/dFA2NvU.jpeg",
  },
  {
    id: "kruger",
    name: "Kruger National Park Safari",
    category: "Safari",
    location: "Kruger National Park",
    duration: "3 days, 2 nights",
    groupSize: "2–8 guests",
    price: 715,
    currency: "USD",
    tag: "Wildlife safari",
    desc: "Guided game drives through Kruger National Park with flexible pickup, expert wildlife knowledge and time to experience the bush at its own pace.",
    image: "https://i.imgur.com/RZwgEEu.jpeg",
  },
  {
    id: "pilanesberg",
    name: "Pilanesberg Nature Reserve",
    category: "Safari",
    location: "Pilanesberg, North West",
    duration: "2 days, 1 night",
    groupSize: "2–10 guests",
    price: 501,
    currency: "USD",
    tag: "Big Five weekend",
    desc: "A relaxed Pilanesberg safari with an optional Sun City extension, combining open-vehicle game drives with an easy weekend escape from Johannesburg.",
    image: "https://i.imgur.com/t3cwwyS.jpeg",
  },
  {
    id: "durban",
    name: "Durban — Kingdom of the Zulu",
    category: "Getaway",
    location: "Durban, KwaZulu-Natal",
    duration: "3 days, 2 nights",
    groupSize: "2–10 guests",
    price: 939.32,
    currency: "USD",
    tag: "Style and flava",
    desc: "Moses Mabhida Stadium, beach time on the Golden Mile and a night out at Eyadini Lounge and Max's Chisa Nyama, with accommodation at Garden Court South Beach and transport from Vereeniging.",
    image: "https://i.imgur.com/bxSyfjp.jpeg",
  },
  {
    id: "soweto",
    name: "Johannesburg & Soweto",
    category: "Heritage",
    location: "Johannesburg and Soweto",
    duration: "Full day",
    groupSize: "2–12 guests",
    price: 105,
    currency: "USD",
    tag: "History and culture",
    desc: "A guided day through Johannesburg and Soweto, connecting the city’s history, neighbourhoods, food and living heritage with a local perspective.",
    image: "https://i.imgur.com/et8pwrl.jpeg",
  },
  {
    id: "winelands",
    name: "Cape Winelands",
    category: "Getaway",
    location: "Stellenbosch and Franschhoek",
    duration: "2 days, 1 night",
    groupSize: "2–8 guests",
    price: 198,
    currency: "USD",
    tag: "Food and wine",
    desc: "A considered Cape Winelands escape through vineyard country, with tastings, beautiful towns and time to enjoy the landscape without rushing the day.",
    image: "https://i.imgur.com/LArpTnG.jpeg",
  },
  {
    id: "drakensberg",
    name: "Drakensberg Hiking Escape",
    category: "Hiking",
    location: "Drakensberg, KwaZulu-Natal",
    duration: "3 days, 2 nights",
    groupSize: "2–8 guests",
    price: 572,
    currency: "USD",
    tag: "Mountain country",
    desc: "A guided Drakensberg hiking escape shaped around your pace, with mountain scenery, clear expectations on distance and time to settle into the highlands.",
    image: "https://i.imgur.com/3QIIRmw.jpeg",
  },
  {
    id: "vicfalls",
    name: "Victoria Falls Crossing",
    category: "Cross-Border",
    location: "Victoria Falls, Zimbabwe",
    duration: "4 days, 3 nights",
    groupSize: "2–10 guests",
    price: 1078,
    currency: "USD",
    tag: "Cross-border journey",
    desc: "A carefully planned crossing to Victoria Falls with transfers, permits and a comfortable pace through one of Southern Africa’s unforgettable landmarks.",
    image: "https://i.imgur.com/rLkAZSC.jpeg ",
  },
];

const categoryLabels: { label: string; value: Category | "All" }[] = [
  { label: "All tours", value: "All" },
  { label: "Safaris", value: "Safari" },
  { label: "Getaways", value: "Getaway" },
  { label: "Retreats", value: "Retreat" },
  { label: "Hiking", value: "Hiking" },
  { label: "Heritage", value: "Heritage" },
  { label: "Cross-border", value: "Cross-Border" },
];

export default function ToursPage() {
  const { formatPrice } = useCurrency();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [sort, setSort] = useState<"featured" | "price-low" | "price-high">("featured");

  const filteredTours = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = tours.filter((tour) => {
      const matchesQuery =
        !q ||
        tour.name.toLowerCase().includes(q) ||
        tour.location.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" ||
        tour.category.trim().toLowerCase() === activeCategory.trim().toLowerCase();
      return matchesQuery && matchesCategory;
    });

    if (sort === "price-low") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [query, activeCategory, sort]);

  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }, [filteredTours]);

  // Renders a tour's price: USD-flagged tours show the raw number as $amount,
  // everything else keeps going through the live ZAR → USD formatPrice().
  const renderPrice = (tour: Tour) =>
    tour.currency === "USD" ? `$${tour.price.toLocaleString("en-US")}` : formatPrice(tour.price);

  return (
    <>
      {/* ==================== PAGE HERO ==================== */}
      <section className="page-hero">
        <div className="page-hero-bg">
          <img src="/hero3.jpg" alt="Open savanna road at golden hour" />
          <div className="page-hero-bg-overlay" />
        </div>
        <div className="page-hero-inner">
          <span className="breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Tours &amp; Safaris</span>
          </span>
          <h1>Tours &amp; safaris across Southern Africa</h1>
          <p className="lede">
            Seven routes covering getaways, retreats, day trips and cross-border travel — each one built
            around real budgets and real distances, not a brochure itinerary.
          </p>
        </div>
      </section>

      {/* ==================== FINDER ==================== */}
      <div className="finder wrap">
        <div className="finder-card reveal">
          <div className="finder-row">
            <div className="finder-field">
              <label htmlFor="tourSearch">Destination or tour</label>
              <div className="input-shell">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  id="tourSearch"
                  type="text"
                  placeholder="Try “Kruger” or “Winelands”"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="finder-field">
              <label htmlFor="tourCategory">Category</label>
              <div className="input-shell">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
                <select
                  id="tourCategory"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value as Category | "All")}
                  suppressHydrationWarning
                >
                  {categoryLabels.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="finder-field">
              <label htmlFor="tourSort">Sort by</label>
              <div className="input-shell">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7h13M3 12h9M3 17h5" />
                  <path d="m17 4 3 3-3 3M20 7H8" />
                </svg>
                <select
                  id="tourSort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  suppressHydrationWarning
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </div>
            </div>

            <div className="finder-submit">
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => document.getElementById("tour-results")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                Search <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== RESULTS ==================== */}
      <section className="section" id="tour-results">
        <div className="wrap">
          <div className="cat-bar reveal" style={{ marginBottom: 40 }}>
            {categoryLabels.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`cat-pill ${activeCategory === cat.value ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="result-meta reveal" style={{ marginBottom: 28 }}>
            <p>
              Showing {filteredTours.length} of {tours.length} tours
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
              {query ? ` matching “${query}”` : ""}
            </p>
          </div>

          {filteredTours.length > 0 ? (
            <div className="tour-grid">
              {filteredTours.map((tour) => (
                <article className="tour-card reveal" key={tour.id}>
                  <div className="tour-media">
                    <img src={tour.image} alt={tour.name} />
                    <span className="tour-tag">{tour.tag}</span>
                  </div>
                  <div className="tour-body">
                    <h3>{tour.name}</h3>
                    <p className="desc">{tour.desc}</p>
                    <div className="tour-facts">
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.9 17.1a9 9 0 1 1 0-10.2" />
                          <path d="M12 2v20M2 12h6m8 0h6" />
                        </svg>
                        {tour.location}
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {tour.duration}
                      </span>
                      <span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {tour.groupSize}
                      </span>
                    </div>
                    <div className="tour-price-row">
                      <div className="tour-price">
                        <span className="amt">{renderPrice(tour)}</span>
                        <span className="unit">per person</span>
                      </div>
                      <a href={`/booking?tour=${tour.id}`} className="tour-view">
                        Book now <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state show">
              <h3>No tours match that search</h3>
              <p>Try a different destination, or clear the category filter above.</p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== CTA BAND ==================== */}
      <section className="cta-band section-tight" id="contact">
        <div className="wrap cta-grid">
          <div className="reveal">
            <span className="eyebrow-note">Not seeing the route you want?</span>
            <h2 className="h-display" style={{ marginTop: 14 }}>
              We can build a tour around your dates and pace.
            </h2>
            <div className="hero-actions" style={{ marginTop: 30, justifyContent: "flex-start" }}>
              <a href="mailto:info@malikantours.co.za" className="btn btn-primary">
                Email us <span className="btn-arrow">→</span>
              </a>
              <a href="tel:0632344970" className="btn btn-ghost on-dark">
                Call 063 234 4970
              </a>
            </div>
          </div>
          <div className="cta-details reveal">
            <a href="tel:0632344970">
              Call us anytime<b>063 234 4970</b>
            </a>
            <a href="mailto:info@malikantours.co.za">
              Email<b>info@malikantours.co.za</b>
            </a>
            <span>
              Office hours<b>Mon – Fri, 7am – 5pm</b>
            </span>
            <span>
              Based in<b>Marloth Park, Kruger National Park</b>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}