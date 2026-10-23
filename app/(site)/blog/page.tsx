import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogIndexPage as BlogIndexView } from "@/components/blog-pages";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  const pageNumber = Number(page);
  const pathname = Number.isInteger(pageNumber) && pageNumber > 1
    ? `/blog?page=${pageNumber}`
    : "/blog";
  return pageMetadata(
    "Career advice, jobs and scholarships",
    "Practical guides to finding jobs, scholarships, and writing stronger applications.",
    pathname,
  );
}

export default function BlogIndexPage() {
  return <Suspense fallback={<div className="min-h-[55vh]" />}><BlogIndexView /></Suspense>;
}
