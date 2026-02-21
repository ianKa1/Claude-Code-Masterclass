# Plan: useHeists Hook for Real-time Heist Data

## Context

The heists page (`/heists`) currently displays static section headers with no data. This feature implements a custom React hook `useHeists` that provides real-time Firestore access to heist data with intelligent filtering based on user context and heist status. The hook enables authenticated users to view their active heists (assigned to them), heists they've assigned to others, and all expired heists across the system.

**Key Requirements:**
- Real-time Firestore subscription using `onSnapshot` for live data updates
- Three filter modes: 'active' (assigned to me, not expired), 'assigned' (created by me, not expired), 'expired' (past deadline, all users)
- Return typed heist array, loading state, error state, and refetch function
- Limit queries to 50 heists maximum
- Sort expired heists by deadline (most recent first)
- Integrate into heists page to display titles under three sections

**Architecture Decision:** Simple custom hook (not Context-based) since each usage requires different filter parameters. The hook internally uses `useUser()` to access auth context, following the established composition pattern.

**Pattern Sources:** `lib/firebase/auth-context.tsx` for real-time listener pattern with cleanup, `types/firestore/heist.ts` for converter pattern, existing Firestore helpers for query construction.

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `lib/firebase/useHeists.ts` | CREATE | Custom hook with real-time Firestore subscription |
| `app/(dashboard)/heists/page.tsx` | MODIFY | Integrate hook, display heist titles under sections |
| `tests/lib/useHeists.test.tsx` | CREATE | Hook unit tests (10 test cases) |
| `tests/pages/heists-page.test.tsx` | CREATE | Page integration tests (7 test cases) |

---

## Build Order

1. `lib/firebase/useHeists.ts` — Hook implementation
2. `tests/lib/useHeists.test.tsx` — Hook tests
3. `app/(dashboard)/heists/page.tsx` — Page integration
4. `tests/pages/heists-page.test.tsx` — Page tests
5. Verification: lint + build + tests pass

---

## Implementation Details

### 1. `lib/firebase/useHeists.ts`

**Directive:** `"use client"`

**Imports:**
```typescript
import { useEffect, useState, useCallback } from "react"
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  type FirestoreError,
} from "firebase/firestore"
import { db } from "./config"
import { useUser } from "./auth-context"
import { heistConverter, type Heist } from "@/types/firestore/heist"
```

**Type Definitions:**
```typescript
type HeistFilter = "active" | "assigned" | "expired"

interface UseHeistsReturn {
  heists: Heist[]
  loading: boolean
  error: string | null
  refetch: () => void
}
```

**State Variables:**
- `heists: Heist[]` — Array of heist documents (converted via heistConverter)
- `loading: boolean` — True during initial load or refetch
- `error: string | null` — User-friendly error message
- `refetchTrigger: number` — Counter to force query refresh

**Hook Logic:**

```typescript
export function useHeists(filter: HeistFilter): UseHeistsReturn {
  const { user, loading: authLoading } = useUser()
  const [heists, setHeists] = useState<Heist[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0)

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    // Guard: wait for auth to load
    if (authLoading) {
      return
    }

    // Guard: no authenticated user
    if (!user) {
      setHeists([])
      setLoading(false)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)

    // Build query based on filter type
    const heistsRef = collection(db, "heists").withConverter(heistConverter)
    let q

    const now = Timestamp.now()

    if (filter === "active") {
      // Heists assigned TO current user, deadline in future
      q = query(
        heistsRef,
        where("assignedTo", "==", user.uid),
        where("deadline", ">", now),
        orderBy("deadline", "asc"),
        limit(50)
      )
    } else if (filter === "assigned") {
      // Heists created BY current user, deadline in future
      q = query(
        heistsRef,
        where("createdBy", "==", user.uid),
        where("deadline", ">", now),
        orderBy("deadline", "asc"),
        limit(50)
      )
    } else {
      // Expired heists (all users, past deadline, most recent first)
      q = query(
        heistsRef,
        where("deadline", "<=", now),
        orderBy("deadline", "desc"),
        limit(50)
      )
    }

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data())
        setHeists(data)
        setLoading(false)
      },
      (err: FirestoreError) => {
        console.error("Firestore query error:", err)
        setError("Failed to load heists. Please try again.")
        setLoading(false)
      }
    )

    return unsubscribe
  }, [filter, user?.uid, authLoading, refetchTrigger])

  return { heists, loading, error, refetch }
}
```

