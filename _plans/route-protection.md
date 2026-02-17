# Plan: Route Protection

## Context

Both group layouts are currently simple Server Components with no auth awareness — any user can access any route. This plan converts them to client components that read auth state via `useUser()` and redirect users to the correct route. A simple inline spinner is shown while Firebase resolves the auth state to prevent a flash of the wrong content.

---

## Files to Modify

| File | Action |
|------|--------|
| `app/(public)/layout.tsx` | Modify — add `"use client"`, `useUser`, `useRouter`, loader + redirect logic |
| `app/(dashboard)/layout.tsx` | Modify — add `"use client"`, `useUser`, `useRouter`, loader + redirect logic |
| `tests/layouts/public-layout.test.tsx` | Create — 3 tests for public layout behaviour |
| `tests/layouts/dashboard-layout.test.tsx` | Create — 3 tests for dashboard layout behaviour |

No new CSS files — loader uses inline Tailwind classes via the existing `center-content` global class and the `primary` colour token.

---

## Build Order

1. `app/(public)/layout.tsx`
2. `app/(dashboard)/layout.tsx`
3. `tests/layouts/public-layout.test.tsx`
4. `tests/layouts/dashboard-layout.test.tsx`
5. Lint + build pass

---

## Implementation Details

### Loader element (used in both layouts)

Inline — no new component or CSS module needed:

```tsx
<div className="center-content">
  <span className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
</div>
```

---

### `app/(public)/layout.tsx`

Converts to `"use client"`. Imports: `useEffect` from `react`; `useRouter` from `next/navigation`; `useUser` from `@/lib/firebase/auth-context`.

Logic:
- `const { user, loading } = useUser()`
- `const router = useRouter()`
- `useEffect`: when `!loading && user` → `router.replace("/heists")`
- Render: if `loading` OR `(!loading && user)` → show spinner (prevents flash during redirect)
- Otherwise: `<main className="public">{children}</main>`

---

### `app/(dashboard)/layout.tsx`

Same approach. Imports: same as public layout + `Navbar` (already imported).

Logic:
- `const { user, loading } = useUser()`
- `const router = useRouter()`
- `useEffect`: when `!loading && !user` → `router.replace("/login")`
- Render: if `loading` OR `(!loading && !user)` → show spinner
- Otherwise: existing JSX (`<Navbar />` + `<main>{children}</main>`)

---

## Tests

### Mocks needed in both test files (use `vi.hoisted`):
- `mockUseUser` → `vi.mock("@/lib/firebase/auth-context", () => ({ useUser: mockUseUser }))`
- `mockRouterReplace` → `vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: mockRouterReplace }) }))`
- `vi.mock("@/lib/firebase/config", () => ({ auth: {}, db: {} }))` — prevents Firebase init from Navbar
- `vi.mock("firebase/auth", () => ({ signOut: vi.fn(), onAuthStateChanged: vi.fn() }))` — satisfies Navbar imports

### `tests/layouts/public-layout.test.tsx`

1. Renders `{children}` when `{ user: null, loading: false }` — guest sees content
2. Renders spinner when `{ loading: true }` — no flash during resolution
3. Calls `router.replace("/heists")` when `{ user: fakeUser, loading: false }` — signed-in user redirected

### `tests/layouts/dashboard-layout.test.tsx`

1. Renders `{children}` when `{ user: fakeUser, loading: false }` — signed-in user sees content
2. Renders spinner when `{ loading: true }` — no flash during resolution
3. Calls `router.replace("/login")` when `{ user: null, loading: false }` — guest redirected

---

## Edge Cases

| Scenario | Handling |
|---|---|
| Firebase slow to respond | Spinner shown until `loading: false` |
| User signs out on dashboard | `useUser` updates → `useEffect` fires → redirect to `/login` |
| User signs in on public page | `useUser` updates → `useEffect` fires → redirect to `/heists` |
| Flash of wrong content | Render spinner while redirect is pending (`!loading && redirectCondition`) |

---

## Verification

1. `npx vitest run tests/layouts/` → 6 tests pass
2. `npx vitest run` → all tests pass
3. `npm run build` → no errors
4. `npm run lint` → no errors
5. Manual:
   - Visit `/heists` while signed out → redirected to `/login`
   - Visit `/login` while signed in → redirected to `/heists`
   - Hard-refresh on `/heists` while signed in → spinner briefly, then content renders
