import type { Metadata } from "next";
import { Suspense } from "react";
import ScholarshipDetailPage from "@/components/scholarship-detail/scholarship-detail-page";
import { contentMetadata, getPublishedContent } from "@/lib/seo";

export const instant = false;

async function ScholarshipContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ScholarshipDetailPage slug={slug} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedContent(slug);
  if (!item || item.type !== "scholarship") return { title: "Scholarship not found", robots: { index: false, follow: false } };
  return contentMetadata(item, `/scholarship/${encodeURIComponent(item.slug)}`);
}

export default function ScholarshipPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="py-8">Loading scholarship…</div>}><ScholarshipContent params={params} /></Suspense>;
}
