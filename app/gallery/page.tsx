"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ─── Data ─── */
const galleryItems = [
  {
    src: "/hero.jpg",
    alt: "Kruger sunrise over the savanna",
    label: "Kruger Sunrise",
    caption: "Kruger Sunrise — Early morning light over the central savanna",
    span: "span-2",
  },
  {
    src: "/gallery.jpg",
    alt: "Elephant herd at a waterhole",
    label: "Elephant Encounter",
    caption: "Elephant Encounter — A breeding herd at a remote waterhole",
    span: "",
  },
  {
    src: "/gallery1.jpg",
    alt: "Lion resting in golden grass",
    label: "Lion at Dusk",
    caption: "Lion at Dusk — Resting in golden grass after the heat of the day",
    span: "",
  },
  {
    src: "/gallery2.jpg",
    alt: "Bushveld lodge at dusk",
    label: "Lodge Evenings",
    caption: "Lodge Evenings — The bushveld lodge at dusk, lanterns lit",
    span: "",
  },
  {
    src: "/gallery3.jpg",
    alt: "Leopard in a tree",
    label: "Leopard Sighting",
    caption: "Leopard Sighting — Spotted high in a marula tree at sunset",
    span: "span-2-both",
  },
  {
    src: "/gallery4.jpg",
    alt: "Sundowner drinks at sunset",
    label: "Sundowners",
    caption: "Sundowners — Drinks as the light turns amber over the plains",
    span: "",
  },
  {
    src: "/gallery5.jpg",
    alt: "Guide tracking wildlife on foot",
    label: "On Foot",
    caption: "On Foot — Tracking signs with an experienced field guide",
    span: "span-2",
  },
  {
    src: "/gallery6.jpg",
    alt: "Cultural experience with local community",
    label: "Cultural Roots",
    caption: "Cultural Roots — Sharing stories with the Basotho community",
    span: "",
  },
  {
    src: "/gallery7.jpg",
    alt: "Panoramic view of the bushveld",
    label: "Endless Horizons",
    caption: "Endless Horizons — The view from Gods Window, Mpumalanga",
    span: "span-2-row",
  },
];

const reviews = [
  {
    text: "Amazing safari experience! Malikan knew exactly where to position the vehicle for the perfect light. We saw the Big Five in two days.",
    name: "Thabo Mokoena",
    role: "Kruger Safari, June 2026",
    initial: "T",
  },
  {
    text: "Professional and unforgettable! The Victoria Falls crossing was daunting to plan alone, but Malikan Tours handled every permit and transfer.",
    name: "Lerato Dlamini",
    role: "Victoria Falls Crossing, May 2026",
    initial: "L",
  },
  {
    text: "The Qwa Qwa retreat changed how I see my own country. The Basotho Cultural Village was not a stop — it was a conversation. Truly moving.",
    name: "Naledi M.",
    role: "Qwa Qwa Cultural Retreat, April 2026",
    initial: "N",
  },
  {
    text: "We took our extended family of 14 on the Sun City getaway. Every age group was catered for, from the grandparents to the teenagers. Flawless.",
    name: "Sipho D.",
    role: "Sun City Getaway, March 2026",
    initial: "S",
  },
  {
    text: "The Drakensberg hike was paced perfectly. Malikan checked on everyone without making it feel like a school trip. The views were worth every step.",
    name: "Kagiso T.",
    role: "Drakensberg Escape, February 2026",
    initial: "K",
  },
  {
    text: "I have done the Cape Winelands three times with different operators. This was the first time it felt like the guide actually knew the winemakers personally.",
    name: "Priya Naidoo",
    role: "Cape Winelands Weekend, January 2026",
    initial: "P",
  },
];

