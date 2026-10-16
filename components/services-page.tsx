"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { serviceFaqs, servicePages, type ServicePageData } from "@/lib/services";
import type { SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import RichContent from "@/components/rich-content";
import ServicePricing from "@/components/service-pricing";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ServicesPage() {
  const [cmsServices, setCmsServices] = useState<SiteContent[]>([]);
  const [serviceLoadError, setServiceLoadError] = useState("");

  useEffect(() => {
    apiRequest<{ items: SiteContent[] }>("/content?type=service")
      .then(({ items }) => {
        setCmsServices(items);
        setServiceLoadError("");
      })
      .catch((error: unknown) => {
        setServiceLoadError(error instanceof Error ? error.message : "Additional service listings could not be loaded.");
      });
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <section className="bg-brand-sage">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid min-h-88 grid-cols-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18.75rem,.8fr)] lg:gap-18 lg:py-11">
          <div>
            <Eyebrow className="text-brand-eyebrow">Careergrill services</Eyebrow>
            <h1 className="mb-4 mt-2 max-w-3xl text-5xl leading-tight tracking-[-0.055em] sm:text-6xl">Support with jobs,<br /><em>admissions and MBA<br />applications.</em></h1>
            <p className="mb-5 max-w-2xl text-lg leading-relaxed text-brand-muted">Get help with CVs, LinkedIn, interviews, graduate applications, scholarships and fellowships. Choose a service or discuss what you need.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link className={buttonVariants({ variant: "brand" })} href="/consultation?mode=call">Book a free 15-minute call <span aria-hidden="true">↗</span></Link>
              <Link className="inline-flex items-center gap-2 text-brand-purple underline font-bold hover:text-brand-orange-dark" href="/services?section=pricing">View services and pricing</Link>
            </div>
          </div>
          <aside className="rounded-md border border-brand-line bg-[#fffaf3] px-7 py-6 shadow-[5px_6px_0_rgba(56,34,92,.035)]">
            <Eyebrow className="text-brand-eyebrow">A useful starting point</Eyebrow>
            <h2 className="mb-4 mt-2 text-2xl font-bold tracking-tight">Tell us what you need help with.</h2>
            <ol className="m-0 list-none p-0">
              <li className="flex min-h-11 items-center gap-3 border-b border-brand-line text-base"><span className="text-sm text-brand-orange">01</span>Your intended role or opportunity</li>
              <li className="flex min-h-11 items-center gap-3 border-b border-brand-line text-base"><span className="text-sm text-brand-orange">02</span>The experience you can build on</li>
              <li className="flex min-h-11 items-center gap-3 text-base"><span className="text-sm text-brand-orange">03</span>Your draft, questions and deadline</li>
            </ol>
            <p className="mb-0 mt-3.5 text-sm leading-relaxed text-brand-muted">Careergrill is led by Sanni Alausa-Issa. Discuss your goal, the work involved, the fee and the delivery date before you decide.</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-12 flex flex-col gap-5 mt-5">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><Eyebrow>Choose your support</Eyebrow><h2 className="mb-0 text-5xl">What needs attention?</h2></div>
          <p className="mb-0 max-w-sm text-sm text-brand-muted">Choose the document or application you want help with. If you’re unsure, start with a free 15-minute call.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servicePages.map((service, index) => (
            <ServiceOfferCard key={service.slug} service={service} index={index} />
          ))}
          {cmsServices.map((service) => (
            <article className="flex min-h-76 flex-col rounded-sm border border-brand-line bg-white p-5" key={service.id}>
              <span className="mb-4 flex min-h-7 items-center text-sm font-semibold uppercase tracking-wide text-brand-eyebrow">{service.category || "Careergrill support"}</span>
              <h3 className="mb-2 mt-3 font-display text-xl font-bold tracking-tight">{service.title}</h3>
              {service.excerpt ? <p className="mb-3 min-h-12 text-sm leading-relaxed text-brand-muted">{service.excerpt}</p> : <RichContent value={service.body} className="min-h-20 text-brand-muted" />}
              <Link className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-auto self-start`} href={`/services/${encodeURIComponent(service.slug)}`}>Explore service <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
        {serviceLoadError && <p className="mb-0 mt-3 text-sm text-red-800" role="status">{serviceLoadError}</p>}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 my-0 mb-3 grid items-center gap-8 rounded-lg bg-brand-purple p-7 text-white lg:grid-cols-[minmax(0,1fr)_minmax(20.625rem,.85fr)] lg:gap-14">
        <div>
          <Eyebrow className="text-brand-footer-hover">Still exploring?</Eyebrow>
          <h2 className="mb-3 mt-2 text-4xl text-white">Start by understanding<br />your preparation.</h2>
          <p className="mb-4 max-w-lg text-base leading-relaxed text-brand-blue">The AI Career Audit has paths for job seekers and study, scholarship or fellowship applicants. Get feedback on the experience you share and a practical set of next steps.</p>
          <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/career-audit">Start an AI Career Audit</Link>
        </div>
        <aside className="rounded border border-white/20 bg-white/10 p-5">
          <span className="mb-2 block text-sm uppercase text-[#d6cddd]">Your starting point</span>
          <div className="border-b border-white/20 py-2"><strong className="text-sm">What can you build on?</strong><p className="mb-0 mt-1 text-sm text-brand-blue">Relevant study, work, research or service.</p></div>
          <div className="border-b border-white/20 py-2"><strong className="text-sm">What needs a closer look?</strong><p className="mb-0 mt-1 text-sm text-brand-blue">Fit, evidence, requirements and timing.</p></div>
          <div className="pt-2"><strong className="text-sm">What comes next?</strong><p className="mb-0 mt-1 text-sm text-brand-blue">AI feedback you can use, with optional human support if you want it.</p></div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 border-b border-brand-line pb-8 pt-7 flex flex-col gap-5">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><Eyebrow>How the work starts</Eyebrow><h2 className="mb-0 text-4xl">Know what you’re getting.</h2></div>
          <p className="mb-0 max-w-sm text-base text-brand-muted">Confirm what the service includes before work starts, then use the feedback to revise your documents.</p>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          <article><span className="text-sm text-brand-eyebrow">01 / TALK IT THROUGH</span><h3 className="mb-2 mt-2 font-display text-xl font-bold">Explain where you are</h3><p className="mb-0 max-w-sm text-base text-brand-muted">Bring your goal, current documents, official instructions and the questions you need help answering.</p></article>
          <article><span className="text-sm text-brand-eyebrow">02 / AGREE THE WORK</span><h3 className="mb-2 mt-2 font-display text-xl font-bold">Agree what’s included</h3><p className="mb-0 max-w-sm text-base text-brand-muted">Confirm the documents or sessions, review rounds, fee and delivery date.</p></article>
          <article><span className="text-sm text-brand-eyebrow">03 / WORK WITH FEEDBACK</span><h3 className="mb-2 mt-2 font-display text-xl font-bold">Revise with a purpose</h3><p className="mb-0 max-w-sm text-base text-brand-muted">Use specific feedback to develop your application or documents while keeping your experience and voice intact.</p></article>
        </div>
      </section>

      <ServicePricing />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid gap-8 py-8 md:grid-cols-[minmax(13.75rem,.75fr)_minmax(0,1.4fr)]">
        <div className="flex flex-col gap-5">
          <Eyebrow>Before you book</Eyebrow><h2 className="mb-2 text-3xl">A few useful answers.</h2>
          <p className="text-sm text-brand-muted">Have a different question? Bring it to the first conversation.</p>
          <Link className="font-semibold text-brand-purple hover:text-brand-orange-dark underline" href="/faq">Read all FAQs</Link>
        </div>
        <div className="divide-y divide-brand-line space-y-3">
          {serviceFaqs.map((faq) => (
            <details key={faq.question} className="group pb-3">
              <summary className="flex cursor-pointer list-none items-center gap-2 py-3 text-sm font-bold marker:hidden [&::-webkit-details-marker]:hidden"><span className="transition-transform group-open:rotate-90">▸</span>{faq.question}</summary>
              <p className="mb-0 pb-3 pl-4 text-sm leading-relaxed text-brand-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 mb-10 flex flex-col items-start justify-between gap-10 rounded-md border border-brand-line bg-brand-sage p-6 md:flex-row md:items-center">
        <div><Eyebrow className="text-brand-eyebrow">A client’s perspective</Eyebrow><h2 className="mb-2 text-3xl leading-normal">Read about the support<br />behind the application.</h2><p className="mb-0 text-sm text-brand-muted">Read a client’s feedback on Careergrill’s statement support.</p></div>
        <Link href="/client-feedback">
          <Button variant={"outline"}>Read client feedback <span aria-hidden="true">↗</span></Button>
        </Link>
      </section>
    </div>
  );
}

function ServiceOfferCard({ service, index }: { service: ServicePageData; index: number }) {
  const badgeClasses = [
    "bg-brand-blue text-brand-eyebrow",
    "bg-emerald-50 text-emerald-900",
    "bg-sky-50 text-sky-900",
  ];

  return (
    <article className="flex h-full min-h-76 flex-col rounded-lg border border-brand-line bg-white p-7">
      <span className="flex min-h-7 items-center gap-3 text-sm uppercase tracking-wide text-brand-eyebrow">
        <span className={`grid size-10 place-items-center rounded font-semibold ${badgeClasses[index % badgeClasses.length]}`}>{String(index + 1).padStart(2, "0")}</span>
        <small className="text-sm">{service.category}</small>
      </span>
      <h3 className="mb-2 mt-4 font-display text-2xl font-extrabold tracking-tight">{service.overviewTitle}</h3>
      <p className="mb-3 min-h-12 text-base leading-relaxed text-brand-muted">{service.overviewText}</p>
      <ul className="mb-4 list-disc pl-4 text-sm leading-relaxed">{service.overviewBullets.map((highlight) => <li key={highlight} className="mt-1">{highlight}</li>)}</ul>
      <Link className="w-full flex bottom-auto" href={`/services/${service.slug}`}>
        <Button variant={"outline"} className="w-full">
          Explore {service.slug === "graduate-applications" ? "graduate" : service.slug === "career-documents" ? "career" : "MBA"} support <span aria-hidden="true">↗</span>
        </Button>
      </Link>
    </article>
  );
}

export function ServiceDetailPage({ service }: { service: ServicePageData }) {
  return (
    <article className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-8 pb-14">
      <Link className="mb-6 inline-block text-sm underline underline-offset-4" href="/services">All services</Link>
      <header className="mb-6 max-w-3xl">
        <Eyebrow className="text-brand-eyebrow">{service.category}</Eyebrow>
        <h1 className="mb-3 text-5xl tracking-tight">{service.title}</h1>
        <p className="mb-0 max-w-2xl text-base text-brand-muted">{service.excerpt}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {service.offers.map((offer) => (
          <section key={offer.title} className="flex min-h-64 flex-col rounded border border-brand-line bg-white p-5">
            <h2 className="mb-2 text-lg font-bold">{offer.title}</h2>
            <p className="mb-2 min-h-8 text-sm text-brand-muted">{offer.audience}</p>
            <ul className="mb-4 list-disc pl-4 text-sm leading-relaxed">{offer.bullets.map((bullet) => <li key={bullet} className="mt-1">{bullet}</li>)}</ul>
            <Link className={`${buttonVariants({ variant: "brand", size: "sm" })} mt-auto self-start`} href={offer.href}>{offer.callToAction}</Link>
          </section>
        ))}
      </div>
      <aside className="mt-4 rounded bg-brand-sage p-5">
        <h2 className="mb-2 text-base font-bold">{service.noteTitle}</h2>
        <p className="mb-3 max-w-3xl text-sm text-brand-muted">{service.note}</p>
        <Link className="text-sm font-semibold text-brand-purple hover:underline" href="/consultation">Speak to Careergrill</Link>
      </aside>
    </article>
  );
}
