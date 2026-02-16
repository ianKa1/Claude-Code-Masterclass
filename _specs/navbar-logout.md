# Spec for navbar-logout

branch: claude/feature/navbar-logout
figma_component: Navbar with logout button

## Summary

Add a logout button to the `Navbar` component that signs the user out of Firebase when clicked. The button is only visible when the user is currently logged in (i.e. `useUser()` returns a non-null user). No redirect occurs after sign-out — the UI simply reflects the logged-out state via the existing `AuthContext`. Uses the Firebase Auth Web SDK only.

## Functional Requirements

- The `Navbar` component reads auth state via the existing `useUser()` hook.
- A logout button is rendered in the navbar when `user` is non-null.
- The logout button is hidden (not rendered) when `user` is null or `loading` is true.
- Clicking the logout button calls `signOut` from `firebase/auth`.
- After a successful sign-out, no redirect is performed — the navbar simply re-renders to the logged-out state.
- If `signOut` fails, the error is logged to the console; the UI does not break.
- The button style should match the Figma design reference below.

## Figma Design Reference

- File: https://www.figma.com/design/elHzuUQZiJXNqJft57oneh/Page-Designs?node-id=57-18&m=dev
- Component name: Navbar
- Key visual constraints: Refer to the Figma node for exact placement, typography, and colour of the logout button within the navbar.

## Possible Edge Cases

- `loading` is `true` on initial render — the logout button must not flash briefly before auth state resolves; render nothing while loading.
- `signOut` throws — catch the error, log it, and do not leave the UI in a broken state.
- User is already signed out when the button is clicked (race condition) — `signOut` is idempotent; no special handling needed.

## Acceptance Criteria

- The logout button appears in the navbar only when a user is signed in.
- The logout button is absent from the navbar when no user is signed in.
- The logout button is absent while `loading` is true.
- Clicking the logout button calls `signOut` from the Firebase Auth Web SDK.
- No redirect occurs after sign-out.
- The navbar re-renders correctly to the logged-out state after `signOut` resolves.

## Open Questions

- None — requirements are clear.

## Testing Guidelines

Extend `tests/components/Navbar.test.tsx`. Test the following:

- The logout button is not rendered when `useUser` returns `{ user: null, loading: false }`.
- The logout button is not rendered when `useUser` returns `{ user: {...}, loading: true }`.
- The logout button is rendered when `useUser` returns a signed-in user with `loading: false`.
- Clicking the logout button calls `signOut`.
- If `signOut` rejects, no uncaught error is thrown and the component remains mounted.
