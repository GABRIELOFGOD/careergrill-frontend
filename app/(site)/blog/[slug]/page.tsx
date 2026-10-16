import { Suspense } from "react";
import { BlogPage } from "@/components/public-site";

async function ArticleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPage articleSlug={slug} />;
}

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="simple-page content-wrap">Loading article…</div>}><ArticleContent params={params} /></Suspense>;
}
