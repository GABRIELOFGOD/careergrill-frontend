export type ContentType = "job" | "scholarship" | "article" | "resource" | "service" | "faq" | "testimonial";

const contentCollectionPaths: Record<ContentType, string> = {
  job: "/job",
  scholarship: "/scholarship",
  article: "/blog",
  resource: "/resources",
  service: "/services",
  faq: "/faq",
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

export const sampleContent: SiteContent[] = [
  {
    id: "sample-article-fit",
    type: "article",
    title: "Write a scholarship letter with evidence behind it.",
    slug: "explain-programme-fit",
    excerpt: "Learn how to choose the right achievements, explain why you deserve consideration, and connect your goals to a scholarship’s selection criteria.",
    body: "Start with the scholarship’s selection criteria. Choose specific achievements that show how you meet them, then explain what you learned and what changed because of your contribution.\n\nConnect your goals to the scholarship’s purpose and show how the opportunity will help you contribute. Use details you can explain and verify rather than broad claims.\n\nBefore you submit, check the prompt, eligibility requirements and deadline against the official scholarship page.",
    category: "Scholarships",
    tags: ["scholarships", "application letters"],
    expires_at: null,
    source_url: null,
    data: { reading_minutes: 4 },
  },
  {
    id: "sample-resource-sop",
    type: "resource",
    title: "Before you send your SOP for review",
    slug: "sop-review-checklist",
    excerpt: "Check the prompt, programme fit and evidence in your draft before asking for feedback.",
    body: "I have answered the actual prompt.\nI can connect my experience to the programme.\nI checked names, dates and requirements against official sources.\nMy examples explain what I did and what changed.\nThe draft still sounds like me.",
    category: "Graduate admissions",
    tags: ["checklist", "statement of purpose"],
    expires_at: null,
    source_url: null,
    data: { format: "Checklist" },
  },
  {
    id: "sample-resource-funding",
    type: "resource",
    title: "What does the funding actually cover?",
    slug: "check-scholarship-funding",
    excerpt: "Record what the award pays for and which costs remain.",
    body: "Check the official award information for tuition, living costs, travel, insurance and any other eligible expenses. Note which costs are not covered and whether the award is paid directly or reimbursed.\n\nConfirm the current award terms with the provider before making financial commitments.",
    category: "Scholarships",
    tags: ["scholarships", "funding", "checklist"],
    expires_at: null,
    source_url: null,
    data: { format: "Checklist" },
  },
  {
    id: "sample-resource-cv",
    type: "resource",
    title: "Find the evidence in your experience.",
    slug: "turn-work-into-cv-evidence",
    excerpt: "Find your contribution in everyday work and explain what changed because of it.",
    body: "What task or problem needed attention?\nWhat did you decide or do?\nWho or what was affected?\nWhat changed, and how do you know?\n\nWrite a specific example before turning it into a CV bullet.",
    category: "Career documents",
    tags: ["worksheet", "CV"],
    expires_at: null,
    source_url: null,
    data: { format: "Worksheet" },
  },
  {
    id: "sample-job",
    type: "job",
    title: "Early-career opportunities",
    slug: "early-career-opportunities",
    excerpt: "Use the employer source to check current roles, eligibility and application dates.",
    body: "This is a research starting point. Confirm the live role, eligibility, location and closing date on the employer’s official page before you apply.",
    category: "Graduate programme",
    tags: ["Graduate programme", "Entry level"],
    expires_at: null,
    source_url: null,
    data: { employer: "Check current employer listings", location: "Nigeria", status_note: "Availability needs checking" },
  },
  {
    id: "sample-scholarship",
    type: "scholarship",
    title: "Scholarship and fellowship directory",
    slug: "scholarship-fellowship-directory",
    excerpt: "Research awards by study level, destination and funding type. Verify the current cycle with each provider.",
    body: "Start by checking the official provider’s eligibility, eligible programmes, award coverage and current deadline. Save the opportunity to keep notes and a reminder.",
    category: "Funding research",
    tags: ["Scholarships", "Fellowships"],
    expires_at: null,
    source_url: null,
    data: { study_level: "Multiple levels", destination: "Multiple countries", status_note: "Research lead — verify current cycle" },
  },
];

export const navigation = [
  { label: "Find jobs", href: "/jobs" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Career Audit", href: "/career-audit" },
];
