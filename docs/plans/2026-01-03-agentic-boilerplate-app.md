# Agentic Boilerplate App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a production-ready Next.js 16 boilerplate with a CLI scaffolding tool (`create-agentic-app`) for customizable stack setup.

**Architecture:** Two-part system: (1) Base template in root with auth pages, setup checklist, and full tech stack. (2) CLI tool in `cli/` folder that scaffolds projects with optional addons (Zustand, PartyKit, UploadThing, OpenRouter, Polar.sh).

**Tech Stack:** Next.js 16 + React 19 + Bun + TailwindCSS 4 + ShadCN/UI + PostgreSQL + Drizzle ORM + Better Auth + Hono API + Zod + Resend + next-intl + Sentry + Playwright

---

## ⚠️ IMPORTANT IMPLEMENTATION NOTES

> **These notes reflect decisions made during implementation. Follow them for all tasks.**

### 1. Cookie-Based i18n (No Locale in URL Paths)
- **DO NOT use `[locale]` in route paths** (e.g., use `src/app/(auth)/login` NOT `src/app/[locale]/(auth)/login`)
- Locale is detected from cookie, not URL
- Configuration is in `src/i18n/request.ts` which reads from cookie
- IntlProvider is integrated into `src/providers/index.tsx`

### 2. ShadCN Field Component (Form is DEPRECATED)
- **DO NOT use the Form component** - it is deprecated
- **USE Field component instead** for all form fields
- Install with: `bunx --bun shadcn@latest add field`
- Components: `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet`
- Use `data-invalid` on Field and `aria-invalid` on Input for error states
- Pass `errors` prop to FieldError or use children

### 3. Always Check ShadCN Docs Before Implementing
- ShadCN components evolve - check https://ui.shadcn.com/docs/components before implementing
- This project uses "base-vega" style with @base-ui/react

### 4. React Import Convention
- **DO NOT use `import * as React` or `import type * as React`**
- Import specific types/functions: `import type { ReactNode, ComponentProps } from "react"`
- Exception: Schema imports in db/index.ts can use namespace imports

### 5. Named Exports and No Barrel Files
- Prefer named exports over default exports
- No barrel files - use folder patterns instead

### 6. Git Commit Messages
- **DO NOT add Claude Code co-author** to commit messages
- **DO NOT add "🤖 Generated with Claude Code"** footer
- Keep commit messages clean and conventional (feat:, fix:, chore:, etc.)

### 7. Testing Conventions
- **Use `.test.ts` extension** for all test files (NOT `.spec.ts`)
- E2E tests go in `tests/e2e/` directory
- Unit tests are co-located with source files in `src/`
- Do NOT write unit tests for simple utilities (like `cn()`)
- Set `retries: 0` to avoid masking flaky tests

### 8. Code Review After Implementation
- **ALWAYS run code reviewers after implementing a phase or feature**
- Reviewers must run: linter, formatter, and typechecker
- Fix all issues before proceeding to next phase
- Question the implementation plan if something seems wrong

---

## Phase 1: Project Foundation

### Task 1.1: Initialize Next.js 16 Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

**Step 1: Initialize Next.js with Bun**

Run: `bunx create-next-app@latest . --typescript --tailwind --eslint=false --app --src-dir --import-alias "@/*" --turbopack --yes`

Expected: Project initialized with Next.js 16, creates package.json, tsconfig.json, next.config.ts, src/app structure

**Step 2: Verify initialization**

Run: `ls -la && cat package.json | head -30`
Expected: Files created, Next.js 16.x in dependencies

**Step 3: Commit initialization**

```bash
git add -A && git commit -m "feat: initialize Next.js 16 project with Bun and TailwindCSS"
```

---

### Task 1.2: Clean Up Next.js Boilerplate

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Delete: `public/` default assets (if any)

**Step 1: Replace page.tsx with minimal content**

Replace `src/app/page.tsx` with:
```tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Agentic Boilerplate</h1>
      <p className="mt-4 text-muted-foreground">Setup checklist coming soon...</p>
    </main>
  )
}
```

**Step 2: Clean globals.css to minimal Tailwind imports**

Replace `src/app/globals.css` with:
```css
@import "tailwindcss";
```

**Step 3: Configure Inter font in layout.tsx**

Replace default font import in `src/app/layout.tsx` with:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agentic Boilerplate',
  description: 'Production-ready Next.js 16 boilerplate with CLI scaffolding',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

**Step 4: Remove default assets**

Run: `rm -f public/next.svg public/vercel.svg public/file.svg public/globe.svg public/window.svg 2>/dev/null || true`
Expected: Default SVGs removed (or already absent)

**Step 5: Run dev server to verify**

Run: `bun dev &` (wait 5s) then `curl -s http://localhost:3000 | head -20` then `pkill -f 'next dev'`
Expected: Server starts, page renders without errors

**Step 6: Commit cleanup**

```bash
git add -A && git commit -m "chore: clean up Next.js boilerplate, configure Inter font"
```

---

### Task 1.3: Configure TypeScript and Path Aliases

**Files:**
- Modify: `tsconfig.json`

**Step 1: Update tsconfig.json with strict settings and path aliases**

Ensure `tsconfig.json` contains:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 2: Verify TypeScript compiles**

Run: `bun run tsc --noEmit`
Expected: No errors

**Step 3: Commit TypeScript config**

```bash
git add tsconfig.json && git commit -m "chore: configure TypeScript with strict mode and path aliases"
```

---

### Task 1.4: Configure Next.js 16 Features

**Files:**
- Modify: `next.config.ts`

**Step 1: Update next.config.ts with Next.js 16 features**

Replace `next.config.ts` with:
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    reactCompiler: true,
  },
}

export default nextConfig
```

**Step 2: Verify config is valid**

Run: `bun run next build --dry-run 2>&1 | head -10 || echo "Config validated"`
Expected: No syntax errors

**Step 3: Commit Next.js config**

```bash
git add next.config.ts && git commit -m "feat: enable Next.js 16 typed routes and React Compiler"
```

---

### Task 1.5: Install and Configure Ultracite (Biome)

**Files:**
- Create: `biome.json`
- Modify: `package.json`

**Step 1: Install Ultracite**

Run: `bun add -D ultracite`
Expected: ultracite added to devDependencies

**Step 2: Initialize Ultracite config**

Run: `bunx ultracite init`
Expected: biome.json created

**Step 3: Add custom Biome rules for the project**

Merge these rules into `biome.json`:
```json
{
  "linter": {
    "rules": {
      "style": {
        "noProcessEnv": "error"
      },
      "suspicious": {
        "noUnknownAtRules": "off"
      }
    }
  }
}
```

**Step 4: Add lint scripts to package.json**

Add to scripts section:
```json
{
  "lint": "ultracite check",
  "lint:fix": "ultracite fix"
}
```

**Step 5: Run lint to verify**

Run: `bun run lint`
Expected: Passes or shows fixable issues

**Step 6: Commit Ultracite setup**

```bash
git add -A && git commit -m "feat: add Ultracite (Biome) for linting and formatting"
```

---

### Task 1.6: Configure Husky and lint-staged

**Files:**
- Create: `.husky/pre-commit`
- Create: `lint-staged.config.ts`
- Modify: `package.json`

**Step 1: Install Husky and lint-staged**

Run: `bun add -D husky lint-staged`
Expected: Packages added to devDependencies

**Step 2: Initialize Husky**

Run: `bunx husky init`
Expected: .husky directory created with pre-commit hook

**Step 3: Create lint-staged config**

Create `lint-staged.config.ts`:
```ts
const config = {
  '*.{ts,tsx,js,jsx}': ['ultracite fix', 'ultracite check'],
  '*.{json,md}': ['ultracite fix'],
}

