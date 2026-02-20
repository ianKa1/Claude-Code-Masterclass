# Plan: Create Heist Form

## Context

The `/heists/create` page currently shows only a title. This feature implements a full form allowing authenticated users to create new heist missions. Users can assign heists to other agents (excluding themselves), set title/description with validation, and automatically calculate a 48-hour deadline. After successful creation, the user is redirected to `/heists`.

**Key constraints from spec:**
- Title max 20 chars, description max 200 chars
- Fetch users from Firestore, exclude current user from assignee dropdown
- Show message and disable form if no other users exist
- Include cancel button to navigate back to `/heists`
- Use `CreateHeistInput` interface with `serverTimestamp()` for `createdAt` and `Date` object for `deadline`

**Pattern sources:** `/login` and `/signup` pages for form structure, validation, error handling, and loading states.

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `lib/firebase/fetchUsers.ts` | Create | Fetch all users from Firestore `users` collection |
| `lib/firebase/createHeist.ts` | Create | Write new heist document to Firestore `heists` collection |
| `app/(dashboard)/heists/create/CreateHeist.module.css` | Create | Form styles (reuse login/signup patterns) |
| `app/(dashboard)/heists/create/page.tsx` | Modify | Full form implementation with validation and submission |
| `tests/lib/fetchUsers.test.ts` | Create | Unit tests for fetchUsers function |
| `tests/lib/createHeist.test.ts` | Create | Unit tests for createHeist function |
| `tests/pages/create-heist.test.tsx` | Create | Component tests (15 test cases) |

---

## Build Order

1. `lib/firebase/fetchUsers.ts`
2. `lib/firebase/createHeist.ts`
3. `app/(dashboard)/heists/create/CreateHeist.module.css`
4. `app/(dashboard)/heists/create/page.tsx`
5. `tests/lib/fetchUsers.test.ts`
6. `tests/lib/createHeist.test.ts`
7. `tests/pages/create-heist.test.tsx`
8. Verification: lint + build + test pass

---

## Implementation Details

### 1. `lib/firebase/fetchUsers.ts`

```typescript
import { collection, getDocs } from "firebase/firestore"
import { db } from "./config"
import type { UserDoc } from "@/types/firestore/user"

export async function fetchUsers(): Promise<UserDoc[]> {
  const snapshot = await getDocs(collection(db, "users"))
  return snapshot.docs.map(doc => ({
    id: doc.id,
    codename: doc.data().codename
  }))
}
```

**Notes:**
- Returns empty array if no users
- Errors propagate to caller

---

### 2. `lib/firebase/createHeist.ts`

```typescript
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "./config"
import type { CreateHeistInput } from "@/types/firestore/heist"

export async function createHeist(input: CreateHeistInput): Promise<string> {
  const docRef = await addDoc(collection(db, "heists"), input)
  return docRef.id
}
```

**Notes:**
- Caller constructs full `CreateHeistInput` (including `serverTimestamp()` for `createdAt`)
- Returns generated document ID
- Follows pattern from `signUpUser`, `loginUser`

---

### 3. `app/(dashboard)/heists/create/CreateHeist.module.css`

**Reference path:** `@reference "../../../globals.css"`

**Classes needed:**
- `.form` — flex column, gap-4, max-w-sm, centered
- `.inputGroup` — flex column, gap-1
- `.label` — text-body, text-sm
- `.input` — styled input with focus border-primary
- `.textarea` — same as input + resize-none + min-height 100px
- `.select` — same as input + cursor-pointer
- `.errorText` — text-error, text-sm
- `.warningText` — text-body, text-sm, centered, italic
- `.buttonGroup` — flex, gap-3
- `.submitBtn` — primary bg, hover secondary, disabled opacity 0.5
- `.cancelBtn` — transparent bg, border lighter, hover bg light
- `.spinner` — inline-block, w-4 h-4, animate-spin

**Pattern:** Reuse login/signup form styles with additions for textarea, select, button group, and warning text.

---

### 4. `app/(dashboard)/heists/create/page.tsx`

**Directive:** `"use client"`

**Imports:**
```typescript
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { serverTimestamp } from "firebase/firestore"
import { useUser } from "@/lib/firebase/auth-context"
import { fetchUsers } from "@/lib/firebase/fetchUsers"
import { createHeist } from "@/lib/firebase/createHeist"
import type { UserDoc } from "@/types/firestore/user"
import type { CreateHeistInput } from "@/types/firestore/heist"
import styles from "./CreateHeist.module.css"
```

**State variables:**
- Form fields: `title`, `description`, `assignedToUid`
- Validation errors: `titleError`, `descriptionError`, `assignedToError`
- Firebase error: `firebaseError`
- Loading states: `isLoadingUsers`, `isSubmitting`
- Users list: `users: UserDoc[]`

**Hooks:**
- `useRouter()` — for navigation
- `useUser()` — get current user (uid, displayName)

**useEffect:** Fetch users on mount when `!authLoading && user`, filter out current user via `allUsers.filter(u => u.id !== user.uid)`, handle errors

**Validation functions:**
- `validateTitle(value)` — required, max 20 chars
- `validateDescription(value)` — required, max 200 chars
- `validateAssignedTo(value)` — required (not empty string)

