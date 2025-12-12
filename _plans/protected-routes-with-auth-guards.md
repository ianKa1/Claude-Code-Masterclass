# Implementation Plan: Protected Routes with Auth Guards

## Overview

Implement route protection to ensure:
- Public routes (`/`, `/login`, `/signup`) → only accessible to unauthenticated users
- Dashboard routes (`/heists/*`) → only accessible to authenticated users
- Show branded loader while Firebase determines auth status
- Automatic redirects based on auth state

## Implementation Strategy

Create reusable guard components that wrap the existing `useUser` hook with redirect logic. These guards will be integrated into the route group layouts.

## Step 1: Create AuthLoader Component

**Files to create:**
- `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/AuthLoader.tsx`
- `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/AuthLoader.module.css`

**Implementation:**
- Full-screen centered loading state with dark background
- Animated spinner using purple/pink gradient from theme (matching `#C27AFF` and `#FB64B6`)
- CSS animation for smooth rotation
- Export as default component

**Styling approach:**
- Fixed overlay covering full viewport
- Dark background (`#030712` with slight transparency)
- Centered spinner with gradient border animation
- Similar technique to existing Skeleton shimmer effect

## Step 2: Create PublicRouteGuard Component

**File to create:**
- `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/guards/PublicRouteGuard.tsx`

**Purpose:** Protect public routes from authenticated users

**Logic:**
1. Call `useUser()` to get `{ user, loading, error }`
2. If `loading === true` → render `<AuthLoader />`
3. If `user !== null` → redirect to `/heists` using `router.replace()`
4. If `user === null` → render children (public content)

**Key implementation details:**
- Client component (`"use client"`)
- Use `useRouter()` from `next/navigation`
- Use `useEffect` to handle redirects
- Use `useRef` to track redirect state and prevent loops
- Error state treated as "not authenticated" (silent handling per user preference)
- Use `router.replace()` to avoid back-button issues

**Code pattern:**
```tsx
"use client"

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/AuthContext'
import AuthLoader from '@/components/ui/AuthLoader'

export default function PublicRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!loading && user && !hasRedirected.current) {
      hasRedirected.current = true
      router.replace('/heists')
    }
  }, [user, loading, router])

  if (loading) return <AuthLoader />
  if (user) return <AuthLoader />

  return <>{children}</>
}
```

## Step 3: Create ProtectedRouteGuard Component

**File to create:**
- `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/guards/ProtectedRouteGuard.tsx`

**Purpose:** Protect dashboard routes from unauthenticated users

**Logic:**
1. Call `useUser()` to get `{ user, loading, error }`
2. If `loading === true` → render `<AuthLoader />`
3. If `user === null` → redirect to `/login` using `router.replace()`
4. If `user !== null` → render children (protected content)

**Key implementation details:**
- Mirror structure of `PublicRouteGuard` for consistency
- Redirect unauthenticated users to `/login`
- Same redirect prevention strategy with `useRef`

**Code pattern:**
```tsx
"use client"

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/AuthContext'
import AuthLoader from '@/components/ui/AuthLoader'

export default function ProtectedRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (!loading && !user && !hasRedirected.current) {
      hasRedirected.current = true
      router.replace('/login')
    }
  }, [user, loading, router])

  if (loading) return <AuthLoader />
  if (!user) return <AuthLoader />

  return <>{children}</>
}
```

## Step 4: Update Public Layout

**File to modify:**
- `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(public)/layout.tsx`

**Changes:**
1. Add `"use client"` directive at top
2. Import `PublicRouteGuard`
3. Wrap children with the guard
4. Remove semicolons to match project conventions

**Updated code:**
```tsx
"use client"

import PublicRouteGuard from '@/components/guards/PublicRouteGuard'

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PublicRouteGuard>
      <div className="public">
        <main>{children}</main>
      </div>
    </PublicRouteGuard>
  )
}
```

## Step 5: Update Dashboard Layout

**File to modify:**
- `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(dashboard)/layout.tsx`

**Changes:**
1. Add `"use client"` directive at top
2. Import `ProtectedRouteGuard`
3. Wrap entire layout (including Navbar) with the guard
4. Remove semicolons to match project conventions

**Updated code:**
```tsx
"use client"

import Navbar from "@/components/Navbar"
import ProtectedRouteGuard from '@/components/guards/ProtectedRouteGuard'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedRouteGuard>
      <Navbar />
      <main>{children}</main>
    </ProtectedRouteGuard>
  )
}
```

## Edge Cases Handled

1. **Infinite redirect loops:** `hasRedirected` ref prevents multiple redirects in same lifecycle
2. **Slow auth initialization:** Loader shows while `loading === true`
3. **Manual URL navigation:** Guards run on every route, including direct access
4. **Race conditions:** `useEffect` dependency array ensures redirects on auth state changes
5. **Auth errors:** Treated as "not authenticated" per user preference

## Redirect Flows

**Login flow:**
- User on `/login` → submits form → Firebase updates user → guard detects auth → redirects to `/heists`

**Logout flow:**
- User on `/heists` → clicks logout → Firebase clears user → guard detects no auth → redirects to `/login`

**Direct URL access (authenticated):**
- User types `/login` → guard detects auth → redirects to `/heists`

**Direct URL access (unauthenticated):**
- User types `/heists` → guard detects no auth → redirects to `/login`

## Testing Checklist

After implementation, manually test:
1. ✓ Unauthenticated user visits `/` → sees splash page
2. ✓ Unauthenticated user visits `/login` → sees login form
3. ✓ Unauthenticated user visits `/heists` → redirected to `/login`
4. ✓ Authenticated user visits `/heists` → sees dashboard
5. ✓ Authenticated user visits `/login` → redirected to `/heists`
6. ✓ User logs in from `/login` → redirected to `/heists`
7. ✓ User logs out from `/heists` → redirected to `/login`
8. ✓ Branded loader appears briefly during auth check
9. ✓ No content flashing before redirects
10. ✓ Direct URL navigation enforces guards

## Critical Files

**New files to create:**
- `components/ui/AuthLoader.tsx` - Branded loading component
- `components/ui/AuthLoader.module.css` - Loader styles with gradient animation
- `components/guards/PublicRouteGuard.tsx` - Guards public routes
- `components/guards/ProtectedRouteGuard.tsx` - Guards dashboard routes

**Files to modify:**
- `app/(public)/layout.tsx` - Add PublicRouteGuard wrapper
- `app/(dashboard)/layout.tsx` - Add ProtectedRouteGuard wrapper

## Implementation Order

1. AuthLoader component (foundation for guards)
2. PublicRouteGuard component
3. ProtectedRouteGuard component
4. Update public layout
5. Update dashboard layout
6. Manual testing of all flows
