"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api";
import { type SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import ScholarshipDetailView from "./scholarship-detail-view";
import { buttonVariants } from "@/components/ui/button";

export default function ScholarshipDetailPage({ slug }: { slug: string }) {
  const [item, setItem] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [signInRequired, setSignInRequired] = useState(false);

  useEffect(() => {
    apiRequest<{ item: SiteContent }>(`/content/${encodeURIComponent(slug)}`)
      .then(({ item: result }) => {
        if (result.type !== "scholarship") {
          setItem(null);
          setError("This listing is not a scholarship.");
          return;
        }
        setItem(result);
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Could not load this scholarship."))
      .finally(() => setLoading(false));
  }, [slug]);

  async function saveScholarship() {
    if (!item) return;
    setNotice("");
    setSignInRequired(false);
    try {
      await apiRequest("/saved", {
        method: "POST",
        body: JSON.stringify({ content_id: item.id, content_type: "scholarship", reminder_enabled: true }),
      });
      setNotice("Saved to your workspace. We’ll email you before the opportunity closes.");
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        setNotice("Sign in to save this scholarship to your workspace.");
        setSignInRequired(true);
      } else {
        setNotice(cause instanceof Error ? cause.message : "Could not save this scholarship.");
      }
    }
  }

  if (!item) {
    return <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-12">
      {loading ? <p>Loading scholarship details…</p> : <>
        <Eyebrow>Careergrill / Scholarships</Eyebrow>
        <h1>{error ? "Scholarship unavailable." : "Scholarship not found."}</h1>
        <p>{error || "This listing may have moved or is no longer published."}</p>
        <Link className={buttonVariants({ variant: "brand" })} href="/scholarships">Back to scholarship results</Link>
      </>}
    </section>;
  }

  return <>
    {notice && <p className="mx-auto w-full max-w-7xl px-4 sm:px-8 my-4 rounded border border-brand-line bg-brand-blue p-3 text-sm" role="status">{notice} {signInRequired && <Link className="font-semibold text-brand-purple" href="/signin">Sign in ↗</Link>}</p>}
    <ScholarshipDetailView item={item} onSave={() => void saveScholarship()} />
  </>;
}
