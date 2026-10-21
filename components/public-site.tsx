"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { apiRequest, apiUrl } from "@/lib/api";
import { contentHref, sampleContent, type ContentType, type SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import RichContent from "@/components/rich-content";
import { cn } from "@/lib/utils";
import PageHeader from "./ui/page-header";
import Container from "./container";

export function HomePage() {
  const resources = sampleContent.filter((item) => item.type === "resource");
  const featuredArticle = sampleContent.find((item) => item.type === "article" && item.slug === "explain-programme-fit");
  return (
    <>
      <section className="mx-auto grid min-h-155 w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10 lg:py-16">
        <div>
          <Eyebrow>Jobs, scholarships &amp; application support</Eyebrow>
          <h1 className="mb-4 max-w-2xl text-5xl tracking-tight sm:text-[4rem] sm:leading-[1.13]">Find opportunities.<br />Prepare a stronger <span className="text-brand-orange-dark">application</span>.</h1>
          <p className="mb-7 max-w-xl text-xl leading-relaxed text-brand-muted">Explore jobs and scholarships. Get AI feedback on your preparation, or speak to Careergrill about support with your CV, essays or interviews.</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link className={buttonVariants({ variant: "brand" })} href="/jobs">Find jobs</Link>
            <Link className={buttonVariants({ variant: "outline" })} href="/scholarships">Find scholarships</Link>
            <Link className="inline-flex items-center gap-2 font-semibold text-brand-orange-dark underline underline-offset-4 hover:no-underline" href="/consultation">Ask about a document review</Link>
          </div>
          <p className="mb-0 mt-6 text-base text-brand-muted">For your job search, study, scholarship or fellowship application.</p>
        </div>
        <aside className="relative overflow-hidden rounded-2xl border border-brand-purple bg-brand-ink px-7 pb-6 pt-8 text-white shadow-[12px_12px_0_#eee8f4] after:absolute after:-right-10 after:-top-20 after:size-52 after:rounded-full after:border after:border-white/15 after:shadow-[0_0_0_20px_rgba(255,255,255,.035),0_0_0_42px_rgba(255,255,255,.03)] sm:px-8">
          <div className="mb-7 flex justify-between gap-3 border-b border-white/20 pb-4 text-sm font-bold uppercase tracking-widest text-[#d2cbdc]"><span>Careergrill / Career Audit</span><span className="rounded-md bg-[#493168] px-2.5 py-1 text-xs text-white">Example</span></div>
          <Eyebrow className="mb-2 text-brand-footer-hover">Your application direction</Eyebrow>
          <h2 className="relative z-10 max-w-xs text-3xl leading-tight text-white">What your AI<br />audit covers.</h2>
          {["What you can build on", "What needs attention", "Actions to work on next"].map((title, index) => <div className="relative z-10 grid grid-cols-[3rem_1fr] gap-4 border-b border-white/20 py-3 sm:gap-5 sm:py-4" key={title}><span className="grid size-12 place-items-center rounded-lg bg-brand-purple text-lg text-brand-footer-hover">0{index + 1}</span><div><strong className="text-lg">{title}</strong><p className="mb-0 mt-1 text-base text-[#d2cbdc]">{["Connect your experience to your next step.", "Spot missing details before you start drafting.", "A focused plan you can act on."][index]}</p></div></div>)}
          <Link href="/career-audit" className="relative z-10 mt-4 inline-flex font-semibold text-[#ffc29f] hover:underline">Open an example assessment ↗</Link>
          <div className="-mx-7 -mb-6 mt-5 bg-brand-sage px-7 py-3 text-base text-brand-ink sm:-mx-8 sm:px-8">✦ Feedback based on the details you share.</div>
        </aside>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <div className="mb-7 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start"><div><Eyebrow>Start with what you need</Eyebrow><h2 className="mb-0 text-4xl">Choose your next step.</h2></div><Link className="inline-flex items-center gap-2 font-semibold text-brand-orange-dark hover:underline" href="/services">See all services</Link></div>
          <div className="grid gap-px overflow-hidden rounded border border-brand-line bg-brand-line sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard number="01 / JOB SEARCH" title="Find jobs and internships." body="Explore jobs and internships, check what employers ask for and organise your applications." href="/jobs" link="Find jobs" />
            <FeatureCard number="02 / SCHOLARSHIPS" title="Find funding for your study." body="Search by study level, destination and funding type, then save opportunities to check." href="/scholarships" link="Explore scholarships" />
            <FeatureCard number="03 / REVISE" title="Get feedback on your draft." body="Ask about a review of your statement, CV or essay. Share the instructions and deadline to discuss the work and fee." href="/consultation" link="Ask about a review" />
            <FeatureCard number="04 / PREPARE" title="Review your preparation with AI." body="Describe your goals and experience. Get AI feedback for your job search, study, scholarship or fellowship application." href="/career-audit" link="Start an AI Career Audit" />
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid gap-8 py-16 md:grid-cols-2">
        <div><Eyebrow>See the thinking</Eyebrow><h2 className="text-4xl">What does useful feedback look like?</h2><p className="text-base text-brand-muted">A good review explains why something needs to change and how to improve it.</p><p className="text-sm text-brand-muted">Illustrative example. This is not a client testimonial.</p></div>
        <div className="rounded-md border border-brand-line bg-brand-footer p-6"><span className="mb-3 block text-xs font-bold uppercase tracking-widest text-brand-muted">SOP feedback / example</span><blockquote className="border-l-4 border-brand-orange pl-4 text-xl leading-relaxed">“I want to study public policy because I am passionate about making a difference.”</blockquote><div className="bg-[#fff5ef] p-4"><strong>Give the reader something they can assess.</strong><p className="mb-0 mt-2 text-sm leading-relaxed text-brand-muted">Which policy issue have you worked on? What did you observe? What question do you now need this programme to help you answer?</p></div><Link href="/services" className="mt-3 inline-flex font-semibold text-brand-orange-dark underline underline-offset-4 hover:no-underline">See how application review works</Link></div>
      </section>
      <section className="bg-brand-blue py-16"><div className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid items-center gap-7 md:grid-cols-2"><div><Eyebrow>Client feedback</Eyebrow><h2 className="text-4xl">A stronger application should still sound like you.</h2><p className="text-base text-brand-muted">Read Hameedah’s feedback on Careergrill’s statement of purpose support.</p><Link href="/client-feedback" className="font-semibold text-brand-orange-dark underline underline-offset-4 hover:no-underline">Read client feedback</Link></div><article className="rounded-md border border-brand-line bg-brand-footer p-6"><span className="text-xs font-bold uppercase tracking-widest text-brand-muted">Client feedback / Statement support</span><h3 className="my-3 font-display text-xl font-bold">Statement support in the applicant’s voice.</h3><p className="mb-0 text-sm leading-relaxed text-brand-muted">Hameedah Abdrasheed-Babatunde shares her perspective on Careergrill’s statement of purpose support.</p></article></div></section>
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <div className="mb-7 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start"><div><Eyebrow>Useful before you apply</Eyebrow><h2 className="mb-0 text-4xl">Build a better first draft.</h2></div><div className="flex flex-wrap gap-4"><Link className="font-semibold text-brand-orange-dark hover:underline" href="/resources">Explore resources</Link><Link className="font-semibold text-brand-orange-dark hover:underline" href="/blog">Read application guides</Link></div></div>
          <div className="grid gap-4 md:grid-cols-3">{resources.slice(0, 3).map((item) => <article className="flex min-h-52 flex-col rounded-md border border-brand-line bg-brand-footer p-5" key={item.id}><span className="text-xs font-bold uppercase tracking-widest text-brand-muted">{item.category} / {String(item.data.format ?? "Checklist")}</span><h3 className="mb-2 mt-3 font-display text-lg font-bold"><Link href={`/resources/${item.slug}`}>{item.title}</Link></h3><p className="text-sm text-brand-muted">{item.excerpt}</p><Link className="mt-auto font-semibold text-brand-orange-dark underline underline-offset-4 hover:no-underline" href={`/resources/${item.slug}`}>Open {String(item.data.format ?? "checklist").toLowerCase()}</Link></article>)}</div>
        </div>
      </section>
      {featuredArticle && <section className="bg-brand-cream py-10"><div className="mx-auto w-full max-w-7xl px-4 sm:px-8 flex items-center justify-between gap-6 max-md:flex-col max-md:items-start"><div><Eyebrow>From the blog</Eyebrow><h2 className="mb-2 max-w-2xl text-3xl">{featuredArticle.title}</h2><p className="max-w-3xl text-sm text-brand-muted">{featuredArticle.excerpt}</p><Link className={buttonVariants({ variant: "outline", size: "sm" })} href={`/blog/${featuredArticle.slug}`}>Read the step-by-step guide</Link></div><Link className="font-semibold text-brand-ink underline underline-offset-4 hover:no-underline" href="/blog">Browse the blog ↗</Link></div></section>}
      <Callout />
    </>
  );
}

function FeatureCard({ number, title, body, href, link }: { number: string; title: string; body: string; href: string; link: string }) {
  return <Link className="group flex min-h-64 flex-col bg-white p-6 transition hover:bg-brand-footer" href={href}><span className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-eyebrow">{number}</span><h3 className="mb-3 font-display text-xl font-bold">{title}</h3><p className="mb-4 text-sm leading-relaxed text-brand-muted">{body}</p><span className="mt-auto inline-flex items-center gap-2 font-semibold text-brand-ink underline underline-offset-4 group-hover:no-underline">{link}</span></Link>;
}

function Callout() {
  return <section className="bg-brand-cream py-20 text-center"><div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-8"><Eyebrow>Your next step</Eyebrow><h2 className="mb-3 max-w-lg text-4xl">Choose how to get started.</h2><p className="mb-6 max-w-2xl text-base text-brand-muted">Start an AI Career Audit, or book a free 15-minute call to discuss Careergrill’s services.</p><div className="flex flex-wrap justify-center gap-3"><Link className={buttonVariants({ variant: "brand" })} href="/career-audit">Start an AI Career Audit</Link><Link className={buttonVariants({ variant: "outline" })} href="/consultation?mode=call">Book a free 15-minute call</Link></div></div></section>;
}

function usePublicContent(type: ContentType, initialItems: SiteContent[]) {
  const [items, setItems] = useState(initialItems);
  const [isLive, setIsLive] = useState(false);
  useEffect(() => {
    apiRequest<{ items: SiteContent[] }>(`/content?type=${type}`)
      .then((result) => {
        setItems(result.items);
        setIsLive(true);
      })
      .catch(() => setIsLive(false));
  }, [type]);
  return { items, isLive };
}

function PageIntro({ eyebrow, title, text, side }: { eyebrow: string; title: ReactNode; text: string; side?: ReactNode }) {
  return <section className="bg-brand-sage"><div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-4 py-8 sm:px-8 max-md:flex-col max-md:items-start"><div><Eyebrow>{eyebrow}</Eyebrow><h1 className="mb-3 mt-2 text-4xl tracking-tight">{title}</h1><p className="mb-0 max-w-2xl text-base leading-relaxed text-brand-muted">{text}</p></div>{side}</div></section>;
}

const resourceTopics = ["All resources", "Graduate admissions", "Scholarships", "Career documents", "Fellowships", "MBA applications"];
const resourceFormats = ["All formats", "Checklist", "Worksheet", "Template"];

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
  const fallback = sampleContent.filter((item) => item.type === "resource");
  const { items: resources, isLive } = usePublicContent("resource", fallback);
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
    <section className="bg-brand-sage">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid min-h-56 grid-cols-1 items-center gap-8 py-9 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,.85fr)]">
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
      {!isLive && <p className="rounded border border-brand-line bg-brand-blue p-3 text-sm text-brand-muted">Showing the saved resource library while the live content service is unavailable.</p>}
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
  const { items } = usePublicContent("testimonial", []);

  return <>
    <PageHeader
      header="client feedback"
      title="A client’s experience with Careergrill."
      description="A client’s experience with Careergrill’s statement of purpose support."
    />
    <Container className="space-y-7 py-10 flex flex-col gap-10">
      <article className="grid overflow-hidden rounded border border-brand-line bg-white md:grid-cols-2">
        <div className="p-6 md:p-8">
          <Eyebrow>Statement of purpose support</Eyebrow>
          <h2 className="my-3 text-3xl">Keeping your experience<br />in your statement.</h2>
          <blockquote className="my-5 border-l-2 border-brand-orange pl-4 text-lg leading-relaxed text-brand-muted">“…would walk you through writing your statement of purpose (SOP) in a perfectly fine manner that reflects not only your journey but who you are!”</blockquote>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-brand-blue text-sm font-bold text-brand-purple" aria-hidden="true">HA</span>
            <div className="grid"><strong>Hameedah Abdrasheed-Babatunde</strong><small className="text-sm text-brand-muted">On statement of purpose support</small></div>
          </div>
          <a className="text-xs text-brand-purple underline" href="https://careergrill.com" target="_blank" rel="noreferrer">Read the original testimonial ↗</a>
        </div>
        <div className="relative grid min-h-72 place-items-center bg-brand-blue p-6" role="img" aria-label="Careergrill application review: Choose the evidence, explain the connection, keep it yours.">
          <span className="absolute left-5 top-5 text-xs font-semibold uppercase tracking-widest text-brand-purple">Application review</span>
          <div className="w-full max-w-sm rotate-1 rounded bg-white p-5 shadow-lg">
            <small className="mb-4 block text-xs font-semibold uppercase tracking-wide text-brand-muted">Your experience / your voice</small>
            {["Choose the evidence.", "Explain the connection.", "Keep it yours."].map((label, index) => <div className="flex items-center gap-3 border-t border-brand-line py-3" key={label}><span className="font-display text-sm font-bold text-brand-orange">0{index + 1}</span><strong>{label}</strong></div>)}
            <em className="mt-2 block text-right text-xs text-brand-muted">The story belongs to the applicant.</em>
          </div>
          <b className="absolute bottom-3 right-5 font-display text-5xl text-brand-purple" aria-hidden="true">c<span className="text-brand-orange">.</span></b>
        </div>
      </article>
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
      <aside className="flex items-center justify-between gap-5 rounded bg-brand-sage p-5 max-md:flex-col max-md:items-start">
        <div><h2 className="mb-1 text-xl font-bold">Want to discuss your own application?</h2><p className="mb-0 text-sm text-brand-muted">Bring your goal and the part of the process you need help with.</p></div>
        <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/consultation?mode=call">Book a free 15-minute call</Link>
      </aside>
    </Container>
  </>;
}

