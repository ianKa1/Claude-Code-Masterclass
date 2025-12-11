# Spec for Auth State Management Solution

branch: claude/feature/auth-state-management-solution
figma_component (if used): N/A

## Summary

Create a centralized auth state management solution that provides a `useUser` hook to access the current Firebase user across all components and pages. This will replace the scattered auth state logic currently duplicated in components like Navbar and AuthForm, providing a single source of truth for authentication state.

## Functional Requirements

- Create an `AuthProvider` context component that wraps the app and manages Firebase auth state
- Implement a `useUser` hook that returns the current Firebase user (or null if logged out)
- The hook should provide:
  - `user`: The Firebase User object or null
  - `loading`: Boolean indicating if auth state is being initialized
  - `error`: Any authentication error that occurred
- Move all `onAuthStateChanged` logic into the AuthProvider to avoid duplication
- Update existing components (Navbar, AuthForm) to use the new `useUser` hook instead of managing their own auth state
- Ensure the auth state persists across page navigations and refreshes
- Provider should be added to the root layout to make it available app-wide

## Possible Edge Cases

- Auth state initialization delay on first load (handle with loading state)
- Firebase auth token expiration and refresh
- Multiple components mounting/unmounting during auth state changes
- User object updates after profile changes (e.g., displayName updates)
- Network failures during auth state initialization
- Race conditions between logout and navigation

## Acceptance Criteria

- `useUser` hook can be called from any component or page
- Hook returns null when user is logged out
- Hook returns the Firebase User object when user is logged in
- Loading state is true during initial auth check and false once resolved
- Navbar component uses `useUser` instead of local `onAuthStateChanged`
- AuthForm component can access auth state through `useUser` if needed
- No duplicate auth listeners are active
- Auth state persists across page navigations
- TypeScript types are properly defined for the context and hook

## Open Questions

- Should the AuthProvider also expose helper functions like `logout` or `login`?
- Should we add a `requireAuth` HOC or helper for protected routes?
- Do we need to handle any Firestore user profile data alongside Firebase Auth user data?

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `useUser` hook returns null when no user is logged in
- `useUser` hook returns user object when user is logged in
- Loading state is true initially and false after auth resolves
- Auth state updates when user logs in
- Auth state updates when user logs out
- Multiple components can use `useUser` simultaneously without conflicts
- Provider correctly wraps the app and makes context available to children

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
