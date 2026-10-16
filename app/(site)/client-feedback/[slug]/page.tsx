import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";

async function FeedbackContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentDetail slug={slug} expectedType="testimonial" />;
}

export default function FeedbackDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="simple-page content-wrap">Loading client feedback…</div>}><FeedbackContent params={params} /></Suspense>;
}
