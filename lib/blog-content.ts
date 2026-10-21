export interface ArticleSection {
  title: string;
  id: string;
}

export function articleSections(body: string): ArticleSection[] {
  const htmlHeadings = [...body.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map((match) => match[1] ?? "");
  const markdownHeadings = [...body.matchAll(/^\s*##\s+(.+?)\s*#*\s*$/gm)]
    .map((match) => match[1] ?? "");
  const headings = htmlHeadings.length ? htmlHeadings : markdownHeadings;
  const seen = new Map<string, number>();
  return headings.map((heading) => {
    const title = heading.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").trim();
    const base = title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return { title, id: count === 1 ? base : `${base}-${count}` };
  });
}
