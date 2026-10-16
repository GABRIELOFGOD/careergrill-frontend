"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import RichContent from "@/components/rich-content";
import { Eyebrow } from "@/components/site-shell";
import { articleSections, blogFallback } from "@/lib/blog-content";
import { sampleContent, type SiteContent } from "@/lib/site-data";

const topics = ["All articles", "Graduate admissions", "Scholarships", "Career documents", "Fellowships", "MBA applications"];

function articleText(item: SiteContent): string {
  return [item.title, item.category, item.excerpt, item.body, ...item.tags].join(" ").toLowerCase();
}

function textValue(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function stringList(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) return value;
  if (typeof value === "string") {
    const lines = value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
    if (lines.length) return lines;
  }
  return fallback;
}

function articleReadTime(item: SiteContent): string {
  const minutes = Number(item.data.reading_minutes);
  return Number.isFinite(minutes) && minutes > 0 ? `${minutes} min read` : "Article";
}

function BlogArtwork({ item, featured = false }: { item: SiteContent; featured?: boolean }) {
  const theme = textValue(item.data.cover_theme, item.category.toLowerCase().replace(/\s+/g, "-"));
  const category = textValue(item.data.cover_label, item.category || "Careergrill");
  const lines = stringList(item.data.cover_lines, ["The question", "Your evidence", "What follows"]);
  return (
    <div className={`blog-artwork blog-artwork-${theme}${featured ? " blog-artwork-featured" : ""}`}>
      <span className="blog-artwork-label">CAREERGRILL / APPLICATION NOTES</span>
      <div className="blog-artwork-paper">
        <small>{category}</small>
        {lines.slice(0, 3).map((line, index) => (
          <div className="blog-artwork-line" key={`${index}-${line}`}><span>0{index + 1}</span><strong>{line}</strong></div>
        ))}
        <em>Start with what you can explain.</em>
      </div>
      <b className="blog-artwork-mark">c<span>.</span></b>
    </div>
  );
}

export function BlogIndexPage() {
  const [articles, setArticles] = useState(blogFallback);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All articles");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    apiRequest<{ items: SiteContent[] }>("/content?type=article")
      .then(({ items }) => {
        setArticles(items);
        setLoadError("");
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "The latest articles could not be loaded.");
      });
  }, []);

  const visibleArticles = useMemo(() => articles.filter((item) => {
    const matchesTopic = topic === "All articles" || item.category.toLowerCase() === topic.toLowerCase();
    return matchesTopic && (!query.trim() || articleText(item).includes(query.trim().toLowerCase()));
  }), [articles, query, topic]);

  const featured = visibleArticles.find((item) => item.data.featured === true) ?? visibleArticles[0];
  const listArticles = visibleArticles.filter((item) => item.id !== featured?.id);

  return (
    <>
      <section className="blog-hero">
        <div className="content-wrap blog-hero-inner">
          <div>
            <Eyebrow>The Careergrill blog</Eyebrow>
            <h1>Guides to jobs,<br />scholarships<br /><em>and application writing.</em></h1>
            <p>Read about the decisions and documents behind a stronger application, from choosing funding to explaining your work.</p>
            {loadError && <small className="blog-data-note" role="status">Showing saved article previews. {loadError}</small>}
          </div>
          <aside>
            <h2>Put the advice to work.</h2>
            <p>Keep a checklist or worksheet beside your draft as you read.</p>
            <Link className="button button-outline" href="/resources">Open the resource library</Link>
          </aside>
        </div>
      </section>

      <section className="content-wrap blog-listing">
        {featured && (
          <article className="blog-featured">
            <div className="blog-featured-copy">
              <Eyebrow>Featured reading</Eyebrow>
              <div className="blog-meta"><span>{featured.category}</span><span>{articleReadTime(featured)}</span></div>
              <h2><Link href={`/blog/${encodeURIComponent(featured.slug)}`}>{featured.title}</Link></h2>
              <p>{featured.excerpt}</p>
              <Link className="button button-primary" href={`/blog/${encodeURIComponent(featured.slug)}`}>Read the article <span aria-hidden="true">↗</span></Link>
              <small>By {textValue(featured.data.author, "Careergrill")}</small>
            </div>
            <Link className="blog-featured-art-link" href={`/blog/${encodeURIComponent(featured.slug)}`} aria-label={`Read ${featured.title}`}>
              <BlogArtwork item={featured} featured />
            </Link>
          </article>
        )}

        <div className="blog-more-heading">
          <Eyebrow>More from the blog</Eyebrow>
          <h2>Make the next decision clearer.</h2>
          <p>Browse by your goal or search for the question you are working through.</p>
        </div>
        <div className="blog-search-row">
          <label className="sr-only" htmlFor="blog-search">Search article titles, topics or advice</label>
          <input id="blog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, topics or advice in an article" />
          {(query || topic !== "All articles") && <button type="button" className="text-button" onClick={() => { setQuery(""); setTopic("All articles"); }}>Reset</button>}
        </div>
        <div className="blog-topic-list" aria-label="Filter articles by topic">
          {topics.map((item) => (
            <button type="button" key={item} className={`topic-chip${topic === item ? " active" : ""}`} aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>
          ))}
        </div>
        <p className="blog-results-count">{visibleArticles.length} {visibleArticles.length === 1 ? "article" : "articles"}{featured ? " · 1 featured above" : ""}</p>
        {listArticles.length ? (
          <div className="blog-card-grid">
            {listArticles.map((item) => <BlogCard item={item} key={item.id} />)}
          </div>
        ) : (
          <p className="blog-empty-results">No articles match that search. Try another topic or reset your filters.</p>
        )}
        <aside className="blog-listing-cta">
          <div><h2>Have a draft and a deadline?</h2><p>Share your application question, documents and the feedback you need. Ask what the review includes, the fee and delivery date.</p></div>
          <Link className="button button-primary" href="/consultation">Discuss a review</Link>
        </aside>
      </section>
    </>
  );
}

