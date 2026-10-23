import type { Metadata } from "next";
import { Suspense } from "react";
import JobDetailPage from "@/components/job-detail/job-detail-page";
import { contentMetadata, getPublishedContent } from "@/lib/seo";

export const instant = false;

async function JobContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <JobDetailPage slug={slug} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedContent(slug);
  if (!item || item.type !== "job") return { title: "Job not found", robots: { index: false, follow: false } };
  return contentMetadata(item, `/job/${encodeURIComponent(item.slug)}`);
}

export default function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">Loading job details…</div>}><JobContent params={params} /></Suspense>;
}
