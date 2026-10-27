"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { apiRequest, apiUrl } from "@/lib/api";
import { contentHref, type ContentType, type SiteContent } from "@/lib/site-data";
import { buildConsultationMessage, consultationDropdownServices, createPricingSummary, initialDropdownService, parsePricingSelection, type ConsultationServiceKey, type ConsultationServices } from "@/lib/consultation";
import { homeMarketingCopy } from "@/lib/static-public-copy";
import type { HomeMarketingCopy } from "@/lib/public-copy";
import type { ServicePricingConfig } from "@/lib/service-pricing";
import { Eyebrow } from "@/components/site-shell";
import RichContent from "@/components/rich-content";
import ResourceToolDetail from "@/components/resource-tool-detail";
import { cn } from "@/lib/utils";
import PageHeader from "./ui/page-header";
import Container from "./container";

export function HomePage() {
  const { items: resources } = usePublicContent("resource");
  const { items: articles } = usePublicContent("article");
  const { items: testimonials, error: testimonialError } = usePublicContent("testimonial");
  const featuredArticle = articles.find((item) => item.data.featured === true) ?? articles[0];
  const featuredTestimonial = testimonials[0];
  const home = homeMarketingCopy;
  return (
    <>
      <section className="home-hero mx-auto grid min-h-155 w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-5">
          <Eyebrow>{home.hero.eyebrow}</Eyebrow>
          <h1 className="mb-4 max-w-2xl text-5xl tracking-tight sm:text-[4rem] sm:leading-[1.13]">{home.hero.title}<br />{home.hero.titleLead} <span className="text-brand-orange-dark">{home.hero.titleAccent}</span></h1>
          <p className="mb-7 max-w-xl text-xl leading-relaxed text-brand-muted">{home.hero.description}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link className={buttonVariants({ variant: "brand" })} href={home.hero.buttons[0].href}>{home.hero.buttons[0].label}</Link>
            <Link href={home.hero.buttons[1].href}>
              <Button variant={"outline"}>{home.hero.buttons[1].label}</Button>
            </Link>
            <Link className="inline-flex items-center gap-2 font-semibold text-brand-ink hover:text-brand-orange-dark underline underline-offset-4 hover:no-underline" href={home.hero.buttons[2].href}>{home.hero.buttons[2].label}</Link>
          </div>
          <p className="mb-0 mt-6 text-base text-brand-muted">{home.hero.qualifier}</p>
        </div>
        <aside className="relative overflow-hidden rounded-2xl border border-brand-purple bg-brand-ink px-7 pb-6 pt-8 text-white shadow-[12px_12px_0_#eee8f4] after:absolute after:-right-10 after:-top-20 after:size-52 after:rounded-full after:border after:border-white/15 after:shadow-[0_0_0_20px_rgba(255,255,255,.035),0_0_0_42px_rgba(255,255,255,.03)] sm:px-8">
          <div className="mb-7 flex justify-between gap-3 border-b border-white/20 pb-4 text-sm font-bold uppercase tracking-widest text-[#d2cbdc]"><span>Careergrill / Career Audit</span><span className="rounded-md bg-[#493168] px-2.5 py-1 text-xs text-white">Example</span></div>
          <Eyebrow className="mb-2 text-brand-footer-hover">{home.auditExample.eyebrow}</Eyebrow>
          <h2 className="relative z-10 max-w-xs whitespace-pre-line text-3xl leading-tight text-white">{home.auditExample.title}</h2>
          {home.auditExample.steps.map((step, index) => <div className="relative z-10 grid grid-cols-[3rem_1fr] gap-4 border-b border-white/20 py-3 sm:gap-5 sm:py-4" key={step.title}><span className="grid size-12 place-items-center rounded-lg bg-brand-purple text-lg text-brand-footer-hover">{String(index + 1).padStart(2, "0")}</span><div><strong className="text-lg">{step.title}</strong><p className="mb-0 mt-1 text-base text-[#d2cbdc]">{step.description}</p></div></div>)}
          <Link href="/career-audit" className="relative z-10 mt-4 inline-flex font-semibold text-[#ffc29f] hover:underline">{home.auditExample.link} ↗</Link>
          <div className="-mx-7 -mb-6 mt-5 bg-brand-sage px-7 py-3 text-base text-brand-ink sm:-mx-8 sm:px-8">✦ {home.auditExample.footer}</div>
        </aside>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <div className="mb-7 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start"><div><Eyebrow>{home.features.eyebrow}</Eyebrow><h2 className="mb-0 text-4xl">{home.features.title}</h2></div><Link className="inline-flex items-center gap-2 font-semibold hover:text-brand-orange-dark text-brand-ink underline" href="/services">See all services</Link></div>
          <div className="grid gap-px overflow-hidden rounded border border-brand-line divide-x divide-brand-line sm:grid-cols-2 lg:grid-cols-3">
            {home.features.cards.map((card) => <FeatureCard key={card.number} {...card} />)}
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid gap-12 py-16 md:grid-cols-2">
        <div className="flex flex-col gap-5"><Eyebrow>{home.feedbackExample.eyebrow}</Eyebrow><h2 className="text-5xl">{home.feedbackExample.title}</h2><p className="text-xl text-brand-muted">{home.feedbackExample.description}</p></div>
        <div className="rounded-md border border-brand-line bg-brand-footer p-6"><span className="mb-3 block text-xs font-bold uppercase tracking-widest text-brand-muted">{home.feedbackExample.quoteLabel}</span><blockquote className="border-l-4 border-brand-orange pl-4 text-xl leading-relaxed">“{home.feedbackExample.quote}”</blockquote><div className="bg-[#fff5ef] p-4"><strong>{home.feedbackExample.insightTitle}</strong><p className="mb-0 mt-2 text-sm leading-relaxed text-brand-muted">{home.feedbackExample.insightDescription}</p></div><Link href="/services" className="mt-3 inline-flex font-semibold text-brand-ink hover:text-brand-orange-dark underline underline-offset-4">{home.feedbackExample.link}</Link></div>
      </section>
      <section className="bg-brand-blue py-16"><div className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid items-center gap-7 md:grid-cols-2"><div className="flex flex-col gap-5"><Eyebrow>{home.testimonial.eyebrow}</Eyebrow><h2 className="text-5xl">{home.testimonial.title}</h2><Link href="/client-feedback" className="font-semibold hover:text-brand-orange-dark text-brand-ink underline underline-offset-4 hover:no-underline">{home.testimonial.link}</Link></div>{featuredTestimonial ? <article className="rounded-md border border-brand-line bg-brand-footer p-6"><span className="text-xs font-bold uppercase tracking-widest text-brand-muted">{featuredTestimonial.category || "Client feedback"}</span><h3 className="my-3 font-display text-xl font-bold">{featuredTestimonial.title}</h3><RichContent value={featuredTestimonial.body} className="mb-3 text-sm leading-relaxed text-brand-muted" /><small>{String(featuredTestimonial.data.author ?? featuredTestimonial.title)}</small></article> : testimonialError ? <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">{testimonialError}</p> : <p className="mb-0 text-sm text-brand-muted">{home.testimonial.empty}</p>}</div></section>
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <div className="mb-7 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start"><div><Eyebrow>{home.resources.eyebrow}</Eyebrow><h2 className="mb-0 text-5xl">{home.resources.title}</h2></div><div className="flex flex-wrap gap-4"><Link className="font-semibold text-brand-ink hover:text-brand-orange-dark underline" href="/resources">{home.resources.resourcesLink}</Link><Link className="font-semibold text-brand-ink hover:text-brand-orange-dark underline" href="/blog">{home.resources.blogLink}</Link></div></div>
          <div className="grid gap-4 md:grid-cols-3">{resources.slice(0, 3).map((item) => <article className="flex min-h-52 flex-col gap-5 rounded-md border border-brand-line bg-brand-footer p-5" key={item.id}><span className="text-xs font-bold uppercase tracking-widest text-brand-muted">{item.category} / {String(item.data.format ?? "Checklist")}</span><h3 className="mb-2 mt-3 font-display text-2xl font-bold"><Link href={`/resources/${item.slug}`}>{item.title}</Link></h3><p className="text-sm text-brand-muted">{item.excerpt}</p><Link className="mt-auto font-semibold text-brand-ink hover:text-brand-orange-dark underline underline-offset-4 hover:no-underline" href={`/resources/${item.slug}`}>Open {String(item.data.format ?? "checklist").toLowerCase()}</Link></article>)}</div>
        </div>
      </section>
      {featuredArticle && <section className="bg-brand-cream py-10"><div className="mx-auto w-full max-w-7xl px-4 sm:px-8 flex items-center justify-between gap-6 max-md:flex-col max-md:items-start"><div className="flex flex-col gap-5"><Eyebrow>{home.article.eyebrow}</Eyebrow><h2 className="mb-2 max-w-2xl text-3xl">{featuredArticle.title}</h2><p className="max-w-3xl text-lg text-brand-muted">{featuredArticle.excerpt}</p><Link href={contentHref("article", featuredArticle.slug)}>
        <Button variant={"outline"}>{home.article.readLink}</Button>
      </Link></div><Link className="font-semibold text-brand-ink underline underline-offset-4 hover:no-underline" href="/blog">{home.article.browseLink} ↗</Link></div></section>}
      <Callout copy={home.callout} />
    </>
  );
}

function FeatureCard({ number, title, body, href, link }: { number: string; title: string; body: string; href: string; link: string }) {
  return <Link className="group flex min-h-64 flex-col bg-white p-6 transition hover:bg-brand-footer" href={href}><span className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-eyebrow">{number}</span><h3 className="mb-3 font-display text-xl font-bold">{title}</h3><p className="mb-4 text-sm leading-relaxed text-brand-muted">{body}</p><span className="mt-auto inline-flex items-center gap-2 font-semibold text-brand-ink underline underline-offset-4 group-hover:no-underline">{link}</span></Link>;
}

