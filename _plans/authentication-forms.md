# Authentication Forms Implementation Plan

## Summary
Implement login and signup forms with email/password fields, password visibility toggle, and form-to-form navigation. Forms log data to console on submit.

## Approach
Create reusable UI components (Input, PasswordInput) in `components/ui/`, then a shared AuthForm component that both pages use with a `mode` prop.

## Files to Create

### 1. `components/ui/Input.tsx` + `Input.module.css`
- Base input component with label, placeholder, validation support
- Styled for dark theme using CSS variables (bg-lighter, color-heading, etc.)
- Focus state with primary color border, error state with error color

### 2. `components/ui/PasswordInput.tsx` + `PasswordInput.module.css`
- Extends Input pattern, adds show/hide toggle
- Uses `'use client'` for state management
- Eye/EyeOff icons from lucide-react
- Toggle button positioned absolutely within input wrapper

### 3. `components/forms/AuthForm.tsx` + `AuthForm.module.css`
- `'use client'` component with `mode: 'login' | 'signup'` prop
- Form state for email, password, and confirmPassword (signup only)
- Signup mode shows additional "Confirm Password" field
- Submit handler logs `{ email, password }` to console
- Validates passwords match on signup before submit
- Uses existing `.btn` class for submit button
- Link to switch between login/signup pages

## Files to Update

### 4. `app/(public)/login/page.tsx`
- Import AuthForm, render with `mode="login"`
- Fix component name (currently incorrectly named SignupPage)

### 5. `app/(public)/signup/page.tsx`
- Import AuthForm, render with `mode="signup"`
- Update heading to "Create Your Account"

## Implementation Order
1. Input component + CSS module
2. PasswordInput component + CSS module
3. AuthForm component + CSS module
4. Update login page
5. Update signup page
6. Run `npm run lint`

## Key Patterns
- CSS modules for component-specific styles (following Skeleton.tsx pattern)
- Theme variables: `var(--color-lighter)`, `var(--color-primary)`, `var(--color-error)`, etc.
- HTML5 validation with `:invalid:not(:placeholder-shown)` for error styling
- `lucide-react` for Eye/EyeOff icons
