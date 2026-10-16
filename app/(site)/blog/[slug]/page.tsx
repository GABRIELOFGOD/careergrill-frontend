import { Suspense } from "react";
import { BlogArticlePage as BlogArticle } from "@/components/blog-pages";

async function ArticleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogArticle slug={slug} />;
}

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="simple-page content-wrap">Loading article…</div>}><ArticleContent params={params} /></Suspense>;
}
