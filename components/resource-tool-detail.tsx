"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiRequest, apiUrl } from "@/lib/api";
import type { ResourceAttachment, ResourceInput } from "@/lib/resource-tools";
import { readResourceSchema } from "@/lib/resource-tools";
import { contentHref } from "@/lib/site-data";
import type { SiteContent } from "@/lib/site-data";
import { Button, buttonVariants } from "@/components/ui/button";
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
  const [relatedArticle, setRelatedArticle] = useState<SiteContent | null>(null);
  const [relatedArticleError, setRelatedArticleError] = useState("");
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

  useEffect(() => {
    let active = true;
    setRelatedArticle(null);
    setRelatedArticleError("");
    apiRequest<{ items: SiteContent[] }>("/content?type=article")
      .then(({ items }) => {
        if (!active) return;
        const related = items.find((article) => article.data.related_resource_slug === item.slug);
        setRelatedArticle(related ?? null);
      })
      .catch((error: unknown) => {
        if (active) setRelatedArticleError(error instanceof Error ? error.message : "Related articles could not be loaded.");
      });
    return () => { active = false; };
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

  return <article className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-8">
    <nav className="resource-tool-breadcrumb mb-5 flex items-center gap-3 text-sm" aria-label="Breadcrumb">
      <Link className="text-brand-purple underline underline-offset-2" href="/resources">Resources</Link>
      <span aria-hidden="true">/</span>
      <span>{item.category}</span>
    </nav>
    <header className=" mb-8 grid justify-items-center gap-3">
      <Eyebrow className="mb-0 text-xs">{String(item.data.format ?? item.category)}</Eyebrow>
      <h1 className="mb-0 text-6xl">{item.title}</h1>
      {item.excerpt && <p className="mb-0 text-xl">{item.excerpt}</p>}
      <div className="resource-tool-byline flex items-center gap-2" aria-label="Published by Careergrill">
        <span className="resource-tool-byline-mark" aria-hidden="true">C</span>
        <span><strong>Careergrill</strong><small>{String(item.data.format ?? "Resource")}</small></span>
      </div>
    </header>
    <div className="grid md:grid-cols-3 items-start gap-8 md:gap-20 md:px-20">
      <div className="col-span-2 min-w-0">
        {item.body && <RichContent value={item.body} className="resource-tool-content mb-6 leading-relaxed" />}
        {attachmentError && <p className="mb-5 text-sm text-red-700" role="alert">Downloads could not be loaded: {attachmentError}</p>}
        <div className="grid gap-5">
          {schema.sections.map((section, index) => <section className=" scroll-mt-24" id={section.id} key={section.id}>
            <div className="mb-4">
              <Eyebrow className="mb-2">{String(index + 1).padStart(2, "0")}</Eyebrow>
              <div className="flex items-start justify-between gap-4">
                <h2 className="mb-0 text-3xl">{section.title}</h2>
                <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-brand-muted">
                  <input className="size-4 accent-brand-purple" type="checkbox" checked={work.completed[section.id] ?? false} onChange={(event) => updateCompleted(section.id, event.target.checked)} />
                  Complete
                </label>
              </div>
            </div>
            {section.content && <RichContent value={section.content} className="resource-tool-content mb-4 leading-relaxed" />}
            {section.fields.length > 0 && <div className="resource-tool-field-panel grid gap-3">{section.fields.map((field) => renderField(section.id, field))}</div>}
          </section>)}
          {!schema.sections.length && item.body && <p className="text-sm text-brand-muted">This resource does not have interactive sections yet.</p>}
        </div>
        {sectionIds.length > 0 && <div className="resource-tool-actions mt-5 flex flex-wrap items-center gap-2 border-t border-brand-line pt-4 print:hidden">
          <button className={buttonVariants({ variant: "brand", size: "sm" })} type="button" onClick={downloadNotes}>Download your notes (TXT)</button>
          <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={() => window.print()}>Print / save as PDF</button>
          <button className="text-sm text-brand-purple underline underline-offset-2" type="button" onClick={clearWork}>Clear this tool</button>
        </div>}
        {sectionIds.length > 0 && <p className="mt-3 text-xs text-brand-muted print:hidden">Your responses stay in this browser tab. Download or print a copy before closing it.</p>}
      </div>
      <aside className="grid w-fit gap-3 top-10 sticky print:hidden">
        {schema.sections.length > 0 && <nav className="resource-tool-index grid gap-2 p-4 print:hidden" aria-label="In this tool">
          <h2 className="mb-1 text-base">In this tool</h2>
          {schema.sections.map((section, index) => <a className="flex items-start gap-2 text-sm text-brand-purple hover:underline" href={`#${section.id}`} key={section.id}>
            <span>{index + 1}.</span><span>{section.title}</span>
          </a>)}
        </nav>}
        {relatedArticle && <div className="resource-tool-related-article border border-gray-200 rounded-md bg-white grid gap-3 p-4">
          <span className="text-xs uppercase font-semibold">Read the guide</span>
          <strong className="text-xl font-bold leading-tight tracking-tighter">{relatedArticle.title}</strong>
          <Link className="resource-tool-card-link underline hover:text-brand-orange-dark text-sm font-semibold text-brand-ink" href={contentHref("article", relatedArticle.slug)}>Read the article</Link>
        </div>}
        {relatedArticleError && <p className="rounded border border-red-300 bg-red-50 p-3 text-xs text-red-800" role="alert">Related article could not be loaded: {relatedArticleError}</p>}
        <section className="resource-tool-consultation grid gap-3 p-4 bg-brand-footer-hover/20 rounded-md">
          <h2 className="text-lg font-extrabold">Want feedback on your preparation?</h2>
          <p className="text-sm">Bring your draft, the official instructions and your deadline to the conversation.</p>
          <Link href="/consultation?mode=call">
            <Button variant="outline" className="w-full">
              Discuss a CV review
            </Button>
          </Link>
        </section>
        {attachments.length > 0 && <section className="resource-tool-downloads grid gap-2 p-4">
          <h2 className="mb-0 text-base">Downloads</h2>
          <ul className="mb-0 grid gap-2">{attachments.map((attachment) => <li key={attachment.id}>
            <a className="text-sm font-semibold text-brand-purple underline" href={apiUrl(`/content/resources/${encodeURIComponent(item.slug)}/attachments/${attachment.id}/download`)}>{attachment.filename}</a>
            <span className="ml-2 block text-xs text-brand-muted">{(attachment.size_bytes / 1024).toFixed(0)} KB</span>
          </li>)}</ul>
        </section>}
      </aside>
    </div>
    <div className="resource-tool-back mt-10 border-t border-brand-line pt-4">
      <Link className="text-sm font-semibold text-brand-purple underline underline-offset-2" href="/resources">Back to all resources</Link>
    </div>
    <style jsx global>{`@media print { nav, header button, a[href="/resources"] { display: none !important; } body { background: white !important; } section { break-inside: avoid; } }`}</style>
  </article>;
}
