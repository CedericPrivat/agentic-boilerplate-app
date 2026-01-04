# Agentic Boilerplate

Production-ready Next.js 16 boilerplate with CLI scaffolding tool.

## Features

- **Next.js 16** - App Router, Typed Routes, React Compiler
- **Auth** - Better Auth with Google OAuth + Email/Password
- **Database** - PostgreSQL + Drizzle ORM
- **API** - Hono with OpenAPI documentation
- **i18n** - next-intl (cookie-based, English/German)
- **UI** - TailwindCSS 4 + ShadCN/UI
- **Email** - Resend + React Email
- **Testing** - Playwright (E2E) + Bun (unit)
- **Monitoring** - Sentry + Uptime Kuma

## Quick Start

```bash
# Clone and install
git clone https://github.com/cedericprivat/agentic-boilerplate-app
cd agentic-boilerplate-app
bun install

# Copy environment variables
cp .env.example .env

# Start Docker services and push database schema
bun dev:services
bun db:push

# Start development
bun dev
```

## Development

```bash
bun dev           # Start dev server + Docker
bun dev:email     # Start React Email dev server
bun lint          # Check code style
bun test          # Run unit tests
bun test:e2e      # Run E2E tests
bun db:studio     # Open Drizzle Studio
```

## Development Ports

| Service | Port | Description |
|---------|------|-------------|
| Next.js | 3000 | Main application |
| Uptime Kuma | 3001 | Monitoring dashboard |
| React Email | 3002 | Email template preview |
| Umami | 3003 | Analytics dashboard |
| PostgreSQL | 5432 | Database |

Ports are configurable via environment variables in `.env`.

## Project Structure

```
src/
├── app/           # Next.js routes (no [locale] - i18n is cookie-based)
├── components/    # UI components (ShadCN base-vega style)
├── config/        # Configuration (env.ts, site.ts)
├── db/            # Database (Drizzle)
├── features/      # Feature modules
├── lib/           # Utilities
└── server/        # API (Hono)
```

## Setup Checklist

The homepage shows a setup checklist with:
- Database connection status
- Environment variable configuration
- Provider setup guides

Run `/remove-boilerplate` in Claude Code to clear when ready.

## License

MIT
