# Spec for Login Form Functionality

branch: claude/feature/login-form-functionality

## Summary

Implement a fully functional login form that authenticates users with Firebase Authentication using email and password credentials. Upon successful authentication, users should be automatically redirected to the `/heists` dashboard page. The login form should provide clear feedback for validation errors and authentication failures.

## Functional Requirements

- Display a login form with email and password input fields
- Validate email format and password presence before submission
- Integrate with Firebase Authentication to verify user credentials
- Show loading state during authentication process
- Display appropriate error messages for:
  - Invalid email format
  - Missing email or password
  - Incorrect credentials (wrong email/password)
  - Network errors or Firebase service issues
- Upon successful login, redirect user to `/heists` page
- Maintain authentication state across page refreshes
- Include "Forgot Password?" link (placeholder for now)
- Include "Sign Up" link that navigates to `/signup` page
- Form should be accessible and keyboard-navigable
- Support "Enter" key submission

## Figma Design Reference

Design reference could not be retrieved. See Figma manually for details if needed, or follow existing Pocket Heist design system with purple (#C27AFF) and pink (#FB64B6) accents on dark background.

## Possible Edge Cases

- User attempts to login with unverified email
- User is already logged in and navigates to `/login`
- Session expires while user is on login page
- Multiple rapid form submissions
- Password managers auto-filling credentials
- Browser back/forward navigation after login
- Firebase Authentication service is temporarily unavailable
- User closes browser tab during authentication
- Email exists but password is incorrect vs. email doesn't exist

## Acceptance Criteria

- User can successfully log in with valid credentials and is redirected to `/heists`
- Invalid credentials show clear error message without exposing which field is incorrect (security best practice)
- Form fields show validation errors for empty or malformed inputs
- Loading state is displayed during authentication request
- User cannot submit form while authentication is in progress
- Error messages are user-friendly and don't expose sensitive information
- Successful authentication persists across page refreshes
- Already authenticated users visiting `/login` are redirected to `/heists`
- Form is fully keyboard accessible (tab navigation, enter to submit)
- All error states are visually distinct and accessible

## Open Questions

- Should we implement "Remember Me" functionality?
- Should we add rate limiting for failed login attempts?
- Do we need to support OAuth providers (Google, GitHub, etc.) in this iteration?
- Should we log authentication events for security monitoring?
- What should happen if user's account is disabled?

## Testing Guidelines

Create test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Successful login with valid credentials redirects to `/heists`
- Invalid email format shows validation error
- Empty email or password fields show validation errors
- Incorrect credentials display appropriate error message
- Form submission is disabled during authentication
- Loading state appears and disappears correctly
- Already authenticated user is redirected from `/login` to `/heists`
- "Sign Up" link navigates to `/signup` page
- Enter key submits the form

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
