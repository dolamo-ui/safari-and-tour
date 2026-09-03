"use client";

import { useEffect, useState } from "react";

const destinations = [
  {
    name: "Kruger National Park",
    region: "mpumalanga",
    regionLabel: "Mpumalanga",
    image: "/hero.jpg",
    tag: "SAFARI",
    desc: "Big Five territory. Sunrise game drives, bushveld lodges, and fourteen years of guiding knowledge across nearly 20,000 km² of wilderness.",
    link: "/tours",
  },
  {
    name: "Pilanesberg Nature Reserve",
    region: "northwest",
    regionLabel: "North West",
    image: "/hero.jpg",
    tag: "WILDLIFE",
    desc: "A volcanic crater turned wildlife sanctuary just two hours from Johannesburg. Perfect for day trips and weekend escapes with guaranteed sightings.",
    link: "/tours",
  },
  {
    name: "Johannesburg & Soweto",
    region: "gauteng",
    regionLabel: "Gauteng",
    image: "/gallery3.jpg",
    tag: "CULTURE",
    desc: "Vilakazi Street, the Hector Pieterson Memorial, and shared meals with local families. History told by the people who lived it, not just read it.",
    link: "/tours",
  },
  {
    name: "Sun City Resort",
    region: "northwest",
    regionLabel: "North West",
    image: "/hero.jpg",
    tag: "LUXURY",
    desc: "The Valley of Waves, championship golf, and casino entertainment set against the Pilanesberg backdrop. A leisure destination that surprises first-timers.",
    link: "/tours",
  },
  {
    name: "Qwa Qwa & Golden Gate",
    region: "freestate",
    regionLabel: "Free State",
    image: "/hero2.jpg",
    tag: "CULTURAL RETREAT",
    desc: "Basotho Cultural Village, sandstone cliffs, and highland air. A retreat into the mountains where tradition and landscape meet at 1,800 metres.",
    link: "/tours",
  },
  {
    name: "Mpumalanga Panorama Route",
    region: "mpumalanga",
    regionLabel: "Mpumalanga",
    image: "/hero3.jpg",
    tag: "SCENIC",
    desc: "God's Window, Bourke's Luck Potholes, Blyde River Canyon and the Three Rondavels. One of the world's great green canyons, guided at your pace.",
    link: "/tours",
  },
  {
    name: "Cape Winelands",
    region: "westerncape",
    regionLabel: "Western Cape",
    image: "/gallery1.jpg",
    tag: "WINE & DINE",
    desc: "Stellenbosch and Franschhoek — three tastings, a cellar tour and a long lunch among the vines. Return transport from Cape Town included.",
    link: "/tours",
  },
  {
    name: "Drakensberg",
    region: "kwazulu",
    regionLabel: "KwaZulu-Natal",
    image: "/gallery2.jpg",
    tag: "ADVENTURE",
    desc: "The highest mountain range in Southern Africa. Moderate-to-good fitness trails, mountain lodge stays, and two full days above the clouds.",
    link: "/tours",
  },
  {
    name: "Victoria Falls",
    region: "crossborder",
    regionLabel: "Zimbabwe / Zambia",
    image: "/gallery5.jpg",
    tag: "CROSS-BORDER",
    desc: "The Smoke That Thunders. We handle permits, transfers and pacing so you just show up. Optional white-water rafting and sunset cruises available.",
    link: "/tours",
  },
];

const regions = [
  { key: "all", label: "All regions" },
  { key: "gauteng", label: "Gauteng" },
  { key: "mpumalanga", label: "Mpumalanga" },
  { key: "northwest", label: "North West" },
  { key: "freestate", label: "Free State" },
  { key: "westerncape", label: "Western Cape" },
  { key: "kwazulu", label: "KwaZulu-Natal" },
  { key: "crossborder", label: "Cross-border" },
];

