// @ts-nocheck
// NOTE: this file mixes React with the site's original vanilla-DOM hover/click
// handlers (querySelector + .style mutation) so behavior matches the source
// HTML exactly. That inline DOM style is why type-checking is disabled here —
// feel free to refactor these handlers to CSS/Tailwind hover states later.
"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // ---- Nav glass effect on scroll ----
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

    // ---- Marquee: duplicate track for seamless loop ----
    const track = document.getElementById("marqueeTrack");
    if (track && !track.dataset.doubled) {
      track.innerHTML += track.innerHTML;
      track.dataset.doubled = "true";
    }

    // ---- Animated stat counters ----
    const stats = document.querySelectorAll("[data-count]");
    let statIO: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      statIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const target = parseInt(el.getAttribute("data-count") || "0", 10);
            let start: number | null = null;
            const duration = 1400;
            function step(ts: number) {
              if (start === null) start = ts;
              const progress = Math.min((ts - (start as number)) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target) + (progress >= 1 ? "+" : "");
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            statIO?.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      stats.forEach((el) => statIO?.observe(el));
    } else {
      stats.forEach((el) => {
        el.textContent = el.getAttribute("data-count") + "+";
      });
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

    // ---- Hero image rotation ----
    const heroImage = document.getElementById("heroImage") as HTMLImageElement | null;
    const heroImages = ["/hero.jpg", "/hero2.jpg", "/hero3.jpg"];
    let heroIndex = 0;
    let heroTimer: ReturnType<typeof setInterval> | undefined;
    if (heroImage) {
      heroTimer = setInterval(() => {
        heroIndex = (heroIndex + 1) % heroImages.length;
        heroImage.style.transition = "opacity 0.5s ease-in-out";
        heroImage.style.opacity = "0";
        setTimeout(() => {
          heroImage.src = heroImages[heroIndex];
          heroImage.style.opacity = "1";
        }, 250);
      }, 10000);
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
      statIO?.disconnect();
      quoteNextBtn?.removeEventListener("click", onNext);
      quotePrevBtn?.removeEventListener("click", onPrev);
      clearInterval(auto);
      if (heroTimer) clearInterval(heroTimer);
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
        <a href="/" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-[#C9A227] font-medium hover:text-white">HOME</a>
        <a href="/tours" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">TOURS &amp; SAFARIS</a>
        <a href="/destination" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">DESTINATIONS</a>
        <a href="/about" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">ABOUT US</a>
        <a href="/gallery" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">GALLERY</a>
        <a href="#stories" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">REVIEWS</a>
        <a href="#contact" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">CONTACT US</a>
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
        <a href="/" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-[#C9A227] font-medium hover:bg-[#C9A227]/10 rounded">HOME</a>
        <a href="/tours" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">TOURS &amp; SAFARIS</a>
        <a href="/destination" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">DESTINATIONS</a>
        <a href="/about" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">ABOUT US</a>
        <a href="/gallery" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">GALLERY</a>
        <a href="#stories" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">REVIEWS</a>
        <a href="#contact" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">CONTACT US</a>
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

<section className="hero" id="top">
  <div className="hero-bg">
    <img id="heroImage" src="/hero.jpg" alt="African safari landscape at golden hour" />
    <div className="hero-bg-overlay"></div>
  </div>
  <div className="hero-inner">
    <div className="hero-copy reveal">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Travel Southern Africa</span>
      </nav>
      <h1 className="h-display">Africa, told by<br />someone who's <em>walked it.</em></h1>
      <p className="lede">Malikan Tours designs journeys across South Africa and the wider continent — grounded in fourteen years of guiding, real relationships with local communities, and prices built for the everyday traveller.</p>
      <div className="hero-actions">
        <a href="/booking" className="btn btn-primary">Book a tour <span className="btn-arrow">→</span></a>
        <a href="/" className="btn btn-ghost on-dark">Explore more</a>
      </div>
    </div>
  </div>
</section>

<div className="marquee" aria-hidden="true">
  <div className="marquee-track" id="marqueeTrack">
    <span><b>01</b>Kruger National Park</span>
    <span><b>02</b>Cape Winelands</span>
    <span><b>03</b>Drakensberg</span>
    <span><b>04</b>Victoria Falls</span>
    <span><b>05</b>Soweto</span>
    <span><b>06</b>Blyde River Canyon</span>
    <span><b>07</b>Mpumalanga</span>
    <span><b>08</b>Zanzibar</span>
  </div>
</div>

<section className="section" id="about">
  <div className="wrap intro">
    <div className="reveal">
      <div className="intro-label"><span className="dot"></span> Who we are</div>
      <h2 className="h-display">Tourism, built as an everyday part of life — not a once-off luxury.</h2>
    </div>
    <div className="intro-body reveal">
      <p>Malikan Tours and Projects was founded on a simple belief: seeing your own country, and the continent around it, shouldn't feel out of reach. We plan trips the way we'd plan them for family — honest pricing, routes that make sense, and guides who actually know the ground.</p>
      <p>From weekend escapes in the Cape Winelands to multi-day crossings into Zimbabwe and Zambia, every itinerary is shaped around who's travelling, not a fixed package pulled off a shelf.</p>
      <div className="signature">Malikan
        <small>Founder &amp; Lead Tourist Guide</small>
      </div>
    </div>
  </div>
</section>

<hr className="divider" />

<section className="section" id="journey" style={{background: 'linear-gradient(135deg, rgba(20,17,11,.88), rgba(20,17,11,.92)), url(\'/background.jpg\') center/cover no-repeat', backgroundSize: 'cover', backgroundAttachment: 'fixed', minHeight: 'auto'}}>
  <div className="wrap journey-wrap">
    <div className="journey-head reveal">
      <h2 className="h-section">Every trip starts with a route.</h2>
      <p className="lede">Five thoughtful steps, from the first call to the last memorable moment.</p>
    </div>

    <div className="journey-grid">
      <article className="journey-item reveal">
        <div className="journey-number">01</div>
        <div className="journey-copy">
          <h3>Guided tours</h3>
          <p>Led in person, on the ground — game drives, heritage routes and walking experiences shaped by local knowledge.</p>
        </div>
      </article>

      <article className="journey-item reveal">
        <div className="journey-number">02</div>
        <div className="journey-copy">
          <h3>Accommodation services</h3>
          <p>Comfortable stays selected for the right fit — quality, location, and value that makes the entire journey feel easy.</p>
        </div>
      </article>

      <article className="journey-item reveal">
        <div className="journey-number">03</div>
        <div className="journey-copy">
          <h3>Cultural experiences</h3>
          <p>Meaningful encounters with local culture, stories and communities delivered with care, respect and real understanding.</p>
        </div>
      </article>

      <article className="journey-item reveal">
        <div className="journey-number">04</div>
        <div className="journey-copy">
          <h3>Travel planning</h3>
          <p>Transfers, itineraries and timing worked out before you travel, so every part of the route feels smooth and intentional.</p>
        </div>
      </article>

      <article className="journey-item reveal" style={{gridColumn: '1 / -1'}}>
        <div className="journey-number">05</div>
        <div className="journey-copy">
          <h3>Adventure activities</h3>
          <p>Hikes, excursions and outdoor moments chosen to match your pace and comfort level — exciting, but never forced.</p>
        </div>
      </article>
    </div>
  </div>
</section>

<section className="section" style={{background: 'linear-gradient(135deg, rgba(169,121,28,.08), rgba(201,162,39,.04))'}}>
  <div className="wrap">
    <div className="reveal" style={{textAlign: 'center', marginBottom: '60px'}}>
      <span className="eyebrow-note">Our best-selling experiences</span>
      <h2 className="h-section" style={{marginTop: '16px'}}>Featured Tours &amp; Packages</h2>
      <p className="lede" style={{marginTop: '20px'}}>Handpicked journeys that blend adventure, culture, and comfort. Each itinerary crafted from years on the ground.</p>
    </div>

    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '34px', marginBottom: '50px'}}>
      {/* Tour Card 4 */}
      <div className="reveal" style={{background: '#fff', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--line)', transition: 'all .4s cubic-bezier(.2,.8,.2,1)', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow='0 16px 32px rgba(20,17,11,.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(20,17,11,.06)'; }}>
        <div style={{position: 'relative', height: '240px', overflow: 'hidden', background: 'linear-gradient(135deg, #14110B, #1D1811)'}}>
          <img src="/hero.jpg" alt="Sun City & Nature Getaway" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s ease'}} onMouseOver={(e) => { e.currentTarget.style.transform='scale(1.08)'; }} onMouseOut={(e) => { e.currentTarget.style.transform='scale(1)'; }} />
          <div style={{position: 'absolute', top: '16px', right: '16px', background: 'var(--gold)', color: '#fff', padding: '8px 14px', borderRadius: '3px', fontSize: '.75rem', fontWeight: '600', letterSpacing: '.05em'}}>LUXURY ESCAPE</div>
        </div>
        <div style={{padding: '28px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px'}}>
            <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.35rem', color: 'var(--ink)', margin: '0', flex: '1'}}>Sun City &amp; Nature Getaway</h3>
            <div style={{display: 'flex', gap: '3px', color: 'var(--gold)', fontSize: '.8rem'}}>
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
          </div>
          <p style={{color: 'var(--ink-faint)', fontSize: '.88rem', margin: '0 0 16px 0', fontStyle: 'italic'}}>Luxury Escape into Leisure &amp; Wildlife</p>
          <div style={{padding: '0 0 16px', marginBottom: '16px', borderBottom: '1px solid var(--line)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '.9rem', color: 'var(--ink)'}}>
              <span>2 Days &amp; 1 Night</span>
              <strong style={{color: 'var(--gold)', fontFamily: 'var(--serif)'}}>R 4 000 pp</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '.9rem', color: 'var(--ink)'}}>
              <span>3 Days &amp; 2 Nights</span>
              <strong style={{color: 'var(--gold)', fontFamily: 'var(--serif)'}}>R 6 000 pp</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '.9rem', color: 'var(--ink)'}}>
              <span>4 Days &amp; 3 Nights</span>
              <strong style={{color: 'var(--gold)', fontFamily: 'var(--serif)'}}>R 8 000 pp</strong>
            </div>
          </div>
          <div style={{color: 'var(--ink-dim)', fontSize: '.83rem', lineHeight: '1.7', marginBottom: '20px'}}>
            <div><strong style={{color: 'var(--ink)'}}>The Kingdom Resort, Sun City</strong> <span style={{color: 'var(--ink-faint)'}}>(Standard Room – Bed &amp; Breakfast)</span></div>
            <div>• Sun City Resort access &amp; Valley of Waves</div>
            <div>• Half-day safari at Pilanesberg Nature Reserve</div>
            <div>• Accommodation with breakfast included</div>
            <div>• Return transport <span style={{color: 'var(--ink-faint)'}}>(Pick-up at selected malls across Gauteng)</span></div>
          </div>
          <a href="/tours" style={{display: 'inline-flex', alignItems: 'center', gap: '.5em', background: 'var(--gold)', color: '#fff', padding: '.75em 1.4em', borderRadius: '2px', fontFamily: 'var(--sans)', fontWeight: '600', fontSize: '.9rem', textDecoration: 'none', transition: 'all .3s', border: '1px solid var(--gold)'}} onMouseOver={(e) => { e.currentTarget.style.backgroundColor='#8f671a'; e.currentTarget.style.transform='translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor='var(--gold)'; e.currentTarget.style.transform='translateY(0)'; }}>View Package <span>→</span></a>
        </div>
      </div>

      {/* Tour Card 5 */}
      <div className="reveal" style={{background: '#fff', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--line)', transition: 'all .4s cubic-bezier(.2,.8,.2,1)', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow='0 16px 32px rgba(20,17,11,.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(20,17,11,.06)'; }}>
        <div style={{position: 'relative', height: '240px', overflow: 'hidden', background: 'linear-gradient(135deg, #14110B, #1D1811)'}}>
          <img src="/hero2.jpg" alt="Qwa Qwa Retreat" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s ease'}} onMouseOver={(e) => { e.currentTarget.style.transform='scale(1.08)'; }} onMouseOut={(e) => { e.currentTarget.style.transform='scale(1)'; }} />
          <div style={{position: 'absolute', top: '16px', right: '16px', background: 'rgba(169,121,28,.9)', color: '#fff', padding: '8px 14px', borderRadius: '3px', fontSize: '.75rem', fontWeight: '600', letterSpacing: '.05em'}}>CULTURAL RETREAT</div>
        </div>
        <div style={{padding: '28px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px'}}>
            <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.35rem', color: 'var(--ink)', margin: '0', flex: '1'}}>Qwa Qwa Retreat</h3>
            <div style={{display: 'flex', gap: '3px', color: 'var(--gold)', fontSize: '.8rem'}}>
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
          </div>
          <p style={{color: 'var(--ink-faint)', fontSize: '.88rem', margin: '0 0 16px 0', fontStyle: 'italic'}}>(Lefatshe la basotho)</p>
          <div style={{padding: '0 0 16px', marginBottom: '16px', borderBottom: '1px solid var(--line)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '.9rem', color: 'var(--ink)'}}>
              <span>3 Days &amp; 2 Nights</span>
              <strong style={{color: 'var(--gold)', fontFamily: 'var(--serif)'}}>R 5 500 pp</strong>
            </div>
          </div>
          <div style={{color: 'var(--ink-dim)', fontSize: '.83rem', lineHeight: '1.7', marginBottom: '20px'}}>
            <div><strong style={{color: 'var(--ink)'}}>Kaira Lodge</strong></div>
            <div>• Half-day tour of Basotho Cultural Village</div>
            <div>• Golden Gate Highlands Game Park</div>
            <div>• Abseiling &amp; Canoeing <span style={{color: 'var(--ink-faint)'}}>(seasonal)</span></div>
            <div>• Guided Hiking</div>
            <div>• Return transport <span style={{color: 'var(--ink-faint)'}}>(Pick-up at agreed malls in Gauteng &amp; Clarens area, Freestate)</span></div>
          </div>
          <a href="/tours" style={{display: 'inline-flex', alignItems: 'center', gap: '.5em', background: 'var(--gold)', color: '#fff', padding: '.75em 1.4em', borderRadius: '2px', fontFamily: 'var(--sans)', fontWeight: '600', fontSize: '.9rem', textDecoration: 'none', transition: 'all .3s', border: '1px solid var(--gold)'}} onMouseOver={(e) => { e.currentTarget.style.backgroundColor='#8f671a'; e.currentTarget.style.transform='translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor='var(--gold)'; e.currentTarget.style.transform='translateY(0)'; }}>View Package <span>→</span></a>
        </div>
      </div>

      {/* Tour Card 6 */}
      <div className="reveal" style={{background: '#fff', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--line)', transition: 'all .4s cubic-bezier(.2,.8,.2,1)', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.style.transform='translateY(-8px)'; e.currentTarget.style.boxShadow='0 16px 32px rgba(20,17,11,.15)'; }} onMouseOut={(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(20,17,11,.06)'; }}>
        <div style={{position: 'relative', height: '240px', overflow: 'hidden', background: 'linear-gradient(135deg, #14110B, #1D1811)'}}>
          <img src="/hero3.jpg" alt="Mpumalanga Retreat" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s ease'}} onMouseOver={(e) => { e.currentTarget.style.transform='scale(1.08)'; }} onMouseOut={(e) => { e.currentTarget.style.transform='scale(1)'; }} />
          <div style={{position: 'absolute', top: '16px', right: '16px', background: 'rgba(169,121,28,.9)', color: '#fff', padding: '8px 14px', borderRadius: '3px', fontSize: '.75rem', fontWeight: '600', letterSpacing: '.05em'}}>SCENIC GETAWAY</div>
        </div>
        <div style={{padding: '28px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px'}}>
            <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.35rem', color: 'var(--ink)', margin: '0', flex: '1'}}>Mpumalanga Retreat</h3>
            <div style={{display: 'flex', gap: '3px', color: 'var(--gold)', fontSize: '.8rem'}}>
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
          </div>
          <p style={{color: 'var(--ink-faint)', fontSize: '.88rem', margin: '0 0 16px 0', fontStyle: 'italic'}}>(Place of the Rising Sun)</p>
          <div style={{padding: '0 0 16px', marginBottom: '16px', borderBottom: '1px solid var(--line)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '.9rem', color: 'var(--ink)'}}>
              <span>3 Days &amp; 2 Nights</span>
              <strong style={{color: 'var(--gold)', fontFamily: 'var(--serif)'}}>R 5 500 pp</strong>
            </div>
          </div>
          <div style={{color: 'var(--ink-dim)', fontSize: '.83rem', lineHeight: '1.7', marginBottom: '20px'}}>
            <div><strong style={{color: 'var(--ink)'}}>Accommodation at or near Graskop</strong></div>
            <div>• Half-day tour of Kruger National Park</div>
            <div>• Panoramic Route exploration</div>
            <div>• 3 Rondavels &amp; God's Window views</div>
            <div>• Graskop Big Swing experience</div>
            <div>• Return transport <span style={{color: 'var(--ink-faint)'}}>(Pick-up across selective malls in Gauteng)</span></div>
          </div>
          <a href="/tours" style={{display: 'inline-flex', alignItems: 'center', gap: '.5em', background: 'var(--gold)', color: '#fff', padding: '.75em 1.4em', borderRadius: '2px', fontFamily: 'var(--sans)', fontWeight: '600', fontSize: '.9rem', textDecoration: 'none', transition: 'all .3s', border: '1px solid var(--gold)'}} onMouseOver={(e) => { e.currentTarget.style.backgroundColor='#8f671a'; e.currentTarget.style.transform='translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor='var(--gold)'; e.currentTarget.style.transform='translateY(0)'; }}>View Package <span>→</span></a>
        </div>
      </div>
    </div>

    <div className="reveal" style={{textAlign: 'center'}}>
      <a href="/tours" style={{display: 'inline-flex', alignItems: 'center', gap: '.6em', padding: '1.1em 2em', border: '2px solid var(--gold)', background: 'transparent', color: 'var(--gold)', fontFamily: 'var(--sans)', fontWeight: '600', fontSize: '.95rem', textDecoration: 'none', borderRadius: '2px', transition: 'all .35s cubic-bezier(.2,.8,.2,1)'}} onMouseOver={(e) => { e.currentTarget.style.backgroundColor='var(--gold)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='var(--gold)'; e.currentTarget.style.transform='translateY(0)'; }}>Explore all tours <span style={{transition: 'transform .35s cubic-bezier(.2,.8,.2,1)'}}>→</span></a>
    </div>
  </div>
</section>

<section className="section" id="guide">
  <div className="wrap founder">
    <div className="founder-portrait reveal">
      <img src="/image.JPG" alt="Malikan, founder and lead tourist guide of Malikan Tours" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
      <div className="badge"><span className="num">14+</span><span className="label">Years in tourism</span></div>
    </div>
    <div className="founder-copy reveal">
      <span className="kicker">Your guide</span>
      <h2 className="h-display">Meet Malikan — the person behind every itinerary.</h2>
      <p>Malikan trained formally in tourism before spending over a decade guiding across Southern Africa. He was named Tourist Guide of the Year in 2012, volunteered at both the 2009 FIFA Confederations Cup and the 2010 FIFA World Cup, and remains a CATHSSETA-accredited assessor for tourist guiding.</p>
      <p>In 2019 he was featured among the Sowetan's Top 100 Young Bosses, and in August 2020 spoke to eNCA about how the COVID-19 lockdown reshaped South African tourism from the ground up.</p>
      <ul className="timeline">
        <li><span className="yr">2009 – 2010</span><p>Volunteered at the FIFA Confederations Cup and FIFA World Cup, working directly with visiting fans and delegations.</p></li>
        <li><span className="yr">2012</span><p>Recognised as an award-winning tourist guide for service across the region.</p></li>
        <li><span className="yr">2019</span><p>Featured in the Sowetan's Top 100 Young Bosses for building Malikan Tours from the ground up.</p></li>
        <li><span className="yr">2020</span><p>Interviewed by eNCA on the impact of the COVID-19 lockdown on local tourism and guiding livelihoods.</p></li>
        <li><span className="yr">Ongoing</span><p>CATHSSETA-accredited assessor for the National Higher Certificate in Tourist Guiding, Level 2.</p></li>
      </ul>
    </div>
  </div>
</section>

<section className="section-tight" style={{background: 'linear-gradient(135deg, rgba(20,17,11,.88), rgba(20,17,11,.92)), url(\'/background.jpg\') center/cover no-repeat fixed', minHeight: 'auto'}}>
  <div className="wrap">
    <div className="reveal" style={{marginBottom: '50px'}}>
      <h2 className="h-section">What guides every trip we build.</h2>
    </div>
  </div>
  <div className="wrap" style={{paddingInline: 'var(--pad)'}}>
    <div className="values reveal">
      <div className="value-item">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/></svg>
        <span className="idx">Mission</span>
        <h3>Make travel a habit, not an event</h3>
        <p>We plan for real budgets and real schedules, so exploring your own region becomes something you do often, not once a decade.</p>
      </div>
      <div className="value-item">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/><circle cx="12" cy="8" r="4"/></svg>
        <span className="idx">Vision</span>
        <h3>Local expertise, continental reach</h3>
        <p>To be known across Southern Africa for guiding that opens doors — the kind of access you can't book from a search engine.</p>
      </div>
      <div className="value-item">
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.4"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>
        <span className="idx">Values</span>
        <h3>Integrity over upsell</h3>
        <p>Every recommendation — a stay, a route, an activity — is one we'd genuinely make to family. Nothing added just to pad the bill.</p>
      </div>
    </div>
  </div>
</section>

<section className="stats-band">
  <div className="wrap section-tight">
    <div className="stats-grid">
      <div className="stat reveal"><h3 data-count="14">0</h3><p>Years of guiding experience</p></div>
      <div className="stat reveal"><h3 data-count="500">0</h3><p>Travellers guided and counting</p></div>
      <div className="stat reveal"><h3 data-count="20">0</h3><p>Destinations across the region</p></div>
      <div className="stat reveal"><h3 data-count="100">0</h3><p>Custom itineraries built to date</p></div>
    </div>
  </div>
</section>

<section className="section" id="stories">
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
        <blockquote>"Malikan mapped out a route through Mpumalanga that hit every waterfall we wanted and none of the traffic. It felt planned by someone who actually goes there, not a brochure."</blockquote>
        <div className="who"><div className="avatar">N</div><div><div className="name">Naledi M.</div><div className="role">Family trip, Blyde River Canyon</div></div></div>
      </div>
      <div className="quote-slide">
        <blockquote>"We booked the cultural tour expecting a quick stop and got a full afternoon of conversation with people who actually live there. That's the difference a local guide makes."</blockquote>
        <div className="who"><div className="avatar">K</div><div><div className="name">Kagiso T.</div><div className="role">Weekend group tour, Soweto</div></div></div>
      </div>
      <div className="quote-slide">
        <blockquote>"Crossing into Victoria Falls felt intimidating to plan alone. Malikan Tours handled the permits, the transfers, and the pacing — we just showed up and travelled."</blockquote>
        <div className="who"><div className="avatar">S</div><div><div className="name">Sipho D.</div><div className="role">Cross-border trip, Zimbabwe</div></div></div>
      </div>
    </div>
  </div>
</section>

<section className="section" style={{background: '#fff', overflow: 'hidden'}}>
  <div className="wrap">
    <div className="reveal" style={{textAlign: 'center', marginBottom: '60px'}}>
      <span className="eyebrow-note">Visual Stories</span>
      <h2 className="h-section" style={{marginTop: '16px'}}>Gallery &amp; Travel Moments</h2>
      <p className="lede" style={{marginTop: '20px'}}>Real travelers, real moments. See the journey through the eyes of those who've walked it with us.</p>
    </div>

    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px'}}>
      {/* Gallery Item 1 */}
      <div className="reveal" style={{position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1.12)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='1'; }} onMouseOut={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='0'; }}>
        <img src="/gallery.jpg" alt="Safari game drive with wildlife" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s cubic-bezier(.2,.8,.2,1)'}} />
        <div data-overlay style={{position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(169,121,28,.85), rgba(20,17,11,.75))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: '0', transition: 'opacity .4s'}} >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="15" x="1" y="5" rx="2" ry="2"/></svg>
          <span style={{color: '#fff', fontSize: '.85rem', fontWeight: '600', letterSpacing: '.04em'}}>GAME DRIVE</span>
        </div>
      </div>

      {/* Gallery Item 2 */}
      <div className="reveal" style={{position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1.12)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='1'; }} onMouseOut={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='0'; }}>
        <img src="/gallery1.jpg" alt="Vineyard experience in Cape Winelands" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s cubic-bezier(.2,.8,.2,1)'}} />
        <div data-overlay style={{position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(169,121,28,.85), rgba(20,17,11,.75))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: '0', transition: 'opacity .4s'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"/><path d="M9 22H4c-1 0-2-1-2-2V6c0-1 1-2 2-2h16c1 0 2 1 2 2v10"/></svg>
          <span style={{color: '#fff', fontSize: '.85rem', fontWeight: '600', letterSpacing: '.04em'}}>WINE TASTING</span>
        </div>
      </div>

      {/* Gallery Item 3 */}
      <div className="reveal" style={{position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1.12)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='1'; }} onMouseOut={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='0'; }}>
        <img src="/gallery2.jpg" alt="Mountain hiking adventure in Drakensberg" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s cubic-bezier(.2,.8,.2,1)'}} />
        <div data-overlay style={{position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(169,121,28,.85), rgba(20,17,11,.75))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: '0', transition: 'opacity .4s'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 10.26 24 12.52 18 17.74 19.54 26.87 12 23.13 4.46 26.87 6 17.74 0 12.52 8.91 10.26 12 2"/></svg>
          <span style={{color: '#fff', fontSize: '.85rem', fontWeight: '600', letterSpacing: '.04em'}}>MOUNTAIN TREK</span>
        </div>
      </div>

      {/* Gallery Item 4 */}
      <div className="reveal" style={{position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1.12)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='1'; }} onMouseOut={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='0'; }}>
        <img src="/gallery3.jpg" alt="Cultural township experience" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s cubic-bezier(.2,.8,.2,1)'}} />
        <div data-overlay style={{position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(169,121,28,.85), rgba(20,17,11,.75))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: '0', transition: 'opacity .4s'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span style={{color: '#fff', fontSize: '.85rem', fontWeight: '600', letterSpacing: '.04em'}}>CULTURAL TOUR</span>
        </div>
      </div>

      {/* Gallery Item 5 */}
      <div className="reveal" style={{position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1.12)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='1'; }} onMouseOut={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='0'; }}>
        <img src="/gallery4.jpg" alt="Sunset view from accommodation" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s cubic-bezier(.2,.8,.2,1)'}} />
        <div data-overlay style={{position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(169,121,28,.85), rgba(20,17,11,.75))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: '0', transition: 'opacity .4s'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <span style={{color: '#fff', fontSize: '.85rem', fontWeight: '600', letterSpacing: '.04em'}}>GOLDEN HOUR</span>
        </div>
      </div>

      {/* Gallery Item 6 */}
      <div className="reveal" style={{position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1.12)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='1'; }} onMouseOut={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='0'; }}>
        <img src="/gallery5.jpg" alt="Adventure landscape moment" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s cubic-bezier(.2,.8,.2,1)'}} />
        <div data-overlay style={{position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(169,121,28,.85), rgba(20,17,11,.75))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: '0', transition: 'opacity .4s'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span style={{color: '#fff', fontSize: '.85rem', fontWeight: '600', letterSpacing: '.04em'}}>LANDSCAPE</span>
        </div>
      </div>

      {/* Gallery Item 7 */}
      <div className="reveal" style={{position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1.12)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='1'; }} onMouseOut={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='0'; }}>
        <img src="/gallery6.jpg" alt="Local community interaction" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s cubic-bezier(.2,.8,.2,1)'}} />
        <div data-overlay style={{position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(169,121,28,.85), rgba(20,17,11,.75))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: '0', transition: 'opacity .4s'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 19a6 6 0 0 0-12 0"/><circle cx="8" cy="9" r="4"/><path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8"/></svg>
          <span style={{color: '#fff', fontSize: '.85rem', fontWeight: '600', letterSpacing: '.04em'}}>EXPERIENCE</span>
        </div>
      </div>

      {/* Gallery Item 8 */}
      <div className="reveal" style={{position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: '4px', cursor: 'pointer'}} onMouseOver={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1.12)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='1'; }} onMouseOut={(e) => { e.currentTarget.querySelector('img').style.transform='scale(1)'; e.currentTarget.querySelector('[data-overlay]').style.opacity='0'; }}>
        <img src="/gallery7.jpg" alt="Nature and wildlife showcase" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .6s cubic-bezier(.2,.8,.2,1)'}} />
        <div data-overlay style={{position: 'absolute', inset: '0', background: 'linear-gradient(135deg, rgba(169,121,28,.85), rgba(20,17,11,.75))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: '0', transition: 'opacity .4s'}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span style={{color: '#fff', fontSize: '.85rem', fontWeight: '600', letterSpacing: '.04em'}}>WILDLIFE</span>
        </div>
      </div>

    </div>

    <div className="reveal" style={{textAlign: 'center'}}>
      <p style={{color: 'var(--ink-dim)', fontSize: '.95rem', marginBottom: '24px'}}>Follow us on Instagram for daily updates and real-time travel moments</p>
      <a href="https://www.instagram.com/explore/tags/sitepad/" target="_blank" style={{display: 'inline-flex', alignItems: 'center', gap: '.6em', padding: '1.1em 2em', border: '2px solid var(--gold)', background: 'transparent', color: 'var(--gold)', fontFamily: 'var(--sans)', fontWeight: '600', fontSize: '.95rem', textDecoration: 'none', borderRadius: '2px', transition: 'all .35s cubic-bezier(.2,.8,.2,1)'}} onMouseOver={(e) => { e.currentTarget.style.backgroundColor='var(--gold)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='var(--gold)'; e.currentTarget.style.transform='translateY(0)'; }}>Follow on Instagram <span style={{transition: 'transform .35s cubic-bezier(.2,.8,.2,1)'}}>→</span></a>
    </div>
  </div>
</section>

<section className="section" style={{background: 'linear-gradient(135deg, rgba(169,121,28,.05), rgba(201,162,39,.03))'}}>
  <div className="wrap">
    <div className="reveal" style={{textAlign: 'center', marginBottom: '60px'}}>
      <span className="eyebrow-note">Got questions?</span>
      <h2 className="h-section" style={{marginTop: '16px'}}>Frequently Asked Questions</h2>
      <p className="lede" style={{marginTop: '20px'}}>Answers to the questions that matter most when planning your journey with us.</p>
    </div>

    <div style={{maxWidth: '820px', margin: '0 auto'}}>
      {/* FAQ Item 1 */}
      <div className="reveal" style={{marginBottom: '20px', background: '#fff', border: '1px solid var(--line)', borderRadius: '4px', overflow: 'hidden', transition: 'all .3s'}}>
        <button className="faq-button" style={{width: '100%', padding: '24px', textAlign: 'left', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .3s'}} onClick={(e) => { e.currentTarget.parentElement.classList.toggle('faq-open'); e.currentTarget.parentElement.style.boxShadow = e.currentTarget.parentElement.classList.contains('faq-open') ? '0 8px 24px rgba(20,17,11,.12)' : '0 2px 8px rgba(20,17,11,.06)'; }}>
          <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)', margin: '0', flex: '1'}}>What's included in the tour price?</h3>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold-soft)', color: 'var(--gold)', fontWeight: '600', transition: 'transform .3s', transform: 'rotate(0deg)'}}>+</span>
        </button>
        <div className="faq-content" style={{display: 'none', padding: '0 24px 24px', borderTop: '1px solid var(--line)'}}>
          <p style={{color: 'var(--ink-dim)', margin: '0', lineHeight: '1.8'}}>Every itinerary is transparent. All tours include accommodation, meals (as specified), ground transport, and local guiding. Activities and entrance fees are detailed upfront — you'll know exactly what you're paying for before you book, with no hidden costs added later.</p>
        </div>
      </div>

      {/* FAQ Item 2 */}
      <div className="reveal" style={{marginBottom: '20px', background: '#fff', border: '1px solid var(--line)', borderRadius: '4px', overflow: 'hidden', transition: 'all .3s'}}>
        <button className="faq-button" style={{width: '100%', padding: '24px', textAlign: 'left', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .3s'}} onClick={(e) => { e.currentTarget.parentElement.classList.toggle('faq-open'); e.currentTarget.parentElement.style.boxShadow = e.currentTarget.parentElement.classList.contains('faq-open') ? '0 8px 24px rgba(20,17,11,.12)' : '0 2px 8px rgba(20,17,11,.06)'; }}>
          <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)', margin: '0', flex: '1'}}>How far in advance should I book?</h3>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold-soft)', color: 'var(--gold)', fontWeight: '600', transition: 'transform .3s', transform: 'rotate(0deg)'}}>+</span>
        </button>
        <div className="faq-content" style={{display: 'none', padding: '0 24px 24px', borderTop: '1px solid var(--line)'}}>
          <p style={{color: 'var(--ink-dim)', margin: '0', lineHeight: '1.8'}}>Ideally 4-6 weeks ahead. This gives us time to arrange the best accommodation, permits, and coordinate with local partners. That said, if you're flexible on dates or destinations, we can often work with shorter notice — just call us at 079 644 5310 and we'll see what's possible.</p>
        </div>
      </div>

      {/* FAQ Item 3 */}
      <div className="reveal" style={{marginBottom: '20px', background: '#fff', border: '1px solid var(--line)', borderRadius: '4px', overflow: 'hidden', transition: 'all .3s'}}>
        <button className="faq-button" style={{width: '100%', padding: '24px', textAlign: 'left', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .3s'}} onClick={(e) => { e.currentTarget.parentElement.classList.toggle('faq-open'); e.currentTarget.parentElement.style.boxShadow = e.currentTarget.parentElement.classList.contains('faq-open') ? '0 8px 24px rgba(20,17,11,.12)' : '0 2px 8px rgba(20,17,11,.06)'; }}>
          <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)', margin: '0', flex: '1'}}>What's your cancellation policy?</h3>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold-soft)', color: 'var(--gold)', fontWeight: '600', transition: 'transform .3s', transform: 'rotate(0deg)'}}>+</span>
        </button>
        <div className="faq-content" style={{display: 'none', padding: '0 24px 24px', borderTop: '1px solid var(--line)'}}>
          <p style={{color: 'var(--ink-dim)', margin: '0', lineHeight: '1.8'}}>Cancellations more than 30 days before departure receive a full refund. Between 15–30 days, we retain 25% of the tour price. Less than 15 days, refunds depend on what costs we've already locked in with accommodation and partners. Travel insurance can cover most of this — we recommend it.</p>
        </div>
      </div>

      {/* FAQ Item 4 */}
      <div className="reveal" style={{marginBottom: '20px', background: '#fff', border: '1px solid var(--line)', borderRadius: '4px', overflow: 'hidden', transition: 'all .3s'}}>
        <button className="faq-button" style={{width: '100%', padding: '24px', textAlign: 'left', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .3s'}} onClick={(e) => { e.currentTarget.parentElement.classList.toggle('faq-open'); e.currentTarget.parentElement.style.boxShadow = e.currentTarget.parentElement.classList.contains('faq-open') ? '0 8px 24px rgba(20,17,11,.12)' : '0 2px 8px rgba(20,17,11,.06)'; }}>
          <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)', margin: '0', flex: '1'}}>Do you accept group bookings?</h3>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold-soft)', color: 'var(--gold)', fontWeight: '600', transition: 'transform .3s', transform: 'rotate(0deg)'}}>+</span>
        </button>
        <div className="faq-content" style={{display: 'none', padding: '0 24px 24px', borderTop: '1px solid var(--line)'}}>
          <p style={{color: 'var(--ink-dim)', margin: '0', lineHeight: '1.8'}}>Yes — groups from 4 to 20+ travelers are our specialty. Group rates are available, and we can customize itineraries to suit mixed abilities and interests. Corporate groups, family reunions, or friend groups all work. Get in touch to discuss your group's needs.</p>
        </div>
      </div>

      {/* FAQ Item 5 */}
      <div className="reveal" style={{marginBottom: '20px', background: '#fff', border: '1px solid var(--line)', borderRadius: '4px', overflow: 'hidden', transition: 'all .3s'}}>
        <button className="faq-button" style={{width: '100%', padding: '24px', textAlign: 'left', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .3s'}} onClick={(e) => { e.currentTarget.parentElement.classList.toggle('faq-open'); e.currentTarget.parentElement.style.boxShadow = e.currentTarget.parentElement.classList.contains('faq-open') ? '0 8px 24px rgba(20,17,11,.12)' : '0 2px 8px rgba(20,17,11,.06)'; }}>
          <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)', margin: '0', flex: '1'}}>Do I need any special fitness level?</h3>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold-soft)', color: 'var(--gold)', fontWeight: '600', transition: 'transform .3s', transform: 'rotate(0deg)'}}>+</span>
        </button>
        <div className="faq-content" style={{display: 'none', padding: '0 24px 24px', borderTop: '1px solid var(--line)'}}>
          <p style={{color: 'var(--ink-dim)', margin: '0', lineHeight: '1.8'}}>It depends on the tour. Our guided game drives need minimal fitness — most time is spent in a vehicle. Hiking tours (like Drakensberg) require moderate to good fitness; we'll level-set expectations on pace and distance upfront. Tell us your fitness level when planning, and we'll match you to the right itinerary.</p>
        </div>
      </div>

      {/* FAQ Item 6 */}
      <div className="reveal" style={{marginBottom: '20px', background: '#fff', border: '1px solid var(--line)', borderRadius: '4px', overflow: 'hidden', transition: 'all .3s'}}>
        <button className="faq-button" style={{width: '100%', padding: '24px', textAlign: 'left', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .3s'}} onClick={(e) => { e.currentTarget.parentElement.classList.toggle('faq-open'); e.currentTarget.parentElement.style.boxShadow = e.currentTarget.parentElement.classList.contains('faq-open') ? '0 8px 24px rgba(20,17,11,.12)' : '0 2px 8px rgba(20,17,11,.06)'; }}>
          <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)', margin: '0', flex: '1'}}>What's the best time to visit?</h3>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold-soft)', color: 'var(--gold)', fontWeight: '600', transition: 'transform .3s', transform: 'rotate(0deg)'}}>+</span>
        </button>
        <div className="faq-content" style={{display: 'none', padding: '0 24px 24px', borderTop: '1px solid var(--line)'}}>
          <p style={{color: 'var(--ink-dim)', margin: '0', lineHeight: '1.8'}}>It varies by destination and what you want to see. Kruger is best May–September (cooler, less rain, better wildlife visibility). Cape Winelands are year-round, but September–November is stunning. Drakensberg is perfect in spring (September–November) and autumn (March–May). We'll guide you toward the best timing for your interests.</p>
        </div>
      </div>

      {/* FAQ Item 7 */}
      <div className="reveal" style={{marginBottom: '20px', background: '#fff', border: '1px solid var(--line)', borderRadius: '4px', overflow: 'hidden', transition: 'all .3s'}}>
        <button className="faq-button" style={{width: '100%', padding: '24px', textAlign: 'left', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .3s'}} onClick={(e) => { e.currentTarget.parentElement.classList.toggle('faq-open'); e.currentTarget.parentElement.style.boxShadow = e.currentTarget.parentElement.classList.contains('faq-open') ? '0 8px 24px rgba(20,17,11,.12)' : '0 2px 8px rgba(20,17,11,.06)'; }}>
          <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)', margin: '0', flex: '1'}}>How do I pay for my tour?</h3>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold-soft)', color: 'var(--gold)', fontWeight: '600', transition: 'transform .3s', transform: 'rotate(0deg)'}}>+</span>
        </button>
        <div className="faq-content" style={{display: 'none', padding: '0 24px 24px', borderTop: '1px solid var(--line)'}}>
          <p style={{color: 'var(--ink-dim)', margin: '0', lineHeight: '1.8'}}>We accept bank transfer, EFT, and credit card payments. A 30% deposit secures your dates; the balance is due 14 days before departure. Payment plans are available for larger groups or multi-week tours — just discuss timing with us when you reach out.</p>
        </div>
      </div>

      {/* FAQ Item 8 */}
      <div className="reveal" style={{marginBottom: '0', background: '#fff', border: '1px solid var(--line)', borderRadius: '4px', overflow: 'hidden', transition: 'all .3s'}}>
        <button className="faq-button" style={{width: '100%', padding: '24px', textAlign: 'left', background: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .3s'}} onClick={(e) => { e.currentTarget.parentElement.classList.toggle('faq-open'); e.currentTarget.parentElement.style.boxShadow = e.currentTarget.parentElement.classList.contains('faq-open') ? '0 8px 24px rgba(20,17,11,.12)' : '0 2px 8px rgba(20,17,11,.06)'; }}>
          <h3 style={{fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)', margin: '0', flex: '1'}}>What if I've never travelled like this before?</h3>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gold-soft)', color: 'var(--gold)', fontWeight: '600', transition: 'transform .3s', transform: 'rotate(0deg)'}}>+</span>
        </button>
        <div className="faq-content" style={{display: 'none', padding: '0 24px 24px', borderTop: '1px solid var(--line)'}}>
          <p style={{color: 'var(--ink-dim)', margin: '0', lineHeight: '1.8'}}>That's exactly who we design for. Our guides walk you through everything — visa requirements, what to pack, what to expect in the vehicle, how to approach wildlife responsibly. By the time you arrive, you'll feel ready. This is about making the road less intimidating, not more.</p>
        </div>
      </div>
    </div>

    <div className="reveal" style={{textAlign: 'center', marginTop: '50px'}}>
      <p style={{color: 'var(--ink-dim)', fontSize: '.95rem', marginBottom: '24px'}}>Still have questions? We're here to answer them.</p>
      <a href="tel:0796445310" style={{display: 'inline-flex', alignItems: 'center', gap: '.6em', padding: '1.1em 2em', border: '2px solid var(--gold)', background: 'transparent', color: 'var(--gold)', fontFamily: 'var(--sans)', fontWeight: '600', fontSize: '.95rem', textDecoration: 'none', borderRadius: '2px', transition: 'all .35s cubic-bezier(.2,.8,.2,1)'}} onMouseOver={(e) => { e.currentTarget.style.backgroundColor='var(--gold)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-2px)'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor='transparent'; e.currentTarget.style.color='var(--gold)'; e.currentTarget.style.transform='translateY(0)'; }}>Call us now <span style={{transition: 'transform .35s cubic-bezier(.2,.8,.2,1)'}}>→</span></a>
    </div>
  </div>
</section>

<section className="cta-band section-tight" id="contact">
  <div className="wrap cta-grid">
    <div className="reveal">
      <span className="eyebrow-note">Ready when you are</span>
      <h2 className="h-display" style={{marginTop: '14px'}}>Tell us where, we'll work out how.</h2>
      <div className="hero-actions" style={{marginTop: '30px', justifyContent: 'flex-start'}}>
        <a href="mailto:info@malikantours.co.za" className="btn btn-primary">Email us <span className="btn-arrow">→</span></a>
        <a href="tel:0796445310" className="btn btn-ghost on-dark">Call 079 644 5310</a>
      </div>
    </div>
    <div className="cta-details reveal">
      <a href="tel:0796445310">Call us anytime<b>079 644 5310</b></a>
      <a href="mailto:info@malikantours.co.za">Email<b>info@malikantours.co.za</b></a>
      <span>Office hours<b>Mon – Fri, 9am – 5pm</b></span>
      <span>Based in<b>Marloth Park, Kruger National Park</b></span>
    </div>
  </div>
</section>

<footer className="site-footer" style={{backgroundImage: 'linear-gradient(135deg, rgba(20,17,11,.92), rgba(20,17,11,.88)), url(\'/gallery7.jpg\')', backgroundPosition: 'center', backgroundSize: 'cover', backgroundAttachment: 'fixed'}}>
  <div className="wrap footer-grid">
    <div className="footer-brand">
      <a href="#top" className="brand" style={{fontFamily: 'var(--serif)', fontSize: '1.25rem', letterSpacing: '.01em', display: 'flex', flexDirection: 'column', lineHeight: '1.1', color: '#fff'}}>
        Malikan&nbsp;Tours
        <small style={{fontFamily: 'var(--sans)', fontSize: '.62rem', fontWeight: '600', letterSpacing: '.14em', color: 'var(--gold-bright)', marginTop: '3px', textTransform: 'uppercase'}}>Tours &amp; Projects</small>
      </a>
      <p>Guided tours, travel planning and cultural experiences across South Africa and Africa — built around real budgets and real routes.</p>
    </div>
    <div className="footer-col">
      <h4>EXPLORE</h4>
      <a href="#about">About</a>
      <a href="#journey">The journey</a>
      <a href="#guide">Your guide</a>
      <a href="#stories">Stories</a>
    </div>
    <div className="footer-col">
      <h4>SERVICES</h4>
      <a href="#journey">Guided tours</a>
      <a href="#journey">Travel planning</a>
      <a href="#journey">Cultural experiences</a>
      <a href="#journey">Accommodation</a>
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