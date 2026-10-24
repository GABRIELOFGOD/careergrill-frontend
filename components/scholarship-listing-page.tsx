"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api";
import type { SiteContent } from "@/lib/site-data";
import { contentHref } from "@/lib/site-data";
import { countryNames, summarizeCountrySelection } from "@/lib/countries";
import { Eyebrow } from "@/components/site-shell";
import { Button, buttonVariants } from "@/components/ui/button";

const filterFieldClassName = "grid gap-1.5 text-xs font-semibold text-brand-ink [&_select]:min-h-10 [&_select]:w-full [&_select]:rounded [&_select]:border [&_select]:border-brand-line [&_select]:bg-white [&_select]:px-3 [&_select]:py-2 [&_select]:text-sm [&_input]:min-h-11 [&_input]:w-full [&_input]:rounded [&_input]:border [&_input]:border-brand-line [&_input]:bg-white [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm";

function scholarshipValues(item: SiteContent, key: string): string[] {
  const value = item.data[key];
  if (typeof value === "string") return value ? [value] : [];
  return Array.isArray(value) && value.every((item): item is string => typeof item === "string")
    ? value
    : [];
}

function scholarshipValue(item: SiteContent, key: string, fallback = ""): string {
  return scholarshipValues(item, key)[0] ?? fallback;
}

function options(items: SiteContent[], key: string): string[] {
  const allDestinations = key === "destination" ? countryNames : [];
  return [...new Set([...allDestinations, ...items.flatMap((item) => scholarshipValues(item, key))])]
    .sort((a, b) => a.localeCompare(b));
}

