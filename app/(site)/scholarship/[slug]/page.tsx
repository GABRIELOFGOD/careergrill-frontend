import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";

async function ScholarshipContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail slug={slug} expectedType="scholarship" />;
}

export default function ScholarshipPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="simple-page content-wrap">Loading scholarship…</div>}><ScholarshipContent params={params} /></Suspense>;
}
