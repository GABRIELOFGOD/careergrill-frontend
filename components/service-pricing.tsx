"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Eyebrow } from "@/components/site-shell";
import { buttonVariants } from "@/components/ui/button";

type Category = "career" | "admissions" | "scholarships" | "mba";

type Package = {
  title: string;
  price: number | null;
  unit: string;
  description?: string;
  inclusions: string[];
  rate: string;
  offer: number;
};

const categories: { id: Category; label: string }[] = [
  { id: "career", label: "Career services" },
  { id: "admissions", label: "Admission essays" },
  { id: "scholarships", label: "Scholarship essays" },
  { id: "mba", label: "MBA applications" },
];

const careerBands = [
  { value: "0-3", label: "0–3 years", individual: 20000, bundle: 50000, saving: 10000 },
  { value: "4-6", label: "4–6 years", individual: 35000, bundle: 90000, saving: 15000 },
  { value: "7-10", label: "7–10 years", individual: 50000, bundle: 130000, saving: 20000 },
  { value: "10+", label: "10+ years", individual: 80000, bundle: 205000, saving: 35000 },
];

const scholarshipBands = [
  { value: "1-2", label: "1–2 essays", prices: [170000, 220000, 270000] },
  { value: "3-4", label: "3–4 essays", prices: [200000, 260000, 320000] },
  { value: "5-6", label: "5–6 essays", prices: [240000, 310000, 390000] },
  { value: "7+", label: "7 or more essays", prices: [null, null, null] },
];

const admissionsPackages: Package[] = [
  {
    title: "Clarity",
    price: 60000,
    unit: "per school",
    description: "You have a solid draft and want it sharpened.",
    inclusions: ["30-minute package consultation", "2 feedback rounds", "Basic CV review"],
    rate: "admissions-clarity",
    offer: 1,
  },
  {
    title: "Precision",
    price: 100000,
    unit: "per school",
    description: "Your drafts need work, along with your CV.",
    inclusions: ["45-minute package consultation", "4 feedback rounds", "Detailed CV review", "Proofreading"],
    rate: "admissions-precision",
    offer: 1,
  },
  {
    title: "Distinction",
    price: 150000,
    unit: "per school",
    description: "Support for several essays, formatting and priority review.",
    inclusions: ["60-minute package consultation", "6 feedback rounds", "Comprehensive CV review", "Proofreading", "Formatting to school requirements", "Priority support"],
    rate: "admissions-distinction",
    offer: 1,
  },
];

const scholarshipPackages = [
  {
    title: "Clarity",
    description: "Essay feedback, a CV review and a reference-letter review.",
    inclusions: ["45-minute package consultation", "2 feedback rounds", "Basic CV review", "1 reference letter review"],
    rate: "scholarships-clarity",
  },
  {
    title: "Precision",
    description: "More feedback rounds, a CV rewrite and proofreading.",
    inclusions: ["60-minute package consultation", "4 feedback rounds", "Detailed CV review", "2 reference letter reviews", "Proofreading"],
    rate: "scholarships-precision",
  },
  {
    title: "Distinction",
    description: "The most feedback rounds, with formatting and priority support.",
    inclusions: ["90-minute package consultation", "6 feedback rounds", "Comprehensive CV review", "3 reference letter reviews", "Proofreading", "Formatting", "Priority support"],
    rate: "scholarships-distinction",
  },
];

const mbaPackages = [
  {
    title: "Application Essentials",
    perSchool: 100000,
    description: "Review of solid drafts across your school list.",
    inclusions: ["2 hours of brainstorming", "2 essay rounds per school", "Essential CV review", "Support with 1 recommender letter", "Basic scholarship guidance"],
    rate: "mba-essentials",
  },
  {
    title: "Scholarship Mastery",
    perSchool: 150000,
    description: "Application support with a closer look at funding options.",
    inclusions: ["2 hours of brainstorming", "4 essay rounds per school", "Strategic CV review", "Support with 2 recommender letters", "Comprehensive scholarship guidance", "Strategy call"],
    rate: "mba-mastery",
  },
  {
    title: "Full-Ride Pro",
    perSchool: 180000,
    description: "Essay, CV, recommender and scholarship-essay support.",
    inclusions: ["4 hours of brainstorming", "6 essay rounds per school", "Comprehensive CV review", "Support with 3 recommender letters", "Full scholarship guidance, including scholarship essays", "Strategy call"],
    rate: "mba-full-ride",
  },
];