export default config
```

**Step 4: Update pre-commit hook**

Replace `.husky/pre-commit` with:
```bash
bunx lint-staged
```

**Step 5: Add prepare script to package.json**

Add to scripts:
```json
{
  "prepare": "husky"
}
```

**Step 6: Test pre-commit hook**

Run: `echo "test" > test.txt && git add test.txt && git commit -m "test: hook test" --dry-run`
Expected: lint-staged runs

**Step 7: Clean up test file**

Run: `rm test.txt`

**Step 8: Commit Husky setup**

```bash
git add -A && git commit -m "feat: add Husky and lint-staged for pre-commit hooks"
```

---

### Task 1.7: Configure Commitlint

**Files:**
- Create: `commitlint.config.ts`
- Create: `.husky/commit-msg`

**Step 1: Install commitlint**

Run: `bun add -D @commitlint/cli @commitlint/config-conventional`
Expected: Packages added

**Step 2: Create commitlint config**

Create `commitlint.config.ts`:
```ts
import type { UserConfig } from '@commitlint/types'

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
}

export default config
```

**Step 3: Create commit-msg hook**

Create `.husky/commit-msg`:
```bash
bunx --no -- commitlint --edit $1
```

**Step 4: Make hook executable**

Run: `chmod +x .husky/commit-msg`

**Step 5: Test commitlint**

Run: `echo "bad commit" | bunx commitlint`
Expected: Error about commit format

Run: `echo "feat: test message" | bunx commitlint`
Expected: Passes

**Step 6: Commit commitlint setup**

```bash
git add -A && git commit -m "feat: add commitlint for conventional commits"
```

---

### Task 1.8: Create Environment Configuration

**Files:**
- Create: `.env.example`
- Create: `bunfig.toml`

**Step 1: Create .env.example**

Create `.env.example`:
```env
# Database credentials
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=agentic_app

# Composite DATABASE_URL using Bun's native variable expansion
DATABASE_URL=postgresql://$DATABASE_USER:$DATABASE_PASSWORD@$DATABASE_HOST:$DATABASE_PORT/$DATABASE_NAME

# Authentication
BETTER_AUTH_SECRET=your-secret-here-min-32-chars-long
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=noreply@yourdomain.com

# Uptime Kuma (monitoring)
UPTIME_KUMA_PORT=3001
UPTIME_KUMA_URL=http://localhost:$UPTIME_KUMA_PORT

# Umami Analytics
NEXT_PUBLIC_UMAMI_URL=
NEXT_PUBLIC_UMAMI_WEBSITE_ID=

# Sentry
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

**Step 2: Create bunfig.toml**

Create `bunfig.toml`:
```toml
[install]
peer = false

[publish]
registry = "https://registry.npmjs.org/"
```

**Step 3: Copy .env.example to .env**

Run: `cp .env.example .env`
Expected: Local .env created

**Step 4: Update .gitignore for .env**

Ensure `.gitignore` contains `.env` (should already from Next.js init)

**Step 5: Commit environment config**

```bash
git add .env.example bunfig.toml && git commit -m "feat: add environment configuration and bunfig"
```

---

## Phase 2: Database & Docker

### Task 2.1: Create Docker Compose for PostgreSQL

**Files:**
- Create: `docker/docker-compose.yml`

**Step 1: Create docker directory**

Run: `mkdir -p docker`

**Step 2: Create docker-compose.yml**

Create `docker/docker-compose.yml`:
```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: agentic-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${DATABASE_USER:-postgres}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD:-password}
      POSTGRES_DB: ${DATABASE_NAME:-agentic_app}
    ports:
      - "${DATABASE_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: agentic-uptime-kuma
    restart: unless-stopped
    ports:
      - "${UPTIME_KUMA_PORT:-3001}:3001"
    volumes:
      - uptime_kuma_data:/app/data

volumes:
  postgres_data:
  uptime_kuma_data:
```

**Step 3: Test Docker Compose config**

Run: `docker compose -f docker/docker-compose.yml config`
Expected: Valid YAML output

**Step 4: Commit Docker setup**

```bash
git add docker/ && git commit -m "feat: add Docker Compose for PostgreSQL and Uptime Kuma"
```

---

### Task 2.2: Install and Configure Drizzle ORM

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/db/index.ts`
- Modify: `package.json`

**Step 1: Install Drizzle dependencies**

Run: `bun add drizzle-orm postgres && bun add -D drizzle-kit`
Expected: Packages installed

**Step 2: Create drizzle.config.ts**

Create `drizzle.config.ts`:
```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

**Step 3: Create database connection**

Create `src/db/index.ts`:
```ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString)
export const db = drizzle(client, { schema })
```

**Step 4: Create schema directory and index**

Run: `mkdir -p src/db/schema`

Create `src/db/schema/index.ts`:
```ts
// Schema exports will be added here
// export * from './users'
// export * from './sessions'
```

**Step 5: Add database scripts to package.json**

Add to scripts:
```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

**Step 6: Commit Drizzle setup**

```bash
git add -A && git commit -m "feat: add Drizzle ORM with PostgreSQL configuration"
```

---

### Task 2.3: Install and Configure Better Auth

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/lib/auth-client.ts`
- Create: `src/app/api/auth/[...all]/route.ts`
- Modify: `src/db/schema/index.ts`

**Step 1: Install Better Auth**

Run: `bun add better-auth`
Expected: Package installed

**Step 2: Generate Better Auth schema**

Run: `bunx @better-auth/cli generate --config src/lib/auth.ts --output src/db/schema/auth.ts`

Note: This may fail initially. If so, create auth.ts first then run generate.

**Step 3: Create auth configuration**

Create `src/lib/auth.ts`:
```ts
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from '@/db'
import * as schema from '@/db/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
})
```

**Step 4: Create auth client**

Create `src/lib/auth-client.ts`:
```ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? 'http://localhost:3000',
})

export const { signIn, signOut, signUp, useSession } = authClient
```

**Step 5: Create auth API route**

Create directory: `mkdir -p src/app/api/auth/[...all]`

Create `src/app/api/auth/[...all]/route.ts`:
```ts
import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@/lib/auth'

export const { GET, POST } = toNextJsHandler(auth)
```

**Step 6: Generate auth schema after auth.ts exists**

Run: `bunx @better-auth/cli generate`
Expected: Schema files generated in src/db/schema/

**Step 7: Update schema index to export auth schema**

Update `src/db/schema/index.ts`:
```ts
export * from './auth'
```

**Step 8: Commit Better Auth setup**

```bash
git add -A && git commit -m "feat: add Better Auth with email/password and Google OAuth"
```

---

### Task 2.4: Create Database Scripts and Test Connection

**Files:**
- Modify: `package.json`
- Create: `scripts/seed.ts`

**Step 1: Add dev:services script**

