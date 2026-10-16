import { Suspense } from "react";
import JobDetailPage from "@/components/job-detail/job-detail-page";

async function JobContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <JobDetailPage slug={slug} />;
}

export default function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">Loading job details…</div>}><JobContent params={params} /></Suspense>;
}
