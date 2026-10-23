import type { MetadataRoute } from "next";
import { absoluteSiteUrl, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/workspace/", "/my-audits", "/signin", "/verify-email"],
    },
    sitemap: absoluteSiteUrl("/sitemap.xml"),
    host: siteUrl.origin,
  };
}
