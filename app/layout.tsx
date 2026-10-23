import type { Metadata } from "next";
import { jsonLdScript, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://careergrill.com"),
  title: {
    default: "Careergrill | Jobs, scholarships and application support",
    template: "%s | Careergrill",
  },
  description: "Make sense of your strengths, choose where to apply, and build applications that reflect what you can offer.",
  applicationName: "Careergrill",
  openGraph: {
    type: "website",
    siteName: "Careergrill",
    title: "Careergrill | Jobs, scholarships and application support",
    description: "Make sense of your strengths, choose where to apply, and build applications that reflect what you can offer.",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Careergrill" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careergrill | Jobs, scholarships and application support",
    description: "Make sense of your strengths, choose where to apply, and build applications that reflect what you can offer.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const organizationData = jsonLdScript({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl.origin}/#organization`,
        name: "Careergrill",
        url: siteUrl.origin,
        logo: `${siteUrl.origin}/logo.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl.origin}/#website`,
        name: "Careergrill",
        url: siteUrl.origin,
        publisher: { "@id": `${siteUrl.origin}/#organization` },
      },
    ],
  });
  return (
    <html lang="en" className="font-sans">
      <body className="min-h-screen text-base leading-relaxed antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationData }} />
        {children}
      </body>
    </html>
  );
}
