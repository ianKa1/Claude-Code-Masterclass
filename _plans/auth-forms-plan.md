# Plan: Authentication Forms Feature

## Context

The `/login` and `/signup` pages are currently empty placeholders with only a heading. This plan implements fully interactive client-side auth forms per the spec in `_specs/auth-forms.md`. No real authentication is wired — submission logs to the console — but the forms include all production-quality UX: field validation, loading states, social auth placeholders, password visibility toggle, and field value persistence across navigation.

---

## Files to Create / Modify

| File | Action |
|------|--------|
| `components/PasswordInput/PasswordInput.tsx` | Create — controlled password input with Eye/EyeOff toggle |
| `components/PasswordInput/PasswordInput.module.css` | Create — scoped styles for password input |
| `components/PasswordInput/index.ts` | Create — barrel re-export |
| `components/SocialAuthButtons/SocialAuthButtons.tsx` | Create — Google + GitHub placeholder buttons with divider |
| `components/SocialAuthButtons/SocialAuthButtons.module.css` | Create — scoped styles for social buttons |
| `components/SocialAuthButtons/index.ts` | Create — barrel re-export |
| `app/(public)/login/page.tsx` | Replace placeholder with full login form |
| `app/(public)/login/Login.module.css` | Create — scoped styles for login form |
| `app/(public)/signup/page.tsx` | Replace placeholder with full signup form |
| `app/(public)/signup/Signup.module.css` | Create — scoped styles for signup form |
| `tests/components/PasswordInput.test.tsx` | Create — password toggle unit tests |
| `tests/pages/login.test.tsx` | Create — login form integration tests |
| `tests/pages/signup.test.tsx` | Create — signup form integration tests |

---

## Build Order

Build in this sequence to avoid import errors:

1. `PasswordInput` component + tests
2. `SocialAuthButtons` component
3. Login page + tests
4. Signup page + tests
5. Lint pass

---

## Implementation Details

### Shared Decisions

- **No shared `AuthForm` component** — spec explicitly says no; each page owns its full form markup
- **Two shared sub-components** extracted because they are pixel-identical on both pages:
  - `PasswordInput` — controlled input + Eye/EyeOff toggle; owns `showPassword` state internally
  - `SocialAuthButtons` — divider + Google + GitHub buttons; purely presentational, no props
- **`"use client"`** directive required on both page files (uses `useState`, `useEffect`, `localStorage`)
- **`lucide-react`** icons: `Eye`, `EyeOff` (toggle), `Github` (social button)
- **CSS Modules** — every file uses `@reference "../../app/globals.css"` to access theme tokens via `@apply`
- **No semicolons**, **double quotes**, **trailing commas** per project code style

---

## Component: `PasswordInput`

### `components/PasswordInput/PasswordInput.tsx`

**Props interface:**
```ts
type Props = Readonly<{
  value: string
  onChange: (value: string) => void
  error?: string
}>
```

**Internal state:**
```ts
const [showPassword, setShowPassword] = useState(false)
```

**Full JSX structure:**
```tsx
<div className={styles.wrapper}>
  <div className={styles.inputRow}>
    <input
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.input}
      placeholder="••••••••"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className={styles.toggleBtn}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </div>
  {error && <p className={styles.errorText}>{error}</p>}
</div>
```

**Key decisions:**
- `type="button"` on toggle prevents accidental form submission
- `onClick` uses functional updater `(prev) => !prev` to avoid stale closure
- `error` renders only when truthy — consumer controls when to pass it
- Component does NOT render a `<label>` — the parent page owns the label so it can wire `htmlFor` to its own input ID

### `components/PasswordInput/PasswordInput.module.css`

```css
@reference "../../app/globals.css";

.wrapper {
  @apply flex flex-col gap-1;
}

.inputRow {
  @apply relative flex items-center;
}

.input {
  @apply w-full px-3 py-2 pr-10 rounded-lg bg-light text-heading
         border border-lighter focus:outline-none focus:border-primary;
}

.toggleBtn {
  @apply absolute right-3 text-body hover:text-heading transition-colors cursor-pointer;
}

.errorText {
  @apply text-error text-sm;
}
```

### `components/PasswordInput/index.ts`

```ts
export { default } from "./PasswordInput"
```

---

## Component: `SocialAuthButtons`

### `components/SocialAuthButtons/SocialAuthButtons.tsx`

**No props** — purely presentational placeholder.

**Full JSX structure:**
```tsx
"use client"

import { Github } from "lucide-react"
import styles from "./SocialAuthButtons.module.css"

export default function SocialAuthButtons() {
  return (
    <>
      <p className={styles.divider}>or</p>
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.socialBtn}>
          Continue with Google
        </button>
        <button type="button" className={styles.socialBtn}>
          <Github size={16} />
          Continue with GitHub
        </button>
      </div>
    </>
  )
}
```

**Key decisions:**
- Both buttons are `type="button"` to prevent form submission
- Google has no icon (no Google icon in lucide-react by default); GitHub uses `Github` from lucide-react
- `onClick` is intentionally omitted — these are non-functional placeholders per spec