Add to package.json scripts:
```json
{
  "dev:services": "docker compose -f docker/docker-compose.yml up -d",
  "dev": "bun run dev:services && bun --bun next dev"
}
```

**Step 2: Create scripts directory**

Run: `mkdir -p scripts`

**Step 3: Create seed script placeholder**

Create `scripts/seed.ts`:
```ts
import { db } from '@/db'

async function seed() {
  console.log('Seeding database...')

  // Add seed data here

  console.log('Seeding complete!')
  process.exit(0)
}

seed().catch((error) => {
  console.error('Seeding failed:', error)
  process.exit(1)
})
```

**Step 4: Add seed script to package.json**

Add to scripts:
```json
{
  "db:seed": "bun run scripts/seed.ts"
}
```

**Step 5: Start services and test connection**

Run: `bun run dev:services`
Expected: PostgreSQL and Uptime Kuma containers start

Run: `docker ps | grep agentic`
Expected: Both containers running

**Step 6: Generate initial migration**

Run: `bun run db:generate`
Expected: Migration files created in src/db/migrations/

**Step 7: Run migration**

Run: `bun run db:migrate`
Expected: Tables created in database

**Step 8: Commit database scripts**

```bash
git add -A && git commit -m "feat: add database scripts and seed placeholder"
```

---

## Phase 3: API Layer

### Task 3.1: Install and Configure Hono with OpenAPI

**Files:**
- Create: `src/server/api/index.ts`
- Create: `src/app/api/[[...route]]/route.ts`

**Step 1: Install Hono packages**

Run: `bun add hono @hono/zod-openapi @scalar/hono-api-reference`
Expected: Packages installed

**Step 2: Create API directory structure**

Run: `mkdir -p src/server/api/routes src/server/api/middleware`

**Step 3: Create main Hono app**

Create `src/server/api/index.ts`:
```ts
import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'

const app = new OpenAPIHono()

// OpenAPI documentation
app.doc('/doc', {
  openapi: '3.1.0',
  info: {
    title: 'Agentic Boilerplate API',
    version: '1.0.0',
  },
})

// Scalar UI
app.get(
  '/reference',
  apiReference({
    spec: {
      url: '/api/doc',
    },
    theme: 'kepler',
  })
)

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})

export default app
```

**Step 4: Create catch-all route handler**

Create directory: `mkdir -p "src/app/api/[[...route]]"`

Create `src/app/api/[[...route]]/route.ts`:
```ts
import { handle } from 'hono/vercel'

import app from '@/server/api'

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
```

**Step 5: Test API endpoints**

Run: `bun dev &` (wait 5s)

Run: `curl -s http://localhost:3000/api/health`
Expected: `{"status":"ok","timestamp":"..."}`

Run: `curl -s http://localhost:3000/api/doc | head -20`
Expected: OpenAPI JSON spec

Run: `pkill -f 'next dev'`

**Step 6: Commit Hono API setup**

```bash
git add -A && git commit -m "feat: add Hono API with OpenAPI documentation and Scalar UI"
```

---

### Task 3.2: Create Repository Pattern Base

**Files:**
- Create: `src/db/repositories/base.repository.ts`
- Create: `src/db/repositories/user.repository.ts`

**Step 1: Create repositories directory**

Run: `mkdir -p src/db/repositories`

**Step 2: Create base repository**

Create `src/db/repositories/base.repository.ts`:
```ts
import { db } from '@/db'

export abstract class BaseRepository {
  protected db = db
}
```

**Step 3: Create user repository**

Create `src/db/repositories/user.repository.ts`:
```ts
import { eq } from 'drizzle-orm'

import { user } from '@/db/schema'

import { BaseRepository } from './base.repository'

export class UserRepository extends BaseRepository {
  async findById(id: string) {
    const result = await this.db.query.user.findFirst({
      where: eq(user.id, id),
    })
    return result
  }

  async findByEmail(email: string) {
    const result = await this.db.query.user.findFirst({
      where: eq(user.email, email),
    })
    return result
  }
}

export const userRepository = new UserRepository()
```

**Step 4: Commit repository pattern**

```bash
git add -A && git commit -m "feat: add repository pattern for data access"
```

---

### Task 3.3: Create Health Check Endpoint

**Files:**
- Create: `src/app/api/health/route.ts`

**Step 1: Create dedicated health route**

Create `src/app/api/health/route.ts`:
```ts
import { NextResponse } from 'next/server'

import { db } from '@/db'

export async function GET() {
  const startTime = Date.now()

  try {
    // Check database connection
    await db.execute('SELECT 1')

    const responseTime = Date.now() - startTime

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'connected',
        api: 'responsive',
      },
      responseTime: `${responseTime}ms`,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'disconnected',
          api: 'responsive',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
```

**Step 2: Test health endpoint**

Run: `bun run dev:services && bun dev &` (wait 5s)

Run: `curl -s http://localhost:3000/api/health`
Expected: `{"status":"healthy",...}`

Run: `pkill -f 'next dev'`

**Step 3: Commit health endpoint**

```bash
git add -A && git commit -m "feat: add health check endpoint for monitoring"
```

---

## Phase 4: UI Framework

### Task 4.1: Initialize ShadCN/UI

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Modify: `src/app/globals.css`

**Step 1: Initialize ShadCN**

Run: `bunx --bun shadcn@latest init -d`

Answer prompts:
- Style: Default
- Base color: Slate
- CSS variables: Yes

Expected: components.json created, globals.css updated, lib/utils.ts created

**Step 2: Verify initialization**

Run: `cat components.json`
Expected: ShadCN configuration

**Step 3: Commit ShadCN initialization**

```bash
git add -A && git commit -m "feat: initialize ShadCN/UI"
```

---

### Task 4.2: Add Core ShadCN Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/skeleton.tsx`
- Create: `src/components/ui/sonner.tsx`

**Step 1: Install core components**

Run: `bunx --bun shadcn@latest add button input card skeleton sonner -y`
Expected: Components added to src/components/ui/

**Step 2: Install additional form dependencies**

Run: `bun add react-hook-form @hookform/resolvers`
Expected: Packages installed

**Step 3: Add form and label components**

Run: `bunx --bun shadcn@latest add form label -y`
Expected: Form components added

**Step 4: Verify components exist**

Run: `ls src/components/ui/`
Expected: button.tsx, input.tsx, card.tsx, skeleton.tsx, sonner.tsx, form.tsx, label.tsx

**Step 5: Commit ShadCN components**

```bash
git add -A && git commit -m "feat: add core ShadCN/UI components"
```

---

### Task 4.3: Set Up Providers

**Files:**
- Create: `src/providers/index.tsx`
- Create: `src/providers/theme-provider.tsx`
- Create: `src/providers/query-provider.tsx`
- Create: `src/providers/toaster-provider.tsx`

**Step 1: Install provider dependencies**

Run: `bun add next-themes @tanstack/react-query sonner`
Expected: Packages installed

**Step 2: Create providers directory**

Run: `mkdir -p src/providers`

**Step 3: Create theme provider**

Create `src/providers/theme-provider.tsx`:
```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Step 4: Create query provider**

Create `src/providers/query-provider.tsx`:
```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

**Step 5: Create toaster provider**

Create `src/providers/toaster-provider.tsx`:
```tsx
'use client'

import { Toaster } from 'sonner'

export function ToasterProvider() {
  return <Toaster richColors position="top-right" />
}
```