const money = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

const pricingPanelClassName = "mb-3 flex min-h-20 items-center gap-5 rounded-md border border-brand-sage bg-brand-blue p-3.5 max-md:flex-col max-md:items-stretch";
const pricingLabelClassName = "grid min-w-60 gap-2 text-sm font-bold text-brand-ink";
const pricingFieldClassName = "min-h-10 w-full max-w-64 rounded border border-brand-sage bg-white px-2.5 py-1.5 text-base text-brand-ink max-md:max-w-none";
const pricingCardsClassName = "grid grid-cols-1 gap-3 md:grid-cols-2 min-[1051px]:grid-cols-3";
const pricingFactsClassName = "my-3 grid gap-4 border-y border-brand-line py-3 md:grid-cols-3 [&>p]:mb-0 [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-brand-muted [&>p>strong]:text-brand-ink";

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
}: Package & {
  service: Category;
  extra?: Record<string, string>;
  kicker: string;
  saving?: string;
  unitDetail?: string;
  featured?: boolean;
}) {
  return (
    <article className={`flex min-w-0 min-h-[18.75rem] flex-col rounded-md border p-4 ${featured ? "border-brand-orange bg-[#fffaf2]" : "border-brand-sage bg-white"}`}>
      <p className="mb-3.5 min-h-4 text-sm font-bold leading-snug text-brand-eyebrow">{kicker}</p>
      <h3 className="mb-3.5 min-h-7 font-display text-xl font-bold tracking-tight">{title}</h3>
      <p className="mb-0 font-display text-3xl font-extrabold leading-tight tracking-tight">{price === null ? "Custom quote" : money(price)}</p>
      <p className="mb-3 mt-0.5 text-sm text-brand-muted">{unit}</p>
      {unitDetail && <p className="-mt-2.5 mb-2.5 text-sm text-brand-muted">{unitDetail}</p>}
      {saving && <p className="mb-3 rounded bg-amber-50 px-2 py-2 text-sm text-amber-950">{saving}</p>}
      {description && <p className="mb-2.5 min-h-8 text-sm leading-relaxed text-brand-muted">{description}</p>}
      <ul className="mb-3.5 mt-2 list-disc pl-4 text-sm leading-relaxed text-brand-ink [&>li+li]:mt-1.5">{inclusions.map((item) => <li key={item}>{item}</li>)}</ul>
      <Link className={`${buttonVariants({ variant: "outline", size: "sm" })} mt-auto w-full whitespace-normal text-center`} href={enquiryHref(rate, service, offer, extra)}>
        {price === null ? "Request a quote" : `Enquire about ${title}`}
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

export default function ServicePricing() {
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

  const selectedCareerBand = careerBands.find((band) => band.value === careerBand) ?? careerBands[0];
  const selectedEssayBand = scholarshipBands.find((band) => band.value === essayBand) ?? scholarshipBands[0];
  const effectiveEssayBand = hasScholarshipAssessment ? scholarshipBands[2] : selectedEssayBand;
  const essayCustomQuote = effectiveEssayBand.value === "7+";
  const parsedSchoolCount = Number(schoolCountInput);
  const schoolCount = Number.isFinite(parsedSchoolCount) && parsedSchoolCount >= 3 ? Math.floor(parsedSchoolCount) : 3;
  const discount = paymentPlan === "single" ? schoolCount >= 10 ? 0.1 : schoolCount >= 5 ? 0.05 : 0 : 0;
  const mbaExtra = { schools: String(schoolCount), payment: paymentPlan === "single" ? "single" : "instalments" };

  const careerCards: (Package & { saving?: string; featured?: boolean })[] = [
    ...[
      { title: "CV / résumé", rate: "career-cv", offer: 0 },
      { title: "Cover letter", rate: "career-cover-letter", offer: 3 },
      { title: "LinkedIn profile", rate: "career-linkedin", offer: 1 },
    ].map((item) => ({
      ...item,
      price: selectedCareerBand.individual,
      unit: "per person",
      inclusions: ["First draft within 72 hours of receiving materials", "2 revision rounds within one week of the draft"],
    })),
    {
      title: "CV + cover letter + LinkedIn",
      rate: "career-bundle",
      offer: 4,
      price: selectedCareerBand.bundle,
      unit: "per person",
      saving: `Save ${money(selectedCareerBand.saving)} compared with booking separately`,
      inclusions: ["CV / résumé", "Cover letter", "LinkedIn profile", "First draft within 72 hours of receiving materials", "2 revision rounds within one week of the draft"],
      featured: true,
    },
    {
      title: "Interview preparation",
      rate: "career-interview",
      offer: 2,
      price: 50000,
      unit: "for two coaching sessions",
      inclusions: ["Two coaching sessions", "Role-specific preparation and feedback"],
    },
  ];

  return (
    <section className="content-wrap scroll-mt-6 border-t border-brand-line py-7 pb-12" id="service-pricing" aria-labelledby="service-pricing-title">
      <header className="mb-5 grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_minmax(15.625rem,.55fr)]">
        <div><Eyebrow className="mb-3 text-brand-eyebrow">Pricing</Eyebrow><h2 className="mb-0 text-4xl leading-tight" id="service-pricing-title">Know what’s included.<br />Choose your support.</h2></div>
        <p className="mb-1 max-w-sm text-sm text-brand-muted">All prices are in Nigerian Naira. Choose a service to see its fees, inclusions and terms.</p>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-md border border-brand-sage bg-brand-sage p-1 md:grid-cols-4" role="group" aria-label="Choose a pricing category">
        {categories.map((item) => (
          <button
            key={item.id}
            className="min-h-10 rounded px-2.5 py-2 text-sm font-bold text-brand-purple transition-colors hover:bg-white/70 aria-pressed:border aria-pressed:border-brand-line aria-pressed:bg-white aria-pressed:ring-2 aria-pressed:ring-brand-orange"
            type="button"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
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
          <p className="mb-2.5 min-h-5 text-sm text-brand-muted" role="status">Prices for {selectedCareerBand.label} of experience. Interview coaching has one flat rate.{careerBand === "7-10" || careerBand === "10+" ? " Exactly 10 years? Confirm your band before payment." : ""}</p>
          <div className={pricingCardsClassName}>
            {careerCards.map((item) => (
              <PackageCard key={item.rate} {...item} service="career" extra={item.rate === "career-interview" ? {} : { band: careerBand }} kicker={item.rate === "career-interview" ? "One flat rate at every experience level" : `${selectedCareerBand.label} of professional experience`} />
            ))}
          </div>
          <div className={pricingFactsClassName}>
            <p><strong>Delivery:</strong> first document draft within 72 hours of receiving your materials.</p>
            <p><strong>Revisions:</strong> two rounds, used within one week of receiving the draft. Requests after that week are new work and priced separately.</p>
            <p><strong>Payment:</strong> full payment before work begins. Prices are per person, not per job application.</p>
          </div>
          <Terms title="Process, experience bands and cancellation">
            <p>Use your total years of professional experience, not time in your current role. The supplied bands overlap at exactly 10 years; confirm your band with us before paying.</p>
            <p>Choose your service, confirm your slot, send your CV and target roles, then discuss your experience on a call. Confirm cancellation terms before payment.</p>
            <CancellationRows stages={["Before your package consultation", "After the package consultation, before feedback begins", "After the first round of feedback is delivered"]} />
          </Terms>
        </>
      )}

      {category === "admissions" && (
        <>
          <div className={`${pricingPanelClassName} min-h-14 text-sm text-brand-muted`}>Each package covers one school and all essays it requires. Choose the level of feedback you need.</div>
          <p className="mb-2.5 min-h-5 text-sm text-brand-muted">Prices are per school, including all required essays.</p>
          <div className={pricingCardsClassName}>
            {admissionsPackages.map((item) => <PackageCard key={item.rate} {...item} service="admissions" kicker="All required essays for one school" />)}
          </div>
          <div className={pricingFactsClassName}>
            <p><strong>Coverage:</strong> one application to one school, including its personal statement, statement of purpose and supplementary essays.</p>
            <p><strong>Timeline:</strong> six weeks from receipt of complete materials. Book at least eight weeks before your earliest deadline; ask about a shorter timeline before paying.</p>
            <p><strong>Payment:</strong> full payment before work begins. Each school is priced separately; ask about a bundle for several schools.</p>
          </div>
          <Terms title="Feedback, CV reviews and cancellation">
            <p>A feedback round returns your revised draft with tracked changes, comments and a written summary of what to work on next. Feedback is returned within 24–48 business hours, Monday–Friday, 9am–5pm WAT.</p>
            <p>Priority support puts your submissions ahead of the queue, aiming for 24 hours rather than 48. It does not add weekend or after-hours availability.</p>
            <p><strong>Basic CV review:</strong> written recommendations on structure, formatting and gaps. <strong>Detailed:</strong> a CV rewrite with changes marked up. <strong>Comprehensive:</strong> that rewrite plus a note on how the CV supports your essays.</p>
            <CancellationRows stages={["Before your package consultation", "After the package consultation, before feedback begins", "After the first round of feedback is delivered"]} />
          </Terms>
          <p className="my-2.5 text-sm text-brand-muted">For master’s, professional programmes, law school and other graduate admissions. PhD and MBA applications use separate pricing. Ask us about PhD support or a custom package.</p>
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
              <span>My scholarship has interviews or an assessment stage<small className="mt-1 block text-sm text-brand-muted">Uses the 5–6 essay band regardless of essay count.</small></span>
            </label>
          </div>
          <p className="mb-2.5 min-h-5 text-sm text-brand-muted" role="status">{hasScholarshipAssessment ? "Prices use the 5–6 essay band for one scholarship." : essayCustomQuote ? "Send your essay list for a quote before payment." : `Prices cover ${effectiveEssayBand.label} for one scholarship.`}</p>
          <div className={pricingCardsClassName}>
            {scholarshipPackages.map((item, index) => (
              <PackageCard key={item.rate} title={item.title} price={effectiveEssayBand.prices[index]} unit={essayCustomQuote ? "For 7 or more essays" : "per scholarship"} description={item.description} inclusions={item.inclusions} rate={item.rate} offer={0} service="scholarships" extra={{ essays: effectiveEssayBand.value }} kicker={effectiveEssayBand.label} />
            ))}
          </div>
          <div className={pricingFactsClassName}>
            <p><strong>Coverage:</strong> one price covers all essays in the selected band for one scholarship.</p>
            <p><strong>Timeline:</strong> six weeks from receipt of complete materials. Book at least eight weeks before your deadline, or ask about a shorter timeline before paying.</p>
            <p><strong>Payment:</strong> full payment before work begins. Each scholarship is a separate engagement; ask about bundles for more than one.</p>
          </div>
          <Terms title="Essay counting, feedback and cancellation">
            <p>Each prompt asking for more than 200 words counts as an essay. Shorter answers are grouped as one. Send the application link if you’re unsure; we’ll confirm your band in writing before payment, at no charge.</p>
            <p>Applications with interviews or assessment stages, including Rhodes, Gates Cambridge and Fulbright, use the 5–6 essay band regardless of essay count.</p>
            <p>A feedback round returns your revised draft with tracked changes, comments and a written summary of what to work on next. Feedback is returned within 24–48 business hours, Monday–Friday, 9am–5pm WAT.</p>
            <p>Submitting several scholarship essays together counts as one feedback round. Reference-letter review checks a referee’s draft against the scholarship criteria and your essay narrative.</p>
            <CancellationRows stages={["Before your package consultation", "After the package consultation, before feedback begins", "After the first round of feedback is delivered"]} />
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
                <option value="single">One-time payment</option>
                <option value="instalments">Two instalments (no volume discount)</option>
              </select>
            </label>
            <p className="mb-0 text-sm text-brand-muted">Minimum three schools. One-time payment: 5% off from five schools; 10% off from ten.</p>
          </div>
          <p className="mb-2.5 min-h-5 text-sm text-brand-muted" role="status">Totals for {schoolCount} schools · {paymentPlan === "single" ? "one-time payment" : "two instalments"}{discount ? ` · ${Math.round(discount * 100)}% volume discount applied` : ""}.</p>
          <div className={pricingCardsClassName}>
            {mbaPackages.map((item) => {
              const total = Math.round(item.perSchool * schoolCount * (1 - discount));
              const perSchool = Math.round(total / schoolCount);
              return <PackageCard key={item.rate} title={item.title} price={total} unit={`for ${schoolCount} schools`} unitDetail={`${money(perSchool)} per school`} description={item.description} inclusions={item.inclusions} rate={item.rate} offer={3} service="mba" extra={mbaExtra} kicker={paymentPlan === "single" ? "One-time payment" : "Two instalments"} />;
            })}
          </div>
          <div className={pricingFactsClassName}>
            <p><strong>Minimum:</strong> every MBA engagement covers at least three schools. Essay rounds are counted per school.</p>
            <p><strong>Timeline:</strong> eight weeks from receipt of complete materials. Delays in sending drafts move the finish date back.</p>
            <p><strong>Payment:</strong> full payment or the first instalment before work begins. Two instalments are available without a volume discount; instalment amounts and dates are confirmed before payment.</p>
          </div>
          <Terms title="Volume discounts, package terms and cancellation">
            <p>One-time payment receives 5% off from five schools, or 10% off from ten. These discounts do not apply to the two-instalment plan.</p>
            <p>Brainstorming happens before drafting. Essay rounds return tracked changes, comments and a written summary. The strategy call covers school selection and positioning across your list.</p>
            <p><strong>Scholarship guidance:</strong> Basic identifies school funding. Comprehensive adds eligibility screening and deadline mapping. Full also includes work on scholarship essays.</p>
            <p>Confirm the scope of CV and recommender-letter work when choosing your package. Schools and scholarship providers make admission and funding decisions.</p>
            <CancellationRows stages={["Before your first brainstorming session", "After brainstorming, before essay feedback begins", "After the first round of essay feedback is delivered"]} />
          </Terms>
        </>
      )}

      <aside className="mt-4 flex items-center justify-between gap-5 rounded-md bg-brand-sage p-4 max-md:flex-col max-md:items-start">
        <div><h3 className="mb-1.5 font-display text-xl font-bold">Not sure which option fits?</h3><p className="mb-0 max-w-xl text-sm text-brand-muted">The initial 15-minute discovery call is free. We’ll confirm your package, timeline and what to send before you pay.</p></div>
        <div className="flex shrink-0 flex-wrap items-center gap-3.5">
          <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/consultation?mode=call">Book a free 15-minute call</Link>
          <Link className="text-sm font-semibold text-brand-purple hover:underline" href="/consultation">Ask about a custom package</Link>
        </div>
      </aside>
    </section>
  );
}

function CancellationRows({ stages }: { stages: string[] }) {
  return (
    <>
      <h3 className="mb-1 mt-3 border-t border-brand-line pt-2.5 font-display text-base font-bold">Cancellation and refunds</h3>
      <div className="flex justify-between gap-4 border-b border-brand-line py-2 text-sm"><span>{stages[0]}</span><strong className="whitespace-nowrap text-brand-purple">Full refund</strong></div>
      <div className="flex justify-between gap-4 border-b border-brand-line py-2 text-sm"><span>{stages[1]}</span><strong className="whitespace-nowrap text-brand-purple">50% refund</strong></div>
      <div className="flex justify-between gap-4 border-b border-brand-line py-2 text-sm"><span>{stages[2]}</span><strong className="whitespace-nowrap text-brand-purple">No refund</strong></div>
      <p>Refunds return to the original payment method within 5–10 business days.</p>
    </>
  );
}
