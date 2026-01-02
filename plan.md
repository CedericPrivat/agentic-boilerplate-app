# Agentic Boilerplate App - Implementation Plan

## Overview

Create a production-ready Next.js 16 boilerplate with a CLI scaffolding tool (`create-agentic-app`) that allows users to customize their stack with optional addons.

## Architecture

The project consists of two parts:
1. **Template** - The base boilerplate code (in root)
2. **CLI** - Interactive scaffolding tool in `cli/` folder (runs locally with `bun run create-agentic-app`)

**Examples:** Minimal - auth pages (login, register, forgot-password) and a **Setup Checklist Page** that shows configuration status. No sample CRUD features.

### Setup Checklist Page (Route `/`)
The homepage is a setup checklist page with an interactive checklist **grouped by tool/intent**. This page remains the homepage (no redirects):

#### Required Setup
```
📦 DATABASE
├── ✅ PostgreSQL connection established
├── ⚠️ Migrations pending (3 migrations)
│   └── [Run Migrations] button
└── Steps: 1. Start Docker 2. Check DATABASE_URL 3. Run migrations

🔐 AUTHENTICATION
├── ❌ BETTER_AUTH_SECRET not configured
│   └── Copy: BETTER_AUTH_SECRET=<generated-secret>
├── ❌ Google OAuth not configured
│   └── Steps: 1. Go to Google Console 2. Create OAuth app 3. Add credentials
│   └── Copy: GOOGLE_CLIENT_ID=xxx / GOOGLE_CLIENT_SECRET=xxx
│   └── [Open Google Console →]
└── ✅ Email/Password auth ready

📧 EMAIL
├── ❌ RESEND_API_KEY not configured
│   └── Steps: 1. Create Resend account 2. Generate API key 3. Add to .env
│   └── Copy: RESEND_API_KEY=re_xxx
│   └── [Open Resend Dashboard →]
└── ❌ EMAIL_FROM not configured
    └── Copy: EMAIL_FROM=noreply@yourdomain.com

📈 ANALYTICS
├── ❌ NEXT_PUBLIC_UMAMI_WEBSITE_ID not configured
│   └── Steps: 1. Deploy Umami (or use cloud) 2. Create website 3. Copy ID
│   └── [Open Umami →]
└── ❌ NEXT_PUBLIC_UMAMI_URL not configured
    └── Copy: NEXT_PUBLIC_UMAMI_URL=https://analytics.yourdomain.com

🔔 UPTIME MONITORING
├── ❌ Uptime Kuma not running
│   └── Steps: 1. Run `bun dev` (starts Docker services) 2. Open dashboard
│   └── Dashboard: http://localhost:3001
│   └── [Open Uptime Kuma →]
└── ❌ UPTIME_KUMA_URL not configured
    └── Copy: UPTIME_KUMA_URL=http://localhost:3001

🚨 ERROR MONITORING
├── ❌ SENTRY_DSN not configured
│   └── Steps: 1. Create Sentry project 2. Copy DSN 3. Add to .env
│   └── [Open Sentry →]
└── Skip if not needed for development
```

#### Optional Setup (based on selected addons)
```

🤖 AI / OPENROUTER (Optional - if addon selected)
├── ❌ OPENROUTER_API_KEY not configured
│   └── Steps: 1. Create OpenRouter account 2. Add credits 3. Copy API key
│   └── [Open OpenRouter →]
└── Models available: gpt-4, claude-3, etc.

📁 FILE UPLOADS (Optional - if addon selected)
├── ❌ UPLOADTHING_TOKEN not configured
│   └── Steps: 1. Create UploadThing app 2. Copy token
│   └── [Open UploadThing →]
└── Max file size: 4MB (free tier)

🔄 REAL-TIME (Optional - if addon selected)
└── ❌ PARTYKIT_TOKEN not configured
    └── Steps: 1. Create PartyKit account 2. Deploy party server
    └── [Open PartyKit →]

💳 PAYMENTS (Optional - if addon selected)
├── ❌ POLAR_ACCESS_TOKEN not configured
│   └── Steps: 1. Create Polar.sh account 2. Create organization 3. Generate access token
│   └── [Open Polar Dashboard →]
├── ❌ POLAR_WEBHOOK_SECRET not configured
│   └── Steps: 1. Configure webhook endpoint 2. Copy secret
└── ⚠️ Using sandbox mode (switch to production when ready)

─────────────────────────────────────────────────────

🚀 READY TO BUILD
└── ✅ All required setup complete!
    └── Run `/remove-boilerplate` to remove this checklist and start building
    └── This will clean up setup files and prepare your project for development
```

