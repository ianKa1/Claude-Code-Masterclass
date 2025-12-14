# Implementation Plan: Create Heist Form

## Overview
Implement a functional form on `/heists/create` that allows users to create new heist documents in Firestore. The form collects heist details, validates input, creates a document in the `heists` collection, shows an inline success message, and redirects to `/heists`.

## Files to Create

### 1. UI Components (following Input.tsx pattern)

**`/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/Textarea.tsx`**
- Props: `name`, `label`, `placeholder?`, `required?`, `value?`, `onChange?`, `rows?`
- Structure: wrapper div with label + textarea element
- CSS module: `Textarea.module.css`

**`/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/Textarea.module.css`**
- Copy Input.module.css structure (.field, .label, .textarea)
- Add: `min-height: 120px`, `resize: vertical`, `font-family: inherit`

**`/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/Select.tsx`**
- Props: `name`, `label`, `required?`, `value?`, `onChange?`, `children` (React.ReactNode for options)
- Structure: wrapper div with label + select element + children
- CSS module: `Select.module.css`

**`/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/Select.module.css`**
- Copy Input.module.css structure (.field, .label, .select)
- Add: `cursor: pointer`, option styling with background color

### 2. Form Component

**`/Users/shaun/Code/Sandbox/claude-pocket-heist/components/forms/HeistForm.tsx`**
- Client component ("use client")
- State: title, description, selectedUserId, users, isLoading, isLoadingUsers, error, success
- Hooks: useRouter, useUser
- Fetch users in useEffect on mount, filter out current user
- Handle form submission with validation, Firestore write, success message, and redirect

**`/Users/shaun/Code/Sandbox/claude-pocket-heist/components/forms/HeistForm.module.css`**
- Copy AuthForm.module.css pattern
- Add .error and .success classes for inline messages

## File to Modify

**`/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(dashboard)/heists/create/page.tsx`**
- Import and render HeistForm component
- Keep existing page structure

## Implementation Steps

### Step 1: Create Textarea Component
```tsx
// Textarea.tsx - Follow Input.tsx pattern
type TextareaProps = {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
}

// Structure: div > label + textarea
// Use CSS module with .field, .label, .textarea classes
```

### Step 2: Create Select Component
```tsx
// Select.tsx - Follow Input.tsx pattern
type SelectProps = {
  name: string
  label: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
}

// Structure: div > label + select
// Children = option elements passed from parent
```

### Step 3: Create HeistForm Component

**State Management:**
```tsx
const [title, setTitle] = useState("")
const [description, setDescription] = useState("")
const [selectedUserId, setSelectedUserId] = useState("")
const [users, setUsers] = useState<{ id: string; codename: string }[]>([])
const [isLoading, setIsLoading] = useState(false)
const [isLoadingUsers, setIsLoadingUsers] = useState(true)
const [error, setError] = useState("")
const [success, setSuccess] = useState(false)

const router = useRouter()
const { user } = useUser()
```

**User Fetching (useEffect):**
```tsx
useEffect(() => {
  const fetchUsers = async () => {
    if (!user?.uid) return

    setIsLoadingUsers(true)
    try {
      const usersRef = collection(db, COLLECTIONS.USERS)
      const snapshot = await getDocs(usersRef)

      const usersList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          codename: doc.data().codename as string
        }))
        .filter(u => u.id !== user.uid) // Filter out current user

      setUsers(usersList)
    } catch (err) {
      setError("Failed to load users. Please refresh the page.")
    } finally {
      setIsLoadingUsers(false)
    }
  }

  fetchUsers()
}, [user?.uid])
```

