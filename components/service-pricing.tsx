"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Eyebrow } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import type { ServicePricingCopy } from "@/lib/public-copy";
import type { ServicePricingConfig } from "@/lib/service-pricing";
import { usePublicPricingCopy } from "./use-public-pricing-copy";

type Category = "career" | "admissions" | "scholarships" | "mba";

type Package = {
  title: string;
  price: number | null;
  unit: string;
  description?: string;
  inclusions: string[];
  rate: string;
  offer: number;
  kicker: string;
  saving?: string;
  unitDetail?: string;
  featured?: boolean;
};

const categories: { id: Category; label: string }[] = [
  { id: "career", label: "Career services" },
  { id: "admissions", label: "Admission essays" },
  { id: "scholarships", label: "Scholarship essays" },
  { id: "mba", label: "MBA applications" },
];

const careerBands = [
  { value: "0-3", label: "0–3 years" },
  { value: "4-6", label: "4–6 years" },
  { value: "7-10", label: "7–10 years" },
  { value: "10+", label: "10+ years" },
] as const;

const scholarshipBands = [
  { value: "1-2", label: "1–2 essays" },
  { value: "3-4", label: "3–4 essays" },
  { value: "5-6", label: "5–6 essays" },
  { value: "7+", label: "7 or more essays" },
] as const;

const pricingPanelClassName = "mb-3 flex min-h-20 items-center gap-5 rounded-md border border-brand-sage bg-brand-blue p-3.5 max-md:flex-col max-md:items-stretch";
const pricingLabelClassName = "grid min-w-60 gap-2 text-sm font-bold text-brand-ink";
const pricingFieldClassName = "min-h-10 w-full max-w-64 rounded border border-brand-sage bg-white px-2.5 py-1.5 text-base text-brand-ink max-md:max-w-none";
const pricingCardsClassName = "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3";
const pricingFactsClassName = "my-3 grid gap-4 border-y border-brand-line py-3 md:grid-cols-3 [&>p]:mb-0 [&>p]:text-sm [&>p]:leading-relaxed [&>p>strong]:text-brand-ink";

function formatCopy(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) => values[key] ?? token);
}

function money(amount: number, currencySymbol: string) {
  return `${currencySymbol}${amount.toLocaleString("en-NG")}`;
}

function enquiryHref(rate: string, service: Category, offer: number, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ rate, service, offer: String(offer), ...extra });
  return `/consultation?${params.toString()}`;
}

function PackageCard({
  title,
  price,
  unit,
  description,
  inclusions,
  rate,
  service,
  offer,
  extra = {},
  kicker,
  saving,
  unitDetail,
  featured = false,
  copy,
}: Package & {
  service: Category;
  extra?: Record<string, string>;
  copy: Pick<ServicePricingCopy, "customQuote" | "requestQuote" | "enquirePrefix" | "currencySymbol">;
}) {
  return (
    <article className={`flex min-w-0 min-h-75 flex-col rounded-lg border gap-3 p-6 ${featured ? "border-brand-orange-dark bg-brand-footer" : "border-brand-purple/30 bg-white"}`}>
      <p className="mb-3.5 min-h-4 text-sm font-bold leading-snug text-brand-eyebrow">{kicker}</p>
      <h3 className="mb-3.5 min-h-7 font-display text-xl font-bold tracking-tight">{title}</h3>
      <p className="mb-0 font-display text-3xl font-extrabold leading-tight tracking-tight">{price === null ? copy.customQuote : money(price, copy.currencySymbol)}</p>
      <p className="mb-3 mt-0.5 text-sm text-brand-muted">{unit}</p>
      {unitDetail && <p className="-mt-2.5 mb-2.5 text-sm text-brand-muted">{unitDetail}</p>}
      {saving && <p className="mb-3 rounded bg-amber-50 px-2 py-2 text-sm text-amber-950">{saving}</p>}
      {description && <p className="mb-2.5 min-h-8 text-sm leading-relaxed text-brand-muted">{description}</p>}
      <ul className="mb-3.5 mt-2 list-disc pl-4 text-sm leading-relaxed text-brand-ink [&>li+li]:mt-1.5">{inclusions.map((item) => <li key={item}>{item}</li>)}</ul>
      <Link href={enquiryHref(rate, service, offer, extra)}>
        <Button variant={"outline"} className="w-full">{price === null ? copy.requestQuote : `${copy.enquirePrefix} ${title}`}</Button>
      </Link>
    </article>
  );
}

function Terms({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="my-3 rounded-md border border-brand-sage px-3">
      <summary className="flex min-h-10 cursor-pointer items-center text-sm font-bold">{title}</summary>
      <div className="max-w-4xl pb-2.5 [&>p]:mb-2.5 [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-brand-muted">{children}</div>
    </details>
  );
}

