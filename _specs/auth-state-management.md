# Spec for Auth State Management

branch: claude/feature/auth-state-management

## Summary

Implement a global auth state management solution using a React context and a `useUser` hook. The hook returns the current Firebase user object (or `null` if logged out) and is accessible from any page or component in the app. Auth state is kept in sync in real time via Firebase's `onAuthStateChanged` listener. This spec does not cover login, signup, or logout flows — only the infrastructure for observing and consuming auth state.

## Functional Requirements

- A React context (`AuthContext`) holds the current user value and is provided at the app root so every page and component can access it
- A `useUser` hook reads from `AuthContext` and returns the current user (`User | null`)
- On app load, `onAuthStateChanged` is called once to register a real-time listener; the listener updates the context value whenever auth state changes
- While the initial auth state is being resolved, a loading state is available so pages can avoid rendering prematurely
- The `useUser` hook is usable in any client component or page without prop drilling
- Any existing component that needs the current user reads it via `useUser` rather than receiving it as a prop
- The use object should contain email, uid, displayName.

## Possible Edge Cases

- Auth state must not be read on the server — the context provider must be a client component
- The `onAuthStateChanged` listener must be unsubscribed when the provider unmounts to avoid memory leaks
- The loading state must be handled before rendering user-dependent UI, to avoid a flash of incorrect content
- Calling `useUser` outside of `AuthProvider` should throw a clear error in development

## Acceptance Criteria

- `useUser()` returns `null` when no user is signed in
- `useUser()` returns the Firebase `User` object when a user is signed in
- Auth state updates in real time — if a user signs in or out in another tab, the context reflects the change on next focus
- A `loading` boolean is exposed alongside `user` so consumers can show a skeleton or spinner until the initial state resolves
- No page or component receives the user object via props — all reads go through `useUser`
- The app builds and lints with no errors

## Open Questions

- Should the provider live in the root layout (`app/layout.tsx`) or in a separate `providers.tsx` wrapper? (Recommended: separate `providers.tsx` to keep the root layout clean) Separate
- Should `useUser` also expose a `loading` boolean, or return a three-value type (`User | null | undefined` where `undefined` means loading)? Yes
- Should the context file live in `lib/firebase/` alongside `config.ts`, or in a top-level `contexts/` directory? You choose

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `useUser` returns `null` when `AuthContext` provides a null user
- `useUser` returns the user object when `AuthContext` provides a signed-in user
- `useUser` throws (or logs an error) when used outside of `AuthProvider`
