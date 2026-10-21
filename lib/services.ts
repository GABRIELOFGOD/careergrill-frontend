export interface ServiceOffer {
  title: string;
  audience: string;
  bullets: string[];
  callToAction: string;
  href: string;
}

export interface ServicePageData {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  overviewTitle: string;
  overviewText: string;
  overviewBullets: string[];
  offers: ServiceOffer[];
  noteTitle: string;
  note: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function servicePageFromContent(data: Record<string, unknown>): ServicePageData | null {
  const page = data.page;
  if (!isRecord(page)) return null;
  const stringFields = ["slug", "category", "title", "excerpt", "overviewTitle", "overviewText", "noteTitle", "note"] as const;
  if (!stringFields.every((field) => typeof page[field] === "string")
    || !isStringList(page.overviewBullets)
    || !Array.isArray(page.offers)) return null;

  const offers: ServiceOffer[] = [];
  for (const item of page.offers) {
    if (!isRecord(item)
      || typeof item.title !== "string"
      || typeof item.audience !== "string"
      || !isStringList(item.bullets)
      || typeof item.callToAction !== "string"
      || typeof item.href !== "string") return null;
    offers.push({
      title: item.title,
      audience: item.audience,
      bullets: item.bullets,
      callToAction: item.callToAction,
      href: item.href,
    });
  }

  return {
    slug: page.slug as string,
    category: page.category as string,
    title: page.title as string,
    excerpt: page.excerpt as string,
    overviewTitle: page.overviewTitle as string,
    overviewText: page.overviewText as string,
    overviewBullets: page.overviewBullets,
    offers,
    noteTitle: page.noteTitle as string,
    note: page.note as string,
  };
}

export function serviceFaqsFromConfig(value: unknown): ServiceFaq[] | null {
  if (!Array.isArray(value)) return null;
  const faqs: ServiceFaq[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.question !== "string" || typeof item.answer !== "string") return null;
    faqs.push({ question: item.question, answer: item.answer });
  }
  return faqs;
}