export function FaqPage() {
  const { items: cmsFaqs } = usePublicContent("faq", []);
  const groups: { title: string; questions: string[] }[] = [
    { title: "AI Career Audit", questions: ["Can I use the audit for my job search?", "Who produces the feedback?", "Do I need to sign in?", "Does the AI read a link or my full CV automatically?", "What if generation fails?", "Can I change my answers?"] },
    { title: "Opportunities & saved work", questions: ["Does a search result confirm that I am eligible?", "What does “Status needs checking” mean?", "Does saving a listing submit an application?", "Where are my worksheet notes saved?"] },
    { title: "Consultations & paid support", questions: ["What is included in the free 15-minute call?", "How much do paid services cost?", "Does preparing an enquiry send it?", "Can Careergrill guarantee a job, admission or scholarship?"] },
  ];
  return <><PageIntro eyebrow="Help & FAQs" title={<>Answers before<br /><em>your next step.</em></>} text="How the audit, opportunity directory and Careergrill support work." /><section className="mx-auto w-full max-w-7xl px-4 sm:px-8 space-y-6 py-7">{groups.map(({ title, questions }) => <section className="rounded border border-brand-line bg-white p-5" key={title}><h2 className="mb-4 text-2xl">{title}</h2>{questions.map((question) => <details className="border-t border-brand-line py-3" key={question}><summary className="cursor-pointer font-semibold marker:text-brand-orange">{question}</summary><p className="mb-0 mt-3 leading-relaxed text-brand-muted">{question.includes("guarantee") ? "No. Careergrill can help you make a stronger, more considered application, but decisions remain with employers, institutions and funders." : question.includes("saved") || question.includes("listing") ? "Saving a listing keeps it in your private workspace. It does not submit an application or confirm eligibility. Check the official source and keep your notes current." : "You stay in control of what you share. Review the privacy page for details about account storage and AI processing."}</p></details>)}</section>)}{cmsFaqs.length > 0 && <section className="rounded border border-brand-line bg-white p-5"><h2 className="mb-4 text-2xl">More answers</h2>{cmsFaqs.map((item) => <details className="border-t border-brand-line py-3" key={item.id}><summary className="cursor-pointer font-semibold marker:text-brand-orange">{item.title}</summary><RichContent value={item.body} className="text-sm leading-relaxed text-brand-muted mt-3 text-brand-muted" /><Link className="mt-3 inline-block font-semibold text-brand-purple hover:underline" href={contentHref("faq", item.slug)}>Open full answer ↗</Link></details>)}</section>}<div className="flex items-center justify-between gap-4 rounded bg-brand-sage p-5 max-sm:flex-col max-sm:items-start"><h2 className="mb-0 text-xl font-bold">Still have a question?</h2><Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/consultation?mode=call">Arrange a free 15-minute call</Link></div></section></>;
}

