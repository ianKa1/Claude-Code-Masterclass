# Spec for login-firebase-auth

branch: claude/feature/login-firebase-auth

## Summary

Wire the existing login form (`app/(public)/login/page.tsx`) to Firebase Authentication using `signInWithEmailAndPassword` from the Firebase Auth Web SDK. On successful sign-in, display an inline success message in the form. No redirect is performed at this stage. On failure, show an appropriate inline error message. Only the Firebase Web SDK may be used.

## Functional Requirements

- The login form submits email and password to `signInWithEmailAndPassword` from the Firebase Auth Web SDK.
- On successful sign-in, an inline success message is displayed (e.g. "Logged in successfully!"). The form remains on the page with no redirect.
- If sign-in fails, an inline error message is shown on the form — no alert/toast. The message should be user-friendly based on the Firebase error code.
- While the async operation is in flight the submit button shows a loading/disabled state.
- Existing client-side validation (email regex, password required) runs before the Firebase call is made.
- The Firebase auth action logic should be extracted into a dedicated module (e.g. `lib/firebase/login.ts`) to keep the page component focused on UI.

## Possible Edge Cases

- Firebase returns `auth/invalid-credential` (wrong email or password) — show a friendly "Invalid email or password" message.
- Firebase returns `auth/user-disabled` — show "This account has been disabled".
- Firebase returns `auth/too-many-requests` — show "Too many attempts. Please try again later".
- Any other Firebase error — show a generic "Something went wrong. Please try again." message.
- The success message should be cleared if the user modifies the form after a successful login.

## Acceptance Criteria

- Submitting the form with valid credentials signs the user in via Firebase Auth.
- A success message is visible on the page after successful sign-in.
- No redirect occurs after sign-in.
- Submitting with incorrect credentials shows an inline error without crashing.
- The submit button is disabled while the request is in flight.
- All Firebase calls use the Web SDK only (`firebase/auth`).

## Open Questions

- Should the success message include the user's codename/displayName (e.g. "Welcome back, SwiftCrimsonFox!")? Or a generic message? Include the user's codename/displayName

## Testing Guidelines

Extend `tests/pages/login.test.tsx`. Test the following:

- Submitting valid credentials calls the login action with the correct email and password.
- A success message is rendered after a successful sign-in.
- An `auth/invalid-credential` error results in an inline "Invalid email or password" message.
- The submit button is disabled during the in-flight state.
- Existing tests (renders, link to /signup, invalid email validation) continue to pass.
