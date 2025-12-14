# Spec for Create Heist Form

branch: claude/feature/create-heist-form

## Summary

Implement a functional form on the `/heists/create` page that allows authenticated users to create new heist documents in Firestore. The form should collect heist details, validate input, create a new document in the `heists` collection, and redirect to `/heists` upon successful creation.

## Functional Requirements

- Display a form with the following fields:
  - **Title** (text input, required) - The heist mission title
  - **Description** (textarea, required) - Details about the heist mission
  - **Assign To** (select/dropdown, required) - Select a user to assign the heist to (createdFor)
- Auto-populate hidden fields:
  - `createdBy` - Current user's UID from auth context
  - `createdByCodename` - Current user's displayName from auth context
  - `createdForCodename` - Selected user's codename/displayName
  - `createdAt` - serverTimestamp()
  - `deadline` - Date set to 48 hours from creation time
  - `isActive` - true (heists start active)
  - `finalStatus` - null (no status until completed)
- Validate all required fields before submission
- Display loading state during form submission
- Display error messages if submission fails
- On successful creation:
  - Add document to Firestore `heists` collection using `CreateHeistInput` type
  - Use `heistConverter` for proper type conversion
  - Redirect user to `/heists` page
- Form should be styled consistently with existing app design (dark theme, purple/pink accents)

## Possible Edge Cases

- User attempts to submit with empty required fields
- User navigates away during form submission
- Firestore write fails due to permissions or network issues
- No users available to assign heist to (user list is empty)
- Current user tries to assign heist to themselves
- User's displayName is null or undefined in auth context
- Deadline calculation results in invalid date

## Acceptance Criteria

- Form renders with all required fields visible
- Required field validation prevents submission if fields are empty
- User can select another user from a dropdown/select to assign the heist to
- Form shows loading state (disabled inputs, loading button text) during submission
- Error messages display clearly when validation or submission fails
- Successful submission creates a document in Firestore `heists` collection with all required fields
- Document uses proper TypeScript types (`CreateHeistInput`, `heistConverter`)
- User is redirected to `/heists` after successful creation
- Form follows app styling conventions (Tailwind classes, dark theme, purple/pink accents)
- Console logs confirm document creation during development

## Open Questions

- Should the user be able to assign a heist to themselves, or only to other users? No, not themselves - they need to be filtered out of the list.
- Should we fetch the list of users from Firestore `users` collection, or use a hardcoded list initially? Fetch the list from the 'users' collection.
- Do we need to validate that the selected user exists before creating the heist? No - the user should exist because we fetch a list of them from firestore.
- Should there be a "Cancel" button that navigates back to `/heists`? No.
- Should we show a success toast/message before redirecting, or just redirect immediately? Yes, show a success notification and then redirect.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Form renders with all expected fields
- Required field validation prevents submission
- Successful form submission creates Firestore document with correct data structure
- Form displays error message when Firestore write fails
- Redirect to `/heists` occurs after successful submission
- Loading state activates during submission
- Deadline is correctly calculated as 48 hours from creation

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
