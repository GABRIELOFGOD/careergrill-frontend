import type { Metadata } from "next";
import { PrivacyPage } from "@/components/public-site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Privacy policy",
  "Learn how Careergrill handles account, application, and service information.",
  "/privacy",
);

export default function Privacy() {
  return <PrivacyPage />;
}