function Facts({ facts }: { facts: ServicePricingCopy["career"]["facts"] }) {
  return (
    <div className={pricingFactsClassName}>
      {facts.map((fact) => <p key={fact.label}><strong>{fact.label}:</strong> {fact.text}</p>)}
    </div>
  );
}

function CancellationRows({ copy, stages }: { copy: ServicePricingCopy["cancellation"]; stages: string[] }) {
  return (
    <>
      <h3 className="mb-1 mt-3 border-t border-brand-line pt-2.5 font-display text-base font-bold">{copy.title}</h3>
      {stages.map((stage, index) => <div className="flex justify-between gap-4 border-b border-brand-line py-2 text-sm" key={stage}><span>{stage}</span><strong className="whitespace-nowrap text-brand-purple">{copy.amounts[index]}</strong></div>)}
      <p>{copy.note}</p>
    </>
  );
}

export default function ServicePricing() {
  const { copy, error: copyError, loading: copyLoading } = usePublicPricingCopy();
  const [pricing, setPricing] = useState<ServicePricingConfig | null>(null);
  const [pricingLoadError, setPricingLoadError] = useState("");
  const [pricingLoading, setPricingLoading] = useState(true);
  const [category, setCategory] = useState<Category>("career");
  const [careerBand, setCareerBand] = useState("0-3");
  const [essayBand, setEssayBand] = useState("1-2");
  const [hasScholarshipAssessment, setHasScholarshipAssessment] = useState(false);
  const [schoolCountInput, setSchoolCountInput] = useState("3");
  const [paymentPlan, setPaymentPlan] = useState<"single" | "instalments">("single");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("section") === "pricing") {
      document.getElementById("service-pricing")?.scrollIntoView({ block: "start" });
    }
  }, []);

  useEffect(() => {
    apiRequest<{ pricing: ServicePricingConfig }>("/pricing")
      .then(({ pricing: savedPricing }) => setPricing(savedPricing))
      .catch((error: unknown) => {
        setPricingLoadError(error instanceof Error ? error.message : "Updated service prices could not be loaded.");
      })
      .finally(() => setPricingLoading(false));
  }, []);

  if (!pricing || !copy) {
    const loading = pricingLoading || copyLoading;
    const error = pricingLoadError || copyError;
    return <section className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-8" id="service-pricing" aria-labelledby="service-pricing-title">
      <h2 className="mb-3 text-3xl" id="service-pricing-title">Service pricing</h2>
      {loading ? <p role="status">Loading current prices…</p> : <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">Pricing information could not be loaded from the backend: {error}</p>}
    </section>;
  }

  const selectedCareerBand = careerBands.find((band) => band.value === careerBand) ?? careerBands[0];
  const selectedCareerPrice = pricing.career.bands[selectedCareerBand.value];
  const selectedEssayBand = scholarshipBands.find((band) => band.value === essayBand) ?? scholarshipBands[0];
  const effectiveEssayBand = hasScholarshipAssessment ? scholarshipBands[2] : selectedEssayBand;
  const essayCustomQuote = effectiveEssayBand.value === "7+";
  const scholarshipPrices = pricing.scholarships[effectiveEssayBand.value];
  const parsedSchoolCount = Number(schoolCountInput);
  const schoolCount = Number.isFinite(parsedSchoolCount) && parsedSchoolCount >= 3 ? Math.floor(parsedSchoolCount) : 3;
  const discount = paymentPlan === "single"
    ? schoolCount >= 10 ? pricing.mba.discountAtTen / 100 : schoolCount >= 5 ? pricing.mba.discountAtFive / 100 : 0
    : 0;
  const mbaExtra = { schools: String(schoolCount), payment: paymentPlan === "single" ? "single" : "instalments" };

  const packageFor = (rate: string, price: number | null, offer: number, kicker: string): Package => {
    const packageCopy = copy.packages[rate];
    return { ...packageCopy, rate, price, offer, kicker };
  };

  const careerCards = [
    ...(["career-cv", "career-cover-letter", "career-linkedin"] as const).map((rate, index) =>
      packageFor(rate, selectedCareerPrice.individual, [0, 3, 1][index], formatCopy(copy.career.experienceKicker, { band: selectedCareerBand.label })),
    ),
    {
      ...packageFor("career-bundle", selectedCareerPrice.bundle, 4, formatCopy(copy.career.experienceKicker, { band: selectedCareerBand.label })),
      saving: formatCopy(copy.career.savingTemplate, {
        amount: money(Math.max(0, selectedCareerPrice.individual * 3 - selectedCareerPrice.bundle), copy.currencySymbol),
      }),
      featured: true,
    },
    packageFor("career-interview", pricing.career.interview, 2, copy.career.interviewKicker),
  ];

  const admissionsPrices = [pricing.admissions.clarity, pricing.admissions.precision, pricing.admissions.distinction];
  const admissionCards = (["admissions-clarity", "admissions-precision", "admissions-distinction"] as const)
    .map((rate, index) => packageFor(rate, admissionsPrices[index], 1, copy.admissions.kicker));
  const scholarshipCards = (["scholarships-clarity", "scholarships-precision", "scholarships-distinction"] as const)
    .map((rate, index) => packageFor(rate, scholarshipPrices[index], 0, effectiveEssayBand.label));
  const mbaPrices = [pricing.mba.essentials, pricing.mba.mastery, pricing.mba.fullRide];
  const mbaCards = (["mba-essentials", "mba-mastery", "mba-full-ride"] as const).map((rate, index) => {
    const total = Math.round(mbaPrices[index] * schoolCount * (1 - discount));
    const perSchool = Math.round(total / schoolCount);
    return {
      ...packageFor(rate, total, 3, paymentPlan === "single" ? copy.mba.singleKicker : copy.mba.instalmentsKicker),
      unit: formatCopy(copy.mba.totalUnitTemplate, { schools: String(schoolCount) }),
      unitDetail: formatCopy(copy.mba.perSchoolTemplate, { price: money(perSchool, copy.currencySymbol) }),
    };
  });
  const mbaDiscountText = discount ? formatCopy(copy.mba.discountApplied, { discount: String(Math.round(discount * 100)) }) : "";

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-8 scroll-mt-6 border-t border-brand-line py-7 pb-12 flex flex-col gap-5" id="service-pricing" aria-labelledby="service-pricing-title">
      <header className="mb-5 grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_minmax(15.625rem,.55fr)]">
        <div><Eyebrow className="mb-3 text-brand-eyebrow">{copy.page.eyebrow}</Eyebrow><h2 className="mb-0 whitespace-pre-line text-5xl" id="service-pricing-title">{copy.page.title}</h2></div>
        <p className="mb-1 max-w-sm text-sm text-brand-muted">{copy.page.description}</p>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-md border border-brand-sage bg-brand-sage p-1 md:grid-cols-4" role="group" aria-label="Choose a pricing category">
        {categories.map((item) => <button key={item.id} className="min-h-10 rounded px-2.5 py-2 text-sm font-bold text-brand-purple transition-colors hover:bg-white/70 aria-pressed:bg-white" type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}
      </div>

      {category === "career" && (
        <>
          <div className={pricingPanelClassName}>
            <label className={pricingLabelClassName} htmlFor="career-experience">Your total professional experience
              <select className={pricingFieldClassName} id="career-experience" value={careerBand} onChange={(event) => setCareerBand(event.target.value)}>
                {careerBands.map((band) => <option key={band.value} value={band.value}>{band.label}</option>)}
              </select>
            </label>
          </div>
          <p className="mb-2.5 min-h-5 text-sm text-brand-muted" role="status">
            {formatCopy(copy.career.experienceStatus, { band: selectedCareerBand.label })}
            {careerBand === "7-10" || careerBand === "10+" ? ` ${copy.career.exactTenNote}` : ""}
          </p>
          <div className={pricingCardsClassName}>{careerCards.map((item) => <PackageCard key={item.rate} {...item} service="career" copy={copy} extra={item.rate === "career-interview" ? {} : { band: careerBand }} />)}</div>
          <Facts facts={copy.career.facts} />
          <Terms title={copy.career.termsTitle}>
            {copy.career.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <CancellationRows copy={copy.cancellation} stages={copy.career.cancellationStages} />
          </Terms>
        </>
      )}

      {category === "admissions" && (
        <>
          <div className={`${pricingPanelClassName} min-h-14 text-sm text-brand-muted`}>{copy.admissions.intro}</div>
          <p className="mb-2.5 min-h-5 text-sm text-brand-muted">{copy.admissions.priceDescription}</p>
          <div className={pricingCardsClassName}>{admissionCards.map((item) => <PackageCard key={item.rate} {...item} service="admissions" copy={copy} />)}</div>
          <Facts facts={copy.admissions.facts} />
          <Terms title={copy.admissions.termsTitle}>
            {copy.admissions.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <CancellationRows copy={copy.cancellation} stages={copy.admissions.cancellationStages} />
          </Terms>
          <p className="my-2.5 text-sm text-brand-muted">{copy.admissions.note}</p>
        </>
      )}

      {category === "scholarships" && (
        <>
          <div className={pricingPanelClassName}>
            <label className={pricingLabelClassName} htmlFor="scholarship-essays">Number of essays
              <select className={pricingFieldClassName} id="scholarship-essays" value={essayBand} onChange={(event) => setEssayBand(event.target.value)}>
                {scholarshipBands.map((band) => <option key={band.value} value={band.value}>{band.label}</option>)}
              </select>
            </label>
            <label className="flex min-w-0 items-start gap-2.5 text-base font-normal">
              <input className="mt-0.5 size-4 accent-brand-orange" type="checkbox" checked={hasScholarshipAssessment} onChange={(event) => setHasScholarshipAssessment(event.target.checked)} />
              <span>{copy.scholarships.assessmentLabel}<small className="mt-1 block text-sm text-brand-muted">{copy.scholarships.assessmentHint}</small></span>
            </label>
          </div>
          <p className="mb-2.5 min-h-5 text-sm text-brand-muted" role="status">
            {hasScholarshipAssessment ? copy.scholarships.assessmentStatus : essayCustomQuote ? copy.scholarships.quoteStatus : formatCopy(copy.scholarships.bandStatus, { band: effectiveEssayBand.label })}
          </p>
          <div className={pricingCardsClassName}>
            {scholarshipCards.map((item, index) => <PackageCard key={item.rate} {...item} price={scholarshipPrices[index]} unit={essayCustomQuote ? copy.scholarships.customQuoteUnit : copy.scholarships.unit} service="scholarships" copy={copy} extra={{ essays: effectiveEssayBand.value, ...(hasScholarshipAssessment ? { assessment: "true" } : {}) }} />)}
          </div>
          <Facts facts={copy.scholarships.facts} />
          <Terms title={copy.scholarships.termsTitle}>
            {copy.scholarships.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <CancellationRows copy={copy.cancellation} stages={copy.scholarships.cancellationStages} />
          </Terms>
        </>
      )}

      {category === "mba" && (
        <>
          <div className={`${pricingPanelClassName} grid-cols-[minmax(9.375rem,.65fr)_minmax(12.5rem,.75fr)_minmax(12.5rem,1.4fr)] max-md:grid-cols-1`}>
            <label className={pricingLabelClassName} htmlFor="mba-schools">Number of schools
              <input className={pricingFieldClassName} id="mba-schools" type="number" min={3} value={schoolCountInput} onChange={(event) => setSchoolCountInput(event.target.value)} onBlur={() => setSchoolCountInput(String(schoolCount))} />
            </label>
            <label className={pricingLabelClassName} htmlFor="mba-payment">Payment plan
              <select className={pricingFieldClassName} id="mba-payment" value={paymentPlan} onChange={(event) => setPaymentPlan(event.target.value as "single" | "instalments")}>
                <option value="single">{copy.mba.paymentOptions.single}</option>
                <option value="instalments">{copy.mba.paymentOptions.instalments}</option>
              </select>
            </label>
            <p className="mb-0 text-sm text-brand-muted">{formatCopy(copy.mba.minimum, { five: String(pricing.mba.discountAtFive), ten: String(pricing.mba.discountAtTen) })}</p>
          </div>
          <p className="mb-2.5 min-h-5 text-sm text-brand-muted" role="status">
            {formatCopy(copy.mba.summary, {
              schools: String(schoolCount),
              payment: paymentPlan === "single" ? copy.mba.paymentOptions.single.toLowerCase() : copy.mba.paymentOptions.instalments.toLowerCase(),
              discount: mbaDiscountText,
            })}
          </p>
          <div className={pricingCardsClassName}>{mbaCards.map((item) => <PackageCard key={item.rate} {...item} service="mba" copy={copy} extra={mbaExtra} />)}</div>
          <Facts facts={copy.mba.facts} />
          <Terms title={copy.mba.termsTitle}>
            {copy.mba.paragraphs.map((paragraph, index) => <p key={paragraph}>{index === 0 ? formatCopy(paragraph, { five: String(pricing.mba.discountAtFive), ten: String(pricing.mba.discountAtTen) }) : paragraph}</p>)}
            <CancellationRows copy={copy.cancellation} stages={copy.mba.cancellationStages} />
          </Terms>
        </>
      )}

      <aside className="mt-4 flex items-center justify-between gap-5 rounded-md bg-brand-sage p-4 max-md:flex-col max-md:items-start">
        <div><h3 className="mb-1.5 font-display text-xl font-bold">{copy.callout.title}</h3><p className="mb-0 max-w-xl text-sm text-brand-muted">{copy.callout.description}</p></div>
        <div className="flex shrink-0 flex-wrap items-center gap-3.5">
          <Link href="/consultation?mode=call"><Button variant="brand">{copy.callout.primaryLink}</Button></Link>
          <Link className="text-base text-brand-purple font-bold underline" href="/consultation">{copy.callout.secondaryLink}</Link>
        </div>
      </aside>
    </section>
  );
}
