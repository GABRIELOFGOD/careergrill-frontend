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

function contentHtml(value: string): string {
  if (/<(?:p|h[1-6]|ul|ol|li|blockquote|strong|em|table|img|a|hr|pre|code)(?:\s|>|\/)/i.test(value)) {
    return value.replace(
      /(<img\b[^>]*\bsrc=["'])\/api\/content\/assets\/([a-f0-9-]{36})(["'])/gi,
      (_match, prefix: string, id: string, suffix: string) => `${prefix}${apiUrl(`/content/assets/${id}`)}${suffix}`,
    );
  }
  const html = marked.parse(escapeHtml(value), { async: false, breaks: true });
  return typeof html === "string" ? html : "";
}

export default function RichContent({ value, className }: { value: string; className: string }) {
  return <div className={`rich-content ${className}`} dangerouslySetInnerHTML={{ __html: contentHtml(value) }} />;
}
