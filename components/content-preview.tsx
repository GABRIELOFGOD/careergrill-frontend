"use client";

import { useState } from "react";
import Image from "next/image";
import type { ContentType } from "@/lib/site-data";
import { apiUrl } from "@/lib/api";
import RichContent from "@/components/rich-content";
import JobDetailPreview from "@/components/job-detail/job-detail-preview";
import ScholarshipDetailView from "@/components/scholarship-detail/scholarship-detail-view";
import { readResourceSchema } from "@/lib/resource-tools";
import { articleReadTimeMinutes } from "@/lib/blog-content";
import { summarizeCountrySelection } from "@/lib/countries";

const labels: Partial<Record<ContentType, string>> = {
  job: "Job opportunity",
  scholarship: "Scholarship opportunity",
  article: "Careergrill / Application notes",
  resource: "Careergrill / Resource library",
  service: "Careergrill / Services",
  testimonial: "Careergrill / Client feedback",
};

const metadataFields: Partial<Record<ContentType, [string, string][]>> = {
  job: [["employer", "Employer"], ["location", "Location"], ["experience_level", "Experience"], ["work_arrangement", "Work arrangement"], ["employment_type", "Employment type"], ["closing_date", "Closing date"], ["salary", "Salary"]],
  scholarship: [["provider", "Provider"], ["study_level", "Study level"], ["destination", "Destination"], ["award_coverage", "Award coverage"], ["deadline", "Deadline"], ["funding_type", "Funding type"], ["cycle_label", "Application cycle"], ["subject_areas", "Subject areas"], ["eligible_countries", "Eligible applicant countries"]],
  article: [["author", "Written by"]],
  resource: [["format", "Format"]],
  testimonial: [["author", "Client"], ["attribution", "Feedback context"]],
};

function displayValue(value: string | undefined, key: string): string {
  if (!value) return "";
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return key === "destination" || key === "eligible_countries"
        ? summarizeCountrySelection(parsed)
        : parsed.join(", ");
    }
  } catch {
    return key === "destination" || key === "eligible_countries"
      ? summarizeCountrySelection(value)
      : value;
  }
  return key === "destination" || key === "eligible_countries"
    ? summarizeCountrySelection(value)
    : value;
}

interface ContentPreviewProps {
  type: ContentType;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  data: Record<string, string>;
  sourceUrl: string;
}

