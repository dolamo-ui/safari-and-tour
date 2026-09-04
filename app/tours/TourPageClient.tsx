"use client";

import { useState, useEffect, useCallback } from "react";
import { useCurrency } from "../lib/currency";

const galleryImages = [
  { src: "https://i.imgur.com/RZwgEEu.jpeg", alt: "Kruger sunrise over the savanna" },
  { src: "/gallery.jpg", alt: "Elephant herd at a waterhole" },
  { src: "/gallery1.jpg", alt: "Lion resting in golden grass" },
  { src: "/gallery2.jpg", alt: "Bushveld lodge at dusk" },
  { src: "/gallery3.jpg", alt: "Leopard in a tree" },
  { src: "/gallery4.jpg", alt: "Sundowner drinks at sunset" },
  { src: "/gallery5.jpg", alt: "Guide tracking wildlife on foot" },
];

const itinerary = [
  {
    day: "Day 1",
    title: "Arrival and bushveld briefing",
    text: "Meet your guide in Johannesburg or Pretoria, travel to the park and settle in at the lodge. After a late-afternoon briefing, enjoy a sunset drive and your first game-viewing stop.",
  },
  {
    day: "Day 2",
    title: "Full-day safari circuit",
    text: "Early departure for a full day in the bush. Focused time in high-density wildlife zones, a midday break at camp and a golden-hour drive to finish the day with predators and grazing herds.",
  },
  {
    day: "Day 3",
    title: "Final game drive and return",
    text: "A relaxed morning drive before brunch, followed by a final stretch across the reserve and a guided transfer back to Gauteng with stories and photos from the trip.",
  },
];

