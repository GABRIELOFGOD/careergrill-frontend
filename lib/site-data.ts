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
    id: "sample-resource-deadline",
    type: "resource",
    title: "Plan an application backwards from the deadline",
    slug: "plan-application-backwards-from-deadline",
    excerpt: "Give documents, referees and final checks their own dates in your plan.",
    body: "## Work backwards from submission\n\nRecord the official deadline, time zone and submission method. Add a buffer before the deadline for technical issues and final checks.\n\n## Set milestones\n\nList each required document, who needs to provide it and when you will request or complete it. Set a review date before submission and confirm that every document follows the current instructions.\n\n## Recheck the official source\n\nDeadlines and requirements can change. Check the provider's current page and save the date you confirmed the details.",
    category: "Graduate admissions",
    tags: ["worksheet", "planning", "deadlines"],
    expires_at: null,
    source_url: null,
    data: { format: "Worksheet" },
  },
  {
    id: "sample-resource-motivation-letter",
    type: "resource",
    title: "Plan your scholarship motivation letter",
    slug: "plan-scholarship-motivation-letter",
    excerpt: "Map your study goal and experience to the scholarship's actual questions.",
    body: "## Start with the prompt\n\nCopy the exact question and note the word limit and selection criteria. For each criterion, write one example you can explain.\n\n## Connect your evidence\n\nRecord what happened, your own contribution and what changed. Then note how the scholarship supports a realistic next step in your study or work.\n\n## Check before drafting\n\nConfirm the award details and eligibility on the official provider page. Draft in your own words and check that every paragraph responds to the prompt.",
    category: "Scholarships",
    tags: ["template", "scholarships", "motivation letter"],
    expires_at: null,
    source_url: null,
    data: { format: "Template" },
  },
  {
    id: "sample-resource-fellowship-criteria",
    type: "resource",
    title: "Match your experience to a fellowship’s criteria",
    slug: "match-experience-fellowship-criteria",
    excerpt: "Build examples around the criteria before you start writing the application.",
    body: "## Choose a criterion\n\nCopy one selection criterion from the current fellowship instructions. Note what the panel is asking applicants to demonstrate.\n\n## Find a relevant example\n\nDescribe the situation, your responsibility, the decision or action you took, and what followed. Include limits or setbacks where they help explain the outcome.\n\n## Connect the example to the fellowship\n\nExplain what you learned and how it prepares you for the fellowship's actual activities. Check the official instructions before submitting.",
    category: "Fellowships",
    tags: ["worksheet", "fellowships", "selection criteria"],
    expires_at: null,
    source_url: null,
    data: { format: "Worksheet" },
  },
  {
    id: "sample-resource-mba-story-bank",
    type: "resource",
    title: "Build an MBA story bank",
    slug: "build-mba-story-bank",
    excerpt: "Collect examples of leadership, judgement and learning before drafting essays.",
    body: "## Capture useful experiences\n\nChoose examples from work, study or community activities where you had a clear responsibility. For each one, write the context, your decision, the people affected and what changed.\n\n## Record what you learned\n\nNote what you would repeat or do differently. Keep the detail specific and verifiable rather than relying on broad claims.\n\n## Connect stories to the application\n\nReview the current MBA essay prompts and map each story to a question it can answer. Adapt the example to the prompt instead of reusing the same essay.",
    category: "MBA applications",
    tags: ["worksheet", "MBA", "leadership"],
    expires_at: null,
    source_url: null,
    data: { format: "Worksheet" },
  },
  {
    id: "sample-resource-referee-brief",
    type: "resource",
    title: "Prepare a useful brief for your referee",
    slug: "prepare-brief-for-referee",
    excerpt: "Give your referee the context, evidence and submission details they need.",
    body: "## Share the essentials\n\nSend the official programme or award link, the deadline and submission instructions. Confirm that your referee is available and understands how the reference will be submitted.\n\n## Provide relevant context\n\nInclude your current CV, the application prompt and a short note about the work or study you have done together. Suggest examples they may remember without scripting their response.\n\n## Follow up thoughtfully\n\nAgree a reminder date and thank your referee after submission. Do not share their reference without permission.",
    category: "Graduate admissions",
    tags: ["template", "referees", "planning"],
    expires_at: null,
    source_url: null,
    data: { format: "Template" },
  },
  {
    id: "sample-resource-phd-preparation",
    type: "resource",
    title: "Check your preparation for a PhD application",
    slug: "phd-application-preparation-checklist",
    excerpt: "Connect your research question to supervision, methods and funding requirements.",
    body: "## Clarify your research direction\n\nSummarise the question you want to investigate and why it matters. Identify the methods or preparation the project may require.\n\n## Check the programme\n\nReview current entry requirements, supervision arrangements, application materials and funding routes on the university's official pages. Confirm whether prospective supervisors should be contacted and what information they request.\n\n## Plan your next steps\n\nList the evidence or skills you still need, the documents to prepare and the dates for each action. Recheck the programme details before applying.",
    category: "Graduate admissions",
    tags: ["checklist", "PhD", "research"],
    expires_at: null,
    source_url: null,
    data: { format: "Checklist" },
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
