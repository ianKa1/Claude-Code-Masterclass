# Firebase Auth Signup Integration Plan

## Overview
Integrate Firebase Authentication with the signup form, automatically generate random codenames for new users, and redirect to `/heists` after successful signup.

## Implementation Steps

### 1. Create Codename Generation Utility
**File:** `lib/codename.ts` (NEW)

Create a utility that generates random PascalCase codenames by combining three words:
- **Adjectives:** Swift, Bold, Clever, Silent, Fierce, Nimble, Sly, Daring, Cunning, Stealthy, Quick, Smooth, Sharp, Wise, Slick, Ghost, Shadow, Phantom, Rogue, Midnight
- **Colors:** Silver, Golden, Crimson, Violet, Azure, Emerald, Obsidian, Ruby, Sapphire, Onyx, Copper, Bronze, Jade, Pearl, Amber, Scarlet, Indigo, Ivory, Ebony, Steel
- **Objects:** Phantom, Viper, Raven, Fox, Wolf, Hawk, Dragon, Tiger, Falcon, Panther, Cobra, Eagle, Lynx, Jaguar, Leopard, Shadow, Specter, Whisper, Echo, Cipher

```typescript
export function generateCodename(): string
```

Picks one random word from each set and combines them (e.g., "SwiftSilverPhantom").

### 2. Create Auth Utilities
**File:** `lib/auth.ts` (NEW)

**Error Message Mapper:**
```typescript
export function getAuthErrorMessage(error: unknown): string
```
Maps Firebase error codes to user-friendly messages:
- `auth/email-already-in-use` → "This email is already registered. Try logging in instead."
- `auth/invalid-email` → "Please enter a valid email address."
- `auth/weak-password` → "Password should be at least 6 characters."
- `auth/network-request-failed` → "Network error. Please check your connection and try again."
- Default → "Something went wrong. Please try again."

**Profile Update with Retry:**
```typescript
export async function updateUserProfile(
  user: User,
  displayName: string,
  maxRetries: number = 3
): Promise<void>
```
Updates user profile with exponential backoff retry logic (500ms, 1000ms, 2000ms delays) per spec requirement.

### 3. Modify AuthForm Component
**File:** `components/forms/AuthForm.tsx` (MODIFY)

**Add State:**
```typescript
const [isLoading, setIsLoading] = useState(false)
```

**Add Imports:**
```typescript
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { generateCodename } from "@/lib/codename"
import { updateUserProfile, getAuthErrorMessage } from "@/lib/auth"
```

**Update handleSubmit for Signup Mode:**
```typescript
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setError("")

  if (!isLogin && password !== confirmPassword) {
    setError("Passwords do not match")
    return
  }

  if (isLogin) {
    console.log("Form submitted:", { email, password })
    return
  }

  // SIGNUP FLOW
  setIsLoading(true)

  try {
    // 1. Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // 2. Generate codename
    const codename = generateCodename()

    // 3. Update profile with retry
    await updateUserProfile(userCredential.user, codename)

    // 4. Navigate to /heists
    router.push("/heists")
  } catch (err) {
    setError(getAuthErrorMessage(err))
    setIsLoading(false)
  }
}
```

**Update Button:**
```jsx
<button
  type="submit"
  className="btn"
  disabled={isLoading}
>
  {isLoading ? "Signing up..." : (isLogin ? "Log In" : "Sign Up")}
</button>
```

**Disable All Inputs During Loading:**
Add `disabled={isLoading}` prop to all Input and PasswordInput components.

### 4. Update Styles
**File:** `components/forms/AuthForm.module.css` (MODIFY)

Add disabled button styling:
```css
.form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## Critical Files

1. **`lib/codename.ts`** - NEW - Codename generation logic
2. **`lib/auth.ts`** - NEW - Auth utilities and retry logic
3. **`components/forms/AuthForm.tsx`** - MODIFY - Main signup integration
4. **`components/forms/AuthForm.module.css`** - MODIFY - Loading state styles
5. **`lib/firebase.ts`** - REFERENCE ONLY - Already has auth export

## Error Handling Strategy

1. **Client-side validation** - Password mismatch (existing, preserved)
2. **Firebase Auth errors** - Mapped to friendly messages via `getAuthErrorMessage`
3. **Profile update failures** - Automatic retry with exponential backoff (3 attempts)
4. **Loading state** - Prevents duplicate submissions, disabled inputs/button

## Testing Approach

Create test files in `./tests`:
- `codename.test.ts` - Verify PascalCase format and randomness
- `auth.test.ts` - Test error mapping and retry logic
- `AuthForm.test.tsx` - Integration tests with mocked Firebase

## Key Decisions

- **Separate utility files** for testability and reusability
- **3 retries with exponential backoff** for profile updates (balances reliability vs UX)
- **Simple loading state** (boolean) - disable all form elements
- **~6000 unique codename combinations** (20 words per set)
- **Retry on profile update failure** per spec requirement
- **Next.js App Router** navigation via `next/navigation` (not `next/router`)

## Expected User Flow

1. User fills signup form (email, password, confirm password)
2. Clicks "Sign Up" button
3. Button shows "Signing up..." and form disables
4. Firebase creates user account
5. Random codename generated and set as displayName (with retry)
6. User redirected to `/heists`
7. On error: friendly message shown, form re-enabled
