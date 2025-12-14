# Implementation Plan: useHeists Hook

## Overview
Create a custom React hook `useHeists` that provides real-time access to heists from Firestore with filtering by user context. The hook will support three filter modes and be tested in the preview page.

## User Requirements (Confirmed)
- **Active filter**: `isActive === true` only (ignore deadline)
- **Expired filter**: `isActive === false` (determines expiry)
- **Security rules**: Keep current dev rules (no changes needed)

## Implementation Steps

### 1. Create useHeists Hook
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/hooks/useHeists.ts` (new file, new directory)

**Hook signature**:
```typescript
function useHeists(filter: 'active' | 'assigned' | 'expired'): {
  heists: Heist[]
  loading: boolean
  error: Error | null
}
```

**Key implementation details**:

a) **Dependencies**:
- Import `useState`, `useEffect` from React
- Import `useUser` from `@/context/AuthContext`
- Import `db` from `@/lib/firebase`
- Import `collection`, `query`, `where`, `onSnapshot` from `firebase/firestore`
- Import `Heist`, `heistConverter`, `COLLECTIONS` from types

b) **State management**:
- `heists: Heist[]` (default: `[]`)
- `loading: boolean` (default: `true`)
- `error: Error | null` (default: `null`)

c) **Query construction** (based on filter parameter):
- **'active'**: `where('createdFor', '==', user.uid) AND where('isActive', '==', true)`
- **'assigned'**: `where('createdBy', '==', user.uid) AND where('isActive', '==', true)`
- **'expired'**: `where('isActive', '==', false)` (no user filter)

d) **useEffect logic** (dependencies: `[filter, user?.uid]`):
1. Reset states: `setLoading(true)`, `setError(null)`
2. Handle unauthenticated users:
   - For 'active' or 'assigned': if no `user?.uid`, set `heists: []`, `loading: false`, return early
   - For 'expired': proceed (no auth required)
3. Build query: `collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter)`
4. Apply where clauses based on filter
5. Set up `onSnapshot` listener:
   - Success callback: `setHeists(snapshot.docs.map(doc => doc.data()))`, `setLoading(false)`
   - Error callback: `setError(err)`, `setLoading(false)`, `setHeists([])`
6. Return cleanup: `() => unsubscribe()`

**Pattern to follow**: Mirror `context/AuthContext.tsx:30-46` structure (onAuthStateChanged pattern)

---

### 2. Create HeistsTester Component
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/HeistsTester.tsx` (new file)

**Purpose**: Client component to test all three filter types in preview page

**Structure**:
- Add `'use client'` directive at top
- Import `useHeists` hook
- Create three sections, one per filter type
- Each section displays:
  - Heading (e.g., "Active Heists (assigned to me)")
  - Loading indicator if `loading === true`
  - Error message if `error !== null`
  - Empty state message if `heists.length === 0`
  - Simple list of heist titles using `heists.map(h => h.title)`

**Styling**: Use existing Tailwind classes from globals.css, keep it minimal

---

### 3. Update Preview Page
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(public)/preview/page.tsx`

**Changes**:
1. Import `HeistsTester` component
2. Add new section after SkeletonCard:
```tsx
<section>
  <h3>useHeists Hook</h3>
  <HeistsTester />
</section>
```
3. Keep page as server component (HeistsTester is the client component)

---

## Critical Files

### Files to create:
1. `/Users/shaun/Code/Sandbox/claude-pocket-heist/hooks/useHeists.ts` - Core hook implementation
2. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/HeistsTester.tsx` - Test component

### Files to modify:
3. `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(public)/preview/page.tsx` - Add HeistsTester section

### Files to reference (read-only):
4. `/Users/shaun/Code/Sandbox/claude-pocket-heist/context/AuthContext.tsx` - Pattern for listener setup/cleanup
5. `/Users/shaun/Code/Sandbox/claude-pocket-heist/types/firestore/heist.ts` - Heist interface and converter
6. `/Users/shaun/Code/Sandbox/claude-pocket-heist/types/firestore/index.ts` - COLLECTIONS constant

---

## Edge Cases Handled

1. **Unauthenticated user**: Return empty array for 'active'/'assigned', allow 'expired' to fetch
2. **User changes**: Cleanup old listener, create new one (via useEffect dependencies)
3. **Filter changes**: Cleanup old listener, create new query (via useEffect dependencies)
4. **Component unmount**: Cleanup listener to prevent memory leaks
5. **Firestore errors**: Capture in error state, don't crash component
6. **Empty results**: Return empty array, not an error

---

## Testing Approach

**Manual testing in preview page** (`npm run dev` → navigate to `/preview`):

1. Verify three sections render (Active, Assigned, Expired)
2. Check loading states appear initially
3. Verify correct heists display in each section based on current user
4. Test with authenticated vs unauthenticated state
5. Verify no console errors or memory leaks

---

## Code Conventions

- No semicolons (per CLAUDE.md)
- Use `@/` path alias for imports
- Named export for hook: `export function useHeists(...)`
- Default export for components
- TypeScript strict mode
- Follow existing patterns from AuthContext.tsx