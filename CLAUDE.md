# JobPrep (Resumind) — Claude Code Guide

## Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Database:** MongoDB via Mongoose
- **Auth:** NextAuth v5 (GitHub + Google OAuth)
- **UI:** Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- **Notifications:** Sonner (toast)

---

## Project Tree

```
jobprep/
├── src/
│   ├── app/
│   │   ├── layout.js                        ← Root layout: Header + Footer + Toaster
│   │   ├── page.js                          ← Home: landing or dashboard redirect
│   │   ├── globals.css
│   │   │
│   │   ├── (pages)/                         ← Route group (no URL segment)
│   │   │   ├── signin/page.jsx              ← OAuth sign-in (GitHub, Google)
│   │   │   ├── signup/page.jsx
│   │   │   ├── about/page.js
│   │   │   └── dashboard/
│   │   │       ├── layout.js                ← Dashboard shell: wraps all /dashboard/* with Sidebar
│   │   │       ├── loading.jsx
│   │   │       ├── applications/
│   │   │       │   ├── page.js              ← [SERVER] fetches all apps → renders ApplicationTable
│   │   │       │   ├── loading.jsx
│   │   │       │   ├── error.js
│   │   │       │   └── [applicationId]/
│   │   │       │       ├── page.js          ← [SERVER] fetches single app → renders JobDetails
│   │   │       │       ├── not-found.js
│   │   │       │       └── edit/page.js     ← [CLIENT] reads localStorage → renders ApplicationForm
│   │   │       ├── add-application/
│   │   │       │   └── page.js              ← [CLIENT] empty ApplicationForm
│   │   │       ├── add-application-answers/
│   │   │       │   └── page.js
│   │   │       └── application-answers/
│   │   │           └── page.js
│   │   │
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.js  ← NextAuth handler (OAuth callback)
│   │   │   ├── user/route.js                ← GET: check if user exists by email
│   │   │   └── application/
│   │   │       ├── add-application/route.js ← POST: create new application + file upload
│   │   │       └── [id]/
│   │   │           ├── resume/route.js      ← GET: stream resume Buffer from DB
│   │   │           └── coverletter/route.js ← GET: stream cover letter Buffer from DB
│   │   │
│   │   └── lib/
│   │       ├── DataAccessLayer/
│   │       │   ├── applications.js          ← Server actions: getApplications, getSingleApplication,
│   │       │   │                                editApplication, deleteApplication
│   │       │   └── getSession.js            ← getUserSession(): auth check + DB connect
│   │       ├── actions/
│   │       │   └── authentication/
│   │       │       ├── authenticationAction.js
│   │       │       └── signupAction.js      ← Server action: create user on OAuth signup
│   │       └── utils/
│   │           ├── databaseUtils.js         ← getUserByEmail()
│   │           └── utils.js                 ← formatDate(), getBuffer() (File → Buffer)
│   │
│   ├── Components/
│   │   ├── Applications/
│   │   │   ├── ApplicationForm.js           ← [CLIENT] shared form: add + edit (file upload)
│   │   │   ├── ApplicationTable.js          ← [CLIENT] list view: search + filter by status
│   │   │   ├── Application.js               ← single app row with status highlight
│   │   │   └── StatusCard.js                ← summary counters (applied/interviewing/etc.)
│   │   ├── JobDetails/
│   │   │   └── JobDetails.js                ← [CLIENT] full detail view: edit/delete/download
│   │   ├── Sidebar/
│   │   │   └── Sidebar.js                   ← [CLIENT] dashboard nav with active-link state
│   │   ├── header/
│   │   │   ├── Header.jsx                   ← [SERVER async] session check → show/hide login
│   │   │   └── navigation/
│   │   │       ├── Navigation.js            ← [CLIENT] main nav bar
│   │   │       └── DropDownMenu.js
│   │   ├── footer/Footer.jsx
│   │   ├── Services/Services.jsx            ← Landing page features section
│   │   ├── AlertDialog/AlertDialog.jsx      ← Confirm-delete modal
│   │   ├── ContextWrapper/ContextWrapper.jsx
│   │   └── ui/                              ← shadcn/ui primitives (button, card, input, etc.)
│   │
│   ├── database/
│   │   ├── dbConnection.js                  ← Mongoose connect w/ global cache
│   │   └── models/
│   │       ├── userModel.js                 ← { fullname, email, password, timestamps }
│   │       ├── addApplicationModel.js       ← { jobTitle, companyName, location, status,
│   │       │                                     resume{Buffer}, coverLetter{Buffer},
│   │       │                                     jobUrl, description, salaryRange, userId }
│   │       └── questionAndAnswerModel.js
│   │
│   ├── context/index.jsx                    ← ApplicationContext (minimal, mostly unused)
│   ├── auth.js                              ← NextAuth config: providers, callbacks, adapter
│   ├── middleware.js                        ← Protects /dashboard/*, /settings/*, /profile/*
│   └── lib/utils.js                         ← shadcn cn() helper
│
├── public/
├── .env / .env.local                        ← MONGO_URI, NEXTAUTH_*, AUTH_GITHUB_*, AUTH_GOOGLE_*
├── next.config.mjs
├── tailwind.config.js
├── components.json                          ← shadcn config
└── jsconfig.json                            ← path alias: @/ → src/
```