**Key Patterns:**
- Auth guard: Don't query until `authLoading === false && user !== null`
- Real-time subscription: `onSnapshot` returns `unsubscribe` function for cleanup
- Converter application: `.withConverter(heistConverter)` ensures Timestamp→Date conversion
- Timestamp comparison: Use `Timestamp.now()` for server-side deadline comparison
- Dependency array: `[filter, user?.uid, authLoading, refetchTrigger]` triggers re-subscription
- Error handling: Console log for debugging, user-friendly message for UI
- Refetch: Increment trigger counter to force useEffect re-run

**Firestore Indexes Required:**
- Collection: `heists`, Fields: `assignedTo` (Ascending), `deadline` (Ascending)
- Collection: `heists`, Fields: `createdBy` (Ascending), `deadline` (Ascending)
- Collection: `heists`, Fields: `deadline` (Descending) — auto-created

---

### 2. `app/(dashboard)/heists/page.tsx`

**Directive:** `"use client"`

**Imports:**
```typescript
import { useHeists } from "@/lib/firebase/useHeists"
```

**Section Definitions:**
```typescript
const sections = [
  { id: "active" as const, title: "Your Active Heists", description: "Currently in progress" },
  { id: "assigned" as const, title: "Heists You've Assigned", description: "Delegated to your crew" },
  { id: "expired" as const, title: "All Expired Heists", description: "Past operations" },
]
```

**Hook Calls:**
```typescript
export default function HeistsPage() {
  const activeData = useHeists("active")
  const assignedData = useHeists("assigned")
  const expiredData = useHeists("expired")

  const dataByFilter = {
    active: activeData,
    assigned: assignedData,
    expired: expiredData,
  }
```

**JSX Structure:**
```tsx
return (
  <div className="page-content">
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Mission Control</h1>
      <p className="mt-2 text-body">Plan it. Staff it. Pull it off.</p>
    </div>

    {sections.map((section) => {
      const { heists, loading, error } = dataByFilter[section.id]

      return (
        <div key={section.id} className="mb-6">
          <h2 className="text-xl font-semibold">{section.title}</h2>
          <p className="text-sm text-body mb-3">{section.description}</p>

          {loading && <p className="text-body">Loading...</p>}

          {error && <p className="text-error">{error}</p>}

          {!loading && !error && heists.length === 0 && (
            <p className="text-body italic">No heists found.</p>
          )}

          {!loading && !error && heists.length > 0 && (
            <ul className="list-disc list-inside">
              {heists.map((heist) => (
                <li key={heist.id} className="text-body">
                  {heist.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    })}
  </div>
)
```

**Display States:**
- **Loading:** Show "Loading..." text (no skeleton per spec)
- **Error:** Show error message in error color
- **Empty:** Show "No heists found." in italic
- **Success:** Show bullet list of heist titles

---

## Testing Strategy

### 3. `tests/lib/useHeists.test.tsx`

**Mocks (use `vi.hoisted`):**
```typescript
const mockUseUser = vi.hoisted(() => vi.fn())
const mockOnSnapshot = vi.hoisted(() => vi.fn())
const mockQuery = vi.hoisted(() => vi.fn())
const mockWhere = vi.hoisted(() => vi.fn())
const mockOrderBy = vi.hoisted(() => vi.fn())
const mockLimit = vi.hoisted(() => vi.fn())
const mockCollection = vi.hoisted(() => vi.fn())
const mockTimestampNow = vi.hoisted(() => vi.fn(() => ({ seconds: Date.now() / 1000 })))
```

**Mock Modules:**
- `@/lib/firebase/auth-context` → mock `useUser`
- `firebase/firestore` → mock `onSnapshot`, `query`, `where`, `orderBy`, `limit`, `collection`, `Timestamp.now`
- `@/lib/firebase/config` → mock `db`
- `@/types/firestore/heist` → mock `heistConverter`