**Form Submission Flow:**
```tsx
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setError("")
  setSuccess(false)

  // 1. Validate fields
  if (!title.trim() || !description.trim() || !selectedUserId) {
    setError("Please fill in all required fields")
    return
  }

  // 2. Find selected user's codename
  const selectedUser = users.find(u => u.id === selectedUserId)
  if (!selectedUser) {
    setError("Selected user not found")
    return
  }

  // 3. Check authentication
  if (!user?.uid || !user?.displayName) {
    setError("You must be logged in to create a heist")
    return
  }

  setIsLoading(true)

  try {
    // 4. Calculate deadline (48 hours from now)
    const deadline = new Date()
    deadline.setHours(deadline.getHours() + 48)

    // 5. Create heist input
    const heistInput: CreateHeistInput = {
      title: title.trim(),
      description: description.trim(),
      createdBy: user.uid,
      createdByCodename: user.displayName,
      createdFor: selectedUserId,
      createdForCodename: selectedUser.codename,
      createdAt: serverTimestamp(),
      deadline: deadline,
      isActive: true,
      finalStatus: null
    }

    // 6. Submit to Firestore
    const heistsRef = collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter)
    await addDoc(heistsRef, heistInput)

    // 7. Show success and redirect
    setSuccess(true)
    setTimeout(() => {
      router.push("/heists")
    }, 1500)

  } catch (err) {
    console.error("Error creating heist:", err)
    setError("Failed to create heist. Please try again.")
    setIsLoading(false)
  }
}
```

**Form JSX:**
```tsx
<form onSubmit={handleSubmit} className={styles.form}>
  <Input
    type="text"
    name="title"
    label="Title"
    placeholder="e.g., Steal the stapler"
    required
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />

  <Textarea
    name="description"
    label="Description"
    placeholder="Describe the heist mission..."
    required
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    rows={4}
  />

  <Select
    name="assignTo"
    label="Assign To"
    required
    value={selectedUserId}
    onChange={(e) => setSelectedUserId(e.target.value)}
  >
    <option value="">
      {isLoadingUsers ? "Loading users..." : "Select a user..."}
    </option>
    {users.map(user => (
      <option key={user.id} value={user.id}>
        {user.codename}
      </option>
    ))}
  </Select>

  {error && <p className={styles.error}>{error}</p>}
  {success && <p className={styles.success}>Heist created successfully! Redirecting...</p>}

  <button
    type="submit"
    className="btn"
    disabled={isLoading || isLoadingUsers || users.length === 0}
  >
    {isLoading ? "Creating Heist..." : "Create Heist"}
  </button>
</form>
```

**Imports:**
```tsx
import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { COLLECTIONS, CreateHeistInput, heistConverter } from "@/types/firestore"
import { useUser } from "@/context/AuthContext"
import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/Textarea"
import Select from "@/components/ui/Select"
import styles from "./HeistForm.module.css"
```

### Step 4: Update Create Page
```tsx
// app/(dashboard)/heists/create/page.tsx
import HeistForm from "@/components/forms/HeistForm"

export default function CreateHeistPage() {
  return (
    <div className="page-content">
      <h2>Create a New Heist</h2>
      <HeistForm />
    </div>
  )
}
```

## Key Patterns to Follow

1. **Component Structure**: Follow Input.tsx pattern for Textarea and Select
2. **CSS Modules**: Use same structure as Input.module.css with .field, .label, and element-specific class
3. **Form Pattern**: Follow AuthForm.tsx for state management, error handling, and async submission
4. **Firestore Operations**: Use `collection().withConverter()` for type-safe operations
5. **User Fetching**: Filter current user from list using `filter(u => u.id !== user.uid)`
6. **Validation**: Check fields before submission, verify user authentication
7. **Success Flow**: Set success state, show message, delay redirect with setTimeout
8. **Error Handling**: Inline error display, allow retry by resetting isLoading

## Critical Files Reference

- **Pattern reference**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/Input.tsx`
- **Form pattern**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/forms/AuthForm.tsx`
- **Types**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/types/firestore/heist.ts`
- **Firestore config**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/lib/firebase.ts`
- **Auth context**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/context/AuthContext.tsx`

## Edge Cases Handled

- No users available → disable submit button
- User's displayName is null → error message
- Network failure during submission → error message, allow retry
- Selected user not found → validation error
- Empty form fields → validation prevents submission