---

## Data Flow Diagrams

### Auth Flow

```
User → /signin (page.jsx)
        │
        ├── GitHub or Google OAuth button
        │         │
        │         ▼
        │   OAuth Provider (external)
        │         │
        │         ▼
        │   NextAuth signIn callback (auth.js)
        │         │
        │         ├── fetch /api/user?email=...  ← check if user exists
        │         │         │
        │         │         └── if NOT found:
        │         │               signupAction() → create user in MongoDB
        │         │
        │         └── return true
        │
        ▼
  Session stored in MongoDB (NextAuth adapter)
        │
        ▼
  Redirect → /dashboard/applications

Middleware (middleware.js)
  - /dashboard/* → require session → else redirect /signin
  - /signin      → if session exists → redirect /dashboard/applications
```

### Application CRUD Flow

```
── CREATE ──────────────────────────────────────────────────────────────

/dashboard/add-application (CLIENT page)
  └── ApplicationForm.js (empty)
        │
        │  submit via fetch POST
        ▼
  /api/application/add-application/route.js
        │
        ├── getUserSession()       ← auth check + DB connect
        ├── getUserByEmail(email)  ← find user doc
        ├── parse multipart formData
        ├── getBuffer(file)        ← File → Buffer
        └── Application.create({...userId}) → MongoDB
              │
              └── revalidatePath('/dashboard/applications')
                    │
                    ▼
              toast success → redirect /dashboard/applications


── READ (LIST) ─────────────────────────────────────────────────────────

/dashboard/applications (SERVER page)
  └── getApplications()            ← server action
        │
        ├── getUserSession()
        └── Application.find({ userId }).sort(-createdAt) → MongoDB
              │
              ▼
        ApplicationTable.js (CLIENT)
          ├── StatusCard.js         ← counts per status
          ├── search/filter state (useState)
          └── Application.js rows  → Link → /applications/[id]


── READ (DETAIL) ───────────────────────────────────────────────────────

/dashboard/applications/[applicationId] (SERVER page)
  └── getSingleApplication(id)     ← server action
        │
        └── Application.findById(id) → MongoDB
              │
              ▼
        JobDetails.js (CLIENT)
          ├── status badge, description, salary, location
          ├── "View Resume"      → /api/application/[id]/resume
          ├── "View Cover Letter"→ /api/application/[id]/coverletter
          ├── "Edit" button      → save to localStorage → /edit
          └── "Delete" button    → AlertDialog → deleteApplication(id)


── UPDATE ──────────────────────────────────────────────────────────────

JobDetails "Edit" click
  └── app data → localStorage
        │
        ▼
/dashboard/applications/[applicationId]/edit (CLIENT page)
  └── retrieve from localStorage
        │
        ▼
  ApplicationForm.js (populated)
        │
        │  submit via server action
        ▼
  editApplication(id, formData)    ← server action
        │
        ├── getUserSession()
        ├── Application.findById(id)
        ├── update fields + re-buffer new files
        └── application.save() → MongoDB
              │
              └── revalidatePath → toast → redirect /dashboard/applications


── DELETE ──────────────────────────────────────────────────────────────

JobDetails "Delete" → AlertDialog confirm
  └── deleteApplication(id)        ← server action
        │
        ├── Application.findByIdAndDelete(id) → MongoDB
        └── revalidatePath → redirect /dashboard/applications


── FILE DOWNLOAD ────────────────────────────────────────────────────────

JobDetails "View Resume" link  →  GET /api/application/[id]/resume
  └── route.js
        ├── getUserSession()        ← auth required
        ├── validate ObjectId
        ├── Application.findById(id)
        └── return new Response(buffer, {
              'Content-Type': mimetype,
              'Content-Disposition': 'inline'
            })
              │
              ▼
        Browser renders / downloads PDF
```

