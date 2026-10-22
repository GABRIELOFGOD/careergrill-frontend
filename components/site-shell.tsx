import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { navigation } from "@/lib/site-data";
import SiteNavigation from "@/components/site-navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteBrand({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" className={footer ? "site-brand-footer inline-flex items-center whitespace-nowrap" : "site-brand-logo inline-flex items-center whitespace-nowrap"} aria-label="Careergrill home">
      {footer
        ? <Image src="/logo.png" alt="Careergrill" width={1924} height={358} />
        : <Image src="/logo.png" alt="Careergrill" width={1924} height={358} priority />}
    </Link>
  );
}

function Header() {
  return (
    <header className="site-header z-20 border-b border-brand-line bg-brand-cream">
      <div className="site-header-inner mx-auto flex w-full items-center justify-between">
        <SiteBrand />
        <div className="flex gap-5 my-auto">
          <SiteNavigation />
          <div className="site-header-cta hidden items-center gap-5 min-[1281px]:flex">
            <Link href="/consultation?mode=call">
              <Button variant="brand" className={cn("tracking-tighter text-sm font-semibold")}>Free 15-minute call <span aria-hidden="true">↗</span></Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-ink pt-10 text-brand-footer">
      <div className="site-footer-content mx-auto grid w-full max-w-7xl px-4 grid-cols-2 gap-6 pb-9 lg:grid-cols-[1.4fr_.75fr_.9fr] lg:gap-11">
        <div className="col-span-2 lg:col-span-1">
          <SiteBrand footer />
          <p className="mt-2.5 text-sm text-brand-footer-muted">Clearer direction. Stronger applications.</p>
        </div>
        <div>
          <strong className="text-sm">Explore</strong>
          <div className="mt-2.5 grid gap-1.5 text-sm text-brand-footer-link [&_a:hover]:text-brand-footer-hover">
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <Link href="/client-feedback">Client feedback</Link>
            <Link href="/faq">FAQs</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
        <div>
          <strong className="text-sm">Get in touch</strong>
          <div className="mt-2.5 grid gap-1.5 text-sm text-brand-footer-link [&_a:hover]:text-brand-footer-hover">
            <a href="mailto:info@careergrill.com">info@careergrill.com</a>
            <a href="https://wa.me/2348129982113" target="_blank" rel="noreferrer">Message on WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-3 border-t border-white/15 px-4.5 py-3 text-center text-sm text-brand-footer-muted sm:flex-row sm:px-8 sm:text-left">
        <span>© 2026 Careergrill</span>
        <span>Explore opportunities and plan your next step.</span>
      </div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-brand-cream text-brand-ink font-sans">
    <a className="absolute -top-16 left-4 z-50 bg-brand-ink px-4 py-2.5 text-white focus:top-3" href="#main-content">Skip to content</a>
    <Header />
    {/* <div className="account-strip">
      <span>Browse freely. Sign in to save work, notes and audits.</span>
      <Link href="/signin">Sign in</Link>
    </div> */}
    <main id="main-content">{children}</main>
    <Footer />
  </div>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("site-eyebrow mb-3 text-xs font-bold uppercase leading-snug tracking-[.13em] text-brand-orange-dark", className)}>{children}</p>;
}