**handleSubmit:**
1. Validate all fields
2. Find selected user's codename
3. Calculate deadline: `new Date()` then `setHours(getHours() + 48)`
4. Construct `CreateHeistInput`:
   ```typescript
   {
     title: title.trim(),
     description: description.trim(),
     createdBy: user.uid,
     createdByCodename: user.displayName ?? "Unknown",
     assignedTo: assignedToUid,
     assignedToCodename: selectedUser.codename,
     deadline,
     finalStatus: null,
     createdAt: serverTimestamp(),
   }
   ```
5. Call `createHeist(heistInput)`
6. Redirect to `/heists` on success
7. Show error on failure

**handleCancel:** `router.push("/heists")`

**JSX structure:**
- Show "Loading agents..." while `isLoadingUsers`
- Show "No other agents available" message if `users.length === 0` (don't render form)
- Otherwise render form with:
  - Title input (text, maxLength 20)
  - Description textarea (maxLength 200)
  - Assign To select (dropdown with users by codename)
  - Error displays for each field + firebaseError
  - Cancel button (`type="button"`) + Submit button
  - Loading spinner in submit button during submission

---

## Testing Strategy

### 5. `tests/lib/fetchUsers.test.ts`

**Mocks:** `getDocs`, `@/lib/firebase/config`

**Test cases:**
1. Returns array of UserDoc when users exist
2. Returns empty array when no users
3. Propagates error when Firestore fails

---

### 6. `tests/lib/createHeist.test.ts`

**Mocks:** `addDoc`, `serverTimestamp`, `@/lib/firebase/config`

**Test cases:**
1. Calls addDoc with correct input and returns document ID
2. Propagates error when Firestore write fails

---

### 7. `tests/pages/create-heist.test.tsx`

**Mocks (use `vi.hoisted`):**
- `mockFetchUsers`, `mockCreateHeist`, `mockRouterPush`, `mockUser`
- Mock modules: `@/lib/firebase/fetchUsers`, `@/lib/firebase/createHeist`, `next/navigation`, `@/lib/firebase/auth-context`, `firebase/firestore` (serverTimestamp)

**15 test cases:**
1. Renders form with all input fields
2. Fetches users from Firestore on mount
3. Displays user codenames in assignee dropdown
4. Excludes current user from assignee dropdown
5. Shows message when no other users exist
6. Shows validation errors for empty required fields
7. Shows error for title exceeding 20 characters
8. Shows error for description exceeding 200 characters
9. Calls createHeist with correct CreateHeistInput structure
10. Sets deadline to 48 hours from now
11. Redirects to /heists after successful submission
12. Displays error message when Firestore write fails
13. Shows loading state during user fetch
14. Shows loading spinner during form submission
15. Navigates to /heists when cancel button clicked

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| No other users exist | Show "No other agents available" message, don't render form |
| Current user in fetched list | Filter out via `users.filter(u => u.id !== user.uid)` |
| Empty fields submitted | Validation functions catch, show error messages |
| Title/description too long | Client validation + `maxLength` attribute |
| No assignee selected | Validation catches empty string |
| fetchUsers fails | Catch in useEffect, show firebaseError |
| createHeist fails | Catch in handleSubmit, show firebaseError |
| Auth loading state | Don't fetch users until `authLoading === false && user !== null` |

---

## Verification

1. **Unit tests:**
   ```bash
   npx vitest run tests/lib/fetchUsers.test.ts
   npx vitest run tests/lib/createHeist.test.ts
   ```

2. **Component tests:**
   ```bash
   npx vitest run tests/pages/create-heist.test.tsx
   ```

3. **Full test suite:**
   ```bash
   npx vitest run
   ```

4. **Build:**
   ```bash
   npm run build
   ```

5. **Lint:**
   ```bash
   npm run lint
   ```

6. **Manual testing:**
   - Navigate to `/heists/create` while logged in
   - Verify assignee dropdown excludes current user
   - Submit empty form → see validation errors
   - Enter title > 20 chars → see error on blur
   - Fill valid form → submit → redirects to `/heists`
   - Check Firebase Console → new heist in `heists` collection with correct fields
   - Verify `createdAt` is Timestamp, `deadline` is Timestamp 48h from creation
   - Click cancel → returns to `/heists`

---

## Critical Files Reference

- `/Users/kaimao/Desktop/Claude_code_course/Claude-Code-Masterclass/app/(dashboard)/heists/create/page.tsx` — Main form component
- `/Users/kaimao/Desktop/Claude_code_course/Claude-Code-Masterclass/lib/firebase/createHeist.ts` — Firestore write operation
- `/Users/kaimao/Desktop/Claude_code_course/Claude-Code-Masterclass/lib/firebase/fetchUsers.ts` — Firestore read for users
- `/Users/kaimao/Desktop/Claude_code_course/Claude-Code-Masterclass/types/firestore/heist.ts` — CreateHeistInput interface (already exists)
- `/Users/kaimao/Desktop/Claude_code_course/Claude-Code-Masterclass/app/(public)/login/page.tsx` — Form pattern reference