### Component Hierarchy

```
RootLayout (layout.js)
  ├── Header.jsx              [SERVER async — reads session]
  │     └── Navigation.js    [CLIENT — login/logout, avatar]
  │           └── DropDownMenu.js
  │
  ├── {page content}
  │     │
  │     ├── Home (page.js)
  │     │     ├── unauthenticated → Services.jsx (landing)
  │     │     └── authenticated  → links to dashboard
  │     │
  │     ├── SignIn/page.jsx   [CLIENT — OAuth buttons]
  │     │
  │     └── DashboardLayout (dashboard/layout.js)
  │           ├── Sidebar.js  [CLIENT — active-link nav]
  │           └── {dashboard pages}
  │                 │
  │                 ├── applications/page.js       [SERVER]
  │                 │     └── ApplicationTable.js  [CLIENT]
  │                 │           ├── StatusCard.js
  │                 │           └── Application.js (rows)
  │                 │
  │                 ├── applications/[id]/page.js  [SERVER]
  │                 │     └── JobDetails.js        [CLIENT]
  │                 │           └── AlertDialog.jsx
  │                 │
  │                 ├── applications/[id]/edit/page.js  [CLIENT]
  │                 │     └── ApplicationForm.js (populated)
  │                 │
  │                 └── add-application/page.js    [CLIENT]
  │                       └── ApplicationForm.js (empty)
  │
  └── Footer.jsx
```

---

## Server vs Client Split

| File | Type | Reason |
|---|---|---|
| `app/layout.js` | Server | Static shell, no interactivity |
| `dashboard/layout.js` | Server | Wraps Sidebar (client island) |
| `applications/page.js` | Server | DB fetch via server action |
| `applications/[id]/page.js` | Server | DB fetch via server action |
| `applications/[id]/edit/page.js` | Client | Reads localStorage |
| `add-application/page.js` | Client | Interactive form |
| `Header.jsx` | Server async | Session check at render time |
| `ApplicationForm.js` | Client | File inputs, controlled state |
| `ApplicationTable.js` | Client | Search/filter state |
| `JobDetails.js` | Client | Delete/edit interactions |
| `Sidebar.js` | Client | Active-link state |
| `Navigation.js` | Client | Auth state display |

---

## Key Patterns

- **Path alias:** `@/` → `src/` (jsconfig.json)
- **Server actions:** `"use server"` functions in `app/lib/DataAccessLayer/` — called directly from client components, handle their own auth + DB
- **File storage:** Resume/cover letter stored as raw Buffers in MongoDB (not S3/external)
- **Cache invalidation:** `revalidatePath()` called after every mutation
- **DB connection:** Mongoose cached in `global.mongoose` to survive Next.js hot reloads
- **Edit state handoff:** Server page → `localStorage` → client edit page (workaround for passing data without a URL param round-trip)
- **Toast pattern:** Sonner `toast()` called client-side after server action resolves
