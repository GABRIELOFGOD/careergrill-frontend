"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiRequest, apiUrl } from "@/lib/api";
import type { ResourceAttachment, ResourceInput } from "@/lib/resource-tools";
import { readResourceSchema } from "@/lib/resource-tools";
import type { SiteContent } from "@/lib/site-data";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/site-shell";
import RichContent from "@/components/rich-content";

type SavedWork = { answers: Record<string, string>; completed: Record<string, boolean> };

function parseSavedWork(value: unknown): SavedWork {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { answers: {}, completed: {} };
  const record = value as Record<string, unknown>;
  const answers = record.answers && typeof record.answers === "object" && !Array.isArray(record.answers)
    ? Object.fromEntries(Object.entries(record.answers).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
    : {};
  const completed = record.completed && typeof record.completed === "object" && !Array.isArray(record.completed)
    ? Object.fromEntries(Object.entries(record.completed).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean"))
    : {};
  return { answers, completed };
}

export default function ResourceToolDetail({ item }: { item: SiteContent }) {
  const schema = readResourceSchema(item.data.resource_schema);
  const storageKey = `careergrill-resource-${item.id}`;
  const [work, setWork] = useState<SavedWork>({ answers: {}, completed: {} });
  const [attachments, setAttachments] = useState<ResourceAttachment[]>([]);
  const [attachmentError, setAttachmentError] = useState("");
  const sectionIds = useMemo(() => schema.sections.map((section) => section.id), [schema.sections]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (!stored) return;
      setWork(parseSavedWork(JSON.parse(stored) as unknown));
    } catch {
      sessionStorage.removeItem(storageKey);
    }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(work));
  }, [storageKey, work]);

  useEffect(() => {
    apiRequest<{ items: ResourceAttachment[] }>(`/content/resources/${encodeURIComponent(item.slug)}/attachments`)
      .then(({ items }) => setAttachments(items))
      .catch((error: unknown) => setAttachmentError(error instanceof Error ? error.message : "Resource downloads could not be loaded."));
  }, [item.slug]);

  function updateAnswer(key: string, value: string) {
    setWork((current) => ({ ...current, answers: { ...current.answers, [key]: value } }));
  }

  function updateCompleted(sectionId: string, value: boolean) {
    setWork((current) => ({ ...current, completed: { ...current.completed, [sectionId]: value } }));
  }

  function clearWork() {
    sessionStorage.removeItem(storageKey);
    setWork({ answers: {}, completed: {} });
  }

  function downloadNotes() {
    const lines = [item.title, "", ...schema.sections.flatMap((section) => {
      const rows = [section.title, work.completed[section.id] ? "Status: Complete" : "Status: Not complete"];
      for (const field of section.fields) {
        const answer = work.answers[`${section.id}:${field.id}`];
        if (answer) rows.push(`${field.label}: ${answer}`);
      }
      return ["", ...rows];
    })];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${item.slug}-notes.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function renderField(sectionId: string, field: ResourceInput) {
    const key = `${sectionId}:${field.id}`;
    if (field.type === "checkbox") {
      return <label className="flex items-start gap-2 text-sm font-semibold" key={field.id}>
        <input className="mt-1 size-4 accent-brand-purple" type="checkbox" checked={work.answers[key] === "true"} onChange={(event) => updateAnswer(key, String(event.target.checked))} />
        {field.label}
      </label>;
    }
    if (field.type === "select") {
      return <label className="grid gap-1.5 text-sm font-semibold" key={field.id}>{field.label}
        <select className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 font-normal" value={work.answers[key] ?? ""} onChange={(event) => updateAnswer(key, event.target.value)}>
          <option value="">Choose an option</option>
          {(field.options ?? []).map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
      </label>;
    }
    const shared = {
      className: "w-full rounded border border-brand-line bg-white px-3 py-2 font-normal",
      placeholder: field.placeholder,
      value: work.answers[key] ?? "",
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateAnswer(key, event.target.value),
    };
    return <label className="grid gap-1.5 text-sm font-semibold" key={field.id}>{field.label}
      {field.type === "textarea"
        ? <textarea {...shared} rows={5} />
        : <input {...shared} type={field.type} />}
    </label>;
  }

  return <article className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-8">
    <Link className="text-sm font-semibold text-brand-purple hover:underline" href="/resources">← Back to resources</Link>
    <header className="my-6 grid gap-3 rounded border border-brand-line bg-brand-sage p-5 sm:p-7">
      <Eyebrow>{item.category} / {String(item.data.format ?? "Resource")}</Eyebrow>
      <h1 className="mb-0 max-w-4xl text-4xl leading-tight">{item.title}</h1>
      <p className="mb-0 max-w-3xl text-lg leading-relaxed text-brand-muted">{item.excerpt}</p>
      <div className="flex flex-wrap gap-2 border-t border-brand-line pt-4 print:hidden">
        <button className={buttonVariants({ variant: "brand", size: "sm" })} type="button" onClick={downloadNotes}>Download notes as TXT</button>
        <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={() => window.print()}>Print / save as PDF</button>
        <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={clearWork}>Clear tool</button>
      </div>
    </header>
    {attachments.length > 0 && <section className="mb-6 rounded border border-brand-line bg-white p-4">
      <h2 className="mb-2 text-xl">Downloads</h2>
      <ul className="mb-0 grid gap-2">{attachments.map((attachment) => <li key={attachment.id}>
        <a className="font-semibold text-brand-purple underline" href={apiUrl(`/content/resources/${encodeURIComponent(item.slug)}/attachments/${attachment.id}/download`)}>{attachment.filename}</a>
        <span className="ml-2 text-xs text-brand-muted">{(attachment.size_bytes / 1024).toFixed(0)} KB</span>
      </li>)}</ul>
    </section>}
    {attachmentError && <p className="mb-5 text-sm text-red-700" role="alert">Downloads could not be loaded: {attachmentError}</p>}
    {item.body && <RichContent value={item.body} className="mb-6 rounded border border-brand-line bg-white p-5 leading-relaxed" />}
    <div className="grid items-start gap-5 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <nav className="grid gap-2 rounded border border-brand-line bg-white p-4 lg:sticky lg:top-24 print:hidden" aria-label="In this tool">
        <h2 className="mb-1 text-lg">In this tool</h2>
        {schema.sections.map((section, index) => <a className="flex items-start gap-2 text-sm text-brand-purple hover:underline" href={`#${section.id}`} key={section.id}>
          <span className="font-bold">{String(index + 1).padStart(2, "0")}</span><span>{section.title}</span>
        </a>)}
      </nav>
      <div className="grid gap-5">
        {schema.sections.map((section, index) => <section className="scroll-mt-24 rounded border border-brand-line bg-white p-5 sm:p-7" id={section.id} key={section.id}>
          <div className="mb-4 flex items-start justify-between gap-4 border-b border-brand-line pb-3">
            <div><Eyebrow>Section {index + 1}</Eyebrow><h2 className="mb-0 mt-1 text-2xl">{section.title}</h2></div>
            <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-brand-muted">
              <input className="size-4 accent-brand-purple" type="checkbox" checked={work.completed[section.id] ?? false} onChange={(event) => updateCompleted(section.id, event.target.checked)} />
              Complete
            </label>
          </div>
          {section.content && <RichContent value={section.content} className="mb-5 leading-relaxed" />}
          {section.fields.length > 0 && <div className="grid gap-4 border-t border-brand-line pt-4">{section.fields.map((field) => renderField(section.id, field))}</div>}
        </section>)}
        {!schema.sections.length && item.body && <p className="rounded border border-brand-line bg-white p-5 text-sm text-brand-muted">This resource does not have interactive sections yet.</p>}
      </div>
    </div>
    {sectionIds.length > 0 && <p className="mt-4 text-center text-xs text-brand-muted print:hidden">Your responses stay in this browser tab. Download or print a copy before closing it.</p>}
    <style jsx global>{`@media print { nav, header button, a[href="/resources"] { display: none !important; } body { background: white !important; } section { break-inside: avoid; } }`}</style>
  </article>;
}
