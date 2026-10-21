import type { ServicePricingConfig } from "@/lib/service-pricing";

export type ConsultationServiceKey =
  | "help"
  | "statement"
  | "applicationStrategy"
  | "cv"
  | "linkedin"
  | "interview"
  | "coverLetter"
  | "careerBundle"
  | "scholarshipEssay"
  | "mbaDirection"
  | "mbaEssay"
  | "mbaInterview"
  | "mbaPackage";

export interface ConsultationService {
  name: string;
  dropdownLabel?: string;
  goalLabel: string;
  goalPlaceholder: string;
  stages: string[];
  deadlineLabel: string;
  support: string[];
  checklist: string[];
  closing: string;
}

export type ConsultationServices = Record<ConsultationServiceKey, ConsultationService>;

export function consultationDropdownServices(services: ConsultationServices) {
  return Object.entries(services)
    .filter(([, service]) => service.dropdownLabel)
    .map(([key, service]) => ({ key: key as ConsultationServiceKey, label: service.dropdownLabel! }));
}

export type PricingSelection = {
  category: "career" | "admissions" | "scholarships" | "mba";
  rate: string;
  band?: "0-3" | "4-6" | "7-10" | "10+";
  essays?: "1-2" | "3-4" | "5-6" | "7+";
  assessment: boolean;
  schools: number;
  payment: "single" | "instalments";
};

export type PricingSummary = {
  service: ConsultationServiceKey;
  name: string;
  price: number | null;
  unit: string;
  context: string;
  discount?: number;
  message: string;
};

const rates: Record<string, { category: PricingSelection["category"]; name: string; service: ConsultationServiceKey }> = {
  "career-cv": { category: "career", name: "CV / résumé", service: "cv" },
  "career-cover-letter": { category: "career", name: "Cover letter", service: "coverLetter" },
  "career-linkedin": { category: "career", name: "LinkedIn profile", service: "linkedin" },
  "career-bundle": { category: "career", name: "CV + cover letter + LinkedIn", service: "careerBundle" },
  "career-interview": { category: "career", name: "Interview preparation", service: "interview" },
  "admissions-clarity": { category: "admissions", name: "Clarity", service: "statement" },
  "admissions-precision": { category: "admissions", name: "Precision", service: "statement" },
  "admissions-distinction": { category: "admissions", name: "Distinction", service: "statement" },
  "scholarships-clarity": { category: "scholarships", name: "Clarity", service: "scholarshipEssay" },
  "scholarships-precision": { category: "scholarships", name: "Precision", service: "scholarshipEssay" },
  "scholarships-distinction": { category: "scholarships", name: "Distinction", service: "scholarshipEssay" },
  "mba-essentials": { category: "mba", name: "Application Essentials", service: "mbaPackage" },
  "mba-mastery": { category: "mba", name: "Scholarship Mastery", service: "mbaPackage" },
  "mba-full-ride": { category: "mba", name: "Full-Ride Pro", service: "mbaPackage" },
};

export function parsePricingSelection(params: URLSearchParams): PricingSelection | null {
  const rate = params.get("rate");
  if (!rate || !rates[rate]) return null;
  const definition = rates[rate];
  if (params.get("service") !== definition.category) return null;

  const bandValue = params.get("band");
  const essayValue = params.get("essays");
  const band = bandValue && ["0-3", "4-6", "7-10", "10+"].includes(bandValue)
    ? bandValue as PricingSelection["band"]
    : undefined;
  const essays = essayValue && ["1-2", "3-4", "5-6", "7+"].includes(essayValue)
    ? essayValue as PricingSelection["essays"]
    : undefined;
  const parsedSchools = Number(params.get("schools"));

  return {
    category: definition.category,
    rate,
    ...(band ? { band } : {}),
    ...(essays ? { essays } : {}),
    assessment: params.get("assessment") === "true",
    schools: Number.isFinite(parsedSchools) && parsedSchools >= 3 ? Math.floor(parsedSchools) : 3,
    payment: params.get("payment") === "instalments" ? "instalments" : "single",
  };
}

export function initialDropdownService(selection: PricingSelection | null, services: ConsultationServices): ConsultationServiceKey {
  if (!selection) return "help";
  const service = rates[selection.rate].service;
  return services[service].dropdownLabel ? service : "help";
}