**Step 6: Create combined providers**

Create `src/providers/index.tsx`:
```tsx
'use client'

import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'
import { ToasterProvider } from './toaster-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        {children}
        <ToasterProvider />
      </QueryProvider>
    </ThemeProvider>
  )
}
```

**Step 7: Update root layout to use providers**

Update `src/app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '@/providers'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agentic Boilerplate',
  description: 'Production-ready Next.js 16 boilerplate with CLI scaffolding',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**Step 8: Commit providers**

```bash
git add -A && git commit -m "feat: add theme, query, and toaster providers"
```

---

## Phase 5: Internationalization

### Task 5.1: Install and Configure next-intl

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `messages/en.json`
- Create: `messages/de.json`
- Create: `proxy.ts`

**Step 1: Install next-intl**

Run: `bun add next-intl`
Expected: Package installed

**Step 2: Create i18n directory**

Run: `mkdir -p src/i18n messages`

**Step 3: Create routing config**

Create `src/i18n/routing.ts`:
```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'de'],
  defaultLocale: 'en',
})
```

**Step 4: Create request config**

Create `src/i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as 'en' | 'de')) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
```

**Step 5: Create English messages**

Create `messages/en.json`:
```json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "submit": "Submit"
  },
  "auth": {
    "login": "Log in",
    "logout": "Log out",
    "register": "Register",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot password?",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?"
  },
  "setup": {
    "title": "Setup Checklist",
    "description": "Complete the following steps to get started",
    "recheckAll": "Re-check All",
    "lastChecked": "Last checked: {time}"
  }
}
```

**Step 6: Create German messages**

Create `messages/de.json`:
```json
{
  "common": {
    "loading": "Wird geladen...",
    "error": "Ein Fehler ist aufgetreten",
    "save": "Speichern",
    "cancel": "Abbrechen",
    "delete": "Loschen",
    "edit": "Bearbeiten",
    "submit": "Absenden"
  },
  "auth": {
    "login": "Anmelden",
    "logout": "Abmelden",
    "register": "Registrieren",
    "email": "E-Mail",
    "password": "Passwort",
    "forgotPassword": "Passwort vergessen?",
    "noAccount": "Noch kein Konto?",
    "hasAccount": "Bereits ein Konto?"
  },
  "setup": {
    "title": "Einrichtungscheckliste",
    "description": "Folgen Sie diesen Schritten um zu starten",
    "recheckAll": "Alle erneut prufen",
    "lastChecked": "Zuletzt gepruft: {time}"
  }
}
```

**Step 7: Create proxy.ts for Next.js 16**

Create `proxy.ts`:
```ts
import createIntlMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'

import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export default function proxy(request: NextRequest) {
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(de|en)/:path*'],
}
```

**Step 8: Update next.config.ts for i18n**

Update `next.config.ts`:
```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    reactCompiler: true,
  },
}

export default withNextIntl(nextConfig)
```

**Step 9: Commit i18n setup**

```bash
git add -A && git commit -m "feat: add next-intl for internationalization (en, de)"
```

---

### Task 5.2: Create Locale Layout and Pages

**Files:**
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create locale directory**

Run: `mkdir -p "src/app/[locale]"`

**Step 2: Create locale layout**

Create `src/app/[locale]/layout.tsx`:
```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { routing } from '@/i18n/routing'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'de')) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
```

**Step 3: Create locale home page**

Create `src/app/[locale]/page.tsx`:
```tsx
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <HomePageContent />
}

function HomePageContent() {
  const t = useTranslations('setup')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <p className="mt-4 text-muted-foreground">{t('description')}</p>
    </main>
  )
}
```

**Step 4: Update root page to redirect**

Update `src/app/page.tsx`:
```tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/en')
}
```

**Step 5: Verify i18n works**

Run: `bun dev &` (wait 5s)

Run: `curl -s http://localhost:3000/en | grep -o "Setup Checklist"`
Expected: "Setup Checklist"

Run: `curl -s http://localhost:3000/de | grep -o "Einrichtungscheckliste"`
Expected: "Einrichtungscheckliste"

Run: `pkill -f 'next dev'`

**Step 6: Commit locale pages**

```bash
git add -A && git commit -m "feat: add locale layout and pages with i18n support"
```

---

## Phase 6: Email Setup

### Task 6.1: Install and Configure Resend

**Files:**
- Create: `src/lib/email.ts`
- Create: `src/emails/components/email-layout.tsx`
- Create: `src/emails/welcome.tsx`

**Step 1: Install email packages**

Run: `bun add resend @react-email/components`
Expected: Packages installed

**Step 2: Create email client**

Create `src/lib/email.ts`:
```ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[]
  subject: string
  react: React.ReactElement
}) {
  const from = process.env.EMAIL_FROM ?? 'noreply@example.com'

  return resend.emails.send({
    from,
    to,
    subject,
    react,
  })
}
```

**Step 3: Create emails directory**

Run: `mkdir -p src/emails/components`

**Step 4: Create email layout component**

Create `src/emails/components/email-layout.tsx`:
```tsx
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components'

type EmailLayoutProps = {
  preview: string
  children: React.ReactNode
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-lg rounded border border-solid border-gray-200 p-5">
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
```

**Step 5: Create welcome email template**

Create `src/emails/welcome.tsx`:
```tsx
import { Heading, Link, Text } from '@react-email/components'

import { EmailLayout } from './components/email-layout'

type WelcomeEmailProps = {
  name: string
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Welcome to Agentic App, ${name}!`}>
      <Heading className="text-2xl font-bold text-gray-900">
        Welcome, {name}!
      </Heading>
      <Text className="text-gray-600">
        Thank you for signing up. We're excited to have you on board.
      </Text>
      <Text className="text-gray-600">
        If you have any questions, feel free to{' '}
        <Link href="mailto:support@example.com" className="text-blue-600">
          contact us
        </Link>
        .
      </Text>
    </EmailLayout>
  )
}

export default WelcomeEmail
```

**Step 6: Add email dev script**

Add to package.json scripts:
```json
{
  "email:dev": "email dev --dir src/emails"
}
```

**Step 7: Commit email setup**

```bash
git add -A && git commit -m "feat: add Resend email client and welcome email template"
```

---

## Phase 7: Auth Pages

### Task 7.1: Create Auth Layout and Login Page

**Files:**
- Create: `src/app/[locale]/(auth)/layout.tsx`
- Create: `src/app/[locale]/(auth)/login/page.tsx`
- Create: `src/features/auth/schemas.ts`

**Step 1: Create auth directory structure**

Run: `mkdir -p "src/app/[locale]/(auth)/login" "src/app/[locale]/(auth)/register" "src/app/[locale]/(auth)/forgot-password" src/features/auth`

**Step 2: Create auth schemas**

Create `src/features/auth/schemas.ts`:
```ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
```

**Step 3: Create auth layout**

Create `src/app/[locale]/(auth)/layout.tsx`:
```tsx
type AuthLayoutProps = {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">{children}</div>
    </div>
  )
}
```

**Step 4: Create login page**

Create `src/app/[locale]/(auth)/login/page.tsx`:
```tsx
import { setRequestLocale } from 'next-intl/server'

import { LoginForm } from '@/features/auth/components/login-form'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <LoginForm />
}
```

**Step 5: Create login form component**

Create `src/features/auth/components/login-form.tsx`:
```tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signIn } from '@/lib/auth-client'

