import type { ReactNode } from "react";
import { SiteChrome } from "@/components/site-shell";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
