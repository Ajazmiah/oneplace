# OneTrack

OnePlace is a job application tracker. It lets you log every job you apply to — role, company, status, resume, cover letter, job description, salary range — and follow each one through the hiring pipeline from a single dashboard. A companion Chrome extension detects when you're on a job posting (LinkedIn, Indeed, Greenhouse, Lever) and lets you save it to OneTrack in one click, pre-filled from the page.

This is a [Turborepo](https://turborepo.dev) monorepo containing the web app, the browser extension, and shared packages.

## Repo layout

```
jobprep/
├── apps/
│   ├── onetrack-web-app/         Next.js dashboard (the main product)
│   └── onetrack-chrome-extension/ Chrome extension (Manifest V3)
└── packages/
    ├── ui/                      Shared React components (@repo/ui)
    ├── eslint-config/           Shared ESLint config
    └── typescript-config/       Shared tsconfig base
```

## Tech stack

**Web app** (`apps/onetrack-web-app`)
- [Next.js 16](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/), plus the official MongoDB driver for the NextAuth adapter
- [NextAuth v5](https://authjs.dev/) for authentication (GitHub + Google OAuth)
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI primitives)
- [Sonner](https://sonner.emilkowal.ski/) for toast notifications

**Chrome extension** (`apps/onetrack-chrome-extension`)
- React 19 + TypeScript, bundled with [Vite](https://vitejs.dev/)
- Manifest V3: a background service worker detects job posting pages and a content script injects a form to capture the listing and send it to the web app's API

**Tooling**
- [Turborepo](https://turborepo.dev) for task orchestration/caching across the monorepo
- npm workspaces
- Shared ESLint + TypeScript configs in `packages/`

## What it does

- **Track applications** — add a job with title, company, location, status, job URL, description, and salary range, and attach a resume and cover letter (stored as files in MongoDB).
- **Dashboard view** — see all applications with search/filter by status, and summary counts (applied, interviewing, offer, rejected, etc.).
- **Detail view** — open any application to view/download the attached resume or cover letter, edit its details, or delete it.
- **Capture from the browser** — the Chrome extension watches for job pages on LinkedIn, Indeed, Greenhouse, and Lever, and offers to save the listing straight into OneTrack without retyping it.
- **Auth** — sign in with GitHub or Google; new accounts are created automatically on first sign-in.

## Getting started

### Prerequisites

- Node.js ≥ 18
- npm (this repo uses npm workspaces, `packageManager: npm@10.8.2`)
- A MongoDB connection string (e.g. a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- OAuth apps for [GitHub](https://github.com/settings/developers) and [Google](https://console.cloud.google.com/apis/credentials) (for sign-in)

### 1. Install dependencies

From the repo root:

```bash
npm install
```

### 2. Configure environment variables

Create `apps/onetrack-web-app/.env.local` with:

```bash
MONGO_URI=your-mongodb-connection-string
AUTH_SECRET=a-random-secret          # e.g. `npx auth secret`
NEXTAUTH_URL=http://localhost:3000
BASE_URL=http://localhost:3000
AUTH_GITHUB_ID=your-github-oauth-client-id
AUTH_GITHUB_SECRET=your-github-oauth-client-secret
AUTH_GOOGLE_ID=your-google-oauth-client-id
AUTH_GOOGLE_SECRET=your-google-oauth-client-secret
```

### 3. Run the web app

From the repo root (runs all apps' `dev` scripts via Turborepo):

```bash
npm run dev
```

Or just the web app:

```bash
npm run dev --workspace=onetrack-web-app
```

The app runs at [http://localhost:3000](http://localhost:3000).

### 4. Run the Chrome extension (optional)

```bash
npm run dev --workspace=onetrack-chrome-extension
```

This watches and rebuilds the extension into `apps/onetrack-chrome-extension/dist`. Then load it into Chrome:

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select `apps/onetrack-chrome-extension/dist`

### Other commands

Run from the repo root, across all workspaces:

```bash
npm run build         # production build
npm run lint          # lint all workspaces
npm run check-types   # TypeScript checks
npm run format        # prettier --write
```
