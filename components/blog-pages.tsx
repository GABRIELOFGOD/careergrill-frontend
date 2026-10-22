"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import RichContent from "@/components/rich-content";
import { Eyebrow } from "@/components/site-shell";
import { articleSections } from "@/lib/blog-content";
import { type SiteContent } from "@/lib/site-data";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const artworkTheme = {
    graduate: "bg-[#ded4eb] text-[#826997]",
    career: "bg-[#d9e8e2] text-[#648777]",
    scholarships: "bg-brand-purple text-[#d5c6e6]",
    funding: "bg-brand-purple text-[#d5c6e6]",
    fellowships: "bg-[#eadfd2] text-[#ae865a]",
    mba: "bg-[#d8e1f0] text-[#6681a5]",
  }[theme] ?? "bg-[#ddd3e8] text-[#765d8c]";
  const category = textValue(item.data.cover_label, item.category || "Careergrill");
  const lines = stringList(item.data.cover_lines, ["The question", "Your evidence", "What follows"]);
  return (
    <div className={cn("relative flex min-h-36 items-center justify-center overflow-hidden bg-brand-sage p-3", featured && "h-full min-h-[19.375rem] p-5", artworkTheme)}>
      <span className="absolute left-3 top-2.5 text-xs tracking-widest">CAREERGRILL / APPLICATION NOTES</span>
      <div className={cn("w-[68%] min-h-24 rotate-[-4deg] bg-[#fffaf2] px-3 py-2.5 text-brand-ink shadow-[5px_6px_0_rgba(36,24,62,.08)]", featured && "min-h-40 w-[62%] p-4.5")}>
        <small className="mb-1 block text-xs uppercase tracking-widest text-brand-eyebrow">{category}</small>
        {lines.slice(0, 3).map((line, index) => (
          <div className={cn("grid min-h-6 grid-cols-[1.25rem_1fr] items-center border-b border-[#e7dfe6] last:border-brand-orange", featured && "min-h-8 grid-cols-[1.75rem_1fr]")} key={`${index}-${line}`}>
            <span className="text-xs text-brand-orange">{String(index + 1).padStart(2, "0")}</span>
            <strong className={cn("overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-tight", featured && "text-sm")}>{line}</strong>
          </div>
        ))}
        <em className="mt-1.5 block text-xs text-[#806c7a]">Start with what you can explain.</em>
      </div>
      <Image src="/logo-icon.png" alt="" width={650} height={673} className={cn("absolute -bottom-1 right-3 size-8 opacity-60", featured && "size-12")} />
    </div>
  );
}

