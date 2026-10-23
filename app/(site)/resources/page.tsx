import type { Metadata } from "next";
import { ResourcePage } from "@/components/public-site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Career resources and application tools",
  "Use practical templates, checklists, and tools to plan stronger job and scholarship applications.",
  "/resources",
);

export default function ResourcesPage() {
  return <ResourcePage />;
}
