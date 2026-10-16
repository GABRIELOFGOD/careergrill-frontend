import RichContent from "@/components/rich-content";
import {
  JobEligibilityCallout,
  JobEmployerSource,
  JobPreparationSection,
} from "./job-detail-sections";

interface JobDetailPreviewProps {
  title: string;
  body: string;
  data: Record<string, string>;
  sourceUrl: string;
}

export default function JobDetailPreview({
  title,
  body,
  data,
  sourceUrl,
}: JobDetailPreviewProps) {
  return (
    <div className="job-detail-preview">
      <div className="job-detail-preview-heading">
        <span className="content-preview-kicker">{data.employer || "Employer"}</span>
        <h2>{title || "Your job title"}</h2>
        <p>{data.location || "Location not stated"}</p>
        {data.application_page_available === "true" && (
          <span className="job-application-status">Application page available</span>
        )}
      </div>
      <div className="job-detail-preview-facts">
        {[
          ["Experience", data.experience_level],
          ["Work arrangement", data.work_arrangement],
          ["Employment type", data.employment_type],
          ["Advertised pay", data.salary],
        ].map(([label, value]) => (
          <div key={label}>
            <small>{label}</small>
            <strong>{value || "Not stated"}</strong>
          </div>
        ))}
      </div>
      <div className="job-detail-preview-columns">
        <div className="job-detail-preview-body">
          <RichContent
            value={body || "<h2>About the role</h2><p>Your job description will appear here.</p>"}
            className="content-preview-body"
          />
          <JobEligibilityCallout text={data.eligibility || data.qualification || ""} />
          <JobPreparationSection />
          <JobEmployerSource sourceCheckedAt={data.source_checked_at} sourceUrl={sourceUrl || null} />
        </div>
        <aside className="job-detail-preview-application">
          <span className="content-preview-kicker">Application details</span>
          <h3>Your next step</h3>
          <small>Closing date</small>
          <p>{data.closing_date || "Not stated by employer"}</p>
          <small>Documents / instructions</small>
          <p>{data.application_instructions || "Follow the employer’s application form and document instructions."}</p>
          <small className="job-application-timezone">
            Confirm the closing time and timezone on the employer’s page.
          </small>
          {sourceUrl && <span className="content-preview-action">View application on employer site ↗</span>}
          <small>Careergrill does not receive this application.</small>
        </aside>
      </div>
    </div>
  );
}
