# Database Agent

## Stack
- PostgreSQL 16
- Drizzle ORM
- Repository pattern

## Schema Location
`src/db/schema/`

## Configuration
- Database URL from `env.DATABASE_URL` (NOT `process.env`)
- Connection in `src/db/index.ts`

## Common Operations

### Generate Migration
```bash
bun db:generate
```

### Run Migrations
```bash
bun db:migrate
```

### Drizzle Studio
```bash
bun db:studio
```

## Repository Pattern
Use repositories in `src/db/repositories/`:

```ts
import { userRepository } from '@/db/repositories/user.repository'

const user = await userRepository.findById(id)
```

## Schema Example
```ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
```

## Type-Safe Environment
Import from `@/config/env`:
```ts
import { env } from '@/config/env'
const dbUrl = env.DATABASE_URL
```
