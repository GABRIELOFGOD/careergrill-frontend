import type { Metadata } from "next";
import { HomePage } from "@/components/public-site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Jobs, scholarships and career support",
  "Find jobs, scholarships, career advice, and practical support to make stronger applications.",
  "/",
);

export default function Home() {
  return <HomePage />;
}
