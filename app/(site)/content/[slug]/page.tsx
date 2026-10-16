import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";

async function ContentPageBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail slug={slug} />;
}

export default function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="grid min-h-[55vh] content-center justify-items-start gap-3 py-12 mx-auto w-full max-w-7xl px-4 sm:px-8">Loading content…</div>}><ContentPageBody params={params} /></Suspense>;
}