export function ScholarshipListingPage() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [query, setQuery] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [destination, setDestination] = useState("");
  const [fundingType, setFundingType] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("default");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [signInRequired, setSignInRequired] = useState(false);

  useEffect(() => {
    apiRequest<{ items: SiteContent[] }>("/content?type=scholarship")
      .then((result) => setItems(result.items))
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Could not load scholarships.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    const result = items.filter((item) => {
      const searchable = [
        item.title,
        item.excerpt,
        item.body,
        scholarshipValues(item, "provider").join(" "),
        scholarshipValues(item, "subject_areas").join(" "),
        scholarshipValues(item, "destination").join(" "),
        item.tags.join(" "),
      ].join(" ").toLowerCase();
      return (!searchTerm || searchable.includes(searchTerm))
        && (!studyLevel || scholarshipValues(item, "study_level").includes(studyLevel))
        && (!destination || scholarshipValues(item, "destination").includes(destination))
        && (!fundingType || scholarshipValues(item, "funding_type").includes(fundingType))
        && (!status || scholarshipValues(item, "application_status").includes(status));
    });
    if (sort === "title") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "deadline") {
      result.sort((a, b) => {
        const deadlineA = scholarshipValue(a, "deadline_sort");
        const deadlineB = scholarshipValue(b, "deadline_sort");
        if (!deadlineA) return 1;
        if (!deadlineB) return -1;
        return deadlineA.localeCompare(deadlineB);
      });
    }
    return result;
  }, [items, query, studyLevel, destination, fundingType, status, sort]);

  const featured = filtered.filter((item) => item.data.featured === true);
  const visible = showAll ? filtered : featured;

  function clearFilters() {
    setQuery("");
    setStudyLevel("");
    setDestination("");
    setFundingType("");
    setStatus("");
    setSort("default");
  }

  async function saveScholarship(id: string) {
    setNotice("");
    setSignInRequired(false);
    try {
      await apiRequest("/saved", {
        method: "POST",
        body: JSON.stringify({ content_id: id, content_type: "scholarship", reminder_enabled: true }),
      });
      setNotice("Saved to your workspace. We’ll email you before the opportunity closes.");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setNotice("Sign in to save this scholarship to your workspace.");
        setSignInRequired(true);
      } else {
        setNotice(error instanceof Error ? error.message : "Could not save this scholarship.");
      }
    }
  }

  return (
    <>
      <section className="scholarships-page-hero bg-brand-sage">
        <div className="scholarships-page-hero-inner mx-auto w-full max-w-7xl px-4 sm:px-8 grid min-h-64 grid-cols-1 items-center gap-6 py-9 md:grid-cols-[minmax(0,1fr)_minmax(15rem,.65fr)]">
          <div>
            <Eyebrow>For African students &amp; graduates</Eyebrow>
            <h1 className="mb-3 text-5xl font-extrabold tracking-tight sm:text-6xl">Find scholarships<br /><em>for your study goals.</em></h1>
            <p className="mb-0 max-w-2xl text-base leading-relaxed text-brand-muted">Explore featured scholarships, or search and filter the full directory around your study goals.</p>
          </div>
          <aside className="grid gap-2 border-t border-brand-line pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <span className="text-2xl text-brand-orange" aria-hidden="true">✦</span>
            <h2 className="mb-0 text-2xl">Not sure where to start?</h2>
            <p className="mb-1 text-sm text-brand-muted">A few questions can help narrow your options.</p>
            <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/career-audit?goal=scholarship">Find potential matches</Link>
            <small className="text-xs text-brand-muted">Preference filters · Eligibility still needs checking</small>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-5 flex flex-col gap-5">
        <div className="mb-4 flex gap-3 rounded border border-brand-line bg-brand-blue p-4">
          <span className="text-brand-purple" aria-hidden="true">ⓘ</span>
          <p className="mb-0 text-sm leading-relaxed text-brand-muted">Browse scholarships, fellowships and institution awards. Each listing shows its status and last source check. Entries marked “Status needs checking” are research leads. Confirm the provider’s requirements before applying.</p>
        </div>

        <div className="mb-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
          <label className={filterFieldClassName}>
            <span className="sr-only">Search scholarships by name, institution, subject or destination</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, institution, subject or destination" />
          </label>
          <label className={filterFieldClassName}>
            <span>Sort by</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="default">Default order</option>
              <option value="deadline">Closing date</option>
              <option value="title">A–Z</option>
            </select>
          </label>
        </div>

        <div className="mb-3 grid gap-3 md:grid-cols-3">
          <label className={filterFieldClassName}>
            <span>Study level</span>
            <select value={studyLevel} onChange={(event) => setStudyLevel(event.target.value)}>
              <option value="">All study levels</option>
              {options(items, "study_level").map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className={filterFieldClassName}>
            <span>Study destination</span>
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              <option value="">All destinations</option>
              {options(items, "destination").map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className={filterFieldClassName}>
            <span>Funding type</span>
            <select value={fundingType} onChange={(event) => setFundingType(event.target.value)}>
              <option value="">All funding types</option>
              {options(items, "funding_type").map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <details className="mb-2 rounded border border-brand-line px-3">
          <summary className="cursor-pointer py-3 text-sm font-semibold">More filters</summary>
          <label className={`${filterFieldClassName} pb-3`}>
            <span>Application status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {options(items, "application_status").map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </details>

        <div className="mb-3 flex justify-end">
          <button className="text-sm font-semibold text-brand-purple hover:underline" type="button" onClick={clearFilters}>Clear all filters</button>
        </div>

        {loadError && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="alert">Could not load the live scholarship directory: {loadError}</p>}
        {notice && <p className="my-3 rounded border border-brand-line bg-brand-blue p-3 text-sm" role="status">{notice} {signInRequired && <Link className="font-semibold text-brand-purple" href="/signin">Sign in ↗</Link>}</p>}

        <div className="my-5 flex items-start justify-between gap-4 max-sm:flex-col">
          <div>
            <h2 className="mb-1 text-3xl">{showAll ? "All scholarships" : "Featured scholarships"}</h2>
            <p className="mb-0 text-sm text-brand-muted">A selection to get you started. Search or filter to explore all {filtered.length} opportunities.</p>
          </div>
          {!showAll && items.length > 0 && (
            <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={() => setShowAll(true)}>
              Browse all scholarships ({filtered.length})
            </button>
          )}
          {showAll && (
            <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={() => setShowAll(false)}>
              Show featured scholarships
            </button>
          )}
        </div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm text-brand-muted">
          <span>{loading ? "Loading opportunities…" : `${featured.length} featured opportunities`}</span>
          <Link className="font-semibold text-brand-purple hover:underline" href="/workspace">View my saved opportunities</Link>
        </div>

        {loading ? <p className="py-8 text-center text-sm text-brand-muted">Loading scholarships…</p> : visible.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => {
              const initials = scholarshipValue(item, "logo_initials", scholarshipValue(item, "provider").slice(0, 2).toUpperCase());
              const statusBadge = scholarshipValue(item, "application_status", "Status needs checking");
              const deadline = scholarshipValue(item, "deadline", "Not stated by provider");
              return (
                <article className="flex min-h-76 flex-col rounded border border-brand-line bg-white p-5" key={item.id}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-blue font-bold text-brand-purple" aria-hidden="true">{initials}</span>
                    <span className={`rounded-full px-2 py-1 text-xs ${item.data.award_badge_tone === "orange" ? "bg-orange-100 text-orange-900" : "bg-brand-blue text-brand-purple"}`}>{scholarshipValue(item, "award_badge", "Funding details to verify")}</span>
                  </div>
                  <h3 className="mb-1 text-lg font-bold"><Link className="hover:text-brand-purple" href={contentHref("scholarship", item.slug)}>{item.title}</Link></h3>
                  <p className="mb-2 text-sm text-brand-muted">{summarizeCountrySelection(scholarshipValues(item, "destination"))} · {scholarshipValues(item, "study_level").join(", ")}</p>
                  <p className="mb-3 text-sm leading-relaxed text-brand-muted">{item.excerpt}</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${item.data.status_tone === "blue" ? "bg-sky-50 text-sky-900" : "bg-emerald-50 text-emerald-900"}`}>{statusBadge}</span>
                    {scholarshipValue(item, "cycle_label") && <span className="rounded-full bg-brand-blue px-2.5 py-1 text-xs text-brand-purple">{scholarshipValue(item, "cycle_label")}</span>}
                  </div>
                  <div className="mb-3 grid gap-1 border-y border-brand-line py-2 text-xs">
                    <span className="text-brand-muted">Deadline</span>
                    <strong>{deadline}</strong>
                  </div>
                  <div className="mt-auto flex gap-2 w-full">
                    <Link className="w-full" href={contentHref("scholarship", item.slug)}>
                      <Button className="w-full">View details</Button>
                    </Link>
                    <Button variant={"outline"} type="button" onClick={() => void saveScholarship(item.id)}>Save</Button>
                  </div>
                  <p className="mb-0 mt-3 text-xs text-brand-muted">Official source checked {scholarshipValue(item, "source_checked_at", "date not stated")}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded border border-dashed border-brand-line p-8 text-center">
            <h3 className="mb-2 text-lg font-bold">No matching scholarships.</h3>
            <p className="mb-0 text-sm text-brand-muted">Try another search or clear some filters.</p>
          </div>
        )}

        <section className="mt-8 grid items-center gap-5 md:gap-10 rounded-md bg-brand-sage p-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-2 text-2xl">Found a route you want to pursue?</h2>
            <p className="mb-0 text-sm leading-relaxed text-brand-muted">The Career Audit helps you identify the preparation and evidence you need.</p>
          </div>
          <div className="flex flex-col gap-3 font-semibold">
            <Link href="/career-audit">
              <Button className="bg-brand-orange hover:bg-brand-orange/90 text-brand-purple">Check my preparation</Button>
            </Link>
          </div>
        </section>
      </section>
    </>
  );
}
