import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";

async function FaqContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail slug={slug} expectedType="faq" />;
}

export default function FaqPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="simple-page content-wrap">Loading answer…</div>}><FaqContent params={params} /></Suspense>;
}
