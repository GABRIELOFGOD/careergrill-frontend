import type { Metadata } from "next";
import { JobListingPage } from "@/components/job-listing-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Jobs and career opportunities",
  "Explore current job opportunities and practical support for stronger applications.",
  "/jobs",
);

export default function JobsPage() {
  return <JobListingPage />;
}
