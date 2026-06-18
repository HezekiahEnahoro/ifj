# Portfolio Template — Admin-Editable, No Database

A Next.js 16 portfolio site built for Tableau / data visualization developers (or easily adapted for any role). Every piece of content — profile, skills, projects, experience, education, contact info, FAQs — is editable from a built-in `/admin` panel. There is no database and no SQL schema: all content lives in a single JSON blob, stored via Vercel Blob in production and a local JSON file during development.

## How content storage works

- **Local dev** (no `BLOB_READ_WRITE_TOKEN` set): content is read from / written to `portfolio-data.json` at the project root, and uploaded images/PDFs go to `public/uploads/`. Both are git-ignored — they're throwaway local test data.
- **Production** (Vercel, with a Blob store connected): the same code reads/writes a `portfolio-data.json` blob and uploads files to Vercel Blob instead. No code changes between environments — it's detected automatically from the presence of `BLOB_READ_WRITE_TOKEN`.

This means you can fully build and test the site locally with zero cloud accounts, then deploy and the exact same admin panel starts writing to real cloud storage.

## Local development

```bash
npm install
npm run dev      # localhost:3000, Turbopack
npm run build    # production build
npm run lint
```

Copy `.env.local.example` to `.env.local` and fill in at minimum `ADMIN_PASSWORD` and `ADMIN_SESSION_VALUE` — that's enough to log in to `/admin` locally and test everything end-to-end.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | Yes | Password to log in to `/admin`. |
| `ADMIN_SESSION_VALUE` | Yes | Random secret used to sign the admin session cookie. Generate at [generate-secret.vercel.app/64](https://generate-secret.vercel.app/64). |
| `BLOB_READ_WRITE_TOKEN` | Production only | Auto-injected by Vercel once you connect a Blob store. Leave unset locally to use the filesystem fallback. |
| `RESEND_API_KEY` | Optional | Enables the contact form to actually send emails via [Resend](https://resend.com) (free tier: 3,000/month). Without it, submissions are just logged server-side and the form still returns success. |
| `CONTACT_EMAIL` | Optional | Where contact form submissions are delivered, if `RESEND_API_KEY` is set. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Full production URL, used for Open Graph / social share metadata. |

## Deploying for a client

1. Push this repo to GitHub.
2. Import the repo on [vercel.com](https://vercel.com) — it auto-deploys.
3. In the Vercel dashboard: **Storage → Create Database → Blob** (one click, free tier is generous).
4. **Settings → Environment Variables**: add `ADMIN_PASSWORD`, `ADMIN_SESSION_VALUE`, and optionally `RESEND_API_KEY` / `CONTACT_EMAIL` / `NEXT_PUBLIC_SITE_URL`. `BLOB_READ_WRITE_TOKEN` is added automatically when you connect the Blob store in step 3.
5. Redeploy. The site is live with empty/placeholder content.

Each deployment is fully isolated — its own password, its own Blob store, its own data — so this same codebase can be redeployed for a different client with no code changes, just different environment variable values per project.

## Handing off to the client

Send them:
- The live URL + `/admin/login`
- The password you set as `ADMIN_PASSWORD`

Then have them work through the admin sections in this order:

1. **Profile** — name, title, tagline, bio, photo, resume PDF, social links, homepage stats, homepage highlight cards, "what drives me" cards, navbar logo text, and which skills float around the homepage photo.
2. **Skills** — add their actual skills/tools; the first few (or a hand-picked subset, set in Profile) appear as floating chips on the homepage.
3. **Projects** — add real project case studies (featured ones show on the homepage).
4. **Background** — work experience and education entries.
5. **Contact** — location, contact page tagline, availability blurb, and FAQs.

Everything saves immediately and reflects live on the site — no rebuild or redeploy needed per content change.