**10 Test Cases:**
1. Returns empty array when user is null
2. Shows loading state while fetching data
3. 'active' filter queries by assignedTo and future deadline
4. 'assigned' filter queries by createdBy and future deadline
5. 'expired' filter queries by past deadline (no user filter)
6. Hook updates when onSnapshot callback fires (real-time)
7. Hook cleans up listener on unmount (unsubscribe called)
8. Hook handles Firestore errors gracefully
9. Hook re-subscribes when filter parameter changes
10. Refetch function triggers new query

---

### 4. `tests/pages/heists-page.test.tsx`

**Mocks (use `vi.hoisted`):**
```typescript
const mockUseHeists = vi.hoisted(() => vi.fn())
```

**Mock Modules:**
- `@/lib/firebase/useHeists` → mock `useHeists`

**7 Test Cases:**
1. Renders three section headers
2. Calls useHeists three times with correct filters ('active', 'assigned', 'expired')
3. Displays heist titles under correct sections
4. Shows loading state ("Loading...") when hook returns loading: true
5. Shows error message when hook returns error
6. Shows empty state ("No heists found.") when no heists
7. Displays heist titles as list items (<li>) when heists exist

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| No current user | Set heists: [], loading: false, return early (no query) |
| Auth still loading | Wait, don't query yet (`if (authLoading) return`) |
| Empty results | Display "No heists found." in page component |
| Network disconnection | onSnapshot error callback sets error state with message |
| Component unmounts | Unsubscribe function called in cleanup (`return unsubscribe`) |
| Rapid filter changes | Old subscription cleaned up, new one started (useEffect deps) |
| Deadline boundary (exact match) | Treat as expired (`deadline <= now` includes equality) |
| User logs out mid-query | useEffect sees `!user`, clears heists, no query |
| Firestore permission denied | Error callback logs to console, shows user-friendly message |
| Query returns >50 heists | Firestore enforces `limit(50)` server-side |
| Expired without finalStatus | Included in expired list (per user confirmation) |

---

## Verification

### Unit Tests
```bash
npx vitest run tests/lib/useHeists.test.tsx
```

### Page Tests
```bash
npx vitest run tests/pages/heists-page.test.tsx
```

### Full Test Suite
```bash
npx vitest run
```

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Manual Testing
1. Navigate to `/heists` while logged in
2. Verify three sections display with loading states initially
3. Create test heists in Firestore Console:
   - Active heist: `assignedTo: <your-uid>`, `deadline: <future-date>`
   - Assigned heist: `createdBy: <your-uid>`, `deadline: <future-date>`
   - Expired heist: `deadline: <past-date>`
4. Verify heist titles appear in correct sections
5. Open DevTools Network tab → confirm Firestore listeners active
6. Verify real-time updates: add new heist in Console → appears instantly
7. Sign out → verify sections clear
8. Check browser console for errors

### Firestore Setup
- Firestore Console → Indexes tab
- Verify compound indexes exist (or create if prompted by error message):
  - `heists`: `assignedTo` (ASC), `deadline` (ASC)
  - `heists`: `createdBy` (ASC), `deadline` (ASC)
  - `heists`: `deadline` (DESC) — auto-created

---

## Critical Files Reference

- `/Users/kaimao/Desktop/Claude_code_course/Claude-Code-Masterclass/lib/firebase/useHeists.ts` — Hook implementation with real-time Firestore queries
- `/Users/kaimao/Desktop/Claude_code_course/Claude-Code-Masterclass/app/(dashboard)/heists/page.tsx` — Page integration displaying heist titles
- `/Users/kaimao/Desktop/Claude_code_course/Claude-Code-Masterclass/lib/firebase/auth-context.tsx` — Pattern reference for subscription cleanup
- `/Users/kaimao/Desktop/Claude_code_course/Claude-Code-Masterclass/types/firestore/heist.ts` — Heist type and converter (already exists)
- `/Users/kaimao/Desktop/Claude_code_course/Claude-Code-Masterclass/lib/firebase/config.ts` — Firebase/Firestore config (already exists)