export function PrivacyPage() {
  return <><PageIntro eyebrow="Your information" title={<>What you share.<br /><em>Where it is used.</em></>} text="Privacy information for the Careergrill website." /><article className="mx-auto w-full max-w-7xl px-4 sm:px-8 space-y-4 py-7"><p className="mb-0 text-sm text-brand-muted">Updated 15 October 2026</p><h2 className="mb-0 mt-3 text-2xl">Your account and saved work</h2><p className="leading-relaxed text-brand-muted">Signing in connects your account identifier, name and email to your saved workspace. Careergrill stores saved opportunities, application notes and preferences so you can return to them. Workspace access is scoped to your signed-in account.</p><h2 className="mb-0 mt-3 text-2xl">AI-generated content</h2><p className="leading-relaxed text-brand-muted">When an administrator asks an AI provider to draft website content, only the prompt and any selected reference documents are sent to that provider. API credentials stay encrypted on the server and are never included in the website response. Generated content remains a draft until an administrator reviews and publishes it.</p><p className="leading-relaxed text-brand-muted">If you choose to submit an audit, your answers are sent to the configured AI provider to generate feedback. Do not include passwords, identification numbers, contact details or confidential third-party information.</p><h2 className="mb-0 mt-3 text-2xl">Drafts and resource worksheets</h2><p className="leading-relaxed text-brand-muted">Unsaved worksheet notes use this browser tab’s session storage. They do not automatically sync across devices. Download or save work you want to keep.</p><h2 className="mb-0 mt-3 text-2xl">Enquiries and consultations</h2><p className="leading-relaxed text-brand-muted">A prepared enquiry remains in this tab until you copy it or choose to send it through email or WhatsApp. Those services and any linked booking provider process information under their own policies.</p><h2 className="mb-0 mt-3 text-2xl">Keeping and deleting information</h2><p className="leading-relaxed text-brand-muted">Saved work remains available in your account until you remove it or request its removal. You can delete individual saved opportunities and audits in your workspace. To request removal of account-linked information or ask about a copy, email <a className="font-semibold text-brand-purple hover:underline" href="mailto:info@careergrill.com">info@careergrill.com</a>. Hosting providers may retain operational records or backups under their own retention arrangements.</p><h2 className="mb-0 mt-3 text-2xl">Questions</h2><p className="leading-relaxed text-brand-muted">Contact <a className="font-semibold text-brand-purple hover:underline" href="mailto:info@careergrill.com">info@careergrill.com</a> about how your information is used or to report a concern.</p></article></>;
}

