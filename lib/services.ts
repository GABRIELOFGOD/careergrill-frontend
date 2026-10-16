export interface ServiceOffer {
  title: string;
  audience: string;
  bullets: string[];
  callToAction: string;
  href: string;
}

export interface ServicePageData {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  overviewTitle: string;
  overviewText: string;
  overviewBullets: string[];
  offers: ServiceOffer[];
  noteTitle: string;
  note: string;
}

export const servicePages: ServicePageData[] = [
  {
    slug: "graduate-applications",
    category: "Graduate admissions, scholarships & fellowships",
    title: "Plan your application or improve your statement.",
    excerpt: "From choosing a direction to revising your statement, get support for the decisions and documents that need attention.",
    overviewTitle: "Admissions, scholarships and fellowships",
    overviewText: "Connect your preparation to the opportunity and develop an application that answers its actual questions.",
    overviewBullets: ["Career Audit and application planning", "SOP, personal statement and motivation letter review", "Programme fit, funding and deadline discussion"],
    offers: [
      {
        title: "AI Career Audit",
        audience: "For applicants who need to understand their starting point.",
        bullets: ["Goals and experience review", "Preparation gaps and unanswered questions", "A prioritised action plan"],
        callToAction: "Start an AI Career Audit",
        href: "/career-audit",
      },
      {
        title: "Statement review",
        audience: "For applicants who already have a draft.",
        bullets: ["Feedback on structure, evidence and programme fit", "Editorial guidance that preserves your voice", "Comments on the application prompt and claims in your draft"],
        callToAction: "Discuss a review",
        href: "/consultation",
      },
      {
        title: "Application strategy",
        audience: "For applicants needing support across the process.",
        bullets: ["Programme and funding shortlist discussion", "Document and deadline planning", "Application support agreed around your needs"],
        callToAction: "Discuss your application",
        href: "/consultation",
      },
    ],
    noteTitle: "A review starts with your draft and the official instructions.",
    note: "Share the application question, word limit and target opportunity so we can discuss the feedback you need. Programme selection and scholarship eligibility require a separate check against current official sources.",
  },
  {
    slug: "career-documents",
    category: "Career documents & interview support",
    title: "CV, LinkedIn and interview support.",
    excerpt: "Explain the work you have done, the evidence behind it and its relevance to the roles you want.",
    overviewTitle: "CVs, LinkedIn and interviews",
    overviewText: "Make your contribution easier to understand and show how it relates to the roles you want.",
    overviewBullets: ["CV review and rewriting", "LinkedIn headline, About and experience sections", "Interview practice with feedback on your examples"],
    offers: [
      {
        title: "CV review & rewrite",
        audience: "For professionals whose CV does not reflect their experience.",
        bullets: ["Target-role discussion", "Achievement and evidence development", "Editable document delivery"],
        callToAction: "Discuss your CV",
        href: "/consultation",
      },
      {
        title: "LinkedIn support",
        audience: "For professionals refining their public profile.",
        bullets: ["Headline and About section review", "Experience and relevant language", "Guidance on profile consistency"],
        callToAction: "Discuss your profile",
        href: "/consultation",
      },
      {
        title: "Interview preparation",
        audience: "For candidates preparing for a particular role.",
        bullets: ["Role and employer context", "Mock interview and feedback", "Specific feedback on your examples"],
        callToAction: "Discuss interview support",
        href: "/consultation",
      },
    ],
    noteTitle: "Start with an AI job audit.",
    note: "Assess your target roles, experience evidence and job search approach. Human CV, LinkedIn and interview support can be arranged separately after a free 15-minute consultation.",
  },
  {
    slug: "mba-applications",
    category: "MBA applications",
    title: "Connect your experience to your MBA goals.",
    excerpt: "Build a coherent case for your next career step, the programme you choose and what you bring to the classroom.",
    overviewTitle: "A clear case for business school",
    overviewText: "Explain your career direction, leadership experience and reasons for choosing an MBA.",
    overviewBullets: ["School fit and application strategy", "Essay development and review", "MBA interview preparation"],
    offers: [
      {
        title: "Application direction",
        audience: "For candidates deciding where and how to apply.",
        bullets: ["Career goal discussion", "School fit and application planning", "Profile strengths and gaps"],
        callToAction: "Discuss your strategy",
        href: "/consultation",
      },
      {
        title: "Essay development & review",
        audience: "For applicants working on MBA essay questions.",
        bullets: ["Leadership and impact examples", "Essay structure and specific evidence", "Feedback that protects your own voice"],
        callToAction: "Discuss your essays",
        href: "/consultation",
      },
      {
        title: "MBA interview preparation",
        audience: "For candidates invited to an admissions interview.",
        bullets: ["School fit and application context", "Mock interview and feedback", "Clearer examples and answers"],
        callToAction: "Discuss preparation",
        href: "/consultation",
      },
    ],
    noteTitle: "Start with an honest look at your profile.",
    note: "We consider your academic preparation, experience and career plans together. Support cannot promise admission or replace a programme’s tests and eligibility requirements.",
  },
];

export const serviceFaqs = [
  {
    question: "I’m not sure which service I need.",
    answer: "Start with the AI Career Audit for job search or study applications. If you want to talk through your options, book a free 15-minute consultation.",
  },
  {
    question: "Can you review a draft I have written?",
    answer: "Yes. Share your draft, the official application prompt, word limit, opportunity link and deadline. We can then discuss the feedback your draft needs and agree the scope.",
  },
  {
    question: "How much will the support cost?",
    answer: "The fee depends on the service and agreed scope. Confirm what is included, the number of review rounds, the fee and delivery date before committing.",
  },
  {
    question: "Does support guarantee a job, admission or funding?",
    answer: "No. Careergrill can help you assess your preparation and develop clearer applications. Employers, universities and scholarship providers make their own decisions.",
  },
];
