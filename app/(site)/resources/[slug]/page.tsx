import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";
import { contentMetadata, getPublishedContent } from "@/lib/seo";

export const instant = false;

async function ResourceContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail slug={slug} expectedType="resource" />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedContent(slug);
  if (!item || item.type !== "resource") return { title: "Resource not found", robots: { index: false, follow: false } };
  return contentMetadata(item, `/resources/${encodeURIComponent(item.slug)}`);
}

export default function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="grid min-h-[55vh] content-center justify-items-start gap-3 py-12 mx-auto w-full max-w-7xl px-4 sm:px-8">Loading resource…</div>}><ResourceContent params={params} /></Suspense>;
}
