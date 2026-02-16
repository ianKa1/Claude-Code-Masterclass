# Plan: Auth State Management (`useUser` hook)

## Context

The app has Firebase Auth configured (`lib/firebase/config.ts` exports `auth`) but no mechanism to observe or consume the signed-in user anywhere in the UI. This plan adds a global `AuthContext` + `AuthProvider` that listens to Firebase's `onAuthStateChanged` in real time, and a `useUser` hook that any client component can call to get `{ user, loading }`.
Do not use the hook anywhere in the application yet.

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `lib/firebase/auth-context.tsx` | Create — AuthContext, AuthProvider, useUser hook |
| `app/providers.tsx` | Create — thin client wrapper that renders `<AuthProvider>` |
| `app/layout.tsx` | Modify — wrap `{children}` with `<Providers>` |
| `tests/lib/auth-context.test.tsx` | Create — useUser hook unit tests |

---

## Build Order

1. `lib/firebase/auth-context.tsx`
2. `app/providers.tsx`
3. `app/layout.tsx` (one-line change)
4. `tests/lib/auth-context.test.tsx`
5. Lint + build pass

---

## Implementation Details

### `lib/firebase/auth-context.tsx`

**Why here:** All Firebase-related code lives in `lib/firebase/`. Keeps context co-located with `config.ts`.

**Context shape:**
```ts
type AuthContextValue = {
  user: User | null
  loading: boolean
}
```

**Provider behaviour:**
- Initialises state as `{ user: null, loading: true }`
- In a `useEffect` (runs client-side only), calls `onAuthStateChanged(auth, callback)` from `firebase/auth`
- Callback sets `user` to the resolved `User` object (or `null`) and flips `loading` to `false`
- Returns the unsubscribe function from `useEffect` cleanup — prevents memory leaks on unmount
- User object exposes: `uid`, `email`, `displayName` (all available on Firebase `User`)

**`useUser` hook:**
- Reads from `AuthContext` via `useContext`
- Throws `Error("useUser must be used within an AuthProvider")` if context is `undefined` — catches accidental use outside the tree

**Full structure:**
```tsx
"use client"

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return <AuthContext value={{ user, loading }}>{children}</AuthContext>
}

export function useUser(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) throw new Error("useUser must be used within an AuthProvider")
  return ctx
}
```

---

### `app/providers.tsx`

Thin client wrapper — exists so `app/layout.tsx` (a Server Component) can import a single `"use client"` boundary:

```tsx
"use client"

import { AuthProvider } from "@/lib/firebase/auth-context"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
```

---

### `app/layout.tsx` (modification)

Import `Providers` and wrap `{children}`:

```tsx
import Providers from "./providers"

// inside <body>:
<Providers>{children}</Providers>
```

---

## Tests (`tests/lib/auth-context.test.tsx`)

Tests render a minimal consumer component wrapped in `AuthProvider` (or a custom mock provider).

**3 tests:**

```tsx
// Helper: renders a component that calls useUser and displays user/loading
function TestConsumer() {
  const { user, loading } = useUser()
  return <div>{loading ? "loading" : user ? user.email : "no user"}</div>
}

// 1. Returns null user + loading=false when AuthProvider provides null
it("returns null user when no one is signed in", () => {
  // Wrap TestConsumer in a mock AuthContext.Provider with { user: null, loading: false }
  // Assert text "no user" is visible
})

// 2. Returns user object when AuthProvider provides a signed-in user
it("returns user object when signed in", () => {
  // Mock AuthContext.Provider with { user: { email: "test@example.com", uid: "123", displayName: "Test" }, loading: false }
  // Assert "test@example.com" is visible
})

// 3. Throws when used outside AuthProvider
it("throws when used outside AuthProvider", () => {
  // Render TestConsumer without any AuthProvider wrapping
  // Expect console.error to be called (React catches throws)
  // or use expect(() => render(<TestConsumer />)).toThrow(...)
})
```

> Firebase SDK does NOT need to be mocked in these tests — we inject the value directly via a mock `AuthContext.Provider`. The `onAuthStateChanged` listener is never called in unit tests.

---

## Edge Cases Handled

| Scenario | Handling |
|---|---|
| SSR / server render | `"use client"` on provider; `useEffect` never runs on server |
| Double listener registration | `useEffect` dependency array is `[]` — runs once; cleanup returns `unsubscribe` |
| Flash of wrong content | `loading: true` until first `onAuthStateChanged` callback fires |
| Used outside provider | Hook throws with clear dev message |

---

## Verification

1. `npx vitest run tests/lib/auth-context.test.tsx` → 3 tests pass
2. `npm run build` → no errors
3. `npm run lint` → no errors
4. `npm run dev` → open `/login`, open DevTools → no console errors on load
