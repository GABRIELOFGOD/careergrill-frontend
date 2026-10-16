import type { ContentType } from "@/lib/site-data";
import RichContent from "@/components/rich-content";
import JobDetailPreview from "@/components/job-detail/job-detail-preview";

const labels: Partial<Record<ContentType, string>> = {
  job: "Job opportunity",
  scholarship: "Scholarship opportunity",
  article: "Careergrill / Application notes",
  resource: "Careergrill / Resource library",
  service: "Careergrill / Services",
  faq: "Careergrill / Help & FAQs",
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
  const fields = (metadataFields[type] ?? [])
    .map(([key, label]) => [label, data[key]] as const)
    .filter((field): field is readonly [string, string] => Boolean(field[1]?.trim()));

  return <div className={`content-reader-preview content-reader-preview-${type}`}>
    <div className="content-preview-browser"><span /><span /><span /><b>PUBLIC PAGE PREVIEW</b></div>
    <article className="content-preview-page">
      {type !== "job" && type !== "scholarship" && <>
        <div className="content-preview-heading">
          <span className="content-preview-kicker">{category || labels[type]}</span>
          <h1>{title || "Your title will appear here"}</h1>
          {excerpt && <p className="content-preview-excerpt">{excerpt}</p>}
        </div>
        {fields.length > 0 && <dl className="content-preview-details">{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      </>}
      {type === "job" ? (
        <JobDetailPreview title={title} body={body} data={data} sourceUrl={sourceUrl} />
      ) : type === "scholarship" ? (
        <div className="content-preview-opportunity">
          {category && <span className="content-preview-kicker">{category}</span>}
          <span className="content-preview-opportunity-label">{data.award_badge || "Scholarship"}</span>
          <h2>{title || "Your opportunity title"}</h2>
          <p>{excerpt || "Your short introduction will appear here."}</p>
          {fields.length > 0 && <div className="content-preview-pills">{fields.slice(0, 4).map(([label, value]) => <span key={label}>{label}: {value}</span>)}</div>}
          {sourceUrl && <span className="content-preview-action">Visit official source ↗</span>}
        </div>
      ) : (
        <RichContent value={body || "<p>Your formatted content will appear here. Add headings, images, links, quotes, and tables in the editor.</p>"} className="content-preview-body" />
      )}
      {type === "scholarship"
        ? <RichContent value={body || "<p>Additional details you add to the editor will appear here.</p>"} className="content-preview-body" />
        : null}
      {sourceUrl && type !== "job" && type !== "scholarship" && <span className="content-preview-action">View related source ↗</span>}
    </article>
  </div>;
}
