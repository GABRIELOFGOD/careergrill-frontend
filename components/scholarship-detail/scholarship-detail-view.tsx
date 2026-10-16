import Link from "next/link";
import type { SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import RichContent from "@/components/rich-content";

function field(item: SiteContent, key: string): string {
  const value = item.data[key];
  return typeof value === "string" ? value.trim() : "";
}

function list(value: string): string[] {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function display(value: string, fallback = "Not stated"): string {
  return value || fallback;
}

export default function ScholarshipDetailView({
  item,
  onSave,
  preview = false,
}: {
  item: SiteContent;
  onSave?: () => void;
  preview?: boolean;
}) {
  const coverage = [
    { title: field(item, "coverage_primary_title") || "Funding and fees", text: field(item, "coverage_primary_text") },
    { title: field(item, "coverage_secondary_title") || "Additional funding", text: field(item, "coverage_secondary_text") },
  ].filter((card) => card.text);
  const eligibilityPoints = list(field(item, "eligibility_points"));
  const studyLevel = field(item, "study_level");
  const destination = field(item, "destination");
  const cycle = field(item, "cycle_label") || field(item, "application_status");
  const deadline = field(item, "deadline");
  const awardBadge = field(item, "application_status") || field(item, "award_badge");

  return (
    <article className={`content-wrap scholarship-detail-page${preview ? " scholarship-detail-preview" : ""}`}>
      {!preview && <Link className="job-back-link" href="/scholarships">Back to results</Link>}
      <header className="scholarship-detail-header">
        <div>
          <Eyebrow>{field(item, "provider") || item.category || "Scholarship provider"}</Eyebrow>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
          {awardBadge && <span className="scholarship-detail-badge">{awardBadge}</span>}
        </div>
        <button className="button button-outline job-detail-save" type="button" onClick={onSave} disabled={!onSave}>
          {preview ? "Save opportunity" : "Save opportunity"}
        </button>
      </header>

      <dl className="scholarship-detail-facts">
        {[
          ["Study level / route", studyLevel],
          ["Destination", destination],
          ["Application cycle", cycle],
          ["Deadline", deadline],
        ].map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{display(value)}</dd></div>
        ))}
      </dl>

      <div className="scholarship-detail-columns">
        <div className="scholarship-detail-main">
          <section className="scholarship-detail-section funding-section">
            <h2>What does the funding cover?</h2>
            {coverage.length ? (
              <div className="scholarship-coverage-grid">
                {coverage.map((card) => <article key={card.title}><h3>{card.title}</h3><p>{card.text}</p></article>)}
              </div>
            ) : field(item, "award_coverage") || field(item, "funding_type") ? (
              <div className="scholarship-coverage-grid">
                <article>
                  <h3>{field(item, "funding_type") || "Award coverage"}</h3>
                  <p>{field(item, "award_coverage") || "Confirm exact benefits and conditions with the provider."}</p>
                </article>
              </div>
            ) : <p className="scholarship-detail-summary">Check the provider’s current funding details.</p>}
          </section>

          {item.body.trim() && <RichContent value={item.body} className="scholarship-detail-body" />}

          <section className="scholarship-detail-section eligibility-section">
            <h2>What needs checking?</h2>
            <span className="scholarship-detail-badge">{field(item, "eligibility_status") || "Individual eligibility not assessed"}</span>
            {field(item, "subject_areas") && <p><strong>Subject areas:</strong> {field(item, "subject_areas")}</p>}
            {field(item, "nationality_residence") && <p><strong>Nationality and residence:</strong> {field(item, "nationality_residence")}</p>}
            {eligibilityPoints.length > 0 && <ul>{eligibilityPoints.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ul>}
            {field(item, "eligibility_note") && <p className="scholarship-detail-note">{field(item, "eligibility_note")}</p>}
          </section>

          <section className="scholarship-provider-record">
            <h2>Provider record</h2>
            <p>{field(item, "provider_record") || "Check the provider’s current information for confirmed funding, eligibility and application details."}</p>
            {item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer">Read the provider’s page</a>}
            <small>
              {field(item, "source_checked_at")
                ? `Official source checked ${field(item, "source_checked_at")}. Status and deadlines can change; check the provider before applying.`
                : "Status and deadlines can change; check the provider before applying."}
            </small>
          </section>
        </div>

        <aside className="scholarship-preparation-panel">
          <Eyebrow>From discovery to preparation</Eyebrow>
          <h2>What do you need to work on next?</h2>
          <p>Use the Career Audit to examine your experience, preparation gaps and next steps for this opportunity.</p>
          <Link className="button button-primary" href="/career-audit?goal=scholarship">Check my preparation</Link>
          <Link className="button button-outline-light" href="/workspace">Open my application workspace</Link>
          {item.source_url
            ? <a className="button button-outline-light" href={item.source_url} target="_blank" rel="noreferrer">View provider guidance</a>
            : <span className="button button-outline-light scholarship-guidance-unavailable">Provider guidance not provided</span>}
          <small>Applications and award decisions are handled by the provider. Careergrill support is optional and cannot guarantee an award.</small>
        </aside>
      </div>
    </article>
  );
}
