export type ResourceInputType = "text" | "textarea" | "checkbox" | "url" | "date" | "select";

export interface ResourceInput {
  id: string;
  label: string;
  type: ResourceInputType;
  placeholder?: string;
  options?: string[];
}

export interface ResourceSection {
  id: string;
  title: string;
  content: string;
  fields: ResourceInput[];
}

export interface ResourceSchema {
  sections: ResourceSection[];
}

export interface ResourceAttachment {
  id: string;
  filename: string;
  mimetype: string;
  size_bytes: number;
}

function isResourceInput(value: unknown): value is ResourceInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const field = value as Record<string, unknown>;
  return typeof field.id === "string"
    && typeof field.label === "string"
    && ["text", "textarea", "checkbox", "url", "date", "select"].includes(String(field.type))
    && (field.placeholder === undefined || typeof field.placeholder === "string")
    && (field.options === undefined || (Array.isArray(field.options) && field.options.every((option) => typeof option === "string")));
}

function isResourceSection(value: unknown): value is ResourceSection {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const section = value as Record<string, unknown>;
  return typeof section.id === "string"
    && typeof section.title === "string"
    && typeof section.content === "string"
    && Array.isArray(section.fields)
    && section.fields.every(isResourceInput);
}

export function readResourceSchema(value: unknown): ResourceSchema {
  if (!value || typeof value !== "object") return { sections: [] };
  const sections = (value as { sections?: unknown }).sections;
  if (!Array.isArray(sections)) return { sections: [] };
  return { sections: sections.filter(isResourceSection) };
}
