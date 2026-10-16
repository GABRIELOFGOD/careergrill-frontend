import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";

async function ResourceContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail slug={slug} expectedType="resource" />;
}

export default function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="simple-page content-wrap">Loading resource…</div>}><ResourceContent params={params} /></Suspense>;
}
