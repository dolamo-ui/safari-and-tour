// @ts-nocheck
// NOTE: matches the pattern used on the home page and /tours page — the
// shared header/drawer/scroll/reveal/testimonial chrome still uses the original vanilla-DOM getElementById + classList approach (kept 1:1 with the
// source HTML's behavior) rather than React refs/state, which is why
// type-checking is disabled for this file.
"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase"; // adjust path if your firebase.js lives elsewhere

export default function ContactPage() {
  // ---- Contact form state ----
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.name === "phone" ? e.target.value.replace(/\D/g, "") : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    if (!formData.email.trim().includes("@")) {
      setSubmitError("Please enter a valid email address containing an @ sign.");
      setSubmitting(false);
      return;
    }
    try {
      await addDoc(collection(db, "contactMessages"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        status: "new", // new | read | resolved
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong sending your message. Please try again or email us directly at info@malikantours.co.za.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // ---- Nav glass effect on scroll ----
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

    // ---- Mobile drawer ----
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

    // ---- Testimonial slider ----
    const slides = document.querySelectorAll(".quote-slide");
    let current = 0;
    function showSlide(i: number) {
      if (!slides.length) return;
      slides[current]?.classList.remove("is-active");
      current = (i + slides.length) % slides.length;
      slides[current]?.classList.add("is-active");
    }
    const quoteNextBtn = document.getElementById("quoteNext");
    const quotePrevBtn = document.getElementById("quotePrev");
    const onNext = () => {
      showSlide(current + 1);
      resetAuto();
    };
    const onPrev = () => {
      showSlide(current - 1);
      resetAuto();
    };
    quoteNextBtn?.addEventListener("click", onNext);
    quotePrevBtn?.addEventListener("click", onPrev);
    let auto = setInterval(() => showSlide(current + 1), 6500);
    function resetAuto() {
      clearInterval(auto);
      auto = setInterval(() => showSlide(current + 1), 6500);
    }

    // ---- Scroll-to-top button ----
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

    // ---- Cleanup ----
    return () => {
      window.removeEventListener("scroll", onScroll);
      drawerBtn?.removeEventListener("click", openDrawer);
      closeDrawerBtn?.removeEventListener("click", closeDrawer);
      drawerOverlay?.removeEventListener("click", closeDrawer);
      document.removeEventListener("keydown", onEscape);
      drawerLinks.forEach((a) => a.removeEventListener("click", closeDrawer));
      io?.disconnect();
      quoteNextBtn?.removeEventListener("click", onNext);
      quotePrevBtn?.removeEventListener("click", onPrev);
      clearInterval(auto);
      scrollTopBtn?.removeEventListener("click", onScrollTop);
      window.removeEventListener("scroll", toggleScrollButton);
      window.removeEventListener("resize", toggleScrollButton);
    };
  }, []);

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

  {/* Main Navigation */}
  <div id="main-nav" className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-gradient-to-b from-[#14110B] to-[#0F0D0A] border-b border-[#C9A227]/10 backdrop-blur-md">
    <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-between py-4 gap-6">
      <a href="/" className="brand shrink-0 no-underline hover:opacity-80 transition-opacity" aria-label="Malikan Tours home">
        <span className="brand-mark" aria-hidden="true">
          <img src="/logo.jpg" alt="Malikan Tours logo" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
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
        <a href="/contact" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-[#C9A227] font-medium hover:text-white">CONTACT US</a>
      </div>
    </nav>
  </div>

  {/* Mobile Menu Drawer */}
  <div id="mobile-drawer" className="fixed inset-0 z-[60] xl:hidden transition-opacity duration-300 opacity-0 pointer-events-none">
    <div id="drawer-overlay" className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
    <aside id="drawer-panel" className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-gradient-to-b from-[#14110B] to-[#0F0D0A] text-white flex flex-col transition-transform duration-500 ease-out translate-x-full border-l border-[#C9A227]/20">
      <div className="flex items-center justify-between p-5 border-b border-[#C9A227]/20">
        <span className="flex items-center gap-2 text-white">
          <span className="brand-mark" style={{width: '28px', height: '28px', minWidth: '28px'}}>
            <img src="/logo.jpg" alt="Malikan Tours logo" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
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
        <a href="/contact" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-[#C9A227] font-medium hover:bg-[#C9A227]/10 rounded">CONTACT US</a>
        <a href="/booking" className="inline-flex items-center justify-center gap-2 bg-[#22c55e] text-[#0b1f0d] px-5 py-3 mt-6 text-[12px] font-semibold tracking-[0.08em] uppercase rounded-full shadow-[0_12px_30px_rgba(34,197,94,0.35)]">🟢 BOOK NOW</a>
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

{/* ==================== HERO ==================== */}
<section className="hero" id="top">
  <div className="hero-bg">
    <img src="/hero.jpg" alt="African safari landscape at golden hour" />
    <div className="hero-bg-overlay"></div>
  </div>
  <div className="hero-inner">
    <div className="hero-copy reveal">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Contact Us</span>
      </nav>
      <h1 className="h-display">Get in <em>Touch</em></h1>
      <p className="lede">Let&apos;s plan your next adventure. Whether it&apos;s a weekend escape or a cross-border journey, we&apos;re here to map it out with you.</p>
      <div className="hero-actions">
        <a href="tel:0796445310" className="btn btn-primary">Call us now <span className="btn-arrow">→</span></a>
        <a href="mailto:info@malikantours.co.za" className="btn btn-ghost on-dark">Send an email</a>
      </div>
    </div>
  </div>
</section>

{/* ==================== CONTACT SECTION ==================== */}
<section className="section" id="contact">
  <div className="wrap">
    <div className="reveal" style={{textAlign: 'center', marginBottom: '60px'}}>
      <span className="eyebrow-note">Let&apos;s Plan Your Next Adventure!</span>
      <h2 className="h-section" style={{marginTop: '16px'}}>Get in Touch</h2>
      <p className="lede" style={{marginTop: '20px', marginInline: 'auto'}}>Reach out however suits you best. We&apos;re available by phone, email, WhatsApp, or through the form below.</p>
    </div>

    <div className="contact-grid">
      {/* Contact Details */}
      <div className="contact-details reveal">
        <div className="contact-card">
          <div className="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div className="contact-info">
            <h4>Phone</h4>
            <a href="tel:0796445310">079 644 5310</a>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <div className="contact-info">
            <h4>Email</h4>
            <a href="mailto:info@malikantours.co.za">info@malikantours.co.za</a>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div className="contact-info">
            <h4>Marloth Park - Branch</h4>
            <p>1717 Kingfisher Street, Marloth Park<br />Kruger National Park, South Africa</p>
          </div>
        </div>

        <div className="contact-card whatsapp-card">
          <div className="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/></svg>
          </div>
          <div className="contact-info">
            <h4>WhatsApp</h4>
            <a href="https://wa.me/27796445310" target="_blank" rel="noopener noreferrer">+27 79 644 5310</a>
            <p style={{fontSize: '.8rem', marginTop: '4px', color: 'var(--ink-faint)'}}>Message us anytime — we reply within a few hours.</p>
          </div>
        </div>

        <div style={{padding: '24px', border: '1px solid var(--line)', borderRadius: '4px', background: 'var(--bg-warm)'}}>
          <h4 style={{fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--ink)', margin: '0 0 12px'}}>Office Hours</h4>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)', fontSize: '.9rem', color: 'var(--ink-dim)'}}>
            <span>Monday – Friday</span>
            <span style={{color: 'var(--ink)', fontWeight: 500}}>9:00 AM – 5:00 PM</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)', fontSize: '.9rem', color: 'var(--ink-dim)'}}>
            <span>Saturday</span>
            <span style={{color: 'var(--ink)', fontWeight: 500}}>By appointment</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '.9rem', color: 'var(--ink-dim)'}}>
            <span>Sunday</span>
            <span style={{color: 'var(--ink)', fontWeight: 500}}>Closed</span>
          </div>
        </div>
      </div>

      {/* Contact Form — now saves to Firestore */}
      <div className="contact-form-wrap reveal">
        {submitted ? (
          <div style={{textAlign: 'center', padding: '48px 24px'}}>
            <div style={{width: '64px', height: '64px', margin: '0 auto 20px', borderRadius: '50%', background: 'rgba(34,197,94,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 style={{fontFamily: 'var(--serif)', fontWeight: 400, fontSize: '1.5rem', color: 'var(--ink)', margin: '0 0 10px'}}>Message sent!</h3>
            <p style={{color: 'var(--ink-dim)', margin: '0 0 24px'}}>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{padding: '12px 28px', border: '1px solid var(--gold)', background: 'transparent', color: 'var(--gold)', fontWeight: 600, cursor: 'pointer', borderRadius: '2px', letterSpacing: '.05em', textTransform: 'uppercase', fontSize: '.8rem'}}
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <h3>Send us a message</h3>
            <p>Fill in the form below and we&apos;ll get back to you within 24 hours.</p>
            <form onSubmit={handleSubmit}>
              <p style={{ marginBottom: "24px" }}><strong>Fields marked with * are required</strong></p>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" placeholder="Your full name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input type="email" id="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" inputMode="numeric" pattern="[0-9]*" placeholder="0796445310" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea id="message" name="message" placeholder="Tell us about your trip idea, preferred dates, group size, and any special requests..." value={formData.message} onChange={handleChange} required></textarea>
              </div>
              {submitError && (
                <p style={{color: '#c32626', fontSize: '.85rem', margin: '0 0 12px'}}>{submitError}</p>
              )}
              <button type="submit" className="form-submit" disabled={submitting} style={{opacity: submitting ? 0.7 : 1, cursor: submitting ? 'wait' : 'pointer'}}>
                {submitting ? "Sending…" : <>Send Message <span>→</span></>}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  </div>
</section>

{/* ==================== GOOGLE MAP ==================== */}
<section className="map-section">
  <iframe
    className="map-frame"
    src="https://www.google.com/maps?q=1717+Kingfisher+Street,+Marloth+Park,+Kruger+National+Park&output=embed"
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Malikan Tours branch location in Marloth Park, Kruger National Park"
  ></iframe>
</section>

{/* ==================== REVIEWS / TESTIMONIALS ==================== */}
<section className="section" id="stories" style={{background: 'linear-gradient(135deg, rgba(169,121,28,.05), rgba(201,162,39,.03))'}}>
  <div className="wrap testimonial-wrap">
    <div className="testimonial-head reveal">
      <span className="eyebrow-note">What travellers say</span>
      <h2 className="h-display" style={{marginTop: '14px'}}>Real trips, real feedback.</h2>
      <p>Stories from people who let us plan the route.</p>
      <div className="testimonial-nav">
        <button id="quotePrev" aria-label="Previous testimonial">←</button>
        <button id="quoteNext" aria-label="Next testimonial">→</button>
      </div>
    </div>
    <div className="quote-card reveal">
      <div className="quote-slide is-active">
        <blockquote>&quot;Malikan mapped out a route through Mpumalanga that hit every waterfall we wanted and none of the traffic. It felt planned by someone who actually goes there, not a brochure.&quot;</blockquote>
        <div className="who"><div className="avatar">N</div><div><div className="name">Naledi M.</div><div className="role">Family trip, Blyde River Canyon</div></div></div>
      </div>
      <div className="quote-slide">
        <blockquote>&quot;We booked the cultural tour expecting a quick stop and got a full afternoon of conversation with people who actually live there. That&apos;s the difference a local guide makes.&quot;</blockquote>
        <div className="who"><div className="avatar">K</div><div><div className="name">Kagiso T.</div><div className="role">Weekend group tour, Soweto</div></div></div>
      </div>
      <div className="quote-slide">
        <blockquote>&quot;Crossing into Victoria Falls felt intimidating to plan alone. Malikan Tours handled the permits, the transfers, and the pacing — we just showed up and travelled.&quot;</blockquote>
        <div className="who"><div className="avatar">S</div><div><div className="name">Sipho D.</div><div className="role">Cross-border trip, Zimbabwe</div></div></div>
      </div>
    </div>
  </div>
</section>

{/* ==================== FOOTER ==================== */}
<footer className="site-footer" style={{backgroundImage: 'linear-gradient(135deg, rgba(20,17,11,.92), rgba(20,17,11,.88)), url(\'/gallery7.jpg\')', backgroundPosition: 'center', backgroundSize: 'cover', backgroundAttachment: 'fixed'}}>
  <div className="wrap footer-grid">
    <div className="footer-brand">
      <a href="/" className="brand" style={{fontFamily: 'var(--serif)', fontSize: '1.25rem', letterSpacing: '.01em', display: 'flex', flexDirection: 'column', lineHeight: '1.1', color: '#fff'}}>
        Malikan&nbsp;Tours
        <small style={{fontFamily: 'var(--sans)', fontSize: '.62rem', fontWeight: 600, letterSpacing: '.14em', color: 'var(--gold-bright)', marginTop: '3px', textTransform: 'uppercase'}}>Tours &amp; Projects</small>
      </a>
      <p>Guided tours, travel planning and cultural experiences across South Africa and Africa — built around real budgets and real routes.</p>
    </div>
    <div className="footer-col">
      <h4>EXPLORE</h4>
      <a href="/#about">About</a>
      <a href="/#journey">The journey</a>
      <a href="/#guide">Your guide</a>
      <a href="/#stories">Stories</a>
    </div>
    <div className="footer-col">
      <h4>SERVICES</h4>
      <a href="/#journey">Guided tours</a>
      <a href="/#journey">Travel planning</a>
      <a href="/#journey">Cultural experiences</a>
      <a href="/#journey">Accommodation</a>
    </div>
    <div className="footer-col">
      <h4>CONTACT</h4>
      <a href="tel:0796445310">079 644 5310</a>
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