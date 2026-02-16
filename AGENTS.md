# Agents

## Coding Style

- No comments unless truly necessary
- Keep implementations simple and focused
- Extend through composition, avoid premature abstraction
- TypeScript strict mode, path aliases (`@/*`)
- Prettier: tabs, no semicolons, single quotes, trailing commas es5

## File Organization

- Routes in `app/` are thin wrappers that import from `features/`
- Each feature has its own directory under `features/` with screens, hooks, components, and types
- Shared UI components live in `components/ui/`
- Library code (db, theme, query, constants) lives in `lib/`

## Data Layer

- All data access through React Query hooks
- Database via `useDrizzle()` from `lib/db`
- Query keys from `lib/query/keys.ts`
- Mutations should invalidate relevant query keys

## When Adding a New Feature

1. Create feature directory under `features/`
2. Add types in `types.ts`
3. Add React Query hooks in `hooks/`
4. Build screen components
5. Wire up route in `app/`
