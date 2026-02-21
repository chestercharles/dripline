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

## CI/CD and Deployment

Every push to `main` triggers two jobs:

- **TypeScript + lint checks** — always run
- **Native changes gate** — fails if native-impacting changes are detected without a version bump
- **Deploy** — OTA update if version unchanged; full EAS build + TestFlight submit if version bumped

### When to bump `package.json` version

You **must** bump the version whenever your changes touch the native layer. The native changes gate will fail the CI if you forget.

**Always bump the version if you:**
- Add, remove, or upgrade any Expo or React Native package
- Modify `app.config.js` or `eas.json`
- Add a new Expo plugin (e.g., `expo-camera`, `expo-location`)
- Change `ios/` files directly
- Change permissions, entitlements, or `Info.plist` entries

**You do not need to bump the version for:**
- Pure JS/TS changes (screens, hooks, components, utils)
- Adding new routes in `app/`
- Updating styles, themes, or copy
- Changing SQLite schema or migrations
- Updating API logic

### OTA vs native build

- **OTA (fast, no install required):** JS bundle changes only. Delivered on next app launch.
- **New build (requires TestFlight install):** Any native layer change. Bump the version to trigger it.

When in doubt, run `node native-changes-check.js --range "HEAD^...HEAD"` locally before pushing.
