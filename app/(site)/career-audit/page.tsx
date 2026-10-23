import type { Metadata } from "next";
import { AuditPage } from "@/components/public-site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Career audit and career direction",
  "Understand your strengths, clarify your career direction, and identify practical next steps.",
  "/career-audit",
);

export default function CareerAuditPage() {
  return <AuditPage />;
}
