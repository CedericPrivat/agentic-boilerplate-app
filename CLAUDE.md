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
# Development
bun dev              # Start dev server + Docker services
bun dev:services     # Start Docker services only
bun build            # Build for production
bun start            # Start production server

# Code Quality
bun lint             # Check linting (Ultracite/Biome)
bun lint:fix         # Fix linting issues
bun typecheck        # TypeScript type check

# Testing
bun test             # Run unit tests (Bun)
bun test:e2e         # Run E2E tests (Playwright)
bun test:e2e:ui      # Run E2E tests with UI

# Database
bun db:generate      # Generate Drizzle migrations
bun db:migrate       # Run pending migrations
bun db:push          # Push schema to database
bun db:studio        # Open Drizzle Studio
bun db:seed          # Seed database

# Email
bun email:dev        # Start React Email dev server
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
2. **React imports:** Use specific imports, not namespace imports (e.g., `import type { ComponentProps } from "react"` not `import type * as React from "react"`)
3. **Exports:** Named exports, no barrel files
4. **Components:** Server Components by default, add 'use client' when needed
5. **Data:** Server Components -> Server Actions -> TanStack Query
6. **Validation:** Zod schemas in feature `schemas.ts`
7. **Styling:** Tailwind + cn() helper from `@/lib/utils`
8. **Commits:** Conventional commits (feat:, fix:, chore:, docs:) - NO Claude co-author footer

## Ultracite Code Standards

This project uses **Ultracite**, a zero-config Biome preset that enforces strict code quality standards through automated formatting and linting.

### Quick Reference

- **Check for issues**: `bun lint`
- **Fix issues**: `bun lint:fix`

Biome (the underlying engine) provides extremely fast Rust-based linting and formatting. Most issues are automatically fixable.

### Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

#### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

#### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

#### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

#### React & JSX

- Use function components over class components
- Call hooks at the top level only, never conditionally
- Specify all dependencies in hook dependency arrays correctly
- Use the `key` prop for elements in iterables (prefer unique IDs over array indices)
- Nest children between opening and closing tags instead of passing as props
- Don't define components inside other components
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images
  - Use proper heading hierarchy
  - Add labels for form inputs
  - Include keyboard event handlers alongside mouse events
  - Use semantic elements (`<button>`, `<nav>`, etc.) instead of divs with roles

#### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

#### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

#### Security

- Add `rel="noopener"` when using `target="_blank"` on links
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

#### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)
- Use proper image components (e.g., Next.js `<Image>`) over `<img>` tags

#### Framework-Specific Guidance

**Next.js:**
- Use Next.js `<Image>` component for images
- Use `next/head` or App Router metadata API for head elements
- Use Server Components for async data fetching instead of async Client Components

**React 19+:**
- Use ref as a prop instead of `React.forwardRef`

### Testing Standards

- Write assertions inside `it()` or `test()` blocks
- Avoid done callbacks in async tests - use async/await instead
- Don't use `.only` or `.skip` in committed code
- Keep test suites reasonably flat - avoid excessive `describe` nesting

### When Biome Can't Help

Focus your attention on:

1. **Business logic correctness** - Biome can't validate your algorithms
2. **Meaningful naming** - Use descriptive names for functions, variables, and types
3. **Architecture decisions** - Component structure, data flow, and API design
4. **Edge cases** - Handle boundary conditions and error states
5. **User experience** - Accessibility, performance, and usability considerations
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code

Most formatting and common issues are automatically fixed by Biome. Run `bun lint:fix` before committing to ensure compliance.

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
