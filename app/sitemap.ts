import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { absoluteSiteUrl, getPublishedContentList } from "@/lib/seo";
import { contentHref } from "@/lib/site-data";

const staticPaths = [
  "/",
  "/jobs",
  "/scholarships",
  "/services",
  "/resources",
  "/blog",
  "/client-feedback",
  "/career-audit",
  "/consultation",
  "/faq",
  "/privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const content = await getPublishedContentList();
  const staticEntries = staticPaths.map((path) => ({
    url: absoluteSiteUrl(path),
    changeFrequency: path === "/" ? "daily" as const : "weekly" as const,
  }));
  const contentEntries = content.map((item) => ({
    url: absoluteSiteUrl(contentHref(item.type, item.slug)),
    lastModified: item.published_at ? new Date(item.published_at) : undefined,
    changeFrequency: "weekly" as const,
  }));
  return [...staticEntries, ...contentEntries];
}
