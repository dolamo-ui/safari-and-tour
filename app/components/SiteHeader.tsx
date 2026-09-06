"use client";

import { useEffect, useState } from "react";
import { phoneHref } from "../lib/siteSettings";
import { useContactSettings } from "./useContactSettings";

const links = [
  ["HOME", "/"],
  ["TOURS & SAFARIS", "/tours"],
  ["DESTINATIONS", "/destination"],
  ["ACCOMMODATION", "/accommodation"],
  ["ABOUT US", "/about"],
  ["GALLERY", "/gallery"],
  ["CONTACT US", "/contact"],
] as const;

export default function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { phone, alternativePhone } = useContactSettings();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="site-global-header">
      <div className="site-topbar">
        <div className="wrap site-topbar-inner">
          <div className="site-topbar-links">
            <a href="mailto:info@malikantours.co.za">info@malikantours.co.za</a>
            <a href={phoneHref(phone)}>{phone}</a>
            {alternativePhone && <a href={phoneHref(alternativePhone)}>{alternativePhone}</a>}
          </div>
          <span className="site-topbar-note">Southern Africa, thoughtfully explored</span>
        </div>
      </div>

      <div className={`site-nav ${scrolled ? "glass-nav" : ""}`}>
        <div className="wrap site-nav-inner">
          <a href="/" className="brand" aria-label="Malikan Tours home">
            <span className="brand-mark" aria-hidden="true">
              <img src="/logo.jpg" alt="" />
            </span>
            <span className="brand-text">
              <span className="brand-name">Malikan</span>
              <small>Tours</small>
            </span>
          </a>

          <nav className="site-desktop-nav" aria-label="Main navigation">
            {links.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>

          <div className="site-nav-actions">
            <a href="/booking" className="site-book-button">Book now <span aria-hidden="true">→</span></a>
            <button
              type="button"
              className={`site-scroll-top ${showScrollTop ? "is-visible" : ""}`}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Scroll to top"
              title="Back to top"
            >↑</button>
            <button
              type="button"
              className="site-menu-button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >☰</button>
          </div>
        </div>
      </div>

      <div className={`site-drawer ${drawerOpen ? "is-open" : ""}`} aria-hidden={!drawerOpen}>
        <button className="site-drawer-overlay" type="button" onClick={() => setDrawerOpen(false)} aria-label="Close menu" />
        <aside className="site-drawer-panel" aria-label="Mobile navigation">
          <div className="site-drawer-head">
            <span className="brand-name">Malikan</span>
            <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close menu">×</button>
          </div>
          <nav className="site-mobile-nav">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setDrawerOpen(false)}>{label}</a>
            ))}
          </nav>
          <a href="/booking" className="site-book-button site-book-button-mobile" onClick={() => setDrawerOpen(false)}>Book now <span aria-hidden="true">→</span></a>
          <div className="site-drawer-contact">
            <a href={phoneHref(phone)}>{phone}</a>
            {alternativePhone && <a href={phoneHref(alternativePhone)}>{alternativePhone}</a>}
            <a href="mailto:info@malikantours.co.za">info@malikantours.co.za</a>
          </div>
        </aside>
      </div>
    </header>
  );
}
