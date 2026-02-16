# Plan: Signup Firebase Auth

## Context

The signup form at `app/(public)/signup/page.tsx` currently only `console.log`s credentials on submit. This plan wires it to Firebase Authentication (`createUserWithEmailAndPassword`), generates a random PascalCase codename, sets it as the user's `displayName` via `updateProfile`, and writes a `users/{uid}` document to Firestore with `{ id, codename }` — no email stored. Firebase Web SDK only.

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `lib/utils/codename.ts` | Create — word sets + `generateCodename()` |
| `lib/firebase/signup.ts` | Create — `signUpUser(email, password)` async action |
| `app/(public)/signup/page.tsx` | Modify — wire `handleSubmit` to `signUpUser`, handle errors |
| `tests/lib/codename.test.ts` | Create — unit tests for codename generator (lives under `tests/lib/`) |
| `tests/pages/signup.test.tsx` | Modify — replace console.log test with Firebase mock tests |

---

## Build Order

1. `lib/utils/codename.ts`
2. `lib/firebase/signup.ts`
3. `app/(public)/signup/page.tsx`
4. `tests/lib/codename.test.ts`
5. `tests/pages/signup.test.tsx`
6. Lint + build pass

---

## Implementation Details

### `lib/utils/codename.ts`

Three exported word arrays (10+ words each, each word already capitalised):
- `ADJECTIVES` — e.g. Swift, Clever, Bold, Silent, Rogue, Iron, Ghost, Lunar, Neon, Velvet…
- `COLOURS` — e.g. Crimson, Amber, Cobalt, Jade, Onyx, Scarlet, Ivory, Teal, Violet, Silver…
- `ANIMALS` — e.g. Fox, Raven, Wolf, Lynx, Cobra, Hawk, Viper, Jaguar, Falcon, Mantis…

Export `generateCodename(): string`:
- Picks one word randomly from each array using `Math.floor(Math.random() * arr.length)`
- Concatenates all three — PascalCase is natural since each word is already capitalised
- Returns a string like `"SwiftCrimsonFox"`

---

### `lib/firebase/signup.ts`

Imports:
- `createUserWithEmailAndPassword`, `updateProfile` from `firebase/auth`
- `setDoc`, `doc` from `firebase/firestore`
- `auth`, `db` from `./config`
- `generateCodename` from `@/lib/utils/codename`

`signUpUser(email: string, password: string): Promise<void>`:
1. `const { user } = await createUserWithEmailAndPassword(auth, email, password)` — let errors propagate to the caller
2. `const codename = generateCodename()`
3. `try { await updateProfile(user, { displayName: codename }) } catch (err) { console.error(...) }` — graceful failure
4. `try { await setDoc(doc(db, "users", user.uid), { id: user.uid, codename }) } catch (err) { console.error(...) }` — graceful failure

---

### `app/(public)/signup/page.tsx` (modification)

**Router:** `const router = useRouter()` from `next/navigation`

**New state:** `const [firebaseError, setFirebaseError] = useState("")`

**`handleSubmit` — make async, replace `console.log` block:**
```
setFirebaseError("")
setIsLoading(true)
try {
  await signUpUser(email, password)
  setPassword("")
  localStorage.removeItem("auth_password")
  router.push("/heists")
} catch (err) {
  const code = (err as { code?: string }).code
  if (code === "auth/email-already-in-use") setFirebaseError("Email is already registered")
  else if (code === "auth/weak-password") setPasswordError("Password must be at least 6 characters")
  else setFirebaseError("Something went wrong. Please try again.")
} finally {
  setIsLoading(false)
}
```

**JSX** — add below the submit button:
```tsx
{firebaseError && <p className={styles.errorText}>{firebaseError}</p>}
```

No CSS changes — `.errorText` already exists in `Signup.module.css`.

---

## Tests

### `tests/lib/codename.test.ts`

- `generateCodename()` returns a non-empty string
- Return value matches `/^[A-Z][a-z]+[A-Z][a-z]+[A-Z][a-z]+$/` (three PascalCase words joined)
- Mocking `Math.random` to return `0` always yields the first word from each array (deterministic)

### `tests/pages/signup.test.tsx` (modify)

**Mocks (use `vi.hoisted` for function refs):**
- `vi.mock("@/lib/firebase/config", () => ({ auth: {}, db: {} }))`
- `vi.mock("firebase/auth", () => ({ createUserWithEmailAndPassword: mockCreate, updateProfile: mockUpdate }))`
- `vi.mock("firebase/firestore", () => ({ setDoc: mockSetDoc, doc: mockDoc }))`
- `vi.mock("@/lib/firebase/signup", () => ({ signUpUser: mockSignUpUser }))` — mock the whole action module in page tests

**Tests to add (replace the `console.log` test):**
1. Valid submit calls `signUpUser` with the correct email and password
2. After success, `router.push` is called with `"/heists"`
3. `auth/email-already-in-use` error → "Email is already registered" is rendered inline
4. `auth/weak-password` error → password error message is rendered inline

**Tests for `lib/firebase/signup.ts` (separate file `tests/lib/signup.test.ts` optional):**
1. Calls `createUserWithEmailAndPassword` with correct args
2. After success, `updateProfile` is called with a non-empty string `displayName`
3. `setDoc` is called — document data contains `id` and `codename` but not `email`

**Keep existing tests:**
- Renders email input, password input, Sign Up button
- Has a link to `/login`
- Shows inline error on invalid email submit

---

## Edge Cases

| Scenario | Handling |
|---|---|
| `updateProfile` fails | Caught in `signUpUser`, logs error, doesn't block user |
| `setDoc` fails | Caught in `signUpUser`, logs error, doesn't block user |
| Unknown Firebase error | Generic "Something went wrong" via `firebaseError` state |
| Password cleared on success | `setPassword("")` + `localStorage.removeItem("auth_password")` |
| `firebaseError` cleared on each new submit | `setFirebaseError("")` at start of handler |

---

## Verification

1. `npx vitest run tests/lib/codename.test.ts` → all pass
2. `npx vitest run tests/pages/signup.test.tsx` → all pass
3. `npx vitest run` → all tests pass
4. `npm run build` → no errors
5. `npm run lint` → no errors
6. Manual: `/signup` → register new email → redirects to `/heists`; Firebase Console Auth shows user with `displayName`; Firestore `users/{uid}` has `id` + `codename`, no `email` field
