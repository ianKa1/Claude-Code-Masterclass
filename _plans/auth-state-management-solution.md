# Auth State Management Implementation Plan

## Overview
Create a centralized auth state management solution using React Context and a custom `useUser` hook. This will replace scattered auth logic in components like Navbar with a single source of truth for Firebase authentication state.

## Current Architecture
- Firebase Auth initialized in `lib/firebase.ts`
- Navbar has its own `onAuthStateChanged` listener (creating duplicate listeners)
- Auth utilities in `lib/auth.ts` for error handling and profile updates
- Two route groups: `(public)` and `(dashboard)`, each with full HTML layouts
- No context providers or custom hooks exist yet

## Implementation Steps

### 1. Create AuthContext with Provider
**File: `context/AuthContext.tsx`**

Create a new client component that:
- Defines `AuthContextType = { user: User | null, loading: boolean, error: Error | null }`
- Creates React Context with `createContext<AuthContextType | undefined>(undefined)`
- Implements `AuthProvider` component with:
  - State management for `user`, `loading`, and `error`
  - Single `onAuthStateChanged` listener in `useEffect`
  - Proper cleanup with unsubscribe on unmount
  - Error callback to handle auth initialization failures
  - Initial `loading: true` state
- Exports both `AuthProvider` and a `useUser` hook from this file

**Key implementation details:**
- Use `"use client"` directive
- Import `User` type and `onAuthStateChanged` from `firebase/auth`
- Import `auth` instance from `@/lib/firebase`
- Set `loading: false` after auth state resolves
- Handle both success and error callbacks in `onAuthStateChanged`

### 2. Create Root Layout
**File: `app/layout.tsx`** (new file)

Create a root layout that:
- Wraps both route groups with `AuthProvider`
- Includes metadata and CSS imports
- Provides the HTML and body structure
- Delegates route-specific content to child layouts

**Structure:**
```typescript
import type { Metadata } from "next"
import "@/app/globals.css"
import { AuthProvider } from "@/context/AuthContext"

export const metadata: Metadata = {
  title: "Pocket Heist",
  description: "Tiny missions. Big office mischief.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 3. Update Public Layout
**File: `app/(public)/layout.tsx`**

Modify to:
- Remove `<html>` and `<body>` tags (moved to root layout)
- Remove metadata export (moved to root layout)
- Remove CSS import (moved to root layout)
- Keep the `className="public"` styling by wrapping in a div
- Return only the route-specific content wrapper

**New structure:**
```typescript
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="public">
      <main>
        {children}
      </main>
    </div>
  )
}
```

### 4. Update Dashboard Layout
**File: `app/(dashboard)/layout.tsx`**

Modify to:
- Remove `<html>` and `<body>` tags (moved to root layout)
- Remove metadata export (moved to root layout)
- Remove CSS import (moved to root layout)
- Keep Navbar and main structure
- Return only the route-specific content

**New structure:**
```typescript
import Navbar from "@/components/Navbar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  )
}
```

### 5. Update Navbar Component
**File: `components/Navbar.tsx`**

Refactor to use the `useUser` hook:
- Remove `useState` for `isAuthenticated`
- Remove `useEffect` with `onAuthStateChanged` listener
- Import and call `useUser()` hook
- Extract `user` from the hook
- Replace `isAuthenticated` check with `user` truthy check
- Keep all other functionality (logout, navigation) unchanged

**Key changes:**
- Import: `import { useUser } from "@/context/AuthContext"`
- Replace: `const { user } = useUser()`
- Condition: `{user && (<button onClick={handleLogout}>...</button>)}`

## Files to Create
1. `context/AuthContext.tsx` - Auth provider and context
2. `app/layout.tsx` - Root layout wrapping both route groups

## Files to Modify
1. `app/(public)/layout.tsx` - Remove HTML structure, keep route-specific wrapper
2. `app/(dashboard)/layout.tsx` - Remove HTML structure, keep Navbar and content
3. `components/Navbar.tsx` - Replace local auth state with useUser hook

## Edge Cases Handled
- Initial loading state prevents flashing unauthenticated UI
- Error handling in onAuthStateChanged callback
- Provider missing error thrown by useUser hook
- Single listener instance prevents memory leaks
- Proper cleanup on unmount with unsubscribe
- Auth state persists across navigations via Firebase session

## TypeScript Types
- Import `User` type from `firebase/auth`
- Define `AuthContextType` interface in AuthContext
- Export types for reuse if needed

## Testing Checklist
After implementation, verify:
- Login flow updates auth state correctly
- Logout flow clears auth state correctly
- Navbar shows/hides logout button based on auth state
- No duplicate auth listeners (check React DevTools)
- Loading state works during initial auth check
- Auth state persists across page navigation
- No console errors or warnings
