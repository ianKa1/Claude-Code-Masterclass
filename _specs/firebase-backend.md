# Spec for Firebase Backend

branch: claude/feature/firebase-backend

## Summary

Initialise Firebase as the backend for Pocket Heist. This includes setting up the Firebase project configuration, Firestore as the database, and Firebase Authentication as the auth provider. The goal is to replace the current frontend-only placeholder state with a real, persistent backend that the app's features can build on.

## Functional Requirements

- Firebase app is initialised and connected to the project (web SDK config wired in)
- Firestore is available as the database layer for heist data
- Firebase Authentication is configured and ready for use (email/password provider at minimum)
- A Firebase config module exports the initialised app, auth, and firestore instances for use throughout the app
- Environment variables are used for all Firebase config values (no hardcoded credentials)
- The existing login and signup forms are wired to Firebase Auth (sign in / create account)
- On successful login, the user is redirected to `/heists`
- On successful signup, the user is redirected to `/heists`
- On auth failure, an inline error message is shown on the relevant form
- The home page redirects authenticated users to `/heists` and unauthenticated users to `/login`

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- Firebase SDK initialisation must not run on the server (SSR) — use client-only imports or guard with `typeof window`
- Multiple calls to `initializeApp` should be guarded against (use `getApps()` check)
- Network errors during sign-in / sign-up should show a user-facing error rather than crashing
- Auth state persistence: user should remain logged in on page refresh
- Invalid Firebase credentials in env vars should surface a clear error during development

## Acceptance Criteria

- Firebase app initialises without errors in both dev and production builds
- Submitting the login form with valid credentials signs the user in via Firebase Auth and redirects to `/heists`
- Submitting the signup form with valid details creates a new Firebase Auth user and redirects to `/heists`
- Submitting either form with wrong credentials shows an inline error message
- The home page (`/`) correctly redirects based on auth state
- No Firebase config values are committed to source control
- `npm run build` and `npm run lint` pass with no errors

## Open Questions

- Which Firebase Authentication providers should be enabled beyond email/password? (e.g. Google, GitHub)
- Should Firestore security rules be set up in this feature, or deferred to when heist data is read/written?
- Should the Firebase config be stored in a `.env.local` file only, or also documented in a `.env.example`?
- Should a loading state be shown on the auth forms while the Firebase request is in flight?

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Firebase app initialises without errors (config module loads correctly)
- Login form shows an error message when Firebase returns an auth error
- Signup form shows an error message when Firebase returns an auth error
