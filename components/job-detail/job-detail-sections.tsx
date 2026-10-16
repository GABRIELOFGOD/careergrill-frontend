import Link from "next/link";
import type { SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";

export function JobEligibilityCallout({ text }: { text: string }) {
  if (!text.trim()) return null;

  return (
    <section className="job-detail-eligibility">
      <h2>Location and eligibility</h2>
      <p>{text}</p>
    </section>
  );
}

export function JobPreparationSection() {
  return (
    <section className="job-preparation-section">
      <Eyebrow>Prepare your application</Eyebrow>
      <h2>Build your evidence for this role.</h2>
      <p>
        Use these prompts to organise your preparation. The employer decides who meets its
        requirements.
      </p>
      <ul>
        <li>Prepare examples that demonstrate the role’s key requirements.</li>
        <li>Check the application instructions and explain your contribution clearly.</li>
      </ul>
      <div className="job-preparation-links">
        <Link className="button button-outline" href="/career-audit?goal=job">Start an AI job audit</Link>
        <Link href="/resources/turn-work-into-cv-evidence">Open the CV worksheet</Link>
        <Link href="/consultation">Discuss a CV review</Link>
      </div>
    </section>
  );
}

export function JobEmployerSource({
  sourceCheckedAt,
  sourceUrl,
}: {
  sourceCheckedAt?: string;
  sourceUrl: string | null;
}) {
  const sourceChecked = sourceCheckedAt || "date not stated";

  return (
    <section className="job-employer-source">
      <h2>Employer source</h2>
      <p>
        {sourceUrl
          ? `Source checked ${sourceChecked}. The employer’s application page was available when reviewed. Check current availability before applying.`
          : "An employer source has not been provided for this listing. Verify the current details before applying."}
      </p>
      {sourceUrl && (
        <a href={sourceUrl} target="_blank" rel="noreferrer">Read the original posting</a>
      )}
    </section>
  );
}
