import { marked } from "marked";
import { apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function contentHtml(value: string, headingIds: string[] = []): string {
  let headingIndex = 0;
  const addHeadingIds = (html: string) => html.replace(/<h2\b([^>]*)>/gi, (openingTag, attributes: string) => {
    const id = headingIds[headingIndex++];
    if (!id || /\bid\s*=/.test(attributes)) return openingTag;
    return `<h2${attributes} id="${id}">`;
  });
  if (/<(?:p|h[1-6]|ul|ol|li|blockquote|strong|em|table|img|a|hr|pre|code|div)(?:\s|>|\/)/i.test(value)) {
    return addHeadingIds(value.replace(
      /(<img\b[^>]*\bsrc=["'])\/api\/content\/assets\/([a-f0-9-]{36})(["'])/gi,
      (_match, prefix: string, id: string, suffix: string) => `${prefix}${apiUrl(`/content/assets/${id}`)}${suffix}`,
    ));
  }
  const html = marked.parse(escapeHtml(value), { async: false, breaks: true });
  return typeof html === "string" ? addHeadingIds(html) : "";
}

export default function RichContent({ value, className, headingIds }: { value: string; className?: string; headingIds?: string[] }) {
  return <div className={cn(
    "[&_p]:mb-4 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-2xl [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-display [&_h3]:text-xl [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:pl-1 [&_li_p]:mb-0 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-orange [&_blockquote]:pl-4 [&_blockquote]:text-brand-muted [&_a]:font-semibold [&_a]:text-brand-orange-dark [&_a]:underline [&_img]:mx-auto [&_img]:my-6 [&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-brand-line [&_th]:bg-brand-blue [&_th]:p-2 [&_th]:text-left [&_td]:border [&_td]:border-brand-line [&_td]:p-2 [&_td]:align-top [&_hr]:my-6 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-brand-line [&_[data-text-box]]:my-4 [&_[data-text-box]]:rounded [&_[data-text-box]]:border [&_[data-text-box]]:border-brand-line [&_[data-text-box]]:p-4",
    className,
  )} dangerouslySetInnerHTML={{ __html: contentHtml(value, headingIds) }} />;
}
