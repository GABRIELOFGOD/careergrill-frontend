"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api";
import type { SiteContent } from "@/lib/site-data";
import { contentHref } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";

function scholarshipValue(item: SiteContent, key: string, fallback = ""): string {
  const value = item.data[key];
  return typeof value === "string" ? value : fallback;
}

function options(items: SiteContent[], key: string): string[] {
  return [...new Set(items.map((item) => scholarshipValue(item, key)).filter(Boolean))].sort();
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
        scholarshipValue(item, "provider"),
        item.tags.join(" "),
      ].join(" ").toLowerCase();
      return (!searchTerm || searchable.includes(searchTerm))
        && (!studyLevel || scholarshipValue(item, "study_level") === studyLevel)
        && (!destination || scholarshipValue(item, "destination") === destination)
        && (!fundingType || scholarshipValue(item, "funding_type") === fundingType)
        && (!status || scholarshipValue(item, "application_status") === status);
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
      <section className="scholarships-intro">
        <div className="content-wrap scholarships-intro-inner">
          <div>
            <Eyebrow>For African students &amp; graduates</Eyebrow>
            <h1>Find scholarships<br /><em>for your study goals.</em></h1>
            <p>Explore featured scholarships, or search and filter the full directory around your study goals.</p>
          </div>
          <aside className="scholarships-intro-side">
            <span className="scholarships-spark" aria-hidden="true">✦</span>
            <h2>Not sure where to start?</h2>
            <p>A few questions can help narrow your options.</p>
            <Link className="button button-dark" href="/career-audit?goal=scholarship">Find potential matches</Link>
            <small>Preference filters · Eligibility still needs checking</small>
          </aside>
        </div>
      </section>

      <section className="content-wrap scholarships-content">
        <div className="scholarships-notice">
          <span aria-hidden="true">ⓘ</span>
          <p>Browse scholarships, fellowships and institution awards. Each listing shows its status and last source check. Entries marked “Status needs checking” are research leads. Confirm the provider’s requirements before applying.</p>
        </div>

        <div className="scholarship-search-row">
          <label className="scholarship-search">
            <span className="visually-hidden">Search scholarships by name, institution, subject or destination</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, institution, subject or destination" />
          </label>
          <label className="scholarship-filter">
            <span>Sort by</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="default">Default order</option>
              <option value="deadline">Closing date</option>
              <option value="title">A–Z</option>
            </select>
          </label>
        </div>

        <div className="scholarship-filter-row">
          <label className="scholarship-filter">
            <span>Study level</span>
            <select value={studyLevel} onChange={(event) => setStudyLevel(event.target.value)}>
              <option value="">All study levels</option>
              {options(items, "study_level").map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="scholarship-filter">
            <span>Study destination</span>
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              <option value="">All destinations</option>
              {options(items, "destination").map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="scholarship-filter">
            <span>Funding type</span>
            <select value={fundingType} onChange={(event) => setFundingType(event.target.value)}>
              <option value="">All funding types</option>
              {options(items, "funding_type").map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <details className="scholarship-more-filters">
          <summary>More filters</summary>
          <label className="scholarship-filter">
            <span>Application status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {options(items, "application_status").map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </details>

        <div className="scholarship-filter-actions">
          <button className="text-button" type="button" onClick={clearFilters}>Clear all filters</button>
        </div>

        {loadError && <p className="jobs-load-error" role="alert">Could not load the live scholarship directory: {loadError}</p>}
        {notice && <p className="inline-notice" role="status">{notice} {signInRequired && <Link href="/signin">Sign in ↗</Link>}</p>}

        <div className="scholarships-heading">
          <div>
            <h2>{showAll ? "All scholarships" : "Featured scholarships"}</h2>
            <p>A selection to get you started. Search or filter to explore all {filtered.length} opportunities.</p>
          </div>
          {!showAll && items.length > 0 && (
            <button className="button button-outline jobs-browse-button" type="button" onClick={() => setShowAll(true)}>
              Browse all scholarships ({filtered.length})
            </button>
          )}
          {showAll && (
            <button className="button button-outline jobs-browse-button" type="button" onClick={() => setShowAll(false)}>
              Show featured scholarships
            </button>
          )}
        </div>
        <div className="scholarship-secondary-heading">
          <span>{loading ? "Loading opportunities…" : `${featured.length} featured opportunities`}</span>
          <Link href="/workspace">View my saved opportunities</Link>
        </div>

        {loading ? <p className="jobs-loading">Loading scholarships…</p> : visible.length ? (
          <div className="scholarship-grid">
            {visible.map((item) => {
              const initials = scholarshipValue(item, "logo_initials", scholarshipValue(item, "provider").slice(0, 2).toUpperCase());
              const statusBadge = scholarshipValue(item, "application_status", "Status needs checking");
              const deadline = scholarshipValue(item, "deadline", "Not stated by provider");
              return (
                <article className="scholarship-card" key={item.id}>
                  <div className="scholarship-card-top">
                    <span className="scholarship-mark" aria-hidden="true">{initials}</span>
                    <span className={`scholarship-award-badge ${item.data.award_badge_tone === "orange" ? "orange" : ""}`}>{scholarshipValue(item, "award_badge", "Funding details to verify")}</span>
                  </div>
                  <h3><Link href={contentHref("scholarship", item.slug)}>{item.title}</Link></h3>
                  <p className="scholarship-context">{scholarshipValue(item, "destination")} · {scholarshipValue(item, "study_level")}</p>
                  <p className="scholarship-description">{item.excerpt}</p>
                  <div className="scholarship-tags">
                    <span className={item.data.status_tone === "blue" ? "blue" : "green"}>{statusBadge}</span>
                    {scholarshipValue(item, "cycle_label") && <span>{scholarshipValue(item, "cycle_label")}</span>}
                  </div>
                  <div className="scholarship-deadline">
                    <span>Deadline</span>
                    <strong>{deadline}</strong>
                  </div>
                  <div className="scholarship-card-actions">
                    <Link className="scholarship-view-button" href={contentHref("scholarship", item.slug)}>View details</Link>
                    <button className="job-save-button" type="button" onClick={() => void saveScholarship(item.id)}>Save</button>
                  </div>
                  <p className="scholarship-source-date">Official source checked {scholarshipValue(item, "source_checked_at", "date not stated")}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="jobs-empty-state">
            <h3>No matching scholarships.</h3>
            <p>Try another search or clear some filters.</p>
          </div>
        )}
      </section>
    </>
  );
}
