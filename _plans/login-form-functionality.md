# Implementation Plan: Login Form Functionality

## Overview
Implement Firebase Authentication login functionality in the existing `AuthForm` component. The form UI already exists and works for signup - we need to add the login logic that mirrors the signup pattern.

## Context
- **Current State**: Login form displays correctly but has a placeholder (`console.log`) instead of actual authentication
- **Signup Pattern**: Already implemented with Firebase `createUserWithEmailAndPassword`, error handling, loading states, and redirect to `/heists`
- **Goal**: Implement login using `signInWithEmailAndPassword` following the same pattern as signup

## User Clarifications
- ❌ No "Forgot Password" link (remove from spec requirements)
- ❌ No automatic redirect for already-authenticated users visiting `/login`
- ❌ No custom auth persistence logic (Firebase handles this by default)

## Implementation Steps

### 1. Update Firebase Auth Import in AuthForm
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/forms/AuthForm.tsx`

- Add `signInWithEmailAndPassword` import from `firebase/auth` (line 6)
- This function takes `(auth, email, password)` parameters, similar to signup

### 2. Implement Login Authentication Logic
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/forms/AuthForm.tsx`

Replace the placeholder block (lines 37-40) with full login implementation:

```typescript
if (isLogin) {
  setIsLoading(true);

  try {
    // Sign in with Firebase
    await signInWithEmailAndPassword(auth, email, password);

    // Navigate to /heists
    router.push("/heists");
  } catch (err) {
    setError(getAuthErrorMessage(err));
    setIsLoading(false);
  }

  return;
}
```

**Key Implementation Details**:
- Set loading state to `true` before authentication
- Call `signInWithEmailAndPassword()` with email and password
- On success: redirect to `/heists` (no codename generation needed for login)
- On error: use existing `getAuthErrorMessage()` utility and set loading to `false`
- Pattern mirrors signup flow but simpler (no profile updates needed)

### 3. Update Error Handling Utility
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/lib/auth.ts`

Add login-specific error codes to `getAuthErrorMessage()` function:

```typescript
case "auth/user-not-found":
  return "No account found with this email address.";
case "auth/wrong-password":
  return "Incorrect password. Please try again.";
case "auth/invalid-credential":
  return "Invalid email or password. Please try again.";
case "auth/user-disabled":
  return "This account has been disabled.";
case "auth/too-many-requests":
  return "Too many failed attempts. Please try again later.";
```

**Note**: Firebase v9+ often returns `auth/invalid-credential` instead of separate user-not-found/wrong-password errors for security reasons.

### 4. Update Loading Button Text
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/forms/AuthForm.tsx`

The button already handles both modes (line 102):
```typescript
{isLoading ? "Signing up..." : isLogin ? "Log In" : "Sign Up"}
```

Update to show proper loading state for login:
```typescript
{isLoading ? (isLogin ? "Logging in..." : "Signing up...") : isLogin ? "Log In" : "Sign Up"}
```

## Testing Checklist

After implementation, test the following scenarios:

1. ✅ **Successful login**: Valid credentials → redirect to `/heists`
2. ✅ **Invalid email**: Shows "Invalid email or password" error
3. ✅ **Invalid password**: Shows "Invalid email or password" error
4. ✅ **Empty fields**: Browser validation prevents submission (HTML5 `required`)
5. ✅ **Loading state**: Button shows "Logging in..." and is disabled during authentication
6. ✅ **Network error**: Shows appropriate error message
7. ✅ **Form reset**: Error clears when user resubmits form
8. ✅ **Enter key**: Form submits when Enter is pressed
9. ✅ **Sign up link**: Clicking "Sign up" navigates to `/signup`

## Files Modified

1. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/forms/AuthForm.tsx` - Add login authentication logic
2. `/Users/shaun/Code/Sandbox/claude-pocket-heist/lib/auth.ts` - Add login-specific error messages

## Implementation Notes

- **No additional validation needed**: Email/password validation is handled by Firebase
- **No profile updates**: Login doesn't need codename generation (that's only for signup)
- **Firebase session persistence**: Firebase automatically persists auth state across refreshes using IndexedDB
- **Error security**: Firebase v9+ doesn't expose whether email exists (returns generic `invalid-credential` error)
- **Keep it simple**: Follow the existing signup pattern - don't over-engineer

## Firebase API Reference

**Function**: `signInWithEmailAndPassword(auth, email, password)`
- Returns: `Promise<UserCredential>`
- Throws: FirebaseError with codes like `auth/invalid-credential`, `auth/user-disabled`, `auth/too-many-requests`
- Automatically persists session to IndexedDB

## Edge Cases Handled

- Multiple rapid submissions: Button is disabled while `isLoading === true`
- Network failures: Caught by try/catch, displayed via `getAuthErrorMessage()`
- Invalid credentials: Generic error message for security (doesn't expose which field is wrong)
- Form state reset: Error clears on next submission (`setError("")` at start of `handleSubmit`)

## Out of Scope (Deferred)

- ❌ Forgot password / password reset functionality
- ❌ Auto-redirect if user is already logged in
- ❌ Remember me checkbox
- ❌ Rate limiting (handled by Firebase)
- ❌ OAuth providers (Google, GitHub, etc.)
- ❌ Custom auth persistence logic
- ❌ Auth state protection middleware
