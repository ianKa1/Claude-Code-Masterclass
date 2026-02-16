# Plan: Login Firebase Auth

## Context

The login form at `app/(public)/login/page.tsx` currently only `console.log`s credentials on submit. This plan wires it to Firebase Authentication (`signInWithEmailAndPassword`), displays a personalised success message using the user's `displayName` (their codename, e.g. "Welcome back, SwiftCrimsonFox!"), and shows friendly inline errors on failure. No redirect. Mirrors the `signup-firebase-auth` pattern.

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `lib/firebase/login.ts` | Create — `loginUser(email, password)` async action returning `displayName` |
| `app/(public)/login/page.tsx` | Modify — wire `handleSubmit` to `loginUser`, show success/error messages |
| `app/(public)/login/Login.module.css` | Modify — add `.successText` class |
| `tests/pages/login.test.tsx` | Modify — replace console.log test with Firebase mock tests |

---

## Build Order

1. `lib/firebase/login.ts`
2. `app/(public)/login/Login.module.css`
3. `app/(public)/login/page.tsx`
4. `tests/pages/login.test.tsx`
5. Lint + build pass

---

## Implementation Details

### `lib/firebase/login.ts`

Imports: `signInWithEmailAndPassword` from `firebase/auth`; `auth` from `./config`.

`loginUser(email: string, password: string): Promise<string | null>`:
1. `const { user } = await signInWithEmailAndPassword(auth, email, password)` — let errors propagate to the caller
2. Return `user.displayName` (may be `null` if not set)

Errors propagate up to the page for handling.

---

### `app/(public)/login/Login.module.css` (modification)

Add `.successText` after existing rules:

```css
.successText {
  @apply text-success text-sm text-center;
}
```

---

### `app/(public)/login/page.tsx` (modification)

**New state:**
- `const [firebaseError, setFirebaseError] = useState("")`
- `const [successMessage, setSuccessMessage] = useState("")`

**`handleSubmit` — make async, replace `console.log` block:**
```
setFirebaseError("")
setSuccessMessage("")
setIsLoading(true)
try {
  const displayName = await loginUser(email, password)
  setSuccessMessage(`Welcome back, ${displayName ?? "Agent"}!`)
  setPassword("")
  localStorage.removeItem("auth_password")
} catch (err) {
  const code = (err as { code?: string }).code
  if (code === "auth/invalid-credential") setFirebaseError("Invalid email or password")
  else if (code === "auth/user-disabled") setFirebaseError("This account has been disabled")
  else if (code === "auth/too-many-requests") setFirebaseError("Too many attempts. Please try again later")
  else setFirebaseError("Something went wrong. Please try again.")
} finally {
  setIsLoading(false)
}
```

**JSX** — add below the submit button:
```tsx
{firebaseError && <p className={styles.errorText}>{firebaseError}</p>}
{successMessage && <p className={styles.successText}>{successMessage}</p>}
```

---

## Tests (`tests/pages/login.test.tsx`)

**Mocks (use `vi.hoisted`):**
- `mockLoginUser` — controls return value / rejection
- `vi.mock("@/lib/firebase/login", () => ({ loginUser: mockLoginUser }))`

**Tests to add (replace the `console.log` test):**
1. Valid submit calls `loginUser` with the correct email and password
2. After success, "Welcome back, SwiftCrimsonFox!" is rendered (mock returns `"SwiftCrimsonFox"`)
3. `auth/invalid-credential` error → "Invalid email or password" inline error
4. `auth/too-many-requests` error → "Too many attempts. Please try again later" inline error

**Keep existing tests:**
- Renders email input, password input, Log In button
- Has a link to `/signup`
- Shows inline error on invalid email submit

---

## Edge Cases

| Scenario | Handling |
|---|---|
| `displayName` is null | Falls back to "Agent" — "Welcome back, Agent!" |
| `firebaseError` / `successMessage` cleared on each new submit | Both reset at start of handler |
| Password cleared on success | `setPassword("")` + `localStorage.removeItem("auth_password")` |

---

## Verification

1. `npx vitest run tests/pages/login.test.tsx` → all pass
2. `npx vitest run` → all tests pass
3. `npm run build` → no errors
4. `npm run lint` → no errors
5. Manual: `/login` → sign in with existing account → "Welcome back, {codename}!" message appears
