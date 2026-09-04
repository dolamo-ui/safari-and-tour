"use client";

import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    /* ---- Nav glass effect on scroll ---- */
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

    /* ---- Mobile drawer ---- */
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

    /* ---- Scroll-to-top button ---- */
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

    /* ---- Reveal on scroll ---- */
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

    /* ---- Testimonial slider ---- */
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

    /* ---- Cleanup ---- */
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
                href="/tours"
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium"
              >
                HOME
              </a>
              <a
                href="/"
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
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-[#C9A227] font-medium hover:text-white"
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
                href="/contact"
                className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium"
              >
                CONTACT US
              </a>
            </div>
          </nav>
        </div>

        <div
          id="mobile-drawer"
          className="fixed inset-0 z-[60] xl:hidden transition-opacity duration-300 opacity-0 pointer-events-none"
        >
          <div
            id="drawer-overlay"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          ></div>
          <aside
            id="drawer-panel"
            className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-gradient-to-b from-[#14110B] to-[#0F0D0A] text-white flex flex-col transition-transform duration-500 ease-out translate-x-full border-l border-[#C9A227]/20"
          >
            <div className="flex items-center justify-between p-5 border-b border-[#C9A227]/20">
              <span className="flex items-center gap-2 text-white">
                <span
                  className="brand-mark"
                  style={{ width: "28px", height: "28px", minWidth: "28px" }}
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
                href="/tours"
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                HOME
              </a>
              <a
                href="/"
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-[#C9A227] font-medium hover:bg-[#C9A227]/10 rounded"
              >
                TOURS &amp; SAFARIS
              </a>
              <a
                href="/destination"
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                DESTINATIONS
              </a>
              <a
                href="/about"
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-[#C9A227] font-medium hover:bg-[#C9A227]/10 rounded"
              >
                ABOUT US
              </a>
              <a
                href="/gallery"
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                GALLERY
              </a>
              <a
                href="/#stories"
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                REVIEWS
              </a>
              <a
                href="/contact"
                className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded"
              >
                CONTACT US
              </a>
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
            src="/hero3.jpg"
            alt="South African bushveld landscape at golden hour"
          />
          <div className="page-hero-bg-overlay"></div>
        </div>
        <div className="page-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">About Us</span>
          </nav>
          <h1>The people behind the route.</h1>
          <p className="lede">
            Fourteen years of guiding across Southern Africa, built on local
            knowledge, honest pricing and real relationships.
          </p>
        </div>
      </section>

      {/* ==================== OUR STORY ==================== */}
      <section className="section" id="story">
        <div className="wrap story-grid">
          <div className="story-media reveal">
            <img
              src="/image.JPG"
              alt="Malikan, founder of Malikan Tours, on a guided safari"
            />
          </div>
          <div className="story-body reveal">
            <span className="kicker">Our story</span>
            <h2 className="h-display">
              Tourism, built as an everyday part of life — not a once-off
              luxury.
            </h2>
            <p>
              Malikan Tours and Projects was founded on a simple belief: seeing
              your own country, and the continent around it, shouldn&apos;t feel
              out of reach. We plan trips the way we&apos;d plan them for family
              — honest pricing, routes that make sense, and guides who actually
              know the ground.
            </p>
            <p>
              From weekend escapes in the Cape Winelands to multi-day crossings
              into Zimbabwe and Zambia, every itinerary is shaped around
              who&apos;s travelling, not a fixed package pulled off a shelf.
              What started as one guide with a vehicle has grown into a small,
              focused team that handles everything from permits to pacing.
            </p>
            <p>
              We&apos;re based at 1717 Kingfisher Street in Marloth Park, next to
              Kruger National Park, but our routes run from the Drakensberg to Victoria Falls. The common thread across every trip
              is the same: local expertise, transparent costs, and the kind of
              guiding that only comes from years on the road.
            </p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ==================== OUR MISSION ==================== */}
      <section className="mission-band section">
        <div className="wrap reveal">
          <blockquote>
            &quot;Creating <em>unforgettable African adventures</em> through
            local knowledge, honest pricing and real human connection.&quot;
          </blockquote>
          <p className="source">— Malikan Tours &amp; Projects</p>
        </div>
      </section>

      <hr className="divider" />

      {/* ==================== WHY CHOOSE US ==================== */}
      <section
        className="section"
        style={{
          background:
            "linear-gradient(135deg, rgba(169,121,28,.05), rgba(201,162,39,.03))",
        }}
      >
        <div className="wrap">
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "50px" }}
          >
            <span className="eyebrow-note">What sets us apart</span>
            <h2 className="h-section" style={{ marginTop: "14px" }}>
              Why Choose Us
            </h2>
            <p
              className="lede"
              style={{ marginTop: "18px", marginInline: "auto" }}
            >
              Three reasons travellers keep coming back, and keep recommending
              us.
            </p>
          </div>
          <div className="why-grid reveal">
            <div className="why-card">
              <div className="icon-wrap">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Safe &amp; Insured</h3>
              <p>
                Every vehicle is fully licensed and inspected. Our guides are
                CATHSSETA-accredited, first-aid certified, and every itinerary
                is covered by comprehensive passenger liability insurance.
              </p>
            </div>
            <div className="why-card">
              <div className="icon-wrap">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3>Truly Local</h3>
              <p>
                We live here. That means relationships with lodge owners,
                knowledge of seasonal road conditions, and access to communities
                and viewpoints you won&apos;t find on a standard itinerary.
              </p>
            </div>
            <div className="why-card">
              <div className="icon-wrap">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15.5 14" />
                </svg>
              </div>
              <h3>Experienced</h3>
              <p>
                14 years on the road. Award-winning guiding. FIFA World Cup
                volunteer experience. When you travel with us, you&apos;re
                travelling with someone who&apos;s handled every situation the
                bush can throw at you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ==================== MEET OUR TEAM ==================== */}
      <section className="section" id="team">
        <div className="wrap">
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "50px" }}
          >
            <span className="eyebrow-note">The people</span>
            <h2 className="h-section" style={{ marginTop: "14px" }}>
              Meet Our Team
            </h2>
            <p
              className="lede"
              style={{ marginTop: "18px", marginInline: "auto" }}
            >
              Small team, deep experience. Everyone you meet has spent years on
              the road.
            </p>
          </div>
          <div className="team-grid reveal">
            <div className="team-card">
              <div className="team-photo">
                <img
                  src="/image.JPG"
                  alt="Malikan - Founder & Lead Tourist Guide"
                />
              </div>
              <div className="team-info">
                <h4>Malikan</h4>
                <div className="role">Founder &amp; Lead Tourist Guide</div>
                <p>
                  CATHSSETA-accredited assessor with 14 years of guiding across
                  Southern Africa. Award-winning guide and Sowetan Top 100
                  Young Bosses alumnus.
                </p>
              </div>
            </div>
            <div className="team-card">
              <div className="team-photo">
                <div className="initials">TK</div>
              </div>
              <div className="team-info">
                <h4>Thabo K.</h4>
                <div className="role">Senior Field Guide</div>
                <p>
                  Specialist in Kruger and Pilanesberg game drives.
                  Track-and-sign certified with a background in conservation
                  education and wildlife photography.
                </p>
              </div>
            </div>
            <div className="team-card">
              <div className="team-photo">
                <div className="initials">LN</div>
              </div>
              <div className="team-info">
                <h4>Lebo N.</h4>
                <div className="role">Operations &amp; Guest Experience</div>
                <p>
                  Handles bookings, permits and logistics behind every seamless
                  trip. Former hospitality manager with a sharp eye for detail
                  and guest comfort.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ==================== REVIEWS / TESTIMONIALS ==================== */}
      <section className="section" id="reviews">
        <div className="wrap testimonial-wrap">
          <div className="testimonial-head reveal">
            <span className="eyebrow-note">What travellers say</span>
            <h2 className="h-display" style={{ marginTop: "14px" }}>
              Real trips, real feedback.
            </h2>
            <p>Stories from people who let us plan the route.</p>
            <div className="testimonial-nav">
              <button id="quotePrev" aria-label="Previous testimonial">
                ←
              </button>
              <button id="quoteNext" aria-label="Next testimonial">
                →
              </button>
            </div>
          </div>
          <div className="quote-card reveal">
            <div className="quote-slide is-active">
              <blockquote>
                &quot;Malikan mapped out a route through Mpumalanga that hit
                every waterfall we wanted and none of the traffic. It felt
                planned by someone who actually goes there, not a
                brochure.&quot;
              </blockquote>
              <div className="who">
                <div className="avatar">N</div>
                <div>
                  <div className="name">Naledi M.</div>
                  <div className="role">Family trip, Blyde River Canyon</div>
                </div>
              </div>
            </div>
            <div className="quote-slide">
              <blockquote>
                &quot;We booked the cultural tour expecting a quick stop and got
                a full afternoon of conversation with people who actually live
                there. That&apos;s the difference a local guide makes.&quot;
              </blockquote>
              <div className="who">
                <div className="avatar">K</div>
                <div>
                  <div className="name">Kagiso T.</div>
                  <div className="role">Weekend group tour, Soweto</div>
                </div>
              </div>
            </div>
            <div className="quote-slide">
              <blockquote>
                &quot;Crossing into Victoria Falls felt intimidating to plan
                alone. Malikan Tours handled the permits, the transfers, and the
                pacing — we just showed up and travelled.&quot;
              </blockquote>
              <div className="who">
                <div className="avatar">S</div>
                <div>
                  <div className="name">Sipho D.</div>
                  <div className="role">Cross-border trip, Zimbabwe</div>
                </div>
              </div>
            </div>
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
                  fontWeight: "600",
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
            <a href="/about">About</a>
            <a href="/tours">Tours &amp; safaris</a>
            <a href="/about#team">Your guide</a>
            <a href="/#stories">Stories</a>
          </div>
          <div className="footer-col">
            <h4>SERVICES</h4>
            <a href="/tours">Guided tours</a>
            <a href="/contact">Travel planning</a>
            <a href="/contact">Cultural experiences</a>
            <a href="/contact">Accommodation</a>
          </div>
          <div className="footer-col">
            <h4>CONTACT</h4>
            <span>0632344970</span>
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
       