"use client";

import { phoneHref } from "../lib/siteSettings";
import { useContactSettings } from "./useContactSettings";

export default function SiteFooter() {
  const { phone, alternativePhone } = useContactSettings();

  return (
    <footer className="site-global-footer site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <a href="/" className="brand site-footer-brand" aria-label="Malikan Tours home">
            <span className="brand-name">Malikan Tours</span>
            <small>Tours &amp; Projects</small>
          </a>
          <p>
            Guided tours, travel planning and cultural experiences across South Africa and Africa,
            built around real budgets and real routes.
          </p>

          {/* ---- SOCIAL LINKS ---- */}
          <div className="site-footer-social" style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <a
              href="https://www.facebook.com/share/1F1XGhWvnJ/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
              aria-label="Instagram"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
              href="https://www.tiktok.com/@malikantours"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#14110B] transition-all duration-300 hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>EXPLORE</h4>
          <a href="/about">About</a>
          <a href="/tours">Tours &amp; safaris</a>
          <a href="/destination">Destinations</a>
          <a href="/accommodation">Accommodation</a>
          <a href="/gallery">Gallery</a>
        </div>
        <div className="footer-col">
          <h4>PLAN</h4>
          <a href="/booking">Book a tour</a>
          <a href="/contact">Travel planning</a>
          <a href="/contact">Contact us</a>
        </div>
        <div className="footer-col">
          <h4>CONTACT</h4>
          <a href={phoneHref(phone)}>{phone}</a>
          {alternativePhone && <a href={phoneHref(alternativePhone)}>{alternativePhone}</a>}
          <a href="mailto:info@malikantours.co.za">info@malikantours.co.za</a>
          <span>
            1717 Kingfisher Street, Marloth Park
            <br />
            Kruger National Park
          </span>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 Malikan Tours And Projects (Pty) Ltd</span>
        <span>Designed for the road ahead.</span>
      </div>
    </footer>
  );
}