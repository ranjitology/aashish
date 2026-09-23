# Aashish Kumar Jha — Portfolio + Admin Panel

Modern, SEO-friendly portfolio site with a secure admin panel, built for **Vercel** deployment.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui-style components · Prisma (PostgreSQL) · NextAuth.js (Credentials) · Vercel Blob · Resend

---

## Features

### Public site (single page, ISR)
- Hero with photo, NEC Registered Engineer [78836] verified badge, tagline, Download CV / Get in Touch CTAs
- About (Markdown, admin-managed), Experience timeline, Education table
- Projects & research card grid (Project / Research / Thesis badges + optional PDF attachment)
- Skills & tools tag lists, Professional memberships (NEC / NEA), Testimonials
- Contact form → saved to database **and** emailed via Resend
- Deep-navy + sky-blue + teal palette, topographic contour motifs, dark mode, fully responsive
- Dynamic metadata, Open Graph image, `sitemap.xml`, `robots.txt`

### Admin panel (`/admin`)
- **Auth:** NextAuth Credentials, JWT sessions (7 days), single admin — no public sign-up
- **Protection:** middleware redirects unauthenticated `/admin/*` requests to `/admin/login`; every server action re-checks the session
- **Dashboard:** overview cards (projects, messages, unread count, last updated) + recent messages
- **CRUD:** Profile/About (incl. photo + CV upload), Experience, Education, Projects (file upload), Skills, Memberships, Testimonials (approve/unpublish), Messages inbox (read/unread/delete)
- **UX:** sidebar dashboard (collapsible on tablet/mobile), toasts, delete confirmation modals, reorder controls, Markdown long-form fields

---

## Project structure

```
├── prisma/
│   ├── schema.prisma          # Data model (PostgreSQL)
│   ├── seed.ts                # Initial admin + portfolio content
│   └── migrations/            # Initial migration (deploy-ready)
├── public/uploads/            # Local file storage (dev only; use Blob in prod)
├── src/
│   ├── middleware.ts          # /admin route protection
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config (credentials, JWT)
│   │   ├── content.ts         # Public content fetch with graceful fallbacks
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── email.ts           # Resend notifications
│   │   ├── storage.ts         # Vercel Blob (falls back to /public/uploads locally)
│   │   └── actions/           # Server actions (zod-validated, auth-guarded)
│   ├── components/
│   │   ├── site/              # Public site sections
│   │   ├── admin/             # Dashboard shell, managers, forms
│   │   └── ui/                # shadcn/ui-style primitives
│   └── app/
│       ├── page.tsx           # Public site (revalidate = 60)
│       ├── sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
│       └── admin/
│           ├── login/         # Public login page
│           └── (dashboard)/   # Protected admin pages
└── .env.example
```

---

## Local setup

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Fill in:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Supabase / Neon / Vercel Postgres) |
| `DIRECT_URL` | Direct (non-pooler) URL if your provider uses a pooled URL |
| `NEXTAUTH_URL` | `http://localhost:3000` locally; your production URL on Vercel |
| `NEXTAUTH_SECRET` | `npx auth secret` or `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Initial admin login (used by seed) |
| `BLOB_READ_WRITE_TOKEN` | Optional locally — omit to store uploads in `public/uploads` |
| `RESEND_API_KEY` | Optional — omit and messages are still saved to the DB |
| `CONTACT_TO_EMAIL` | Where contact-form notifications are sent |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used in metadata / sitemap |

Free Postgres options: [Supabase](https://supabase.com), [Neon](https://neon.tech), or Vercel Postgres.

### 3. Migrate + seed

```bash
npx prisma migrate deploy   # applies prisma/migrations
npm run db:seed             # creates admin + demo content
```

During development you can also use `npm run db:push` (skips migration history).

### 4. Run

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login (use `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

---

## Deploying to Vercel

1. **Push to GitHub**, then import the repo at vercel.com (framework preset: **Next.js** — auto-detected).
2. **Create a Postgres database** (Vercel Marketplace → Postgres/Neon/Supabase) and copy `DATABASE_URL` (and `DIRECT_URL` if provided).
3. **Blob storage:** Project → Storage → Blob → create → connect. Vercel auto-sets `BLOB_READ_WRITE_TOKEN`.
4. **Set environment variables** (Project → Settings → Environment Variables):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | from the database connection pooler |
   | `DIRECT_URL` | direct URL (if different) |
   | `NEXTAUTH_SECRET` | generated secret |
   | `NEXTAUTH_URL` | `https://your-domain.vercel.app` (or custom domain) |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | seed-time only; change password afterwards in Settings |
   | `BLOB_READ_WRITE_TOKEN` | auto-injected by storage integration |
   | `RESEND_API_KEY` | optional, from resend.com |
   | `CONTACT_TO_EMAIL` | your inbox |
   | `CONTACT_FROM_EMAIL` | e.g. `Portfolio <onboarding@resend.dev>` (verify your domain on Resend for production) |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` |

5. **Build command:** default `npm run build` (the `postinstall` hook runs `prisma generate`).
   For production migrations, either:
   - add a Vercel **build override**: `npx prisma migrate deploy && npm run build`, or
   - run `npx prisma migrate deploy` manually from your machine/CI after schema changes.

6. **First run on production:** seed once against the production database:

   ```bash
   DATABASE_URL="..." DIRECT_URL="..." ADMIN_PASSWORD="..." npx tsx prisma/seed.ts
   ```

   Then sign in at `/admin/login` and change the password under **Settings**.

---

## Admin account creation

- The seed **upserts** one admin from `ADMIN_EMAIL` + `ADMIN_PASSWORD` (bcrypt, cost 12).
- To add another admin later, upsert a `User` row with a bcrypt hash — but the product intent is a **single admin**; registration endpoints intentionally do not exist.
- Rotate the password any time via `/admin/settings`.

---

## Content editing notes

- **Markdown** is supported in *Objective*, *Experience description* and *Project description* (`**bold**`, lists, `###` headings, GFM tables).
- Saves trigger `revalidatePath` — public pages refresh within the ISR window (`revalidate = 60`), no redeploy needed.
- **Files:** without `BLOB_READ_WRITE_TOKEN`, uploads land in `public/uploads` (fine for dev; ephemeral on Vercel serverless — configure Blob for production).
- **Testimonials** must be approved before appearing publicly.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:seed` | Seed admin + content |
| `npm run db:migrate` | `prisma migrate deploy` |
| `npm run db:migrate:dev` | Dev migrations (needs live DB) |
| `npm run db:studio` | Prisma Studio |
