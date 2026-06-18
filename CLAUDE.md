# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What this is

A Next.js 16 portfolio template with a built-in admin panel — every piece of content (profile, skills, projects, experience, education, contact info, FAQs) is editable at `/admin` by a non-technical site owner. There is no database: all content lives in a single JSON blob, stored via Vercel Blob in production and a local JSON file during development. See `README.md` for the full setup/deploy/handover walkthrough.

This is a template intended to be deployed per-client/per-site. Each deployment is fully isolated — its own `ADMIN_PASSWORD`, its own Blob store, its own data — via environment variables, with no code changes required between deployments.

---

## Commands

```bash
npm install
npm run dev      # Start dev server with Turbopack (localhost:3000)
npm run build    # Production build with Turbopack
npm run start    # Start production server after build
npm run lint     # Run ESLint
```

No test runner is configured. TypeScript type-checking: `npx tsc --noEmit`.

---

## Environment Variables

Copy `.env.local.example` to `.env.local`. See the table in `README.md` for what each variable does. At minimum, `ADMIN_PASSWORD` and `ADMIN_SESSION_VALUE` are needed to log in to `/admin` locally — everything else (`BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL`) is optional for local dev and only required in production.

---

## Architecture

### Content storage — `src/lib/data.ts`

`readData()` / `writeData()` are the single entry point for all content. They detect environment via `IS_LOCAL = !process.env.BLOB_READ_WRITE_TOKEN`:
- **Local** (no token): reads/writes `portfolio-data.json` at the project root; file uploads go to `public/uploads/`. Both are git-ignored — throwaway local test data.
- **Production** (token present): reads/writes a `portfolio-data.json` blob via `@vercel/blob`; uploads go to Vercel Blob too.

`DEFAULT_DATA` in this file is what a fresh deployment starts with before the site owner fills anything in via `/admin` — keep placeholder content here generic (not tied to any specific person/brand).

Types for all content (`Profile`, `Project`, `Skill`, `Experience`, `Education`, `HighlightCard`, `FAQ`) live in `src/lib/types.ts`.

### Public-facing routes (`src/app/`)

| Route | File | Notes |
|---|---|---|
| `/` | `page.tsx` → `HomeClient.tsx` | Hero with drifting photo + floating skill badges, highlights, stats, featured projects |
| `/about` | `about/page.tsx` → `AboutClient.tsx` | Bio, "what drives me" cards, experience, education |
| `/projects` | `projects/page.tsx` → `ProjectsClient.tsx` | Filterable grid of all projects |
| `/projects/[slug]` | `projects/[slug]/page.tsx` | Project detail |
| `/skills` | `skills/page.tsx` → `SkillsClient.tsx` | Skills grid |
| `/contact` | `contact/page.tsx` → `ContactClient.tsx` | Contact form + FAQ, editable via admin |

Every public route follows the same split: an `async` server component reads data via `readData()` and passes it as props into a `"use client"` component that handles the Framer Motion / `useInView` animation.

### Admin panel (`src/app/admin/`, `src/app/api/admin/`)

- `src/proxy.ts` (Next 16's replacement for `middleware.ts`) guards every `/admin/*` route except `/admin/login`, checking the `admin_session` cookie against `process.env.ADMIN_SESSION_VALUE`.
- `/api/admin/auth` — POST validates `ADMIN_PASSWORD` and sets the session cookie; DELETE logs out.
- `/api/admin/profile`, `/api/admin/skills`, `/api/admin/projects`, `/api/admin/experience`, `/api/admin/education` — CRUD over the relevant slice of `PortfolioData`. POST handlers generate `id: crypto.randomUUID()` server-side — never trust a client-supplied id for new items.
- `/api/admin/upload` — handles photo/resume file uploads, same `IS_LOCAL` branching as `data.ts`.
- Admin pages under `src/app/admin/*/page.tsx` are client components that fetch from these routes and render forms. `src/app/admin/layout.tsx` is the sidebar shell.

### Animation pattern

Every public page uses the same two-library pattern:
```tsx
const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
<motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} />
```
`react-intersection-observer` for scroll-triggering, `framer-motion` for the actual animation. All interactive pages are `"use client"`.

### Styling

TailwindCSS v4. Design language: dark background, cyan/violet gradient accents (`var(--cyan)`, `var(--violet)` etc. defined in `globals.css`), `glass`/`glass-hover` utility classes for frosted-glass cards, Syne (headings) + DM Sans (body) fonts.

### Dynamic favicon

`src/app/icon.tsx` generates a favicon from the profile name's initials via `next/og`'s `ImageResponse` — no static favicon file to maintain per deployment.

---

## Key Files to Know

| File | Purpose |
|---|---|
| `src/lib/data.ts` | Content storage, `DEFAULT_DATA`, `IS_LOCAL` detection — start here for any data-shape change |
| `src/lib/types.ts` | All content type definitions |
| `src/proxy.ts` | Admin route auth guard |
| `src/components/ClientWrapper.tsx` | Fetches profile client-side for Navbar logo + Footer branding on public pages |
| `README.md` | Setup, env vars, deployment, and client handover instructions |