### `components/SocialAuthButtons/SocialAuthButtons.module.css`

```css
@reference "../../app/globals.css";

.divider {
  @apply text-body text-sm text-center my-2;
}

.buttonGroup {
  @apply flex flex-col gap-2;
}

.socialBtn {
  @apply w-full px-4 py-2 rounded-lg bg-lighter text-heading font-semibold
         flex items-center justify-center gap-2 hover:opacity-80 transition-opacity cursor-pointer;
}
```

### `components/SocialAuthButtons/index.ts`

```ts
export { default } from "./SocialAuthButtons"
```

---

## Page: Login (`app/(public)/login/page.tsx`)

### Visual structure (top to bottom)

```
<div class="center-content">
  <div class="page-content">
    <h2 class="form-title">Log In to Your Account</h2>
    <form class={styles.form}>
      <!-- Email field -->
      <div class={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" ... />
        {emailError && <p class={styles.errorText}>{emailError}</p>}
      </div>

      <!-- Password field (via PasswordInput) -->
      <div class={styles.inputGroup}>
        <label htmlFor="password">Password</label>  ← note: label wired via wrapping div
        <PasswordInput value={password} onChange={setPassword} error={passwordError} />
        <a href="#" class={styles.forgotLink}>Forgot your password?</a>
      </div>

      <!-- Submit -->
      <button type="submit" disabled={isLoading} class={styles.submitBtn}>
        {isLoading ? <span class={styles.spinner} /> : "Log In"}
      </button>

      <!-- Social auth -->
      <SocialAuthButtons />

      <!-- Switch link -->
      <p class={styles.switchLink}>
        Don't have an account? <Link href="/signup">Sign up</Link>
      </p>
    </form>
  </div>
</div>
```

### State

```ts
const [email, setEmail]               = useState("")
const [password, setPassword]         = useState("")
const [isLoading, setIsLoading]       = useState(false)
const [emailError, setEmailError]     = useState("")
const [passwordError, setPasswordError] = useState("")
```

### localStorage persistence

```ts
// On mount — pre-populate from localStorage
useEffect(() => {
  setEmail(localStorage.getItem("auth_email") ?? "")
  setPassword(localStorage.getItem("auth_password") ?? "")
}, [])

// On every email change
const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEmail(e.target.value)
  localStorage.setItem("auth_email", e.target.value)
}

// On every password change (passed to PasswordInput's onChange)
const handlePasswordChange = (value: string) => {
  setPassword(value)
  localStorage.setItem("auth_password", value)
}
```

### Email validation

```ts
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// On blur
const handleEmailBlur = () => {
  if (email && !EMAIL_REGEX.test(email)) {
    setEmailError("Please enter a valid email address")
  } else {
    setEmailError("")
  }
}
```

### Submit handler

```ts
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()

  // Validate
  let valid = true
  if (!EMAIL_REGEX.test(email)) {
    setEmailError("Please enter a valid email address")
    valid = false
  }
  if (!password) {
    setPasswordError("Password is required")
    valid = false
  }
  if (!valid) return

  // Mock submission
  setIsLoading(true)
  console.log({ email, password })
  setIsLoading(false)
}
```

### `app/(public)/login/Login.module.css`

```css
@reference "../../app/globals.css";

.form {
  @apply flex flex-col gap-4 w-full max-w-sm mx-auto mt-6;
}

.inputGroup {
  @apply flex flex-col gap-1;
}

.label {
  @apply text-body text-sm;
}

.input {
  @apply w-full px-3 py-2 rounded-lg bg-light text-heading
         border border-lighter focus:outline-none focus:border-primary;
}

.errorText {
  @apply text-error text-sm;
}

.forgotLink {
  @apply text-primary text-sm hover:underline self-start;
}

.submitBtn {
  @apply w-full btn;
}

.spinner {
  @apply inline-block w-4 h-4 border-2 border-heading border-t-transparent
         rounded-full animate-spin;
}

.switchLink {
  @apply text-center text-body text-sm;
}

.switchLink a {
  @apply text-primary hover:underline;
}
```

---

## Page: Signup (`app/(public)/signup/page.tsx`)

### Visual structure (top to bottom)

```
<div class="center-content">
  <div class="page-content">
    <h2 class="form-title">Create an Account</h2>
    <form class={styles.form}>
      <!-- Email field -->
      <div class={styles.inputGroup}>
        <label>Email</label>
        <input type="email" ... />
        {emailError && <p class={styles.errorText}>{emailError}</p>}
      </div>

      <!-- Password field (via PasswordInput) -->
      <div class={styles.inputGroup}>
        <label>Password</label>
        <PasswordInput value={password} onChange={handlePasswordChange} error={passwordError} />
      </div>

      <!-- Submit -->
      <button type="submit" disabled={isLoading} class={styles.submitBtn}>
        {isLoading ? <span class={styles.spinner} /> : "Sign Up"}
      </button>

      <!-- Social auth -->
      <SocialAuthButtons />

      <!-- Switch link -->
      <p class={styles.switchLink}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </form>
  </div>
</div>
```

