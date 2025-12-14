# Spec for Use Heists Hook

branch: claude/feature/use-heists-hook

## Summary
Create a custom React hook called `useHeists` that provides real-time access to heists data from the Firestore collection. The hook will return an array of heist objects that automatically updates when the underlying Firestore data changes, enabling reactive UI updates in the `/heists` page and other components.

## Functional Requirements
- Create a `useHeists` hook in the `hooks/` directory
- Hook should establish a real-time listener to the Firestore `heists` collection
- Return an array of Heist objects that matches the existing Heist interface
- Include loading state to handle initial data fetch
- Include error state for handling Firestore errors
- Automatically clean up Firestore listener on component unmount
- Support optional filtering parameters (e.g., by status, assignee)
- Use the existing Firestore converter for type-safe data transformation

## Possible Edge Cases
- User not authenticated (should handle gracefully)
- Empty heists collection (return empty array)
- Network disconnection during real-time updates
- Firestore permission errors
- Component unmounting before data loads
- Multiple components using the hook simultaneously (listener efficiency)

## Acceptance Criteria
- Hook returns `{ heists: Heist[], loading: boolean, error: Error | null }`
- Real-time updates work correctly (adding/updating/deleting heists reflects immediately)
- No memory leaks (listeners properly cleaned up)
- TypeScript types are fully inferred
- Hook can be imported and used in any component
- Loading state is `true` initially and `false` after first data load
- Error state captures and exposes Firestore errors

## Open Questions
- Should the hook support pagination for large heist collections?
- Should we implement any caching strategy to reduce Firestore reads?
- Do we need different hooks for different heist views (active, assigned, expired)?
- Should the hook accept a user ID to filter heists by assignment?

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Hook returns empty array when collection is empty
- Hook updates when new heist is added to Firestore
- Hook updates when existing heist is modified
- Hook updates when heist is deleted
- Loading state transitions correctly
- Error state is set when Firestore throws error
- Listener is cleaned up on unmount (no memory leaks)

## Checking Documentation
Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
