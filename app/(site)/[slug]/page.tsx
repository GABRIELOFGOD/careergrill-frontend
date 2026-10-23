import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogArticlePage } from "@/components/blog-pages";
import { contentMetadata, contentStructuredData, getPublishedContent, jsonLdScript } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedContent(slug);
  if (!item || item.type !== "article") {
    return { title: "Page not found", robots: { index: false, follow: false } };
  }
  return contentMetadata(item, `/${encodeURIComponent(item.slug)}`);
}

export default async function BlogArticleRoute({ params }: Props) {
  const { slug } = await params;
  const item = await getPublishedContent(slug);
  if (!item || item.type !== "article") notFound();
  const schema = jsonLdScript(contentStructuredData(item, `/${encodeURIComponent(item.slug)}`));
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
    <BlogArticlePage key={slug} slug={slug} initialArticle={item} />
  </>;
}
