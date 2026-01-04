# Agentic Boilerplate - Claude Code Instructions

## Project Overview

Production-ready Next.js 16 boilerplate with CLI scaffolding tool. Features auth pages, setup checklist, and full modern stack.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Typed Routes, React Compiler)
- **Runtime:** Bun
- **Styling:** TailwindCSS 4 + ShadCN/UI (base-vega style with @base-ui/react)
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (Google OAuth + Email/Password)
- **API:** Hono + OpenAPI + Scalar UI
- **Validation:** Zod 4
- **Email:** Resend + React Email
- **i18n:** next-intl (cookie-based, no URL locale)
- **Testing:** Playwright (E2E) + Bun test (unit)
- **Linting:** Ultracite (Biome)

## Common Commands

```bash
bun dev              # Start dev server + Docker services
bun test             # Run unit tests (Bun)
bun test:e2e         # Run E2E tests (Playwright)
bun lint             # Check linting (Ultracite)
bun lint:fix         # Fix linting issues
bun typecheck        # TypeScript type check
bun db:generate      # Generate Drizzle migrations
bun db:migrate       # Run pending migrations
bun db:studio        # Open Drizzle Studio
bun db:seed          # Seed database
```

## Important Implementation Notes

### Cookie-Based i18n (No Locale in URL Paths)
- **DO NOT use `[locale]` in route paths** (e.g., use `src/app/(auth)/login` NOT `src/app/[locale]/(auth)/login`)
- Locale is detected from cookie, not URL
- Configuration is in `src/i18n/request.ts` which reads from cookie
- IntlProvider is integrated into `src/providers/index.tsx`

### ShadCN Field Component (Form is DEPRECATED)
- **DO NOT use the Form component** - it is deprecated
- **USE Field component instead** for all form fields
- Install with: `bunx --bun shadcn@latest add field`
- Components: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet`
- Use `data-invalid` on Field and `aria-invalid` on Input for error states

### Type-Safe Environment Variables
- All env vars are in `src/config/env.ts` using @t3-oss/env-nextjs
- **NEVER use `process.env` directly** - always use the `env` object from `@/config/env`
- Only exception: `env.ts` itself (has biome-ignore comment)

### Zod 4 Syntax
- Use top-level validators: `z.url()`, `z.email()` (NOT `z.string().url()`)
- Defaults belong in schema: `z.string().optional().default("value")`

## Code Style

1. **Imports:** Always use `@/` alias imports
2. **React imports:** Use specific imports, not namespace imports (e.g., `import type { ComponentProps } from "react"` not `import type * as React from "react"`). Exception: Schema imports in `src/db/index.ts` may use namespace imports.
3. **Exports:** Named exports, no barrel files
4. **Components:** Server Components by default, add 'use client' when needed
5. **Data:** Server Components -> Server Actions -> TanStack Query
6. **Validation:** Zod schemas in feature `schemas.ts`
7. **Styling:** Tailwind + cn() helper from `@/lib/utils`
8. **Commits:** Conventional commits (feat:, fix:, chore:, docs:) - NO Claude co-author footer

## Project Structure

```
src/
├── app/                 # Next.js App Router (no [locale] in paths)
│   ├── (auth)/          # Auth pages (login, register, forgot-password)
│   └── api/             # API routes
├── components/ui/       # ShadCN components (base-vega style)
├── config/              # Environment & site config (env.ts, site.ts)
├── db/                  # Drizzle schema, migrations, repositories
├── emails/              # React Email templates
├── features/            # Feature modules (auth, setup)
├── i18n/                # Internationalization config
├── lib/                 # Utilities (auth, db, email)
├── providers/           # React providers
└── server/api/          # Hono API
```

## CLI-First Principle

Always check official documentation for CLI tools before manual setup:
- ShadCN: `bunx --bun shadcn@latest add <component>`
- Better Auth: `bunx @better-auth/cli generate`
- Sentry: `bunx @sentry/wizard@latest -i nextjs`
- Playwright: `bunx create-playwright`

## Next.js 16 Notes

- **Async params:** Props like `params` and `searchParams` are Promises
  ```tsx
  const { locale } = await props.params
  ```
- **Proxy:** Uses `proxy.ts` instead of `middleware.ts`
- **Typed Routes:** Link href is type-safe

## Testing Guidelines

- **E2E tests:** `tests/e2e/` directory, use `.test.ts` extension
- **Unit tests:** Complex logic only, co-located (file.test.ts)
- Don't unit test simple components or wrappers
- **Retries:** Set to 0 to avoid masking flaky tests
- Run `bun lint && bun typecheck` after implementation

## Resources

- Better Auth: https://www.better-auth.com/llms.txt
- Drizzle: https://orm.drizzle.team/docs
- Hono: https://hono.dev
- ShadCN: https://ui.shadcn.com
