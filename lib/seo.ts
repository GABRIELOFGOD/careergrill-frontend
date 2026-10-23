import type { Metadata } from "next";
import type { SiteContent } from "@/lib/site-data";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://careergrill.com");

export function absoluteSiteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

function contentDescription(item: SiteContent): string {
  const customDescription = item.data.seo_description;
  const source = typeof customDescription === "string" && customDescription.trim()
    ? customDescription
    : item.excerpt || item.body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return source.slice(0, 160);
}

function contentImage(item: SiteContent): string {
  const image = item.data.seo_image;
  if (typeof image === "string" && image.trim()) {
    try {
      const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
      const imageBase = image.startsWith("/api/") && configuredUrl && configuredUrl !== "/"
        ? new URL(configuredUrl)
        : siteUrl;
      const url = new URL(image, imageBase);
      if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
    } catch {
      // Invalid optional image URLs use the site-wide branded fallback.
    }
  }
  return absoluteSiteUrl("/opengraph-image");
}

export function contentMetadata(item: SiteContent, pathname: string): Metadata {
  const customTitle = item.data.seo_title;
  const title = typeof customTitle === "string" && customTitle.trim() ? customTitle : item.title;
  const description = contentDescription(item);
  const url = absoluteSiteUrl(pathname);
  const image = contentImage(item);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: item.type === "article" ? "article" : "website",
      title,
      description,
      url,
      siteName: "Careergrill",
      images: [{ url: image, width: 1200, height: 630, alt: item.title }],
      ...(item.type === "article" && item.published_at
        ? { publishedTime: item.published_at }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function pageMetadata(title: string, description: string, pathname: string): Metadata {
  const url = absoluteSiteUrl(pathname);
  const image = absoluteSiteUrl("/opengraph-image");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "Careergrill",
      images: [{ url: image, width: 1200, height: 630, alt: "Careergrill" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function contentStructuredData(item: SiteContent, pathname: string) {
  const description = contentDescription(item);
  return {
    "@context": "https://schema.org",
    "@type": item.type === "article" ? "BlogPosting" : "WebPage",
    headline: item.title,
    name: item.title,
    description,
    url: absoluteSiteUrl(pathname),
    image: contentImage(item),
    ...(item.type === "article"
      ? {
        author: {
          "@type": "Person",
          name: typeof item.data.author === "string" && item.data.author.trim()
            ? item.data.author
            : "Careergrill",
        },
        ...(item.published_at ? { datePublished: item.published_at } : {}),
      }
      : {}),
  };
}

export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function contentApiOrigin(): string {
  const proxyTarget = process.env.API_PROXY_TARGET;
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  if (configuredUrl && configuredUrl !== "/") return configuredUrl.replace(/\/$/, "");
  if (proxyTarget) return proxyTarget.replace(/\/$/, "");
  return "http://localhost:4000";
}

export async function getPublishedContent(slug: string): Promise<SiteContent | null> {
  const response = await fetch(
    `${contentApiOrigin()}/api/content/${encodeURIComponent(slug)}`,
    { next: { revalidate: 300 } },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Could not load SEO content (${response.status}).`);
  const payload = await response.json() as { item?: SiteContent };
  if (!payload.item) throw new Error("The content API returned an invalid content response.");
  return payload.item;
}

export async function getPublishedContentList(): Promise<Pick<SiteContent, "type" | "slug" | "published_at">[]> {
  const response = await fetch(`${contentApiOrigin()}/api/content?sitemap=1`, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`Could not load sitemap content (${response.status}).`);
  const payload = await response.json() as { items?: Pick<SiteContent, "type" | "slug" | "published_at">[] };
  if (!Array.isArray(payload.items)) throw new Error("The content API returned an invalid sitemap response.");
  return payload.items;
}
