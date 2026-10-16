"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { serviceFaqs, servicePages, type ServicePageData } from "@/lib/services";
import type { SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import RichContent from "@/components/rich-content";

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
    <>
      <section className="services-hero">
        <div className="services-hero-inner content-wrap">
          <div>
            <Eyebrow>Careergrill services</Eyebrow>
            <h1>Support with jobs,<br /><em>admissions and MBA<br />applications.</em></h1>
            <p>Get help with CVs, LinkedIn, interviews, graduate applications, scholarships and fellowships. Choose a service or discuss what you need.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/consultation?mode=call">Book a free 15-minute call <span aria-hidden="true">↗</span></Link>
              <Link className="text-link" href="/career-audit">Start with a Career Audit</Link>
            </div>
          </div>
          <aside className="services-start-card">
            <Eyebrow>A useful starting point</Eyebrow>
            <h2>Tell us what you need help with.</h2>
            <ol>
              <li><span>01</span>Your intended role or opportunity</li>
              <li><span>02</span>The experience you can build on</li>
              <li><span>03</span>Your draft, questions and deadline</li>
            </ol>
            <p>Careergrill is led by Sanni Alausa-Issa. Discuss your goal, the work involved, the fee and the delivery date before you decide.</p>
          </aside>
        </div>
      </section>

      <section className="content-wrap services-section services-offers">
        <div className="section-heading">
          <div><Eyebrow>Choose your support</Eyebrow><h2>What needs attention?</h2></div>
          <p>Choose the document or application you want help with. If you’re unsure, start with a free 15-minute call.</p>
        </div>
        <div className="services-offer-grid">
          {servicePages.map((service, index) => (
            <ServiceOfferCard key={service.slug} service={service} index={index} />
          ))}
          {cmsServices.map((service) => (
            <article className="services-offer-card" key={service.id}>
              <span className="service-index">{service.category || "CAREERGRILL SUPPORT"}</span>
              <h3>{service.title}</h3>
              {service.excerpt ? <p>{service.excerpt}</p> : <RichContent value={service.body} className="service-rich-content" />}
              <Link className="button button-outline" href={`/services/${encodeURIComponent(service.slug)}`}>Explore service <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
        {serviceLoadError && <p className="services-load-error" role="status">{serviceLoadError}</p>}
      </section>

      <section className="content-wrap services-audit-callout">
        <div>
          <Eyebrow>Still exploring?</Eyebrow>
          <h2>Start by understanding<br />your preparation.</h2>
          <p>The AI Career Audit has paths for job seekers and study, scholarship or fellowship applicants. Get feedback on the experience you share and a practical set of next steps.</p>
          <Link className="button button-primary" href="/career-audit">Start an AI Career Audit</Link>
        </div>
        <aside>
          <span>Your starting point</span>
          <div><strong>What can you build on?</strong><p>Relevant study, work, research or service.</p></div>
          <div><strong>What needs a closer look?</strong><p>Fit, evidence, requirements and timing.</p></div>
          <div><strong>What comes next?</strong><p>AI feedback you can use, with optional human support if you want it.</p></div>
        </aside>
      </section>

      <section className="content-wrap services-section services-process">
        <div className="section-heading">
          <div><Eyebrow>How the work starts</Eyebrow><h2>Know what you’re getting.</h2></div>
          <p>Confirm what the service includes before work starts, then use the feedback to revise your documents.</p>
        </div>
        <div className="services-process-grid">
          <article><span>01 / TALK IT THROUGH</span><h3>Explain where you are</h3><p>Bring your goal, current documents, official instructions and the questions you need help answering.</p></article>
          <article><span>02 / AGREE THE WORK</span><h3>Agree what’s included</h3><p>Confirm the documents or sessions, review rounds, fee and delivery date.</p></article>
          <article><span>03 / WORK WITH FEEDBACK</span><h3>Revise with a purpose</h3><p>Use specific feedback to develop your application or documents while keeping your experience and voice intact.</p></article>
        </div>
      </section>

      <section className="content-wrap services-section services-fees">
        <div className="section-heading">
          <div><Eyebrow>Fees &amp; next steps</Eyebrow><h2>Know the cost before<br />the work begins.</h2></div>
          <p>Start with a short conversation. Paid support begins after you agree the work and fee.</p>
        </div>
        <div className="services-fee-grid">
          <article>
            <Eyebrow>First conversation</Eyebrow><h3>Free 15-minute consultation</h3><strong>No consultation fee</strong>
            <p>Explain your goal, ask about the support available and decide on a suitable next step.</p>
            <ul><li>Discuss your situation and deadline</li><li>Clarify the service you may need</li><li>A full document review is arranged separately</li></ul>
            <Link className="button button-dark" href="/consultation?mode=call">Arrange a free call</Link>
          </article>
          <article>
            <Eyebrow>Document &amp; application support</Eyebrow><h3>Get a quote for the support you need</h3><strong>Fee agreed before work starts</strong>
            <p>CVs, LinkedIn, interviews, admissions and MBA applications have different requirements.</p>
            <ul><li>Confirm the documents and deliverables</li><li>Agree review rounds and delivery date</li><li>Receive and accept the fee before paid work begins</li></ul>
            <Link className="button button-outline" href="/consultation">Ask for a quote</Link>
          </article>
        </div>
      </section>

      <section className="content-wrap services-section services-answers">
        <div className="services-answers-intro">
          <Eyebrow>Before you book</Eyebrow><h2>A few useful answers.</h2>
          <p>Have a different question? Bring it to the first conversation.</p>
          <Link className="text-link" href="/faq">Read all FAQs</Link>
        </div>
        <div className="services-faq-list">
          {serviceFaqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="content-wrap services-feedback">
        <div><Eyebrow>A client’s perspective</Eyebrow><h2>Read about the support<br />behind the application.</h2><p>Read a client’s feedback on Careergrill’s statement support.</p></div>
        <Link className="button button-outline" href="/client-feedback">Read client feedback <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}

function ServiceOfferCard({ service, index }: { service: ServicePageData; index: number }) {
  return (
    <article className="services-offer-card">
      <span className={`service-index service-index-${index + 1}`}><small>{service.category}</small></span>
      <h3>{service.overviewTitle}</h3>
      <p>{service.overviewText}</p>
      <ul>{service.overviewBullets.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
      <Link className="button button-outline" href={`/services/${service.slug}`}>
        Explore {service.slug === "graduate-applications" ? "graduate" : service.slug === "career-documents" ? "career" : "MBA"} support <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

export function ServiceDetailPage({ service }: { service: ServicePageData }) {
  return (
    <article className="content-wrap service-detail-page">
      <Link className="service-back-link" href="/services">All services</Link>
      <header className="service-detail-heading">
        <Eyebrow>{service.category}</Eyebrow>
        <h1>{service.title}</h1>
        <p>{service.excerpt}</p>
      </header>
      <div className="service-detail-offers">
        {service.offers.map((offer) => (
          <section key={offer.title}>
            <h2>{offer.title}</h2>
            <p>{offer.audience}</p>
            <ul>{offer.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            <Link className="button button-primary" href={offer.href}>{offer.callToAction}</Link>
          </section>
        ))}
      </div>
      <aside className="service-detail-note">
        <h2>{service.noteTitle}</h2>
        <p>{service.note}</p>
        <Link className="text-link" href="/consultation">Speak to Careergrill</Link>
      </aside>
    </article>
  );
}
