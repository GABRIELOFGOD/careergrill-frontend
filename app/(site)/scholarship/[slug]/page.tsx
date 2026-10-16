import { Suspense } from "react";
import ScholarshipDetailPage from "@/components/scholarship-detail/scholarship-detail-page";

async function ScholarshipContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ScholarshipDetailPage slug={slug} />;
}

export default function ScholarshipPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="py-8">Loading scholarship…</div>}><ScholarshipContent params={params} /></Suspense>;
}