import { loginSchema, type LoginFormData } from '../schemas'

export function LoginForm() {
  const t = useTranslations('auth')

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    const result = await signIn.email({
      email: data.email,
      password: data.password,
    })

    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success('Logged in successfully')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('login')}</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {t('login')}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:underline"
          >
            {t('forgotPassword')}
          </Link>
        </div>
        <div className="mt-2 text-center text-sm">
          {t('noAccount')}{' '}
          <Link href="/register" className="text-primary hover:underline">
            {t('register')}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 6: Commit login page**

```bash
git add -A && git commit -m "feat: add auth layout and login page with form"
```

---

### Task 7.2: Create Register Page

**Files:**
- Create: `src/app/[locale]/(auth)/register/page.tsx`
- Create: `src/features/auth/components/register-form.tsx`

**Step 1: Create register page**

Create `src/app/[locale]/(auth)/register/page.tsx`:
```tsx
import { setRequestLocale } from 'next-intl/server'

import { RegisterForm } from '@/features/auth/components/register-form'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <RegisterForm />
}
```

**Step 2: Create register form component**

Create `src/features/auth/components/register-form.tsx`:
```tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signUp } from '@/lib/auth-client'

import { registerSchema, type RegisterFormData } from '../schemas'

export function RegisterForm() {
  const t = useTranslations('auth')

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: RegisterFormData) {
    const result = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    if (result.error) {
      toast.error(result.error.message)
    } else {
      toast.success('Account created successfully')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('register')}</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {t('register')}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-primary hover:underline">
            {t('login')}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 3: Commit register page**

```bash
git add -A && git commit -m "feat: add register page with form"
```

---

### Task 7.3: Create Forgot Password Page

**Files:**
- Create: `src/app/[locale]/(auth)/forgot-password/page.tsx`
- Create: `src/features/auth/components/forgot-password-form.tsx`

**Step 1: Create forgot password page**

Create `src/app/[locale]/(auth)/forgot-password/page.tsx`:
```tsx
import { setRequestLocale } from 'next-intl/server'

import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ForgotPasswordPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <ForgotPasswordForm />
}
```

**Step 2: Create forgot password form**

Create `src/features/auth/components/forgot-password-form.tsx`:
```tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas'

export function ForgotPasswordForm() {
  const t = useTranslations('auth')

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: ForgotPasswordFormData) {
    // TODO: Implement password reset with Better Auth
    toast.success('If an account exists, a reset link has been sent')
    console.log('Reset password for:', data.email)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('forgotPassword')}</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Back to {t('login')}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 3: Commit forgot password page**

```bash
git add -A && git commit -m "feat: add forgot password page with form"
```

---

## Phase 8: Setup Checklist Feature

### Task 8.1: Create Setup Check Types and Functions

**Files:**
- Create: `src/features/setup/types.ts`
- Create: `src/features/setup/checks.ts`

**Step 1: Create setup feature directory**

Run: `mkdir -p src/features/setup/components`

**Step 2: Create types**

Create `src/features/setup/types.ts`:
```ts
export type CheckStatus = 'success' | 'warning' | 'error' | 'pending'

export type CheckResult = {
  id: string
  name: string
  status: CheckStatus
  message: string
  helpText?: string
  copyValue?: string
  externalLink?: string
  actionButton?: {
    label: string
    action: string
  }
}

export type CheckGroup = {
  id: string
  icon: string
  title: string
  checks: CheckResult[]
}
```

**Step 3: Create check functions**

Create `src/features/setup/checks.ts`:
```ts
import type { CheckResult } from './types'

export async function checkDatabaseConnection(): Promise<CheckResult> {
  try {
    const response = await fetch('/api/health')
    const data = await response.json()

    if (data.checks?.database === 'connected') {
      return {
        id: 'db-connection',
        name: 'PostgreSQL connection',
        status: 'success',
        message: 'Database connected successfully',
      }
    }

    return {
      id: 'db-connection',
      name: 'PostgreSQL connection',
      status: 'error',
      message: 'Database connection failed',
      helpText: 'Start Docker services with: bun run dev:services',
    }
  } catch {
    return {
      id: 'db-connection',
      name: 'PostgreSQL connection',
      status: 'error',
      message: 'Could not check database status',
      helpText: 'Make sure the development server is running',
    }
  }
}

export async function checkEnvVar(
  name: string,
  displayName: string,
  copyTemplate?: string,
  externalLink?: string
): Promise<CheckResult> {
  // This will be called from server action
  const value = process.env[name]

  if (value && value.length > 0 && !value.includes('your-') && !value.includes('xxx')) {
    return {
      id: `env-${name.toLowerCase()}`,
      name: displayName,
      status: 'success',
      message: `${displayName} configured`,
    }
  }

  return {
    id: `env-${name.toLowerCase()}`,
    name: displayName,
    status: 'error',
    message: `${displayName} not configured`,
    copyValue: copyTemplate,
    externalLink,
  }
}
```

**Step 4: Commit setup types and checks**

```bash
git add -A && git commit -m "feat: add setup checklist types and check functions"
```

---

### Task 8.2: Create Setup Check Actions

**Files:**
- Create: `src/features/setup/actions.ts`

**Step 1: Create server actions**

Create `src/features/setup/actions.ts`:
```ts
'use server'

import { db } from '@/db'

import type { CheckGroup, CheckResult } from './types'

async function checkDatabase(): Promise<CheckResult> {
  try {
    await db.execute('SELECT 1')
    return {
      id: 'db-connection',
      name: 'PostgreSQL connection',
      status: 'success',
      message: 'Database connected',
    }
  } catch {
    return {
      id: 'db-connection',
      name: 'PostgreSQL connection',
      status: 'error',
      message: 'Connection failed',
      helpText: 'Run: bun run dev:services',
    }
  }
}

function checkEnv(name: string, displayName: string, copyTemplate?: string, link?: string): CheckResult {
  const value = process.env[name]
  const isConfigured = value && value.length > 0 && !value.includes('your-') && !value.includes('xxx')

  return {
    id: `env-${name.toLowerCase()}`,
    name: displayName,
    status: isConfigured ? 'success' : 'error',
    message: isConfigured ? 'Configured' : 'Not configured',
    copyValue: isConfigured ? undefined : copyTemplate,
    externalLink: isConfigured ? undefined : link,
  }
}

export async function runAllChecks(): Promise<{ groups: CheckGroup[]; lastChecked: string }> {
  const dbCheck = await checkDatabase()

  const groups: CheckGroup[] = [
    {
      id: 'database',
      icon: '📦',
      title: 'Database',
      checks: [dbCheck],
    },
    {
      id: 'auth',
      icon: '🔐',
      title: 'Authentication',
      checks: [
        checkEnv('BETTER_AUTH_SECRET', 'Auth Secret', 'BETTER_AUTH_SECRET=your-secret-min-32-chars'),
        checkEnv('GOOGLE_CLIENT_ID', 'Google OAuth', 'GOOGLE_CLIENT_ID=xxx', 'https://console.cloud.google.com/apis/credentials'),
      ],
    },
    {
      id: 'email',
      icon: '📧',
      title: 'Email',
      checks: [
        checkEnv('RESEND_API_KEY', 'Resend API Key', 'RESEND_API_KEY=re_xxx', 'https://resend.com/api-keys'),
        checkEnv('EMAIL_FROM', 'Email From', 'EMAIL_FROM=noreply@yourdomain.com'),
      ],
    },
    {
      id: 'analytics',
      icon: '📈',
      title: 'Analytics',
      checks: [
        checkEnv('NEXT_PUBLIC_UMAMI_URL', 'Umami URL', 'NEXT_PUBLIC_UMAMI_URL=https://analytics.yourdomain.com'),
        checkEnv('NEXT_PUBLIC_UMAMI_WEBSITE_ID', 'Umami Website ID', 'NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxx'),
      ],
    },
    {
      id: 'monitoring',
      icon: '🚨',
      title: 'Error Monitoring',
      checks: [
        checkEnv('SENTRY_DSN', 'Sentry DSN', 'SENTRY_DSN=https://xxx@sentry.io/xxx', 'https://sentry.io/'),
      ],
    },
  ]

  return {
    groups,
    lastChecked: new Date().toISOString(),
  }
}
```

