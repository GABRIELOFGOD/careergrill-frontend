import { Suspense } from "react";
import { ContentDetail } from "@/components/public-site";
import { ServiceDetailPage } from "@/components/services-page";
import { servicePages } from "@/lib/services";

async function ServiceContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = servicePages.find((item) => item.slug === slug);
  if (service) return <ServiceDetailPage service={service} />;
  return <ContentDetail slug={slug} expectedType="service" />;
}

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="simple-page content-wrap">Loading service…</div>}><ServiceContent params={params} /></Suspense>;
}
