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

🌍 INTERNATIONALIZATION
└── ✅ Default locale (en) configured

📈 ANALYTICS
├── ❌ UMAMI_WEBSITE_ID not configured
│   └── Steps: 1. Deploy Umami (or use cloud) 2. Create website 3. Copy ID
│   └── [Open Umami →]
└── ❌ NEXT_PUBLIC_UMAMI_URL not configured
    └── Copy: NEXT_PUBLIC_UMAMI_URL=https://analytics.yourdomain.com
```

#### Optional Setup (based on selected addons)
```
📊 REPORTING/MONITORING (Optional)
├── ⚠️ SENTRY_DSN not configured
│   └── Steps: 1. Create Sentry project 2. Copy DSN 3. Add to .env
│   └── [Open Sentry →]
└── Skip this section if not needed

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
| API | Hono (in Next.js API routes) | 4.11.3 |
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
| Dates | date-fns | 4.1.0 |
| Variants | CVA + tailwind-merge | latest |
| Linting | Biome (Ultracite) | 2.3.10 |
| Git Hooks | Husky + lint-staged + commitlint | 9.x / 15.x |
| Testing | Playwright (E2E) + Bun test (unit) | 1.57.0 |
| Monitoring | Sentry | 10.32.1 |
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

---

## Folder Structure

```
/
├── cli/                              # CLI scaffolding tool
│   ├── index.ts                      # Entry point
│   ├── prompts.ts                    # Interactive prompts
│   ├── actions/                      # Addon configuration actions
│   │   ├── zustand.ts
│   │   ├── partykit.ts
│   │   ├── uploadthing.ts
│   │   └── openrouter.ts
│   ├── templates/                    # Addon template files
│   │   ├── zustand/
│   │   ├── partykit/
│   │   ├── uploadthing/
│   │   └── openrouter/
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
│   │   └── styling.md
│   └── commands/                     # Claude slash commands
│       ├── add-file-storage.md       # /add-file-storage
│       ├── add-ai.md                 # /add-ai
│       ├── add-realtime.md           # /add-realtime
│       ├── add-state.md              # /add-state
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
│   └── docker-compose.yml
│
│
├── messages/                         # i18n messages
│   └── en.json
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
│   │   └── nuqs-provider.tsx
│   │
│   ├── server/
│   │   ├── api/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   └── middleware/
│   │   └── services/
│   │
│   ├── styles/
│   │   └── globals.css
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
├── README.md
├── sentry.client.config.ts
├── sentry.edge.config.ts
├── sentry.server.config.ts
└── tsconfig.json
```

---

## Implementation Phases

### Phase 1: Project Foundation
**Files to create:**
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript config with path aliases
- `next.config.ts` - Next.js config with Sentry + next-intl
- `postcss.config.mjs` - TailwindCSS v4
- `biome.json` - Ultracite/Biome config
- `bunfig.toml` - Bun config
- `.gitignore`
- `.env.example`

**Actions:**
1. Initialize Next.js 16 with Bun
2. Configure TailwindCSS v4 (CSS-first approach)
3. Set up TypeScript path aliases
4. Install and configure Ultracite (Biome)
5. Set up Husky + lint-staged

### Phase 2: Database & Auth
**Files to create:**
- `src/db/index.ts` - Drizzle connection
- `src/db/schema/*.ts` - User, session, account schemas
- `drizzle.config.ts` - Drizzle Kit config
- `src/lib/auth.ts` - Better Auth config
- `src/lib/auth-client.ts` - Client auth helpers
- `src/app/api/auth/[...all]/route.ts` - Auth handler
- `docker/docker-compose.yml` - PostgreSQL

**Actions:**
1. Set up Docker Compose for PostgreSQL
2. Configure Drizzle ORM
3. Create Better Auth schema
4. Configure Google OAuth + Email/Password
5. Set up repository pattern

### Phase 3: API Layer
**Files to create:**
- `src/server/api/index.ts` - Main Hono app
- `src/server/api/routes/*.ts` - API routes
- `src/server/api/middleware/*.ts` - Auth, validation middleware
- `src/app/api/[[...route]]/route.ts` - Hono handler
- `src/db/repositories/*.ts` - Data access layer (inside db folder)
- `src/server/services/*.ts` - Business logic

**Actions:**
1. Set up Hono with catch-all route
2. Create auth middleware
3. Implement Zod validation middleware
4. Set up repository pattern in `src/db/repositories/`
5. Create initial API routes

### Phase 4: UI Framework
**Files to create:**
- `src/styles/globals.css` - TailwindCSS v4 theme
- `components.json` - ShadCN config
- `src/components/ui/*.tsx` - ShadCN components (essentials)
- `src/lib/utils.ts` - cn() helper
- `src/providers/*.tsx` - Theme, Query, nuqs providers

**Actions:**
1. Initialize ShadCN/UI with Base UI
2. Install core components (button, input, card, form, dialog)
3. Configure next-themes for dark mode
4. Set up Sonner for toasts

