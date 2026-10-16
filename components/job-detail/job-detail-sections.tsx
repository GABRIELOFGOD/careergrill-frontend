import Link from "next/link";
import type { SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import { buttonVariants } from "@/components/ui/button";

export function JobEligibilityCallout({ text }: { text: string }) {
  if (!text.trim()) return null;

  return (
    <section className="rounded border-l-4 border-brand-orange bg-brand-blue p-4">
      <h2 className="mb-2 text-lg font-bold">Location and eligibility</h2>
      <p className="mb-0 text-sm leading-relaxed">{text}</p>
    </section>
  );
}

export function JobPreparationSection() {
  return (
    <section className="mt-4 rounded border border-brand-line bg-white p-5">
      <Eyebrow>Prepare your application</Eyebrow>
      <h2 className="mb-2 text-xl font-bold">Build your evidence for this role.</h2>
      <p className="text-sm text-brand-muted">
        Use these prompts to organise your preparation. The employer decides who meets its
        requirements.
      </p>
      <ul className="mb-4 list-disc pl-5 text-sm [&>li+li]:mt-2">
        <li>Prepare examples that demonstrate the role’s key requirements.</li>
        <li>Check the application instructions and explain your contribution clearly.</li>
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Link className={buttonVariants({ variant: "outline", size: "sm" })} href="/career-audit?goal=job">Start an AI job audit</Link>
        <Link className="text-sm font-semibold text-brand-purple hover:underline" href="/resources/turn-work-into-cv-evidence">Open the CV worksheet</Link>
        <Link className="text-sm font-semibold text-brand-purple hover:underline" href="/consultation">Discuss a CV review</Link>
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
    <section className="mt-4 rounded border border-brand-line p-4">
      <h2 className="mb-2 text-lg font-bold">Employer source</h2>
      <p className="text-sm leading-relaxed text-brand-muted">
        {sourceUrl
          ? `Source checked ${sourceChecked}. The employer’s application page was available when reviewed. Check current availability before applying.`
          : "An employer source has not been provided for this listing. Verify the current details before applying."}
      </p>
      {sourceUrl && (
        <a className="text-sm font-semibold text-brand-purple hover:underline" href={sourceUrl} target="_blank" rel="noreferrer">Read the original posting</a>
      )}
    </section>
  );
}
