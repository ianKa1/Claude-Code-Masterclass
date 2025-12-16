# Heist Details Page Implementation Plan

## Overview
Implement a comprehensive heist details page at `/heists/[slug]` that displays full information about a single heist. Users will navigate to this page by clicking on any HeistCard or ExpiredHeistCard from the `/heists` dashboard.

## User Decisions
- **Layout**: Same design for both active and expired heists (consistent with status indicators)
- **Navigation**: Navbar only (no back button needed)
- **Time Display**: Show time remaining for active heists (e.g., "3 days remaining")

## Implementation Steps

### 1. Add Time Remaining Utility
**File**: `lib/date-utils.ts` (MODIFY)

Add `getTimeRemaining()` function that calculates and formats time until deadline:
- Returns "X hours remaining" for < 24 hours
- Returns "X days remaining" for 1-7 days
- Returns "X weeks remaining" for > 7 days
- Returns "Expired" for past deadlines

### 2. Create useHeist Hook
**File**: `hooks/useHeist.ts` (NEW)

Create custom hook following `useHeists` pattern:
- Accept `heistId: string` parameter
- Use `doc()` + `onSnapshot()` for real-time updates
- Apply `heistConverter` for type conversion
- Return `{ heist, loading, error, notFound }`
- Track `notFound` separately from `error` for 404 handling
- Clean up listener on unmount

### 3. Make HeistCard Interactive
**File**: `components/ui/HeistCard.tsx` (MODIFY)

Follow ExpiredHeistCard pattern:
- Add `"use client"` directive
- Import and use `useRouter()` from next/navigation
- Add optional `onClick?: () => void` prop
- Implement `handleClick()` to navigate to `/heists/${heist.id}`
- Implement `handleKeyDown()` for Enter and Space keys
- Add accessibility attributes: `role="button"`, `tabIndex={0}`, `aria-label`

**File**: `components/ui/HeistCard.module.css` (MODIFY)

Add interactive styles:
- `cursor: pointer` on `.card`
- `:focus` outline with `--color-primary`
- Keep existing `:hover` transform and shadow

### 4. Create Details Page Component
**File**: `app/(dashboard)/heists/[slug]/page.tsx` (REPLACE)

Implement full details page with three-state rendering:

**Loading State**: Show Skeleton components for title, description, and metadata grid

**Error States**:
- Not Found: Show AlertCircle icon + "Heist Not Found" message
- Fetch Error: Show error message from error object

**Success State**: Display comprehensive heist information:
- **Header Section**: Title with Target icon + status badge (ACTIVE/COMPLETED/FAILED)
- **Description Section**: "Mission Brief" with full description text
- **Metadata Grid**: Responsive grid with cards for:
  - Assigned To (User icon + createdForCodename)
  - Created By (UserPlus icon + createdByCodename)
  - Deadline (Clock8 icon + formatted deadline)
  - Time Remaining (Calendar icon + calculated time) - **only for active heists**
  - Final Status (CheckCircle2/XCircle icon + success/failure) - **only for expired heists**
  - Created At (Calendar icon + formatted timestamp)

**Technical Details**:
- Use `"use client"` directive
- Import `use()` from React for Next.js 16 params handling
- Call `useHeist(slug)` hook for data
- Use icons from lucide-react
- Use `formatDeadline()` and `getTimeRemaining()` utilities
- Conditionally render Time Remaining OR Final Status based on `heist.isActive`

### 5. Create Details Page Styles
**File**: `app/(dashboard)/heists/[slug]/page.module.css` (NEW)

Implement comprehensive styling following existing patterns:

**Layout**:
- `.container`: Max-width 800px, centered, 2rem padding
- `.header`: Flex layout with space-between for title and status badge
- `.descriptionSection`: Padded card with dark background
- `.metadataGrid`: CSS Grid with `repeat(auto-fit, minmax(240px, 1fr))`

**Components**:
- `.titleIcon`: 2rem size, primary color
- `.statusBadge`: Uppercase text with variant classes (active/success/failed)
- `.metaCard`: Flex layout with icon container and content
- `.metaIcon`: 2.5rem circular container with primary background
- Error states: Centered layout with large icon

**Responsive**:
- Mobile (< 768px): Single column grid, stacked header

**Colors**: Use CSS variables (--color-primary, --color-secondary, --color-success, --color-error)

## Critical Files

### Create
1. `hooks/useHeist.ts` - Data fetching hook for single heist
2. `app/(dashboard)/heists/[slug]/page.module.css` - Details page styles

### Modify
1. `lib/date-utils.ts` - Add getTimeRemaining() function
2. `components/ui/HeistCard.tsx` - Add click navigation
3. `components/ui/HeistCard.module.css` - Add interactive styles
4. `app/(dashboard)/heists/[slug]/page.tsx` - Full implementation

## Key Patterns to Follow

**Data Fetching**: Real-time Firestore listeners with onSnapshot, proper cleanup in useEffect

**Component Structure**: "use client" directive, three-state rendering (loading/error/success)

**Styling**: CSS modules with theme variables, @apply directive for complex patterns

**Accessibility**: Keyboard navigation, ARIA labels, proper focus indicators

**Navigation**: useRouter() for programmatic navigation, handle Enter/Space keys

## Testing Checklist

1. Click HeistCard from any section → navigates to details page
2. Keyboard navigation (Tab + Enter) → navigates correctly
3. Direct URL navigation → loads correctly or shows not found
4. Loading state → shows skeleton UI
5. Active heist → shows time remaining
6. Expired heist → shows final status badge
7. Mobile responsive → single column layout
8. Real-time updates → page updates when heist changes in Firestore

## Dependencies

No new packages required. Uses existing:
- Firebase Firestore (doc, onSnapshot)
- Next.js (use, useRouter, useParams)
- lucide-react (icons)
- Existing Skeleton component
