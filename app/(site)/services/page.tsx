import type { Metadata } from "next";
import ServicesPage from "@/components/services-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Career support and application services",
  "Explore career guidance and application support to make your next move with confidence.",
  "/services",
);

export default function Services() {
  return <ServicesPage />;
}