export default function DestinationsPage() {
  const [activeRegion, setActiveRegion] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered =
    activeRegion === "all"
      ? destinations
      : destinations.filter((d) => d.region === activeRegion);

  /* ---- Nav glass + scroll-to-top + reveal ---- */
  useEffect(() => {
    const nav = document.getElementById("main-nav");
    const scrollBtn = document.getElementById("scroll-top-btn");

    const onScroll = () => {
      if (nav) {
        if (window.scrollY > 40) nav.classList.add("glass-nav");
        else nav.classList.remove("glass-nav");
      }
      if (scrollBtn) {
        if (window.scrollY > 500) {
          scrollBtn.classList.remove("opacity-0", "pointer-events-none");
          scrollBtn.classList.add("opacity-100");
        } else {
          scrollBtn.classList.add("opacity-0", "pointer-events-none");
          scrollBtn.classList.remove("opacity-100");
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const scrollToTop = () =>
      window.scrollTo({ top: 0, behavior: "smooth" });
    scrollBtn?.addEventListener("click", scrollToTop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      scrollBtn?.removeEventListener("click", scrollToTop);
    };
  }, []);

  /* ---- Reveal animations (re-run when grid changes) ---- */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
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
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [activeRegion]);

  /* ---- Drawer body lock ---- */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <header className="relative z-50">
        {/* Top Info Bar */}
        <div className="bg-gradient-to-r from-[#0F0D0A] to-[#14110B] w-full text-[13px] border-b border-[#C9A227]/20">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
            <div className="flex items-center gap-6 text-[#C9C2B4]">
              <a
                href="mailto:info@malikantours.co.za"
                className="flex items-center gap-2 link-underline hover:text-[#C9A227] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#C9A227]"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="hidden sm:inline">info@malikantours.co.za</span>
              </a>
              <a
                href="tel:0796445310"
                className="flex items-center gap-2 link-underline hover:text-[#C9A227] transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#C9A227]"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>0796445310</span>
              </a>
            </div>
            <div className="flex items-center gap-4 text-[#C9C2B4]">
              <span className="hidden sm:inline tracking-widest text-[11px] opacity-70 uppercase">
                Connect with us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com/SitePad"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="facebook"
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/malikan_tours?igsi=YzMzMDh5M3R4a3V3&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="instagram"
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://x.com/sitepad_editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="twitter"
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/channel/UC-YnxFTZ5-atVFZCGGZ91PQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="youtube"
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div
          id="main-nav"
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-gradient-to-b from-[#14110B] to-[#0F0D0A] border-b border-[#C9A227]/10 backdrop-blur-md"
        >
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-between py-4 gap-6">
            <a
              href="/"
              className="brand shrink-0 no-underline hover:opacity-80 transition-opacity"
              aria-label="Malikan Tours home"
            >
              <span className="brand-mark" aria-hidden="true">
                <img
                  src="/logo.jpg"
                  alt="Malikan Tours logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </span>
              <span className="brand-text">
                <span className="brand-name">Malikan</span>
                <small>Tours</small>
              </span>
            </a>

            <div className="hidden xl:flex items-center gap-10">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <div className="leading-tight">
                  <p className="overline-label text-[11px]">Hours</p>
                  <p className="text-[12px] text-white font-medium">
                    Mon–Fri, 9am–5pm
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3" />
                    <path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3" />
                    <path d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9" />
                  </svg>
                </span>
                <div className="leading-tight">
                  <p className="overline-label text-[11px]">Call us</p>
                  <a
                    href="tel:0796445310"
                    className="text-[12px] text-white font-medium hover:text-[#C9A227] transition-colors duration-300"
                  >
                    +27 796 445 310
                  </a>
                </div>
              </div>
            </div>

            <div className="hidden xl:flex gap-4 items-center">
              <a
                href="/booking"
                className="inline-flex items-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(34,197,94,0.45)]"
              >
                🟢 BOOK NOW
              </a>
              <button
                id="scroll-top-btn"
                className="w-10 h-10 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 opacity-0 pointer-events-none"
                aria-label="Scroll to top"
                title="Back to top"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>

            <button
              id="drawer-btn"
              onClick={() => setDrawerOpen(true)}
              className="xl:hidden w-11 h-11 flex items-center justify-center bg-[#C9A227] text-white rounded-sm"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="hidden xl:block border-t border-[#C9A227]/10 bg-gradient-to-r from-white/[0.02] to-transparent backdrop-blur-md">
            <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-center gap-10 h-12">
              <a
                href="/"
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium"
              >
                HOME
              </a>
              <a
                href="/tours"
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium"
              >
                TOURS &amp; SAFARIS
              </a>
              <a
                href="/destination"
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-[#C9A227] font-medium hover:text-white"
              >
                DESTINATIONS
              </a>
              <a
                href="/about"
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium"
              >
                ABOUT US
              </a>
              <a
                href="/gallery"
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium"
              >
                GALLERY
              </a>
              <a
                href="/#stories"
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium"
              >
                REVIEWS
              </a>
              <a
                href="/#contact"
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium"
              >
                CONTACT US
              </a>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          id="mobile-drawer"
          className={`fixed inset-0 z-[60] xl:hidden transition-opacity duration-300 ${
            drawerOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            id="drawer-overlay"
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <aside
            id="drawer-panel"
            className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-gradient-to-b from-[#14110B] to-[#0F0D0A] text-white flex flex-col transition-transform duration-500 ease-out border-l border-[#C9A227]/20 ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#C9A227]/20">
              <span className="flex items-center gap-2 text-white">
                <span
                  className="brand-mark"
                  style={{
                    width: "28px",
                    height: "28px",
                    minWidth: "28px",
                  }}
                >
                  <img
                    src="/logo.jpg"
                    alt="Malikan Tours logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </span>
                <span className="font-heading text-base text-white">
                  Malikan
                </span>
              </span>
              <button
                id="close-drawer"
                onClick={closeDrawer}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center text-white hover:text-[#C9A227] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col p-5 gap-1 overflow-y-auto">
              {[
                { href: "/", label: "HOME", active: false },
                { href: "/tours", label: "TOURS & SAFARIS", active: false },
                { href: "/destination", label: "DESTINATIONS", active: true },
                { href: "/about", label: "ABOUT US", active: false },
                { href: "/gallery", label: "GALLERY", active: false },
                { href: "/#stories", label: "REVIEWS", active: false },
                { href: "/#contact", label: "CONTACT US", active: false },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeDrawer}
                  className={`nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all rounded ${
                    item.active
                      ? "text-[#C9A227] font-medium hover:bg-[#C9A227]/10"
                      : "text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/booking"
                className="inline-flex items-center justify-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 mt-6 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)]"
              >
                🟢 BOOK NOW
              </a>
            </nav>
            <div className="mt-auto p-5 border-t border-[#C9A227]/20 text-[13px] text-white/70 space-y-3">
              <a
                href="tel:0796445310"
                className="flex items-center gap-2 hover:text-[#C9A227] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#C9A227] flex-shrink-0"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                0796445310
              </a>
              <a
                href="mailto:info@malikantours.co.za"
                className="flex items-center gap-2 hover:text-[#C9A227] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#C9A227] flex-shrink-0"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                info@malikantours.co.za
              </a>
            </div>
          </aside>
        </div>
      </header>

      {/* ==================== PAGE HERO ==================== */}
      <section className="page-hero" id="top">
        <div className="page-hero-bg">
          <img
            src="/hero.jpg"
            alt="South African landscape at golden hour"
          />
          <div className="page-hero-bg-overlay" />
        </div>
        <div className="page-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Destinations</span>
          </nav>
          <h1>Explore South Africa</h1>
          <p className="lede">
            Discover incredible destinations across the country — from
            wildlife-rich savannas to mountain ranges, townships and wine
            valleys.
          </p>
        </div>
      </section>

      {/* ==================== FEATURED DESTINATION ==================== */}
      <section
        className="section"
        style={{ paddingTop: "clamp(48px, 7vw, 80px)" }}
      >
        <div className="wrap">
          <div className="reveal" style={{ marginBottom: "46px" }}>
            <span className="eyebrow-note">Featured destination</span>
            <h2
              className="h-display"
              style={{
                marginTop: "14px",
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              }}
            >
              Where the wild things are.
            </h2>
          </div>

          <div className="featured-dest reveal">
            <div className="featured-media">
              <img
                src="/hero.jpg"
                alt="Kruger National Park safari landscape"
              />
              <span className="featured-tag">Most Popular</span>
            </div>
            <div className="featured-body">
              <span className="eyebrow-note">Kruger National Park</span>
              <h2>The crown jewel of South African safaris.</h2>
              <p>
                Spanning nearly 20,000 square kilometres, Kruger is one of
                Africa&apos;s largest game reserves. Two full days of guided game
                drives put you in the path of the Big Five — lion, leopard,
                rhino, elephant and buffalo — with a guide who reads the bush
                like a map.
              </p>
              <div className="featured-meta">
                <span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Mpumalanga &amp; Limpopo
                </span>
                <span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 15.5 14" />
                  </svg>
                  3 Days &amp; 2 Nights
                </span>
                <span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Max 10 travellers
                </span>
              </div>
              <a href="/tours" className="btn btn-primary">
                Explore Wildlife{" "}
                <span className="btn-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ==================== DESTINATION GRID ==================== */}
      <section className="section">
        <div className="wrap">
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "50px" }}
          >
            <span className="eyebrow-note">Every region, covered</span>
            <h2 className="h-section" style={{ marginTop: "14px" }}>
              Destination Grid
            </h2>
            <p
              className="lede"
              style={{ marginTop: "18px", marginInline: "auto" }}
            >
              Nine regions we know well — each one explored with the same care
              and local knowledge.
            </p>
          </div>

          <div className="region-bar reveal">
            {regions.map((r) => (
              <button
                key={r.key}
                className={`region-pill ${
                  activeRegion === r.key ? "active" : ""
                }`}
                onClick={() => setActiveRegion(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="dest-grid" id="destGrid">
            {filtered.map((d) => (
              <article
                key={d.name}
                className="dest-card reveal is-visible"
                data-region={d.region}
              >
                <div className="dest-media">
                  <img src={d.image} alt={d.name} />
                  <span className="dest-tag">{d.tag}</span>
                </div>
                <div className="dest-body">
                  <h3>{d.name}</h3>
                  <p>{d.desc}</p>
                  <a href={d.link} className="dest-link">
                    Explore tours
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              className="empty-state"
              style={{
                textAlign: "center",
                padding: "80px 20px",
                border: "1px dashed var(--line-strong)",
                borderRadius: "6px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: "1.4rem",
                  color: "var(--ink)",
                  marginBottom: "8px",
                }}
              >
                No destinations in that region yet
              </h3>
              <p
                style={{ color: "var(--ink-faint)", fontSize: ".92rem" }}
              >
                We&apos;re always adding new routes. Call us on 079 644 5310
                and we&apos;ll see what&apos;s possible.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="cta-band section-tight" id="contact">
        <div className="wrap cta-grid">
          <div className="reveal">
            <span className="eyebrow-note">Ready when you are</span>
            <h2
              className="h-display"
              style={{ marginTop: "14px" }}
            >
              Tell us where, we&apos;ll work out how.
            </h2>
            <div
              className="hero-actions"
              style={{
                marginTop: "30px",
                justifyContent: "flex-start",
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <a href="mailto:info@malikantours.co.za" className="btn btn-primary">
                Email us <span className="btn-arrow">→</span>
              </a>
              <a href="tel:0796445310" className="btn btn-ghost on-dark">
                Call 079 644 5310
              </a>
            </div>
          </div>
          <div className="cta-details reveal">
            <a href="tel:0796445310">
              Call us anytime<b>079 644 5310</b>
            </a>
            <a href="mailto:info@malikantours.co.za">
              Email<b>info@malikantours.co.za</b>
            </a>
            <span>
              Office hours<b>Mon – Fri, 9am – 5pm</b>
            </span>
            <span>
              Based in<b>Marloth Park, Kruger National Park</b>
            </span>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer
        className="site-footer"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(20,17,11,.92), rgba(20,17,11,.88)), url('/gallery7.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <a
              href="/"
              className="brand"
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1.25rem",
                letterSpacing: ".01em",
                display: "flex",
                flexDirection: "column",
                lineHeight: "1.1",
                color: "#fff",
              }}
            >
              Malikan&nbsp;Tours
              <small
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: ".62rem",
                  fontWeight: 600,
                  letterSpacing: ".14em",
                  color: "var(--gold-bright)",
                  marginTop: "3px",
                  textTransform: "uppercase",
                }}
              >
                Tours &amp; Projects
              </small>
            </a>
            <p>
              Guided tours, travel planning and cultural experiences across
              South Africa and Africa — built around real budgets and real
              routes.
            </p>
          </div>
          <div className="footer-col">
            <h4>EXPLORE</h4>
            <a href="/#about">About</a>
            <a href="/tours">Tours &amp; safaris</a>
            <a href="/#guide">Your guide</a>
            <a href="/#stories">Stories</a>
          </div>
          <div className="footer-col">
            <h4>SERVICES</h4>
            <a href="/tours">Guided tours</a>
            <a href="/#journey">Travel planning</a>
            <a href="/#journey">Cultural experiences</a>
            <a href="/#journey">Accommodation</a>
          </div>
          <div className="footer-col">
            <h4>CONTACT</h4>
            <span>079 644 5310</span>
            <span>info@malikantours.co.za</span>
            <span>1717 Kingfisher Street, Marloth Park<br />Kruger National Park</span>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© 2026 Malikan Tours And Projects (Pty) Ltd</span>
          <span>Designed for the road ahead.</span>
        </div>
      </footer>
    </>
  );
}