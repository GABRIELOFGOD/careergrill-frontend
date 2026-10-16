"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { apiRequest, apiUrl } from "@/lib/api";
import { contentHref, sampleContent, type ContentType, type SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import RichContent from "@/components/rich-content";

export function HomePage() {
  const { items: resources } = usePublicContent("resource", sampleContent.filter((item) => item.type === "resource"));
  const { items: articles } = usePublicContent("article", sampleContent.filter((item) => item.type === "article"));
  return (
    <>
      <section className="home-hero content-wrap">
        <div className="hero-copy">
          <Eyebrow>Career &amp; admissions advisory</Eyebrow>
          <h1>Your experience.<br />A clearer <em>next step.</em></h1>
          <p className="lead">Make sense of your strengths, choose where to apply, and build applications that reflect what you can offer.</p>
          <div className="hero-actions"><Link className="button button-dark" href="/jobs">Find jobs <span>↗</span></Link><Link className="button button-outline" href="/scholarships">Find scholarships</Link><Link className="text-link" href="/consultation">Get feedback on a draft <span>↗</span></Link></div>
          <p className="hero-note">Starting with graduate admissions, scholarships &amp; fellowships.</p>
          <div className="value-points"><span>Thoughtful feedback</span><span>Practical next steps</span><span>Your own voice</span></div>
        </div>
        <aside className="audit-preview">
          <div className="preview-top"><span>Careergrill / Career Audit</span><span className="pill">Example</span></div>
          <Eyebrow>Your application direction</Eyebrow>
          <h2>You have a story.<br /><em>Let’s find the evidence.</em></h2>
          {["What you can build on", "What needs attention", "Your next three steps"].map((title, index) => <div className="preview-row" key={title}><span>0{index + 1}</span><div><strong>{title}</strong><p>{["Connect your experience to your next step.", "Spot missing details before you start drafting.", "A focused plan you can act on."][index]}</p></div></div>)}
          <Link href="/career-audit" className="text-link">Open an example assessment ↗</Link>
          <div className="preview-foot">✦ Good advice starts with better questions.</div>
        </aside>
      </section>
      <section className="section-block section-tint">
        <div className="content-wrap">
          <div className="section-heading"><div><Eyebrow>Start with what you need</Eyebrow><h2>Choose your next step.</h2></div><Link className="text-link" href="/services">See all services ↗</Link></div>
          <div className="service-grid">
            <FeatureCard number="01 / JOB SEARCH" title="Find a role. Prepare your case." body="Explore jobs and internships, check what employers ask for and organise your applications." href="/jobs" link="Find jobs" />
            <FeatureCard number="02 / SCHOLARSHIPS" title="Find funding for your study." body="Search by study level, destination and funding type, then save the routes you want to investigate." href="/scholarships" link="Explore scholarships" />
            <FeatureCard number="03 / REVISE" title="Get feedback on your draft." body="Bring your statement, CV or essay with the official instructions and deadline. Agree a review scope." href="/consultation" link="Prepare a review enquiry" />
            <FeatureCard number="04 / PREPARE" title="Assess your starting point." body="Describe your goals and experience. Get thoughtful AI feedback on your preparation and next steps." href="/career-audit" link="Start a Career Audit" />
          </div>
        </div>
      </section>
      <section className="section-block content-wrap split-section">
        <div><Eyebrow>See the thinking</Eyebrow><h2>What does useful feedback look like?</h2><p>A good review explains why something needs to change and how to improve it.</p><p className="muted-copy">Illustrative example. This is not a client testimonial.</p></div>
        <div className="feedback-card"><span className="card-kicker">SOP feedback / example</span><blockquote>“I want to study public policy because I am passionate about making a difference.”</blockquote><strong>Give the reader something they can assess.</strong><p>Which policy issue have you worked on? What did you observe? What question do you now need this programme to help you answer?</p><Link href="/services" className="text-link">See how application review works ↗</Link></div>
      </section>
      <section className="section-block quote-strip"><div className="content-wrap quote-inner"><div><Eyebrow>Client feedback</Eyebrow><h2>A stronger application should still sound like you.</h2><p>Read Hameedah’s feedback on Careergrill’s statement of purpose support.</p><Link href="/client-feedback" className="text-link">Read client feedback</Link></div><article className="home-testimonial"><span className="card-kicker">Client feedback / Statement support</span><h3>Statement support in the applicant’s voice.</h3><p>Hameedah Abdrasheed-Babatunde shares her perspective on Careergrill’s statement of purpose support.</p></article></div></section>
      <section className="section-block home-resources">
        <div className="content-wrap">
          <div className="section-heading"><div><Eyebrow>Useful before you apply</Eyebrow><h2>Build a better first draft.</h2></div><div className="home-resource-links"><Link className="text-link" href="/resources">Explore resources</Link><Link className="text-link" href="/blog">Read application guides</Link></div></div>
          <div className="home-resource-grid">{resources.slice(0, 3).map((item) => <article className="home-resource-card" key={item.id}><span className="card-kicker">{item.category} / {String(item.data.format ?? "Checklist")}</span><h3><Link href={`/resources/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p><Link className="text-link" href={`/resources/${item.slug}`}>Open {String(item.data.format ?? "checklist").toLowerCase()}</Link></article>)}</div>
        </div>
      </section>
      {articles[0] && <section className="home-blog-section"><div className="content-wrap home-blog-inner"><div><Eyebrow>From the blog</Eyebrow><h2>{articles[0].title}</h2><p>{articles[0].excerpt}</p><Link className="button button-outline" href={`/blog/${articles[0].slug}`}>Read the step-by-step guide</Link></div><Link className="text-link home-blog-link" href="/blog">Browse the blog ↗</Link></div></section>}
      <Callout />
    </>
  );
}

function FeatureCard({ number, title, body, href, link }: { number: string; title: string; body: string; href: string; link: string }) {
  return <Link className="feature-card" href={href}><span className="card-kicker">{number}</span><h3>{title}</h3><p>{body}</p><span className="text-link">{link} <span aria-hidden="true">↗</span></span></Link>;
}

function Callout() {
  return <section className="callout-section"><div className="content-wrap callout-inner"><div><Eyebrow>One considered next step</Eyebrow><h2>You don’t have to figure out every part at once.</h2><p>Start with your goal. We’ll help you decide what to work on next.</p></div><div className="hero-actions"><Link className="button button-light" href="/career-audit">Start your Career Audit</Link><Link className="button button-outline-light" href="/consultation?mode=call">Book a free 15-minute call</Link></div></div></section>;
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
  return <section className="page-intro content-wrap"><div><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1><p className="lead">{text}</p></div>{side}</section>;
}

const resourceTopics = ["All resources", "Graduate admissions", "Scholarships", "Career documents", "Fellowships", "MBA applications"];
const resourceFormats = ["All formats", "Checklist", "Worksheet", "Template"];

function ResourceCard({ item }: { item: SiteContent }) {
  const format = String(item.data.format ?? "Worksheet");
  const icon = format === "Checklist" ? "✓" : format === "Template" ? "¶" : "↗";
  const action = format === "Checklist" ? "Open checklist" : format === "Template" ? "Open template" : "Open worksheet";
  return <article className="resource-library-card">
    <div className="resource-library-card-top"><span className="resource-library-icon" aria-hidden="true">{icon}</span><span className="resource-library-format">{format}</span></div>
    <span className="resource-library-category">{item.category}</span>
    <h3><Link href={`/resources/${item.slug}`}>{item.title}</Link></h3>
    <p>{item.excerpt}</p>
    <Link className="resource-library-action" href={`/resources/${item.slug}`}>{action}<span aria-hidden="true">↗</span></Link>
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
    <section className="resource-library-hero">
      <div className="content-wrap resource-library-hero-inner">
        <div>
          <Eyebrow>The Careergrill resource library</Eyebrow>
          <h1>Practical help for<br /><em>your next application.</em></h1>
          <p>Checklists, worksheets and planning tools for scholarships, graduate admissions and the documents you need next.</p>
        </div>
        <aside className="resource-library-audit">
          <h2>Know what needs attention first.</h2>
          <p>The AI Career Audit helps you assess your job search or study application before you start drafting.</p>
          <Link className="button button-dark" href="/career-audit">Start an AI Career Audit</Link>
        </aside>
      </div>
    </section>
    <section className="content-wrap resource-library">
      <div className="resource-library-topics" aria-label="Filter resources by topic">
        {resourceTopics.map((item) => <button type="button" key={item} className={`resource-library-chip${topic === item ? " active" : ""}`} aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>)}
      </div>
      <div className="resource-library-heading">
        <div><h2>Find the tool you need.</h2><p>Answer the questions here, then download your notes as a text file or print a PDF. Keep a copy before closing this tab.</p></div>
        <Link href="/blog">Prefer an article? Read application guides</Link>
      </div>
      <div className="resource-library-filters">
        <label className="resource-library-search">Search resources
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try motivation letter, CV or funding" />
        </label>
        <label>Topic
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            {resourceTopics.map((item) => <option key={item} value={item}>{item === "All resources" ? "All topics" : item}</option>)}
          </select>
        </label>
        <label>Format
          <select value={format} onChange={(event) => setFormat(event.target.value)}>
            {resourceFormats.map((item) => <option key={item} value={item}>{item === "All formats" ? "All formats" : item}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => { setTopic("All resources"); setFormat("All formats"); setQuery(""); }}>Reset</button>
      </div>
      {!isLive && <p className="sample-notice">Showing the saved resource library while the live content service is unavailable.</p>}
      <p className="resource-library-count" aria-live="polite">{visibleResources.length} {visibleResources.length === 1 ? "resource" : "resources"}</p>
      {visibleResources.length > 0
        ? <div className="resource-library-grid">{visibleResources.map((item) => <ResourceCard key={item.id} item={item} />)}</div>
        : <p className="resource-library-empty">No resources match those filters. Try another topic or reset your search.</p>}
      <aside className="resource-library-cta">
        <div><h2>Read the advice behind the tool.</h2><p>Explore practical articles on application writing, funding decisions and explaining your experience.</p></div>
        <Link className="button button-outline" href="/blog">Explore the Careergrill blog</Link>
      </aside>
    </section>
  </>;
}

export function FeedbackPage() {
  const { items } = usePublicContent("testimonial", []);

  return <>
    <section className="client-feedback-hero">
      <div className="content-wrap client-feedback-hero-inner">
        <Eyebrow>Client feedback</Eyebrow>
        <h1>A client’s experience<br />with Careergrill.</h1>
        <p>A client’s experience with Careergrill’s statement of purpose support.</p>
      </div>
    </section>
    <main className="content-wrap client-feedback-content">
      <article className="client-testimonial-card">
        <div className="client-testimonial-copy">
          <Eyebrow>Statement of purpose support</Eyebrow>
          <h2>Keeping your experience<br />in your statement.</h2>
          <blockquote>“…would walk you through writing your statement of purpose (SOP) in a perfectly fine manner that reflects not only your journey but who you are!”</blockquote>
          <div className="client-testimonial-author">
            <span aria-hidden="true">HA</span>
            <div><strong>Hameedah Abdrasheed-Babatunde</strong><small>On statement of purpose support</small></div>
          </div>
          <a className="client-testimonial-source" href="https://careergrill.com" target="_blank" rel="noreferrer">Read the original testimonial ↗</a>
        </div>
        <div className="client-testimonial-art" role="img" aria-label="Careergrill application review: Choose the evidence, explain the connection, keep it yours.">
          <span className="client-testimonial-art-label">Application review</span>
          <div className="client-testimonial-paper">
            <small>Your experience / your voice</small>
            <div><span>01</span><strong>Choose the evidence.</strong></div>
            <div><span>02</span><strong>Explain the connection.</strong></div>
            <div><span>03</span><strong>Keep it yours.</strong></div>
            <em>The story belongs to the applicant.</em>
          </div>
          <b className="client-testimonial-mark" aria-hidden="true">c<span>.</span></b>
        </div>
      </article>
      {items.map((item) => (
        <article className="client-testimonial-card client-testimonial-card-cms" key={item.id}>
          <div className="client-testimonial-copy">
            <Eyebrow>{item.category || "Client feedback"}</Eyebrow>
            <h2>{item.title}</h2>
            <RichContent value={item.body} className="client-testimonial-rich-quote" />
            <div className="client-testimonial-author">
              <span aria-hidden="true">{String(item.data.initials ?? "CG")}</span>
              <div>
                <strong>{String(item.data.author ?? item.title)}</strong>
                <small>{String(item.data.attribution ?? item.excerpt)}</small>
              </div>
            </div>
            <Link className="client-testimonial-source" href={contentHref("testimonial", item.slug)}>Read this client story ↗</Link>
          </div>
          <div className="client-testimonial-art" aria-hidden="true">
            <span className="client-testimonial-art-label">Application review</span>
            <div className="client-testimonial-paper">
              <small>Your experience / your voice</small>
              <div><span>01</span><strong>Choose the evidence.</strong></div>
              <div><span>02</span><strong>Explain the connection.</strong></div>
              <div><span>03</span><strong>Keep it yours.</strong></div>
              <em>The story belongs to the applicant.</em>
            </div>
            <b className="client-testimonial-mark">c<span>.</span></b>
          </div>
        </article>
      ))}
      <aside className="client-feedback-cta">
        <div><h2>Want to discuss your own application?</h2><p>Bring your goal and the part of the process you need help with.</p></div>
        <Link className="button button-dark" href="/consultation?mode=call">Book a free 15-minute call</Link>
      </aside>
    </main>
  </>;
}

export function FaqPage() {
  const { items: cmsFaqs } = usePublicContent("faq", []);
  const groups: { title: string; questions: string[] }[] = [
    { title: "AI Career Audit", questions: ["Can I use the audit for my job search?", "Who produces the feedback?", "Do I need to sign in?", "Does the AI read a link or my full CV automatically?", "What if generation fails?", "Can I change my answers?"] },
    { title: "Opportunities & saved work", questions: ["Does a search result confirm that I am eligible?", "What does “Status needs checking” mean?", "Does saving a listing submit an application?", "Where are my worksheet notes saved?"] },
    { title: "Consultations & paid support", questions: ["What is included in the free 15-minute call?", "How much do paid services cost?", "Does preparing an enquiry send it?", "Can Careergrill guarantee a job, admission or scholarship?"] },
  ];
  return <><PageIntro eyebrow="Help & FAQs" title={<>Answers before<br /><em>your next step.</em></>} text="How the audit, opportunity directory and Careergrill support work." /><section className="content-wrap faq-layout">{groups.map(({ title, questions }) => <section className="faq-group" key={title}><h2>{title}</h2>{questions.map((question) => <details key={question}><summary>{question}</summary><p>{question.includes("guarantee") ? "No. Careergrill can help you make a stronger, more considered application, but decisions remain with employers, institutions and funders." : question.includes("saved") || question.includes("listing") ? "Saving a listing keeps it in your private workspace. It does not submit an application or confirm eligibility. Check the official source and keep your notes current." : "You stay in control of what you share. Review the privacy page for details about account storage and AI processing."}</p></details>)}</section>)}{cmsFaqs.length > 0 && <section className="faq-group"><h2>More answers</h2>{cmsFaqs.map((item) => <details key={item.id}><summary>{item.title}</summary><RichContent value={item.body} className="faq-rich-content" /><Link className="text-link" href={contentHref("faq", item.slug)}>Open full answer ↗</Link></details>)}</section>}<div className="faq-cta"><h2>Still have a question?</h2><Link className="button button-dark" href="/consultation?mode=call">Arrange a free 15-minute call</Link></div></section></>;
}

export function PrivacyPage() {
  return <><PageIntro eyebrow="Your information" title={<>What you share.<br /><em>Where it is used.</em></>} text="Privacy information for the Careergrill website." /><article className="content-wrap privacy-content"><p className="muted-copy">Updated 15 October 2026</p><h2>Your account and saved work</h2><p>Signing in connects your account identifier, name and email to your saved workspace. Careergrill stores saved opportunities, application notes and preferences so you can return to them. Workspace access is scoped to your signed-in account.</p><h2>AI-generated content</h2><p>When an administrator asks an AI provider to draft website content, only the prompt and any selected reference documents are sent to that provider. API credentials stay encrypted on the server and are never included in the website response. Generated content remains a draft until an administrator reviews and publishes it.</p><p>If you choose to submit an audit, your answers are sent to the configured AI provider to generate feedback. Do not include passwords, identification numbers, contact details or confidential third-party information.</p><h2>Drafts and resource worksheets</h2><p>Unsaved worksheet notes use this browser tab’s session storage. They do not automatically sync across devices. Download or save work you want to keep.</p><h2>Enquiries and consultations</h2><p>A prepared enquiry remains in this tab until you copy it or choose to send it through email or WhatsApp. Those services and any linked booking provider process information under their own policies.</p><h2>Keeping and deleting information</h2><p>Saved work remains available in your account until you remove it or request its removal. You can delete individual saved opportunities and audits in your workspace. To request removal of account-linked information or ask about a copy, email <a href="mailto:info@careergrill.com">info@careergrill.com</a>. Hosting providers may retain operational records or backups under their own retention arrangements.</p><h2>Questions</h2><p>Contact <a href="mailto:info@careergrill.com">info@careergrill.com</a> about how your information is used or to report a concern.</p></article></>;
}

export function ConsultationPage({ mode }: { mode: "enquiry" | "call" }) {
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
  return <section className={`consultation-page content-wrap${mode === "call" ? " consultation-call-mode" : ""}`}>
    <Link className="consultation-back-link" href="/services">All services</Link>
    <header className="consultation-heading">
      <Eyebrow>{mode === "call" ? "Free 15-minute consultation" : "Discuss your support"}</Eyebrow>
      <h1>{mode === "call" ? "Talk through your next step." : "Tell us what you need."}</h1>
      <p>{mode === "call"
        ? "Bring your goal, deadline and the part you want help with. Use this short call to decide what support makes sense."
        : "Share your goal and the help you want. Review the message, edit it if needed, then copy it or send it through WhatsApp or email."}</p>
    </header>
    {mode === "call" ? <div className="consultation-call-grid">
      <article className="consultation-card">
        <h2>A focused first conversation</h2>
        <ul>
          <li>Explain your job search or application goal</li>
          <li>Ask about the support available</li>
          <li>Agree a next step, if you want one</li>
        </ul>
        <p>The 15-minute consultation is free. A full document review or ongoing application support is quoted separately before work begins.</p>
        <a className="button button-dark" href={`https://wa.me/2348168097950?text=${callMessage}`} target="_blank" rel="noreferrer">Arrange a time on WhatsApp</a>
        <small>Message Careergrill to ask about available times.</small>
      </article>
      <article className="consultation-card">
        <h2>Prefer to arrange it by message?</h2>
        <p>Send your goal and a few suitable times. Careergrill will confirm availability.</p>
        <a className="button button-outline" href={`https://wa.me/2348168097950?text=${callMessage}`} target="_blank" rel="noreferrer">Ask about a free call on WhatsApp</a>
        <Link className="consultation-text-link" href="/consultation">Draft a service enquiry</Link>
      </article>
    </div> : <div className="consultation-enquiry-grid">
      <form className="form-card consultation-form" onSubmit={prepare}>
        <h2>Draft your enquiry</h2>
        <label>Service<select value={service} onChange={(event) => setService(event.target.value)}>{services.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Your goal or next step<input value={goal} onChange={(event) => setGoal(event.target.value)} required placeholder="For example, choosing between a job search and postgraduate study" /></label>
        <label>Where are you in the process? (optional)<select value={process} onChange={(event) => setProcess(event.target.value)}><option value="">Choose if helpful</option><option>I’m exploring my options</option><option>I’m starting an application</option><option>I have a draft</option><option>I have an interview invitation</option></select></label>
        <label>Your deadline, if known<input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
        <label>What would you like us to know?<textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={4} placeholder="For example: I have a 500-word draft, but I’m struggling to connect my experience to the selection criteria." /></label>
        <small>Two or three sentences about the help you want are enough.</small>
        <button className="button button-dark">Create message</button>
        {message && <p className="inline-notice" role="status">{message}</p>}
        {prepared && <div className="prepared-message">
          <textarea value={prepared} onChange={(event) => setPrepared(event.target.value)} rows={9} aria-label="Prepared enquiry message" />
          <a className="button button-dark" href={`mailto:info@careergrill.com?subject=${encodeURIComponent("Careergrill enquiry")}&body=${encodeURIComponent(prepared)}`}>Open in email ↗</a>
          <a className="text-link" href={`https://wa.me/2348168097950?text=${encodeURIComponent(prepared)}`} target="_blank" rel="noreferrer">Send with WhatsApp ↗</a>
        </div>}
        <p className="muted-copy">Your enquiry draft stays in this tab. Copy it before leaving if you want to keep it.</p>
      </form>
      <aside className="consultation-card consultation-context">
        <Eyebrow>Useful context</Eyebrow>
        <h2>What to have ready.</h2>
        <ul>
          <li>The goal you are working towards</li>
          <li>What you have already tried or prepared</li>
          <li>Any opportunity or deadline you have in mind</li>
          <li>The part of the process you want help with</li>
        </ul>
        <p>You can make an enquiry before everything is ready. Agree the work, fee and delivery date before paid support begins. Share document files privately once you have agreed the process.</p>
        <h3>Prefer to talk?</h3>
        <p>Arrange a free 15-minute consultation to discuss your goal.</p>
        <Link className="button button-outline" href="/consultation?mode=call">Arrange a free 15-minute call</Link>
        <small>Opening a message or booking page does not send an enquiry or book an appointment.</small>
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
  return <section className="auth-layout content-wrap"><div className="auth-copy"><Eyebrow>Your Careergrill workspace</Eyebrow><h1>Keep your next steps <em>in one place.</em></h1><p>Save opportunities, make notes and return to the work you have started.</p><ul><li>Your saved opportunities and reminders</li><li>Your private application notes</li><li>Your audit history and action plans</li></ul></div><form className="form-card auth-form" onSubmit={(event) => void submit(event)}><div className="auth-tabs"><button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setVerificationSent(false); }}>Sign in</button><button type="button" className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setVerificationSent(false); }}>Create account</button></div><Eyebrow>{mode === "login" ? "Welcome back" : "A private space for your work"}</Eyebrow><h2>{mode === "login" ? "Sign in to continue." : "Create your workspace."}</h2><a className="button button-outline google-signin" href={apiUrl("/auth/google")}><span aria-hidden="true">G</span> Continue with Google</a><div className="auth-divider"><span>or continue with email</span></div>{mode === "register" && <label>Your name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} /></label>}<label>Email address<input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input autoComplete={mode === "login" ? "current-password" : "new-password"} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === "register" ? 12 : 1} maxLength={128} />{mode === "register" && <small>Use at least 12 characters. A passphrase is easiest to remember.</small>}</label><button className="button button-dark" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>{notice && <p role="status" className="inline-notice">{notice}</p>}{verificationSent && <button type="button" className="text-button" onClick={() => void resendVerification()}>Send a new verification email</button>}{mode === "login" && <Link className="text-link" href="/workspace">Continue to my workspace ↗</Link>}<p className="privacy-note">Your session is protected by an HttpOnly cookie. <Link href="/privacy">Read our privacy information</Link>.</p></form></section>;
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
  return <section className="simple-page content-wrap"><Eyebrow>Email verification</Eyebrow><h1>One last step.</h1><p role="status">{state}</p><Link className="button button-dark" href="/workspace">Open your workspace ↗</Link></section>;
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
    <main className="workspace-page">
      <div className="workspace-container">
        <header className="workspace-header">
          <div>
            <Eyebrow>Your application workspace</Eyebrow>
            <h1 className={view === "scholarships" ? "workspace-title-scholarships" : undefined}>{title}</h1>
            <p>{isAuditView
              ? "Return to your saved Career Audit feedback and review the next steps you planned."
              : view === "jobs"
                ? "Return to saved roles, record your preparation and keep track of applications."
                : "Track what you want to pursue and what needs doing next."}</p>
          </div>
          {!isAuditView && <Link className="button button-outline" href={view === "jobs" ? "/jobs" : "/scholarships"}>{view === "jobs" ? "Find more jobs" : "Explore more scholarships"}</Link>}
        </header>
        {!isAuditView && <nav className="workspace-tabs" aria-label="Saved opportunities">
          <Link className={view === "scholarships" ? "active" : ""} aria-current={view === "scholarships" ? "page" : undefined} href="/workspace">Scholarships</Link>
          <Link className={view === "jobs" ? "active" : ""} aria-current={view === "jobs" ? "page" : undefined} href="/workspace/jobs">Jobs</Link>
        </nav>}
        {!isAuditView && <div className="workspace-banner">
          <p>{view === "jobs"
            ? <><strong>Saved to your account.</strong> Notes, checks and application stages are private to your signed-in workspace. Update stages yourself after applying through the employer.</>
            : <><strong>Your saved workspace.</strong> Opportunities, notes and progress are saved to your account. Submit applications through the official provider. Enable expiry reminders on saved listings to get an email before they close.</>}</p>
          {view === "scholarships" && <Link href="/my-audits">Open my audit history</Link>}
        </div>}
        {notice && !isLoading && <div className="inline-notice workspace-error" role="status">{notice} {notice.toLowerCase().includes("sign in") && <Link href="/signin">Sign in ↗</Link>}</div>}
        {!isAuditView && <>
        <div className="workspace-stats">
          <div><strong>{savedItems.length}</strong><span>Saved {view === "jobs" ? "jobs" : "opportunities"}</span></div>
          <div><strong>{savedItems.filter((item) => item.status === "preparing").length}</strong><span>In preparation</span></div>
          <div><strong>{savedItems.filter((item) => item.status === "submitted").length}</strong><span>Applied / interviewing</span></div>
        </div>
        <div className={`workspace-content${view === "scholarships" ? " has-guidance" : ""}`}>
          <section className="workspace-primary" aria-labelledby="workspace-list-title">
            <div className="workspace-list-heading">
              <h2 id="workspace-list-title">{view === "jobs" ? "Your saved roles" : "Your shortlist"}</h2>
              <label>{view === "jobs" ? "Stage" : "Status"}<select value={stage} onChange={(event) => setStage(event.target.value)}><option value="all">All stages</option><option value="saved">Saved</option><option value="preparing">In preparation</option><option value="submitted">Applied / interviewing</option></select></label>
            </div>
            {isLoading ? <p className="workspace-loading" role="status">{view === "jobs" ? "Loading your saved jobs…" : "Loading the scholarship directory…"}</p>
              : filteredItems.length > 0 ? <div className="workspace-saved-list">{filteredItems.map((item) => <WorkspaceSavedCard
                key={item.id}
                item={item}
                onRemove={() => void remove(item.id)}
                onUpdate={(values) => void updateSaved(item.id, values)}
              />)}</div> : !notice && view === "scholarships" ? <div className="workspace-empty">
                <h3>Your shortlist starts here.</h3>
                <p>{stage === "all" ? "Save a scholarship from the discovery page to start tracking your preparation." : "No saved opportunities match this stage."}</p>
                {stage === "all" && <Link className="button button-dark" href="/scholarships">Find a scholarship</Link>}
              </div> : !notice && stage !== "all" && <p className="workspace-no-matches">No saved jobs match this stage.</p>}
          </section>
          {view === "scholarships" && <aside className="workspace-guidance">
            <Eyebrow>Before you apply</Eyebrow>
            <h2>A listing is the start of the research.</h2>
            <ul>
              <li>Confirm official eligibility and the current cycle.</li>
              <li>Check what the funding actually covers.</li>
              <li>Record scholarship and admission deadlines separately.</li>
              <li>Work backwards from your deadline.</li>
            </ul>
            <Link className="button button-dark" href="/career-audit">Start an AI Career Audit</Link>
            <Link className="workspace-support-link" href="/consultation">Discuss adviser support</Link>
            <div className="workspace-reminder-help">
              <h3>Need a reminder?</h3>
              <p>Enable an expiry reminder on a saved opportunity and we’ll email you before the listing closes.</p>
            </div>
          </aside>}
        </div>
      </>}
      {isAuditView && (audits.length ? <div className="audit-history">{audits.map((audit) => <article key={audit.id}>
          <div><span className="pill">{audit.goal}</span><small>{new Date(audit.created_at).toLocaleDateString()}</small></div>
          <p>{audit.feedback.slice(0, 500)}{audit.feedback.length > 500 ? "…" : ""}</p>
          <button className="text-button" onClick={() => void deleteAudit(audit.id)}>Delete audit</button>
        </article>)}</div> : !notice && <p className="muted-copy">Your audit history will appear here after you generate feedback.</p>)}
      </div>
    </main>
  );
}

