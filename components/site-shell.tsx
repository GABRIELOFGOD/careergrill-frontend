import Link from "next/link";
import type { ReactNode } from "react";
import { navigation } from "@/lib/site-data";
import SiteNavigation from "@/components/site-navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteBrand({ footer = false }: { footer?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 whitespace-nowrap font-display font-extrabold tracking-[-0.06em] ${footer ? "text-2xl text-brand-footer" : "text-2xl text-brand-ink lg:text-3xl"}`}
      aria-label="Careergrill home"
    >
      <span className={`grid place-items-center rounded-full border-2 border-brand-orange bg-transparent font-display font-bold leading-none text-brand-orange ${footer ? "size-6 text-sm" : "size-8 text-2xl"}`}>c</span>
      Careergrill<span className={`-ml-2 text-brand-orange ${footer ? "-ml-1.5" : ""}`}>.</span>
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-brand-line bg-brand-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex min-h-17 w-full max-w-7xl px-4 items-center justify-between gap-3 py-2 lg:min-h-22 lg:gap-6">
        <SiteBrand />
        <SiteNavigation />
        <div className="hidden items-center lg:flex">
          <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/consultation?mode=call">
            Free 15-minute call <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-brand-ink pt-10 text-brand-footer">
      <div className="mx-auto grid w-full max-w-7xl px-4 grid-cols-2 gap-6 pb-9 lg:grid-cols-[1.4fr_.75fr_.9fr] lg:gap-11">
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
            <a href="https://wa.me/2348168097950" target="_blank" rel="noreferrer">Message on WhatsApp</a>
            <a href="https://careergrill.com" target="_blank" rel="noreferrer">Visit careergrill.com</a>
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
    <div className="flex min-h-10 flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-brand-line bg-brand-cream px-4.5 py-2 text-center text-sm tracking-wide text-brand-muted sm:justify-end sm:px-8">
      <span>Browse freely. Sign in to save work and generate AI feedback.</span>
      <Link className="text-brand-ink transition-colors hover:text-brand-orange" href="/signin">Sign in</Link>
    </div>
    <main id="main-content">{children}</main>
    <Footer />
  </div>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mb-3 text-xs font-bold uppercase leading-snug tracking-[.13em] text-brand-orange-dark", className)}>{children}</p>;
}