export default function ContentPreview({ type, title, excerpt, body, category, data, sourceUrl }: ContentPreviewProps) {
  const [previewMode, setPreviewMode] = useState<"card" | "matches" | "detail">("detail");
  const hasListingModes = type === "job" || type === "scholarship";
  let resourceSchema: unknown;
  if (type === "resource" && data.resource_schema) {
    try {
      resourceSchema = JSON.parse(data.resource_schema) as unknown;
    } catch {
      resourceSchema = undefined;
    }
  }
  const resourceSections = readResourceSchema(resourceSchema).sections;
  const featuredImage = type === "article" && data.seo_image
    ? data.seo_image.startsWith("/api/")
      ? apiUrl(data.seo_image.replace(/^\/api(?=\/)/, ""))
      : data.seo_image
    : "";
  const fields = (metadataFields[type] ?? [])
    .map(([key, label]) => [label, displayValue(data[key], key)] as const)
    .filter((field): field is readonly [string, string] => Boolean(field[1]?.trim()));
  if (type === "article") fields.push(["Reading time", `${articleReadTimeMinutes(body)} min read`]);

  return <div className="overflow-hidden rounded-lg border border-brand-line bg-white shadow-sm">
    <div className="flex h-11 items-center gap-2 border-b border-brand-line bg-brand-blue px-4">
      <span className="size-2.5 rounded-full bg-red-400" /><span className="size-2.5 rounded-full bg-amber-400" /><span className="size-2.5 rounded-full bg-emerald-400" />
      <b className="ml-auto text-xs tracking-widest text-brand-muted">PUBLIC PAGE PREVIEW</b>
      {hasListingModes && <div className="flex gap-1" role="tablist" aria-label="Preview layout">
        {([
          ["card", "Listing card"],
          ["matches", "Search details"],
          ["detail", "Full page"],
        ] as const).map(([mode, label]) => (
          <button
            aria-selected={previewMode === mode}
            className={`rounded px-2 py-1 text-xs font-semibold ${previewMode === mode ? "bg-white text-brand-purple shadow-sm" : "text-brand-muted hover:bg-white/60"}`}
            key={mode}
            onClick={() => setPreviewMode(mode)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>}
    </div>
    <article className="max-h-170 overflow-auto bg-brand-cream p-[clamp(1.25rem,5vw,3.5rem)]">
      {hasListingModes && previewMode === "card" ? (
        <div className="mx-auto max-w-2xl rounded-xl border border-brand-line bg-white p-6 shadow-sm">
          <span className="mb-2 inline-flex rounded-full bg-brand-sage px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-purple">
            {type === "job" ? category || "Job opportunity" : data.application_status || "Scholarship opportunity"}
          </span>
          <h1 className="mb-2 mt-2 text-2xl">{title || `Your ${type} title will appear here`}</h1>
          {type === "job" && data.employer && <p className="mb-2 text-sm font-semibold text-brand-purple">{data.employer}</p>}
          <p className="mb-4 text-sm leading-relaxed text-brand-muted">{excerpt || "Your short introduction will appear here."}</p>
          {fields.length > 0 && <dl className="grid gap-2 border-t border-brand-line pt-4 sm:grid-cols-2">{fields.map(([label, value]) => <div className="rounded bg-brand-cream p-3" key={label}><dt className="text-xs uppercase tracking-wide text-brand-muted">{label}</dt><dd className="mb-0 mt-1 text-sm font-bold">{value}</dd></div>)}</dl>}
        </div>
      ) : hasListingModes && previewMode === "matches" ? (
        <section className="mx-auto max-w-2xl rounded-xl border border-brand-line bg-white p-6">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">SELECTED SEARCH DETAILS</span>
          <h1 className="mb-2 mt-2 text-2xl">Review where this listing can be found.</h1>
          <p className="mb-5 text-sm text-brand-muted">Check the selected details readers will see and use when browsing {type === "job" ? "jobs" : "scholarships"}.</p>
          {fields.length > 0 ? <dl className="grid gap-2 sm:grid-cols-2">{fields.map(([label, value]) => <div className="rounded border border-brand-line bg-brand-cream p-3" key={label}><dt className="text-xs uppercase tracking-wide text-brand-muted">{label}</dt><dd className="mb-0 mt-1 text-sm font-bold">{value}</dd></div>)}</dl> : <p className="mb-0 rounded bg-brand-blue p-4 text-sm text-brand-muted">Choose details in the editor to include them in the listing.</p>}
        </section>
      ) : type !== "job" && type !== "scholarship" && <>
        {featuredImage && <div className="mx-auto mb-6 aspect-[1200/630] max-w-4xl overflow-hidden rounded-md">
          <Image src={featuredImage} alt={title || "Blog article featured image"} width={1200} height={630} unoptimized className="size-full object-cover" />
        </div>}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-orange">{category || labels[type]}</span>
          <h1 className="mb-3 mt-3 text-3xl">{title || "Your title will appear here"}</h1>
          {excerpt && <p className="mb-0 text-lg leading-relaxed text-brand-muted">{excerpt}</p>}
        </div>
        {fields.length > 0 && <dl className="mx-auto mb-7 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">{fields.map(([label, value]) => <div className="border border-brand-line bg-white p-3" key={label}><dt className="text-xs uppercase tracking-wide text-brand-muted">{label}</dt><dd className="mb-0 mt-1 text-sm font-bold">{value}</dd></div>)}</dl>}
      </>}
      {hasListingModes && previewMode !== "detail" ? null : type === "job" ? (
        <JobDetailPreview title={title} body={body} data={data} sourceUrl={sourceUrl} />
      ) : type === "scholarship" ? (
        <ScholarshipDetailView
          preview
          item={{
            id: "preview",
            type: "scholarship",
            title,
            slug: "",
            excerpt,
            body,
            category,
            tags: [],
            status: "published",
            expires_at: null,
            source_url: sourceUrl || null,
            data,
          }}
        />
      ) : (
        <RichContent value={body || "<p>Your formatted content will appear here. Add headings, images, links, quotes, and tables in the editor.</p>"} className="mx-auto my-6 max-w-3xl text-base leading-relaxed text-brand-muted" />
      )}
      {type === "resource" && resourceSections.length > 0 && <div className="mx-auto grid max-w-3xl gap-4">
        {resourceSections.map((section, index) => <section className="rounded border border-brand-line bg-white p-4" key={section.id}>
          <span className="text-xs font-bold uppercase tracking-wide text-brand-eyebrow">Section {index + 1}</span>
          <h2 className="mb-2 mt-1 text-xl">{section.title}</h2>
          {section.content && <RichContent value={section.content} className="text-sm leading-relaxed text-brand-muted" />}
          {section.fields.map((field) => <p className="mb-1 text-sm text-brand-muted" key={field.id}>Reader response: <strong>{field.label}</strong> ({field.type})</p>)}
        </section>)}
      </div>}
      {sourceUrl && type !== "job" && type !== "scholarship" && type !== "article" && <span className="mt-4 inline-flex font-semibold text-brand-purple">View related source ↗</span>}
    </article>
  </div>;
}
