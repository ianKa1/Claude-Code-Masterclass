# Spec for route-protection

branch: claude/feature/route-protection

## Summary

Add client-side route protection to both route groups. Pages in the `(public)` group (login, signup, home) should only be accessible to unauthenticated users — signed-in users are redirected away. Pages in the `(dashboard)` group (heists, create, detail) should only be accessible to authenticated users — guests are redirected to `/login`. Both group layouts use the existing `useUser` hook to read auth state. While Firebase is still resolving the auth status (`loading: true`), a simple full-screen loader is shown instead of the page content or triggering a redirect prematurely.

## Functional Requirements

- The `(public)` group layout reads auth state via `useUser()`. If `loading` is false and `user` is non-null, redirect to `/heists`.
- The `(dashboard)` group layout reads auth state via `useUser()`. If `loading` is false and `user` is null, redirect to `/login`.
- While `loading` is true in either layout, render a simple loading indicator in place of `{children}` — no redirect fires yet.
- Once `loading` is false and the user state is confirmed, the redirect (if needed) fires immediately before any page content renders.
- Redirects use Next.js `useRouter` (`router.replace`) so they do not add an entry to the browser history stack.
- The loader should be minimal — a centered spinner or simple text — consistent with the existing app style.
- Both layouts must remain `"use client"` components since they call `useUser()`.

## Possible Edge Cases

- `loading` takes longer than expected — the loader prevents a flash of the wrong content.
- User signs out while on a dashboard page — `onAuthStateChanged` fires, `useUser` updates, the layout re-renders and redirects to `/login`.
- User signs in while on a public page — `onAuthStateChanged` fires, layout re-renders and redirects to `/heists`.
- The home page (`/`) is currently in the `(public)` group — it should follow the same public protection rules.
- SSR: both layouts are client components so auth checks only run in the browser; no server-side redirect is needed.

## Acceptance Criteria

- An unauthenticated user visiting `/heists` is redirected to `/login`.
- An authenticated user visiting `/login` or `/signup` is redirected to `/heists`.
- During the Firebase auth resolution period, neither the page content nor a redirect is shown — only the loader.
- After auth resolves with no redirect needed, page content renders normally.
- Redirects use `router.replace` (no back-button loop).

## Open Questions

- Should the public home page (`/`) redirect signed-in users to `/heists` as well, or be treated as a landing page visible to all? (Assumed yes — follows the same public group rules.)
- What should the loader look like exactly? (Assumed: a centered spinner using existing theme tokens, consistent with the `Skeleton` component style.)

## Testing Guidelines

Create or extend tests in `tests/` for the layout components. Test the following:

- `(public)` layout: renders `{children}` when `useUser` returns `{ user: null, loading: false }`.
- `(public)` layout: renders the loader when `useUser` returns `{ loading: true }`.
- `(public)` layout: calls `router.replace("/heists")` when `useUser` returns a signed-in user with `loading: false`.
- `(dashboard)` layout: renders `{children}` when `useUser` returns a signed-in user with `loading: false`.
- `(dashboard)` layout: renders the loader when `useUser` returns `{ loading: true }`.
- `(dashboard)` layout: calls `router.replace("/login")` when `useUser` returns `{ user: null, loading: false }`.