export function createPricingSummary(selection: PricingSelection | null, pricing: ServicePricingConfig): PricingSummary | null {
  if (!selection) return null;
  const definition = rates[selection.rate];
  let price: number | null;
  let unit: string;
  let context: string;
  let discount: number | undefined;
  let message: string;

  if (selection.category === "admissions") {
    const key = selection.rate.slice("admissions-".length) as keyof ServicePricingConfig["admissions"];
    price = pricing.admissions[key];
    unit = "per school";
    context = "All required essays for one school";
    message = `I’m considering the ${definition.name} admission essay package at ${money(price)} for one school.`;
  } else if (selection.category === "career") {
    if (selection.rate === "career-interview") {
      price = pricing.career.interview;
      unit = "for two coaching sessions";
      context = "One flat rate at every experience level";
      message = `I’m interested in the two-session interview preparation service at ${money(price)}.`;
    } else {
      const band = selection.band ?? "0-3";
      const bandLabels = { "0-3": "0–3 years", "4-6": "4–6 years", "7-10": "7–10 years", "10+": "10+ years" };
      const values = pricing.career.bands[band];
      price = selection.rate === "career-bundle" ? values.bundle : values.individual;
      unit = "per person";
      context = `${bandLabels[band]} of professional experience`;
      const experience = bandLabels[band].replace(" years", "");
      message = `My experience falls in the ${experience} year band. I’m interested in ${definition.name} at ${money(price)} per person.`;
    }
  } else if (selection.category === "scholarships") {
    const essayBand = selection.assessment ? "5-6" : selection.essays ?? "1-2";
    const packageIndex = ["scholarships-clarity", "scholarships-precision", "scholarships-distinction"].indexOf(selection.rate);
    price = pricing.scholarships[essayBand][packageIndex];
    unit = essayBand === "7+" ? "For 7 or more essays" : "per scholarship";
    context = selection.assessment ? "5–6 essays · assessment-stage pricing" : essayBand === "7+" ? "7 or more essays" : `${essayBand.replace("-", "–")} essays`;
    message = essayBand === "7+"
      ? `I’m considering the ${definition.name} scholarship package. The application has 7 or more essays. Could you confirm a quote for my essay list?`
      : selection.assessment
        ? `I’m considering the ${definition.name} scholarship package. My application includes an interview or assessment stage, so the 5–6 essay pricing band applies. The listed fee is ${money(price!)} for one scholarship.`
        : `I’m considering the ${definition.name} scholarship package. The application has ${essayBand.replace("-", "–")} essays. The listed fee is ${money(price!)} for one scholarship.`;
  } else {
    const key = selection.rate === "mba-essentials" ? "essentials" : selection.rate === "mba-mastery" ? "mastery" : "fullRide";
    const base = pricing.mba[key];
    const rate = selection.payment === "single"
      ? selection.schools >= 10 ? pricing.mba.discountAtTen : selection.schools >= 5 ? pricing.mba.discountAtFive : 0
      : 0;
    discount = rate || undefined;
    price = Math.round(base * selection.schools * (1 - rate / 100));
    unit = `for ${selection.schools} schools`;
    context = selection.payment === "single" ? "One-time payment" : "Two-instalment plan";
    message = selection.payment === "instalments"
      ? `I’m considering ${definition.name} for ${selection.schools} schools, with the two-instalment plan. The calculated total is ${money(price)}.`
      : discount
        ? `I’m considering ${definition.name} for ${selection.schools} schools, with a one-time payment. The calculated total is ${money(price)}, including the ${discount}% volume discount.`
        : `I’m considering ${definition.name} for ${selection.schools} schools, with a one-time payment. The calculated total is ${money(price)}.`;
  }

  return { service: definition.service, name: definition.name, price, unit, context, discount, message };
}