**Features:**
- Grouped by tool/intent for clarity
- Expandable sections with detailed steps
- One-click copy for env var templates
- Direct links to provider dashboards
- Visual status: ✅ Working | ⚠️ Partial | ❌ Not configured
- "Run Migrations" and "Test Connection" buttons
- Optional sections only show if addon was selected during CLI setup
- Progress indicator: "3/5 required steps complete"
- **"Last checked" timestamp** showing when checks were last run
- **Single "Re-check All" button** to manually re-run all status checks

---

## Tech Stack Summary

### Core (Always Included)
| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router + Typed Routes + Cache Components) | 16.1.1 |
| React | React + React Compiler | 19.2.3 |
| Runtime | Bun | latest |
| Styling | TailwindCSS + ShadCN/UI (Base UI) | 4.1.18 |
| API | Hono + @hono/zod-openapi + Scalar | 4.11.3 |
| Database | PostgreSQL + Drizzle ORM | 0.45.1 |
| Auth | Better Auth (Google + Email/Password) | 1.4.10 |
| Validation | Zod | 4.3.4 |
| Env Vars | @t3-oss/env-nextjs | latest |
| Forms | React Hook Form | 7.x |
| Icons | Lucide React | 0.562.0 |
| URL State | nuqs | 2.8.6 |
| IDs | nanoid | 5.x |
| Email | Resend + React Email | 6.6.0 |
| i18n | next-intl | 4.7.0 |
| Dark Mode | next-themes | 0.4.6 |
| Toasts | Sonner | 2.0.7 |
| Animations | motion (formerly Framer Motion) | 12.23.26 |
| Dates | Native Intl API | - |
| Variants | CVA + tailwind-merge | latest |
| Linting | Biome (Ultracite) | 2.3.10 |
| Git Hooks | Husky + lint-staged + commitlint | 9.x / 15.x |
| Testing | Playwright (E2E) + Bun test (unit) | 1.57.0 |
| Monitoring | Sentry + Uptime Kuma | 10.32.1 / latest |
| Analytics | Umami | self-hosted |
| CI/CD | GitHub Actions | - |
| Deployment | Vercel + Docker support | - |
| Data Fetch | TanStack Query (client) | 5.90.16 |

### Optional Addons (CLI Prompts)
| Addon | Technology | Version | CLI Question |
|-------|------------|---------|--------------|
| State Management | Zustand | 5.0.9 | "Do you need client-side state management?" |
| Real-time | PartyKit | 0.0.115 | "Do you need real-time features?" |
| File Uploads | UploadThing | 7.7.4 | "Do you need file storage/uploads?" |
| AI | Vercel AI SDK + OpenRouter | 6.0.5 | "Do you need AI capabilities?" |
| Payments | Polar.sh | latest | "Do you need payment/subscription features?" |

---

## Folder Structure

