"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useCurrency } from "../lib/currency";

export default function BookingPage() {
  const { formatPrice } = useCurrency();
  const [currentStep, setCurrentStep] = useState(1);
  const [guests, setGuests] = useState(2);
  const [tour, setTour] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [refNum, setRefNum] = useState("0000");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const tourNames: Record<string, string> = {
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

  // Per-person price for each tour, matching the Step 1 dropdown labels.
  // Used to store an estimated total alongside the booking.
  const tourPrices: Record<string, number> = {
    kruger: 6500,
    suncity: 4000,
    qwaqwa: 5500,
    mpumalanga: 5500,
    winelands: 1800,
    drakensberg: 5200,
    soweto: 950,
    blyde: 1400,
    vicfalls: 9800,
  };

  const updateGuests = (delta: number) => {
    setGuests((g) => Math.max(1, Math.min(20, g + delta)));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setTimeout(() => {
      document.querySelector(".section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Called from the Step 2 "Continue" button. Writes the booking to
  // Firestore, then advances to the Step 3 confirmation screen.
  const submitBooking = async () => {
    if (isSubmitting) return;
    setSubmitError("");

    if (!tour || !tourDate) {
      setSubmitError("Please go back and select a tour and date.");
      return;
    }
    if (!custName || !custPhone || !custEmail) {
      setSubmitError("Please fill in your name, phone number, and email.");
      return;
    }
    if (!custEmail.includes("@")) {
      setSubmitError("Please enter a valid email address containing an @ sign.");
      return;
    }

    const newRefNum = String(Math.floor(1000 + Math.random() * 9000));
    const pricePerPerson = tourPrices[tour] ?? 0;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "bookings"), {
        reference: `MT-${newRefNum}`,
        tourId: tour,
        tourName: tourNames[tour] ?? tour,
        tourDate,
        guests,
        pricePerPerson,
        estimatedTotal: pricePerPerson * guests,
        customerName: custName,
        customerPhone: custPhone,
        customerEmail: custEmail,
        specialRequests,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setRefNum(newRefNum);
      goToStep(3);
    } catch (error) {
      console.error("Failed to save booking:", error);
      setSubmitError("Something went wrong sending your booking. Please try again, or call us on 079 644 5310.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const summaryTour = tourNames[tour] || "Not selected";
  const summaryDate = tourDate
    ? new Date(tourDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
    : "Not selected";
  const summaryGuests = `${guests} Guest${guests !== 1 ? "s" : ""}`;

  useEffect(() => {
    const nav = document.getElementById("main-nav");
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 40) {
        nav.classList.add("glass-nav");
        nav.classList.remove("bg-[#14110B]");
      } else {
        nav.classList.remove("glass-nav");
        nav.classList.add("bg-[#14110B]");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const drawerBtn = document.getElementById("drawer-btn");
    const closeDrawerBtn = document.getElementById("close-drawer");
    const drawerOverlay = document.getElementById("drawer-overlay");
    const mobileDrawer = document.getElementById("mobile-drawer");
    const drawerPanel = document.getElementById("drawer-panel");

    function openDrawer() {
      mobileDrawer?.classList.remove("opacity-0", "pointer-events-none");
      mobileDrawer?.classList.add("opacity-100", "pointer-events-auto");
      drawerPanel?.classList.remove("translate-x-full");
      drawerPanel?.classList.add("translate-x-0");
      document.body.style.overflow = "hidden";
    }
    function closeDrawer() {
      mobileDrawer?.classList.remove("opacity-100", "pointer-events-auto");
      mobileDrawer?.classList.add("opacity-0", "pointer-events-none");
      drawerPanel?.classList.remove("translate-x-0");
      drawerPanel?.classList.add("translate-x-full");
      document.body.style.overflow = "";
    }
    drawerBtn?.addEventListener("click", openDrawer);
    closeDrawerBtn?.addEventListener("click", closeDrawer);
    drawerOverlay?.addEventListener("click", closeDrawer);
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onEscape);
    const drawerLinks = drawerPanel?.querySelectorAll("a") ?? [];
    drawerLinks.forEach((a) => a.addEventListener("click", closeDrawer));

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

    const scrollTopBtn = document.getElementById("scroll-top-btn");
    const toggleScrollButton = () => {
      if (!scrollTopBtn) return;
      if (window.scrollY > 500) {
        scrollTopBtn.classList.remove("opacity-0", "pointer-events-none");
        scrollTopBtn.classList.add("opacity-100");
      } else {
        scrollTopBtn.classList.add("opacity-0", "pointer-events-none");
        scrollTopBtn.classList.remove("opacity-100");
      }
    };
    const onScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    scrollTopBtn?.addEventListener("click", onScrollTop);
    window.addEventListener("scroll", toggleScrollButton);
    window.addEventListener("resize", toggleScrollButton);

    return () => {
      window.removeEventListener("scroll", onScroll);
      drawerBtn?.removeEventListener("click", openDrawer);
      closeDrawerBtn?.removeEventListener("click", closeDrawer);
      drawerOverlay?.removeEventListener("click", closeDrawer);
      document.removeEventListener("keydown", onEscape);
      drawerLinks.forEach((a) => a.removeEventListener("click", closeDrawer));
      io?.disconnect();
      scrollTopBtn?.removeEventListener("click", onScrollTop);
      window.removeEventListener("scroll", toggleScrollButton);
      window.removeEventListener("resize", toggleScrollButton);
    };
  }, []);

  return (
    <>
      {/* ==================== HEADER ==================== */}
      <header className="relative z-50">
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
                <a href="https://www.instagram.com/malikan_tours?igsi=YzMzMDh5M3R4a3V3&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="instagram" className="w-7 h-7 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110">
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

        <div id="main-nav" className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-gradient-to-b from-[#14110B] to-[#0F0D0A] border-b border-[#C9A227]/10 backdrop-blur-md">
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-between py-4 gap-6">
            <a href="/" className="brand shrink-0 no-underline hover:opacity-80 transition-opacity" aria-label="Malikan Tours home">
              <span className="brand-mark" aria-hidden="true">
                <img src="/logo.jpg" alt="Malikan Tours logo" style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} />
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
              <a href="#step1" className="inline-flex items-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(34,197,94,0.45)]">🟢 BOOK NOW</a>
              <button id="scroll-top-btn" className="w-10 h-10 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 opacity-0 pointer-events-none" aria-label="Scroll to top" title="Back to top">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
            </div>
            <button id="drawer-btn" className="xl:hidden w-11 h-11 flex items-center justify-center bg-[#C9A227] text-white rounded-sm" aria-label="Open menu">
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

        <div id="mobile-drawer" className="fixed inset-0 z-[60] xl:hidden transition-opacity duration-300 opacity-0 pointer-events-none">
          <div id="drawer-overlay" className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <aside id="drawer-panel" className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-gradient-to-b from-[#14110B] to-[#0F0D0A] text-white flex flex-col transition-transform duration-500 ease-out translate-x-full border-l border-[#C9A227]/20">
            <div className="flex items-center justify-between p-5 border-b border-[#C9A227]/20">
              <span className="flex items-center gap-2 text-white">
                <span className="brand-mark" style={{width: "28px", height: "28px", minWidth: "28px"}}>
                  <img src="/logo.jpg" alt="Malikan Tours logo" style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} />
                </span>
                <span className="font-heading text-base text-white">Malikan</span>
              </span>
              <button id="close-drawer" aria-label="Close menu" className="w-9 h-9 flex items-center justify-center text-white hover:text-[#C9A227] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <nav className="flex flex-col p-5 gap-1 overflow-y-auto">
              <a href="/" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">HOME</a>
              <a href="/tours" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">TOURS &amp; SAFARIS</a>
              <a href="/destination" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">DESTINATIONS</a>
              <a href="/about" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">ABOUT US</a>
              <a href="/gallery" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">GALLERY</a>
              <a href="/#stories" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">REVIEWS</a>
              <a href="/#contact" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">CONTACT US</a>
              <a href="#step1" className="inline-flex items-center justify-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 mt-6 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)]">🟢 BOOK NOW</a>
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
      <section className="section" style={{paddingTop: "clamp(48px, 7vw, 80px)", background: "linear-gradient(180deg, #fff 0%, var(--bg-warm) 100%)"}}>
        <div className="wrap">
          <div className="steps-bar reveal">
            <div className={`step ${currentStep === 1 ? "active" : currentStep > 1 ? "completed" : ""}`} id="step1-indicator">
              <div className="step-node"><span>1</span></div>
              <span className="step-label">Tour</span>
            </div>
            <div className={`step-connector ${currentStep > 1 ? "completed" : ""}`} id="conn1"></div>
            <div className={`step ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`} id="step2-indicator">
              <div className="step-node"><span>2</span></div>
              <span className="step-label">Details</span>
            </div>
            <div className={`step-connector ${currentStep > 2 ? "completed" : ""}`} id="conn2"></div>
            <div className={`step ${currentStep === 3 ? "active" : ""}`} id="step3-indicator">
              <div className="step-node"><span>3</span></div>
              <span className="step-label">Confirmation</span>
            </div>
          </div>

          {/* Step 1 */}
          <div className="booking-card reveal" id="step1" style={{display: currentStep === 1 ? "block" : "none"}}>
            <span className="eyebrow-note">Step 1 of 3</span>
            <h2 className="h-display" style={{marginTop: "10px", fontSize: "clamp(1.6rem, 3vw, 2.2rem)"}}>Select your experience</h2>
            <p className="lede" style={{marginTop: "12px", marginBottom: "34px", fontSize: ".98rem"}}>Pick the tour that fits your schedule and we&apos;ll personalise the rest.</p>
            <p style={{marginBottom: "24px", color: "var(--ink-dim)", fontSize: ".88rem"}}><strong>Fields marked with * are required</strong></p>

            <div className="form-field">
              <label htmlFor="tourSelect">Select Tour *</label>
              <select id="tourSelect" value={tour} onChange={(e) => setTour(e.target.value)} required>
                <option value="" disabled>Select your tour…</option>
                <option value="kruger">Kruger National Park Safari — {formatPrice(tourPrices.kruger)} pp</option>
                <option value="suncity">Sun City &amp; Nature Getaway — {formatPrice(tourPrices.suncity)} pp</option>
                <option value="qwaqwa">Qwa Qwa Retreat — {formatPrice(tourPrices.qwaqwa)} pp</option>
                <option value="mpumalanga">Mpumalanga Retreat — {formatPrice(tourPrices.mpumalanga)} pp</option>
                <option value="winelands">Cape Winelands Weekend — {formatPrice(tourPrices.winelands)} pp</option>
                <option value="drakensberg">Drakensberg Hiking Escape — {formatPrice(tourPrices.drakensberg)} pp</option>
                <option value="soweto">Soweto Heritage Tour — {formatPrice(tourPrices.soweto)} pp</option>
                <option value="blyde">Blyde River Canyon Day Trip — {formatPrice(tourPrices.blyde)} pp</option>
                <option value="vicfalls">Victoria Falls Crossing — {formatPrice(tourPrices.vicfalls)} pp</option>
              </select>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="tourDate">Select Date *</label>
                <input type="date" id="tourDate" value={tourDate} onChange={(e) => setTourDate(e.target.value)} min={today} required />
              </div>
              <div className="form-field">
                <label>Number of Guests</label>
                <div className="guest-stepper">
                  <button type="button" onClick={() => updateGuests(-1)} aria-label="Decrease guests">−</button>
                  <span className="guest-count" id="guestCount">{guests} Guest{guests !== 1 ? "s" : ""}</span>
                  <button type="button" onClick={() => updateGuests(1)} aria-label="Increase guests">+</button>
                </div>
              </div>
            </div>

            <div style={{display: "flex", justifyContent: "flex-end", marginTop: "10px"}}>
              <button className="btn btn-primary" onClick={() => goToStep(2)}>Continue <span className="btn-arrow">→</span></button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="booking-card reveal" id="step2" style={{display: currentStep === 2 ? "block" : "none"}}>
            <span className="eyebrow-note">Step 2 of 3</span>
            <h2 className="h-display" style={{marginTop: "10px", fontSize: "clamp(1.6rem, 3vw, 2.2rem)"}}>Traveller details</h2>
            <p className="lede" style={{marginTop: "12px", marginBottom: "34px", fontSize: ".98rem"}}>Tell us who you are and how to reach you.</p>
            <p style={{marginBottom: "24px", color: "var(--ink-dim)", fontSize: ".88rem"}}><strong>Fields marked with * are required</strong></p>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="custName">Full Name *</label>
                <input type="text" id="custName" placeholder="e.g. Thabo Molefe" value={custName} onChange={(e) => setCustName(e.target.value)} required />
              </div>
              <div className="form-field">
                <label htmlFor="custPhone">Phone Number *</label>
                <input type="tel" id="custPhone" inputMode="numeric" pattern="[0-9]*" placeholder="e.g. 0796445310" value={custPhone} onChange={(e) => setCustPhone(e.target.value.replace(/\D/g, ""))} required />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="custEmail">Email Address *</label>
              <input type="email" id="custEmail" placeholder="e.g. thabo@email.co.za" value={custEmail} onChange={(e) => setCustEmail(e.target.value)} required />
            </div>

            <div className="form-field">
              <label htmlFor="specialRequests">Special Requests</label>
              <textarea id="specialRequests" placeholder="Dietary requirements, accessibility needs, pickup location, or anything else we should know…" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)}></textarea>
            </div>

            {submitError && (
              <p style={{ color: "#dc2626", fontSize: ".88rem", marginTop: "16px" }} role="alert">
                {submitError}
              </p>
            )}

            <div style={{display: "flex", justifyContent: "space-between", marginTop: "10px", gap: "16px", flexWrap: "wrap"}}>
              <button className="btn btn-ghost" onClick={() => goToStep(1)} disabled={isSubmitting}>← Back</button>
              <button className="btn btn-primary" onClick={submitBooking} disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Continue"} <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="booking-card reveal" id="step3" style={{display: currentStep === 3 ? "block" : "none", textAlign: "center"}}>
            <div style={{width: "72px", height: "72px", borderRadius: "50%", background: "rgba(169,121,28,.10)", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px"}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className="eyebrow-note">Step 3 of 3</span>
            <h2 className="h-display" style={{marginTop: "10px", fontSize: "clamp(1.6rem, 3vw, 2.2rem)"}}>Booking request received</h2>
            <p className="lede" style={{marginTop: "14px", marginBottom: "32px", fontSize: "1rem", maxWidth: "54ch", marginInline: "auto"}}>Thank you. We&apos;ve captured your request and will call you within 24 hours to confirm dates, answer questions, and arrange payment.</p>

            <div style={{background: "var(--bg-warm)", border: "1px solid var(--line)", borderRadius: "4px", padding: "28px", maxWidth: "420px", margin: "0 auto 32px", textAlign: "left"}}>
              <p style={{fontSize: ".72rem", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: "16px"}}>Booking Summary</p>
              <div style={{display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: ".92rem"}}>
                <span style={{color: "var(--ink-dim)"}}>Tour</span>
                <span style={{color: "var(--ink)", fontWeight: 500}}>{summaryTour}</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: ".92rem"}}>
                <span style={{color: "var(--ink-dim)"}}>Date</span>
                <span style={{color: "var(--ink)", fontWeight: 500}}>{summaryDate}</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: ".92rem"}}>
                <span style={{color: "var(--ink-dim)"}}>Guests</span>
                <span style={{color: "var(--ink)", fontWeight: 500}}>{summaryGuests}</span>
              </div>
              <div style={{display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: ".92rem"}}>
                <span style={{color: "var(--ink-dim)"}}>Reference</span>
                <span style={{color: "var(--ink)", fontWeight: 500, fontFamily: "var(--serif)"}}>MT-{refNum}</span>
              </div>
            </div>
            <div style={{display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap"}}>
              <a href="tel:0796445310" className="btn btn-primary">Call us now <span className="btn-arrow">→</span></a>
              <a href="/tours" className="btn btn-ghost">Browse more tours</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{background: "linear-gradient(120deg, #14110B, #1D1811)", borderTop: "1px solid var(--line-dark)"}}>
        <div className="wrap" style={{textAlign: "center"}}>
          <div className="reveal">
            <span className="eyebrow-note">Need help deciding?</span>
            <h2 className="h-display" style={{color: "#fff", marginTop: "14px", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)"}}>Rather talk it through first?</h2>
            <p style={{color: "var(--ink-on-dark-dim)", marginTop: "16px", maxWidth: "48ch", marginInline: "auto"}}>Call Malikan directly on 063 234 4970. He&apos;ll walk you through the routes, timing, and what to pack.</p>
            <div style={{marginTop: "30px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap"}}>
              <a href="tel:0632344970" className="btn btn-primary">Call 063 234 4970</a>
              <a href="mailto:info@malikantours.co.za" className="btn btn-ghost on-dark">Email us</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <a href="/" className="brand" style={{fontFamily: "var(--serif)", fontSize: "1.25rem", display: "flex", flexDirection: "column", lineHeight: "1.1", color: "#fff"}}>
              Malikan&nbsp;Tours
              <small style={{fontFamily: "var(--sans)", fontSize: ".62rem", fontWeight: 600, letterSpacing: ".14em", color: "var(--gold-bright)", marginTop: "3px", textTransform: "uppercase"}}>Tours &amp; Projects</small>
            </a>
            <p>Guided tours, travel planning and cultural experiences across South Africa and Africa.</p>
          </div>
          <div className="footer-col">
            <h4>EXPLORE</h4>
            <a href="/about">About</a>
            <a href="/tours">Tours &amp; safaris</a>
            <a href="/destination">Destinations</a>
            <a href="/gallery">Gallery</a>
          </div>
          <div className="footer-col">
            <h4>CONTACT</h4>
            <a href="tel:0632344970">063 234 4970</a>
            <a href="mailto:info@malikantours.co.za">info@malikantours.co.za</a>
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