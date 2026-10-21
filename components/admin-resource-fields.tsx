"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import type { ResourceAttachment, ResourceInput, ResourceInputType, ResourceSchema, ResourceSection } from "@/lib/resource-tools";
import { readResourceSchema } from "@/lib/resource-tools";

const inputTypes: ResourceInputType[] = ["text", "textarea", "checkbox", "url", "date", "select"];

function createSection(): ResourceSection {
  return { id: crypto.randomUUID(), title: "New section", content: "", fields: [] };
}

function createField(): ResourceInput {
  return { id: crypto.randomUUID(), label: "New question", type: "textarea", placeholder: "" };
}

export default function AdminResourceFields({
  value,
  onChange,
  attachments,
  onAttachmentsChange,
  files,
  onFilesChange,
  resourceId,
}: {
  value: string;
  onChange: (value: string) => void;
  attachments: ResourceAttachment[];
  onAttachmentsChange: (attachments: ResourceAttachment[]) => void;
  files: File[];
  onFilesChange: (files: File[]) => void;
  resourceId: string;
}) {
  const [busyAttachmentId, setBusyAttachmentId] = useState("");
  const [attachmentError, setAttachmentError] = useState("");
  const schema = readResourceSchema(parseSchema(value));

  function parseSchema(serialized: string): unknown {
    try {
      return JSON.parse(serialized) as unknown;
    } catch {
      return null;
    }
  }

  function update(next: ResourceSchema) {
    onChange(JSON.stringify(next));
  }

  function updateSection(sectionId: string, patch: Partial<ResourceSection>) {
    update({ sections: schema.sections.map((section) => section.id === sectionId ? { ...section, ...patch } : section) });
  }

  function updateField(sectionId: string, fieldId: string, patch: Partial<ResourceInput>) {
    update({
      sections: schema.sections.map((section) => section.id === sectionId
        ? { ...section, fields: section.fields.map((field) => field.id === fieldId ? { ...field, ...patch } : field) }
        : section),
    });
  }

  async function removeAttachment(attachment: ResourceAttachment) {
    if (!resourceId) return;
    setBusyAttachmentId(attachment.id);
    setAttachmentError("");
    try {
      await apiRequest(`/admin/content/resources/${resourceId}/attachments/${attachment.id}`, { method: "DELETE" });
      onAttachmentsChange(attachments.filter((item) => item.id !== attachment.id));
    } catch (error) {
      setAttachmentError(error instanceof Error ? error.message : "Could not remove this download.");
    } finally {
      setBusyAttachmentId("");
    }
  }

  return <section className="grid gap-4 rounded border border-brand-line bg-brand-cream p-4">
    <div><h3 className="mb-1 text-lg">Resource sections and questions</h3><p className="mb-0 text-sm text-brand-muted">Add the content and the specific response fields readers should complete in each section.</p></div>
    {schema.sections.map((section, sectionIndex) => <article className="grid gap-3 rounded border border-brand-line bg-white p-4" key={section.id}>
      <div className="flex items-center justify-between gap-3"><strong>Section {sectionIndex + 1}</strong><button type="button" className="text-sm font-semibold text-red-700 hover:underline" onClick={() => update({ sections: schema.sections.filter((item) => item.id !== section.id) })}>Remove section</button></div>
      <label>Section title<input value={section.title} onChange={(event) => updateSection(section.id, { title: event.target.value })} maxLength={160} required /></label>
      <label>Section guidance / content (Markdown)<textarea value={section.content} onChange={(event) => updateSection(section.id, { content: event.target.value })} rows={6} maxLength={40000} /></label>
      <div className="grid gap-3 border-t border-brand-line pt-3">
        <strong className="text-sm">Reader response fields</strong>
        {section.fields.map((field) => <div className="grid gap-2 rounded bg-brand-cream p-3 sm:grid-cols-[1fr_10rem_auto]" key={field.id}>
          <label>Question / label<input value={field.label} onChange={(event) => updateField(section.id, field.id, { label: event.target.value })} maxLength={160} required /></label>
          <label>Response type<select value={field.type} onChange={(event) => updateField(section.id, field.id, { type: event.target.value as ResourceInputType })}>{inputTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          <button type="button" className="self-end text-sm font-semibold text-red-700 hover:underline" onClick={() => updateSection(section.id, { fields: section.fields.filter((item) => item.id !== field.id) })}>Remove</button>
          {field.type !== "checkbox" && <label className="sm:col-span-3">Placeholder<input value={field.placeholder ?? ""} onChange={(event) => updateField(section.id, field.id, { placeholder: event.target.value })} maxLength={200} /></label>}
          {field.type === "select" && <label className="sm:col-span-3">Options (one per line)<textarea rows={3} value={(field.options ?? []).join("\n")} onChange={(event) => updateField(section.id, field.id, { options: event.target.value.split("\n").map((option) => option.trim()).filter(Boolean) })} /></label>}
        </div>)}
        <button type="button" className="w-fit text-sm font-semibold text-brand-purple hover:underline" onClick={() => updateSection(section.id, { fields: [...section.fields, createField()] })}>+ Add response field</button>
      </div>
    </article>)}
    <button type="button" className="w-fit rounded border border-brand-line bg-white px-3 py-2 text-sm font-semibold text-brand-purple hover:bg-brand-blue" onClick={() => update({ sections: [...schema.sections, createSection()] })}>+ Add section</button>
    <div className="grid gap-2 border-t border-brand-line pt-4">
      <div><h3 className="mb-1 text-lg">Downloadable attachments</h3><p className="mb-0 text-sm text-brand-muted">Files are stored privately and downloaded through the resource page. Maximum 10 MB per file.</p></div>
      {attachmentError && <p className="mb-0 text-sm text-red-700" role="alert">{attachmentError}</p>}
      {attachments.map((attachment) => <div className="flex items-center justify-between gap-3 rounded bg-white p-3 text-sm" key={attachment.id}><span className="truncate">{attachment.filename} · {(attachment.size_bytes / 1024).toFixed(0)} KB</span><button type="button" className="shrink-0 font-semibold text-red-700 hover:underline" disabled={busyAttachmentId === attachment.id} onClick={() => void removeAttachment(attachment)}>{busyAttachmentId === attachment.id ? "Removing…" : "Remove"}</button></div>)}
      {files.map((file, index) => <div className="flex items-center justify-between gap-3 rounded bg-white p-3 text-sm" key={`${file.name}-${index}`}><span className="truncate">{file.name} · {(file.size / 1024).toFixed(0)} KB · Pending upload</span><button type="button" className="shrink-0 font-semibold text-red-700 hover:underline" onClick={() => onFilesChange(files.filter((_, fileIndex) => fileIndex !== index))}>Remove</button></div>)}
      <label>Add files<input type="file" multiple onChange={(event) => onFilesChange([...files, ...Array.from(event.target.files ?? [])])} /></label>
      <p className="mb-0 text-xs text-brand-muted">Selected files are uploaded after saving. To replace a file, remove it and add the new version.</p>
    </div>
  </section>;
}