function Callout({ copy }: { copy: HomeMarketingCopy["callout"] }) {
  return <section className="bg-brand-cream py-20 text-center"><div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-8"><Eyebrow>{copy.eyebrow}</Eyebrow><h2 className="mb-3 max-w-sm text-5xl">{copy.title}</h2><p className="mb-6 max-w-2xl text-base text-brand-muted">{copy.description}</p><div className="flex flex-wrap justify-center gap-3"><Link className={buttonVariants({ variant: "brand" })} href="/career-audit">{copy.auditLink}</Link><Link href="/consultation?mode=call">
    <Button variant={"outline"}>{copy.consultationLink}</Button></Link></div></div></section>;
}

function usePublicContent(type: ContentType) {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setError("");
    apiRequest<{ items: SiteContent[] }>(`/content?type=${type}`)
      .then((result) => {
        if (active) setItems(result.items);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : `Could not load ${type} content.`);
      });
    return () => { active = false; };
  }, [type]);
  return { items, error };
}

function ResourceCard({ item }: { item: SiteContent }) {
  const format = String(item.data.format ?? "Worksheet");
  const icon = format === "Checklist" ? "✓" : format === "Template" ? "¶" : "↗";
  const action = format === "Checklist" ? "Open checklist" : format === "Template" ? "Open template" : "Open worksheet";
  return <article className="flex min-h-60 flex-col rounded border border-brand-line bg-white p-5">
    <div className="mb-3 flex items-center justify-between gap-3"><span className="grid size-10 place-items-center rounded-lg bg-brand-blue text-lg font-bold text-brand-purple" aria-hidden="true">{icon}</span><span className="rounded-full bg-brand-sage px-2.5 py-1 text-xs font-semibold text-brand-purple">{format}</span></div>
    <span className="text-xs font-semibold uppercase tracking-wide text-brand-eyebrow">{item.category}</span>
    <h3 className="mb-2 mt-2 font-display text-lg font-bold"><Link className="hover:text-brand-purple" href={`/resources/${item.slug}`}>{item.title}</Link></h3>
    <p className="text-sm leading-relaxed text-brand-muted">{item.excerpt}</p>
    <Link className="mt-auto inline-flex items-center gap-2 font-semibold text-brand-orange-dark hover:underline" href={`/resources/${item.slug}`}>{action}<span aria-hidden="true">↗</span></Link>
  </article>;
}

