"use client";

import { useEffect, useMemo, useState } from "react";

type Tour = {
  name: string;
  tagline: string;
  image: string;
  tag: string;
  category: "safari" | "adventure" | "culture" | "day";
  location: string;
  duration: number;
  durationLabel: string;
  groupSize: string;
  price: number;
  priceLabel: string;
  desc: string;
};

const TOURS: Tour[] = [
  {
    name: "Kruger National Park Safari",
    tagline: "Big Five game drives, sunrise to sunset",
    image: "hero.jpg",
    tag: "SAFARI",
    category: "safari",
    location: "Mpumalanga",
    duration: 3,
    durationLabel: "3 Days & 2 Nights",
    groupSize: "Max 10 people",
    price: 6500,
    priceLabel: "R 6 500 pp",
    desc: "Two full days of guided game drives through Kruger's central region, tracking the Big Five with a guide who knows the terrain, plus a relaxed evening at a bushveld lodge.",
  },
  {
    name: "Sun City & Nature Getaway",
    tagline: "Luxury escape into leisure & wildlife",
    image: "hero.jpg",
    tag: "LUXURY ESCAPE",
    category: "safari",
    location: "North West",
    duration: 2,
    durationLabel: "2 Days & 1 Night",
    groupSize: "Max 14 people",
    price: 4000,
    priceLabel: "From R 4 000 pp",
    desc: "The Kingdom Resort, Sun City (bed & breakfast), Valley of Waves access and a half-day safari at Pilanesberg Nature Reserve. Return transport from selected Gauteng malls.",
  },
  {
    name: "Qwa Qwa Retreat",
    tagline: "Lefatshe la Basotho — land of the Basotho",
    image: "hero2.jpg",
    tag: "CULTURAL RETREAT",
    category: "culture",
    location: "Free State",
    duration: 3,
    durationLabel: "3 Days & 2 Nights",
    groupSize: "Max 16 people",
    price: 5500,
    priceLabel: "R 5 500 pp",
    desc: "Kaira Lodge, a half-day tour of the Basotho Cultural Village, the Golden Gate Highlands Game Park, guided hiking and seasonal abseiling & canoeing.",
  },
  {
    name: "Mpumalanga Retreat",
    tagline: "Place of the rising sun",
    image: "hero3.jpg",
    tag: "SCENIC GETAWAY",
    category: "adventure",
    location: "Graskop",
    duration: 3,
    durationLabel: "3 Days & 2 Nights",
    groupSize: "Max 16 people",
    price: 5500,
    priceLabel: "R 5 500 pp",
    desc: "Accommodation near Graskop, a half-day tour of Kruger National Park, the Panoramic Route, 3 Rondavels, God's Window and the Graskop Big Swing.",
  },
  {
    name: "Cape Winelands Weekend",
    tagline: "Vineyards, valleys and long lunches",
    image: "gallery1.jpg",
    tag: "DAY TOUR",
    category: "day",
    location: "Western Cape",
    duration: 1,
    durationLabel: "Full-day tour",
    groupSize: "Max 12 people",
    price: 1800,
    priceLabel: "R 1 800 pp",
    desc: "A guided run through Stellenbosch and Franschhoek — three tastings, a cellar tour and a sit-down lunch, with return transport from central Cape Town.",
  },
  {
    name: "Drakensberg Hiking Escape",
    tagline: "Trails through the highest range in the region",
    image: "gallery2.jpg",
    tag: "ADVENTURE",
    category: "adventure",
    location: "KwaZulu-Natal",
    duration: 3,
    durationLabel: "3 Days & 2 Nights",
    groupSize: "Max 10 people",
    price: 5200,
    priceLabel: "R 5 200 pp",
    desc: "Moderate-to-good fitness trails with a guide who paces the group, mountain lodge accommodation, and two full days on the trail with all meals included.",
  },
  {
    name: "Soweto Heritage Tour",
    tagline: "History, food and conversation in the township that shaped a nation",
    image: "gallery3.jpg",
    tag: "DAY TOUR",
    category: "culture",
    location: "Johannesburg",
    duration: 1,
    durationLabel: "Half-day tour",
    groupSize: "Max 20 people",
    price: 950,
    priceLabel: "R 950 pp",
    desc: "Vilakazi Street, the Hector Pieterson Memorial and a shared meal with a local family — an afternoon built around people, not just landmarks.",
  },
  {
    name: "Blyde River Canyon Day Trip",
    tagline: "One of the world's largest green canyons",
    image: "gallery4.jpg",
    tag: "DAY TOUR",
    category: "day",
    location: "Mpumalanga",
    duration: 1,
    durationLabel: "Full-day tour",
    groupSize: "Max 14 people",
    price: 1400,
    priceLabel: "R 1 400 pp",
    desc: "Bourke's Luck Potholes, the Three Rondavels viewpoint and God's Window, with lunch at a canyon-side stop along the way.",
  },
  {
    name: "Victoria Falls Crossing",
    tagline: "Permits, transfers and pacing — fully handled",
    image: "gallery5.jpg",
    tag: "CROSS-BORDER",
    category: "adventure",
    location: "Zimbabwe / Zambia",
    duration: 4,
    durationLabel: "4 Days & 3 Nights",
    groupSize: "Max 8 people",
    price: 9800,
    priceLabel: "R 9 800 pp",
    desc: "Border logistics arranged in advance, riverside accommodation, a guided walk to the falls and optional white-water and sunset cruise add-ons.",
  },
];

