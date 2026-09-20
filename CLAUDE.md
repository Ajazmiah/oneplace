# OneTrack (Resumind) — Claude Code Guide

Read [AGENTS.md](AGENTS.md) first: this repo runs Next.js 16, whose APIs differ from older versions. Check `node_modules/next/dist/docs/` before writing Next code.

## Monorepo Layout

npm workspaces + Turborepo (`apps/*`, `packages/*`). Run everything from the repo root with `npm run dev | build | lint`.

```
jobprep/
├── apps/
│   ├── onetrack-web-app/           ← Next.js 16 app (the product) — all paths below are relative to this
│   └── onetrack-chrome-extension/  ← Vite + React/TS MV3 extension (side panel + job-page scraper)
├── packages/
│   ├── ui/                         ← @repo/ui: shared components (QuestionAnswersView), consumed by both apps
│   ├── eslint-config/
│   └── typescript-config/
├── turbo.json                      ← build env vars are declared here (AUTH_*, MONGO_URI, NEXTAUTH_URL, BASE_URL)
└── AGENTS.md
```

## Stack

- **Web app:** Next.js 16 (App Router, `cacheComponents: true`) + React 19, plain JS/JSX
- **Database:** MongoDB via Mongoose
- **Auth:** NextAuth v5 beta (GitHub + Google OAuth), MongoDB adapter
- **UI:** Tailwind CSS 4 + shadcn/ui (Radix), Sonner toasts
- **Extension:** Vite, React, TypeScript, Manifest V3

## Web App Structure (`apps/onetrack-web-app/src`)

```
src/
├── proxy.js                         ← Next 16 replacement for middleware: auth redirects
├── auth.js                          ← NextAuth config (providers, callbacks, adapter)
├── app/
│   ├── layout.js, page.js, not-found.js
│   ├── (pages)/
│   │   ├── signin, signup, about, features, pricing, profile
│   │   └── dashboard/
│   │       ├── layout.js            ← Sidebar + ExtensionAuthSync (pushes user/links/Q&A to extension)
│   │       ├── loading.jsx, error.js
│   │       ├── applications/        ← list page, error.js, [applicationId]/ (detail, edit, not-found)
│   │       ├── add-application/, interview-answers/, add-interview-answer/, settings/
│   ├── api/
│   │   ├── auth/[...nextauth]/      ← NextAuth handler
│   │   ├── user/                    ← GET: does user exist by email
│   │   ├── social-links/
│   │   ├── default-resume/          ← GET: saved default resume metadata
│   │   └── application/
│   │       ├── add-application/     ← POST: create application (used by web form AND extension)
│   │       └── [id]/resume | coverletter ← GET: stream file Buffer from DB
│   └── lib/
│       ├── DataAccessLayer/         ← reads ("use server" + "use cache"): applications, defaultResume,
│       │                              socialLinks, getQuestionsAndAnswers, account, getSession
│       ├── actions/
│       │   ├── applications/applicationActions.js  ← editApplication, deleteApplication
│       │   └── authentication/                     ← signup/auth actions
│       └── utils/                   ← databaseUtils (getUserByEmail), getCachedSession,
│                                      utils (formatDate, getBuffer, validateFile + limits)
├── Components/                      ← Applications/ (forms, table, cards), JobDetails, Sidebar, header,
│                                      QuestionAnswers, Profile, ExtensionAuthSync, ui/ (shadcn)
└── database/
    ├── dbConnection.js              ← Mongoose connect, cached on global
    └── models/                      ← userModel (incl. socialLinks), addApplicationModel,
                                       defaultResume, questionAndAnswerModel
```

Path alias: `@/` → `src/`.

## Auth and Sessions

- `getCachedAuthSession()` (`lib/utils/getCachedSession.js`): returns the session or `null`, connects the DB. Use it in **API routes** so signed-out callers get a JSON 401.
- `getUserSession()` (`lib/DataAccessLayer/getSession.js`): wraps the above but calls `redirect("/signin")` when there is no session. Use it in **pages, server components and server actions**. Never in a route the extension calls: it turns a 401 into a redirect to HTML.
- `proxy.js` guards `/dashboard/*`, `/settings/*`, `/profile/*`, and sends signed-in users away from `/`, `/signin`, `/signup`.
- Every query on user data must filter by `userId` (see `deleteApplication`, `editApplication`). Server actions are public endpoints: the caller picks the arguments, so a session alone does not prove ownership of an id.

## Chrome Extension Integration

- The extension POSTs multipart form data to `/api/application/add-application` and depends on it being a real HTTP route. Do not convert it to a server action.
- Web app → extension: `ExtensionAuthSync` sends `AUTH_STATE` (user, social links, Q&A) via `chrome.runtime.sendMessage(NEXT_PUBLIC_EXTENSION_ID, …)`. The extension accepts it only from `http://localhost:3000` (`externally_connectable` + `background.js`).
- Base URLs in the extension are hard-coded to `http://localhost:3000` (`SidePanel.tsx`, `manifest.json`); they must change for a deployed site.

## Data Flows

**Create.** `ApplicationForm` (client) or the extension → `POST /api/application/add-application` → session check (401) → user lookup → validate required fields and files → `Application.create` → upsert `defaultResume` (when a new resume was uploaded) → `revalidateTag` → toast + redirect.

**Read.** `applications/page.js` (server) → `getApplications()` (cached, tagged `applications-<userId>`) → `ApplicationTable`. Detail: `getSingleApplication(id)` (tagged `application-<id>`) → `JobDetails`. File `data` buffers are excluded from list/detail queries and only streamed by the `resume`/`coverletter` routes.

**Update.** `JobDetails` "Edit" stores the application in `localStorage` → `edit/page.js` (client) reads it → `EditApplicationForm` → `editApplication(id, formData)` server action (finds by `_id` + `userId`, validates files, saves, `revalidateTag`).

**Delete.** `AlertDialog` confirm → `deleteApplication(id)` (filters by `userId`) → `revalidateTag`.

## Key Patterns

- **Caching:** reads use `"use cache"` with `cacheLife("hours")` and `cacheTag`. Every mutation must `revalidateTag` the matching tags (`applications-<userId>`, `application-<id>`, `default-resume-<userId>`).
- **File storage:** resume/cover letter are raw Buffers inside the Mongo document (not S3).
- **Upload validation:** `validateFile()` in `lib/utils/utils.js` (PDF/DOC/DOCX, max 5MB) runs server-side in the add route and `editApplication`. The add form also checks type and size client-side, with the 5MB limit hard-coded there. Keep the two in sync.
- **Default resume:** one `defaultResume` doc per user, upserted on `userId`. Older data may still contain duplicates.
- **Errors:** API routes return JSON `{ success, message }` with a fixed message on 500 (log details server-side, never return the raw error). Forms surface `message` via Sonner toasts. Route segments have `loading.jsx` / `error.js` at `dashboard/` and `applications/`.
- **Server vs client:** list/detail pages, layouts and `Header` are server components; forms, table, `JobDetails`, `Sidebar`, `Navigation` and the edit page are client components.
- **Edit state handoff:** application passes through `localStorage` between detail and edit pages.
