# Implementation Plan: HeistCard Component & /heists Page Integration

## Overview
Create a HeistCard UI component to display active heist information and integrate it into the /heists page using the useHeists hook. This plan focuses ONLY on active heists (not expired).

## User Requirements (Confirmed)
- Cards are **static** (no click interaction)
- Cards are **simple** (no action buttons)
- **ONLY active heists** in this implementation (assigned to and assigned by user)
- Do NOT show finalStatus or expired heists section

## Implementation Steps

### 1. Create HeistCard Component
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/HeistCard.tsx` (new file)

**Props interface**:
```typescript
interface HeistCardProps {
  heist: Heist
}
```

**Structure** (following SkeletonCard pattern):
- Card container with header and body sections
- Header: Display heist title
- Body:
  - Description (line-clamped to 3 lines)
  - Metadata section with 3 items:
    - Created by: [codename] with UserPlus icon
    - Assigned to: [codename] with User icon
    - Deadline: [formatted date] with Clock8 icon

**Date formatting utility** (inline function at top of file):
```typescript
function formatDeadline(date: Date): string {
  // Returns formats like:
  // - "Today, 3:30 PM"
  // - "Tomorrow, 10:00 AM"
  // - "3d left - Dec 14, 2:45 PM"
  // - "Overdue - Dec 10, 5:00 PM"
}
```

**Imports**:
- `Heist` from `@/types/firestore/heist`
- `Clock8, User, UserPlus` from `lucide-react`
- `styles` from `./HeistCard.module.css`

---

### 2. Create HeistCard Styles
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/HeistCard.module.css` (new file)

**Key styles**:
- `.card`: Background `var(--color-light)`, border-radius `0.75rem`, padding `1.5rem`
- `.card:hover`: Subtle lift effect (translateY -2px) with primary color shadow
- `.header`: Margin bottom `1rem`
- `.title`: Heading color, font-size `1.25rem`, weight 600
- `.body`: Flex column with `1rem` gap
- `.description`: Body color, line-clamp 3 lines for overflow truncation
- `.metadata`: Flex column, top border separator, gap `0.75rem`
- `.metaItem`: Flex row with icon, label, value
- `.icon`: Size `1rem`, primary color
- `.label`: Body color
- `.value`: Heading color, weight 500

**Pattern reference**: Follow `SkeletonCard.module.css` structure

---

### 3. Update /heists Page to Client Component
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(dashboard)/heists/page.tsx`

**Changes**:
1. Add `'use client'` directive at top
2. Import useHeists hook, HeistCard, SkeletonCard
3. Call useHeists hook twice:
   - `useHeists('active')` for heists assigned TO user
   - `useHeists('assigned')` for heists created BY user
4. Create two sections (remove expired section):
   - "Your Active Heists"
   - "Heists You've Assigned"
5. For each section, handle 4 states:
   - Loading: Show 2 SkeletonCards in grid
   - Error: Show error message
   - Empty: Show helpful empty state message
   - Data: Map heists to HeistCard components in grid

**State logic flow**:
```
if (loading) → Show SkeletonCards
else if (error) → Show error message
else if (heists.length === 0) → Show empty state
else → Show HeistCard grid
```

---

### 4. Create Page Styles
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(dashboard)/heists/page.module.css` (new file)

**Key styles**:
- `.section`: Margin bottom `3rem` for section spacing
- `.sectionTitle`: Font-size `1.5rem`, weight 600, margin bottom `1.5rem`
- `.cardGrid`: CSS Grid with `repeat(auto-fill, minmax(320px, 1fr))`, gap `1.5rem`
- `.empty`: Center text, body color, dashed border, padding `2rem`, light background
- `.error`: Error color, error background with opacity, solid border

---

## Critical Files

### Files to create:
1. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/HeistCard.tsx` - Card component with formatDeadline utility
2. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/HeistCard.module.css` - Card styling
3. `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(dashboard)/heists/page.module.css` - Page layout styles

### Files to modify:
4. `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(dashboard)/heists/page.tsx` - Convert to client component, integrate hooks and cards

### Files to reference (read-only):
5. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/SkeletonCard.tsx` - Card structure pattern
6. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/SkeletonCard.module.css` - Card CSS pattern
7. `/Users/shaun/Code/Sandbox/claude-pocket-heist/hooks/useHeists.ts` - Hook usage (already implemented)
8. `/Users/shaun/Code/Sandbox/claude-pocket-heist/types/firestore/heist.ts` - Heist interface

---

## Edge Cases Handled

1. **Long text**: Description line-clamped to 3 lines, titles wrap naturally
2. **Date formatting**: Handles today, tomorrow, X days left, and overdue states
3. **Empty states**: Clear messaging for no heists in each section
4. **Error states**: Firestore errors displayed with error styling
5. **Loading states**: SkeletonCard placeholders during data fetch
6. **Responsive grid**: Auto-fill ensures cards wrap properly on all screen sizes

---

## Code Conventions

- No semicolons (per CLAUDE.md)
- CSS modules for component-specific styles
- Minimal Tailwind (only `.page-content` global class)
- Custom CSS classes with variables from globals.css
- Path alias `@/` for imports
- lucide-react for icons
- TypeScript strict mode
- Default export for components