export function ConsultationPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "call" ? "call" : "enquiry";
  const [message, setMessage] = useState("");
  const [service, setService] = useState("Help me choose the right support");
  const [goal, setGoal] = useState("");
  const [process, setProcess] = useState("");
  const [deadline, setDeadline] = useState("");
  const [details, setDetails] = useState("");
  const [prepared, setPrepared] = useState("");
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = `Hello Careergrill,\n\nI would like to discuss: ${service}.\nMy goal or next step: ${goal}${process ? `\nWhere I am in the process: ${process}` : ""}${deadline ? `\nMy deadline: ${deadline}` : ""}\n\nA little more context:\n${details || "No additional context yet."}\n\nPlease let me know the next step.`;
    setPrepared(text);
    setMessage("Your brief is ready. Choose when and how to send it.");
  }
  const callMessage = encodeURIComponent("Hello Careergrill, I would like to arrange a free 15-minute consultation. Please let me know what times are available.");
  const services = ["Help me choose the right support", "Statement review · Admissions", "Application strategy · Admissions", "CV review & rewrite · Career documents", "LinkedIn support · Career documents", "Interview preparation · Career documents", "Application direction · MBA", "Essay development & review · MBA"];
  return <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-7">
    <Link className="mb-5 inline-block text-sm font-semibold text-brand-purple hover:underline" href="/services">← All services</Link>
    <header className="mb-6 max-w-3xl">
      <Eyebrow>{mode === "call" ? "Free 15-minute consultation" : "Discuss your support"}</Eyebrow>
      <h1 className="my-2 text-4xl">{mode === "call" ? "Talk through your next step." : "Tell us what you need."}</h1>
      <p className="mb-0 leading-relaxed text-brand-muted">{mode === "call"
        ? "Bring your goal, deadline and the part you want help with. Use this short call to decide what support makes sense."
        : "Share your goal and the help you want. Review the message, edit it if needed, then copy it or send it through WhatsApp or email."}</p>
    </header>
    {mode === "call" ? <div className="grid gap-4 md:grid-cols-2">
      <article className="grid content-start gap-3 rounded border border-brand-line bg-white p-5">
        <h2 className="mb-0 text-2xl">A focused first conversation</h2>
        <ul className="mb-0 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
          <li>Explain your job search or application goal</li>
          <li>Ask about the support available</li>
          <li>Agree a next step, if you want one</li>
        </ul>
        <p className="mb-0 text-sm leading-relaxed text-brand-muted">The 15-minute consultation is free. A full document review or ongoing application support is quoted separately before work begins.</p>
        <a className={buttonVariants({ variant: "brand", size: "sm" })} href={`https://wa.me/2348168097950?text=${callMessage}`} target="_blank" rel="noreferrer">Arrange a time on WhatsApp</a>
        <small className="text-xs text-brand-muted">Message Careergrill to ask about available times.</small>
      </article>
      <article className="grid content-start gap-3 rounded border border-brand-line bg-brand-blue p-5">
        <h2 className="mb-0 text-2xl">Prefer to arrange it by message?</h2>
        <p className="mb-0 text-sm leading-relaxed text-brand-muted">Send your goal and a few suitable times. Careergrill will confirm availability.</p>
        <a className={buttonVariants({ variant: "outline", size: "sm" })} href={`https://wa.me/2348168097950?text=${callMessage}`} target="_blank" rel="noreferrer">Ask about a free call on WhatsApp</a>
        <Link className="text-sm font-semibold text-brand-purple hover:underline" href="/consultation">Draft a service enquiry</Link>
      </article>
    </div> : <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,.8fr)]">
      <form className="grid content-start gap-4 rounded border border-brand-line bg-white p-5" onSubmit={prepare}>
        <h2 className="mb-0 text-2xl">Draft your enquiry</h2>
        <label className="grid gap-1.5 text-sm font-semibold">Service<select className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 font-normal" value={service} onChange={(event) => setService(event.target.value)}>{services.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="grid gap-1.5 text-sm font-semibold">Your goal or next step<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" value={goal} onChange={(event) => setGoal(event.target.value)} required placeholder="For example, choosing between a job search and postgraduate study" /></label>
        <label className="grid gap-1.5 text-sm font-semibold">Where are you in the process? (optional)<select className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 font-normal" value={process} onChange={(event) => setProcess(event.target.value)}><option value="">Choose if helpful</option><option>I’m exploring my options</option><option>I’m starting an application</option><option>I have a draft</option><option>I have an interview invitation</option></select></label>
        <label className="grid gap-1.5 text-sm font-semibold">Your deadline, if known<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
        <label className="grid gap-1.5 text-sm font-semibold">What would you like us to know?<textarea className="rounded border border-brand-line px-3 py-2 font-normal" value={details} onChange={(event) => setDetails(event.target.value)} rows={4} placeholder="For example: I have a 500-word draft, but I’m struggling to connect my experience to the selection criteria." /></label>
        <small className="text-xs text-brand-muted">Two or three sentences about the help you want are enough.</small>
        <button className={buttonVariants({ variant: "brand", size: "default" })}>Create message</button>
        {message && <p className="rounded border border-brand-line bg-brand-blue p-3 text-sm" role="status">{message}</p>}
        {prepared && <div className="grid gap-3 rounded bg-brand-sage p-4">
          <textarea className="w-full rounded border border-brand-line bg-white p-3 text-sm" value={prepared} onChange={(event) => setPrepared(event.target.value)} rows={9} aria-label="Prepared enquiry message" />
          <a className={buttonVariants({ variant: "brand", size: "sm" })} href={`mailto:info@careergrill.com?subject=${encodeURIComponent("Careergrill enquiry")}&body=${encodeURIComponent(prepared)}`}>Open in email ↗</a>
          <a className="text-sm font-semibold text-brand-purple hover:underline" href={`https://wa.me/2348168097950?text=${encodeURIComponent(prepared)}`} target="_blank" rel="noreferrer">Send with WhatsApp ↗</a>
        </div>}
        <p className="mb-0 text-sm text-brand-muted">Your enquiry draft stays in this tab. Copy it before leaving if you want to keep it.</p>
      </form>
      <aside className="grid content-start gap-3 rounded border border-brand-line bg-brand-blue p-5">
        <Eyebrow>Useful context</Eyebrow>
        <h2 className="mb-0 text-2xl">What to have ready.</h2>
        <ul className="mb-0 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
          <li>The goal you are working towards</li>
          <li>What you have already tried or prepared</li>
          <li>Any opportunity or deadline you have in mind</li>
          <li>The part of the process you want help with</li>
        </ul>
        <p className="mb-0 text-sm leading-relaxed text-brand-muted">You can make an enquiry before everything is ready. Agree the work, fee and delivery date before paid support begins. Share document files privately once you have agreed the process.</p>
        <h3 className="mb-0 mt-2 text-lg font-bold">Prefer to talk?</h3>
        <p className="mb-0 text-sm text-brand-muted">Arrange a free 15-minute consultation to discuss your goal.</p>
        <Link className={buttonVariants({ variant: "outline", size: "sm" })} href="/consultation?mode=call">Arrange a free 15-minute call</Link>
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

