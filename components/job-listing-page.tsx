"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api";
import type { SiteContent } from "@/lib/site-data";
import { contentHref } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const filterFieldClassName = "grid gap-1.5 text-xs font-semibold text-brand-ink [&_select]:min-h-10 [&_select]:w-full [&_select]:rounded [&_select]:border [&_select]:border-brand-line [&_select]:bg-white [&_select]:px-3 [&_select]:py-2 [&_select]:text-sm [&_input]:min-h-11 [&_input]:w-full [&_input]:rounded [&_input]:border [&_input]:border-brand-line [&_input]:bg-white [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm";

function jobValue(item: SiteContent, key: string, fallback = ""): string {
  const value = item.data[key];
  return typeof value === "string" ? value : fallback;
}

function filterOptions(items: SiteContent[], key: string): string[] {
  return [...new Set(items.map((item) => jobValue(item, key)).filter(Boolean))].sort();
}

function closingDateLabel(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export function JobListingPage() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [arrangement, setArrangement] = useState("");
  const [employment, setEmployment] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [sort, setSort] = useState("default");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [signInRequired, setSignInRequired] = useState(false);

  useEffect(() => {
    apiRequest<{ items: SiteContent[] }>("/content?type=job")
      .then((result) => setItems(result.items))
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Could not load job listings.");
      })
      .finally(() => setLoading(false));
  }, []);

  const featured = items.filter((item) => item.data.featured === true);
  const filtered = useMemo(() => {
    const terms = query.toLowerCase().trim();
    const result = items.filter((item) => {
      const searchable = [
        item.title,
        item.excerpt,
        item.body,
        jobValue(item, "employer"),
        item.tags.join(" "),
      ].join(" ").toLowerCase();
      return (!terms || searchable.includes(terms))
        && (!location || jobValue(item, "location") === location)
        && (!experience || jobValue(item, "experience_level") === experience)
        && (!arrangement || jobValue(item, "work_arrangement") === arrangement)
        && (!employment || jobValue(item, "employment_type") === employment)
        && (!closingDate || jobValue(item, "closing_date") === closingDate);
    });
    if (sort === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "closing") {
      result.sort((a, b) => {
        const dateA = jobValue(a, "closing_date");
        const dateB = jobValue(b, "closing_date");
        if (!dateA || dateA === "Not stated by employer") return 1;
        if (!dateB || dateB === "Not stated by employer") return -1;
        return dateA.localeCompare(dateB);
      });
    }
    return result;
  }, [items, query, location, experience, arrangement, employment, closingDate, sort]);

  const visible = showAll ? filtered : filtered.filter((item) => item.data.featured === true);
  const featuredCount = filtered.filter((item) => item.data.featured === true).length;

  function clearFilters() {
    setQuery("");
    setLocation("");
    setExperience("");
    setArrangement("");
    setEmployment("");
    setClosingDate("");
    setSort("default");
  }

  async function saveJob(id: string) {
    setNotice("");
    setSignInRequired(false);
    try {
      await apiRequest("/saved", {
        method: "POST",
        body: JSON.stringify({ content_id: id, content_type: "job", reminder_enabled: true }),
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

  return (
    <>
      <section className="jobs-page-hero bg-brand-sage">
        <div className="jobs-page-hero-inner mx-auto w-full max-w-7xl px-4 sm:px-8 grid min-h-64 grid-cols-1 items-center gap-7 py-10 md:grid-cols-[minmax(0,1fr)_minmax(15rem,.7fr)] lg:gap-12">
          <div>
            <Eyebrow>Careergrill / Find jobs</Eyebrow>
            <h1 className="mb-3 text-5xl tracking-tight sm:text-6xl">Find jobs<br /><em>and internships.</em></h1>
            <p className="mb-4 max-w-2xl text-base leading-relaxed text-brand-muted">Search by role, employer or skill. Filter by location and experience, then check the employer’s instructions before you apply.</p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold text-brand-purple">
              <Link className="hover:underline" href="/workspace/jobs">My saved jobs</Link>
              <Link className="hover:underline" href="/scholarships">Looking for a scholarship?</Link>
            </div>
          </div>
          <aside className="border-t border-brand-line pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0 flex flex-col gap-3">
            <Eyebrow>Discover / check / prepare</Eyebrow>
            <h2 className="mb-2 text-2xl">Start with the work<br />you want to do.</h2>
            <p className="text-sm leading-relaxed text-brand-muted">Search by role or skill. Narrow the location and experience level, then read the employer’s requirements before applying.</p>
            <Link className="text-sm text-brand-purple underline font-bold hover:text-brand-orange-dark decoration-2" href="/resources/turn-work-into-cv-evidence">Build evidence for your CV</Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-6">
        <div className="mb-4 rounded border border-brand-line bg-brand-blue p-4">
          <strong className="text-sm">Small directory. Employer sources.</strong>
          <p className="mb-0 mt-1 text-sm text-brand-muted">These listings are maintained manually. Check the source date and employer’s page for current availability, location restrictions and full instructions.</p>
        </div>

        <div className="mb-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
          <label className={filterFieldClassName}>
            <span className="sr-only">Search jobs by title, employer or skill</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job title, employer or skill" />
          </label>
          <label className={filterFieldClassName}>
            <span>Sort by</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="default">Default order</option>
              <option value="closing">Closing date</option>
              <option value="title">A–Z</option>
            </select>
          </label>
        </div>

        <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className={filterFieldClassName}>
            <span>Location</span>
            <select value={location} onChange={(event) => setLocation(event.target.value)}>
              <option value="">Any location</option>
              {filterOptions(items, "location").map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className={filterFieldClassName}>
            <span>Experience level</span>
            <select value={experience} onChange={(event) => setExperience(event.target.value)}>
              <option value="">Any experience</option>
              {filterOptions(items, "experience_level").map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className={filterFieldClassName}>
            <span>Work arrangement</span>
            <select value={arrangement} onChange={(event) => setArrangement(event.target.value)}>
              <option value="">Any arrangement</option>
              {filterOptions(items, "work_arrangement").map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </div>

        <details className="mb-2 rounded border border-brand-line px-3">
          <summary className="cursor-pointer py-3 text-sm font-semibold">More filters</summary>
          <div className="grid gap-3 pb-3 md:grid-cols-2">
            <label className={filterFieldClassName}>
              <span>Employment type</span>
              <select value={employment} onChange={(event) => setEmployment(event.target.value)}>
                <option value="">Any employment type</option>
                {filterOptions(items, "employment_type").map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label className={filterFieldClassName}>
              <span>Closing date</span>
              <select value={closingDate} onChange={(event) => setClosingDate(event.target.value)}>
                <option value="">Any closing date</option>
                {filterOptions(items, "closing_date").map((option) => <option key={option} value={option}>{option === "Not stated by employer" ? option : closingDateLabel(option)}</option>)}
              </select>
            </label>
          </div>
        </details>

        <div className="mb-3 flex justify-end">
          <button className="text-sm font-semibold text-brand-purple hover:underline" type="button" onClick={clearFilters}>Clear all filters</button>
        </div>

        {loadError && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="alert">Could not load the live job directory: {loadError}</p>}
        {notice && <p className="my-3 rounded border border-brand-line bg-brand-blue p-3 text-sm" role="status">{notice} {signInRequired && <Link className="font-semibold text-brand-purple" href="/signin">Sign in ↗</Link>}</p>}

        <div className="my-10 md:mb-10 md:mt-20 flex items-start justify-between gap-4 max-sm:flex-col">
          <div className="flex flex-col gap-5">
            <h2 className="mb-1 text-3xl">{showAll ? "All job opportunities" : "Featured opportunities"}</h2>
            <p className="mb-0 text-sm text-brand-muted">{loading ? "Loading opportunities…" : `${featuredCount} featured opportunities`}</p>
          </div>
          {!showAll && items.length > 0 && (
            <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={() => setShowAll(true)}>
              Browse all jobs ({items.length})
            </button>
          )}
          {showAll && (
            <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={() => setShowAll(false)}>
              Show featured jobs
            </button>
          )}
        </div>

        {loading ? <p className="py-8 text-center text-sm text-brand-muted">Loading job opportunities…</p> : visible.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => {
              const employer = jobValue(item, "employer");
              const initials = jobValue(item, "logo_initials", employer.slice(0, 2).toUpperCase());
              const closingDateValue = jobValue(item, "closing_date", "Not stated by employer");
              const applicationAvailable = item.data.application_page_available === true;
              return (
                <article className="flex min-h-100 flex-col rounded border border-brand-line bg-white p-5" key={item.id}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg text-brand-purple font-bold bg-brand-blue" aria-hidden="true">{initials}</span>
                    <span className="rounded-full bg-brand-blue px-2 py-1 text-xs text-brand-purple">{jobValue(item, "work_arrangement", "Not stated")}</span>
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-eyebrow">{employer}</p>
                  <h3 className="mb-1 text-lg font-bold"><Link className="hover:text-brand-purple" href={contentHref("job", item.slug)}>{item.title}</Link></h3>
                  <p className="mb-2 text-sm text-brand-muted">{jobValue(item, "location", "Location not stated")}</p>
                  <p className="mb-3 text-sm leading-relaxed text-brand-muted">{item.excerpt}</p>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded bg-brand-blue px-2 py-1 text-xs">{jobValue(item, "experience_level", "Not stated")}</span>
                    <span className="rounded bg-brand-blue px-2 py-1 text-xs">{jobValue(item, "employment_type", "Not stated")}</span>
                  </div>
                  <p className="mb-3 text-sm font-semibold">{jobValue(item, "salary", "Salary not disclosed")}</p>
                  <div className="mb-3 grid gap-1 border-y border-brand-line py-2 text-xs">
                    <span className="text-brand-muted">Closing date</span>
                    <strong>{closingDateValue === "Not stated by employer" ? closingDateValue : closingDateLabel(closingDateValue)}</strong>
                  </div>
                  {applicationAvailable && <span className="mb-2 inline-flex self-start rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">Application page available</span>}
                  <div className="mt-auto flex gap-2 w-full">
                    <Link className="w-full" href={contentHref("job", item.slug)}>
                      <Button className={cn("w-full")}>View job</Button>
                    </Link>
                    <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={() => void saveJob(item.id)}>Save job</button>
                  </div>
                  <p className="mb-0 mt-3 text-xs text-brand-muted">Source checked {jobValue(item, "source_checked_at", "date not stated")}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded border border-dashed border-brand-line p-8 text-center">
            <h3 className="mb-2 text-lg font-bold">No matching jobs.</h3>
            <p className="mb-0 text-sm text-brand-muted">Try another search or clear some filters.</p>
          </div>
        )}

        <section className="mt-8 grid items-center gap-5 md:gap-10 rounded-md bg-brand-sage p-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Eyebrow>Prepare your application</Eyebrow>
            <h2 className="mb-2 text-2xl">Found a role worth pursuing?</h2>
            <p className="mb-0 text-sm leading-relaxed text-brand-muted">Use the CV evidence worksheet to organise your examples. For a personal CV review, share the job description and ask Careergrill what the review includes and costs.</p>
          </div>
          <div className="flex flex-col gap-3 font-semibold">
            <Link href="/career-audit?goal=job">
              <Button className="bg-brand-orange hover:bg-brand-orange/90 text-brand-purple">Start an AI job audit</Button>
            </Link>
            <Link className="text-sm font-semibold text-brand-purple underline" href="/resources/turn-work-into-cv-evidence">Open the CV worksheet</Link>
            <Link className="text-sm font-semibold text-brand-purple underline" href="/consultation">Discuss a CV review</Link>
          </div>
        </section>
      </section>
    </>
  );
}