function WorkspaceSavedCard({ item, onRemove, onUpdate }: {
  item: SavedItem;
  onRemove: () => void;
  onUpdate: (values: { status?: string; reminder_enabled?: boolean }) => void;
}) {
  return <article className="listing-card">
    <div className="listing-meta"><span className="pill">{item.status}</span><span>{item.content_items.category}</span></div>
    <h3>{item.content_items.title}</h3><p>{item.content_items.excerpt}</p>
    {item.content_items.deleted_at && <p className="muted-copy">This listing was withdrawn and is no longer available on the website.</p>}
    <label className="workspace-status">Application stage<select value={item.status} onChange={(event) => onUpdate({ status: event.target.value })}><option value="saved">Saved</option><option value="preparing">Preparing</option><option value="submitted">Submitted</option></select></label>
    {!item.content_items.deleted_at && <label className="workspace-reminder"><input type="checkbox" checked={item.reminder_enabled} onChange={(event) => onUpdate({ reminder_enabled: event.target.checked })} /> Email me before this listing expires</label>}
    {!item.content_items.deleted_at && item.content_items.expires_at && <p className="muted-copy">Expires {new Date(item.content_items.expires_at).toLocaleDateString()}</p>}
    <button className="text-button" onClick={onRemove}>Remove from workspace</button>
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
  return <div className="audit-page content-wrap">
    <aside className="audit-sidebar">
      <Link className="audit-back-link" href="/">← Back to Careergrill</Link>
      <div className="audit-intro">
        <Eyebrow>AI Career Audit</Eyebrow>
        <h1>Review your preparation with AI.</h1>
        <p>Tell us about the role, course, scholarship or fellowship you’re considering and one example of your experience. Get feedback on the details you share, questions to resolve and actions to take.</p>
      </div>
      <ol className="audit-progress">
        {["Your goal", "Your experience", "Your target and timeline"].map((label, index) => (
          <li className={step === index + 1 ? "active" : step > index + 1 ? "complete" : ""} key={label}>
            <span>{index + 1}</span>{label}
          </li>
        ))}
      </ol>
      <div className="audit-saving-note">
        <strong>Saving your audit</strong>
        <p>Start without an account. This tab keeps your draft through reloads. Sign in to save it and generate feedback. Closing the tab clears unsaved work.</p>
        <Link href="/privacy">How your information is used</Link>
        <Link href="/workspace/audits">See an example action plan</Link>
      </div>
    </aside>
    <form className="audit-form" onSubmit={(event) => void generate(event)}>
      {auditAvailable === false && <div className="audit-unavailable" role="status"><strong>AI feedback is temporarily unavailable.</strong><p>You can still complete and save your audit. Your answers will stay in this tab until the service is available.</p></div>}
      {auditAvailable === null && <p className="audit-availability-check" role="status">Checking AI feedback availability…</p>}
      <p className="audit-required-note">Fields marked “Needed for AI feedback” are required to generate an assessment. You can save an incomplete draft.</p>
      <div className="step-label">STEP {step} OF 3</div>
      {step === 1 ? <>
        <h2>What are you working towards?</h2>
        <p>Pick one direction. The next questions will follow your choice.</p>
        <fieldset className="audit-goal-options">
          <legend className="visually-hidden">Choose your goal</legend>
          <p className="audit-choice-heading">Job search</p>
          <button type="button" className={`choice-card audit-goal-card${goal === goalChoices[0].goal ? " selected" : ""}`} aria-pressed={goal === goalChoices[0].goal} onClick={() => setGoal(goalChoices[0].goal)}>
            <span className="choice-radio" aria-hidden="true" /><span><strong>{goalChoices[0].label}</strong><small>{goalChoices[0].detail}</small></span>
          </button>
          <p className="audit-choice-heading">Study, scholarships &amp; fellowships</p>
          <div className="audit-study-options">
            {goalChoices.slice(1).map((item) => <button type="button" key={item.goal} className={`choice-card audit-goal-card${goal === item.goal ? " selected" : ""}`} aria-pressed={goal === item.goal} onClick={() => setGoal(item.goal)}>
              <span className="choice-radio" aria-hidden="true" /><span><strong>{item.label}</strong><small>{item.detail}</small></span>
            </button>)}
          </div>
        </fieldset>
        <label><small>Needed for AI feedback</small>What would you like this opportunity to help you do?
          <textarea value={answers.direction} onChange={(event) => setAnswers({ ...answers, direction: event.target.value })} rows={4} required placeholder="Explain the change you want to make and why it matters to you." />
        </label>
        <p className="audit-field-hint">A specific goal makes the feedback more useful.</p>
      </> : step === 2 ? <>
        <h2>What experience can you build on?</h2>
        <p>Share only what you are comfortable including. Leave out contact and identification details.</p>
        <label><small>Needed for AI feedback</small>Your relevant experience
          <textarea value={answers.experience} onChange={(event) => setAnswers({ ...answers, experience: event.target.value })} rows={6} required placeholder="Work, study, volunteering, projects or responsibilities…" />
        </label>
        <label>What evidence can you point to?
          <textarea value={answers.evidence} onChange={(event) => setAnswers({ ...answers, evidence: event.target.value })} rows={4} placeholder="Examples, outcomes, feedback or work you have completed." />
        </label>
      </> : <>
        <h2>What is your target and timeline?</h2>
        <p>Share the next milestone and any deadlines or uncertainties you want the assessment to consider.</p>
        <label>Your target
          <textarea value={answers.target} onChange={(event) => setAnswers({ ...answers, target: event.target.value })} rows={3} placeholder="What would a useful next step look like?" />
        </label>
        <label>Your timeline
          <input value={answers.timeline} onChange={(event) => setAnswers({ ...answers, timeline: event.target.value })} maxLength={1000} placeholder="For example, the application deadline or interview date." />
        </label>
        <label>Your questions or concerns
          <textarea value={answers.concerns} onChange={(event) => setAnswers({ ...answers, concerns: event.target.value })} rows={4} placeholder="Deadlines, missing experience, programme fit, interviews…" />
        </label>
        <label className="consent-row"><input type="checkbox" required /> I understand my answers will be sent to the configured AI provider to generate feedback.</label>
      </>}
      {notice && <p className="inline-notice" role="status">{notice} {notice.toLowerCase().includes("sign in") && <Link href="/signin">Sign in ↗</Link>}</p>}
      <p className="audit-save-reminder">Draft kept in this tab. Sign in to save it to your account.</p>
      <div className="form-actions">
        {step > 1 && <button type="button" className="button button-outline" onClick={() => setStep(step - 1)}>Back</button>}
        <button type="button" className="button button-outline" onClick={saveDraft}>Save draft</button>
        {step < 3
          ? <button type="button" className="button button-dark" onClick={continueAudit}>Continue</button>
          : <button className="button button-dark" disabled={auditAvailable !== true}>Generate AI feedback</button>}
      </div>
      <small>Up to five generation attempts per account each day, subject to service capacity. Failed attempts count. Reading saved feedback does not use an attempt.</small>
      <div className="audit-foot"><button type="button" className="text-button" onClick={() => { sessionStorage.removeItem("careergrill-audit-draft"); setAnswers({ direction: "", experience: "", evidence: "", concerns: "", target: "", timeline: "" }); setFeedback(""); setStep(1); setNotice("This tab’s draft has been cleared."); }}>Clear this tab’s draft</button><Link href="/faq">Questions about the audit? ↗</Link></div>
    </form>
    {feedback && <section className="feedback-result"><Eyebrow>Your application direction</Eyebrow><h2>A practical next-step plan.</h2><div>{feedback.split("\n").map((line, index) => <p key={index}>{line}</p>)}</div></section>}
  </div>;
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
  if (!item) return <section className="simple-page content-wrap">{loading ? <p>Loading content…</p> : <><Eyebrow>Careergrill</Eyebrow><h1>{loadError ? "Content unavailable." : "Content not found."}</h1><p>{loadError || "This page may have moved or is not published."}</p><Link className="button button-dark" href="/">Return home</Link></>}</section>;
  return <article className="article-page content-wrap"><Link className="text-link" href={contentCollectionPath(item.type)}>← Back to {contentCollectionLabel(item.type)}</Link><div className="article-head"><Eyebrow>{item.category} / Careergrill</Eyebrow><h1>{item.title}</h1><p className="lead">{item.excerpt}</p></div><RichContent value={item.body} className="article-body" />{item.source_url && <a className="button button-dark" href={item.source_url} target="_blank" rel="noreferrer">Check official source ↗</a>}</article>;
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
  return <section className="simple-page content-wrap">
    <Eyebrow>Careergrill</Eyebrow>
    <h1>That page isn’t here.</h1>
    <p>Explore opportunities or find a useful next step.</p>
    <Link className="button button-dark" href="/">Return home</Link>
  </section>;
}
