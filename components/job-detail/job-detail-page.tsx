"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api";
import { type SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import RichContent from "@/components/rich-content";
import JobApplicationPanel from "./job-application-panel";
import JobDetailFacts from "./job-detail-facts";
import JobDetailHeader from "./job-detail-header";
import { JobEligibilityCallout, JobEmployerSource, JobPreparationSection } from "./job-detail-sections";
import { jobField } from "./job-detail-utils";
import { buttonVariants } from "@/components/ui/button";

export default function JobDetailPage({ slug }: { slug: string }) {
  const [item, setItem] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [signInRequired, setSignInRequired] = useState(false);

  useEffect(() => {
    apiRequest<{ item: SiteContent }>(`/content/${encodeURIComponent(slug)}`)
      .then(({ item: fetchedItem }) => {
        if (fetchedItem.type !== "job") {
          setItem(null);
          setLoadError("This listing is not a job opportunity.");
          return;
        }
        setItem(fetchedItem);
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Could not load this job.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  async function saveJob() {
    if (!item) return;
    setNotice("");
    setSignInRequired(false);
    try {
      await apiRequest("/saved", {
        method: "POST",
        body: JSON.stringify({ content_id: item.id, content_type: "job", reminder_enabled: true }),
      });
      setNotice("Saved to your workspace. We’ll email you before the listing closes.");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setNotice("Sign in to save this job to your workspace.");
        setSignInRequired(true);
      } else {
        setNotice(error instanceof Error ? error.message : "Could not save this job.");
      }
    }
  }

  if (loading && !item) {
    return <div className="mx-auto w-[min(100%-2.25rem,48rem)] py-8 text-center text-brand-muted"><p>Loading job details…</p></div>;
  }

  if (!item) {
    return (
      <section className="mx-auto w-[min(100%-2.25rem,48rem)] py-12">
        <Eyebrow>Careergrill / Find jobs</Eyebrow>
        <h1>{loadError ? "Job unavailable." : "Job not found."}</h1>
        <p>{loadError || "This listing may have moved or is no longer published."}</p>
        <Link className={buttonVariants({ variant: "brand" })} href="/jobs">Back to job results</Link>
      </section>
    );
  }

  const eligibility = jobField(item, "eligibility", jobField(item, "qualification", ""));

  return (
    <article className="mx-auto w-[min(100%-2.25rem,48rem)] py-8 pb-16">
      <Link className="mb-5 inline-block text-sm text-brand-muted underline underline-offset-4" href="/jobs">Back to job results</Link>
      <JobDetailHeader item={item} onSave={() => void saveJob()} />
      {notice && (
        <p className="my-4 rounded border border-brand-line bg-brand-blue p-3 text-sm" role="status">
          {notice} {signInRequired && <Link href="/signin">Sign in ↗</Link>}
        </p>
      )}
      <JobDetailFacts item={item} />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(15rem,1fr)]">
        <div className="grid gap-4">
          <RichContent value={item.body} className="prose max-w-none text-base leading-relaxed text-brand-ink [&_h2]:mt-7 [&_h2]:font-display [&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_li]:mb-1 [&_p]:mb-4" />
          <JobEligibilityCallout text={eligibility} />
          <JobPreparationSection />
          <JobEmployerSource
            sourceCheckedAt={jobField(item, "source_checked_at", "")}
            sourceUrl={item.source_url}
          />
        </div>
        <JobApplicationPanel item={item} />
      </div>
    </article>
  );
}
