# /remove-boilerplate

Remove the setup checklist and boilerplate files to prepare for your own application.

## What This Does

1. Removes `src/features/setup/` directory
2. Updates `src/app/page.tsx` to a minimal starter (no [locale] - i18n is cookie-based)
3. Clears README.md to a minimal template
4. Removes this command file

## Steps

1. Delete setup feature:
   ```bash
   rm -rf src/features/setup
   ```

2. Replace home page with minimal version:
   ```tsx
   // src/app/page.tsx (no [locale] in path - i18n is cookie-based)
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
   ```

3. Update README.md with your project info

4. Remove this command:
   ```bash
   rm .claude/commands/remove-boilerplate.md
   ```

5. Run verification:
   ```bash
   bun lint && bun typecheck
   ```

6. Commit changes:
   ```bash
   git add -A && git commit -m "chore: remove boilerplate setup files"
   ```