export function WorkspacePage({ view = "scholarships" }: { view?: "scholarships" | "jobs" | "audits" }) {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [audits, setAudits] = useState<{ id: string; goal: string; feedback: string; created_at: string }[]>([]);
  const [notice, setNotice] = useState("Loading your saved workspace…");
  const [stage, setStage] = useState("all");
  useEffect(() => {
    setNotice("Loading your saved workspace…");
    setStage("all");
    const request = view === "audits"
      ? apiRequest<{ items: { id: string; goal: string; feedback: string; created_at: string }[] }>("/audits")
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
      const result = await apiRequest<{ feedback: string }>("/audits/feedback", { method: "POST", body: JSON.stringify({ goal, answers, consent: true }) });
      setFeedback(result.feedback);
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
        <h1 className="my-2 text-[40px] font-extrabold leading-tight">Review your preparation with AI.</h1>
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
      <div className="flex flex-wrap justify-between gap-3 border-t border-brand-line pt-3"><button type="button" className="text-sm font-semibold text-brand-purple hover:text-brand-orange-dark underline" onClick={() => { sessionStorage.removeItem("careergrill-audit-draft"); setAnswers({ direction: "", experience: "", evidence: "", concerns: "", target: "", timeline: "" }); setFeedback(""); setStep(1); setNotice("This tab’s draft has been cleared."); }}>Clear this tab’s draft</button><Link className="text-sm font-semibold text-brand-purple hover:text-brand-orange-dark underline" href="/faq">Questions about the audit? ↗</Link></div>
    </form>
    {feedback && <section className="rounded border border-brand-line bg-brand-sage p-5 lg:col-start-2"><Eyebrow>Your application direction</Eyebrow><h2 className="my-2 text-2xl">A practical next-step plan.</h2><div className="space-y-2 leading-relaxed text-brand-muted">{feedback.split("\n").map((line, index) => <p className="mb-0" key={index}>{line}</p>)}</div></section>}
  </Container>;
}

export function ContentDetail({ slug, expectedType }: { slug: string; expectedType?: ContentType }) {
  const [item, setItem] = useState<SiteContent | undefined>(() => sampleContent.find((content) => content.slug === slug && (!expectedType || content.type === expectedType)));
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
    faq: "FAQs",
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
