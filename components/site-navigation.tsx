"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export default function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeMenus(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!containerRef.current?.contains(target)) {
        setIsOpen(false);
        navigationRef.current?.querySelectorAll("details[open]").forEach((menu) => menu.removeAttribute("open"));
      }
    }

    function closeMenusOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        navigationRef.current?.querySelectorAll("details[open]").forEach((menu) => {
          menu.removeAttribute("open");
        });
      }
    }

    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeMenusOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeMenusOnEscape);
    };
  }, []);

  function closeMenus() {
    setIsOpen(false);
    navigationRef.current?.querySelectorAll("details[open]").forEach((menu) => {
      menu.removeAttribute("open");
    });
  }

  return (
    <div className="relative ml-auto lg:static lg:ml-0" ref={containerRef}>
      <button
        className="grid size-10 place-items-center rounded-md border border-brand-line bg-white text-brand-ink lg:hidden"
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>
      <nav
        ref={navigationRef}
        id="primary-navigation"
        className={`absolute right-0 top-full z-30 flex w-[min(20rem,calc(100vw-2.25rem))] flex-col items-stretch gap-0 rounded-lg border border-brand-line bg-white p-2 shadow-xl lg:static lg:z-auto lg:w-auto lg:flex-row lg:items-center lg:gap-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${isOpen ? "max-lg:flex" : "max-lg:hidden"}`}
        aria-label="Main navigation"
      >
        <details className="group relative max-lg:static">
          <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-2 whitespace-nowrap px-2.5 py-2 text-base text-brand-ink transition-colors hover:text-brand-orange lg:min-h-0 lg:justify-start lg:px-0 lg:py-0 [&::-webkit-details-marker]:hidden">
            Opportunities <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="absolute left-0 top-[calc(100%+0.75rem)] z-30 hidden w-56 rounded-lg border border-brand-line bg-white px-4 py-2 shadow-xl group-open:grid max-lg:static max-lg:ml-2 max-lg:mt-0 max-lg:w-auto max-lg:rounded-none max-lg:border-0 max-lg:border-l max-lg:bg-transparent max-lg:px-0 max-lg:py-0 max-lg:pl-2 max-lg:shadow-none">
            <Link className="py-3 text-brand-ink transition-colors hover:text-brand-orange [&+a]:border-t [&+a]:border-brand-line" href="/jobs" onClick={closeMenus}>Find jobs</Link>
            <Link className="py-3 text-brand-ink transition-colors hover:text-brand-orange" href="/scholarships" onClick={closeMenus}>Find scholarships</Link>
          </div>
        </details>
        <Link className="flex min-h-10 items-center px-2.5 py-2 text-base text-brand-ink transition-colors hover:text-brand-orange lg:min-h-0 lg:px-0 lg:py-0" href="/services" onClick={closeMenus}>Services</Link>
        <Link className="flex min-h-10 items-center px-2.5 py-2 text-base text-brand-ink transition-colors hover:text-brand-orange lg:min-h-0 lg:px-0 lg:py-0" href="/services?section=pricing" onClick={closeMenus}>Pricing</Link>
        <details className="group relative max-lg:static">
          <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-2 whitespace-nowrap px-2.5 py-2 text-base text-brand-ink transition-colors hover:text-brand-orange lg:min-h-0 lg:justify-start lg:px-0 lg:py-0 [&::-webkit-details-marker]:hidden">
            Resources <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="absolute left-0 top-[calc(100%+0.75rem)] z-30 hidden w-56 rounded-lg border border-brand-line bg-white px-4 py-2 shadow-xl group-open:grid max-lg:static max-lg:ml-2 max-lg:mt-0 max-lg:w-auto max-lg:rounded-none max-lg:border-0 max-lg:border-l max-lg:bg-transparent max-lg:px-0 max-lg:py-0 max-lg:pl-2 max-lg:shadow-none">
            <Link className="py-3 text-brand-ink transition-colors hover:text-brand-orange [&+a]:border-t [&+a]:border-brand-line" href="/blog" onClick={closeMenus}>Blog</Link>
            <Link className="py-3 text-brand-ink transition-colors hover:text-brand-orange [&+a]:border-t [&+a]:border-brand-line" href="/resources" onClick={closeMenus}>Tools &amp; templates</Link>
            <Link className="py-3 text-brand-ink transition-colors hover:text-brand-orange" href="/faq" onClick={closeMenus}>FAQs</Link>
          </div>
        </details>
        <Link className="flex min-h-10 items-center px-2.5 py-2 text-base text-brand-ink transition-colors hover:text-brand-orange lg:min-h-0 lg:px-0 lg:py-0" href="/client-feedback" onClick={closeMenus}>Client feedback</Link>
        <Link className="flex min-h-10 items-center px-2.5 py-2 text-base text-brand-ink transition-colors hover:text-brand-orange lg:min-h-0 lg:px-0 lg:py-0" href="/career-audit" onClick={closeMenus}>AI Career Audit</Link>
        <details className="group relative max-lg:static">
          <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-2 whitespace-nowrap px-2.5 py-2 text-base text-brand-ink transition-colors hover:text-brand-orange lg:min-h-0 lg:justify-start lg:px-0 lg:py-0 [&::-webkit-details-marker]:hidden">
            Workspace <ChevronDown aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="absolute left-0 top-[calc(100%+0.75rem)] z-30 hidden w-56 rounded-lg border border-brand-line bg-white px-4 py-2 shadow-xl group-open:grid max-lg:static max-lg:ml-2 max-lg:mt-0 max-lg:w-auto max-lg:rounded-none max-lg:border-0 max-lg:border-l max-lg:bg-transparent max-lg:px-0 max-lg:py-0 max-lg:pl-2 max-lg:shadow-none">
            <Link className="py-3 text-brand-ink transition-colors hover:text-brand-orange [&+a]:border-t [&+a]:border-brand-line" href="/workspace/jobs" onClick={closeMenus}>My saved jobs</Link>
            <Link className="py-3 text-brand-ink transition-colors hover:text-brand-orange [&+a]:border-t [&+a]:border-brand-line" href="/workspace" onClick={closeMenus}>My saved scholarships</Link>
            <Link className="py-3 text-brand-ink transition-colors hover:text-brand-orange" href="/my-audits" onClick={closeMenus}>My audits</Link>
          </div>
        </details>
      </nav>
    </div>
  );
}
