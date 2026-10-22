import type { HomeMarketingCopy, ServicesMarketingCopy } from "./public-copy";

export const homeMarketingCopy: HomeMarketingCopy = {
  hero: {
    eyebrow: "Jobs, scholarships & application support",
    title: "Find opportunities.",
    titleLead: "Prepare a stronger",
    titleAccent: "application.",
    description: "Explore jobs and scholarships. Get AI feedback on your preparation, or speak to Careergrill about support with your CV, essays or interviews.",
    buttons: [
      { label: "Find jobs", href: "/jobs" },
      { label: "Find scholarships", href: "/scholarships" },
      { label: "Ask about a document review", href: "/consultation" },
    ],
    qualifier: "For your job search, study, scholarship or fellowship application.",
  },
  auditExample: {
    eyebrow: "Your application direction",
    title: "What your AI audit covers.",
    steps: [
      { title: "What you can build on", description: "Connect your experience to your next step." },
      { title: "What needs attention", description: "Spot missing details before you start drafting." },
      { title: "Actions to work on next", description: "A focused plan you can act on." },
    ],
    link: "Open an example assessment",
    footer: "Feedback based on the details you share.",
  },
  features: {
    eyebrow: "Start with what you need",
    title: "Choose your next step.",
    cards: [
      { number: "01 / JOB SEARCH", title: "Find jobs and internships.", body: "Explore jobs and internships, check what employers ask for and organise your applications.", href: "/jobs", link: "Find jobs" },
      { number: "02 / SCHOLARSHIPS", title: "Find funding for your study.", body: "Search by study level, destination and funding type, then save opportunities to check.", href: "/scholarships", link: "Explore scholarships" },
      { number: "03 / REVISE", title: "Get feedback on your draft.", body: "Ask about a review of your statement, CV or essay. Share the instructions and deadline to discuss the work and fee.", href: "/consultation", link: "Ask about a review" },
      { number: "04 / PREPARE", title: "Review your preparation with AI.", body: "Describe your goals and experience. Get AI feedback for your job search, study, scholarship or fellowship application.", href: "/career-audit", link: "Start an AI Career Audit" },
    ],
  },
  feedbackExample: {
    eyebrow: "See the thinking",
    title: "What does useful feedback look like?",
    description: "A good review explains why something needs to change and how to improve it.",
    disclaimer: "Illustrative example. This is not a client testimonial.",
    quoteLabel: "SOP feedback / example",
    quote: "I want to study public policy because I am passionate about making a difference.",
    insightTitle: "Give the reader something they can assess.",
    insightDescription: "Which policy issue have you worked on? What did you observe? What question do you now need this programme to help you answer?",
    link: "See how application review works",
  },
  testimonial: {
    eyebrow: "Client feedback",
    title: "A stronger application should still sound like you.",
    link: "Read client feedback",
    empty: "No client feedback has been published yet.",
  },
  resources: {
    eyebrow: "Useful before you apply",
    title: "Build a better first draft.",
    resourcesLink: "Explore resources",
    blogLink: "Read application guides",
  },
  article: {
    eyebrow: "From the blog",
    readLink: "Read the step-by-step guide",
    browseLink: "Browse the blog",
  },
  callout: {
    eyebrow: "Your next step",
    title: "Choose how to get started.",
    description: "Start an AI Career Audit, or book a free 15-minute call to discuss Careergrill’s services.",
    auditLink: "Start an AI Career Audit",
    consultationLink: "Book a free 15-minute call",
  },
};

export const servicesMarketingCopy: ServicesMarketingCopy = {
  hero: {
    eyebrow: "Careergrill services",
    title: "Support with jobs,\nadmissions and MBA\napplications.",
    description: "Get help with CVs, LinkedIn, interviews, graduate applications, scholarships and fellowships. Choose a service or discuss what you need.",
    callLink: "Book a free 15-minute call",
    pricingLink: "View services and pricing",
    startingPointEyebrow: "A useful starting point",
    startingPointTitle: "Tell us what you need help with.",
    startingPoints: [
      "Your intended role or opportunity",
      "The experience you can build on",
      "Your draft, questions and deadline",
    ],
    note: "Careergrill is led by Sanni Alausa-Issa. Discuss your goal, the work involved, the fee and the delivery date before you decide.",
  },
  offers: {
    eyebrow: "Choose your support",
    title: "What needs attention?",
    description: "Choose the document or application you want help with. If you’re unsure, start with a free 15-minute call.",
    fallbackCategory: "Careergrill support",
    exploreLink: "Explore service",
  },
  audit: {
    eyebrow: "Still exploring?",
    title: "Start by understanding\nyour preparation.",
    description: "The AI Career Audit has paths for job seekers and study, scholarship or fellowship applicants. Get feedback on the experience you share and a practical set of next steps.",
    link: "Start an AI Career Audit",
    startingPointTitle: "Your starting point",
    startingPoints: [
      { title: "What can you build on?", description: "Relevant study, work, research or service." },
      { title: "What needs a closer look?", description: "Fit, evidence, requirements and timing." },
      { title: "What comes next?", description: "AI feedback you can use, with optional human support if you want it." },
    ],
  },
  process: {
    eyebrow: "How the work starts",
    title: "Know what you’re getting.",
    description: "Confirm what the service includes before work starts, then use the feedback to revise your documents.",
    steps: [
      { eyebrow: "01 / TALK IT THROUGH", title: "Explain where you are", description: "Bring your goal, current documents, official instructions and the questions you need help answering." },
      { eyebrow: "02 / AGREE THE WORK", title: "Agree what’s included", description: "Confirm the documents or sessions, review rounds, fee and delivery date." },
      { eyebrow: "03 / WORK WITH FEEDBACK", title: "Revise with a purpose", description: "Use specific feedback to develop your application or documents while keeping your experience and voice intact." },
    ],
  },
  faq: {
    eyebrow: "Before you book",
    title: "A few useful answers.",
    description: "Have a different question? Bring it to the first conversation.",
    link: "Read all FAQs",
  },
  testimonial: {
    eyebrow: "A client’s perspective",
    title: "Read about the support\nbehind the application.",
    description: "Read a client’s feedback on Careergrill’s statement support.",
    link: "Read client feedback",
  },
};
