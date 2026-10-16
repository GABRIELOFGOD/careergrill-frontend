"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function SiteNavigation() {
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function closeMenus(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      navigationRef.current?.querySelectorAll("details[open]").forEach((menu) => {
        if (!menu.contains(target)) menu.removeAttribute("open");
      });
    }

    function closeMenusOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
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
    navigationRef.current?.querySelectorAll("details[open]").forEach((menu) => {
      menu.removeAttribute("open");
    });
  }

  return (
    <nav ref={navigationRef} className="primary-nav" aria-label="Main navigation">
      <details className="nav-menu">
        <summary>Opportunities</summary>
        <div className="nav-dropdown">
          <Link href="/jobs" onClick={closeMenus}>Find jobs</Link>
          <Link href="/scholarships" onClick={closeMenus}>Find scholarships</Link>
        </div>
      </details>
      <Link href="/services">Services</Link>
      <details className="nav-menu">
        <summary>Resources</summary>
        <div className="nav-dropdown">
          <Link href="/blog" onClick={closeMenus}>Blog</Link>
          <Link href="/resources" onClick={closeMenus}>Tools &amp; templates</Link>
          <Link href="/faq" onClick={closeMenus}>FAQs</Link>
        </div>
      </details>
      <Link href="/client-feedback">Client feedback</Link>
      <Link href="/career-audit">AI Career Audit</Link>
      <details className="nav-menu">
        <summary>Workspace</summary>
        <div className="nav-dropdown">
          <Link href="/workspace/jobs" onClick={closeMenus}>My saved jobs</Link>
          <Link href="/workspace" onClick={closeMenus}>My saved scholarships</Link>
          <Link href="/my-audits" onClick={closeMenus}>My audits</Link>
        </div>
      </details>
    </nav>
  );
}