export function ResourcePage() {
  const { items: resources, error: resourceError } = usePublicContent("resource");
  const resourceTopics = useMemo(() => ["All resources", ...new Set(resources.map((item) => item.category.trim()).filter(Boolean))], [resources]);
  const resourceFormats = useMemo(() => ["All formats", ...new Set(resources.map((item) => String(item.data.format ?? "").trim()).filter(Boolean))], [resources]);
  const [topic, setTopic] = useState("All resources");
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("All formats");
  const visibleResources = useMemo(() => resources.filter((item) => {
    const matchesTopic = topic === "All resources" || item.category.toLowerCase() === topic.toLowerCase();
    const matchesFormat = format === "All formats" || String(item.data.format ?? "").toLowerCase() === format.toLowerCase();
    const searchText = `${item.title} ${item.category} ${item.excerpt} ${item.tags.join(" ")}`.toLowerCase();
    return matchesTopic && matchesFormat && (!query.trim() || searchText.includes(query.trim().toLowerCase()));
  }), [resources, topic, query, format]);

  return <>
    <section className="resource-page-hero bg-brand-sage">
      <div className="resource-page-hero-inner mx-auto w-full max-w-7xl px-4 sm:px-8 grid min-h-56 grid-cols-1 items-center gap-8 py-9 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,.85fr)]">
        <div>
          <Eyebrow>The Careergrill resource library</Eyebrow>
          <h1 className="mb-3 max-w-3xl text-5xl tracking-tight sm:text-6xl">Practical help for<br /><em>your next application.</em></h1>
          <p className="mb-0 max-w-2xl text-base leading-relaxed text-brand-muted">Checklists, worksheets and planning tools for scholarships, graduate admissions and the documents you need next.</p>
        </div>
        <aside className="rounded-md flex flex-col gap-3 p-5">
          <h2 className="mb-2 text-2xl font-bold">Know what needs attention first.</h2>
          <p className="text-sm leading-relaxed text-brand-muted">The AI Career Audit helps you assess your job search or study application before you start drafting.</p>
          <Link href="/career-audit">
            <Button className={"w-fit"} variant="brand">Start an AI Career Audit</Button>
          </Link>
        </aside>
      </div>
    </section>
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-7">
      <div className="mb-5 flex flex-wrap gap-2" aria-label="Filter resources by topic">
        {resourceTopics.map((item) => <button type="button" key={item} className="rounded-full border border-brand-line bg-white px-3 py-1.5 text-sm aria-pressed:border-brand-purple aria-pressed:bg-brand-purple aria-pressed:text-white" aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>)}
      </div>
      <div className="mb-4 flex items-end justify-between gap-5 max-md:flex-col max-md:items-start">
        <div><h2 className="mb-2 text-3xl">Find the tool you need.</h2><p className="mb-0 max-w-3xl text-sm text-brand-muted">Answer the questions here, then download your notes as a text file or print a PDF. Keep a copy before closing this tab.</p></div>
        <Link className="text-sm font-semibold text-brand-purple hover:underline" href="/blog">Prefer an article? Read application guides</Link>
      </div>
      <div className="mb-4 grid items-end gap-3 rounded border border-brand-line bg-brand-blue p-4 md:grid-cols-[minmax(0,1fr)_12rem_12rem_auto]">
        <label className="grid gap-1.5 text-sm font-semibold">Search resources
          <input className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 text-sm font-normal" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try motivation letter, CV or funding" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">Topic
          <select className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 text-sm font-normal" value={topic} onChange={(event) => setTopic(event.target.value)}>
            {resourceTopics.map((item) => <option key={item} value={item}>{item === "All resources" ? "All topics" : item}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">Format
          <select className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 text-sm font-normal" value={format} onChange={(event) => setFormat(event.target.value)}>
            {resourceFormats.map((item) => <option key={item} value={item}>{item === "All formats" ? "All formats" : item}</option>)}
          </select>
        </label>
        <button className="min-h-10 rounded border border-brand-line bg-white px-3 text-sm font-semibold hover:bg-brand-sage" type="button" onClick={() => { setTopic("All resources"); setFormat("All formats"); setQuery(""); }}>Reset</button>
      </div>
      {resourceError && <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">Resources could not be loaded: {resourceError}</p>}
      <p className="my-3 text-sm text-brand-muted" aria-live="polite">{visibleResources.length} {visibleResources.length === 1 ? "resource" : "resources"}</p>
      {visibleResources.length > 0
        ? <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{visibleResources.map((item) => <ResourceCard key={item.id} item={item} />)}</div>
        : <p className="border border-brand-line bg-white p-5 text-sm text-brand-muted">No resources match those filters. Try another topic or reset your search.</p>}
      <aside className="mt-7 flex items-center justify-between gap-5 rounded bg-brand-sage p-5 max-md:flex-col max-md:items-start">
        <div><h2 className="mb-1 text-xl font-bold">Read the advice behind the tool.</h2><p className="mb-0 text-sm text-brand-muted">Explore practical articles on application writing, funding decisions and explaining your experience.</p></div>
        <Link href="/blog">
          <Button variant="outline">
            Explore the Careergrill blog
          </Button>
        </Link>
      </aside>
    </section>
  </>;
}

export function FeedbackPage() {
  const [items, setItems] = useState<SiteContent[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [feedbackLoadError, setFeedbackLoadError] = useState("");
  const [name, setName] = useState("");
  const [context, setContext] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionNotice, setSubmissionNotice] = useState<{ message: string; isError: boolean } | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingFeedback(true);
    setFeedbackLoadError("");
    apiRequest<{ items: SiteContent[]; total: number; totalPages: number }>(`/content/testimonials?page=${page}`)
      .then((result) => {
        if (!active) return;
        setItems(result.items);
        setTotal(result.total);
        setTotalPages(result.totalPages);
        if (page > result.totalPages) setPage(result.totalPages);
      })
      .catch((error: unknown) => {
        if (active) setFeedbackLoadError(error instanceof Error ? error.message : "Could not load client feedback.");
      })
      .finally(() => {
        if (active) setLoadingFeedback(false);
      });
    return () => {
      active = false;
    };
  }, [page]);

  async function submitFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmissionNotice(null);
    try {
      const result = await apiRequest<{ message: string }>("/content/testimonials", {
        method: "POST",
        body: JSON.stringify({ name, context, feedback: feedbackText, consent }),
      });
      setSubmissionNotice({ message: result.message, isError: false });
      setName("");
      setContext("");
      setFeedbackText("");
      setConsent(false);
    } catch (error) {
      setSubmissionNotice({
        message: error instanceof Error ? error.message : "Could not submit your feedback. Please try again.",
        isError: true,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return <>
    <PageHeader
      header="client feedback"
      title={<>A client’s experience<br /> with Careergrill.</>}
      description="Read approved client stories, or share your own experience for review."
    />
    <Container className="space-y-7 py-10 flex flex-col gap-10">
      {items.map((item) => (
        <article className="grid overflow-hidden rounded border border-brand-line bg-white md:grid-cols-2" key={item.id}>
          <div className="p-6 md:p-8">
            <Eyebrow>{item.category || "Client feedback"}</Eyebrow>
            <h2 className="my-3 text-3xl">{item.title}</h2>
            <RichContent value={item.body} className="my-5 border-l-2 border-brand-orange pl-4 text-lg leading-relaxed text-brand-muted" />
            <div className="mb-4 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-brand-blue text-sm font-bold text-brand-purple" aria-hidden="true">{String(item.data.initials ?? "CG")}</span>
              <div className="grid">
                <strong>{String(item.data.author ?? item.title)}</strong>
                <small className="text-sm text-brand-muted">{String(item.data.attribution ?? item.excerpt)}</small>
              </div>
            </div>
            <Link className="text-sm font-semibold text-brand-purple hover:underline" href={contentHref("testimonial", item.slug)}>Read this client story ↗</Link>
          </div>
          <div className="relative grid min-h-72 place-items-center bg-brand-blue p-6" aria-hidden="true">
            <span className="absolute left-5 top-5 text-xs font-semibold uppercase tracking-widest text-brand-purple">Application review</span>
            <div className="w-full max-w-sm rotate-1 rounded bg-white p-5 shadow-lg">
              <small className="mb-4 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Your experience / your voice</small>
              {["Choose the evidence.", "Explain the connection.", "Keep it yours."].map((label, index) => <div className="flex items-center gap-3 border-t border-brand-line py-3" key={label}><span className="font-display text-sm font-bold text-brand-orange">0{index + 1}</span><strong>{label}</strong></div>)}
              <em className="mt-2 block text-right text-xs text-brand-muted">The story belongs to the applicant.</em>
            </div>
            <b className="absolute bottom-3 right-5 font-display text-5xl text-brand-purple">c<span className="text-brand-orange">.</span></b>
          </div>
        </article>
      ))}
      {feedbackLoadError && <p className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-800" role="alert">{feedbackLoadError}</p>}
      {loadingFeedback && <p className="text-sm text-brand-muted" role="status">Loading client feedback…</p>}
      {!loadingFeedback && !feedbackLoadError && items.length === 0 && <p className="rounded border border-brand-line bg-white p-4 text-sm text-brand-muted">There are no additional published client stories yet.</p>}
      {totalPages > 1 && <nav className="flex items-center justify-between gap-4" aria-label="Client feedback pages">
        <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" disabled={page <= 1 || loadingFeedback} onClick={() => setPage((current) => current - 1)}>Previous</button>
        <span className="text-sm text-brand-muted" aria-live="polite">Page {page} of {totalPages} · {total} published {total === 1 ? "story" : "stories"}</span>
        <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" disabled={page >= totalPages || loadingFeedback} onClick={() => setPage((current) => current + 1)}>Next</button>
      </nav>}
      <section className="grid gap-5 rounded-lg border border-brand-line bg-white p-5 sm:p-7" aria-labelledby="share-feedback-title">
        <div>
          <Eyebrow>Share your experience</Eyebrow>
          <h2 id="share-feedback-title" className="mb-2 text-2xl">Write client feedback.</h2>
          <p className="mb-0 text-sm leading-relaxed text-brand-muted">Tell others about your experience with Careergrill. Every submission is reviewed before it can appear publicly.</p>
        </div>
        <form className="grid gap-4 [&_input:not([type=checkbox])]:min-h-10 [&_input:not([type=checkbox])]:rounded [&_input:not([type=checkbox])]:border [&_input:not([type=checkbox])]:border-brand-line [&_input:not([type=checkbox])]:px-3 [&_input:not([type=checkbox])]:py-2 [&_textarea]:rounded [&_textarea]:border [&_textarea]:border-brand-line [&_textarea]:px-3 [&_textarea]:py-2" onSubmit={(event) => void submitFeedback(event)}>
          <label className="grid gap-1.5 text-sm font-semibold">Name to show if approved
            <input value={name} onChange={(event) => setName(event.target.value)} minLength={2} maxLength={100} autoComplete="name" required />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">What did you work with Careergrill on? <span className="font-normal text-brand-muted">(optional)</span>
            <input value={context} onChange={(event) => setContext(event.target.value)} maxLength={100} placeholder="For example, statement of purpose support" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">Your feedback
            <textarea value={feedbackText} onChange={(event) => setFeedbackText(event.target.value)} minLength={20} maxLength={5000} rows={6} required placeholder="Share what your experience was like and what was helpful." />
          </label>
          <label className="flex items-start gap-2 text-sm leading-relaxed text-brand-muted">
            <input className="mt-1" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
            I agree that Careergrill may publish my feedback and the name above if it is approved.
          </label>
          <button className={`${buttonVariants({ variant: "brand", size: "sm" })} justify-self-start`} disabled={submitting}>{submitting ? "Submitting…" : "Submit feedback"}</button>
          {submissionNotice && <p className={`mb-0 rounded border p-3 text-sm ${submissionNotice.isError ? "border-red-300 bg-red-50 text-red-800" : "border-brand-line bg-brand-blue"}`} role={submissionNotice.isError ? "alert" : "status"}>{submissionNotice.message}</p>}
        </form>
      </section>
      <aside className="flex items-center justify-between gap-5 rounded bg-brand-sage p-5 max-md:flex-col max-md:items-start">
        <div><h2 className="mb-1 text-xl font-bold">Want to discuss your own application?</h2><p className="mb-0 text-sm text-brand-muted">Bring your goal and the part of the process you need help with.</p></div>
        <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/consultation?mode=call">Book a free 15-minute call</Link>
      </aside>
    </Container>
  </>;
}

export function FaqPage() {
  const [faqs, setFaqs] = useState<{ id: string; title: string; body: string; category: string }[]>([]);
  const [faqError, setFaqError] = useState("");
  const [faqLoading, setFaqLoading] = useState(true);
  useEffect(() => {
    let active = true;
    void apiRequest<{ items: typeof faqs }>("/content/faqs")
      .then(({ items }) => { if (active) setFaqs(items); })
      .catch((error: unknown) => { if (active) setFaqError(error instanceof Error ? error.message : "Could not load FAQs."); })
      .finally(() => { if (active) setFaqLoading(false); });
    return () => { active = false; };
  }, []);
  const groups = useMemo(() => {
    const grouped = new Map<string, typeof faqs>();
    faqs.forEach((faq) => {
      const category = faq.category.trim() || "General questions";
      grouped.set(category, [...(grouped.get(category) ?? []), faq]);
    });
    return Array.from(grouped, ([title, questions]) => ({ title, questions }));
  }, [faqs]);
  return <section className="faq-page min-h-screen bg-brand-cream px-4 py-8 sm:px-8">
    <Container className="faq-page-shell">
    <div className="faq-page-content">
      <header className="faq-page-heading">
        <Eyebrow>Help &amp; FAQs</Eyebrow>
        <h1>Answers before<br />you take your next step.</h1>
        <p>Find the support you need, understand what you’re booking and keep track of your saved work.</p>
        {groups.length > 0 && <nav className="faq-topics" aria-label="Jump to FAQ topic">
          <span className="faq-topics-label">Jump to:</span>
          {groups.map((group) => {
            const id = `faq-${group.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
            return <a href={`#${id}`} key={group.title}>{group.title}</a>;
          })}
        </nav>}
      </header>
      {faqError && <p className="mt-5 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">{faqError}</p>}
      {faqLoading && <p className="mt-5 text-sm text-brand-muted" role="status">Loading FAQs…</p>}
      {!faqLoading && !faqError && !groups.length && <p className="mt-5 rounded border border-brand-line bg-white p-4 text-sm text-brand-muted">There are no FAQs to display yet.</p>}
      {groups.map((group) => {
        const id = `faq-${group.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
        return <section className="border-b border-brand-line py-5" id={id} key={group.title}>
        <h2 className="mb-2 text-lg font-bold">{group.title}</h2>
        {group.questions.map((faq) => <details className="border-t border-brand-line py-3" key={faq.id}>
          <summary className="cursor-pointer text-sm font-semibold marker:text-brand-purple">{faq.title}</summary>
          <RichContent value={faq.body} className="mt-3 text-sm leading-relaxed text-brand-muted [&_p]:mb-3 [&_p:last-child]:mb-0 [&_a]:text-brand-purple" />
        </details>)}
      </section>;
      })}
      <div className="bg-brand-sage p-10 rounded-lg mt-10 flex flex-col gap-5">
        <h2 className="text-3xl font-bold">Still have a question?</h2>
        <p>Tell us what you’re working on and the help you need.</p>
        <div className="flex gap-5">
          <Link className={buttonVariants({ variant: "brand" })} href="/consultation">Draft a service enquiry</Link>
          <Link href="/consultation?mode=call">
            <Button variant={"outline"}>Book a free 15-minute call</Button>
          </Link>
        </div>
      </div>
    </div>
    </Container>
  </section>;
}

export function PrivacyPage() {
  return <section className="privacy-page min-h-screen bg-brand-cream px-4 py-8 sm:px-8">
    <div className="privacy-page-content mx-auto w-full">
      <header className="border-b border-brand-line pb-6">
        <Eyebrow>Your information</Eyebrow>
        <h1 className="mb-3 mt-2 text-4xl tracking-tight">What you share.<br />Where it is used.</h1>
        <p className="mb-0 text-sm leading-relaxed text-brand-muted">Privacy information for the Careergrill website. Updated 15 October 2026.</p>
      </header>
      <article>
        <section className="border-b border-brand-line py-5">
          <h2 className="mb-2 text-lg font-bold">Your account and saved work</h2>
          <p className="mb-0 text-sm leading-relaxed text-brand-muted">Signing in connects your account identifier, name and email to your saved workspace. Careergrill stores saved opportunities, application notes, preferences, audit answers and feedback so you can return to them. You need to sign in to open your saved workspace.</p>
        </section>
        <section className="border-b border-brand-line py-5">
          <h2 className="mb-2 text-lg font-bold">AI-generated feedback</h2>
          <p className="mb-3 text-sm leading-relaxed text-brand-muted">When you choose Generate AI feedback, your audit answers are sent to OpenAI to produce an assessment. The request does not include your account name or email automatically. Anything you paste into an answer is included, so leave out contact details, identification numbers and confidential third-party information.</p>
          <p className="mb-3 text-sm leading-relaxed text-brand-muted">Careergrill asks OpenAI not to save generated responses for later retrieval. OpenAI’s own processing and retention terms still apply. <a className="font-semibold text-brand-purple underline" href="https://openai.com/policies/privacy-policy/" target="_blank" rel="noreferrer">Read OpenAI’s privacy policy.</a></p>
          <p className="mb-0 text-sm leading-relaxed text-brand-muted">The answers and resulting feedback are saved in Careergrill’s hosted account storage. Personal reviews and consultations are arranged separately.</p>
        </section>
        <section className="border-b border-brand-line py-5">
          <h2 className="mb-2 text-lg font-bold">Drafts and resource worksheets</h2>
          <p className="mb-0 text-sm leading-relaxed text-brand-muted">Unsaved audit drafts, enquiry drafts and worksheet notes use this browser tab’s temporary storage. They survive reloads in the same tab and are cleared when that session ends. They do not automatically sync across devices. Download or save work you want to keep.</p>
        </section>
        <section className="border-b border-brand-line py-5">
          <h2 className="mb-2 text-lg font-bold">Enquiries and consultations</h2>
          <p className="mb-0 text-sm leading-relaxed text-brand-muted">A prepared enquiry remains in this tab until you send it through email or WhatsApp. Those services and the linked booking provider process information under their own policies. A consultation and any paid human review are arranged separately from the AI audit.</p>
        </section>
        <section className="border-b border-brand-line py-5">
          <h2 className="mb-2 text-lg font-bold">Website analytics</h2>
          <p className="mb-0 text-sm leading-relaxed text-brand-muted">When configured by an administrator, Google Tag Manager loads on every page visit and may run analytics or other tags configured in that container. Those tags may collect information such as pages viewed, browser and device details, and interactions. Google and other services activated through the container may use cookies or similar technologies and process information under their own policies. Learn more in <a className="font-semibold text-brand-purple underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Google’s privacy policy</a>.</p>
        </section>
        <section className="border-b border-brand-line py-5">
          <h2 className="mb-2 text-lg font-bold">Keeping and deleting information</h2>
          <p className="mb-0 text-sm leading-relaxed text-brand-muted">Saved work remains available in your account until you delete it or request its removal. You can delete individual audits in <Link className="font-semibold text-brand-purple underline" href="/my-audits">My audits</Link> and remove saved opportunities in your workspace. To request removal of other account-linked information or ask about a copy, email <a className="font-semibold text-brand-purple underline" href="mailto:info@careergrill.com">info@careergrill.com</a>. Hosting providers may retain operational records or backups under their own retention arrangements.</p>
        </section>
        <section className="py-5">
          <h2 className="mb-2 text-lg font-bold">Questions</h2>
          <p className="mb-0 text-sm leading-relaxed text-brand-muted">Careergrill uses hosting and AI service providers to operate these features. Contact <a className="font-semibold text-brand-purple underline" href="mailto:info@careergrill.com">info@careergrill.com</a> about how your information is used or to report a concern.</p>
        </section>
      </article>
    </div>
  </section>;
}

export function ConsultationPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "call" ? "call" : "enquiry";
  const [packageSelection, setPackageSelection] = useState(() => parsePricingSelection(new URLSearchParams(searchParams.toString())));
  const packageSelectionRef = useRef(packageSelection);
  const [service, setService] = useState<ConsultationServiceKey>("help");
  const [serviceConfig, setServiceConfig] = useState<ConsultationServices | null>(null);
  const [serviceConfigError, setServiceConfigError] = useState("");
  const [serviceConfigLoading, setServiceConfigLoading] = useState(true);
  const [pricing, setPricing] = useState<ServicePricingConfig | null>(null);
  const [pricingLoadError, setPricingLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [goal, setGoal] = useState("");
  const [process, setProcess] = useState("");
  const [deadline, setDeadline] = useState("");
  const [details, setDetails] = useState("");
  const [prepared, setPrepared] = useState("");
  const [previousMessage, setPreviousMessage] = useState("");
  const [copiedNotice, setCopiedNotice] = useState("");
  const preparedRef = useRef<HTMLTextAreaElement>(null);
  const preparedMessage = useRef(prepared);
  const packageSummary = useMemo(() => pricing ? createPricingSummary(packageSelection, pricing) : null, [packageSelection, pricing]);
  const activeService = packageSelection ? packageSummary?.service ?? service : service;

  useEffect(() => {
    let active = true;
    void apiRequest<{ pricing: ServicePricingConfig }>("/pricing")
      .then(({ pricing: savedPricing }) => {
        if (active) setPricing(savedPricing);
      })
      .catch((error: unknown) => {
        if (active) setPricingLoadError(error instanceof Error ? error.message : "Updated service prices could not be loaded.");
      });
    void apiRequest<{ consultation_services: ConsultationServices }>("/config/consultation")
      .then(({ consultation_services: services }) => {
        if (!active) return;
        setServiceConfig(services);
        setService(initialDropdownService(packageSelectionRef.current, services));
      })
      .catch((error: unknown) => {
        if (active) setServiceConfigError(error instanceof Error ? error.message : "Consultation information could not be loaded.");
      })
      .finally(() => { if (active) setServiceConfigLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    preparedMessage.current = prepared;
  }, [prepared]);

  function markMessageOutdated() {
    if (!prepared) return;
    setPreviousMessage(prepared);
    setPrepared("");
    setCopiedNotice("");
    setMessage("Your details have changed. Update the message when ready. Your previous message is kept below so you can reuse any edits.");
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceConfig) return;
    const text = buildConsultationMessage({
      service: activeService,
      goal,
      stage: process,
      deadline,
      details,
      packageSummary,
      services: serviceConfig,
    });
    setPrepared(text);
    setMessage("Your message is ready to review. Copy it or open WhatsApp or email when you want to send it.");
    setCopiedNotice("");
  }

  async function copyMessage() {
    if (!prepared.trim()) {
      setCopiedNotice("Add a message before copying.");
      return;
    }
    const copyVersion = prepared;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard access is unavailable.");
      await navigator.clipboard.writeText(copyVersion);
      setCopiedNotice(preparedMessage.current === copyVersion
        ? "Message copied. Paste it into your preferred app to send it."
        : "The earlier version was copied. Copy again to include your latest edit.");
    } catch {
      preparedRef.current?.focus();
      preparedRef.current?.select();
      setCopiedNotice("Your message is highlighted. Select Copy from your device’s menu to copy it.");
    }
  }
  if (!serviceConfig) {
    return <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8">
      {serviceConfigLoading ? <p role="status">Loading consultation information…</p> : <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">Consultation information could not be loaded from the backend: {serviceConfigError}</p>}
    </section>;
  }
  const serviceDetails = serviceConfig[activeService];
  const dropdownServices = consultationDropdownServices(serviceConfig);
  const callMessage = encodeURIComponent("Hello Careergrill, I would like to arrange a free 15-minute consultation. Please let me know what times are available.");
  return <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-20">
    <Link className="mb-5 inline-block text-sm font-semibold text-brand-purple underline hover:text-brand-orange-dark" href="/services">All services</Link>
    <header className="mb-6 max-w-3xl">
      <Eyebrow>{mode === "call" ? "Free 15-minute consultation" : "Discuss your support"}</Eyebrow>
      <h1 className="my-2 text-5xl font-extrabold">{mode === "call" ? "Talk through your next step." : "Tell us what you need."}</h1>
      <p className="mb-0 leading-relaxed text-xl font-medium text-brand-muted">{mode === "call"
        ? "Bring your goal, deadline and the part you want help with. Use this short call to decide what support makes sense."
        : "Share your goal and the help you want. Review the message, edit it if needed, then copy it or send it through WhatsApp or email."}</p>
    </header>
    {mode === "call" ? <div className="grid gap-4 md:grid-cols-2">
      <article className="grid content-start gap-5 rounded-md border border-brand-line bg-white py-10 px-6">
        <h2 className="mb-0 text-2xl">A focused first conversation</h2>
        <ul className="mb-0 list-disc space-y-2 pl-5 text-sm leading-relaxed font-semibold">
          <li>Explain your job search or application goal</li>
          <li>Ask about the support available</li>
          <li>Agree a next step, if you want one</li>
        </ul>
        <p className="mb-0 text-base leading-relaxed text-brand-muted">The 15-minute consultation is free. A full document review or ongoing application support is quoted separately before work begins.</p>
        <Link href={`https://calendar.app.google/p9A1qkxExinCpXE67`} target="_blank" rel="noreferrer">
          <Button variant="brand">Choose a time on Google Calendar</Button>
        </Link>
        <small className="text-xs text-brand-muted">Choose an available time and confirm your booking on Google Calendar.</small>
      </article>
      <article className="grid content-start gap-5 rounded-md border border-brand-line bg-white py-10 px-6">
        <h2 className="mb-0 text-3xl">Prefer to arrange it by message?</h2>
        <p className="mb-0 text-base leading-relaxed text-brand-muted">Send your goal and a few suitable times. Careergrill will confirm availability.</p>
        <Link href={`https://wa.me/2348129982113?text=${callMessage}`} target="_blank" rel="noreferrer">
          <Button variant="outline">Ask about a free call on WhatsApp</Button>
        </Link>
        <Link className="text-base font-semibold text-brand-muted hover:text-brand-orange-dark underline" href="/consultation">Draft a service enquiry</Link>
      </article>
    </div> : <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,.8fr)]">
      <form className="grid content-start gap-4 rounded border border-brand-line bg-white p-5" onSubmit={prepare}>
        <h2 className="mb-0 text-2xl">Draft your enquiry</h2>
        <label className="grid gap-1.5 text-sm font-semibold">Service<select className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 font-normal" value={service} onChange={(event) => {
          markMessageOutdated();
          setPackageSelection(null);
          setService(event.target.value as ConsultationServiceKey);
          setProcess("");
        }}>{dropdownServices.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
        {packageSummary && <section className="grid gap-2 rounded border border-brand-line bg-brand-blue p-4" aria-label="Selected package summary">
          <strong>{packageSummary.name}</strong>
          <span>{packageSummary.price === null ? "Quote to confirm" : `₦${packageSummary.price.toLocaleString("en-NG")}`} · {packageSummary.unit}</span>
          <span className="text-sm text-brand-muted">{packageSummary.context}</span>
          {packageSummary.discount && <p className="mb-0 text-sm text-brand-muted">Includes {packageSummary.discount}% volume discount for one-time payment.</p>}
          <Link className="text-sm font-semibold text-brand-purple underline" href="/services#service-pricing">Change package or selection</Link>
          <small className="text-xs text-brand-muted">Confirm the package and timeline before payment. This enquiry does not book or pay for a service.</small>
        </section>}
        {pricingLoadError && <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">Current package pricing could not be loaded from the backend. {pricingLoadError}</p>}
        {serviceDetails.support.length > 0 && <section className="grid gap-2 rounded border border-brand-line bg-[#f4eef8] p-4" aria-labelledby="support-to-discuss-title">
          <h3 className="mb-0 text-base font-bold" id="support-to-discuss-title">Support to discuss</h3>
          <ul className="mb-0 list-disc space-y-1 pl-5 text-sm leading-relaxed">{serviceDetails.support.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>}
        <label className="grid gap-1.5 text-sm font-semibold">{serviceDetails.goalLabel}<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" value={goal} onChange={(event) => {
          markMessageOutdated();
          setGoal(event.target.value);
        }} placeholder={serviceDetails.goalPlaceholder} /></label>
        <label className="grid gap-1.5 text-sm font-semibold">Where are you in the process? (optional)<select className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 font-normal" value={process} onChange={(event) => {
          markMessageOutdated();
          setProcess(event.target.value);
        }}><option value="">Choose if helpful</option>{serviceDetails.stages.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="grid gap-1.5 text-sm font-semibold">{serviceDetails.deadlineLabel}<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" type="date" value={deadline} onChange={(event) => {
          markMessageOutdated();
          setDeadline(event.target.value);
        }} /></label>
        <label className="grid gap-1.5 text-sm font-semibold">What would you like us to know?<textarea className="rounded border border-brand-line px-3 py-2 font-normal" value={details} onChange={(event) => {
          markMessageOutdated();
          setDetails(event.target.value);
        }} rows={4} placeholder="For example: I have a 500-word draft, but I’m struggling to connect my experience to the selection criteria." /></label>
        <small className="text-xs text-brand-muted">Two or three sentences about the help you want are enough.</small>
        <button className={buttonVariants({ variant: "brand", size: "default" })}>{prepared ? "Update message" : "Create message"}</button>
        {message && <p className="rounded border border-brand-line bg-brand-blue p-3 text-sm" role="status">{message}</p>}
        {prepared && <div className="grid gap-3 rounded bg-brand-sage p-4">
          <h3 className="mb-0 text-base font-bold">Your message</h3>
          <label className="grid gap-1.5 text-sm font-semibold">Review or edit before sharing
            <textarea ref={preparedRef} className="w-full rounded border border-brand-line bg-white p-3 text-sm font-normal" value={prepared} onChange={(event) => {
              setPrepared(event.target.value);
              setMessage("Message updated. Copy or open an app to share this version.");
            }} rows={9} aria-label="Review or edit before sharing" />
          </label>
          <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={() => void copyMessage()}>Copy message</button>
          {copiedNotice && <p className="mb-0 text-sm text-brand-muted" role="status">{copiedNotice}</p>}
          <p className="mb-0 text-xs text-brand-muted">Copying keeps the message on your clipboard. To make an enquiry, send it through your chosen app.</p>
          <a className={buttonVariants({ variant: "brand", size: "sm" })} href={`mailto:info@careergrill.com?subject=${encodeURIComponent(`Enquiry: ${serviceDetails.name}`)}&body=${encodeURIComponent(prepared)}`}>Open email draft ↗</a>
          <a className="text-sm font-semibold text-brand-purple hover:underline" href={`https://wa.me/2348129982113?text=${encodeURIComponent(prepared)}`} target="_blank" rel="noreferrer">Open WhatsApp ↗</a>
        </div>}
        {previousMessage && <section className="grid gap-2 rounded border border-brand-line p-3">
          <h3 className="mb-0 text-base font-bold">Your previous message</h3>
          <p className="mb-0 text-sm text-brand-muted">Keep any edits you want to reuse in the updated draft.</p>
          <label className="grid gap-1.5 text-sm font-semibold">Previous message<textarea className="rounded border border-brand-line bg-white p-3 text-sm font-normal" value={previousMessage} onChange={(event) => setPreviousMessage(event.target.value)} rows={6} /></label>
        </section>}
        {!prepared && !previousMessage && <p className="mb-0 text-sm text-brand-muted">Your enquiry draft stays in this tab. Copy it before leaving if you want to keep it.</p>}
      </form>
      <aside className="grid content-start gap-3 rounded border border-brand-line bg-brand-blue p-5">
        <Eyebrow>Useful context</Eyebrow>
        <h2 className="mb-0 text-2xl">What to have ready.</h2>
        <ul className="mb-0 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
          {serviceDetails.checklist.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p className="mb-0 text-sm leading-relaxed text-brand-muted">You can make an enquiry before everything is ready. Agree the work, fee and delivery date before paid support begins. Share document files privately once you have agreed the process.</p>
        <h3 className="mb-0 mt-2 text-lg font-bold">Prefer to talk?</h3>
        <p className="mb-0 text-sm text-brand-muted">Arrange a free 15-minute consultation to discuss your goal.</p>
        <a className={buttonVariants({ variant: "outline", size: "sm" })} href="https://calendar.app.google/p9A1qkxExinCpXE67" target="_blank" rel="noreferrer">Arrange a free 15-minute call</a>
        <small className="text-xs text-brand-muted">Opening a message or booking page does not send an enquiry or book an appointment.</small>
      </aside>
    </div>}
  </section>;
}

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get("auth_error");
    if (!authError) return;
    const messages: Record<string, string> = {
      google_not_configured: "Google sign-in is not configured yet. Use email and password or contact the site administrator.",
      google_cancelled: "Google sign-in was cancelled.",
      google_state_invalid: "Google sign-in could not be verified. Please try again.",
      google_account_unverified: "An account already uses this email. Sign in with your password and verify the email before linking Google.",
      google_failed: "Google sign-in could not be completed. Please try again.",
    };
    setNotice(messages[authError] ?? "Sign-in could not be completed. Please try again.");
    const url = new URL(window.location.href);
    url.searchParams.delete("auth_error");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/register";
      await apiRequest(path, { method: "POST", body: JSON.stringify({ ...(mode === "register" ? { name } : {}), email, password }) });
      setVerificationSent(mode === "register");
      setNotice(mode === "register" ? "Check your email for a verification link. Verify your address to enable reminders." : "You’re signed in. Your workspace is ready.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "We could not sign you in.");
    } finally {
      setBusy(false);
    }
  }
  async function resendVerification() {
    setBusy(true);
    try {
      await apiRequest("/auth/resend-verification", { method: "POST" });
      setNotice("A new verification link has been sent.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "We could not send a new verification link.");
    } finally {
      setBusy(false);
    }
  }
  return <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid items-center gap-8 py-9 lg:grid-cols-2"><div className="max-w-xl"><Eyebrow>Your Careergrill workspace</Eyebrow><h1 className="my-3 text-4xl leading-tight">Keep your next steps <em>in one place.</em></h1><p className="leading-relaxed text-brand-muted">Save opportunities, make notes and return to the work you have started.</p><ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-muted"><li>Your saved opportunities and reminders</li><li>Your private application notes</li><li>Your audit history and action plans</li></ul></div><form className="grid content-start gap-4 rounded border border-brand-line bg-white p-5" onSubmit={(event) => void submit(event)}><div className="grid grid-cols-2 gap-2 rounded bg-brand-blue p-1"><button type="button" aria-pressed={mode === "login"} className="rounded px-3 py-2 text-sm font-semibold aria-pressed:bg-white aria-pressed:text-brand-purple" onClick={() => { setMode("login"); setVerificationSent(false); }}>Sign in</button><button type="button" aria-pressed={mode === "register"} className="rounded px-3 py-2 text-sm font-semibold aria-pressed:bg-white aria-pressed:text-brand-purple" onClick={() => { setMode("register"); setVerificationSent(false); }}>Create account</button></div><Eyebrow>{mode === "login" ? "Welcome back" : "A private space for your work"}</Eyebrow><h2 className="mb-0 text-2xl">{mode === "login" ? "Sign in to continue." : "Create your workspace."}</h2><a className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })} href={apiUrl("/auth/google")}><span aria-hidden="true">G</span> Continue with Google</a><div className="flex items-center gap-3 text-xs text-brand-muted"><span className="h-px flex-1 bg-brand-line" /><span>or continue with email</span><span className="h-px flex-1 bg-brand-line" /></div>{mode === "register" && <label className="grid gap-1.5 text-sm font-semibold">Your name<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} /></label>}<label className="grid gap-1.5 text-sm font-semibold">Email address<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label className="grid gap-1.5 text-sm font-semibold">Password<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" autoComplete={mode === "login" ? "current-password" : "new-password"} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === "register" ? 12 : 1} maxLength={128} />{mode === "register" && <small className="text-xs font-normal text-brand-muted">Use at least 12 characters. A passphrase is easiest to remember.</small>}</label><button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>{notice && <p role="status" className="rounded border border-brand-line bg-brand-blue p-3 text-sm">{notice}</p>}{verificationSent && <button type="button" className="text-left text-sm font-semibold text-brand-purple hover:underline" onClick={() => void resendVerification()}>Send a new verification email</button>}{mode === "login" && <Link className="text-sm font-semibold text-brand-purple hover:underline" href="/workspace">Continue to my workspace ↗</Link>}<p className="mb-0 text-xs leading-relaxed text-brand-muted">Your session is protected by an HttpOnly cookie. <Link className="font-semibold text-brand-purple hover:underline" href="/privacy">Read our privacy information</Link>.</p></form></section>;
}

