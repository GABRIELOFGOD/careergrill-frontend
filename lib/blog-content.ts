export interface ArticleSection {
  title: string;
  id: string;
}

export function articleReadTimeMinutes(body: string): number {
  const text = body
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|amp|lt|gt|quot|#39);/gi, " ");
  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function articleSections(body: string): ArticleSection[] {
  const htmlHeadings = [...body.matchAll(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi)]
    .map((match) => ({
      title: match[2] ?? "",
      id: match[1]?.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1],
    }));
  const markdownHeadings = [...body.matchAll(/^\s*##\s+(.+?)\s*#*\s*$/gm)]
    .map((match) => ({ title: match[1] ?? "", id: undefined }));
  const headings = htmlHeadings.length ? htmlHeadings : markdownHeadings;
  const seen = new Map<string, number>();
  return headings.map(({ title: rawTitle, id }) => {
    const title = rawTitle.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").trim();
    const base = title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return { title, id: id || (count === 1 ? base : `${base}-${count}`) };
  });
}
