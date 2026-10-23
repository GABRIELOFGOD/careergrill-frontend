import { permanentRedirect } from "next/navigation";

export const instant = false;

export default async function LegacyBlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/${encodeURIComponent(slug)}`);
}
