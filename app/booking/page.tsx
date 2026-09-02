"use client";

import { useState, useEffect, useCallback } from "react";

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [guests, setGuests] = useState(2);
  const [tour, setTour] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [refNum, setRefNum] = useState("0000");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* ---- Set min date to today ---- */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const el = document.getElementById("tourDate") as HTMLInputElement | null;
    if (el) el.min = today;
  }, []);

  /* ---- Navbar glass effect on scroll ---- */
  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- Mobile drawer body lock ---- */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  /* ---- Escape to close drawer ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ---- Reveal animations ---- */
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
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => io?.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
    return () => io?.disconnect();
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step === 3) {
        setRefNum(String(Math.floor(1000 + Math.random() * 9000)));
      }
      setCurrentStep(step);
      setTimeout(() => {
        const section = document.getElementById("booking-section");
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    },
    []
  );

  const updateGuests = (delta: number) => {
    setGuests((g) => Math.max(1, Math.min(20, g + delta)));
  };

  const getTourName = () => {
    if (!tour) return "Not selected";
    const map: Record<string, string> = {
      kruger: "Kruger National Park Safari",
      suncity: "Sun City & Nature Getaway",
      qwaqwa: "Qwa Qwa Retreat",
      mpumalanga: "Mpumalanga Retreat",
      winelands: "Cape Winelands Weekend",
      drakensberg: "Drakensberg Hiking Escape",
      soweto: "Soweto Heritage Tour",
      blyde: "Blyde River Canyon Day Trip",
      vicfalls: "Victoria Falls Crossing",
    };
    return map[tour] || "Not selected";
  };

  const getDateStr = () => {
    if (!tourDate) return "Not selected";
    return new Date(tourDate).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const step1Active = currentStep === 1;
  const step1Completed = currentStep > 1;
  const step2Active = currentStep === 2;
  const step2Completed = currentStep > 2;
  const step3Active = currentStep === 3;
  const conn1Completed = currentStep > 1;
  const conn2Completed = currentStep > 2;

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <header className="relative z-50">
        {/* Top Info Bar */}
        <div className="bg-gradient-to-r from-[#0F0D0A] to-[#14110B] w-full text-[13px] border-b border-[#C9A227]/20">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex flex-col sm:flex-row items-center justify-between py-3 gap-3">
            <div className="flex items-center gap-6 text-[#C9C2B4]">
              <a href="mailto:info@malikantours.co.za" className="flex items-center gap-2 link-underline hover:text-[#C9A227] transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A227]"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span className="hidden sm:inline">info@malikantours.co.za</span>
              </a>
              <a href="tel:0796445310" className="flex items-center gap-2 link-underline hover:text-[#C9A227] transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A227]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>0796445310</span>
              </a>
            </div>
            <div className="flex items-center gap-4 text-[#C9C2B4]">
              <span className="hidden sm:inline tracking-widest text-[11px] opacity-70 uppercase">Connect with us</span>
              <div className="flex items-center gap-3">
                <a href="https://facebook.com/SitePad" target="_blank" rel="noopener noreferrer" aria-label="facebook" className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://www.instagram.com/explore/tags/sitepad/" target="_blank" rel="noopener noreferrer" aria-label="instagram" className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://x.com/sitepad_editor" target="_blank" rel="noopener noreferrer" aria-label="twitter" className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.youtube.com/channel/UC-YnxFTZ5-atVFZCGGZ91PQ" target="_blank" rel="noopener noreferrer" aria-label="youtube" className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div id="main-nav" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-[#C9A227]/10 backdrop-blur-md ${navScrolled ? "glass-nav" : "bg-gradient-to-b from-[#14110B] to-[#0F0D0A]"}`}>
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-between py-4 gap-6">
            <a href="/" className="brand shrink-0 no-underline hover:opacity-80 transition-opacity" aria-label="Malikan Tours home">
              <span className="brand-mark" aria-hidden="true">
                <img src="/logo.jpg" alt="Malikan Tours logo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </span>
              <span className="brand-text">
                <span className="brand-name">Malikan</span>
                <small>Tours</small>
              </span>
            </a>
            <div className="hidden xl:flex items-center gap-10">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </span>
                <div className="leading-tight">
                  <p className="overline-label text-[11px]">Hours</p>
                  <p className="text-[12px] text-white font-medium">Mon–Fri, 9am–5pm</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9"/></svg>
                </span>
                <div className="leading-tight">
                  <p className="overline-label text-[11px]">Call us</p>
                  <a href="tel:0796445310" className="text-[12px] text-white font-medium hover:text-[#C9A227] transition-colors duration-300">+27 796 445 310</a>
                </div>
              </div>
            </div>
            <div className="hidden xl:flex gap-4 items-center">
              <a href="/booking" className="inline-flex items-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(34,197,94,0.45)]">🟢 BOOK NOW</a>
              <button
                id="scroll-top-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`w-10 h-10 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 ${showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                aria-label="Scroll to top"
                title="Back to top"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
            </div>
            <button id="drawer-btn" onClick={() => setDrawerOpen(true)} className="xl:hidden w-11 h-11 flex items-center justify-center bg-[#C9A227] text-white rounded-sm" aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
          <nav className="hidden xl:block border-t border-[#C9A227]/10 bg-gradient-to-r from-white/[0.02] to-transparent backdrop-blur-md">
            <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-center gap-10 h-12">
              <a href="/" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">HOME</a>
              <a href="/tours" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">TOURS &amp; SAFARIS</a>
              <a href="/destination" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">DESTINATIONS</a>
              <a href="/about" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">ABOUT US</a>
              <a href="/gallery" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">GALLERY</a>
              <a href="/#stories" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">REVIEWS</a>
              <a href="/#contact" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">CONTACT US</a>
            </div>
          </nav>
        </div>

        {/* Mobile Menu Drawer */}
        <div id="mobile-drawer" className={`fixed inset-0 z-[60] xl:hidden transition-opacity duration-300 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div id="drawer-overlay" onClick={() => setDrawerOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <aside id="drawer-panel" className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-gradient-to-b from-[#14110B] to-[#0F0D0A] text-white flex flex-col transition-transform duration-500 ease-out border-l border-[#C9A227]/20 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex items-center justify-between p-5 border-b border-[#C9A227]/20">
              <span className="flex items-center gap-2 text-white">
                <span className="brand-mark" style={{ width: 28, height: 28, minWidth: 28 }}>
                  <img src="/logo.jpg" alt="Malikan Tours logo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </span>
                <span className="font-heading text-base text-white">Malikan</span>
              </span>
              <button id="close-drawer" onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="w-9 h-9 flex items-center justify-center text-white hover:text-[#C9A227] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <nav className="flex flex-col p-5 gap-1 overflow-y-auto">
              <a href="/" onClick={() => setDrawerOpen(false)} className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">HOME</a>
              <a href="/tours" onClick={() => setDrawerOpen(false)} className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">TOURS &amp; SAFARIS</a>
              <a href="/destination" onClick={() => setDrawerOpen(false)} className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">DESTINATIONS</a>
              <a href="/about" onClick={() => setDrawerOpen(false)} className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">ABOUT US</a>
              <a href="/gallery" onClick={() => setDrawerOpen(false)} className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">GALLERY</a>
              <a href="/#stories" onClick={() => setDrawerOpen(false)} className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">REVIEWS</a>
              <a href="/#contact" onClick={() => setDrawerOpen(false)} className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">CONTACT US</a>
              <a href="/booking" onClick={() => setDrawerOpen(false)} className="inline-flex items-center justify-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 mt-6 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)]">🟢 BOOK NOW</a>
            </nav>
            <div className="mt-auto p-5 border-t border-[#C9A227]/20 text-[13px] text-white/70 space-y-3">
              <a href="tel:0796445310" className="flex items-center gap-2 hover:text-[#C9A227] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A227] flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                0796445310
              </a>
              <a href="mailto:info@malikantours.co.za" className="flex items-center gap-2 hover:text-[#C9A227] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A227] flex-shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                info@malikantours.co.za
              </a>
            </div>
          </aside>
        </div>
      </header>

      {/* ==================== PAGE HERO ==================== */}
      <section className="page-hero" id="top">
        <div className="page-hero-bg">
          <img src="/hero3.jpg" alt="South African safari landscape" />
          <div className="page-hero-bg-overlay"></div>
        </div>
        <div className="page-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Book Your Adventure</span>
          </nav>
          <h1>Book your adventure.</h1>
          <p className="lede">Choose your tour, pick your dates, and we&apos;ll handle the rest — from permits to pickup.</p>
        </div>
      </section>

      {/* ==================== BOOKING FORM ==================== */}
      <section id="booking-section" className="section" style={{ paddingTop: "clamp(48px, 7vw, 80px)", background: "linear-gradient(180deg, #fff 0%, var(--bg-warm) 100%)" }}>
        <div className="wrap">
          {/* Step Indicator */}
          <div className="steps-bar reveal">
            <div className={`step ${step1Active ? "active" : ""} ${step1Completed ? "completed" : ""}`}>
              <div className="step-node"><span>1</span></div>
              <span className="step-label">Tour</span>
            </div>
            <div className={`step-connector ${conn1Completed ? "completed" : ""}`}></div>
            <div className={`step ${step2Active ? "active" : ""} ${step2Completed ? "completed" : ""}`}>
              <div className="step-node"><span>2</span></div>
              <span className="step-label">Details</span>
            </div>
            <div className={`step-connector ${conn2Completed ? "completed" : ""}`}></div>
            <div className={`step ${step3Active ? "active" : ""}`}>
              <div className="step-node"><span>3</span></div>
              <span className="step-label">Confirmation</span>
            </div>
          </div>

          {/* Step 1: Select Tour */}
          {currentStep === 1 && (
            <div className="booking-card reveal">
              <span className="eyebrow-note">Step 1 of 3</span>
              <h2 className="h-display" style={{ marginTop: 10, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Select your experience</h2>
              <p className="lede" style={{ marginTop: 12, marginBottom: 34, fontSize: ".98rem" }}>Pick the tour that fits your schedule and we&apos;ll personalise the rest.</p>

              <div className="form-field">
                <label htmlFor="tourSelect">Select Tour</label>
                <select id="tourSelect" value={tour} onChange={(e) => setTour(e.target.value)}>
                  <option value="" disabled>Select your tour…</option>
                  <option value="kruger">Kruger National Park Safari — R 6 500 pp</option>
                  <option value="suncity">Sun City &amp; Nature Getaway — R 4 000 pp</option>
                  <option value="qwaqwa">Qwa Qwa Retreat — R 5 500 pp</option>
                  <option value="mpumalanga">Mpumalanga Retreat — R 5 500 pp</option>
                  <option value="winelands">Cape Winelands Weekend — R 1 800 pp</option>
                  <option value="drakensberg">Drakensberg Hiking Escape — R 5 200 pp</option>
                  <option value="soweto">Soweto Heritage Tour — R 950 pp</option>
                  <option value="blyde">Blyde River Canyon Day Trip — R 1 400 pp</option>
                  <option value="vicfalls">Victoria Falls Crossing — R 9 800 pp</option>
                </select>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="tourDate">Select Date</label>
                  <input type="date" id="tourDate" value={tourDate} onChange={(e) => setTourDate(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Number of Guests</label>
                  <div className="guest-stepper">
                    <button type="button" onClick={() => updateGuests(-1)} aria-label="Decrease guests">−</button>
                    <span className="guest-count">{guests} Guest{guests !== 1 ? "s" : ""}</span>
                    <button type="button" onClick={() => updateGuests(1)} aria-label="Increase guests">+</button>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                <button className="btn btn-primary" onClick={() => goToStep(2)}>Continue <span className="btn-arrow">→</span></button>
              </div>
            </div>
          )}

          {/* Step 2: Customer Details */}
          {currentStep === 2 && (
            <div className="booking-card reveal">
              <span className="eyebrow-note">Step 2 of 3</span>
              <h2 className="h-display" style={{ marginTop: 10, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Traveller details</h2>
              <p className="lede" style={{ marginTop: 12, marginBottom: 34, fontSize: ".98rem" }}>Tell us who you are and how to reach you.</p>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="custName">Full Name</label>
                  <input type="text" id="custName" placeholder="e.g. Thabo Molefe" value={custName} onChange={(e) => setCustName(e.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="custPhone">Phone Number</label>
                  <input type="tel" id="custPhone" placeholder="e.g. 079 644 5310" value={custPhone} onChange={(e) => setCustPhone(e.target.value)} />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="custEmail">Email Address</label>
                <input type="email" id="custEmail" placeholder="e.g. thabo@email.co.za" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} />
              </div>

              <div className="form-field">
                <label htmlFor="specialRequests">Special Requests</label>
                <textarea id="specialRequests" placeholder="Dietary requirements, accessibility needs, pickup location, or anything else we should know…" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, gap: 16, flexWrap: "wrap" }}>
                <button className="btn btn-ghost" onClick={() => goToStep(1)}>← Back</button>
                <button className="btn btn-primary" onClick={() => goToStep(3)}>Continue <span className="btn-arrow">→</span></button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="booking-card reveal" style={{ textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(169,121,28,.10)", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="eyebrow-note">Step 3 of 3</span>
              <h2 className="h-display" style={{ marginTop: 10, fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>Booking request received</h2>
              <p className="lede" style={{ marginTop: 14, marginBottom: 32, fontSize: "1rem", maxWidth: "54ch", marginInline: "auto" }}>Thank you. We&apos;ve captured your request and will call you within 24 hours to confirm dates, answer questions, and arrange payment.</p>

              <div style={{ background: "var(--bg-warm)", border: "1px solid var(--line)", borderRadius: 4, padding: 28, maxWidth: 420, margin: "0 auto 32px", textAlign: "left" }}>
                <p style={{ fontSize: ".72rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 16 }}>Booking Summary</p>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: ".92rem" }}>
                  <span style={{ color: "var(--ink-dim)" }}>Tour</span>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{getTourName()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: ".92rem" }}>
                  <span style={{ color: "var(--ink-dim)" }}>Date</span>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{getDateStr()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: ".92rem" }}>
                  <span style={{ color: "var(--ink-dim)" }}>Guests</span>
                  <span style={{ color: "var(--ink)", fontWeight: 500 }}>{guests} Guest{guests !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: ".92rem" }}>
                  <span style={{ color: "var(--ink-dim)" }}>Reference</span>
                  <span style={{ color: "var(--ink)", fontWeight: 500, fontFamily: "var(--serif)" }}>MT-{refNum}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="tel:0796445310" className="btn btn-primary">Call us now <span className="btn-arrow">→</span></a>
                <a href="/tours" className="btn btn-ghost">Browse more tours</a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="section-tight" style={{ background: "linear-gradient(120deg, #14110B, #1D1811)", borderTop: "1px solid var(--line-dark)" }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="reveal">
            <span className="eyebrow-note">Need help deciding?</span>
            <h2 className="h-display" style={{ color: "#fff", marginTop: 14, fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>Rather talk it through first?</h2>
            <p style={{ color: "var(--ink-on-dark-dim)", marginTop: 16, maxWidth: "48ch", marginInline: "auto" }}>Call Malikan directly on 079 644 5310. He&apos;ll walk you through the routes, the timing, and what to pack — no pressure, no obligation.</p>
            <div style={{ marginTop: 30, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="tel:0796445310" className="btn btn-primary">Call 079 644 5310</a>
              <a href="mailto:info@malikantours.co.za" className="btn btn-ghost on-dark">Email us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="site-footer" style={{ backgroundImage: "linear-gradient(135deg, rgba(20,17,11,.92), rgba(20,17,11,.88)), url('/gallery7.jpg')", backgroundPosition: "center", backgroundSize: "cover", backgroundAttachment: "fixed" }}>
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <a href="/" className="brand" style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", letterSpacing: ".01em", display: "flex", flexDirection: "column", lineHeight: "1.1", color: "#fff" }}>
              Malikan&nbsp;Tours
              <small style={{ fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 600, letterSpacing: ".14em", color: "var(--gold-bright)", marginTop: "3px", textTransform: "uppercase" }}>Tours &amp; Projects</small>
            </a>
            <p>Guided tours, travel planning and cultural experiences across South Africa and Africa — built around real budgets and real routes.</p>
          </div>
          <div className="footer-col">
            <h4>EXPLORE</h4>
            <a href="/about">About</a>
            <a href="/tours">Tours &amp; safaris</a>
            <a href="/about">Your guide</a>
            <a href="/#stories">Stories</a>
          </div>
          <div className="footer-col">
            <h4>SERVICES</h4>
            <a href="/tours">Guided tours</a>
            <a href="/">Travel planning</a>
            <a href="/">Cultural experiences</a>
            <a href="/">Accommodation</a>
          </div>
          <div className="footer-col">
            <h4>CONTACT</h4>
            <span>079 644 5310</span>
            <span>info@malikantours.co.za</span>
            <span>20323 Zone 14, Sebokeng, 1983</span>
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