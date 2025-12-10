# Spec for Authentication Forms

branch: claude/feature/authentication-forms
figma_component (if used): N/A

## Summary
Create login and signup forms for the `/login` and `/signup` pages. Both forms share similar structure with email and password fields, a toggle to show/hide the password, and a submit button. For now, form submission logs the entered details to the console. Users should be able to navigate between the two forms.

## Functional Requirements
- Email input field with appropriate validation (email format)
- Password input field with show/hide toggle icon
- Submit button labeled "Log In" on login page and "Sign Up" on signup page
- On submit, log form data (email, password) to the console
- Link to switch between forms ("Don't have an account? Sign up" / "Already have an account? Log in")
- Basic client-side validation (required fields, email format)
- Use existing `.btn` class for submit button styling

## Figma Design Reference (only if referenced)
N/A - No Figma design provided

## Possible Edge Cases
- Empty form submission (show validation errors)
- Invalid email format
- Password field toggle state persists correctly when typing
- Form state resets when switching between login/signup

## Acceptance Criteria
- [ ] Login page (`/login`) displays email field, password field with visibility toggle, and "Log In" button
- [ ] Signup page (`/signup`) displays email field, password field with visibility toggle, and "Sign Up" button
- [ ] Password visibility toggle shows/hides password text and updates icon accordingly
- [ ] Form submission logs `{ email, password }` to console
- [ ] Link to navigate between login and signup pages is visible and functional
- [ ] Basic validation prevents submission of empty or invalid fields
- [ ] Forms use project theme colors and styling conventions

## Open Questions
- Should there be a "Confirm Password" field on the signup form?
- Any specific password requirements (min length, complexity) for signup?

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Form renders with all required fields (email, password, submit button)
- Password visibility toggle changes input type between "password" and "text"
- Form submission is prevented when fields are empty
- Form submission is prevented when email format is invalid
- Console log is called with correct data on valid submission
- Navigation links render and point to correct routes

## Checking Documentation
Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
