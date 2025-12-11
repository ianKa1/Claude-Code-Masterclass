# Implementation Plan: Logout Functionality

**Branch:** claude/feature/logout-functionality
**Spec:** `_specs/logout-functionality.md`

## Overview
Add logout functionality to the Navbar component that signs users out via Firebase Auth and redirects them to `/login`.

## Tasks to Complete

### 1. Check Firebase Auth Documentation
- Verify best practices for implementing `signOut()` with Firebase Web SDK v9+
- Review modular syntax for auth operations
- Check error handling patterns

### 2. Convert Navbar to Client Component
The Navbar needs to:
- Add `"use client"` directive at the top
- Use React hooks (`useRouter`, `useEffect`, `useState`)
- Monitor Firebase auth state with `onAuthStateChanged`
- Conditionally render the logout button only when authenticated
- Import `auth` from `@/lib/firebase`

### 3. Implement Logout Button
Add a button that:
- Calls Firebase `signOut(auth)` from `firebase/auth`
- Redirects to `/login` after successful logout using Next.js `useRouter()`
- Uses `LogOut` icon from lucide-react
- Positioned in the navbar's `<ul>` element alongside "Create New Heist"
- Has appropriate label ("Log Out" or "Sign Out")

### 4. Add Error Handling
Handle edge cases:
- Network failures during logout
- Already expired sessions
- Multiple logout attempts
- Console log errors or show toast notifications

### 5. Style Logout Button
Ensure button:
- Matches existing navbar button styles (`.btn` class)
- Has appropriate icon from lucide-react (`LogOut`)
- Fits naturally in the navbar layout
- Follow project convention: define complex styles in globals.css with `@apply`

### 6. Create Tests
Create test file in `./tests/` directory for:
- Button only renders when user is authenticated
- Button hidden when user is not authenticated
- Clicking logout calls Firebase `signOut()`
- User redirects to `/login` after successful logout
- Auth state detection works correctly
- Error handling for failed logout attempts

### 7. Browser Testing
Manual verification:
- Test in `/heists` route with authenticated user
- Verify button appears when logged in
- Verify button hidden when logged out
- Test actual logout flow and redirect
- Verify no console errors

## Technical Approach

### Component Structure
```tsx
"use client"
import { auth } from '@/lib/firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LogOut, Clock8, Plus } from 'lucide-react'
```

### Authentication State Detection
- Use `onAuthStateChanged` listener in `useEffect`
- Store authenticated state in component state
- Cleanup listener on unmount

### Logout Handler
```typescript
const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
```

### Button Placement
Add to existing `<ul>` after "Create New Heist" button:
```tsx
<ul>
  <li>
    <Link href="/heists/create" className="btn">
      <Plus size={20} />
      Create New Heist
    </Link>
  </li>
  {isAuthenticated && (
    <li>
      <button onClick={handleLogout} className="btn">
        <LogOut size={20} />
        Log Out
      </button>
    </li>
  )}
</ul>
```

## Open Questions - Decisions Made

1. **Loading state during logout?**
   → Keep it simple initially, can add later if needed

2. **Confirmation dialog?**
   → Skip for v1, logout is easy to reverse by logging back in

3. **Position in navbar?**
   → Add to the end of the `<ul>` list after "Create New Heist"

4. **Clear local state?**
   → Firebase handles session cleanup, no additional clearing needed

5. **Icon choice?**
   → Use `LogOut` from lucide-react for consistency with project patterns

## Files to Modify
- `components/Navbar.tsx` - Add logout button and auth state logic
- `app/globals.css` - Add button styles if needed (follow `@apply` convention)

## Files to Create
- `tests/navbar-logout.test.tsx` (or similar) - Test suite for logout functionality

## Dependencies
All required dependencies already installed:
- `firebase` - Already configured in `lib/firebase.ts`
- `lucide-react` - Already in use
- `next/navigation` - Next.js built-in

## Acceptance Criteria
- ✓ Logout button appears in Navbar only when user is authenticated
- ✓ Clicking logout signs user out via Firebase Auth
- ✓ User redirected to `/login` after successful logout
- ✓ Navbar detects authentication state correctly
- ✓ Error handling for failed logout attempts
- ✓ Button has appropriate styling and positioning
- ✓ Uses Firebase Web SDK v9+ modular syntax
- ✓ All tests pass
