# Next.js Agent

## Next.js 16 Patterns

### Async Request APIs
```tsx
type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string }>
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params
  const query = await searchParams
}
```

### Server Components (Default)
- Fetch data directly in components
- Use async/await at component level
- Only add 'use client' when needed (interactivity, hooks)

### Cookie-Based i18n (No Locale in URL Paths)
- **DO NOT use `[locale]` in route paths**
- Use `src/app/(auth)/login` NOT `src/app/[locale]/(auth)/login`
- Locale is detected from cookie in `src/i18n/request.ts`
- IntlProvider is in `src/providers/index.tsx`

### Route Groups
- `(auth)` - Auth pages without layout nesting
- NO `[locale]` segment - i18n is cookie-based

### Loading States
- `loading.tsx` for route-level
- Suspense boundaries with Skeleton fallback
- Prefer optimistic updates with useOptimistic

### Proxy (not Middleware)
Uses `proxy.ts` for request interception:
```ts
export default function proxy(request: NextRequest) {
  // Handle auth, redirects
}
```

### Type-Safe Environment
- Import `env` from `@/config/env`
- NEVER use `process.env` directly
