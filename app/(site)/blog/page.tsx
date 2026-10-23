import { Suspense } from "react";
import { BlogIndexPage as BlogIndexView } from "@/components/blog-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Career advice, jobs and scholarships",
  "Practical guides to finding jobs, scholarships, and writing stronger applications.",
  "/blog",
);

export default function BlogIndexPage() {
  return <Suspense fallback={<div className="min-h-[55vh]" />}><BlogIndexView /></Suspense>;
}
