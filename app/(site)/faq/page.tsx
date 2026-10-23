import type { Metadata } from "next";
import { FaqPage } from "@/components/public-site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Frequently asked questions",
  "Get answers about Careergrill services, jobs, scholarships, and application support.",
  "/faq",
);

export default function Faq() {
  return <FaqPage />;
}
