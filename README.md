# Careergrill website

Next.js frontend for the Careergrill public website and content-management dashboard.

## Structure

- `app/(site)/`: public website route group. The group layout owns the public header, sign-in strip, footer, and shared site frame; the group name does not appear in URLs.
- Public content uses type-specific detail routes: `/job/{slug}`, `/scholarship/{slug}`, `/{blog_slug}`, `/resources/{slug}`, `/services/{slug}`, and `/client-feedback/{slug}`. The blog index is paginated at `/blog`; `/blog/{slug}` permanently redirects to `/{slug}`. Blog slugs matching fixed website paths are rejected. FAQs are listed on `/faq` without individual slug pages.
- `app/dashboard/`: private dashboard pages. Its shared layout keeps the authenticated content studio mounted while navigating between `/dashboard/jobs`, `/dashboard/scholarships`, `/dashboard/blog`, `/dashboard/resources`, `/dashboard/services`, `/dashboard/faqs`, `/dashboard/feedback`, overview, AI studio, files, and settings.
- Service fees are editable in Dashboard → Settings → Service pricing and load from the public pricing API on the services page. The UI does not show hard-coded prices when the backend has no configured rates.
- Homepage and services-page business copy, along with package descriptions, inclusions, delivery/payment terms, and cancellation details, load from backend public configuration. If that configuration cannot be loaded, those sections report an error instead of falling back to hard-coded copy.
- `/consultation` uses the backend-provided service guidance, questions, checklist, and closing message for each service choice. Pricing links carry package and price context separately.
- `/faq` presents published answers from the backend FAQ collection; administrators manage them with a title and rich-text editor in the dedicated FAQ dashboard. `/privacy` explains account storage, AI feedback, temporary drafts, enquiries, and data removal.
- Dashboard pages require an authenticated account with the `admin` role. The API enforces authorization independently on every admin endpoint; frontend checks are for access flow and user feedback, not the security boundary.
- `app/layout.tsx`: root document, fonts, global styles, and metadata.
- `lib/seo.ts`, `app/sitemap.ts`, and `app/robots.ts`: shared metadata, canonical URLs, social cards, structured data helpers, and public-content sitemap/robots rules. Set `NEXT_PUBLIC_SITE_URL` to the production origin when it differs from `https://careergrill.com`.
- The content editor's “Search and social sharing” section accepts per-item SEO titles and descriptions and an uploaded OG image; otherwise, metadata uses the item title/introduction and the branded site-wide OG image.
- `components/site-shell.tsx`: public header/footer and shared site chrome.
- `components/job-detail/`: focused job-page header, facts, application, eligibility, preparation, source, and preview components. The location/eligibility callout and application instructions are editable from the dashboard.
- `components/scholarship-detail/`: shared scholarship detail layout used by the public route and the CMS reader preview, with editable funding, eligibility, and provider-record details.
- `components/services-page.tsx` and `lib/services.ts`: shared, data-driven service overview and the graduate-application, career-document, and MBA service detail pages, with their booking answers and links loaded from the backend.
- `components/blog-pages.tsx` and `lib/blog-content.ts`: searchable, topic-filtered backend blog listing and a responsive article reader with cover artwork, generated contents links, and related resources.
- Published FAQs, service pages, consultation guidance, pricing, articles, jobs, scholarships, resources, and testimonials are loaded from the API. Missing content is shown as an empty or error state rather than being replaced by sample data.
- `components/public-site.tsx`, `components/admin-console.tsx`, and `components/rich-text-editor.tsx`: interactive site and dashboard views, including the multi-step AI Career Audit and its administrator-configurable feedback instructions, plus a Word-style editor for formatting, links, tables, quotes, and uploaded inline images. Content previews show the reader-facing layout before manual or AI-generated content is published.
- `lib/api.ts`: centralized browser HTTP client. It builds API URLs, sends credentials, sets JSON headers only for JSON request bodies, and reports structured API errors. The frontend talks to the separately deployable API over HTTP and does not import backend code.
- Tailwind CSS 4 and shadcn/ui are configured in `app/globals.css` and `components.json`; shared primitives live in `components/ui/`, and brand/font tokens match the prototype cream, ink-purple, orange, DM Sans, and Manrope system. Component and page styling belongs in Tailwind classes in the markup. The global stylesheet is limited to theme tokens and site-wide browser/base behavior; CMS-rendered content and the rich-text editor are styled through Tailwind descendant utilities on their wrappers.
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

For separate Vercel and Render deployments, use the frontend's same-origin API proxy so browsers keep the secure session cookie on the Vercel site:

1. In Vercel, set `NEXT_PUBLIC_API_URL=/` and `API_PROXY_TARGET` to the Render API origin (for example, `https://your-api.onrender.com`, without `/api`).
2. In Render, set `FRONTEND_URL` to the exact deployed frontend origin, including `https://` and any `www` prefix.
3. If Google sign-in is enabled, set the backend's `GOOGLE_CALLBACK_URL` to `https://your-frontend-domain/api/auth/google/callback` and add that exact URL as an authorized redirect URI in Google Cloud.
4. Redeploy both services after changing these environment variables.

The proxy forwards `/api/*` requests from the browser to Render, so authentication cookies are set and sent on the Vercel origin rather than as third-party cookies. For direct API access instead, set `NEXT_PUBLIC_API_URL` to the HTTPS API origin; the frontend origin must still exactly match the backend's `FRONTEND_URL`, and cross-site cookie blocking may prevent sessions from persisting.
