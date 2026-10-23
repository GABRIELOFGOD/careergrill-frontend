import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceRecordPage } from "@/components/services-page";
import { contentMetadata, getPublishedContent } from "@/lib/seo";

export const instant = false;

async function ServiceContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ServiceRecordPage slug={slug} />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedContent(slug);
  if (!item || item.type !== "service") return { title: "Service not found", robots: { index: false, follow: false } };
  return contentMetadata(item, `/services/${encodeURIComponent(item.slug)}`);
}

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="grid min-h-[55vh] content-center justify-items-start gap-3 py-12 mx-auto w-full max-w-7xl px-4 sm:px-8">Loading service…</div>}><ServiceContent params={params} /></Suspense>;
}