**Differences from login:**
- Heading: `"Create an Account"`
- Submit label: `"Sign Up"`
- No `forgotLink`
- Switch link goes to `/login`

State, localStorage, validation, and submit handler are **identical in shape** to the login page.

### `app/(public)/signup/Signup.module.css`

Same classes as `Login.module.css` minus `.forgotLink`. Copy the file and omit that rule.

---

## Tests

Each test file uses Vitest + React Testing Library. All globals (`describe`, `it`, `expect`) are available without imports (configured in `vitest.setup.ts`). Mock `localStorage` using `vi.stubGlobal` or jsdom's built-in implementation.

### `tests/components/PasswordInput.test.tsx` — 3 tests

```tsx
import { render, screen, fireEvent } from "@testing-library/react"
import PasswordInput from "@/components/PasswordInput"

describe("PasswordInput", () => {
  it("renders with type password by default", () => {
    render(<PasswordInput value="" onChange={() => {}} />)
    expect(screen.getByPlaceholderText("••••••••")).toHaveAttribute("type", "password")
  })

  it("toggles to type text when toggle button is clicked", () => {
    render(<PasswordInput value="" onChange={() => {}} />)
    fireEvent.click(screen.getByRole("button", { name: "Show password" }))
    expect(screen.getByPlaceholderText("••••••••")).toHaveAttribute("type", "text")
  })

  it("toggle button aria-label updates after toggle", () => {
    render(<PasswordInput value="" onChange={() => {}} />)
    const btn = screen.getByRole("button", { name: "Show password" })
    fireEvent.click(btn)
    expect(btn).toHaveAccessibleName("Hide password")
  })
})
```

### `tests/pages/login.test.tsx` — 4 tests

```tsx
import { render, screen, fireEvent } from "@testing-library/react"
import LoginPage from "@/app/(public)/login/page"

describe("LoginPage", () => {
  it("renders email input, password input, and Log In button", () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument()
  })

  it("has a link to /signup", () => {
    render(<LoginPage />)
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/signup")
  })

  it("calls console.log with email and password on valid submit", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {})
    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "secret" } })
    fireEvent.submit(screen.getByRole("form"))
    expect(spy).toHaveBeenCalledWith({ email: "test@example.com", password: "secret" })
    spy.mockRestore()
  })

  it("shows inline error when invalid email is submitted", () => {
    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "not-an-email" } })
    fireEvent.submit(screen.getByRole("form"))
    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument()
  })
})
```

### `tests/pages/signup.test.tsx` — 4 tests

Mirror of `login.test.tsx` with these substitutions:
- `LoginPage` → `SignupPage`
- `"Log In"` → `"Sign Up"`
- link name `/sign up/i` → `/log in/i`, href `/signup` → `/login`
- form role query unchanged

> Password toggle tests are covered by `PasswordInput.test.tsx` — not duplicated in page tests.

---

## Edge Cases & Gotchas

| Scenario | Handling |
|---|---|
| `localStorage` not available (SSR) | `useEffect` runs only client-side — safe. No SSR reads. |
| User clears email after blur error | Error clears on next blur if field is now valid or empty |
| Submit with empty email | Regex fails on empty string → shows email error |
| Submit with empty password | `!password` check → shows password error |
| Both fields empty on submit | Both errors shown simultaneously |
| Spinner during loading | `isLoading` is synchronous mock so spinner flashes; acceptable for console-only submission |
| PasswordInput `onChange` receives string, not event | Parent must adapt — `handlePasswordChange` accepts `string`, not `React.ChangeEvent` |
| `forgotLink` href | Use `href="#"` — no destination per spec |

---

## Accessibility Checklist

- [ ] All inputs have associated `<label>` elements (via `htmlFor` / `id`)
- [ ] Password toggle has `aria-label` that reflects current state
- [ ] Submit button is `disabled` (not just visually) during loading
- [ ] Error messages are adjacent to their field (not just visible)
- [ ] Social buttons have descriptive text labels (not icon-only)
- [ ] `<form>` has `aria-label` or is wrapped in a landmark for test queries

---

## Verification

1. `npm run dev` → visit `/login` and `/signup` — forms render correctly
2. Toggle password visibility on both pages — icon switches, input type changes
3. Blur email field with invalid value → inline error appears
4. Submit with invalid email → error appears without navigation
5. Submit with empty password → "Password is required" error appears
6. Submit valid form → `{ email, password }` logged in browser console
7. Type values in login → navigate to signup → values should be pre-filled
8. `npx vitest run tests/components/PasswordInput.test.tsx` → 3 tests pass
9. `npx vitest run tests/pages/login.test.tsx` → 4 tests pass
10. `npx vitest run tests/pages/signup.test.tsx` → 4 tests pass
11. `npm run lint` → no ESLint errors