function BlogCard({ item }: { item: SiteContent }) {
  return (
    <article className="blog-card">
      <Link className="blog-card-art-link" href={`/blog/${encodeURIComponent(item.slug)}`} aria-label={`Read ${item.title}`}><BlogArtwork item={item} /></Link>
      <div className="blog-card-copy">
        <div className="blog-meta"><span>{item.category}</span><span>{articleReadTime(item)}</span></div>
        <h3><Link href={`/blog/${encodeURIComponent(item.slug)}`}>{item.title}</Link></h3>
        <p>{item.excerpt}</p>
        <div className="blog-card-footer"><Link href={`/blog/${encodeURIComponent(item.slug)}`}>Read article</Link><span>{textValue(item.data.author, "Careergrill")}</span></div>
      </div>
    </article>
  );
}

export function BlogArticlePage({ slug }: { slug: string }) {
  const [article, setArticle] = useState<SiteContent | null>(
    () => blogFallback.find((item) => item.slug === slug) ?? null,
  );
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const sections = article ? articleSections(article.body) : [];
  const relatedSlug = article && typeof article.data.related_resource_slug === "string" && article.data.related_resource_slug.trim()
    ? article.data.related_resource_slug
    : "match-experience-fellowship-criteria";
  const related = sampleContent.find((item) => item.type === "resource" && item.slug === relatedSlug)
    ?? sampleContent.find((item) => item.slug === "match-experience-fellowship-criteria");
  const relatedTitle = article
    ? textValue(article.data.related_resource_title, related?.title ?? "Match your experience to a fellowship’s criteria")
    : related?.title ?? "Match your experience to a fellowship’s criteria";
  const relatedFormat = String(related?.data.format ?? "Worksheet").toLowerCase();

  useEffect(() => {
    setArticle(blogFallback.find((item) => item.slug === slug) ?? null);
    setLoading(true);
    setLoadError("");
    apiRequest<{ item: SiteContent }>(`/content/${encodeURIComponent(slug)}`)
      .then(({ item }) => {
        if (item.type !== "article") {
          setArticle(null);
          setLoadError("This page is not a blog article.");
          return;
        }
        setArticle(item);
        setLoadError("");
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "The article could not be loaded.");
        if (!blogFallback.some((item) => item.slug === slug)) {
          setArticle(null);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  async function copyArticleLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Article link copied.");
    } catch {
      setMessage("Could not copy the link. Copy it from your browser address bar.");
    }
  }

  if (!article) {
    return <section className="content-wrap blog-article-unavailable">
      {loading ? <p>Loading article…</p> : <>
        <p className="blog-breadcrumbs"><Link href="/resources">Resources</Link><span>/</span><Link href="/blog">Blog</Link></p>
        <Eyebrow>Careergrill / Blog</Eyebrow><h1>Article unavailable.</h1>
        <p>{loadError || "This article may have moved or is no longer published."}</p>
        <Link className="text-link" href="/blog">Back to all articles</Link>
      </>}
    </section>;
  }

  return (
    <article className="content-wrap blog-article-page">
      <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/resources">Resources</Link><span>/</span><Link href="/blog">Blog</Link>
      </nav>
      <header className="blog-article-heading">
        <Eyebrow>{article.category}</Eyebrow>
        <h1>{article.title}</h1>
        <p>{article.excerpt}</p>
        <div className="blog-author">
          <span className="blog-author-mark">c<span>.</span></span>
          <div><strong>{textValue(article.data.author, "Careergrill")}</strong><small>{articleReadTime(article)} · Application notes</small></div>
        </div>
      </header>

      <div className="blog-article-cover"><BlogArtwork item={article} featured /></div>

      <div className="blog-reading-layout">
        <div className="blog-reading-main">
          <RichContent value={article.body} className="blog-article-body" headingIds={sections.map(({ id }) => id)} />
          <div className="blog-copy-link">
            <button className="button button-outline" type="button" onClick={() => void copyArticleLink()}>Copy article link</button>
            {message && <span role="status">{message}</span>}
            {loadError && <span role="status">Showing the saved preview because the article service is unavailable.</span>}
          </div>
          <aside className="blog-related-resource">
            <Eyebrow>Put the advice to work</Eyebrow><h2>{relatedTitle}</h2><p>{related?.excerpt ?? "Build examples around the criteria before you start writing the application."}</p>
            <Link className="button button-dark" href={`/resources/${encodeURIComponent(relatedSlug)}`}>Open the {relatedFormat}</Link>
          </aside>
          <Link className="blog-back-link" href="/blog">Back to all articles</Link>
        </div>

        <aside className="blog-reading-sidebar">
          {sections.length > 0 && <nav className="blog-table-of-contents" aria-label="In this article">
            <strong>In this article</strong>
            <ol>{sections.map(({ id, title }) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ol>
          </nav>}
          <Link className="blog-sidebar-resource" href={`/resources/${encodeURIComponent(relatedSlug)}`}>
            <Eyebrow>Useful alongside this article</Eyebrow><strong>{relatedTitle}</strong><span>Open the tool</span>
          </Link>
          <div className="blog-sidebar-cta">
            <h2>Want feedback on your preparation?</h2>
            <p>Bring your draft, the official instructions and your deadline to the conversation.</p>
            <Link className="button button-outline" href="/consultation">Discuss a statement review</Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
