"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { servicePageFromContent, type ServicePageData } from "@/lib/services";
import type { SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import RichContent from "@/components/rich-content";
import { usePublicCopy } from "./use-public-copy";
import ServicePricing from "@/components/service-pricing";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ServicesPage() {
  const [cmsServices, setCmsServices] = useState<SiteContent[]>([]);
  const [serviceLoadError, setServiceLoadError] = useState("");
  const { copy, error: copyError, loading: copyLoading } = usePublicCopy();

  useEffect(() => {
    let active = true;
    void apiRequest<{ items: SiteContent[] }>("/content?type=service")
      .then(({ items }) => {
        if (active) setCmsServices(items);
      })
      .catch((error: unknown) => {
        if (active) setServiceLoadError(error instanceof Error ? error.message : "Service information could not be loaded.");
      });
    return () => { active = false; };
  }, []);

  const pageServices = useMemo(() => cmsServices
    .map((item) => ({ item, page: servicePageFromContent(item.data) }))
    .filter((entry): entry is { item: SiteContent; page: ServicePageData } => entry.page !== null), [cmsServices]);
  const additionalServices = useMemo(() => cmsServices.filter((item) => !servicePageFromContent(item.data)), [cmsServices]);

  if (!copy) {
    return <p className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8" role={copyLoading ? "status" : "alert"}>
      {copyLoading ? "Loading service information…" : `Service information could not be loaded: ${copyError}`}
    </p>;
  }
  const content = copy.services;
  const serviceFaqs = copy.service_faqs;

  return (
    <div className="flex flex-col gap-10">
      <section className="bg-brand-sage">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid min-h-88 grid-cols-1 items-center gap-10 py-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18.75rem,.8fr)] lg:gap-18 lg:py-11">
          <div>
            <Eyebrow className="text-brand-eyebrow">{content.hero.eyebrow}</Eyebrow>
            <h1 className="mb-4 mt-2 max-w-3xl whitespace-pre-line text-5xl leading-tight tracking-[-0.055em] sm:text-6xl"><em>{content.hero.title}</em></h1>
            <p className="mb-5 max-w-2xl text-lg leading-relaxed text-brand-muted">{content.hero.description}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link className={buttonVariants({ variant: "brand" })} href="/consultation?mode=call">{content.hero.callLink} <span aria-hidden="true">↗</span></Link>
              <Link className="inline-flex items-center gap-2 text-brand-purple underline font-bold hover:text-brand-orange-dark" href="/services?section=pricing">{content.hero.pricingLink}</Link>
            </div>
          </div>
          <aside className="rounded-md border border-brand-line bg-[#fffaf3] px-7 py-6 shadow-[5px_6px_0_rgba(56,34,92,.035)]">
            <Eyebrow className="text-brand-eyebrow">{content.hero.startingPointEyebrow}</Eyebrow>
            <h2 className="mb-4 mt-2 text-2xl font-bold tracking-tight">{content.hero.startingPointTitle}</h2>
            <ol className="m-0 list-none p-0">
              {content.hero.startingPoints.map((item, index) => <li className={`flex min-h-11 items-center gap-3 text-base ${index < content.hero.startingPoints.length - 1 ? "border-b border-brand-line" : ""}`} key={item}><span className="text-sm text-brand-orange">{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
            </ol>
            <p className="mb-0 mt-3.5 text-sm leading-relaxed text-brand-muted">{content.hero.note}</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 py-12 flex flex-col gap-5 mt-5">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><Eyebrow>{content.offers.eyebrow}</Eyebrow><h2 className="mb-0 text-5xl">{content.offers.title}</h2></div>
          <p className="mb-0 max-w-sm text-sm text-brand-muted">{content.offers.description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pageServices.map(({ page }, index) => (
            <ServiceOfferCard key={page.slug} service={page} index={index} exploreLabel={content.offers.exploreLink} />
          ))}
          {additionalServices.map((service) => (
            <article className="flex min-h-76 flex-col rounded-sm border border-brand-line bg-white p-5" key={service.id}>
              <span className="mb-4 flex min-h-7 items-center text-sm font-semibold uppercase tracking-wide text-brand-eyebrow">{service.category || content.offers.fallbackCategory}</span>
              <h3 className="mb-2 mt-3 font-display text-xl font-bold tracking-tight">{service.title}</h3>
              {service.excerpt ? <p className="mb-3 min-h-12 text-sm leading-relaxed text-brand-muted">{service.excerpt}</p> : <RichContent value={service.body} className="min-h-20 text-brand-muted" />}
              <Link className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-auto self-start`} href={`/services/${encodeURIComponent(service.slug)}`}>{content.offers.exploreLink} <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
        {serviceLoadError && <p className="mb-0 mt-3 text-sm text-red-800" role="alert">{serviceLoadError}</p>}
        {!serviceLoadError && !cmsServices.length && <p className="mb-0 mt-3 text-sm text-brand-muted">No services are currently published.</p>}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 my-0 mb-3 grid items-center gap-8 rounded-lg bg-brand-purple p-7 text-white lg:grid-cols-[minmax(0,1fr)_minmax(20.625rem,.85fr)] lg:gap-14">
        <div>
          <Eyebrow className="text-brand-footer-hover">{content.audit.eyebrow}</Eyebrow>
          <h2 className="mb-3 mt-2 whitespace-pre-line text-4xl text-white">{content.audit.title}</h2>
          <p className="mb-4 max-w-lg text-base leading-relaxed text-brand-blue">{content.audit.description}</p>
          <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/career-audit">{content.audit.link}</Link>
        </div>
        <aside className="rounded border border-white/20 bg-white/10 p-5">
          <span className="mb-2 block text-sm uppercase text-[#d6cddd]">{content.audit.startingPointTitle}</span>
          {content.audit.startingPoints.map((item, index) => <div className={`${index < content.audit.startingPoints.length - 1 ? "border-b border-white/20" : ""} py-2`} key={item.title}><strong className="text-sm">{item.title}</strong><p className="mb-0 mt-1 text-sm text-brand-blue">{item.description}</p></div>)}
        </aside>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 border-b border-brand-line pb-8 pt-7 flex flex-col gap-5">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><Eyebrow>{content.process.eyebrow}</Eyebrow><h2 className="mb-0 text-4xl">{content.process.title}</h2></div>
          <p className="mb-0 max-w-sm text-base text-brand-muted">{content.process.description}</p>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {content.process.steps.map((step) => <article key={step.eyebrow}><span className="text-sm text-brand-eyebrow">{step.eyebrow}</span><h3 className="mb-2 mt-2 font-display text-xl font-bold">{step.title}</h3><p className="mb-0 max-w-sm text-base text-brand-muted">{step.description}</p></article>)}
        </div>
      </section>

      <ServicePricing />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 grid gap-8 py-8 md:grid-cols-[minmax(13.75rem,.75fr)_minmax(0,1.4fr)]">
        <div className="flex flex-col gap-5">
          <Eyebrow>{content.faq.eyebrow}</Eyebrow><h2 className="mb-2 text-3xl">{content.faq.title}</h2>
          <p className="text-sm text-brand-muted">{content.faq.description}</p>
          <Link className="font-semibold text-brand-purple hover:text-brand-orange-dark underline" href="/faq">{content.faq.link}</Link>
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
        <div><Eyebrow className="text-brand-eyebrow">{content.testimonial.eyebrow}</Eyebrow><h2 className="mb-2 whitespace-pre-line text-3xl leading-normal">{content.testimonial.title}</h2><p className="mb-0 text-sm text-brand-muted">{content.testimonial.description}</p></div>
        <Link href="/client-feedback">
          <Button variant={"outline"}>{content.testimonial.link} <span aria-hidden="true">↗</span></Button>
        </Link>
      </section>
    </div>
  );
}

function ServiceOfferCard({ service, index, exploreLabel }: { service: ServicePageData; index: number; exploreLabel: string }) {
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
          {exploreLabel} {service.category.toLowerCase()} <span aria-hidden="true">↗</span>
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
      <Button variant={"outline"} className="mt-6">
        <Link href="/services?section=pricing">View packages and pricing</Link>
      </Button>
      <aside className="mt-4 rounded bg-brand-sage p-5">
        <h2 className="mb-2 text-base font-bold">{service.noteTitle}</h2>
        <p className="mb-3 max-w-3xl text-sm text-brand-muted">{service.note}</p>
        <Link className="text-sm font-semibold text-brand-purple hover:underline" href="/consultation">Speak to Careergrill</Link>
      </aside>
    </article>
  );
}

export function ServiceRecordPage({ slug }: { slug: string }) {
  const [item, setItem] = useState<SiteContent | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void apiRequest<{ item: SiteContent }>(`/content/${encodeURIComponent(slug)}`)
      .then(({ item: result }) => {
        if (!active) return;
        if (result.type !== "service") {
          setError("This content is not a service.");
          return;
        }
        setItem(result);
      })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load this service."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  if (loading && !item) return <p className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8" role="status">Loading service…</p>;
  if (!item) return <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-8"><h1>Service unavailable.</h1><p role="alert">{error || "This service is not published."}</p><Link className={buttonVariants({ variant: "brand" })} href="/services">Back to services</Link></section>;
  const service = servicePageFromContent(item.data);
  if (service) return <ServiceDetailPage service={service} />;
  return <article className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
    <Link className="mb-6 inline-block text-sm font-semibold text-brand-purple hover:underline" href="/services">← All services</Link>
    <header className="mb-6 max-w-3xl"><Eyebrow>{item.category || "Careergrill services"}</Eyebrow><h1 className="my-3 text-5xl">{item.title}</h1><p className="text-base text-brand-muted">{item.excerpt}</p></header>
    <RichContent value={item.body} className="max-w-3xl text-base leading-relaxed" />
  </article>;
}
