# Spec for create-heist-form

branch: claude/feature/create-heist-form

## Summary

A form on the `/heists/create` page that allows authenticated users to create new heist missions. The form collects heist details (title, description, assignee), creates a Firestore document in the `heists` collection, and redirects to `/heists` on success.

## Functional Requirements

- Form fields:
  - **Title** (text input, required) — the heist mission name
  - **Description** (textarea, required) — mission details and objectives
  - **Assign To** (select/dropdown, required) — choose from available users by codename
- Fetch all users from Firestore `users` collection to populate assignee dropdown
- On submit:
  - Validate all required fields
  - Get current user's uid and codename from auth context
  - Set `createdBy` to current user's uid
  - Set `createdByCodename` to current user's codename
  - Set `assignedTo` to selected user's uid
  - Set `assignedToCodename` to selected user's codename
  - Set `createdAt` to `serverTimestamp()`
  - Set `deadline` to 48 hours from now (JavaScript Date object)
  - Set `finalStatus` to `null`
  - Write document to Firestore `heists` collection using `addDoc`
  - Redirect to `/heists` on success
- Display error messages for:
  - Validation failures (empty required fields)
  - Firestore write errors
  - User fetch errors
- Show loading state during:
  - Initial user list fetch
  - Form submission

## Possible Edge Cases

- User list is empty (no other users to assign to)
- Current user tries to assign heist to themselves (allow or prevent?)
- Firestore write fails due to permissions or network issues
- User navigates away during submission
- Assignee user is deleted between fetch and submission
- Form inputs contain special characters or very long text

## Acceptance Criteria

- Form renders with title input, description textarea, and assignee dropdown
- Assignee dropdown shows all users by codename (fetched from Firestore)
- Submit button is disabled during submission
- On successful submission, new heist document appears in Firestore `heists` collection
- User is redirected to `/heists` after successful creation
- Error messages display clearly for validation and Firestore errors
- Loading spinner shows while fetching users and during submission
- `createdAt` and `deadline` are set programmatically (not user inputs)
- All `CreateHeistInput` interface fields are populated correctly

## Open Questions

- Should users be able to assign heists to themselves? No
- Should the assignee list include the current user or exclude them? Exclude.
- What happens if no other users exist yet (show message or disable form)? Show message and disable form
- Should we validate title/description length (min/max characters)? Set maximum length as 20 characters.
- Should there be a "cancel" button that navigates back to `/heists`? Yes

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Form renders all input fields and submit button
- Fetches users from Firestore on mount
- Displays user codenames in assignee dropdown
- Shows validation errors for empty required fields
- Calls Firestore `addDoc` with correct `CreateHeistInput` structure
- Sets `createdAt` as serverTimestamp and `deadline` as Date 48 hours from now
- Redirects to `/heists` after successful submission
- Displays error message when Firestore write fails
- Shows loading state during user fetch and form submission
