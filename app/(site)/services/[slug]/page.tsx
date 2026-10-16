import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";

async function ServiceContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail slug={slug} expectedType="service" />;
}

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="simple-page content-wrap">Loading service…</div>}><ServiceContent params={params} /></Suspense>;
}