const CATEGORIES = [
  { value: "all", label: "All tours" },
  { value: "safari", label: "Safari" },
  { value: "adventure", label: "Adventure" },
  { value: "culture", label: "Cultural" },
  { value: "day", label: "Day tours" },
] as const;

const ICON_CLOCK = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={15} height={15} stroke="var(--gold)">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);
const ICON_PIN = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={15} height={15} stroke="var(--gold)">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ICON_USERS = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width={15} height={15} stroke="var(--gold)">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

function durationBucket(d: number) {
  if (d <= 2) return "short";
  if (d === 3) return "mid";
  return "long";
}
function priceBucket(p: number) {
  if (p < 5000) return "low";
  if (p <= 8000) return "mid";
  return "high";
}

// @ts-nocheck
// NOTE: like the home page, the shared header/drawer/scroll chrome below
// still uses the original vanilla getElementById + classList approach (kept
// 1:1 with the source HTML's behavior) rather than React refs/state, which
// is why type-checking is disabled for this file. The tour search/filter UI
// itself IS proper React state (see useState/useMemo below).
export default function ToursPage() {
  const [search, setSearch] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTours = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TOURS.filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) return false;
      if (durationFilter !== "all" && durationBucket(t.duration) !== durationFilter) return false;
      if (priceFilter !== "all" && priceBucket(t.price) !== priceFilter) return false;
      if (
        q &&
        !t.name.toLowerCase().includes(q) &&
        !t.location.toLowerCase().includes(q) &&
        !t.tagline.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [search, durationFilter, priceFilter, activeCategory]);

  function clearFilters() {
    setSearch("");
    setDurationFilter("all");
    setPriceFilter("all");
    setActiveCategory("all");
  }

  useEffect(() => {
    const nav = document.getElementById("main-nav");
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 40) nav.classList.add("glass-nav");
      else nav.classList.remove("glass-nav");
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

    return () => {
      window.removeEventListener("scroll", onScroll);
      drawerBtn?.removeEventListener("click", openDrawer);
      closeDrawerBtn?.removeEventListener("click", closeDrawer);
      drawerOverlay?.removeEventListener("click", closeDrawer);
      document.removeEventListener("keydown", onEscape);
      drawerLinks.forEach((a) => a.removeEventListener("click", closeDrawer));
      scrollTopBtn?.removeEventListener("click", onScrollTop);
      window.removeEventListener("scroll", toggleScrollButton);
      window.removeEventListener("resize", toggleScrollButton);
      io?.disconnect();
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
        <a href="/" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-white hover:text-[#C9A227] hover:font-medium">HOME</a>
        <a href="/tours" className="nav-link font-label text-[12px] tracking-[.5px] transition-all duration-300 link-underline text-[#C9A227] font-medium hover:text-white">TOURS &amp; SAFARIS</a>
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
        <a href="/" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-white/90 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded">HOME</a>
        <a href="/tours" className="nav-link-mobile font-label text-[13px] tracking-[.5px] py-3.5 px-4 border-b border-[#C9A227]/20 transition-all text-[#C9A227] font-medium hover:bg-[#C9A227]/10 rounded">TOURS &amp; SAFARIS</a>
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

{/* ==================== PAGE HERO ==================== */}
<section className="page-hero" id="top">
  <div className="page-hero-bg">
    <img src="/hero3.jpg" alt="Guests on a game drive across the South African bushveld" />
    <div className="page-hero-bg-overlay"></div>
  </div>
  <div className="page-hero-inner">
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span className="breadcrumb-separator">›</span>
      <span className="breadcrumb-current">Tours &amp; Safaris</span>
    </nav>
    <h1>Every route we guide, in one place.</h1>
    <p className="lede">Safaris, cultural retreats and scenic escapes across Southern Africa — each one priced per person, with accommodation and transport built in.</p>
  </div>
</section>

{/* ==================== FINDER ==================== */}
<div className="wrap finder">
  <div className="finder-card reveal is-visible">
    <div className="finder-row">
      <div className="finder-field">
        <label htmlFor="searchInput">Search tours</label>
        <div className="input-shell">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            id="searchInput"
            type="text"
            placeholder="Try 'Kruger' or 'Cape Winelands'"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="finder-field">
        <label htmlFor="durationSelect">Duration</label>
        <div className="input-shell">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg>
          <select id="durationSelect" value={durationFilter} onChange={(e) => setDurationFilter(e.target.value)}>
            <option value="all">Any length</option>
            <option value="short">1–2 days</option>
            <option value="mid">3 days</option>
            <option value="long">4+ days</option>
          </select>
        </div>
      </div>
      <div className="finder-field">
        <label htmlFor="priceSelect">Price per person</label>
        <div className="input-shell">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <select id="priceSelect" value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
            <option value="all">Any budget</option>
            <option value="low">Under R5 000</option>
            <option value="mid">R5 000 – R8 000</option>
            <option value="high">R8 000+</option>
          </select>
        </div>
      </div>
      <button id="clearFilters" className="btn btn-ghost finder-submit" onClick={clearFilters}>Clear filters</button>
    </div>
  </div>
</div>

{/* ==================== CATEGORIES + GRID ==================== */}
<section className="section" style={{paddingTop: '56px'}}>
  <div className="wrap">
    <div className="cat-bar reveal is-visible" style={{marginBottom: '46px'}}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          className={`cat-pill${activeCategory === cat.value ? ' active' : ''}`}
          onClick={() => setActiveCategory(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>

    <div className="result-meta reveal is-visible" style={{marginBottom: '26px'}}>
      <p id="resultCount">
        {filteredTours.length === TOURS.length
          ? `Showing all ${TOURS.length} tours`
          : `Showing ${filteredTours.length} of ${TOURS.length} tours`}
      </p>
    </div>

    <div className="tour-grid" id="tourGrid">
      {filteredTours.map((t) => (
        <article key={t.name} className="tour-card reveal is-visible">
          <div className="tour-media">
            <img src={`/${t.image}`} alt={t.name} />
            <span className="tour-tag">{t.tag}</span>
          </div>
          <div className="tour-body">
            <h3>{t.name}</h3>
            <p style={{color: 'var(--ink-faint)', fontSize: '.86rem', fontStyle: 'italic', margin: 0}}>{t.tagline}</p>
            <div className="tour-facts">
              <span>{ICON_PIN} {t.location}</span>
              <span>{ICON_CLOCK} {t.durationLabel}</span>
              <span>{ICON_USERS} {t.groupSize}</span>
            </div>
            <p className="desc">{t.desc}</p>
            <div className="tour-price-row">
              <div className="tour-price">
                <span className="amt">{t.priceLabel}</span>
                <span className="unit">per person</span>
              </div>
              <a href="/booking" className="tour-view">View tour <span>→</span></a>
            </div>
          </div>
        </article>
      ))}
    </div>

    <div className={`empty-state${filteredTours.length === 0 ? ' show' : ''}`} id="emptyState">
      <h3>No tours match those filters</h3>
      <p>Try clearing a filter, or call us on 079 644 5310 and we&apos;ll find something that fits.</p>
    </div>
  </div>
</section>

{/* ==================== CTA ==================== */}
<section className="cta-band section-tight" id="contact">
  <div className="wrap cta-grid">
    <div className="reveal">
      <span className="eyebrow-note">Can&apos;t see the route you&apos;re after?</span>
      <h2 className="h-display" style={{marginTop: '14px'}}>We build custom itineraries too.</h2>
      <div className="hero-actions" style={{marginTop: '30px', justifyContent: 'flex-start', display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
        <a href="mailto:info@malikantours.co.za" className="btn btn-primary">Email us <span className="btn-arrow">→</span></a>
        <a href="tel:0796445310" className="btn btn-ghost on-dark">Call 079 644 5310</a>
      </div>
    </div>
    <div className="cta-details reveal">
      <a href="tel:0796445310">Call us anytime<b>079 644 5310</b></a>
      <a href="mailto:info@malikantours.co.za">Email<b>info@malikantours.co.za</b></a>
      <span>Office hours<b>Mon – Fri, 9am – 5pm</b></span>
      <span>Based in<b>Sebokeng, Gauteng</b></span>
    </div>
  </div>
</section>

<footer className="site-footer" style={{backgroundImage: 'linear-gradient(135deg, rgba(20,17,11,.92), rgba(20,17,11,.88)), url(\'/gallery7.jpg\')', backgroundPosition: 'center', backgroundSize: 'cover', backgroundAttachment: 'fixed'}}>
  <div className="wrap footer-grid">
    <div className="footer-brand">
      <a href="/" className="brand" style={{fontFamily: 'var(--serif)', fontSize: '1.25rem', letterSpacing: '.01em', display: 'flex', flexDirection: 'column', lineHeight: '1.1', color: '#fff'}}>
        Malikan&nbsp;Tours
        <small style={{fontFamily: 'var(--sans)', fontSize: '.62rem', fontWeight: '600', letterSpacing: '.14em', color: 'var(--gold-bright)', marginTop: '3px', textTransform: 'uppercase'}}>Tours &amp; Projects</small>
      </a>
      <p>Guided tours, travel planning and cultural experiences across South Africa and Africa — built around real budgets and real routes.</p>
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