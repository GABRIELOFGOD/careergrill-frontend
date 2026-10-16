"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api";
import { sampleContent, type SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import RichContent from "@/components/rich-content";
import JobApplicationPanel from "./job-application-panel";
import JobDetailFacts from "./job-detail-facts";
import JobDetailHeader from "./job-detail-header";
import { JobEligibilityCallout, JobEmployerSource, JobPreparationSection } from "./job-detail-sections";
import { jobField } from "./job-detail-utils";

export default function JobDetailPage({ slug }: { slug: string }) {
  const [item, setItem] = useState<SiteContent | null>(() => {
    const sample = sampleContent.find((content) => content.slug === slug && content.type === "job");
    return sample ?? null;
  });
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
    return <div className="job-detail-page"><p className="jobs-loading">Loading job details…</p></div>;
  }

  if (!item) {
    return (
      <section className="simple-page content-wrap">
        <Eyebrow>Careergrill / Find jobs</Eyebrow>
        <h1>{loadError ? "Job unavailable." : "Job not found."}</h1>
        <p>{loadError || "This listing may have moved or is no longer published."}</p>
        <Link className="button button-dark" href="/jobs">Back to job results</Link>
      </section>
    );
  }

  const eligibility = jobField(item, "eligibility", jobField(item, "qualification", ""));

  return (
    <article className="job-detail-page">
      <Link className="job-back-link" href="/jobs">Back to job results</Link>
      <JobDetailHeader item={item} onSave={() => void saveJob()} />
      {notice && (
        <p className="inline-notice" role="status">
          {notice} {signInRequired && <Link href="/signin">Sign in ↗</Link>}
        </p>
      )}
      <JobDetailFacts item={item} />
      <div className="job-detail-columns">
        <div className="job-detail-main">
          <RichContent value={item.body} className="job-detail-body" />
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