export function VerifyPage() {
  const [state, setState] = useState("Verifying your email address…");
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { window.setTimeout(() => setState("This verification link is incomplete."), 0); return; }
    apiRequest("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) })
      .then(() => setState("Your email address is verified. You can now enable saved-content reminders."))
      .catch((error: unknown) => setState(error instanceof Error ? error.message : "We could not verify this address."));
  }, []);
  return <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid min-h-64 content-center justify-items-start gap-3 py-8"><Eyebrow>Email verification</Eyebrow><h1 className="mb-0 text-4xl">One last step.</h1><p className="text-brand-muted" role="status">{state}</p><Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/workspace">Open your workspace ↗</Link></section>;
}

interface SavedItem {
  id: string;
  status: string;
  notes: string;
  reminder_enabled: boolean;
  content_items: SiteContent & { deleted_at?: string | null };
}

function AuditRating({ auditId, initialRating }: { auditId: string; initialRating: number | null }) {
  const [rating, setRating] = useState(initialRating);
  const [selection, setSelection] = useState(initialRating);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function saveRating() {
    if (selection === null) return;
    setSaving(true);
    setNotice("");
    try {
      const result = await apiRequest<{ item: { rating: number } }>(`/audits/${auditId}/rating`, {
        method: "PATCH",
        body: JSON.stringify({ rating: selection }),
      });
      setRating(result.item.rating);
      setSelection(result.item.rating);
      setNotice("Thanks for rating this feedback.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save your rating.");
    } finally {
      setSaving(false);
    }
  }

  return <fieldset className="grid gap-2 border-t border-brand-line pt-3">
    <legend className="text-sm font-semibold">How useful was this feedback?</legend>
    <div className="flex items-center gap-1" role="group" aria-label="Rate this Career Audit from 1 to 5">
      {[1, 2, 3, 4, 5].map((value) => <button
        className={`rounded px-1 text-2xl leading-none ${selection !== null && value <= selection ? "text-brand-orange-dark" : "text-brand-muted"}`}
        key={value}
        type="button"
        aria-label={`${value} out of 5`}
        aria-pressed={selection === value}
        disabled={saving}
        onClick={() => setSelection(value)}
      >★</button>)}
      <span className="ml-2 text-xs text-brand-muted">{rating === null ? "Not rated" : `Saved rating: ${rating}/5`}</span>
    </div>
    {selection !== rating && <button className="justify-self-start text-sm font-semibold text-brand-purple hover:underline" type="button" disabled={saving} onClick={() => void saveRating()}>{saving ? "Saving…" : "Save rating"}</button>}
    {notice && <p className="mb-0 text-xs text-brand-muted" role="status">{notice}</p>}
  </fieldset>;
}

