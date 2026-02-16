# Design System

## Principles

- Meet users where they are
- Supportive, never patronizing
- Errors are guidance, not failure states
- Subtle, warm interactions with spring physics animations

## Colors

Earthy sage green accent (`#5A7A5E`). Full semantic token structure in `lib/theme/colors.ts`.

- Use `theme.colors.*` tokens — never hardcode hex values
- Light and dark mode supported via `ThemeProvider`
- Access via `useTheme()` hook

## Typography

System fonts only. Variants defined in `lib/theme/typography.ts`:
- largeTitle, title1, title2, title3
- headline, body, callout, subheadline
- footnote, caption1, caption2

Use the `<Text variant="..." />` component.

## Spacing

4px base scale. Access via `theme.spacing[n]`:
- 1=4, 2=8, 3=12, 4=16, 5=20, 6=24, 8=32, 10=40, 12=48, 16=64

## Shape

Radii: sm=8, md=12, lg=16, xl=24, full=9999
Shadows: sm, md, lg (with platform-appropriate elevation)

## Components

All in `components/ui/`:
- **Text** — Typography wrapper with variant prop
- **Button** — filled/outlined/ghost, sm/md/lg, loading, destructive
- **Card** — Elevated surface with lg radius
- **TextInput** — Labeled input with error state
- **EmptyState** — Centered message with optional action
- **StatusBadge** — Colored pill label
- **SegmentedControl** — iOS-style segment picker
- **IconButton** — 44pt touch target icon button
- **FilterPills** — Horizontal scrollable filter chips
- **ListItem** — Standard list row with left/right slots

## Interactions

- Light haptics on button press
- Selection haptics on segment/filter changes
- 44pt minimum touch targets
- Spring physics for animations (Reanimated)
- Swipe actions where appropriate

## Accessibility

- WCAG AA contrast ratios
- Semantic accessibility labels on interactive elements
- accessibilityRole on buttons