```
/
├── cli/                              # CLI scaffolding tool (published to npm)
│   ├── package.json                  # CLI package config (@cedericprivat/create-agentic-app)
│   ├── index.ts                      # Entry point
│   ├── prompts.ts                    # Interactive prompts
│   ├── actions/                      # Addon configuration actions
│   │   ├── zustand.ts
│   │   ├── partykit.ts
│   │   ├── uploadthing.ts
│   │   ├── openrouter.ts
│   │   └── polar.ts
│   ├── templates/                    # Addon template files
│   │   ├── zustand/
│   │   ├── partykit/
│   │   ├── uploadthing/
│   │   ├── openrouter/
│   │   └── polar/
│   └── utils/
│       ├── fs.ts
│       └── package.ts
│
├── .claude/
│   ├── CLAUDE.md                     # Main project instructions
│   ├── agents/                       # Domain-specific agents
│   │   ├── nextjs.md
│   │   ├── testing.md
│   │   ├── database.md
│   │   ├── auth.md
│   │   ├── api.md
│   │   ├── styling.md
│   │   └── refactoring.md            # Refactoring principles & patterns
│   └── commands/                     # Claude slash commands
│       ├── commit.md                 # /commit
│       ├── refactor.md               # /refactor - guided refactoring with best practices
│       ├── upstream.md               # /upstream - contribute patterns/libs back to boilerplate
│       ├── add-file-storage.md       # /add-file-storage
│       ├── add-ai.md                 # /add-ai
│       ├── add-realtime.md           # /add-realtime
│       ├── add-state.md              # /add-state
│       ├── add-payments.md           # /add-payments (Polar.sh)
│       └── remove-boilerplate.md     # /remove-boilerplate
│
├── .github/workflows/
│   └── ci.yml                        # Lint, typecheck, test (Vercel handles deploys)
│
├── .husky/
│   ├── pre-commit                    # lint-staged
│   └── commit-msg                    # commitlint (conventional commits)
│
├── docker/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── docker-compose.yml            # PostgreSQL + Uptime Kuma
│
│
├── messages/                         # i18n messages
│   ├── en.json                       # English (en-US) - default
│   └── de.json                       # German (de-DE)
│
├── scripts/
│   └── seed.ts                       # Database seeding
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   └── page.tsx                  # Setup checklist (default route)
│   │   ├── api/
│   │   │   ├── [[...route]]/route.ts    # Hono catch-all
│   │   │   ├── auth/[...all]/route.ts   # Better Auth
│   │   │   ├── health/route.ts          # Health check endpoint for Uptime Kuma
│   │   │   └── monitoring/route.ts      # Sentry tunnel
│   │   ├── global-error.tsx
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   └── ui/                          # ShadCN components (essentials only)
│   │
│   ├── config/
│   │   ├── site.ts                      # Site name, description, URL
│   │   └── env.ts                       # Type-safe env (@t3-oss/env-nextjs)
│   │
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema/
│   │   │   ├── index.ts
│   │   │   ├── users.ts
│   │   │   └── sessions.ts
│   │   ├── repositories/                # Data access layer (abstracts DB calls)
│   │   │   ├── base.repository.ts       # Shared repository utilities
│   │   │   └── user.repository.ts       # User-specific DB queries
│   │   ├── migrations/
│   │   └── seed/
│   │
│   ├── emails/
│   │   ├── welcome.tsx
│   │   ├── reset-password.tsx
│   │   └── components/
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── actions.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queries.ts
│   │   │   ├── schemas.ts
│   │   │   └── types.ts
│   │   ├── setup/                       # Setup checklist feature
│   │   │   ├── actions.ts               # Health check actions
│   │   │   ├── checks.ts                # Individual check functions
│   │   │   ├── components/
│   │   │   │   ├── setup-checklist.tsx
│   │   │   │   └── check-item.tsx
│   │   │   └── types.ts
│   │   └── [feature]/                   # Same pattern
│   │
│   ├── hooks/
│   ├── i18n/
│   │   ├── routing.ts
│   │   └── request.ts
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   ├── db.ts
│   │   ├── email.ts
│   │   ├── query-client.ts
│   │   └── utils.ts
│   │
│   │
│   ├── providers/
│   │   ├── index.tsx                    # Combined provider component (NOT barrel)
│   │   ├── query-provider.tsx
│   │   ├── theme-provider.tsx
│   │   ├── toaster-provider.tsx         # Sonner toaster wrapper
│   │   └── nuqs-provider.tsx
│   │
│   ├── server/
│   │   ├── api/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   └── middleware/
│   │   └── services/
│   │
│   └── types/
│
├── tests/
│   └── e2e/                             # E2E tests (Playwright)
│       ├── auth.spec.ts
│       ├── fixtures/
│       └── pages/
│
│   # Unit tests are CO-LOCATED with source files:
│   # src/features/auth/hooks.ts → src/features/auth/hooks.test.ts
│   # src/lib/utils.ts → src/lib/utils.test.ts
│
├── proxy.ts                          # Next.js 16 (replaces middleware.ts)
├── .env.example
├── biome.json
├── bunfig.toml
├── commitlint.config.ts              # Conventional commits enforcement
├── components.json
├── drizzle.config.ts
├── instrumentation.ts
├── lint-staged.config.ts             # TypeScript for type safety
├── next.config.ts
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── LICENSE                           # MIT License
├── README.md
├── sentry.client.config.ts
├── sentry.edge.config.ts
├── sentry.server.config.ts
└── tsconfig.json
```

