import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";
import { contentMetadata, getPublishedContent } from "@/lib/seo";
import { contentHref } from "@/lib/site-data";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedContent(slug);
  if (!item) return { title: "Page not found", robots: { index: false, follow: false } };
  return contentMetadata(item, contentHref(item.type, item.slug));
}

async function ContentPageBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail slug={slug} />;
}

export default function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="grid min-h-[55vh] content-center justify-items-start gap-3 py-12 mx-auto w-full max-w-7xl px-4 sm:px-8">Loading content…</div>}><ContentPageBody params={params} /></Suspense>;
}