export default function TourPageClient() {
  const { formatPrice } = useCurrency();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0])); // Day 1 open by default
  const [scrollTopVisible, setScrollTopVisible] = useState(false);

  const toggleDay = (index: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % galleryImages.length);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrollTopVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (drawerOpen) setDrawerOpen(false);
        if (lightboxOpen) closeLightbox();
      }
      if (lightboxOpen) {
        if (e.key === "ArrowLeft") prevImage();
        if (e.key === "ArrowRight") nextImage();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, lightboxOpen, closeLightbox, prevImage, nextImage]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [drawerOpen]);

  useEffect(() => {
    // Reveal on scroll
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
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }, []);

  useEffect(() => {
    // Nav glass effect
    const nav = document.getElementById("main-nav");
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 40) {
        nav.classList.add("glass-nav");
      } else {
        nav.classList.remove("glass-nav");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Set min date on date input
    const dateInput = document.getElementById("bookDate") as HTMLInputElement | null;
    if (dateInput) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", today);
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                <span>063 234 4970</span>
              </a>
            </div>
            <div className="flex items-center gap-4 text-[#C9C2B4]">
              <span className="hidden sm:inline tracking-widest text-[11px] opacity-70 uppercase">
                Connect with us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/share/1F1XGhWvnJ/?mibextid=wwXIfr"
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
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
                  <p className="text-[12px] text-white font-medium">Mon–Fri, 9am–5pm</p>
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
                    +27 63 234 4970
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden xl:flex gap-4 items-center">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(34,197,94,0.45)]"
              >
                🔴 BOOK NOW
              </a>
              <button
                onClick={scrollToTop}
                className={`w-10 h-10 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 ${
                  scrollTopVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
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
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-[#C9A227] font-medium hover:text-white"
              >
                TOURS &amp; SAFARIS
              </a>
              <a
                href="/destination"
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium"
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
            drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-gradient-to-b from-[#14110B] to-[#0F0D0A] text-white flex flex-col transition-transform duration-500 ease-out border-l border-[#C9A227]/20 ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#C9A227]/20">
              <span className="flex items-center gap-2 text-white">
                <span className="brand-mark" style={{ width: 28, height: 28, minWidth: 28 }}>
                  <img
                    src="/logo.jpg"
                    alt="Malikan Tours logo"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </span>
                <span className="font-heading text-base text-white">Malikan</span>
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
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
              <a
                href="/"
                onClick={() => setDrawerOpen(false)}
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                HOME
              </a>
              <a
                href="/tours"
                onClick={() => setDrawerOpen(false)}
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-[#C9A227] font-medium hover:bg-[#C9A227]/10 rounded"
              >
                TOURS &amp; SAFARIS
              </a>
              <a
                href="/destination"
                onClick={() => setDrawerOpen(false)}
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                DESTINATIONS
              </a>
              <a
                href="/about"
                onClick={() => setDrawerOpen(false)}
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                ABOUT US
              </a>
              <a
                href="/gallery"
                onClick={() => setDrawerOpen(false)}
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                GALLERY
              </a>
              <a
                href="/#stories"
                onClick={() => setDrawerOpen(false)}
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                REVIEWS
              </a>
              <a
                href="/#contact"
                onClick={() => setDrawerOpen(false)}
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                CONTACT US
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 mt-6 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)]"
              >
                🔴 BOOK NOW
              </a>
            </nav>
            <div className="mt-auto p-5 border-t border-[#C9A227]/20 text-[13px] text-white/70 space-y-3">
              <a
                href="tel:0632344970"
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
                0632344970
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

      {/* ==================== TOUR HERO ==================== */}
      <section className="tour-hero" id="top">
        <div className="tour-hero-bg">
          <img src="/hero.jpg" alt="Kruger National Park safari landscape at sunrise" />
          <div className="tour-hero-overlay"></div>
        </div>
        <div className="tour-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-separator">›</span>
            <a href="/tours">Tours &amp; Safaris</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Kruger National Park Safari</span>
          </nav>
          <h1>Kruger National Park Safari</h1>
          <div className="star-row" aria-label="5 star rating">
            {[...Array(5)].map((_, i) => (
              <svg key={i} viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <div className="tour-hero-meta">
            <span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Mpumalanga, South Africa
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <polyline points="12 7 12 12 15.5 14" />
              </svg>
              3 Days &amp; 2 Nights
            </span>
            <span>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Max 10 people
            </span>
          </div>
        </div>
      </section>

      {/* ==================== DESCRIPTION + BOOKING ==================== */}
      <section className="section" style={{ paddingTop: "clamp(48px, 7vw, 80px)" }}>
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1.25fr) minmax(0,.75fr)",
              gap: "60px",
              alignItems: "start",
            }}
          >
            <div className="reveal">
              <span className="eyebrow-note">About this tour</span>
              <h2
                className="h-display"
                style={{ marginTop: 16, fontSize: "clamp(1.8rem, 3vw, 2.6rem)" }}
              >
                Big Five game drives, sunrise to sunset.
              </h2>
              <div
                style={{
                  marginTop: 28,
                  color: "var(--ink-dim)",
                  lineHeight: 1.85,
                  fontSize: "1.02rem",
                }}
              >
                <p>
                  Two full days of guided game drives through Kruger&apos;s central region,
                  tracking lion, leopard, elephant, rhino and buffalo with a guide who has
                  spent over a decade reading the bush. You&apos;ll stay at a comfortable
                  bushveld lodge just outside the park gates, with all meals included and
                  transfers from Johannesburg or Pretoria arranged.
                </p>
                <p style={{ marginTop: 18 }}>
                  This isn&apos;t a rushed day trip. Mornings start before dawn with coffee
                  around the fire, afternoons drift into golden-hour sightings, and evenings
                  end with dinner under the stars. The pace is set by the wildlife — and by
                  fourteen years of knowing where to be, and when.
                </p>
              </div>

              <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  {
                    icon: (
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    ),
                    icon2: <circle cx="12" cy="10" r="3" />,
                    title: "Location",
                    text: "Kruger National Park, Mpumalanga — pick-up across Gauteng",
                  },
                  {
                    icon: <circle cx="12" cy="12" r="9" />,
                    icon2: <polyline points="12 7 12 12 15.5 14" />,
                    title: "Duration",
                    text: "3 Days & 2 Nights — departure every Friday",
                  },
                  {
                    icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />,
                    icon2: (
                      <>
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </>
                    ),
                    title: "Group Size",
                    text: "Maximum 10 travellers — small group, personal attention",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 22px",
                      background: "var(--bg-warm)",
                      border: "1px solid var(--line)",
                      borderRadius: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "rgba(169,121,28,.10)",
                        border: "1px solid rgba(169,121,28,.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--gold)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {item.icon}
                        {item.icon2}
                      </svg>
                    </span>
                    <div>
                      <p
                        style={{
                          fontWeight: 600,
                          color: "var(--ink)",
                          fontSize: ".95rem",
                          margin: 0,
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        style={{
                          color: "var(--ink-dim)",
                          fontSize: ".88rem",
                          margin: "2px 0 0",
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="reveal">
              <div className="booking-box">
                <p className="price-label">From</p>
                <p className="price-amt">{formatPrice(5999)}</p>
                <p className="price-note">per person, all-inclusive</p>
                <div className="booking-divider"></div>
                <div className="booking-field">
                  <label htmlFor="bookDate">Select date</label>
                  <input type="date" id="bookDate" />
                </div>
                <div className="booking-field">
                  <label htmlFor="bookGuests">Travellers</label>
                  <select id="bookGuests">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5+ Guests — contact us</option>
                  </select>
                </div>
                <a
                  href="/#contact"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "1em" }}
                >
                  Book Now <span className="btn-arrow">→</span>
                </a>
                <ul className="booking-features">
                  {[
                    "Free cancellation up to 30 days",
                    "Instant confirmation",
                    "Secure payment",
                    "No hidden fees",
                  ].map((feat, i) => (
                    <li key={i}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ==================== HIGHLIGHTS ==================== */}
      <section className="section-tight">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 50 }}>
            <span className="eyebrow-note">What makes this trip</span>
            <h2 className="h-section" style={{ marginTop: 14 }}>
              Tour Highlights
            </h2>
          </div>
          <div className="highlight-grid reveal">
            {[
              {
                svg: (
                  <>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                    <path d="M12 6v6l4 2" />
                  </>
                ),
                title: "Wildlife",
                text: "Track the Big Five across Kruger's central region with an experienced field guide.",
              },
              {
                svg: (
                  <>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </>
                ),
                title: "Lodge Stay",
                text: "Two nights in a comfortable bushveld lodge just outside the park gates.",
              },
              {
                svg: (
                  <>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </>
                ),
                title: "Photography",
                text: "Golden-hour positioning and patient guiding for the best light and angles.",
              },
              {
                svg: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
                title: "All Meals",
                text: "Breakfast, lunch and dinner included — from fireside coffee to starlit dinners.",
              },
              {
                svg: (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </>
                ),
                title: "Sunrise Drives",
                text: "Early morning departures to catch predators at their most active.",
              },
              {
                svg: (
                  <>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </>
                ),
                title: "Small Groups",
                text: "Maximum 10 travellers per departure — personal, unhurried, immersive.",
              },
            ].map((h, i) => (
              <div className="highlight-item" key={i}>
                <div className="icon-wrap">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {h.svg}
                  </svg>
                </div>
                <h4>{h.title}</h4>
                <p>{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="section-tight" style={{ background: "var(--bg-warm)" }}>
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 36 }}>
            <span className="eyebrow-note">Daily rhythm</span>
            <h2 className="h-section" style={{ marginTop: 14 }}>Itinerary</h2>
          </div>

          <div className="space-y-4 reveal">
            {itinerary.map((item) => {
              const isOpen = openDays.has(Number(item.day.replace(/\D/g, "")) - 1);
              return (
                <div
                  key={item.day}
                  className="rounded-[4px] border border-[var(--line)] bg-white overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleDay(Number(item.day.replace(/\D/g, "")) - 1)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[rgba(169,121,28,.10)] border border-[rgba(169,121,28,.25)] text-[var(--gold)] font-semibold">
                        {item.day.split(" ")[1]}
                      </span>
                      <div>
                        <p className="font-semibold text-[var(--ink)]">{item.title}</p>
                        <p className="text-sm text-[var(--ink-dim)]">{item.day}</p>
                      </div>
                    </div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${isOpen ? "rotate-45" : "rotate-0"}`}
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-[var(--ink-dim)] leading-7 border-t border-[var(--line)] bg-[var(--bg-warm)]">
                      {item.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 36 }}>
            <span className="eyebrow-note">Moments from the reserve</span>
            <h2 className="h-section" style={{ marginTop: 14 }}>Photo gallery</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 reveal">
            {galleryImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => openLightbox(index)}
                className="group relative overflow-hidden rounded-[6px] border border-[var(--line)] bg-[#f5f1e7] text-left"
                aria-label={`Open gallery image ${index + 1}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80" />
                <span className="absolute bottom-4 left-4 text-sm font-medium text-white">
                  {image.alt}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="booking">
        <div className="wrap">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <div className="reveal">
              <span className="eyebrow-note">Included in your stay</span>
              <h2 className="h-display" style={{ marginTop: 16, fontSize: "clamp(1.9rem, 3vw, 2.7rem)" }}>
                Everything arranged for a smooth, wild few days.
              </h2>
              <ul style={{ marginTop: 28, display: "grid", gap: 14 }}>
                {[
                  "2 nights in a comfortable bushveld lodge",
                  "Daily game drives with a licensed guide",
                  "Breakfast, lunch and dinner included",
                  "Park entry fees and road transfers",
                  "Small-group atmosphere with flexible pacing",
                ].map((feature) => (
                  <li key={feature} style={{ display: "flex", gap: 12, alignItems: "center", color: "var(--ink-dim)" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "rgba(169,121,28,.10)",
                        border: "1px solid rgba(169,121,28,.25)",
                        color: "var(--gold)",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="reveal">
              <div className="booking-box">
                <p className="price-label">From</p>
                <p className="price-amt">{formatPrice(5999)}</p>
                <p className="price-note">per person, all-inclusive</p>
                <div className="booking-divider"></div>
                <div className="booking-field">
                  <label htmlFor="bookDate">Select date</label>
                  <input type="date" id="bookDate" />
                </div>
                <div className="booking-field">
                  <label htmlFor="bookGuests">Travellers</label>
                  <select id="bookGuests">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5+ Guests — contact us</option>
                  </select>
                </div>
                <a
                  href="/#contact"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", padding: "1em" }}
                >
                  Book Now <span className="btn-arrow">→</span>
                </a>
                <ul className="booking-features">
                  {[
                    "Free cancellation up to 30 days",
                    "Instant confirmation",
                    "Secure payment",
                    "No hidden fees",
                  ].map((feat, i) => (
                    <li key={i}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="cta-band section-tight" id="contact">
        <div className="wrap cta-grid">
          <div className="reveal">
            <span className="eyebrow-note">Need a custom route?</span>
            <h2 className="h-display" style={{ marginTop: 14 }}>
              We can shape this safari around your dates and pace.
            </h2>
            <div className="hero-actions" style={{ marginTop: 30, justifyContent: "flex-start" }}>
              <a href="mailto:info@malikantours.co.za" className="btn btn-primary">
                Email us <span className="btn-arrow">→</span>
              </a>
              <a href="tel:0632344970" className="btn btn-ghost on-dark">Call 063 234 4970</a>
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
            <a href="/" className="brand" style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", letterSpacing: ".01em", display: "flex", flexDirection: "column", lineHeight: "1.1", color: "#fff" }}>
              Malikan&nbsp;Tours
              <small style={{ fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: "600", letterSpacing: ".14em", color: "var(--gold-bright)", marginTop: "3px", textTransform: "uppercase" }}>
                Tours &amp; Projects
              </small>
            </a>
            <p>
              Guided tours, travel planning and cultural experiences across South Africa and Africa — built around real budgets and real routes.
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
            <span>063 234 4970</span>
            <span>info@malikantours.co.za</span>
            <span>1717 Kingfisher Street, Marloth Park<br />Kruger National Park</span>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© 2026 Malikan Tours And Projects (Pty) Ltd</span>
          <span>Designed for the road ahead.</span>
        </div>
      </footer>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-5xl w-full">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white"
              onClick={closeLightbox}
              aria-label="Close gallery"
            >
              ×
            </button>
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black">
              <img
                src={galleryImages[lightboxIndex].src}
                alt={galleryImages[lightboxIndex].alt}
                className="max-h-[80vh] w-full object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 text-white">
              <button
                type="button"
                onClick={prevImage}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                ← Previous
              </button>
              <span className="text-sm text-white/80">{lightboxIndex + 1} / {galleryImages.length}</span>
              <button
                type="button"
                onClick={nextImage}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}