export function WorkspacePage({ view = "scholarships" }: { view?: "scholarships" | "jobs" | "audits" }) {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [audits, setAudits] = useState<{ id: string; goal: string; feedback: string; rating: number | null; created_at: string }[]>([]);
  const [notice, setNotice] = useState("Loading your saved workspace…");
  const [stage, setStage] = useState("all");
  useEffect(() => {
    setNotice("Loading your saved workspace…");
    setStage("all");
    const request = view === "audits"
      ? apiRequest<{ items: { id: string; goal: string; feedback: string; rating: number | null; created_at: string }[] }>("/audits")
        .then(({ items: auditHistory }) => { setAudits(auditHistory); setNotice(""); })
      : apiRequest<{ items: SavedItem[] }>("/saved")
        .then(({ items: savedItems }) => { setItems(savedItems); setNotice(""); });
    request.catch((error: unknown) => setNotice(error instanceof Error ? error.message : "We could not load your workspace."));
  }, [view]);
  async function remove(id: string) {
    try {
      await apiRequest(`/saved/${id}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not remove the saved item.");
    }
  }
  async function updateSaved(id: string, values: { status?: string; reminder_enabled?: boolean }) {
    try {
      await apiRequest(`/saved/${id}`, { method: "PATCH", body: JSON.stringify(values) });
      setItems((current) => current.map((item) => item.id === id ? { ...item, ...values } : item));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update this saved item.");
    }
  }
  async function deleteAudit(id: string) {
    try {
      await apiRequest(`/audits/${id}`, { method: "DELETE" });
      setAudits((current) => current.filter((audit) => audit.id !== id));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete this audit.");
    }
  }
  const savedItems = items.filter(({ content_items: content }) => view === "jobs"
    ? content.type === "job"
    : view === "scholarships" && content.type === "scholarship");
  const isAuditView = view === "audits";
  const filteredItems = stage === "all" ? savedItems : savedItems.filter((item) => item.status === stage);
  const isLoading = notice === "Loading your saved workspace…";
  const title = isAuditView ? "My Career Audits" : view === "jobs" ? "My saved jobs" : "My saved scholarships.";
  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-7">
      <div className="mx-auto max-w-6xl">
        <header className="mb-5 flex items-end justify-between gap-5 max-sm:flex-col max-sm:items-start">
          <div>
            <Eyebrow>Your application workspace</Eyebrow>
            <h1 className="mb-2 text-4xl">{title}</h1>
            <p className="mb-0 max-w-2xl text-sm leading-relaxed text-brand-muted">{isAuditView
              ? "Return to your saved Career Audit feedback and review the next steps you planned."
              : view === "jobs"
                ? "Return to saved roles, record your preparation and keep track of applications."
                : "Track what you want to pursue and what needs doing next."}</p>
          </div>
          {!isAuditView && <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={view === "jobs" ? "/jobs" : "/scholarships"}>{view === "jobs" ? "Find more jobs" : "Explore more scholarships"}</Link>}
        </header>
        {!isAuditView && <nav className="mb-4 flex border-b border-brand-line" aria-label="Saved opportunities">
          <Link className={cn("border-b-2 px-4 py-2 text-sm font-semibold", view === "scholarships" ? "border-brand-purple text-brand-purple" : "border-transparent text-brand-muted hover:text-brand-ink")} aria-current={view === "scholarships" ? "page" : undefined} href="/workspace">Scholarships</Link>
          <Link className={cn("border-b-2 px-4 py-2 text-sm font-semibold", view === "jobs" ? "border-brand-purple text-brand-purple" : "border-transparent text-brand-muted hover:text-brand-ink")} aria-current={view === "jobs" ? "page" : undefined} href="/workspace/jobs">Jobs</Link>
        </nav>}
        {!isAuditView && <div className="mb-4 flex items-center justify-between gap-4 rounded border border-brand-line bg-brand-blue p-4 max-sm:flex-col max-sm:items-start">
          <p className="mb-0 text-sm leading-relaxed text-brand-muted">{view === "jobs"
            ? <><strong>Saved to your account.</strong> Notes, checks and application stages are private to your signed-in workspace. Update stages yourself after applying through the employer.</>
            : <><strong>Your saved workspace.</strong> Opportunities, notes and progress are saved to your account. Submit applications through the official provider. Enable expiry reminders on saved listings to get an email before they close.</>}</p>
          {view === "scholarships" && <Link className="shrink-0 text-sm font-semibold text-brand-purple hover:underline" href="/my-audits">Open my audit history</Link>}
        </div>}
        {notice && !isLoading && <div className="mb-4 rounded border border-brand-line bg-brand-blue p-3 text-sm" role="status">{notice} {notice.toLowerCase().includes("sign in") && <Link className="font-semibold text-brand-purple hover:underline" href="/signin">Sign in ↗</Link>}</div>}
        {!isAuditView && <>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded border border-brand-line bg-white p-4"><strong className="block font-display text-3xl">{savedItems.length}</strong><span className="text-sm text-brand-muted">Saved {view === "jobs" ? "jobs" : "opportunities"}</span></div>
            <div className="rounded border border-brand-line bg-white p-4"><strong className="block font-display text-3xl">{savedItems.filter((item) => item.status === "preparing").length}</strong><span className="text-sm text-brand-muted">In preparation</span></div>
            <div className="rounded border border-brand-line bg-white p-4"><strong className="block font-display text-3xl">{savedItems.filter((item) => item.status === "submitted").length}</strong><span className="text-sm text-brand-muted">Applied / interviewing</span></div>
          </div>
          <div className={cn("grid items-start gap-5", view === "scholarships" && "lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,.65fr)]")}>
            <section className="rounded p-5" aria-labelledby="workspace-list-title">
              <div className="mb-4 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
                <h2 className="mb-0 text-2xl" id="workspace-list-title">{view === "jobs" ? "Your saved roles" : "Your shortlist"}</h2>
                <label className="grid gap-1 text-xs font-semibold">{view === "jobs" ? "Stage" : "Status"}<select className="min-h-9 rounded border border-brand-line bg-white px-2 text-sm font-normal" value={stage} onChange={(event) => setStage(event.target.value)}><option value="all">All stages</option><option value="saved">Saved</option><option value="preparing">In preparation</option><option value="submitted">Applied / interviewing</option></select></label>
              </div>
              {isLoading ? <p className="text-sm text-brand-muted" role="status">{view === "jobs" ? "Loading your saved jobs…" : "Loading the scholarship directory…"}</p>
                : filteredItems.length > 0 ? <div className="grid gap-3">{filteredItems.map((item) => <WorkspaceSavedCard
                  key={item.id}
                  item={item}
                  onRemove={() => void remove(item.id)}
                  onUpdate={(values) => void updateSaved(item.id, values)}
                />)}</div> : !notice && view === "scholarships" ? <div className="flex flex-col gap-5 justify-center items-center rounded border-dashed border border-gray-500 py-8 px-12">
                  <h3 className="mb-0 text-xl font-bold">Your shortlist starts here.</h3>
                  <p className="mb-0 text-sm text-brand-muted">{stage === "all" ? "Save a scholarship from the discovery page to start tracking your preparation." : "No saved opportunities match this stage."}</p>
                  {stage === "all" && <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/scholarships">Find a scholarship</Link>}
                </div> : !notice && stage !== "all" && <p className="text-sm text-brand-muted">No saved jobs match this stage.</p>}
            </section>
            {view === "scholarships" && <aside className="grid content-start gap-3 rounded border border-brand-line bg-brand-blue p-5">
              <Eyebrow>Before you apply</Eyebrow>
              <h2 className="mb-0 text-xl">A listing is the start of the research.</h2>
              <ul className="mb-0 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
                <li>Confirm official eligibility and the current cycle.</li>
                <li>Check what the funding actually covers.</li>
                <li>Record scholarship and admission deadlines separately.</li>
                <li>Work backwards from your deadline.</li>
              </ul>
              <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/career-audit">Start an AI Career Audit</Link>
              <Link className="text-sm font-semibold text-brand-purple hover:text-brand-orange-dark underline text-center" href="/consultation">Discuss adviser support</Link>
              <div className="mt-2 border-t border-brand-line pt-3">
                <h3 className="mb-1 text-base font-bold">Need a reminder?</h3>
                <p className="mb-0 text-sm text-brand-muted">Enable an expiry reminder on a saved opportunity and we’ll email you before the listing closes.</p>
              </div>
            </aside>}
          </div>
        </>}
        {isAuditView && (audits.length ? <div className="grid gap-3">{audits.map((audit) => <article className="rounded border border-brand-line bg-white p-4" key={audit.id}>
          <div className="mb-2 flex items-center justify-between gap-3"><span className="rounded-full bg-brand-blue px-2.5 py-1 text-xs font-semibold">{audit.goal}</span><small className="text-xs text-brand-muted">{new Date(audit.created_at).toLocaleDateString()}</small></div>
          <p className="text-sm leading-relaxed text-brand-muted">{audit.feedback.slice(0, 500)}{audit.feedback.length > 500 ? "…" : ""}</p>
          <AuditRating auditId={audit.id} initialRating={audit.rating} />
          <button className="text-sm font-semibold text-brand-purple hover:underline" onClick={() => void deleteAudit(audit.id)}>Delete audit</button>
        </article>)}</div> : !notice && <p className="text-sm text-brand-muted">Your audit history will appear here after you generate feedback.</p>)}
      </div>
    </main>
  );
}

function WorkspaceSavedCard({ item, onRemove, onUpdate }: {
  item: SavedItem;
  onRemove: () => void;
  onUpdate: (values: { status?: string; reminder_enabled?: boolean }) => void;
}) {
  return <article className="grid gap-3 rounded border border-brand-line p-4">
    <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-brand-blue px-2.5 py-1 text-xs font-semibold">{item.status}</span><span className="text-xs text-brand-muted">{item.content_items.category}</span></div>
    <h3 className="mb-0 text-lg font-bold">{item.content_items.title}</h3><p className="mb-0 text-sm leading-relaxed text-brand-muted">{item.content_items.excerpt}</p>
    {item.content_items.deleted_at && <p className="mb-0 text-sm text-brand-muted">This listing was withdrawn and is no longer available on the website.</p>}
    <label className="grid max-w-xs gap-1 text-xs font-semibold">Application stage<select className="min-h-9 rounded border border-brand-line bg-white px-2 text-sm font-normal" value={item.status} onChange={(event) => onUpdate({ status: event.target.value })}><option value="saved">Saved</option><option value="preparing">Preparing</option><option value="submitted">Submitted</option></select></label>
    {!item.content_items.deleted_at && <label className="flex items-center gap-2 text-sm text-brand-muted"><input type="checkbox" checked={item.reminder_enabled} onChange={(event) => onUpdate({ reminder_enabled: event.target.checked })} /> Email me before this listing expires</label>}
    {!item.content_items.deleted_at && item.content_items.expires_at && <p className="mb-0 text-xs text-brand-muted">Expires {new Date(item.content_items.expires_at).toLocaleDateString()}</p>}
    <button className="justify-self-start text-sm font-semibold text-brand-purple hover:underline" onClick={onRemove}>Remove from workspace</button>
  </article>;
}

export function AuditPage() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("A master's degree");
  const [answers, setAnswers] = useState({ direction: "", experience: "", evidence: "", concerns: "", target: "", timeline: "" });
  const [notice, setNotice] = useState("");
  const [feedback, setFeedback] = useState("");
  const [auditId, setAuditId] = useState("");
  const [auditRating, setAuditRating] = useState<number | null>(null);
  const [auditAvailable, setAuditAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const requestedGoal = new URLSearchParams(window.location.search).get("goal");
      const goalByQuery: Record<string, string> = {
        job: "Job search",
        scholarship: "A scholarship",
        fellowship: "A fellowship",
        phd: "A PhD",
        masters: "A master's degree",
      };
      if (requestedGoal && goalByQuery[requestedGoal]) setGoal(goalByQuery[requestedGoal]);
      const draft = sessionStorage.getItem("careergrill-audit-draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft) as { goal?: string; answers?: Partial<typeof answers>; step?: number };
          if (parsed.goal) setGoal(parsed.goal);
          if (parsed.answers) setAnswers((current) => ({ ...current, ...parsed.answers }));
          if (parsed.step) setStep(parsed.step);
        } catch {
          sessionStorage.removeItem("careergrill-audit-draft");
        }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    apiRequest<{ available: boolean }>("/audits/availability")
      .then(({ available }) => setAuditAvailable(available))
      .catch(() => setAuditAvailable(false));
  }, []);
  function saveDraft(savedStep = step) {
    sessionStorage.setItem("careergrill-audit-draft", JSON.stringify({ goal, answers, step: savedStep }));
    setNotice("Draft saved in this browser tab.");
  }
  function continueAudit() {
    const requiredAnswer = step === 1 ? answers.direction : answers.experience;
    if (!requiredAnswer.trim()) {
      setNotice(step === 1
        ? "Add your goal to continue. You can save an incomplete draft and return later."
        : "Add your relevant experience to continue. You can save an incomplete draft and return later.");
      return;
    }
    saveDraft(step + 1);
    setStep((current) => current + 1);
    setNotice("");
  }
  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auditAvailable) {
      setNotice("AI feedback is temporarily unavailable. You can still save your answers and return later.");
      return;
    }
    setNotice("Preparing your feedback…");
    try {
      const result = await apiRequest<{ item: { id: string; rating: number | null }; feedback: string }>("/audits/feedback", { method: "POST", body: JSON.stringify({ goal, answers, consent: true }) });
      setFeedback(result.feedback);
      setAuditId(result.item.id);
      setAuditRating(result.item.rating);
      setNotice("Your action plan is ready and saved to your account.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "We could not prepare feedback.");
    }
  }
  const goalChoices = [
    { label: "Find a role or improve my job search", goal: "Job search", detail: "Role direction, application evidence and interview preparation." },
    { label: "A master's degree", goal: "A master's degree", detail: "Academic preparation and programme fit." },
    { label: "A PhD", goal: "A PhD", detail: "Research direction and supervision." },
    { label: "A scholarship", goal: "A scholarship", detail: "Study goals and funding preparation." },
    { label: "A fellowship", goal: "A fellowship", detail: "Professional development and contribution." },
  ];
  return <Container className="py-20 gap-10 md:gap-20">
    <aside className="grid content-start gap-6 md:w-[60%] self-start py-1">
      <Link className="text-sm font-semibold text-brand-purple underline underline-offset-2 hover:no-underline" href="/">← Back to Careergrill</Link>
      <div>
        <Eyebrow>AI Career Audit</Eyebrow>
        <h1 className="audit-heading my-2 font-extrabold leading-tight">Review your preparation with AI.</h1>
        <p className="mb-0 text-base leading-relaxed text-brand-muted">Tell us about the role, course, scholarship or fellowship you’re considering and one example of your experience. Get feedback on the details you share, questions to resolve and actions to take.</p>
      </div>
      <ol className="grid gap-2">
        {["Your goal", "Your experience", "Your target and timeline"].map((label, index) => (
          <li className={cn("flex items-center gap-3 py-1 text-sm text-brand-muted", step === index + 1 && "font-semibold text-brand-ink")} key={label}>
            <span className={cn("grid size-7 shrink-0 place-items-center rounded-full border border-brand-line bg-transparent text-xs font-normal", step === index + 1 && "border-brand-purple bg-brand-purple font-bold text-white", step > index + 1 && "border-brand-orange bg-brand-orange font-bold text-white")}>{index + 1}</span>{label}
          </li>
        ))}
      </ol>
      <div className="grid gap-2 rounded-md bg-brand-sage p-4 text-sm">
        <strong>Saving your audit</strong>
        <p className="mb-1 text-brand-muted">Start without an account. This tab keeps your draft through reloads. Sign in to save it and generate feedback. Closing the tab clears unsaved work.</p>
        <Link className="font-semibold text-brand-purple hover:text-brand-orange-dark underline" href="/privacy">How your information is used</Link>
        <Link className="font-semibold text-brand-purple hover:text-brand-orange-dark underline" href="/workspace/audits">See an example action plan</Link>
      </div>
    </aside>
    <form className="grid content-start gap-4 w-full rounded-lg border border-brand-line bg-white p-5 sm:p-6" onSubmit={(event) => void generate(event)}>
      {auditAvailable === false && <div className="rounded-md border border-[#e4c999] bg-[#fff7e8] p-3 text-sm" role="status"><strong>AI feedback is temporarily unavailable.</strong><p className="mb-0 mt-1 text-brand-muted">You can still complete and save your audit. Your answers will stay in this tab until the service is available.</p></div>}
      {auditAvailable === null && <p className="mb-0 rounded-md bg-brand-blue p-3 text-sm" role="status">Checking AI feedback availability…</p>}
      <p className="mb-0 text-sm leading-relaxed text-brand-muted">Fields marked “Needed for AI feedback” are required to generate an assessment. You can save an incomplete draft.</p>
      <div className="text-xs font-bold uppercase tracking-widest text-brand-purple">STEP {step} OF 3</div>
      {step === 1 ? <>
        <h2 className="mb-0 text-2xl">What are you working towards?</h2>
        <p className="mb-0 text-sm text-brand-muted">Pick one direction. The next questions will follow your choice.</p>
        <fieldset className="grid gap-2">
          <legend className="sr-only">Choose your goal</legend>
          <p className="mb-0 text-sm font-semibold">Job search</p>
          <button type="button" className={cn("flex items-start gap-3 rounded-md border border-brand-line p-3 text-left hover:border-brand-purple", goal === goalChoices[0].goal && "border-brand-purple bg-brand-blue")} aria-pressed={goal === goalChoices[0].goal} onClick={() => setGoal(goalChoices[0].goal)}>
            <span className={cn("mt-1 size-4 shrink-0 rounded-full border border-brand-line", goal === goalChoices[0].goal && "border-4 border-brand-purple")} aria-hidden="true" /><span className="grid gap-1"><strong className="text-sm">{goalChoices[0].label}</strong><small className="text-xs text-brand-muted">{goalChoices[0].detail}</small></span>
          </button>
          <p className="mb-0 mt-2 text-sm font-semibold">Study, scholarships &amp; fellowships</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {goalChoices.slice(1).map((item) => <button type="button" key={item.goal} className={cn("flex items-start gap-3 rounded-md border border-brand-line p-3 text-left hover:border-brand-purple", goal === item.goal && "border-brand-purple bg-brand-blue")} aria-pressed={goal === item.goal} onClick={() => setGoal(item.goal)}>
              <span className={cn("mt-1 size-4 shrink-0 rounded-full border border-brand-line", goal === item.goal && "border-4 border-brand-purple")} aria-hidden="true" /><span className="grid gap-1"><strong className="text-sm">{item.label}</strong><small className="text-xs text-brand-muted">{item.detail}</small></span>
            </button>)}
          </div>
        </fieldset>
        <label className="grid gap-1.5 text-sm font-semibold"><small className="text-xs font-normal text-brand-muted">Needed for AI feedback</small>What would you like this opportunity to help you do?
          <textarea className="rounded border border-brand-line px-3 py-2 font-normal" value={answers.direction} onChange={(event) => setAnswers({ ...answers, direction: event.target.value })} rows={4} required placeholder="Explain the change you want to make and why it matters to you." />
        </label>
        <p className="mb-0 text-xs text-brand-muted">A specific goal makes the feedback more useful.</p>
      </> : step === 2 ? <>
        <h2 className="mb-0 text-2xl">What experience can you build on?</h2>
        <p className="mb-0 text-sm text-brand-muted">Share only what you are comfortable including. Leave out contact and identification details.</p>
        <label className="grid gap-1.5 text-sm font-semibold"><small className="text-xs font-normal text-brand-muted">Needed for AI feedback</small>Your relevant experience
          <textarea className="rounded border border-brand-line px-3 py-2 font-normal" value={answers.experience} onChange={(event) => setAnswers({ ...answers, experience: event.target.value })} rows={6} required placeholder="Work, study, volunteering, projects or responsibilities…" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">What evidence can you point to?
          <textarea className="rounded border border-brand-line px-3 py-2 font-normal" value={answers.evidence} onChange={(event) => setAnswers({ ...answers, evidence: event.target.value })} rows={4} placeholder="Examples, outcomes, feedback or work you have completed." />
        </label>
      </> : <>
        <h2 className="mb-0 text-2xl">What is your target and timeline?</h2>
        <p className="mb-0 text-sm text-brand-muted">Share the next milestone and any deadlines or uncertainties you want the assessment to consider.</p>
        <label className="grid gap-1.5 text-sm font-semibold">Your target
          <textarea className="rounded border border-brand-line px-3 py-2 font-normal" value={answers.target} onChange={(event) => setAnswers({ ...answers, target: event.target.value })} rows={3} placeholder="What would a useful next step look like?" />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">Your timeline
          <input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" value={answers.timeline} onChange={(event) => setAnswers({ ...answers, timeline: event.target.value })} maxLength={1000} placeholder="For example, the application deadline or interview date." />
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">Your questions or concerns
          <textarea className="rounded border border-brand-line px-3 py-2 font-normal" value={answers.concerns} onChange={(event) => setAnswers({ ...answers, concerns: event.target.value })} rows={4} placeholder="Deadlines, missing experience, programme fit, interviews…" />
        </label>
        <label className="flex items-start gap-2 text-sm text-brand-muted"><input className="mt-1" type="checkbox" required /> I understand my answers will be sent to the configured AI provider to generate feedback.</label>
      </>}
      {notice && <p className="mb-0 rounded border border-brand-line bg-brand-blue p-3 text-sm" role="status">{notice} {notice.toLowerCase().includes("sign in") && <Link className="font-semibold text-brand-purple hover:underline" href="/signin">Sign in ↗</Link>}</p>}
      <p className="mb-0 text-xs text-brand-muted">Draft kept in this tab. Sign in to save it to your account.</p>
      <div className="flex flex-wrap justify-end gap-2 border-t border-brand-line pt-4">
        {step > 1 && <button type="button" className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => setStep(step - 1)}>Back</button>}
        <button type="button" className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => saveDraft()}>Save draft</button>
        {step < 3
          ? <button type="button" className={buttonVariants({ variant: "brand", size: "sm" })} onClick={continueAudit}>Continue</button>
          : <button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={auditAvailable !== true}>Generate AI feedback</button>}
      </div>
      <small className="text-xs leading-relaxed text-brand-muted">Up to five generation attempts per account each day, subject to service capacity. Failed attempts count. Reading saved feedback does not use an attempt.</small>
      <div className="flex flex-wrap justify-between gap-3 border-t border-brand-line pt-3"><button type="button" className="text-sm font-semibold text-brand-purple hover:text-brand-orange-dark underline" onClick={() => { sessionStorage.removeItem("careergrill-audit-draft"); setAnswers({ direction: "", experience: "", evidence: "", concerns: "", target: "", timeline: "" }); setFeedback(""); setAuditId(""); setAuditRating(null); setStep(1); setNotice("This tab’s draft has been cleared."); }}>Clear this tab’s draft</button><Link className="text-sm font-semibold text-brand-purple hover:text-brand-orange-dark underline" href="/faq">Questions about the audit? ↗</Link></div>
    </form>
    {feedback && <section className="rounded border border-brand-line bg-brand-sage p-5 lg:col-start-2"><Eyebrow>Your application direction</Eyebrow><h2 className="my-2 text-2xl">A practical next-step plan.</h2><div className="space-y-2 leading-relaxed text-brand-muted">{feedback.split("\n").map((line, index) => <p className="mb-0" key={index}>{line}</p>)}</div>{auditId && <AuditRating key={auditId} auditId={auditId} initialRating={auditRating} />}</section>}
  </Container>;
}

export function ContentDetail({ slug, expectedType }: { slug: string; expectedType?: ContentType }) {
  const [item, setItem] = useState<SiteContent | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    apiRequest<{ item: SiteContent }>(`/content/${encodeURIComponent(slug)}`)
      .then((result) => {
        if (expectedType && result.item.type !== expectedType) {
          setItem(undefined);
          setLoadError("This content is not available at this address.");
          return;
        }
        setItem(result.item);
      })
      .catch((error: unknown) => setLoadError(error instanceof Error ? error.message : "Could not load this content."))
      .finally(() => setLoading(false));
  }, [slug, expectedType]);
  if (!item) return <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid justify-items-start gap-3 py-8">{loading ? <p>Loading content…</p> : <><Eyebrow>Careergrill</Eyebrow><h1 className="mb-0 text-4xl">{loadError ? "Content unavailable." : "Content not found."}</h1><p className="text-brand-muted">{loadError || "This page may have moved or is not published."}</p><Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/">Return home</Link></>}</section>;
  if (item.type === "resource") return <ResourceToolDetail item={item} />;
  return <article className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-7"><Link className="text-sm font-semibold text-brand-purple hover:underline" href={contentCollectionPath(item.type)}>← Back to {contentCollectionLabel(item.type)}</Link><div className="mx-auto my-7 max-w-3xl"><Eyebrow>{item.category} / Careergrill</Eyebrow><h1 className="my-3 text-4xl leading-tight">{item.title}</h1><p className="text-lg leading-relaxed text-brand-muted">{item.excerpt}</p></div><RichContent value={item.body} className="mx-auto mb-6 max-w-3xl text-base leading-relaxed" />{item.source_url && <a className={buttonVariants({ variant: "brand", size: "sm" })} href={item.source_url} target="_blank" rel="noreferrer">Check official source ↗</a>}</article>;
}

function contentCollectionPath(type: ContentType): string {
  return contentHref(type, "").replace(/\/$/, "");
}

function contentCollectionLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    job: "jobs",
    scholarship: "scholarships",
    article: "the blog",
    resource: "resources",
    service: "services",
    testimonial: "client feedback",
  };
  return labels[type];
}

export function NotFoundPage() {
  return <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid min-h-64 content-center justify-items-start gap-3 py-8">
    <Eyebrow>Careergrill</Eyebrow>
    <h1 className="mb-0 text-4xl">That page isn’t here.</h1>
    <p className="text-brand-muted">Explore opportunities or find a useful next step.</p>
    <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/">Return home</Link>
  </section>;
}