**Step 2: Commit actions**

```bash
git add -A && git commit -m "feat: add setup check server actions"
```

---

### Task 8.3: Create Setup Checklist Components

**Files:**
- Create: `src/features/setup/components/check-item.tsx`
- Create: `src/features/setup/components/setup-checklist.tsx`

**Step 1: Create check item component**

Create `src/features/setup/components/check-item.tsx`:
```tsx
'use client'

import { Check, Copy, ExternalLink, X, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import type { CheckResult } from '../types'

const statusIcons = {
  success: <Check className="h-4 w-4 text-green-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  error: <X className="h-4 w-4 text-red-500" />,
  pending: <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />,
}

export function CheckItem({ check }: { check: CheckResult }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5">{statusIcons[check.status]}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{check.name}</span>
          <span className="text-sm text-muted-foreground">{check.message}</span>
        </div>
        {check.helpText && (
          <p className="text-sm text-muted-foreground">{check.helpText}</p>
        )}
        <div className="flex gap-2">
          {check.copyValue && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(check.copyValue!)}
            >
              <Copy className="mr-1 h-3 w-3" />
              Copy
            </Button>
          )}
          {check.externalLink && (
            <Button variant="outline" size="sm" asChild>
              <a href={check.externalLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />
                Open
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Install lucide-react**

Run: `bun add lucide-react`
Expected: Package installed

**Step 3: Create setup checklist component**

Create `src/features/setup/components/setup-checklist.tsx`:
```tsx
'use client'

import { RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { runAllChecks } from '../actions'
import type { CheckGroup } from '../types'

import { CheckItem } from './check-item'

export function SetupChecklist() {
  const t = useTranslations('setup')
  const [groups, setGroups] = useState<CheckGroup[]>([])
  const [lastChecked, setLastChecked] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(() => {
    startTransition(async () => {
      const result = await runAllChecks()
      setGroups(result.groups)
      setLastChecked(result.lastChecked)
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const completedCount = groups.reduce(
    (acc, group) => acc + group.checks.filter((c) => c.status === 'success').length,
    0
  )
  const totalCount = groups.reduce((acc, group) => acc + group.checks.length, 0)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">
            {completedCount}/{totalCount} checks passing
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastChecked && (
            <span className="text-sm text-muted-foreground">
              {t('lastChecked', {
                time: new Date(lastChecked).toLocaleTimeString(),
              })}
            </span>
          )}
          <Button onClick={refresh} disabled={isPending} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
            {t('recheckAll')}
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span>{group.icon}</span>
                {group.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {group.checks.map((check) => (
                <CheckItem key={check.id} check={check} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

**Step 4: Commit components**

```bash
git add -A && git commit -m "feat: add setup checklist UI components"
```

---

### Task 8.4: Update Home Page with Setup Checklist

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Update home page to use setup checklist**

Update `src/app/[locale]/page.tsx`:
```tsx
import { setRequestLocale } from 'next-intl/server'

import { SetupChecklist } from '@/features/setup/components/setup-checklist'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <SetupChecklist />
    </main>
  )
}
```

**Step 2: Verify setup checklist works**

Run: `bun run dev:services && bun dev &` (wait 5s)

Run: `curl -s http://localhost:3000/en | grep -o "Setup Checklist"`
Expected: "Setup Checklist"

Run: `pkill -f 'next dev'`

**Step 3: Commit home page update**

```bash
git add -A && git commit -m "feat: integrate setup checklist into home page"
```

---

## Phase 9: Type-Safe Environment

### Task 9.1: Configure @t3-oss/env-nextjs

**Files:**
- Create: `src/config/env.ts`
- Create: `src/config/site.ts`

**Step 1: Install t3-env**

Run: `bun add @t3-oss/env-nextjs`
Expected: Package installed

**Step 2: Create environment config**

Create `src/config/env.ts`:
```ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().email().optional(),
    SENTRY_DSN: z.string().url().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_UMAMI_URL: z.string().url().optional(),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',
})
```

**Step 3: Create site config**

Create `src/config/site.ts`:
```ts
export const siteConfig = {
  name: 'Agentic Boilerplate',
  description: 'Production-ready Next.js 16 boilerplate with CLI scaffolding',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ogImage: '/og.png',
  links: {
    github: 'https://github.com/cedericprivat/agentic-boilerplate-app',
  },
}
```

**Step 4: Commit environment config**

```bash
git add -A && git commit -m "feat: add type-safe environment configuration with t3-env"
```

---

## Phase 10: Testing Setup

### Task 10.1: Configure Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/auth.spec.ts`

**Step 1: Install Playwright**

Run: `bunx create-playwright --quiet`

Answer prompts:
- Directory: tests/e2e
- GitHub Actions: No (we'll add custom)
- Browsers: chromium only for speed

Expected: playwright.config.ts created

**Step 2: Update playwright.config.ts**

Replace with:
```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Step 3: Create auth E2E test**

Create `tests/e2e/auth.spec.ts`:
```ts
import { expect, test } from '@playwright/test'

test.describe('Authentication', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/en/login')
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('register page loads', async ({ page }) => {
    await page.goto('/en/register')
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible()
  })

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/en/forgot-password')
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible()
  })

  test('can navigate between auth pages', async ({ page }) => {
    await page.goto('/en/login')
    await page.getByRole('link', { name: /register/i }).click()
    await expect(page).toHaveURL(/\/en\/register/)
  })
})
```

**Step 4: Add test scripts to package.json**

Add to scripts:
```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

**Step 5: Commit Playwright setup**

```bash
git add -A && git commit -m "feat: add Playwright E2E testing configuration"
```

---

### Task 10.2: Configure Bun Unit Tests

**Files:**
- Create: `src/lib/utils.test.ts`

**Step 1: Create a sample unit test**

Create `src/lib/utils.test.ts`:
```ts
import { describe, expect, test } from 'bun:test'

import { cn } from './utils'

describe('cn utility', () => {
  test('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  test('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
  })

  test('deduplicates Tailwind classes', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })

  test('handles undefined values', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar')
  })
})
```

**Step 2: Add test script to package.json**

Add to scripts:
```json
{
  "test": "bun test"
}
```

**Step 3: Run tests to verify**

Run: `bun test`
Expected: Tests pass

**Step 4: Commit unit test setup**

```bash
git add -A && git commit -m "feat: add Bun unit testing with sample test"
```

---

## Phase 11: CI/CD

### Task 11.1: Create GitHub Actions CI Workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create workflows directory**

Run: `mkdir -p .github/workflows`

**Step 2: Create CI workflow**

Create `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun test

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bunx playwright install --with-deps chromium
      - name: Start services
        run: docker compose -f docker/docker-compose.yml up -d
      - name: Wait for services
        run: sleep 10
      - name: Run E2E tests
        run: bun run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/agentic_app
          BETTER_AUTH_SECRET: test-secret-that-is-at-least-32-chars-long
```

**Step 3: Add typecheck script to package.json**

Add to scripts:
```json
{
  "typecheck": "tsc --noEmit"
}
```

**Step 4: Commit CI workflow**

```bash
git add -A && git commit -m "feat: add GitHub Actions CI workflow"
```

---

## Phase 12: Claude Code Configuration

### Task 12.1: Create CLAUDE.md

**Files:**
- Create: `.claude/CLAUDE.md`

**Step 1: Create .claude directory**

Run: `mkdir -p .claude/agents .claude/commands`

**Step 2: Create CLAUDE.md**

Create `.claude/CLAUDE.md`:
```markdown
# Agentic Boilerplate - Claude Code Instructions

## Project Overview

Production-ready Next.js 16 boilerplate with CLI scaffolding tool. Features auth pages, setup checklist, and full modern stack.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Typed Routes, React Compiler)
- **Runtime:** Bun
- **Styling:** TailwindCSS 4 + ShadCN/UI
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (Google OAuth + Email/Password)
- **API:** Hono + OpenAPI + Scalar UI
- **Validation:** Zod
- **Email:** Resend + React Email
- **i18n:** next-intl (en, de)
- **Testing:** Playwright (E2E) + Bun test (unit)
- **Linting:** Ultracite (Biome)

## Common Commands

\`\`\`bash
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
\`\`\`

## Code Style

1. **Imports:** Always use `@/` alias imports
2. **React imports:** Use specific imports, not namespace imports (e.g., `import type { ComponentProps } from "react"` not `import type * as React from "react"`). Exception: Schema imports in `src/db/index.ts` may use namespace imports.
3. **Exports:** Named exports, no barrel files
4. **Components:** Server Components by default, add 'use client' when needed
5. **Data:** Server Components → Server Actions → TanStack Query
6. **Validation:** Zod schemas in feature `schemas.ts`
7. **Styling:** Tailwind + cn() helper from `@/lib/utils`
8. **Commits:** Conventional commits (feat:, fix:, chore:, docs:)

## Project Structure

\`\`\`
src/
├── app/                 # Next.js App Router
│   ├── [locale]/        # i18n routes
│   └── api/             # API routes
├── components/ui/       # ShadCN components
├── config/              # Environment & site config
├── db/                  # Drizzle schema, migrations, repositories
├── emails/              # React Email templates
├── features/            # Feature modules (auth, setup)
├── i18n/                # Internationalization config
├── lib/                 # Utilities (auth, db, email)
├── providers/           # React providers
└── server/api/          # Hono API
\`\`\`

## CLI-First Principle

Always check official documentation for CLI tools before manual setup:
- ShadCN: \`bunx --bun shadcn@latest add <component>\`
- Better Auth: \`bunx @better-auth/cli generate\`
- Sentry: \`bunx @sentry/wizard@latest -i nextjs\`
- Playwright: \`bunx create-playwright\`

## Next.js 16 Notes

- **Async params:** Props like `params` and `searchParams` are Promises
  \`\`\`tsx
  const { locale } = await props.params
  \`\`\`
- **Proxy:** Uses `proxy.ts` instead of `middleware.ts`
- **Typed Routes:** Link href is type-safe

## Testing Guidelines

- **E2E tests:** User flows, feature behavior (tests/e2e/)
- **Unit tests:** Complex logic only, co-located (file.test.ts)
- Don't unit test simple components or wrappers

## Resources

- Better Auth: https://www.better-auth.com/llms.txt
- Drizzle: https://orm.drizzle.team/docs
- Hono: https://hono.dev
- ShadCN: https://ui.shadcn.com
\`\`\`
```

**Step 3: Commit CLAUDE.md**

```bash
git add -A && git commit -m "feat: add Claude Code instructions (CLAUDE.md)"
```

---

### Task 12.2: Create Claude Settings

**Files:**
- Create: `.claude/settings.json`

**Step 1: Create settings.json**

Create `.claude/settings.json`:
```json
{
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Glob",
      "Grep",
      "Bash(bun *)",
      "Bash(bunx *)",
      "Bash(git *)",
      "Bash(docker *)",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(mkdir *)",
      "Bash(rm *)",
      "Bash(cp *)",
      "Bash(mv *)"
    ],
    "deny": []
  }
}
```

**Step 2: Commit settings**

```bash
git add -A && git commit -m "feat: add Claude Code permission settings"
```

---

### Task 12.3: Create Claude Agents

**Files:**
- Create: `.claude/agents/nextjs.md`
- Create: `.claude/agents/testing.md`
- Create: `.claude/agents/database.md`
- Create: `.claude/agents/auth.md`
- Create: `.claude/agents/api.md`

**Step 1: Create Next.js agent**

Create `.claude/agents/nextjs.md`:
```markdown
# Next.js Agent

## Next.js 16 Patterns

### Async Request APIs
\`\`\`tsx
type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params
  const query = await searchParams
}
\`\`\`

### Server Components (Default)
- Fetch data directly in components
- Use async/await at component level
- Only add 'use client' when needed (interactivity, hooks)

### Route Groups
- `(auth)` - Auth pages without layout nesting
- `[locale]` - i18n dynamic segment

### Loading States
- `loading.tsx` for route-level
- Suspense boundaries with Skeleton fallback
- Prefer optimistic updates with useOptimistic

### Proxy (not Middleware)
Uses `proxy.ts` for request interception:
\`\`\`ts
export default function proxy(request: NextRequest) {
  // Handle auth, i18n, redirects
}
\`\`\`
```

**Step 2: Create Testing agent**

Create `.claude/agents/testing.md`:
```markdown
# Testing Agent

## Philosophy
- Prefer E2E/integration tests over unit tests
- Unit test only complex pure logic
- Co-locate unit tests: `hooks.ts` → `hooks.test.ts`

## E2E with Playwright
Location: `tests/e2e/`

\`\`\`ts
test('user can login', async ({ page }) => {
  await page.goto('/en/login')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page).toHaveURL('/en')
})
\`\`\`

## Unit Tests with Bun
Co-located with source files.

\`\`\`ts
import { describe, expect, test } from 'bun:test'

describe('myFunction', () => {
  test('handles edge case', () => {
    expect(myFunction(input)).toBe(expected)
  })
})
\`\`\`

## Commands
- `bun test` - Run unit tests
- `bun test:e2e` - Run Playwright tests
- `bun test:e2e:ui` - Playwright UI mode
```

**Step 3: Create Database agent**

Create `.claude/agents/database.md`:
```markdown
# Database Agent

## Stack
- PostgreSQL 16
- Drizzle ORM
- Repository pattern

## Schema Location
`src/db/schema/`

## Common Operations

### Generate Migration
\`\`\`bash
bun db:generate
\`\`\`

### Run Migrations
\`\`\`bash
bun db:migrate
\`\`\`

### Drizzle Studio
\`\`\`bash
bun db:studio
\`\`\`

## Repository Pattern
Use repositories in `src/db/repositories/`:

\`\`\`ts
import { userRepository } from '@/db/repositories/user.repository'

const user = await userRepository.findById(id)
\`\`\`

## Schema Example
\`\`\`ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
\`\`\`
```

**Step 4: Create Auth agent**

Create `.claude/agents/auth.md`:
```markdown
# Auth Agent

## Stack
- Better Auth
- Google OAuth + Email/Password

## Documentation
https://www.better-auth.com/llms.txt

## Server-Side
\`\`\`ts
import { auth } from '@/lib/auth'

// In API route or server action
const session = await auth.api.getSession({
  headers: request.headers,
})
\`\`\`

## Client-Side
\`\`\`tsx
'use client'
import { useSession, signIn, signOut, signUp } from '@/lib/auth-client'

function LoginButton() {
  const { data: session } = useSession()

  if (session) {
    return <button onClick={() => signOut()}>Logout</button>
  }

  return (
    <button onClick={() => signIn.email({ email, password })}>
      Login
    </button>
  )
}
\`\`\`

## Adding New Providers
1. Add credentials to .env
2. Update `src/lib/auth.ts` socialProviders
3. Run: `bunx @better-auth/cli generate`
4. Run migrations: `bun db:migrate`
```

**Step 5: Create API agent**

Create `.claude/agents/api.md`:
```markdown
# API Agent

## Stack
- Hono with OpenAPIHono
- Zod for validation
- Scalar for API docs

## Endpoints
- `/api/doc` - OpenAPI JSON spec
- `/api/reference` - Scalar UI
- `/api/health` - Health check

## Creating Routes
\`\`\`ts
import { createRoute, z } from '@hono/zod-openapi'

const route = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'User found',
    },
  },
})

app.openapi(route, async (c) => {
  const { id } = c.req.valid('param')
  const user = await userRepository.findById(id)
  return c.json(user)
})
\`\`\`

## Middleware
Located in `src/server/api/middleware/`
```

**Step 6: Commit agents**

```bash
git add -A && git commit -m "feat: add Claude Code domain agents"
```

---

### Task 12.4: Create Remove Boilerplate Command

**Files:**
- Create: `.claude/commands/remove-boilerplate.md`

**Step 1: Create remove-boilerplate command**

Create `.claude/commands/remove-boilerplate.md`:
```markdown
# /remove-boilerplate

Remove the setup checklist and boilerplate files to prepare for your own application.

## What This Does

1. Removes `src/features/setup/` directory
2. Updates `src/app/[locale]/page.tsx` to a minimal starter
3. Clears README.md to a minimal template
4. Removes this command file

## Steps

1. Delete setup feature:
   \`\`\`bash
   rm -rf src/features/setup
   \`\`\`

2. Replace home page with minimal version:
   \`\`\`tsx
   // src/app/[locale]/page.tsx
   export default function HomePage() {
     return (
       <main className="flex min-h-screen flex-col items-center justify-center">
         <h1 className="text-4xl font-bold">Welcome</h1>
         <p className="mt-4 text-muted-foreground">
           Start building your application
         </p>
       </main>
     )
   }
   \`\`\`

3. Update README.md with your project info

4. Remove this command:
   \`\`\`bash
   rm .claude/commands/remove-boilerplate.md
   \`\`\`

5. Commit changes:
   \`\`\`bash
   git add -A && git commit -m "chore: remove boilerplate setup files"
   \`\`\`
```

**Step 2: Commit command**

```bash
git add -A && git commit -m "feat: add /remove-boilerplate Claude command"
```

---

## Phase 13: Documentation

### Task 13.1: Create LICENSE and README

**Files:**
- Create: `LICENSE`
- Modify: `README.md`

**Step 1: Create MIT License**

Create `LICENSE`:
```
MIT License

Copyright (c) 2026 Cederic Privat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**Step 2: Create README**

Create `README.md`:
```markdown
# Agentic Boilerplate

Production-ready Next.js 16 boilerplate with CLI scaffolding tool.

## Features

- **Next.js 16** - App Router, Typed Routes, React Compiler
- **Auth** - Better Auth with Google OAuth + Email/Password
- **Database** - PostgreSQL + Drizzle ORM
- **API** - Hono with OpenAPI documentation
- **i18n** - next-intl (English, German)
- **UI** - TailwindCSS 4 + ShadCN/UI
- **Email** - Resend + React Email
- **Testing** - Playwright (E2E) + Bun (unit)
- **Monitoring** - Sentry + Uptime Kuma

## Quick Start

\`\`\`bash
# Clone and install
git clone https://github.com/cedericprivat/agentic-boilerplate-app
cd agentic-boilerplate-app
bun install

# Copy environment variables
cp .env.example .env

# Start development (includes Docker services)
bun dev
\`\`\`

## Development

\`\`\`bash
bun dev           # Start dev server + Docker
bun lint          # Check code style
bun test          # Run unit tests
bun test:e2e      # Run E2E tests
bun db:studio     # Open Drizzle Studio
\`\`\`

## Project Structure

\`\`\`
src/
├── app/           # Next.js routes
├── components/    # UI components
├── config/        # Configuration
├── db/            # Database (Drizzle)
├── features/      # Feature modules
├── lib/           # Utilities
└── server/        # API (Hono)
\`\`\`

## Setup Checklist

The homepage shows a setup checklist with:
- Database connection status
- Environment variable configuration
- Provider setup guides

Run `/remove-boilerplate` to clear when ready.

## License

MIT
```

**Step 3: Commit documentation**

```bash
git add -A && git commit -m "docs: add LICENSE and README"
```

---

## Phase 14: CLI Tool (Future)

> **Note:** The CLI tool (`create-agentic-app`) is a separate implementation phase that builds on the completed template. It will be documented in a follow-up plan once the base template is complete and tested.

### Future Tasks:
- Task 14.1: Create CLI entry point and prompts
- Task 14.2: Create addon configuration actions
- Task 14.3: Create addon template files
- Task 14.4: Implement project scaffolding logic
- Task 14.5: Add CLI to npm publishing workflow

---

## Summary

This plan covers 13 phases with ~45 tasks to implement the core Agentic Boilerplate template:

1. **Phase 1:** Project Foundation (8 tasks)
2. **Phase 2:** Database & Docker (4 tasks)
3. **Phase 3:** API Layer (3 tasks)
4. **Phase 4:** UI Framework (3 tasks)
5. **Phase 5:** Internationalization (2 tasks)
6. **Phase 6:** Email Setup (1 task)
7. **Phase 7:** Auth Pages (3 tasks)
8. **Phase 8:** Setup Checklist (4 tasks)
9. **Phase 9:** Type-Safe Environment (1 task)
10. **Phase 10:** Testing (2 tasks)
11. **Phase 11:** CI/CD (1 task)
12. **Phase 12:** Claude Code (4 tasks)
13. **Phase 13:** Documentation (1 task)

Each task follows TDD principles with:
- Exact file paths
- Complete code snippets
- Verification commands
- Commit instructions
