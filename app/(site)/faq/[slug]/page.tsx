import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";

async function FaqContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail slug={slug} expectedType="faq" />;
}

export default function FaqPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="grid min-h-[55vh] content-center justify-items-start gap-3 py-12 mx-auto w-full max-w-7xl px-4 sm:px-8">Loading answer…</div>}><FaqContent params={params} /></Suspense>;
}
