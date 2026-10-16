"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
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

function ResourceCard({ item }: { item: SiteContent }) {
  return <article className="resource-card"><div className="resource-card-visual"><div className="visual-title">CAREERGRILL / FIELD NOTES</div><div className="visual-list"><span>01</span><b>{item.category}</b><span>02</span><b>{String(item.data.format ?? "Toolkit")}</b><span>03</span><b>Start with what you know.</b></div><div className="visual-mark">c.</div></div><div className="resource-card-body"><span className="card-kicker">{String(item.data.format ?? "Resource")} · {item.category}</span><h3><Link href={`/resources/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p><Link className="text-link" href={`/resources/${item.slug}`}>Open {String(item.data.format ?? "resource").toLowerCase()} ↗</Link></div></article>;
}

export function ResourcePage() {
  const fallback = sampleContent.filter((item) => item.type === "resource");
  const { items: resources, isLive } = usePublicContent("resource", fallback);
  return <><PageIntro eyebrow="The Careergrill resource library" title={<>Practical help for<br /><em>your next application.</em></>} text="Checklists, worksheets and planning tools for scholarships, graduate admissions and the documents you need next." side={<div className="intro-side"><Eyebrow>Know what needs attention first</Eyebrow><h2>Start with your direction.</h2><p>The Career Audit helps you assess your job search or study application before you start drafting.</p><Link className="text-link" href="/career-audit">Start your Career Audit ↗</Link></div>} /><section className="content-wrap listing-area"><div className="topic-chips">{["All resources", "Graduate admissions", "Scholarships", "Career documents", "Fellowships", "MBA applications"].map((topic, index) => <a className={index === 0 ? "topic-chip active" : "topic-chip"} key={topic} href="#resources">{topic}</a>)}</div><div className="section-heading"><div><Eyebrow>Find the tool you need</Eyebrow><h2>Open a starter tool. Keep an editable copy.</h2></div><Link className="text-link" href="/blog">Prefer an article? Read application guides ↗</Link></div>{!isLive && <p className="sample-notice">Sample resources are shown until the live content service is connected.</p>}<div className="resource-cards">{resources.map((item) => <ResourceCard key={item.id} item={item} />)}</div><div className="notice-box"><strong>Your work stays in your browser unless you choose to save it.</strong><p>Sign in to save application notes and opportunities to your Careergrill workspace.</p><Link href="/signin" className="text-link">Sign in to your workspace ↗</Link></div></section></>;
}

const articleSamples = sampleContent.filter((item) => item.type === "article");
export function BlogPage({ articleSlug }: { articleSlug?: string }) {
  const { items: articles } = usePublicContent("article", articleSamples);
  if (articleSlug) {
    const item = articles.find((article) => article.slug === articleSlug) ?? articles[0] ?? articleSamples[0];
    return <article className="article-page content-wrap"><Link className="text-link" href="/blog">← Back to the blog</Link><div className="article-head"><Eyebrow>{item.category} / Application notes</Eyebrow><h1>{item.title}</h1><p className="lead">{item.excerpt}</p><span className="muted-copy">By Careergrill · Practical application notes</span></div><div className="article-cover"><span>CAREERGRILL / APPLICATION NOTES</span><strong>Start with<br />what you can explain.</strong><b>c.</b></div><RichContent value={item.body} className="article-body" /><div className="notice-box"><strong>Working on your own application?</strong><p>Keep a checklist beside your draft or discuss a feedback scope with Careergrill.</p><Link href="/resources" className="text-link">Explore the resource library ↗</Link></div></article>;
  }
  return <><PageIntro eyebrow="The Careergrill blog" title={<>Useful advice.<br /><em>A clearer next move.</em></>} text="Read about the decisions and documents behind a stronger application, from choosing funding to explaining your work." side={<div className="intro-side"><Eyebrow>Put the advice to work</Eyebrow><h2>Keep a checklist beside your draft.</h2><p>Open a worksheet or checklist as you read.</p><Link className="text-link" href="/resources">Open the resource library ↗</Link></div>} /><section className="content-wrap listing-area"><div className="featured-article"><div><Eyebrow>Featured reading · {articles[0]?.category ?? "Careergrill"}</Eyebrow><h2>{articles[0] ? <Link href={`/blog/${articles[0].slug}`}>{articles[0].title}</Link> : "Useful advice for your next application."}</h2><p>{articles[0]?.excerpt ?? "Check back soon for practical application notes."}</p>{articles[0] && <Link className="text-link" href={`/blog/${articles[0].slug}`}>Read the article ↗</Link>}</div><div className="article-art"><span>APPLICATION NOTES</span><b>01 / PLAN<br />02 / WRITE<br />03 / REVIEW</b><strong>c.</strong></div></div><div className="section-heading"><div><Eyebrow>More from the blog</Eyebrow><h2>Make the next decision clearer.</h2></div></div><div className="article-grid">{articles.map((item) => <article className="article-card" key={item.id}><span className="card-kicker">{item.category} · {String(item.data.reading_minutes ?? 4)} min read</span><h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p><Link href={`/blog/${item.slug}`} className="text-link">Read article ↗</Link></article>)}</div></section></>;
}

export function ServicesPage() {
  const { items } = usePublicContent("service", []);
  return <><PageIntro eyebrow="Careergrill services" title={<>Get support for<br /><em>the step you’re taking.</em></>} text="Choose a direction, make sense of your experience, or get feedback on a draft. Find the support that fits where you are now." side={<div className="intro-side"><Eyebrow>A useful starting point</Eyebrow><h2>Bring your goal.<br />We’ll work from there.</h2><ol><li>Your intended role or opportunity</li><li>The experience you can build on</li><li>Your draft, questions and deadline</li></ol></div>} /><section className="content-wrap listing-area"><div className="section-heading"><div><Eyebrow>Choose your support</Eyebrow><h2>What needs attention?</h2><p>Each service starts with your goal and the evidence you have to work with.</p></div></div><div className="service-grid">{[
    ["01 / Graduate applications", "Admissions, scholarships and fellowships", "Career Audit and application planning · SOP and motivation letter review · Programme fit and funding discussion"],
    ["02 / Career documents", "CVs, LinkedIn and interviews", "CV review and rewriting · LinkedIn headline and profile · Interview preparation"],
    ["03 / MBA applications", "Strategy, essays and interviews", "Application direction · Essay development and review · Interview preparation"],
  ].map(([number, title, body]) => <article className="service-detail-card" key={number}><span className="card-kicker">{number}</span><h2>{title}</h2><p>{body}</p><Link className="text-link" href="/consultation">Discuss this support ↗</Link></article>)}
    {items.map((item) => <article className="service-detail-card" key={item.id}><span className="card-kicker">{item.category || "Careergrill support"}</span><h2><Link href={contentHref("service", item.slug)}>{item.title}</Link></h2>{item.excerpt ? <p>{item.excerpt}</p> : <RichContent value={item.body} className="service-rich-content" />}<Link className="text-link" href={contentHref("service", item.slug)}>Read service details ↗</Link><Link className="text-link" href="/consultation">Discuss this support ↗</Link></article>)}</div><div className="notice-box"><strong>Agree the scope before you commit.</strong><p>Careergrill is led by Sanni Alausa-Issa. Discuss your goal, deliverables and fee before you commit to paid support.</p><Link href="/consultation?mode=call" className="button button-dark">Book a free 15-minute call ↗</Link></div></section></>;
}

export function FeedbackPage() {
  const { items } = usePublicContent("testimonial", []);
  return <><PageIntro eyebrow="Client feedback" title={<>The support behind<br /><em>the next step.</em></>} text="Read an attributed client’s account of statement support and writing that reflects their own experience." /><section className="content-wrap listing-area"><div className="testimonial-panel"><Eyebrow>Published client feedback</Eyebrow><h2>Keeping your experience in your statement.</h2><blockquote>“…would walk you through writing your statement of purpose (SOP) in a perfectly fine manner that reflects not only your journey but who you are!”</blockquote><div className="testimonial-person"><span>HA</span><div><strong>Hameedah Abdrasheed-Babatunde</strong><p>On statement of purpose support</p></div></div><a href="https://careergrill.com" className="text-link" target="_blank" rel="noreferrer">Read the full feedback on Careergrill’s current website ↗</a></div>{items.map((item) => <article className="testimonial-panel" key={item.id}><Eyebrow>{item.category || "Client feedback"}</Eyebrow><RichContent value={item.body} className="feedback-rich-content" /><div className="testimonial-person"><span>{String(item.data.initials ?? "CG")}</span><div><strong><Link href={contentHref("testimonial", item.slug)}>{String(item.data.author ?? item.title)}</Link></strong><p>{String(item.data.attribution ?? item.excerpt)}</p></div></div><Link className="text-link" href={contentHref("testimonial", item.slug)}>Read full feedback ↗</Link></article>)}<div className="action-strip"><div><Eyebrow>Your experience / your voice</Eyebrow><h2>Choose the evidence. Explain the connection. Keep it yours.</h2><p>The story belongs to the applicant.</p></div><Link className="button button-dark" href="/consultation">Discuss your application ↗</Link></div></section></>;
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

export function ConsultationPage() {
  const [message, setMessage] = useState("");
  const [service, setService] = useState("Help me choose the right support");
  const [goal, setGoal] = useState("");
  const [details, setDetails] = useState("");
  const [prepared, setPrepared] = useState("");
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = `Hello Careergrill,\n\nI would like to discuss: ${service}.\nMy goal or next step: ${goal}\n\nA little more context:\n${details}\n\nPlease let me know the next step.`;
    setPrepared(text);
    setMessage("Your brief is ready. Choose when and how to send it.");
  }
  return <><PageIntro eyebrow="Discuss your support" title={<>Tell us what<br /><em>you need.</em></>} text="Share your goal and the help you want. Review the message, edit it if needed, then copy it or send it through WhatsApp or email." side={<div className="intro-side"><Eyebrow>Useful context</Eyebrow><h2>What to have ready.</h2><p>The goal you are working towards, what you have tried and any draft or deadline you want to discuss.</p></div>} /><section className="content-wrap consultation-layout"><form className="form-card" onSubmit={prepare}><Eyebrow>Prepare your enquiry</Eyebrow><label>Service<select value={service} onChange={(event) => setService(event.target.value)}>{["Help me choose the right support", "Statement review · Admissions", "Application strategy · Admissions", "CV review & rewrite · Career documents", "LinkedIn support · Career documents", "Interview preparation · Career documents", "Application direction · MBA", "Essay development & review · MBA"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Your goal or next step<input value={goal} onChange={(event) => setGoal(event.target.value)} required placeholder="What are you working towards?" /></label><label>Where are you in the process?<select><option>I’m exploring my options</option><option>I’m starting an application</option><option>I have a draft</option><option>I have an interview invitation</option></select></label><label>Your deadline, if known<input type="date" /></label><label>What would you like us to know?<textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={5} placeholder="Two or three sentences about the help you want are enough." /></label><button className="button button-dark">Prepare message</button><p className="muted-copy">Your brief is kept in this tab. You choose when to copy or send it.</p></form><div className="enquiry-preview"><Eyebrow>What happens next</Eyebrow><h2>Start with the question you have.</h2><p>A free 15-minute call is a chance to discuss your goal and decide whether a longer review is useful.</p>{message && <p className="inline-notice" role="status">{message}</p>}{prepared && <div className="prepared-message"><textarea value={prepared} onChange={(event) => setPrepared(event.target.value)} rows={12} aria-label="Prepared enquiry message" /><a className="button button-dark" href={`mailto:info@careergrill.com?subject=${encodeURIComponent("Careergrill enquiry")}&body=${encodeURIComponent(prepared)}`}>Open in email ↗</a><a className="text-link" href={`https://wa.me/2348168097950?text=${encodeURIComponent(prepared)}`} target="_blank" rel="noreferrer">Send with WhatsApp ↗</a></div>}</div></section></>;
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
  useEffect(() => {
    Promise.all([
      apiRequest<{ items: SavedItem[] }>("/saved"),
      apiRequest<{ items: { id: string; goal: string; feedback: string; created_at: string }[] }>("/audits"),
    ])
      .then(([saved, auditHistory]) => { setItems(saved.items); setAudits(auditHistory.items); setNotice(""); })
      .catch((error: unknown) => setNotice(error instanceof Error ? error.message : "We could not load your workspace."));
  }, []);
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
  const title = view === "jobs" ? "Your job search." : "Your application workspace.";
  const isAuditView = view === "audits";
  return (
    <>
    <PageIntro
      eyebrow="Your application workspace"
      title={<>{title}<br /><em>A plan you can follow.</em></>}
      text={isAuditView
        ? "Return to your saved Career Audit feedback and review the next steps you planned."
        : "Return to saved opportunities, record your preparation and keep track of applications."}
      side={<div className="intro-side"><Eyebrow>Private to your account</Eyebrow><p>Notes, checks and application stages stay in your signed-in workspace.</p><Link className="text-link" href="/career-audit">Start a new audit ↗</Link></div>}
    />
    <section className="content-wrap listing-area">
      {!isAuditView && <div className="workspace-tabs">
        <Link className={view === "scholarships" ? "active" : ""} href="/workspace">Scholarships</Link>
        <Link className={view === "jobs" ? "active" : ""} href="/workspace/jobs">Jobs</Link>
      </div>}
      {notice && <div className="inline-notice" role="status">{notice} {notice.toLowerCase().includes("sign in") && <Link href="/signin">Sign in ↗</Link>}</div>}
      {!isAuditView && <>
        <div className="workspace-stats">
          <div><strong>{savedItems.length}</strong><span>Saved {view === "jobs" ? "jobs" : "opportunities"}</span></div>
          <div><strong>{savedItems.filter((item) => item.status === "preparing").length}</strong><span>In preparation</span></div>
          <div><strong>{savedItems.filter((item) => item.status === "submitted").length}</strong><span>Applied / interviewing</span></div>
        </div>
        <div className="section-heading">
          <div><Eyebrow>My shortlist</Eyebrow><h2>Your saved {view === "jobs" ? "roles" : "opportunities"}</h2><p>Turn on email reminders for verified addresses. We’ll email you before listings expire.</p></div>
          <Link className="button button-outline" href={view === "jobs" ? "/jobs" : "/scholarships"}>Find more {view === "jobs" ? "jobs" : "scholarships"} ↗</Link>
        </div>
        {savedItems.length > 0 ? <div className="listing-grid">{savedItems.map((item) => <article className="listing-card" key={item.id}>
          <div className="listing-meta"><span className="pill">{item.status}</span><span>{item.content_items.category}</span></div>
          <h3>{item.content_items.title}</h3><p>{item.content_items.excerpt}</p>
          {item.content_items.deleted_at && <p className="muted-copy">This listing was withdrawn and is no longer available on the website.</p>}
          <label className="workspace-status">Application stage<select value={item.status} onChange={(event) => void updateSaved(item.id, { status: event.target.value })}><option value="saved">Saved</option><option value="preparing">Preparing</option><option value="submitted">Submitted</option></select></label>
          {!item.content_items.deleted_at && <label className="workspace-reminder"><input type="checkbox" checked={item.reminder_enabled} onChange={(event) => void updateSaved(item.id, { reminder_enabled: event.target.checked })} /> Email me before this listing expires</label>}
          {!item.content_items.deleted_at && item.content_items.expires_at && <p className="muted-copy">Expires {new Date(item.content_items.expires_at).toLocaleDateString()}</p>}
          <button className="text-button" onClick={() => void remove(item.id)}>Remove from workspace</button>
        </article>)}</div> : !notice && <div className="empty-state">
          <h3>Your shortlist starts here.</h3><p>Save a {view === "jobs" ? "job" : "scholarship or resource"} to track your preparation.</p>
          <Link className="button button-dark" href={view === "jobs" ? "/jobs" : "/scholarships"}>Find {view === "jobs" ? "a job" : "a scholarship"} ↗</Link>
        </div>}
      </>}
      {(isAuditView || view === "scholarships") && <>
        <div className="section-heading audit-history-heading"><div><Eyebrow>Your audit history</Eyebrow><h2>Plans you have saved</h2></div></div>
        {audits.length ? <div className="audit-history">{audits.map((audit) => <article key={audit.id}>
          <div><span className="pill">{audit.goal}</span><small>{new Date(audit.created_at).toLocaleDateString()}</small></div>
          <p>{audit.feedback.slice(0, 500)}{audit.feedback.length > 500 ? "…" : ""}</p>
          <button className="text-button" onClick={() => void deleteAudit(audit.id)}>Delete audit</button>
        </article>)}</div> : !notice && <p className="muted-copy">Your audit history will appear here after you generate feedback.</p>}
      </>}
      {!isAuditView && <div className="notice-box"><Eyebrow>Before you apply</Eyebrow><h2>A listing is the start of the research.</h2><p>Confirm official eligibility and the current cycle. Check what the funding covers and record deadlines separately.</p></div>}
    </section>
    </>
  );
}

export function AuditPage() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("Study, scholarships & fellowships");
  const [answers, setAnswers] = useState({ direction: "", experience: "", evidence: "", concerns: "" });
  const [notice, setNotice] = useState("");
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
    const draft = sessionStorage.getItem("careergrill-audit-draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as { goal?: string; answers?: typeof answers; step?: number };
        if (parsed.goal) setGoal(parsed.goal);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.step) setStep(parsed.step);
      } catch {
        sessionStorage.removeItem("careergrill-audit-draft");
      }
    }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function saveDraft() {
    sessionStorage.setItem("careergrill-audit-draft", JSON.stringify({ goal, answers, step }));
    setNotice("Draft saved in this browser tab.");
  }
  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Preparing your feedback…");
    try {
      const result = await apiRequest<{ feedback: string }>("/audits/feedback", { method: "POST", body: JSON.stringify({ goal, answers, consent: true }) });
      setFeedback(result.feedback);
      setNotice("Your action plan is ready and saved to your account.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "We could not prepare feedback.");
    }
  }
  return <div className="audit-page content-wrap"><Link className="text-link" href="/">← Back to Careergrill</Link><div className="audit-intro"><Eyebrow>AI Career Audit</Eyebrow><h1>Where are you now?<br /><em>What comes next?</em></h1><p className="lead">Choose job search or a study application. Share your goal and experience to get feedback on your preparation, gaps and next steps.</p><div className="value-points"><span>Your goal</span><span>Your evidence</span><span>Your next move</span></div><p className="muted-copy">Your work stays yours. Unsaved drafts stay in this browser tab. Sign in to save and generate feedback.</p></div><form className="audit-form" onSubmit={(event) => void generate(event)}><div className="step-label">STEP {step} OF 3</div>{step === 1 ? <><h2>What are you working towards?</h2><p>Pick one direction. The next questions will follow your choice.</p><div className="choice-grid">{["Job search", "Study, scholarships & fellowships"].map((item) => <button type="button" key={item} className={`choice-card ${goal === item ? "selected" : ""}`} onClick={() => setGoal(item)}><strong>{item}</strong><span>{item === "Job search" ? "Find a role or improve my job search." : "A master’s degree, PhD, scholarship or fellowship."}</span></button>)}</div><label>What would you like this opportunity to help you do?<textarea value={answers.direction} onChange={(event) => setAnswers({ ...answers, direction: event.target.value })} rows={4} required placeholder="A specific goal makes the feedback more useful." /></label></> : step === 2 ? <><h2>What experience can you build on?</h2><p>Share only what you are comfortable including. Leave out contact and identification details.</p><label>Your relevant experience<textarea value={answers.experience} onChange={(event) => setAnswers({ ...answers, experience: event.target.value })} rows={5} required placeholder="Work, study, volunteering, projects, responsibilities…" /></label><label>What evidence can you point to?<textarea value={answers.evidence} onChange={(event) => setAnswers({ ...answers, evidence: event.target.value })} rows={4} placeholder="Examples, outcomes, feedback or work you have completed." /></label></> : <><h2>What needs attention?</h2><p>What feels uncertain or would you most like help with?</p><label>Your questions or concerns<textarea value={answers.concerns} onChange={(event) => setAnswers({ ...answers, concerns: event.target.value })} rows={5} placeholder="Deadlines, missing experience, programme fit, interviews…" /></label><label className="consent-row"><input type="checkbox" required /> I understand my answers will be sent to the configured AI provider to generate feedback.</label></>}{notice && <p className="inline-notice" role="status">{notice} {notice.toLowerCase().includes("sign in") && <Link href="/signin">Sign in ↗</Link>}</p>}<div className="form-actions"><button type="button" className="button button-outline" onClick={saveDraft}>Save draft</button>{step > 1 && <button type="button" className="button button-outline" onClick={() => setStep(step - 1)}>Back</button>}{step < 3 ? <button type="button" className="button button-dark" onClick={() => { saveDraft(); setStep(step + 1); }}>Continue</button> : <button className="button button-dark">Generate AI feedback</button>}</div><small>AI feedback has daily usage limits. You can save an incomplete draft and return to it.</small></form>{feedback && <section className="feedback-result"><Eyebrow>Your application direction</Eyebrow><h2>A practical next-step plan.</h2><div>{feedback.split("\n").map((line, index) => <p key={index}>{line}</p>)}</div></section>}<div className="audit-foot"><button className="text-button" onClick={() => { sessionStorage.removeItem("careergrill-audit-draft"); setAnswers({ direction: "", experience: "", evidence: "", concerns: "" }); setFeedback(""); setStep(1); setNotice("This tab’s draft has been cleared."); }}>Clear this tab’s draft</button><Link href="/faq">Questions about the audit? ↗</Link></div></div>;
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
