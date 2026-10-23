import type { Metadata } from "next";
import { ScholarshipListingPage } from "@/components/scholarship-listing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Scholarships and funding opportunities",
  "Find scholarships, fellowships, and funding opportunities with application details.",
  "/scholarships",
);

export default function ScholarshipsPage() {
  return <ScholarshipListingPage />;
}
