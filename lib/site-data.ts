export type ContentType = "job" | "scholarship" | "article" | "resource" | "service" | "testimonial";

const contentCollectionPaths: Record<ContentType, string> = {
  job: "/job",
  scholarship: "/scholarship",
  article: "/blog",
  resource: "/resources",
  service: "/services",
  testimonial: "/client-feedback",
};

export function contentHref(type: ContentType, slug: string): string {
  return `${contentCollectionPaths[type]}/${encodeURIComponent(slug)}`;
}

export interface SiteContent {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  status?: string;
  expires_at: string | null;
  source_url: string | null;
  data: Record<string, unknown>;
  published_at?: string;
}

export const navigation = [
  { label: "Find jobs", href: "/jobs" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Career Audit", href: "/career-audit" },
];
