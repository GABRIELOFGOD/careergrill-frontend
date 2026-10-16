import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";

async function ContentPageBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail slug={slug} />;
}

export default function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="simple-page content-wrap">Loading content…</div>}><ContentPageBody params={params} /></Suspense>;
}
