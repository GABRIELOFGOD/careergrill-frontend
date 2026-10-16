import { marked } from "marked";
import { apiUrl } from "@/lib/api";

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

export default function RichContent({ value, className, headingIds }: { value: string; className: string; headingIds?: string[] }) {
  return <div className={`rich-content ${className}`} dangerouslySetInnerHTML={{ __html: contentHtml(value, headingIds) }} />;
}
