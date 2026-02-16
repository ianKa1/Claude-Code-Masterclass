# Plan: Navbar Logout

## Context

The Navbar has no auth awareness — it always shows the same UI regardless of sign-in state. This plan adds a logout button that appears only when a Firebase user is signed in, calls `signOut` on click, and disappears once signed out. No redirect is performed. Figma was inaccessible (Starter/View seat — 6 calls/month limit); logout button styled as a ghost/text button sitting beside "Create Heist".

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `components/Navbar/Navbar.tsx` | Modify — add `"use client"`, `useUser`, conditional logout button |
| `components/Navbar/Navbar.module.css` | Modify — add `.logoutBtn` ghost style |
| `tests/components/Navbar.test.tsx` | Modify — add auth-aware tests |

---

## Build Order

1. `Navbar.module.css` — add style first (no deps)
2. `Navbar.tsx` — uses new style + auth hook
3. `Navbar.test.tsx` — tests the updated component

---

## Implementation Details

### `components/Navbar/Navbar.module.css`

Add `.logoutBtn` after existing rules:

```css
.logoutBtn {
  @apply text-body text-sm hover:text-primary transition-colors bg-transparent border-none cursor-pointer;
}
```

---

### `components/Navbar/Navbar.tsx`

**Add `"use client"` at the top** — required because `useUser` is a React hook backed by context.

**New imports:**
- `signOut` from `firebase/auth`
- `auth` from `@/lib/firebase/config`
- `useUser` from `@/lib/firebase/auth-context`

**Component changes:**
- Call `const { user, loading } = useUser()` inside the component
- In the `<ul>`, conditionally render logout button when `!loading && user`:
  ```tsx
  {!loading && user && (
    <li>
      <button
        className={styles.logoutBtn}
        onClick={handleLogout}
      >
        Log out
      </button>
    </li>
  )}
  ```
- Add `handleLogout` async handler:
  ```ts
  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error("Sign out failed:", err)
    }
  }
  ```

---

## Tests (`tests/components/Navbar.test.tsx`)

**Mocks needed (use `vi.hoisted`):**
- `mockUseUser` — controls what `useUser()` returns
- `mockSignOut` — spy on `signOut`
- `vi.mock("@/lib/firebase/auth-context", () => ({ useUser: mockUseUser }))`
- `vi.mock("firebase/auth", () => ({ signOut: mockSignOut }))`
- `vi.mock("@/lib/firebase/config", () => ({ auth: {} }))`

**Keep existing tests** — they still pass since `mockUseUser` defaults to `{ user: null, loading: false }`.

**New tests:**

1. Logout button is absent when `user` is null (`{ user: null, loading: false }`)
2. Logout button is absent while `loading` is true (`{ user: fakeUser, loading: true }`)
3. Logout button renders when user is signed in (`{ user: fakeUser, loading: false }`)
4. Clicking logout button calls `signOut`
5. If `signOut` rejects, component stays mounted without throwing

---

## Edge Cases

| Scenario | Handling |
|---|---|
| `loading: true` on mount | Button not rendered — no flash |
| `signOut` throws | Caught in handler, logged, UI unaffected |
| `useUser` outside provider | Already throws by design — provider wraps dashboard layout |

---

## Verification

1. `npx vitest run tests/components/Navbar.test.tsx` → all pass
2. `npx vitest run` → all 22+ tests pass
3. `npm run build` → no errors
4. `npm run lint` → no errors
5. Manual: sign in via `/signup` → navbar shows "Log out" → click it → button disappears