export function buildConsultationMessage(input: {
  service: ConsultationServiceKey;
  goal: string;
  stage: string;
  deadline: string;
  details: string;
  packageSummary: PricingSummary | null;
  services: ConsultationServices;
}) {
  const service = input.services[input.service];
  const goal = input.goal.trim();
  const stage = input.stage;
  let opening: string;
  switch (input.service) {
    case "statement":
      opening = goal ? stage === "I’m starting from scratch" ? `I’d like guidance on developing a statement for ${goal}.` : `I’d like feedback on my statement for ${goal}.` : "I’d like guidance with my statement.";
      break;
    case "cv":
      opening = goal ? stage === "I’m starting from scratch" ? `I’d like help putting together my CV for ${goal}.` : `I’d like help improving my CV for ${goal}.` : "I’d like help with my CV.";
      break;
    case "coverLetter":
      opening = goal ? `I’d like help with my cover letter for ${goal}.` : "I’d like help with my cover letter.";
      break;
    case "careerBundle":
      opening = goal ? `I’d like help with my CV, cover letter and LinkedIn profile. I’m targeting ${goal}.` : "I’d like help with my CV, cover letter and LinkedIn profile.";
      break;
    case "linkedin":
      opening = goal ? `I’d like help improving my LinkedIn profile. I’m focusing on ${goal}.` : "I’d like help improving my LinkedIn profile.";
      break;
    case "scholarshipEssay":
      opening = goal ? `I’d like feedback on my scholarship essays for ${goal}.` : "I’d like feedback on my scholarship essays.";
      break;
    case "mbaPackage":
      opening = goal ? `I’d like support with my MBA applications to ${goal}.` : "I’d like support with my MBA applications.";
      break;
    case "interview":
      opening = goal
        ? stage === "I have an interview invitation" ? `I’ve been invited to interview for ${goal} and would like help preparing.` : `I’d like help with interview preparation for ${goal}.`
        : stage === "I have an interview invitation" ? "I’ve been invited to interview and would like help preparing." : "I’d like help with interview preparation.";
      break;
    case "mbaInterview":
      opening = goal
        ? stage === "I have an interview invitation" ? `I’ve been invited to interview for ${goal} and would like help preparing.` : `I’d like help with MBA interview preparation for ${goal}.`
        : stage === "I have an interview invitation" ? "I’ve been invited to interview and would like help preparing." : "I’d like help with MBA interview preparation.";
      break;
    case "mbaEssay":
      opening = goal
        ? stage === "I’m starting from scratch" || stage === "I have notes or an outline" ? `I’d like help developing my MBA essays for ${goal}.` : stage ? `I’d like help reviewing my MBA essays for ${goal}.` : `I’d like help with my MBA essays for ${goal}.`
        : stage === "I’m starting from scratch" || stage === "I have notes or an outline" ? "I’d like help developing my MBA essays." : stage ? "I’d like help reviewing my MBA essays." : "I’d like help with my MBA essays.";
      break;
    case "applicationStrategy":
      opening = goal ? `I’d like help planning an application for ${goal}.` : "I’d like help planning an application.";
      break;
    case "mbaDirection":
      opening = goal ? `I’d like help planning my MBA application for ${goal}.` : "I’d like help planning my MBA application.";
      break;
    default:
      opening = goal ? `I’d like help deciding on the right support. My goal is ${goal}.` : "I’d like help deciding on the right support.";
  }

  const lines = [opening];
  if (stage) {
    const stageSentences: Record<string, string> = {
      "I’m starting from scratch": "I’m starting from scratch.",
      "I have notes or an outline": "I have notes or an outline to work from.",
      "I have a draft": "I have a draft I can share.",
      "I need a final check": "I have a draft and would like a final check before using it.",
      "I’m exploring my options": "I’m still exploring my options.",
      "I have a shortlist": "I have a shortlist and would like help deciding where to focus.",
      "I have chosen an opportunity": "I have chosen an opportunity and want to plan the application.",
      "I want to practise before applying": "I’d like to practise before I start interviewing.",
      "I’ve started preparing for an interview": "I’ve started preparing and would like to practise with feedback.",
      "I’m starting an application": "I’m starting an application.",
      "I have an interview invitation": "I have an interview invitation.",
    };
    const sentence = stageSentences[stage];
    if (sentence && !(["interview", "mbaInterview"].includes(input.service) && stage === "I have an interview invitation")) {
      const effectiveSentence = input.service === "linkedin" && stage === "I have a draft"
        ? "I have some draft profile text I can share."
        : sentence;
      lines.push(effectiveSentence);
    }
  }
  if (input.deadline) {
    const date = new Date(`${input.deadline}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const sentence = ["interview", "mbaInterview"].includes(input.service)
      ? `The interview is on ${date}.`
      : ["cv", "linkedin", "coverLetter", "careerBundle"].includes(input.service)
        ? `I’d like to have this ready by ${date}.`
        : input.service === "help"
          ? `I’m working towards ${date}.`
          : `The application deadline is ${date}.`;
    lines.push(sentence);
  }

  const sections = [
    "Hello Careergrill,",
    lines.join(" "),
    input.packageSummary?.message,
    input.details.trim() || undefined,
    input.packageSummary
      ? "Could you confirm the package fit, availability and what I should send before payment?"
      : service.closing,
    "Thank you.",
  ].filter((part): part is string => Boolean(part));
  return sections.join("\n\n");
}

function money(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}
