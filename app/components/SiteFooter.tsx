export default function SiteFooter() {
  return (
    <footer className="site-global-footer site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <a href="/" className="brand site-footer-brand" aria-label="Malikan Tours home">
            <span className="brand-name">Malikan Tours</span>
            <small>Tours &amp; Projects</small>
          </a>
          <p>Guided tours, travel planning and cultural experiences across South Africa and Africa, built around real budgets and real routes.</p>
        </div>
        <div className="footer-col">
          <h4>EXPLORE</h4>
          <a href="/about">About</a>
          <a href="/tours">Tours &amp; safaris</a>
          <a href="/destination">Destinations</a>
          <a href="/accommodation">Accommodation</a>
          <a href="/shuttle">Shuttle services</a>
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
  );
}
