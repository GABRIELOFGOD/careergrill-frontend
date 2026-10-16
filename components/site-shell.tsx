import Link from "next/link";
import type { ReactNode } from "react";
import { navigation } from "@/lib/site-data";
import SiteNavigation from "@/components/site-navigation";

function Brand() {
  return <Link href="/" className="brand" aria-label="Careergrill home"><span className="brand-mark">c</span> Careergrill<span className="brand-dot">.</span></Link>;
}

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <SiteNavigation />
        <div className="header-actions">
          <Link className="button button-small button-dark" href="/consultation?mode=call">Free 15-minute call <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><Brand /><p>Clearer direction. Stronger applications.</p></div>
        <div><strong>Explore</strong><div className="footer-links">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/client-feedback">Client feedback</Link><Link href="/faq">FAQs</Link><Link href="/privacy">Privacy</Link></div></div>
        <div><strong>Get in touch</strong><div className="footer-links"><a href="mailto:info@careergrill.com">info@careergrill.com</a><a href="https://wa.me/2348168097950" target="_blank" rel="noreferrer">Message on WhatsApp</a><a href="https://careergrill.com" target="_blank" rel="noreferrer">Visit careergrill.com</a></div></div>
      </div>
      <div className="footer-bottom"><span>© 2026 Careergrill</span><span>Explore opportunities and plan your next step.</span></div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-brand-cream text-brand-ink font-sans">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header />
    <div className="browse-note"><span>Browse freely. Sign in to save work and generate AI feedback.</span><Link className="header-signin" href="/signin">Sign in</Link></div>
    <main id="main-content">{children}</main>
    <Footer />
  </div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
