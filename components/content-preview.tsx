import type { ContentType } from "@/lib/site-data";
import RichContent from "@/components/rich-content";
import JobDetailPreview from "@/components/job-detail/job-detail-preview";
import ScholarshipDetailView from "@/components/scholarship-detail/scholarship-detail-view";
import { readResourceSchema } from "@/lib/resource-tools";

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
  scholarship: [["provider", "Provider"], ["study_level", "Study level"], ["destination", "Destination"], ["award_coverage", "Award coverage"], ["deadline", "Deadline"], ["funding_type", "Funding type"], ["cycle_label", "Application cycle"]],
  article: [["author", "Written by"], ["reading_minutes", "Reading time"]],
  resource: [["format", "Format"]],
  testimonial: [["author", "Client"], ["attribution", "Feedback context"]],
};

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
  let resourceSchema: unknown;
  if (type === "resource" && data.resource_schema) {
    try {
      resourceSchema = JSON.parse(data.resource_schema) as unknown;
    } catch {
      resourceSchema = undefined;
    }
  }
  const resourceSections = readResourceSchema(resourceSchema).sections;
  const fields = (metadataFields[type] ?? [])
    .map(([key, label]) => [label, data[key]] as const)
    .filter((field): field is readonly [string, string] => Boolean(field[1]?.trim()));

  return <div className="overflow-hidden rounded-lg border border-brand-line bg-white shadow-sm">
    <div className="flex h-11 items-center gap-2 border-b border-brand-line bg-brand-blue px-4">
      <span className="size-2.5 rounded-full bg-red-400" /><span className="size-2.5 rounded-full bg-amber-400" /><span className="size-2.5 rounded-full bg-emerald-400" />
      <b className="ml-auto text-xs tracking-widest text-brand-muted">PUBLIC PAGE PREVIEW</b>
    </div>
    <article className="max-h-[42.5rem] overflow-auto bg-brand-cream p-[clamp(1.25rem,5vw,3.5rem)]">
      {type !== "job" && type !== "scholarship" && <>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-brand-orange">{category || labels[type]}</span>
          <h1 className="mb-3 mt-3 text-3xl">{title || "Your title will appear here"}</h1>
          {excerpt && <p className="mb-0 text-lg leading-relaxed text-brand-muted">{excerpt}</p>}
        </div>
        {fields.length > 0 && <dl className="mx-auto mb-7 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">{fields.map(([label, value]) => <div className="border border-brand-line bg-white p-3" key={label}><dt className="text-xs uppercase tracking-wide text-brand-muted">{label}</dt><dd className="mb-0 mt-1 text-sm font-bold">{value}</dd></div>)}</dl>}
      </>}
      {type === "job" ? (
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
        <RichContent value={body || "<p>Your formatted content will appear here. Add headings, images, links, quotes, and tables in the editor.</p>"} className="mx-auto my-6 max-w-3xl text-base leading-relaxed text-brand-muted [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-orange [&_blockquote]:pl-4 [&_img]:mx-auto [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-brand-line [&_td]:p-2 [&_th]:border [&_th]:border-brand-line [&_th]:bg-brand-blue [&_th]:p-2 [&_th]:text-left" />
      )}
      {type === "resource" && resourceSections.length > 0 && <div className="mx-auto grid max-w-3xl gap-4">
        {resourceSections.map((section, index) => <section className="rounded border border-brand-line bg-white p-4" key={section.id}>
          <span className="text-xs font-bold uppercase tracking-wide text-brand-eyebrow">Section {index + 1}</span>
          <h2 className="mb-2 mt-1 text-xl">{section.title}</h2>
          {section.content && <RichContent value={section.content} className="text-sm leading-relaxed text-brand-muted" />}
          {section.fields.map((field) => <p className="mb-1 text-sm text-brand-muted" key={field.id}>Reader response: <strong>{field.label}</strong> ({field.type})</p>)}
        </section>)}
      </div>}
      {sourceUrl && type !== "job" && type !== "scholarship" && <span className="mt-4 inline-flex font-semibold text-brand-purple">View related source ↗</span>}
    </article>
  </div>;
}