export function BlogIndexPage() {
  const [articles, setArticles] = useState<SiteContent[]>([]);
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

  const topics = useMemo(() => ["All articles", ...new Set(articles.map((item) => item.category.trim()).filter(Boolean))], [articles]);
  const visibleArticles = useMemo(() => articles.filter((item) => {
    const matchesTopic = topic === "All articles" || item.category.toLowerCase() === topic.toLowerCase();
    return matchesTopic && (!query.trim() || articleText(item).includes(query.trim().toLowerCase()));
  }), [articles, query, topic]);

  const featured = visibleArticles.find((item) => item.data.featured === true) ?? visibleArticles[0];
  const listArticles = visibleArticles.filter((item) => item.id !== featured?.id);

  return (
    <div className="flex flex-col gap-10">
      <section className="blog-index-hero bg-brand-sage">
        <div className="blog-index-hero-inner mx-auto w-full max-w-7xl px-4 sm:px-8 grid min-h-64 grid-cols-1 items-center gap-6 py-9 md:grid-cols-[minmax(0,1.2fr)_minmax(16rem,.8fr)]">
          <div>
            <Eyebrow>The Careergrill blog</Eyebrow>
            <h1 className="mb-3 text-5xl tracking-tight sm:text-6xl">Guides to jobs,<br />scholarships<br /><em>and application writing.</em></h1>
            <p className="mb-0 max-w-xl text-base leading-relaxed text-brand-muted">Read about the decisions and documents behind a stronger application, from choosing funding to explaining your work.</p>
            {loadError && <small className="mt-3 block text-xs text-red-800" role="alert">Articles could not be loaded: {loadError}</small>}
          </div>
          <aside className="border-t border-brand-purple/30 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0 flex flex-col gap-3">
            <h2 className="mb-2 text-3xl">Put the advice to work.</h2>
            <p className="text-base text-brand-muted">Keep a checklist or worksheet beside your draft as you read.</p>
            <Link href="/resources">
              <Button variant={"outline"}>Open the resource library</Button>
            </Link>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-6">
        {featured && (
          <article className="mb-8 grid gap-0 overflow-hidden rounded-lg border border-brand-line bg-white lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col gap-3 items-start p-8">
              <Eyebrow>Featured reading</Eyebrow>
              <div className="flex items-center gap-3 text-xs text-brand-purple"><span className="font-bold">{featured.category}</span><span>{articleReadTime(featured)}</span></div>
              <h2 className="mb-3 mt-3 text-4xl leading-snug"><Link href={`/blog/${encodeURIComponent(featured.slug)}`}>{featured.title}</Link></h2>
              <p className="mb-3 text-sm leading-relaxed text-brand-muted">{featured.excerpt}</p>
              <Link className={buttonVariants({ variant: "brand", size: "sm", className: "mt-auto" })} href={`/blog/${encodeURIComponent(featured.slug)}`}>Read the article <span aria-hidden="true">↗</span></Link>
              <small className="mt-3 text-xs text-brand-purple">By {textValue(featured.data.author, "Careergrill")}</small>
            </div>
            <Link className="block min-w-0" href={`/blog/${encodeURIComponent(featured.slug)}`} aria-label={`Read ${featured.title}`}>
              <BlogArtwork item={featured} featured />
            </Link>
          </article>
        )}

        <div className="mb-4 mt-10 flex flex-col gap-3">
          {/* <Eyebrow>More from the blog</Eyebrow> */}
          <h2 className="mb-1 text-3xl">More from the blog</h2>
          <p className="mb-0 text-sm text-brand-muted">Browse by your goal or search for the question you are working through.</p>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5">
          <label className="sr-only" htmlFor="blog-search">Search article titles, topics or advice</label>
          <input className="min-h-11 rounded border border-brand-line bg-white px-3 py-2 text-sm" id="blog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, topics or advice in an article" />
          {(query || topic !== "All articles") && <button type="button" className="text-sm font-semibold text-brand-purple underline" onClick={() => { setQuery(""); setTopic("All articles"); }}>Reset</button>}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Filter articles by topic">
          {topics.map((item) => (
            <button type="button" key={item} className="rounded-full border border-brand-line bg-white px-3 py-1.5 text-xs text-brand-ink aria-pressed:border-brand-ink aria-pressed:bg-brand-ink aria-pressed:text-white" aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>
          ))}
        </div>
        <p className="my-3 text-xs text-brand-purple">{visibleArticles.length} {visibleArticles.length === 1 ? "article" : "articles"}{featured ? " · 1 featured above" : ""}</p>
        {listArticles.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listArticles.map((item) => <BlogCard item={item} key={item.id} />)}
          </div>
        ) : (
          <p className="border border-brand-line bg-white p-5 text-sm text-brand-muted">No articles match that search. Try another topic or reset your filters.</p>
        )}
        <aside className="mt-7 flex items-center justify-between gap-5 rounded bg-brand-sage px-8 py-6 max-md:flex-col max-md:items-start">
          <div className="flex flex-col gap-3"><h2 className="mb-1 text-2xl font-extrabold">Have a draft and a deadline?</h2><p className="mb-0 max-w-xl text-base text-brand-muted">Share your application question, documents and the feedback you need. Ask what the review includes, the fee and delivery date.</p></div>
          <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/consultation">Discuss a review</Link>
        </aside>
      </section>
    </div>
  );
}