/* ─── Component ─── */
export default function GalleryPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* Lock body scroll when drawer or lightbox is open */
  useEffect(() => {
    if (drawerOpen || lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen, lightboxOpen]);

  /* Scroll listeners */
  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Reveal on scroll */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
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
      els.forEach((el) => io.observe(el));
      return () => io.disconnect();
    } else {
      els.forEach((el) => el.classList.add("is-visible"));
    }
  }, []);

  /* Lightbox keyboard nav */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft")
        setCurrentImg((p) => (p - 1 + galleryItems.length) % galleryItems.length);
      if (e.key === "ArrowRight")
        setCurrentImg((p) => (p + 1) % galleryItems.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  const openLightbox = useCallback((index: number) => {
    setCurrentImg(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const prevImage = useCallback(
    () => setCurrentImg((p) => (p - 1 + galleryItems.length) % galleryItems.length),
    []
  );
  const nextImage = useCallback(
    () => setCurrentImg((p) => (p + 1) % galleryItems.length),
    []
  );

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <header className="relative z-50">
        {/* Top bar */}
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
                {[
                  {
                    href: "https://facebook.com/SitePad",
                    label: "facebook",
                    svg: (
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    ),
                  },
                  {
                    href: "https://www.instagram.com/explore/tags/sitepad/",
                    label: "instagram",
                    svg: (
                      <>
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </>
                    ),
                  },
                  {
                    href: "https://x.com/sitepad_editor",
                    label: "twitter",
                    svg: (
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    ),
                  },
                  {
                    href: "https://www.youtube.com/channel/UC-YnxFTZ5-atVFZCGGZ91PQ",
                    label: "youtube",
                    svg: (
                      <>
                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                        <path d="m10 15 5-3-5-3z" />
                      </>
                    ),
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={s.label === "facebook" || s.label === "twitter" || s.label === "youtube" ? "currentColor" : "none"}
                      stroke={s.label === "instagram" ? "currentColor" : "none"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {s.svg}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div
          id="main-nav"
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-gradient-to-b from-[#14110B] to-[#0F0D0A] border-b border-[#C9A227]/10 backdrop-blur-md ${
            navScrolled ? "glass-nav" : ""
          }`}
        >
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-between py-4 gap-6">
            <Link
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
            </Link>

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
                    +27 796 445 310
                  </a>
                </div>
              </div>
            </div>

            <div className="hidden xl:flex gap-4 items-center">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(34,197,94,0.45)]"
              >
                🔴 BOOK NOW
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`w-10 h-10 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 ${
                  showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
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
              {[
                { href: "/", label: "HOME" },
                { href: "/tours", label: "TOURS & SAFARIS" },
                { href: "/destination", label: "DESTINATIONS" },
                { href: "/about", label: "ABOUT US" },
                { href: "/gallery", label: "GALLERY", active: true },
                { href: "/#stories", label: "REVIEWS" },
                { href: "/contact", label: "CONTACT US" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline hover:text-[#C9A227] hover:font-medium ${
                    link.active ? "text-[#C9A227] font-medium" : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Mobile drawer */}
        <div
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
              {[
                { href: "/", label: "HOME" },
                { href: "/tours", label: "TOURS & SAFARIS" },
                { href: "/destination", label: "DESTINATIONS" },
                { href: "/about", label: "ABOUT US" },
                { href: "/gallery", label: "GALLERY", active: true },
                { href: "/#stories", label: "REVIEWS" },
                { href: "/contact", label: "CONTACT US" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded ${
                    link.active ? "text-[#C9A227] font-medium" : "text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 mt-6 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)]"
              >
                🔴 BOOK NOW
              </Link>
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
          <img src="/hero3.jpg" alt="African landscape at golden hour" />
          <div className="page-hero-bg-overlay" />
        </div>
        <div className="page-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Gallery &amp; Reviews</span>
          </nav>
          <h1>Our Adventures</h1>
          <p className="lede">
            Wildlife • Nature • Travel • Culture — moments captured across Southern Africa, and the
            stories of those who lived them.
          </p>
        </div>
      </section>

      {/* ==================== GALLERY ==================== */}
      <section className="section gallery-section">
        <div className="wrap">
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: 50 }}
          >
            <span className="eyebrow-note">Through the lens</span>
            <h2 className="h-section" style={{ marginTop: 14 }}>
              Visual Stories
            </h2>
            <p className="lede" style={{ marginTop: 18, marginInline: "auto" }}>
              Click any image to open the lightbox and see the moment in full.
            </p>
          </div>

          <div className="gallery-grid reveal">
            {galleryItems.map((item, i) => (
              <div
                key={i}
                className={`gallery-item ${item.span}`}
                onClick={() => openLightbox(i)}
              >
                <img src={item.src} alt={item.alt} />
                <span className="gal-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ==================== REVIEWS ==================== */}
      <section className="section reviews-section" id="reviews">
        <div className="wrap">
          <div className="reviews-head reveal">
            <span className="eyebrow-note" style={{ color: "var(--gold-bright)" }}>
              What our travellers say
            </span>
            <h2 className="h-display" style={{ color: "#fff", marginTop: 14 }}>
              Real trips, real feedback.
            </h2>
            <div className="big-rating" style={{ marginTop: 28 }}>
              4.9<span style={{ fontSize: ".5em", verticalAlign: "super" }}>/5</span>
              <small>Based on 80+ verified reviews</small>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                marginTop: 14,
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="#C9A227"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          </div>

          <div className="reviews-grid">
            {reviews.map((review, i) => (
              <div key={i} className="review-card reveal">
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <blockquote>{review.text}</blockquote>
                <div className="who">
                  <div className="avatar">{review.initial}</div>
                  <div>
                    <div className="name">{review.name}</div>
                    <div className="role">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <div
        className={`lightbox ${lightboxOpen ? "active" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
      >
        <button className="lightbox-close" onClick={closeLightbox}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <button
          className="lightbox-nav lightbox-prev"
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <img
          src={galleryItems[currentImg]?.src}
          alt={galleryItems[currentImg]?.alt}
        />
        <div className="lightbox-caption">
          {galleryItems[currentImg]?.caption}
        </div>
        <button
          className="lightbox-nav lightbox-next"
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

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
            <Link
              href="/"
              className="brand"
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1.25rem",
                letterSpacing: ".01em",
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.1,
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
                  marginTop: 3,
                  textTransform: "uppercase",
                }}
              >
                Tours &amp; Projects
              </small>
            </Link>
            <p>
              Guided tours, travel planning and cultural experiences across South Africa and Africa
              — built around real budgets and real routes.
            </p>
          </div>
          <div className="footer-col">
            <h4>EXPLORE</h4>
            <Link href="/about">About</Link>
            <Link href="/tours">Tours &amp; safaris</Link>
            <Link href="/about">Your guide</Link>
            <Link href="/#stories">Stories</Link>
          </div>
          <div className="footer-col">
            <h4>SERVICES</h4>
            <Link href="/tours">Guided tours</Link>
            <Link href="/contact">Travel planning</Link>
            <Link href="/contact">Cultural experiences</Link>
            <Link href="/contact">Accommodation</Link>
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
      
