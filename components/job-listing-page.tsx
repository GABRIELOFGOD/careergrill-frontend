"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api";
import type { SiteContent } from "@/lib/site-data";
import { contentHref } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";

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
      <section className="jobs-intro">
        <div className="content-wrap jobs-intro-inner">
          <div className="jobs-intro-copy">
            <Eyebrow>Careergrill / Find jobs</Eyebrow>
            <h1>Find jobs<br /><em>and internships.</em></h1>
            <p>Search by role, employer or skill. Filter by location and experience, then check the employer’s instructions before you apply.</p>
            <div className="jobs-intro-links">
              <Link href="/workspace/jobs">My saved jobs</Link>
              <Link href="/scholarships">Looking for a scholarship?</Link>
            </div>
          </div>
          <aside className="jobs-intro-side">
            <Eyebrow>Discover / check / prepare</Eyebrow>
            <h2>Start with the work<br />you want to do.</h2>
            <p>Search by role or skill. Narrow the location and experience level, then read the employer’s requirements before applying.</p>
            <Link className="text-link" href="/resources/turn-work-into-cv-evidence">Build evidence for your CV</Link>
          </aside>
        </div>
      </section>

      <section className="content-wrap jobs-listing-area">
        <div className="jobs-notice">
          <strong>Small directory. Employer sources.</strong>
          <p>These listings are maintained manually. Check the source date and employer’s page for current availability, location restrictions and full instructions.</p>
        </div>

        <div className="jobs-filter-row">
          <label className="job-search-field">
            <span className="visually-hidden">Search jobs by title, employer or skill</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Job title, employer or skill" />
          </label>
          <label className="job-filter-field">
            <span>Sort by</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="default">Default order</option>
              <option value="closing">Closing date</option>
              <option value="title">A–Z</option>
            </select>
          </label>
        </div>

        <div className="jobs-filter-row jobs-filter-secondary">
          <label className="job-filter-field">
            <span>Location</span>
            <select value={location} onChange={(event) => setLocation(event.target.value)}>
              <option value="">Any location</option>
              {filterOptions(items, "location").map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="job-filter-field">
            <span>Experience level</span>
            <select value={experience} onChange={(event) => setExperience(event.target.value)}>
              <option value="">Any experience</option>
              {filterOptions(items, "experience_level").map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="job-filter-field">
            <span>Work arrangement</span>
            <select value={arrangement} onChange={(event) => setArrangement(event.target.value)}>
              <option value="">Any arrangement</option>
              {filterOptions(items, "work_arrangement").map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </div>

        <details className="jobs-more-filters">
          <summary>More filters</summary>
          <div className="jobs-more-filter-fields">
            <label className="job-filter-field">
              <span>Employment type</span>
              <select value={employment} onChange={(event) => setEmployment(event.target.value)}>
                <option value="">Any employment type</option>
                {filterOptions(items, "employment_type").map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label className="job-filter-field">
              <span>Closing date</span>
              <select value={closingDate} onChange={(event) => setClosingDate(event.target.value)}>
                <option value="">Any closing date</option>
                {filterOptions(items, "closing_date").map((option) => <option key={option} value={option}>{option === "Not stated by employer" ? option : closingDateLabel(option)}</option>)}
              </select>
            </label>
          </div>
        </details>

        <div className="jobs-filter-actions">
          <button className="text-button" type="button" onClick={clearFilters}>Clear all filters</button>
        </div>

        {loadError && <p className="jobs-load-error" role="alert">Could not load the live job directory: {loadError}</p>}
        {notice && <p className="inline-notice" role="status">{notice} {signInRequired && <Link href="/signin">Sign in ↗</Link>}</p>}

        <div className="jobs-listing-heading">
          <div>
            <h2>{showAll ? "All job opportunities" : "Featured opportunities"}</h2>
            <p>{loading ? "Loading opportunities…" : `${featuredCount} featured opportunities`}</p>
          </div>
          {!showAll && items.length > 0 && (
            <button className="button button-outline jobs-browse-button" type="button" onClick={() => setShowAll(true)}>
              Browse all jobs ({items.length})
            </button>
          )}
          {showAll && (
            <button className="button button-outline jobs-browse-button" type="button" onClick={() => setShowAll(false)}>
              Show featured jobs
            </button>
          )}
        </div>

        {loading ? <p className="jobs-loading">Loading job opportunities…</p> : visible.length ? (
          <div className="jobs-grid">
            {visible.map((item) => {
              const employer = jobValue(item, "employer");
              const initials = jobValue(item, "logo_initials", employer.slice(0, 2).toUpperCase());
              const closingDateValue = jobValue(item, "closing_date", "Not stated by employer");
              const applicationAvailable = item.data.application_page_available === true;
              return (
                <article className="job-card" key={item.id}>
                  <div className="job-card-top">
                    <span className="job-employer-mark" aria-hidden="true">{initials}</span>
                    <span className="job-arrangement">{jobValue(item, "work_arrangement", "Not stated")}</span>
                  </div>
                  <p className="job-employer">{employer}</p>
                  <h3><Link href={contentHref("job", item.slug)}>{item.title}</Link></h3>
                  <p className="job-location">{jobValue(item, "location", "Location not stated")}</p>
                  <p className="job-description">{item.excerpt}</p>
                  <div className="job-tags">
                    <span>{jobValue(item, "experience_level", "Not stated")}</span>
                    <span>{jobValue(item, "employment_type", "Not stated")}</span>
                  </div>
                  <p className="job-salary">{jobValue(item, "salary", "Salary not disclosed")}</p>
                  <div className="job-card-details">
                    <span>Closing date</span>
                    <strong>{closingDateValue === "Not stated by employer" ? closingDateValue : closingDateLabel(closingDateValue)}</strong>
                  </div>
                  {applicationAvailable && <span className="job-application-status">Application page available</span>}
                  <div className="job-card-actions">
                    <Link className="job-view-button" href={contentHref("job", item.slug)}>View job</Link>
                    <button className="job-save-button" type="button" onClick={() => void saveJob(item.id)}>Save job</button>
                  </div>
                  <p className="job-source-date">Source checked {jobValue(item, "source_checked_at", "date not stated")}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="jobs-empty-state">
            <h3>No matching jobs.</h3>
            <p>Try another search or clear some filters.</p>
          </div>
        )}

        <section className="jobs-application-callout">
          <div>
            <Eyebrow>Prepare your application</Eyebrow>
            <h2>Found a role worth pursuing?</h2>
            <p>Use the CV evidence worksheet to organise your examples. For a personal CV review, share the job description and ask Careergrill what the review includes and costs.</p>
          </div>
          <div className="jobs-application-links">
            <Link className="button button-dark" href="/career-audit?goal=job">Start an AI job audit</Link>
            <Link href="/resources/turn-work-into-cv-evidence">Open the CV worksheet</Link>
            <Link href="/consultation">Discuss a CV review</Link>
          </div>
        </section>
      </section>
    </>
  );
}
