# Careergrill website

Next.js frontend for the Careergrill public website and content-management dashboard.

## Structure

- `app/(site)/`: public website route group. The group layout owns the public header, sign-in strip, footer, and shared site frame; the group name does not appear in URLs.
- Public content uses type-specific detail routes: `/job/{slug}`, `/scholarship/{slug}`, `/blog/{slug}`, `/resources/{slug}`, `/services/{slug}`, `/faq/{slug}`, and `/client-feedback/{slug}`.
- `app/dashboard/`: private dashboard pages. Its shared layout keeps the authenticated content studio mounted while navigating between `/dashboard/jobs`, `/dashboard/scholarships`, `/dashboard/blog`, `/dashboard/resources`, `/dashboard/services`, `/dashboard/faqs`, `/dashboard/feedback`, overview, AI studio, files, and settings.
- Dashboard pages require an authenticated account with the `admin` role. The API enforces authorization independently on every admin endpoint; frontend checks are for access flow and user feedback, not the security boundary.
- `app/layout.tsx`: root document, fonts, global styles, and metadata.
- `components/site-shell.tsx`: public header/footer and shared site chrome.
- `components/job-detail/`: focused job-page header, facts, application, eligibility, preparation, source, and preview components. The location/eligibility callout and application instructions are editable from the dashboard.
- `components/scholarship-detail/`: shared scholarship detail layout used by the public route and the CMS reader preview, with editable funding, eligibility, and provider-record details.
- `components/services-page.tsx` and `lib/services.ts`: shared, data-driven service overview and the graduate-application, career-document, and MBA service detail pages, with their booking answers and links.
- `components/blog-pages.tsx` and `lib/blog-content.ts`: searchable, topic-filtered blog listing and a responsive article reader with cover artwork, generated contents links, related resources, and published-article fallback content.
- `components/public-site.tsx`, `components/admin-console.tsx`, and `components/rich-text-editor.tsx`: interactive site and dashboard views, including the multi-step AI Career Audit and its administrator-configurable feedback instructions, plus a Word-style editor for formatting, links, tables, quotes, and uploaded inline images. Content previews show the reader-facing layout before manual or AI-generated content is published.
- `lib/api.ts`: centralized browser HTTP client. It builds API URLs, sends credentials, sets JSON headers only for JSON request bodies, and reports structured API errors. The frontend talks to the separately deployable API over HTTP and does not import backend code.
- Tailwind CSS 4 is configured in `app/globals.css`; its theme tokens match the prototype cream, ink-purple, and orange palette.
- `.env.example`: optional API origin configuration for local development and deployment.
- `/signin` supports email/password accounts and redirects Google sign-in through the backend OAuth flow.
- Legacy `/admin` URLs permanently redirect to the `/dashboard` route family.

## Local development

1. Follow the Supabase and backend setup in [`../backend/README.md`](../backend/README.md).
2. Optionally set `NEXT_PUBLIC_API_URL` to the API origin. It defaults to `http://localhost:4000`.
3. Install dependencies and start the website:

   ```sh
   npm install
   npm run dev
   ```

Visit `http://localhost:3000`. The API's `FRONTEND_URL` must match the website origin. If the API is unavailable, public listings fall back to sample preview content; account, CMS, and persistence features require a configured API and Supabase project.

## Build and lint

```sh
npm run lint
npm run build
```

For production, set `NEXT_PUBLIC_API_URL` to the HTTPS API origin at build time and deploy the frontend with the same origin configured as the backend's `FRONTEND_URL`. Prefer frontend and API hostnames on the same site (for example, `www.example.com` and `api.example.com`) so browsers reliably send the secure session cookie.
