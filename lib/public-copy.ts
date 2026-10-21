export type HomeMarketingCopy = {
  hero: {
    eyebrow: string;
    title: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    buttons: { label: string; href: string }[];
    qualifier: string;
  };
  auditExample: {
    eyebrow: string;
    title: string;
    steps: { title: string; description: string }[];
    link: string;
    footer: string;
  };
  features: {
    eyebrow: string;
    title: string;
    cards: { number: string; title: string; body: string; href: string; link: string }[];
  };
  feedbackExample: {
    eyebrow: string;
    title: string;
    description: string;
    disclaimer: string;
    quoteLabel: string;
    quote: string;
    insightTitle: string;
    insightDescription: string;
    link: string;
  };
  testimonial: { eyebrow: string; title: string; link: string; empty: string };
  resources: { eyebrow: string; title: string; resourcesLink: string; blogLink: string };
  article: { eyebrow: string; readLink: string; browseLink: string };
  callout: { eyebrow: string; title: string; description: string; auditLink: string; consultationLink: string };
};

export type ServicesMarketingCopy = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    callLink: string;
    pricingLink: string;
    startingPointEyebrow: string;
    startingPointTitle: string;
    startingPoints: string[];
    note: string;
  };
  offers: { eyebrow: string; title: string; description: string; fallbackCategory: string; exploreLink: string };
  audit: {
    eyebrow: string;
    title: string;
    description: string;
    link: string;
    startingPointTitle: string;
    startingPoints: { title: string; description: string }[];
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: { eyebrow: string; title: string; description: string }[];
  };
  faq: { eyebrow: string; title: string; description: string; link: string };
  testimonial: { eyebrow: string; title: string; description: string; link: string };
};

export type PricingPackageCopy = {
  title: string;
  unit: string;
  description?: string;
  inclusions: string[];
};

export type PricingFact = { label: string; text: string };

export type ServicePricingCopy = {
  page: { eyebrow: string; title: string; description: string };
  currencySymbol: string;
  customQuote: string;
  requestQuote: string;
  enquirePrefix: string;
  packages: Record<string, PricingPackageCopy>;
  career: {
    experienceStatus: string;
    exactTenNote: string;
    experienceKicker: string;
    interviewKicker: string;
    savingTemplate: string;
    facts: PricingFact[];
    termsTitle: string;
    paragraphs: string[];
    cancellationStages: string[];
  };
  admissions: {
    intro: string;
    priceDescription: string;
    kicker: string;
    facts: PricingFact[];
    termsTitle: string;
    paragraphs: string[];
    cancellationStages: string[];
    note: string;
  };
  scholarships: {
    assessmentLabel: string;
    assessmentHint: string;
    assessmentStatus: string;
    quoteStatus: string;
    bandStatus: string;
    customQuoteUnit: string;
    unit: string;
    facts: PricingFact[];
    termsTitle: string;
    paragraphs: string[];
    cancellationStages: string[];
  };
  mba: {
    minimum: string;
    paymentOptions: { single: string; instalments: string };
    summary: string;
    discountApplied: string;
    totalUnitTemplate: string;
    perSchoolTemplate: string;
    singleKicker: string;
    instalmentsKicker: string;
    facts: PricingFact[];
    termsTitle: string;
    paragraphs: string[];
    cancellationStages: string[];
  };
  cancellation: { title: string; amounts: string[]; note: string };
  callout: { title: string; description: string; primaryLink: string; secondaryLink: string };
};

export type PublicCopyConfiguration = {
  home: HomeMarketingCopy;
  services: ServicesMarketingCopy;
  pricing: ServicePricingCopy;
  service_faqs: { question: string; answer: string }[];
};
