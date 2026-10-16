"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    <div className="nav-container" ref={containerRef}>
      <button
        className="mobile-nav-toggle"
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">{isOpen ? "×" : "☰"}</span>
      </button>
      <nav ref={navigationRef} id="primary-navigation" className={`primary-nav${isOpen ? " is-open" : ""}`} aria-label="Main navigation">
        <details className="nav-menu">
          <summary>Opportunities</summary>
          <div className="nav-dropdown">
            <Link href="/jobs" onClick={closeMenus}>Find jobs</Link>
            <Link href="/scholarships" onClick={closeMenus}>Find scholarships</Link>
          </div>
        </details>
        <Link href="/services" onClick={closeMenus}>Services</Link>
        <Link href="/services?section=pricing" onClick={closeMenus}>Pricing</Link>
        <details className="nav-menu">
          <summary>Resources</summary>
          <div className="nav-dropdown">
            <Link href="/blog" onClick={closeMenus}>Blog</Link>
            <Link href="/resources" onClick={closeMenus}>Tools &amp; templates</Link>
            <Link href="/faq" onClick={closeMenus}>FAQs</Link>
          </div>
        </details>
        <Link href="/client-feedback" onClick={closeMenus}>Client feedback</Link>
        <Link href="/career-audit" onClick={closeMenus}>AI Career Audit</Link>
        <details className="nav-menu">
          <summary>Workspace</summary>
          <div className="nav-dropdown">
            <Link href="/workspace/jobs" onClick={closeMenus}>My saved jobs</Link>
            <Link href="/workspace" onClick={closeMenus}>My saved scholarships</Link>
            <Link href="/my-audits" onClick={closeMenus}>My audits</Link>
          </div>
        </details>
      </nav>
    </div>
  );
}
