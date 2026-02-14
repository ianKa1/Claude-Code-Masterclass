# Spec for Authentication Forms

branch: claude/feature/auth-forms

## Summary

Add login and signup forms to the existing `/login` and `/signup` pages. Both forms share the same field structure (email, password with visibility toggle, submit button) but differ in their heading, button label, and navigation link. Form submission logs the entered details to the console. No real authentication is implemented yet.

## Functional Requirements

- Both `/login` and `/signup` pages display a form with an email input and a password input
- The password field includes a toggle icon (from lucide-react) to show/hide the password
- The login page has a "Log In" submit button; the signup page has a "Sign Up" submit button
- On form submission, prevent default behavior and log the email and password values to the console
- Each form includes a link to switch to the other form (e.g., "Don't have an account? Sign up" on login, "Already have an account? Log in" on signup)
- Forms should use the existing `.form-title`, `.center-content`, and `.page-content` utility classes for layout
- Form styling should use CSS Modules following the existing component pattern
- Email input should have `type="email"` and password input should have `type="password"` (toggling to `type="text"` when visible)

## Possible Edge Cases

- Empty field submission (both fields should be required via HTML `required` attribute)
- Password visibility toggle should not lose focus or cursor position
- Navigation links between forms should use Next.js `Link` component for client-side routing

## Acceptance Criteria

- Visiting `/login` shows a login form with email, password (with toggle), and "Log In" button
- Visiting `/signup` shows a signup form with email, password (with toggle), and "Sign Up" button
- Clicking the password visibility icon toggles between showing and hiding the password
- Submitting either form logs `{ email, password }` to the browser console
- Each page has a link that navigates to the other auth page
- Forms follow the existing component structure and styling conventions (CSS Modules, theme tokens)

## Open Questions

- Should a shared AuthForm component be created, or should each page have its own form markup? No
- Should there be any client-side validation beyond HTML required attributes (e.g., email format, minimum password length)? No
- Do we need a "Forgot password?" link on the login form? Yes
- Do we need to validate email format beyond the browser's built-in `type="email"` check? Yes
- Should we enforce password strength rules (minimum length, special characters, etc.)? No
- Do we need a "Confirm password" field on the signup form? No
- Should the submit button show a loading/disabled state while submitting? Yes
- Do we need "Sign in with Google/GitHub" social auth buttons as placeholders? Yes
- Should form fields preserve their values if the user navigates between login and signup? Yes
- Do we need inline error messages per field, or is a single form-level error sufficient? Yes
- Should the password visibility toggle have an accessible label (aria-label) for screen readers? Yes

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Login form renders email input, password input, and "Log In" button
- Signup form renders email input, password input, and "Sign Up" button
- Password visibility toggle switches input type between "password" and "text"
- Each form has a link navigating to the other auth page
- Form submission calls console.log with the entered values