function BlogCard({ item }: { item: SiteContent }) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-md border border-brand-line bg-white">
      <Link className="block" href={`/blog/${encodeURIComponent(item.slug)}`} aria-label={`Read ${item.title}`}><BlogArtwork item={item} /></Link>
      <div className="flex min-h-48 flex-1 flex-col gap-3 items-start p-6">
        <div className="flex items-center gap-2 text-xs text-brand-purple"><span>{item.category}</span><span>{articleReadTime(item)}</span></div>
        <h3 className="mb-2 mt-2 font-display text-xl font-extrabold leading-snug"><Link className="hover:text-brand-orange-dark" href={`/blog/${encodeURIComponent(item.slug)}`}>{item.title}</Link></h3>
        <p className="mb-3 text-sm leading-relaxed text-brand-muted">{item.excerpt}</p>
        <div className="mt-auto flex w-full justify-between gap-2 border-t border-[#eee9f0] pt-4 text-xs text-brand-purple"><Link className="font-bold text-brand-ink underline hover:text-brand-orange-dark underline-offset-2" href={`/blog/${encodeURIComponent(item.slug)}`}>Read article</Link><span>{textValue(item.data.author, "Careergrill")}</span></div>
      </div>
    </article>
  );
}

export function BlogArticlePage({ slug }: { slug: string }) {
  const [article, setArticle] = useState<SiteContent | null>(null);
  const [relatedResources, setRelatedResources] = useState<SiteContent[]>([]);
  const [relatedError, setRelatedError] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const sections = article ? articleSections(article.body) : [];
  const configuredRelatedSlug = article && typeof article.data.related_resource_slug === "string" ? article.data.related_resource_slug : "";
  const related = relatedResources.find((item) => item.slug === configuredRelatedSlug) ?? relatedResources[0];
  const relatedSlug = related?.slug ?? "";
  const relatedTitle = article
    ? textValue(article.data.related_resource_title, related?.title ?? "")
    : related?.title ?? "";
  const relatedFormat = String(related?.data.format ?? "").toLowerCase();

  useEffect(() => {
    let active = true;
    setArticle(null);
    setLoading(true);
    setLoadError("");
    setRelatedResources([]);
    setRelatedError("");
    void apiRequest<{ item: SiteContent }>(`/content/${encodeURIComponent(slug)}`)
      .then(({ item }) => {
        if (!active) return;
        if (item.type !== "article") {
          setArticle(null);
          setLoadError("This page is not a blog article.");
          return;
        }
        setArticle(item);
        setLoadError("");
      })
      .catch((error: unknown) => { if (active) setLoadError(error instanceof Error ? error.message : "The article could not be loaded."); })
      .finally(() => { if (active) setLoading(false); });
    void apiRequest<{ items: SiteContent[] }>("/content?type=resource")
      .then(({ items }) => { if (active) setRelatedResources(items); })
      .catch((error: unknown) => { if (active) setRelatedError(error instanceof Error ? error.message : "Related resources could not be loaded."); });
    return () => { active = false; };
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
    return <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 min-h-96 py-6 pb-14">
      {loading ? <p>Loading article…</p> : <>
        <p className="mb-6 flex items-center gap-3 text-sm text-brand-purple"><Link className="underline underline-offset-2" href="/resources">Resources</Link><span>/</span><Link className="underline underline-offset-2" href="/blog">Blog</Link></p>
        <Eyebrow>Careergrill / Blog</Eyebrow><h1>Article unavailable.</h1>
        <p>{loadError || "This article may have moved or is no longer published."}</p>
        <Link className="font-semibold text-brand-purple hover:underline" href="/blog">Back to all articles</Link>
      </>}
    </section>;
  }

  return (
    <article className="blog-article-reader mx-auto w-full max-w-7xl px-4 sm:px-8 py-6 pb-12">
      <nav className="mb-6 flex items-center gap-3 text-sm text-brand-purple" aria-label="Breadcrumb">
        <Link href="/resources">Resources</Link><span>/</span><Link href="/blog">Blog</Link>
      </nav>
      <header className="mx-auto mb-5 max-w-4xl text-center">
        <Eyebrow className="text-brand-eyebrow">{article.category}</Eyebrow>
        <h1 className="mx-auto mb-3">{article.title}</h1>
        <p className="mx-auto mb-4 max-w-3xl text-base text-brand-muted">{article.excerpt}</p>
        {/* {sections.length > 0 && <nav className="mb-5 flex flex-wrap items-center justify-center gap-2" aria-label="Jump to section">
          <span className="mr-1 text-sm font-semibold text-brand-ink">Jump to:</span>
          {sections.map(({ id, title }) => <a className="rounded border border-[#d5c4dc] bg-[#f2ecf7] px-3 py-2 text-sm font-semibold text-brand-ink hover:bg-[#e9def0]" href={`#${id}`} key={id}>{title}</a>)}
        </nav>} */}
        <div className="inline-flex items-center gap-2 text-left">
          <span className="grid size-7 place-items-center rounded-full bg-brand-ink p-1"><Image src="/logo-icon.png" alt="" width={650} height={673} className="size-full object-contain" /></span>
          <div className="grid gap-0.5"><strong className="text-sm">{textValue(article.data.author, "Careergrill")}</strong><small className="text-xs text-brand-muted">{articleReadTime(article)} · Application notes</small></div>
        </div>
      </header>

      <div className="mx-auto mb-7 h-67.5 max-w-4xl overflow-hidden rounded-md"><BlogArtwork item={article} featured /></div>

      <div className="mx-auto grid max-w-7xl items-start gap-8 md:grid-cols-3 grid-cols-1">
        <div className="col-span-2 min-w-0">
          <RichContent value={article.body} className="blog-article-content text-base leading-[1.8] text-brand-muted [&_h2]:scroll-mt-28 [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:border-b [&_h2]:border-brand-line [&_h2]:pb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_p]:mb-3.5" headingIds={sections.map(({ id }) => id)} />
          <div className="my-4 flex flex-wrap items-center gap-3 border-t border-brand-line pt-4 text-sm">
            <Button variant={"outline"} type="button" onClick={() => void copyArticleLink()}>Copy article link</Button>
            {message && <span role="status">{message}</span>}
            {loadError && <span role="alert">Article unavailable: {loadError}</span>}
          </div>
          {related && <aside className="my-4 grid gap-2 rounded border border-brand-line bg-brand-blue p-4">
            <Eyebrow className="text-xs">Put the advice to work</Eyebrow><h2 className="mb-0 text-xl font-bold">{relatedTitle}</h2>{related.excerpt && <p className="mb-1 text-sm text-brand-muted">{related.excerpt}</p>}
            <Link href={`/resources/${encodeURIComponent(relatedSlug)}`}>
              <Button variant="brand">Open the {relatedFormat || "resource"}</Button>
            </Link>
          </aside>}
          {relatedError && <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">Related resources could not be loaded: {relatedError}</p>}
          <Link className="text-sm font-semibold text-brand-purple underline underline-offset-4" href="/blog">Back to all articles</Link>
        </div>

        <aside className="grid w-fit gap-3 top-10 sticky print:hidden">
          {sections.length > 0 && <nav className="rounded border border-brand-line bg-[#f0eaf4] p-3" aria-label="In this article">
            <strong className="text-sm">In this article</strong>
            <ol className="mb-0 mt-2 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-brand-purple">{sections.map(({ id, title }) => <li key={id}><a className="hover:underline" href={`#${id}`}>{title}</a></li>)}</ol>
          </nav>}
          {related && <Link className="grid gap-2 rounded border border-brand-line bg-white p-3" href={`/resources/${encodeURIComponent(relatedSlug)}`}>
            <Eyebrow className="mb-0 text-brand-eyebrow">Useful alongside this article</Eyebrow><strong className="text-sm leading-snug">{relatedTitle}</strong><span className="text-xs font-bold underline">Open the tool</span>
          </Link>}
          <div className="rounded bg-orange-50 p-3">
            <h2 className="mb-2 text-sm font-bold">Want feedback on your preparation?</h2>
            <p className="mb-3 text-xs leading-relaxed text-brand-muted">Bring your draft, the official instructions and your deadline to the conversation.</p>
            <Link href="/consultation">
            <Button variant="outline" className="w-full">
              Discuss a statement review
            </Button>
          </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
