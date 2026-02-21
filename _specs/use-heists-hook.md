# Spec for useHeists Hook

branch: claude/feature/use-heists-hook

## Summary

Create a custom React hook `useHeists` that provides real-time access to heist data from Firestore with intelligent filtering based on user context and heist status. The hook accepts a filter type (`'active'`, `'assigned'`, or `'expired'`) and returns an array of heist objects that automatically updates when the underlying Firestore data changes. Integrate this hook into the heists page to display filtered heist titles organized by category.

## Functional Requirements

### Hook Signature
- **Name:** `useHeists`
- **Location:** `lib/firebase/useHeists.ts`
- **Parameter:** `filter: 'active' | 'assigned' | 'expired'`
- **Returns:** `{ heists: Heist[], loading: boolean, error: string | null }`

### Filter Behavior

**'active' filter:**
- Return heists assigned TO the current user (`assignedTo === currentUser.uid`)
- Where deadline has NOT passed (`deadline > now`)
- Real-time subscription using Firestore `onSnapshot`

**'assigned' filter:**
- Return heists created BY the current user (`createdBy === currentUser.uid`)
- Where deadline has NOT passed (`deadline > now`)
- Real-time subscription using Firestore `onSnapshot`

**'expired' filter:**
- Return heists where deadline HAS passed (`deadline <= now`)
- AND where `finalStatus` is NOT null (heist has been completed/marked)
- Regardless of user (no user filtering)
- Real-time subscription using Firestore `onSnapshot`

### Real-time Updates
- Use Firestore `onSnapshot` for live data synchronization
- Automatically update component state when:
  - New heists are created
  - Existing heists are updated
  - Heists are deleted
  - Deadlines expire (heists move from active/assigned to expired)

### Integration with Heists Page
- Update `app/(dashboard)/heists/page.tsx` to use the hook three times (once per filter)
- Display heist titles only under each section header
- Maintain existing section structure (Active, Assigned, Expired)

## Possible Edge Cases

- **No current user:** Hook should return empty array and set loading to false when user is null or auth is loading
- **Empty results:** Some filters may return zero heists (e.g., new user has no active heists)
- **Deadline boundary:** Heists with deadlines exactly at current time should be treated as expired
- **Network disconnection:** Firestore SDK handles offline/online transitions, but error state should reflect connection issues
- **Unmounted component:** Unsubscribe from Firestore listener when component unmounts to prevent memory leaks
- **Rapid filter changes:** If filter prop changes while previous query is in flight, cancel old subscription and start new one
- **Timestamp comparison:** Firestore Timestamps must be converted to Date objects for comparison with current time
- **Auth state changes:** If user logs out or changes, subscriptions should update accordingly

## Acceptance Criteria

- [ ] Hook file created at `lib/firebase/useHeists.ts`
- [ ] Hook accepts `filter` parameter with proper TypeScript typing
- [ ] Hook returns object with `heists`, `loading`, and `error` properties
- [ ] Real-time updates work for all three filter types
- [ ] Firestore queries correctly filter by:
  - User ID (for active/assigned filters)
  - Deadline comparison (all filters)
  - Final status check (expired filter only)
- [ ] Heists page displays titles under correct sections
- [ ] Loading state shows while data is being fetched
- [ ] Error state displays user-friendly message if query fails
- [ ] No memory leaks (listeners properly cleaned up on unmount)
- [ ] Hook respects auth loading state (doesn't query while auth is loading)
- [ ] Expired heists only show if finalStatus is not null

## Open Questions

- Should the hook provide a refetch function for manual refresh, or is real-time subscription sufficient? Yes
- Should we display a loading skeleton or spinner while heists are loading? No
- If a heist has no finalStatus but deadline has passed, should it appear in any section? (Spec says no, but confirm business logic) Show it as "expired".
- Should we limit the number of results per query (e.g., pagination or max 50 heists)? Yes, limit 50 heists.
- Should expired heists be sorted by deadline (most recent first)? Yes

## Testing Guidelines

Create a test file `tests/lib/useHeists.test.tsx` for the hook with the following test cases:

- Hook returns empty array when user is not authenticated
- Hook shows loading state while fetching data
- 'active' filter returns only heists assigned to current user with future deadlines
- 'assigned' filter returns only heists created by current user with future deadlines
- 'expired' filter returns only heists with past deadlines and non-null finalStatus
- 'expired' filter includes heists from all users (not filtered by current user)
- Hook updates when new heist is added to Firestore (real-time)
- Hook cleans up Firestore listener on unmount (no memory leaks)
- Hook handles Firestore query errors gracefully
- Hook re-subscribes when filter parameter changes

Create a test file `tests/pages/heists-page.test.tsx` for the updated page:

- Page displays three sections with correct headers
- Page calls useHeists hook three times (once per filter)
- Page displays heist titles under correct sections
- Page shows loading state while heists are being fetched
- Page displays empty state message when no heists exist for a filter
- Page displays error message if hook returns error