### Phase 5: Internationalization & Email
**Files to create:**
- `src/i18n/routing.ts` - next-intl routing
- `src/i18n/request.ts` - next-intl request config
- `messages/en.json` - English translations
- `proxy.ts` - Auth + i18n proxy (Next.js 16)
- `src/emails/*.tsx` - Email templates
- `src/lib/email.ts` - Resend client
- `src/server/services/email.service.ts`

**Actions:**
1. Configure next-intl
2. Set up proxy.ts for locale detection + auth
3. Create email templates with React Email
4. Set up Resend integration

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
3. Build auth pages (login, register, forgot password)
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
5. Set up React Hook Form with Zod
6. Implement TanStack Query patterns

### Phase 7: Testing & Monitoring
**Files to create:**
- `playwright.config.ts` - Playwright config
- `tests/e2e/*.spec.ts` - E2E tests
- `tests/e2e/pages/*.page.ts` - Page objects
- `bun.test.ts` - Bun test config (for co-located unit tests)
- `instrumentation.ts` - Sentry instrumentation
- `sentry.*.config.ts` - Sentry configs
- `src/app/global-error.tsx` - Error handler

**Testing Philosophy:**
- **Prefer E2E/integration tests** - Test user flows and feature behavior
- **Unit tests only for complex logic** - Pure functions, algorithms, complex utilities
- **Co-located unit tests** - `hooks.test.ts` next to `hooks.ts`
- **Don't unit test everything** - Skip simple components, wrappers, straightforward code

**Actions:**
1. Configure Playwright with Page Object Model
2. Write auth flow E2E tests
3. Set up Bun test for co-located unit tests
4. Configure Sentry SDK
5. Create error boundaries

### Phase 8: CI/CD & Docker
**Files to create:**
- `.github/workflows/ci.yml` - Lint, typecheck, test
- `docker/Dockerfile` - Production build
- `docker/Dockerfile.dev` - Development
- `docker/docker-compose.yml` - Local services

**Actions:**
1. Create GitHub Actions CI workflow (lint, typecheck, unit tests)
2. Let Vercel handle deployments automatically:
   - Preview deployments for pull requests
   - Production deployments for main branch
3. Create production Docker image for self-hosting option
4. Configure standalone Next.js output

### Phase 9: Claude Code Setup
**Files to create:**
- `.claude/CLAUDE.md` - Main project instructions
- `.claude/agents/nextjs.md` - Next.js patterns
- `.claude/agents/testing.md` - Testing guidelines
- `.claude/agents/database.md` - Drizzle patterns
- `.claude/agents/auth.md` - Auth patterns
- `.claude/agents/api.md` - Hono/API patterns
- `.claude/agents/styling.md` - Styling guidelines
- `.claude/commands/add-file-storage.md` - Add UploadThing addon
- `.claude/commands/add-ai.md` - Add OpenRouter + AI SDK addon
- `.claude/commands/add-realtime.md` - Add PartyKit addon
- `.claude/commands/add-state.md` - Add Zustand addon

**Actions:**
1. Write comprehensive CLAUDE.md
2. Create domain-specific agent files
3. Document code conventions
4. **Create Claude slash commands:**
   - `/add-file-storage` - Adds UploadThing, creates files, updates env
   - `/add-ai` - Adds AI SDK + OpenRouter, creates files, updates env
   - `/add-realtime` - Adds PartyKit, creates files, updates env
   - `/add-state` - Adds Zustand, creates store files
   - `/remove-boilerplate` - Removes setup checklist page and features/setup/, clears README (keeps only project name, scripts, structure)
   - Each command runs setup + communicates any manual steps to user

### Phase 10: CLI Tool (`create-agentic-app`)

**Structure:** Single repo with `cli/` folder (local execution, not npm published)

**Files to create:**
- `cli/index.ts` - Main CLI entry point
- `cli/prompts.ts` - Interactive prompts (using @clack/prompts)
- `cli/actions/` - Addon configuration actions
- `cli/templates/` - Template files for each addon
- `cli/utils/fs.ts` - File system operations
- `cli/utils/package.ts` - package.json modifications

**CLI Flow:**
```
$ bun run create-agentic-app

? What is your project name? my-app
? Where do you want to create the project? ./my-app
? Do you need client-side state management? (Zustand) No
? Do you need real-time features? (PartyKit) No
? Do you need file storage/uploads? (UploadThing) Yes
? Do you need AI capabilities? (OpenRouter + AI SDK) Yes

Creating your project...
✓ Copied base template
✓ Configured UploadThing
✓ Configured OpenRouter + AI SDK
✓ Updated package.json
✓ Installed dependencies
✓ Initialized git repository

Done! Run:
  cd my-app
  docker compose up -d
  bun dev
```

**CLI Dependencies:**
- `@clack/prompts` - Beautiful CLI prompts
- `picocolors` - Terminal colors
- `fs-extra` - File system utilities

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

### Phase 12: Documentation
**Files to create:**
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
```json
{
  "extends": ["ultracite"],
  "linter": {
    "rules": {
      "style": {
        "noDefaultExport": "warn"
      }
    }
  }
}
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
8. **API**: Hono routes with Zod middleware
9. **Styling**: Tailwind + CVA + cn() helper
10. **Commits**: Conventional commits enforced via commitlint
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
