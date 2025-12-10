# Spec for Firebase Auth Signup Integration

branch: claude/feature/firebase-auth-signup-integration
figma_component (if used): N/A

## Summary

Integrate the signup form in `app/(public)/signup/page.tsx` with Firebase Authentication using the exports from `lib/firebase.ts`. Upon successful user creation, set the user's `displayName` to a randomly generated codename created by combining three words from different word sets in PascalCase format. After successful signup and profile update, redirect the user to `/heists`.

## Functional Requirements

- Connect the `AuthForm` component (when `mode="signup"`) to Firebase Auth's `createUserWithEmailAndPassword` function
- Use the `auth` export from `lib/firebase.ts` (Firebase Web SDK v9+ modular API)
- After successful authentication:
  - Generate a random codename by selecting one word from each of three predefined word sets and combining them in PascalCase (e.g., "SwiftSilverPhantom", "BoldIronRunner")
  - Use `updateProfile` to set the user's `displayName` to the generated codename
- Redirect to `/heists` using Next.js `useRouter` after successful completion
- Handle and display errors appropriately (auth errors, profile update errors, network errors)
- Maintain existing password confirmation validation
- Show loading state during async operations
- Only use Firebase Web SDK v9+ modular syntax

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- User already exists (Firebase Auth error code: `auth/email-already-in-use`)
- Weak password (Firebase Auth error code: `auth/weak-password`)
- Invalid email format (Firebase Auth error code: `auth/invalid-email`)
- Network failure during auth or profile update
- Auth succeeds but profile update fails (user is authenticated but no displayName)
- User navigates away or closes tab during signup process
- Random codename generation produces duplicates (acceptable for displayName, no uniqueness constraint needed)

## Acceptance Criteria

- User can successfully sign up with email and password
- Upon signup, the user's `displayName` is automatically set to a randomly generated PascalCase codename
- Codename consists of three words from different word sets combined in PascalCase
- User is automatically redirected to `/heists` after successful signup and profile update
- Appropriate error messages are displayed for auth failures and profile update failures
- Form shows loading state during signup process (disabled button, loading indicator)
- Passwords must match before submission (existing validation maintained)
- Only Firebase Web SDK v9+ modular syntax is used

## Open Questions

- What are the three word sets for codename generation? (e.g., adjectives + animals + verbs, or colors + objects + actions): AdjectiveColorObject
- Should we handle the case where auth succeeds but profile update fails? (retry, leave without displayName, or show error): retry.
- Should we add any error tracking or analytics for signup failures?: no.

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Successful signup flow: creates auth user and sets displayName
- Password mismatch validation prevents submission
- Firebase Auth errors are caught and displayed (email-already-in-use, weak-password)
- Codename generation produces valid PascalCase format with three words
- Profile update is called after successful authentication
- Redirect to `/heists` occurs after successful signup and profile update
- Form shows loading state during async operations
- Error state resets on subsequent form submissions

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