---

## Implementation Phases

> **Principle: Prefer CLI tools over manual setup**
> Always check official documentation for installation/getting started guides. Use CLI tools when available (e.g., `bunx --bun shadcn@latest init`, `bunx @better-auth/cli generate`) instead of manually creating files. This ensures correct configuration and follows best practices.

### Phase 1: Project Foundation
**Files to create:**
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript config with path aliases
- `next.config.ts` - Next.js config with Sentry + next-intl + Umami proxy rewrites
- `postcss.config.mjs` - TailwindCSS v4
- `biome.json` - Ultracite/Biome config
- `bunfig.toml` - Bun config (includes npm registry for publishing)
- `.gitignore`
- `.env.example` - With composite env vars (Bun supports variable expansion natively)

**Example `.env.example` structure:**
```env
# Database credentials
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=agentic_app

# Composite DATABASE_URL using Bun's native variable expansion
DATABASE_URL=postgresql://$DATABASE_USER:$DATABASE_PASSWORD@$DATABASE_HOST:$DATABASE_PORT/$DATABASE_NAME

# Uptime Kuma (monitoring)
UPTIME_KUMA_PORT=3001
UPTIME_KUMA_URL=http://localhost:$UPTIME_KUMA_PORT

# Umami Analytics (proxied to bypass ad blockers)
NEXT_PUBLIC_UMAMI_URL=http://localhost:3002
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

**Actions:**
1. Initialize Next.js 16 with Bun
2. **Remove Next.js boilerplate:**
   - Delete default page content (`app/page.tsx` placeholder content)
   - Clear `globals.css` (keep only Tailwind imports)
   - Remove default favicon, icons, and example images
   - Remove Geist/Vercel fonts (will use Inter instead)
3. **Configure Inter font** using `next/font/google` in root layout:
   ```tsx
   import { Inter } from 'next/font/google'
   const inter = Inter({ subsets: ['latin'] })
   // Apply inter.className to <html> element
   ```
4. Configure TailwindCSS v4 (CSS-first approach)
5. Set up TypeScript path aliases
6. Install and configure Ultracite (Biome)
7. Set up Husky + lint-staged
8. **Configure Umami proxy rewrites** in `next.config.ts` to bypass ad blockers:
   ```ts
   rewrites: async () => [
     {
       source: '/u/:path*',
       destination: `${process.env.NEXT_PUBLIC_UMAMI_URL}/:path*`,
     },
   ]
   ```
   - Script loads from `/u/script.js` instead of Umami domain
   - Analytics data sent to `/u/api/send` (proxied through your domain)
   - Ad blockers won't block requests to your own domain

### Phase 2: Database & Auth
**Files to create:**
- `src/db/index.ts` - Drizzle connection
- `src/db/schema/*.ts` - User, session, account schemas
- `drizzle.config.ts` - Drizzle Kit config (output: `src/db/migrations`)
- `src/lib/auth.ts` - Better Auth config
- `src/lib/auth-client.ts` - Client auth helpers
- `src/app/api/auth/[...all]/route.ts` - Auth handler
- `docker/docker-compose.yml` - PostgreSQL + Uptime Kuma (uses env vars: `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`)

**Actions:**
1. Set up Docker Compose for PostgreSQL with env var configuration
2. Configure Drizzle ORM
3. Generate Better Auth schema using CLI: `bunx @better-auth/cli generate`
4. Configure Google OAuth + Email/Password
5. Set up repository pattern

### Phase 3: API Layer
**Files to create:**
- `src/server/api/index.ts` - Main OpenAPIHono app with Scalar UI
- `src/server/api/routes/*.ts` - API routes using `createRoute`
- `src/server/api/middleware/*.ts` - Auth, validation middleware
- `src/app/api/[[...route]]/route.ts` - Hono handler
- `src/app/api/health/route.ts` - Health check endpoint (DB connection, API status)
- `src/db/repositories/*.ts` - Data access layer (inside db folder)
- `src/server/services/*.ts` - Business logic

**Actions:**
1. Install OpenAPI packages: `bun add @hono/zod-openapi @scalar/hono-api-reference`
2. Set up OpenAPIHono with catch-all route (replaces standard Hono)
3. Configure OpenAPI spec at `/api/doc` and Scalar UI at `/api/reference`
4. Create auth middleware
5. Define routes using `createRoute` with Zod schemas for automatic OpenAPI generation
6. Set up repository pattern in `src/db/repositories/`
7. Create initial API routes with OpenAPI annotations
8. Create health check endpoint (`/api/health`) that checks:
   - Database connectivity
   - API responsiveness
   - Returns JSON with status and response time

### Phase 4: UI Framework
**Files to create/modify:**
- `src/app/globals.css` - Add TailwindCSS v4 theme variables (already created by Next.js)
- `components.json` - ShadCN config (generated by CLI)
- `src/components/ui/*.tsx` - ShadCN components (added via CLI)
- `src/lib/utils.ts` - cn() helper (generated by CLI)
- `src/providers/*.tsx` - Theme, Query, nuqs, toaster providers

**Actions:**
1. Initialize ShadCN/UI using CLI: `bunx --bun shadcn@latest init`
2. Install form dependencies: `bun add react-hook-form zod @hookform/resolvers`
3. Add core components via CLI: `bunx --bun shadcn@latest add button input card field dialog sonner skeleton`
4. Configure next-themes for dark mode
5. Add `<Toaster />` component to providers

### Phase 5: Internationalization & Email
**Files to create:**
- `src/i18n/routing.ts` - next-intl routing (locales: en-US, de-DE)
- `src/i18n/request.ts` - next-intl request config
- `messages/en.json` - English (en-US) translations (default)
- `messages/de.json` - German (de-DE) translations
- `proxy.ts` - Auth + i18n proxy (Next.js 16)
- `src/emails/*.tsx` - Email templates
- `src/lib/email.ts` - Resend client
- `src/server/services/email.service.ts`

**Actions:**
1. Configure next-intl with locales: `en-US` (default), `de-DE`
2. Create translation files for both locales
3. Set up proxy.ts for locale detection + auth
4. Create email templates with React Email (with i18n support)
5. Set up Resend integration

### Phase 6: Pages & Features
**Files to create:**
- `src/app/[locale]/layout.tsx` - Root locale layout
- `src/app/[locale]/page.tsx` - Setup checklist (default route `/`)
- `src/app/[locale]/(auth)/*.tsx` - Auth pages
- `src/config/env.ts` - Type-safe env vars with @t3-oss/env-nextjs
- `src/features/auth/*.ts` - Auth feature module
- `src/features/setup/*.ts` - Setup checklist feature (removable via /remove-boilerplate)

**Actions:**
1. Create route groups and layouts
2. Set up @t3-oss/env-nextjs for type-safe environment variables
3. Build auth pages using shadcn block components (login, register, forgot password)
4. **Build Setup Checklist page (route `/`) with:**
   - Grouped by tool/intent (Database, Auth, Email, Reporting, etc.)
   - Database connection check
   - Environment variable validation via t3-env
   - Migration status check
   - Copy-paste env templates
   - Links to provider dashboards
   - Real-time status updates via server actions
   - Optional addon sections (AI, File Uploads, Real-time)
   - Stays as homepage (no redirects)
5. Implement TanStack Query patterns

### Phase 7: Testing & Monitoring
**Files to create:**
- `playwright.config.ts` - Playwright config (generated by CLI)
- `tests/e2e/*.spec.ts` - E2E tests
- `tests/e2e/pages/*.page.ts` - Page objects
- `bun.test.ts` - Bun test config (for co-located unit tests)
- `instrumentation.ts` - Sentry instrumentation (generated by CLI)
- `sentry.*.config.ts` - Sentry configs (generated by CLI)
- `src/app/global-error.tsx` - Error handler (generated by CLI)

**Testing Philosophy:**
- **Prefer E2E/integration tests** - Test user flows and feature behavior
- **Unit tests only for complex logic** - Pure functions, algorithms, complex utilities
- **Co-located unit tests** - `hooks.test.ts` next to `hooks.ts`
- **Don't unit test everything** - Skip simple components, wrappers, straightforward code

**Actions:**
1. Initialize Playwright using CLI: `bunx create-playwright`
2. Configure Page Object Model pattern
3. Write auth flow E2E tests
4. Set up Bun test for co-located unit tests
5. Initialize Sentry using wizard: `bunx @sentry/wizard@latest -i nextjs`
6. Create error boundaries

### Phase 8: CI/CD & Docker
**Files to create:**
- `.github/workflows/ci.yml` - Lint, typecheck, test
- `docker/Dockerfile` - Production build
- `docker/Dockerfile.dev` - Development
- `docker/docker-compose.yml` - Local services (PostgreSQL + Uptime Kuma)

**Actions:**
1. Create GitHub Actions CI workflow (lint, typecheck, unit tests)
2. Let Vercel handle deployments automatically:
   - Preview deployments for pull requests
   - Production deployments for main branch
3. Create production Docker image for self-hosting option
4. Configure standalone Next.js output
5. **Configure Uptime Kuma in docker-compose.yml:**
   - Add Uptime Kuma service with persistent volume
   - Pre-configure monitors for `/api/health` and frontend
   - Uptime Kuma provides built-in public status page
   - Use env vars: `UPTIME_KUMA_PORT`, `UPTIME_KUMA_URL`

### Phase 9: Claude Code Setup
**Files to create:**
- `.claude/CLAUDE.md` - Main project instructions
- `.claude/agents/nextjs.md` - Next.js patterns
- `.claude/agents/testing.md` - Testing guidelines
- `.claude/agents/database.md` - Drizzle patterns
- `.claude/agents/auth.md` - Auth patterns (include llms.txt reference)
- `.claude/agents/api.md` - Hono/API patterns
- `.claude/agents/styling.md` - Styling guidelines
- `.claude/agents/refactoring.md` - Refactoring principles (SOLID, DRY, KISS, separation of concerns, composition over inheritance, etc.)
- `.claude/commands/commit.md` - Create git commit with conventional format
- `.claude/commands/add-file-storage.md` - Add UploadThing addon
- `.claude/commands/add-ai.md` - Add OpenRouter + AI SDK addon
- `.claude/commands/add-realtime.md` - Add PartyKit addon
- `.claude/commands/add-state.md` - Add Zustand addon
- `.claude/commands/add-payments.md` - Add Polar.sh payments addon

**Actions:**
1. Write comprehensive CLAUDE.md
2. Create domain-specific agent files
3. Document code conventions
4. **Document CLI-first principle in CLAUDE.md:**
   - Always check official docs for CLI/installation guides before manual setup
   - Use CLI tools when available (shadcn, better-auth, sentry, playwright, etc.)
   - Ensures correct configuration and follows best practices
5. **Include llms.txt references in agents** - For tools that provide llms.txt files (LLM-friendly documentation), include the URL in the corresponding agent file so Claude can fetch up-to-date docs:
   - Auth agent: `https://www.better-auth.com/llms.txt`
   - Database agent: `https://orm.drizzle.team/llms.txt` (if available)
   - Other agents: Check if the tool provides llms.txt or similar
6. **Create Claude slash commands:**
   - `/commit` - Stages all changes and commits with conventional format
   - `/refactor` - Analyzes code, explains changes with principles (SOLID, DRY, etc.), offers choices, uses domain agents
   - `/upstream` - Extracts pattern/lib/rule from context, updates boilerplate repo + current project
   - `/add-file-storage` - Adds UploadThing, creates files, updates env
   - `/add-ai` - Adds AI SDK + OpenRouter, creates files, updates env
   - `/add-realtime` - Adds PartyKit, creates files, updates env
   - `/add-state` - Adds Zustand, creates store files
   - `/add-payments` - Adds Polar.sh, creates files, updates env
   - `/remove-boilerplate` - Removes setup checklist page and features/setup/, clears README
   - Each command runs setup + communicates any manual steps to user
7. **Document Uptime Kuma monitoring principle in CLAUDE.md:**
   - When adding new API routes or services, always create a corresponding health check endpoint
   - Remind developers to add new endpoints/services to Uptime Kuma monitors
   - Health check endpoints should verify dependencies (DB, external APIs, etc.)
   - Pattern: `/api/[service]/health` for service-specific health checks

### Phase 10: CLI Tool (`@cedericprivat/create-agentic-app`)

**Structure:** Single repo with `cli/` folder, published to npm as `@cedericprivat/create-agentic-app`

**Files to create:**
- `cli/index.ts` - Main CLI entry point
- `cli/prompts.ts` - Interactive prompts (using @clack/prompts)
- `cli/actions/` - Addon configuration actions
- `cli/templates/` - Template files for each addon
- `cli/utils/fs.ts` - File system operations
- `cli/utils/package.ts` - package.json modifications

**CLI Usage:**
```bash
# Create in new folder (name as argument)
$ bunx @cedericprivat/create-agentic-app my-app

# Create in current folder
$ bunx @cedericprivat/create-agentic-app .

# Interactive mode (prompts for name)
$ bunx @cedericprivat/create-agentic-app
```

**CLI Flow:**
```
$ bunx @cedericprivat/create-agentic-app

? What is your project name? my-app
? Do you need client-side state management? (Zustand) No
? Do you need real-time features? (PartyKit) No
? Do you need file storage/uploads? (UploadThing) Yes
? Do you need AI capabilities? (OpenRouter + AI SDK) Yes
? Do you need payment/subscription features? (Polar.sh) Yes

Creating project in ./my-app...
✓ Copied base template
✓ Configured UploadThing
✓ Configured OpenRouter + AI SDK
✓ Configured Polar.sh payments
✓ Updated package.json
✓ Installed dependencies
✓ Initialized git repository

Done! Run:
  cd my-app
  bun dev
```

**Argument Handling:**
- `bunx @cedericprivat/create-agentic-app my-app` → Creates `./my-app/` folder, uses "my-app" as name
- `bunx @cedericprivat/create-agentic-app .` → Uses current folder, infers name from folder
- No argument → Prompts for project name, creates folder with that name

**CLI Dependencies:**
- `@clack/prompts` - Beautiful CLI prompts
- `picocolors` - Terminal colors
- `fs-extra` - File system utilities

**Publishing:**
```bash
# Build and publish to npm
$ cd cli && bun run build && bun publish --access public
```

### Phase 11: Addon Templates

**Zustand addon:**
- `src/stores/index.ts`
- `src/stores/use-app-store.ts`
- Update providers

**PartyKit addon:**
- `party/index.ts`
- `src/lib/partykit.ts`
- `partykit.json`
- Update package.json

**UploadThing addon:**
- `src/lib/uploadthing.ts`
- `src/app/api/uploadthing/core.ts`
- `src/app/api/uploadthing/route.ts`
- `src/components/ui/upload-button.tsx`

**OpenRouter + AI SDK addon:**
- `src/lib/ai.ts` - OpenRouter client config
- `src/server/api/routes/ai.ts` - AI API routes
- `src/features/ai/` - AI feature module
- `src/components/ai/` - Chat UI components

**Polar.sh payments addon:**
- `src/lib/polar.ts` - Polar client configuration
- `src/app/api/checkout/route.ts` - Checkout session handler
- `src/app/api/webhook/polar/route.ts` - Webhook handler
- `src/features/payments/` - Payments feature module

### Phase 12: Documentation
**Files to create:**
- `LICENSE` - MIT License
- `README.md` - Comprehensive readme
- `docs/add-ons/*.md` - Addon documentation
- `CONTRIBUTING.md` - Contribution guide

---

## Key Configuration Files

### `package.json` (essential scripts)
```json
{
  "scripts": {
    "create-agentic-app": "bun run cli/index.ts",
    "dev": "bun run dev:services && next dev",
    "dev:services": "docker compose up -d && bun run db:migrate",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "typecheck": "tsc --noEmit",
    "test": "bun test",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "bun run scripts/seed.ts",
    "email:dev": "email dev --dir src/emails",
    "prepare": "husky"
  }
}
```

**Note:** `bun run dev` automatically:
1. Starts Docker containers (PostgreSQL)
2. Runs pending database migrations
3. Starts Next.js dev server with Turbopack

### `biome.json` (Ultracite)
Initialize with: `bunx ultracite init`

**Additional rules** (add on top of Ultracite defaults):
```json
{
  "linter": {
    "rules": {
      "style": {
        "noProcessEnv": "error",
        "noRestrictedImports": {
          "level": "error",
          "options": {
            "paths": {
              "drizzle-orm/gel-core": "Use 'drizzle-orm/pg-core' for PostgreSQL dialect",
              "drizzle-orm/mysql-core": "Use 'drizzle-orm/pg-core' for PostgreSQL dialect",
              "drizzle-orm/singlestore-core": "Use 'drizzle-orm/pg-core' for PostgreSQL dialect",
              "drizzle-orm/sqlite-core": "Use 'drizzle-orm/pg-core' for PostgreSQL dialect"
            }
          }
        }
      },
      "suspicious": {
        "noUnknownAtRules": "off"
      }
    }
  }
}
```
- `noProcessEnv` - Enforces `@t3-oss/env-nextjs` instead of `process.env`
- `noRestrictedImports` - Blocks non-PostgreSQL Drizzle dialect imports
- `noUnknownAtRules: off` - Allows Tailwind CSS at-rules (`@apply`, `@theme`, etc.)

### `bunfig.toml`
```toml
[install]
peer = false

[publish]
registry = "https://registry.npmjs.org/"
```

---

## Next.js 16 Features

The boilerplate uses these Next.js 16 features:

| Feature | Config | Description |
|---------|--------|-------------|
| Typed Routes | `typedRoutes: true` | Type-safe Link href and useRouter |
| React Compiler | `reactCompiler: true` | Automatic memoization |
| Cache Components | `cacheComponents: true` | Partial prerendering with `use cache` |
| Turbopack | Default | No flag needed (was `--turbo`) |
| Proxy | `proxy.ts` | Replaces middleware.ts |

**Async Request APIs** (Now enforced):
```tsx
// Next.js 16 - params and searchParams are async
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
}
```

**Cache Components** (`use cache`):
```tsx
'use cache'
import { cacheLife } from 'next/cache'

export async function CachedData() {
  cacheLife('hours')
  const data = await fetch('...')
  return <div>{data}</div>
}
```

---

## Code Conventions

1. **Imports**: Always use alias imports (`@/...`)
2. **Exports**: Named exports preferred, no barrel files
3. **Components**: Server Components by default
4. **Routes**: Use typed routes (Link href, useRouter) for type-safe navigation
5. **Data Fetching**: Server Components → Server Actions → TanStack Query
6. **Validation**: Zod schemas in feature `schemas.ts`
7. **Data Access**: Repository pattern
8. **API**: OpenAPIHono with `createRoute` for automatic OpenAPI spec generation
9. **Styling**: Tailwind + CVA + cn() helper
10. **Loading States**: Always add loading states for async operations
    - Use Skeleton loaders (preferred) for content placeholders
    - Use `loading.tsx` for route-level loading states
    - Use Suspense boundaries with skeleton fallbacks for components
    - Avoid spinners when possible; skeletons provide better UX
11. **Modern Web APIs**: Prefer native browser APIs over libraries
    - `Intl.DateTimeFormat` for date formatting
    - `Intl.NumberFormat` for number/currency formatting
    - `Intl.RelativeTimeFormat` for relative time ("2 days ago")
    - `Intl.ListFormat` for list formatting ("A, B, and C")
    - `Array.at()`, `Object.hasOwn()`, `structuredClone()`, etc.
    - Only add polyfills/libraries if targeting older browsers
12. **Commits**: Conventional commits enforced via commitlint
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation
   - `style:` formatting
   - `refactor:` code refactoring
   - `test:` adding tests
   - `chore:` maintenance

---

## Critical Files to Create First

1. `package.json` - All dependencies
2. `docker/docker-compose.yml` - PostgreSQL for local dev
3. `src/db/index.ts` - Database connection
4. `src/lib/auth.ts` - Better Auth config
5. `src/server/api/index.ts` - Hono API
6. `.claude/CLAUDE.md` - Claude Code instructions

---

## Estimated File Count

- Core template: ~80-100 files
- CLI tool: ~10-15 files
- Addon templates: ~20-30 files
- Total: ~110-145 files
