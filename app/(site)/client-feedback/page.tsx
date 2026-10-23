import type { Metadata } from "next";
import { FeedbackPage } from "@/components/public-site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Careergrill client feedback",
  "Read feedback from people who have used Careergrill career and application support.",
  "/client-feedback",
);

export default function ClientFeedbackPage() {
  return <FeedbackPage />;
}
