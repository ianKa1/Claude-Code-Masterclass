# Spec for Protected Routes with Auth Guards

branch: claude/feature/protected-routes-with-auth-guards

## Summary

Implement route protection based on authentication status to ensure that:
- Pages in the `(public)` route group are only accessible to unauthenticated users
- Pages in the `(dashboard)` route group are only accessible to authenticated users
- Users are automatically redirected to the appropriate section based on their auth state
- A simple loading state is shown in layouts while Firebase auth status is being determined

## Functional Requirements

- **Public route protection**: Pages in `app/(public)/` should redirect authenticated users to `/heists` (main dashboard)
- **Dashboard route protection**: Pages in `app/(dashboard)/` should redirect unauthenticated users to `/login`
- **Auth state detection**: Use the existing `useUser` hook to determine authentication status
- **Loading states**: Show a simple, minimal loader in both layout files while `loading` is `true` from the `useUser` hook
- **Seamless UX**: Redirects should happen automatically without requiring user interaction
- **Client-side routing**: Use Next.js `useRouter` for client-side redirects to avoid page flashes
- **Preserve intended destination**: Consider redirecting users to their originally intended page after login (optional enhancement)

## Figma Design Reference

Not applicable - this is a routing and authentication logic feature.

## Possible Edge Cases

- **Auth state unknown**: Firebase is still initializing and user state is not yet determined - show loader
- **Race conditions**: User logs in/out while on a protected page - ensure redirect happens immediately
- **Manual URL navigation**: User types a protected URL directly into browser - redirect should still work
- **Infinite redirect loops**: Ensure redirects don't create circular navigation (e.g., `/login` → `/heists` → `/login`)
- **Slow auth initialization**: Firebase takes longer than expected to return auth state - loader should remain visible
- **Multiple rapid auth state changes**: Handle rapid login/logout sequences gracefully

## Acceptance Criteria

- Authenticated users visiting `/`, `/login`, or `/signup` are redirected to `/heists`
- Unauthenticated users visiting any `/heists/*` route are redirected to `/login`
- Loading spinner or skeleton is visible in layout while `loading === true` from `useUser` hook
- No flashing of protected content before redirect occurs
- Redirects work for both client-side navigation and direct URL access
- Auth state changes (login/logout) trigger immediate redirects when on wrong route group

## Open Questions

- Should we preserve the intended destination URL and redirect users there after login? (e.g., user tries to visit `/heists/create`, gets sent to `/login`, then after login goes to `/heists/create`)
- What should the loader look like? Simple spinner, skeleton, or branded animation?
- Should we show different loaders for public vs dashboard layouts, or use the same one?

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Unauthenticated user accessing `/heists` → should redirect to `/login`
- Authenticated user accessing `/login` → should redirect to `/heists`
- Loading state is shown while Firebase auth initializes
- Navigation between protected and public routes triggers appropriate redirects
- Direct URL access to protected routes enforces auth guards
- Logout on a dashboard page redirects to `/login`
- Login on a public page redirects to `/heists`

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.