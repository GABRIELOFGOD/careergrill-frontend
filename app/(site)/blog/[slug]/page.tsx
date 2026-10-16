import { Suspense } from "react";
import { BlogArticlePage as BlogArticle } from "@/components/blog-pages";

async function ArticleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogArticle slug={slug} />;
}

export default function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="grid min-h-[55vh] content-center justify-items-start gap-3 py-12 mx-auto w-full max-w-7xl px-4 sm:px-8">Loading article…</div>}><ArticleContent params={params} /></Suspense>;
}
