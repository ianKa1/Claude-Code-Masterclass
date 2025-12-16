# Spec for Heist Details Page

branch: claude/feature/heist-details-page

## Summary

Create a dedicated details page at `/heists/[slug]` that displays comprehensive information about a single heist. The page should be accessible by clicking on any heist card from the `/heists` page. The design should follow the existing dark theme with purple (#C27AFF) and pink (#FB64B6) accents. This is a read-only view with no action buttons for completing, submitting, or deleting heists.

## Functional Requirements

- Create a dynamic route at `app/(dashboard)/heists/[slug]/page.tsx` following Next.js App Router conventions
- Fetch and display a single heist by its ID/slug parameter
- Display all heist properties:
  - Title (prominent heading)
  - Description (full text, potentially multi-line)
  - Created by (user codename)
  - Assigned to (user codename)
  - Deadline (formatted date)
  - Created at (timestamp)
  - Status (active/inactive)
  - Final status (success/failure/null for active heists)
- Handle loading states with appropriate skeleton UI
- Handle error states (heist not found, fetch errors)
- Make HeistCard and ExpiredHeistCard components clickable with Next.js Link to navigate to details page
- Follow existing styling patterns with CSS modules
- Maintain responsive layout that works on mobile and desktop
- Include navigation back to `/heists` page

## Figma Design Reference

Not applicable - no Figma component specified. Follow existing design system established in HeistCard and ExpiredHeistCard components.

## Possible Edge Cases

- Heist ID/slug does not exist in database (404 scenario)
- Network error during fetch
- User navigates directly to URL without coming from heists page
- Heist is deleted while user is viewing the page
- Very long title or description text that needs proper wrapping
- Missing or null fields in heist data
- Expired heist vs active heist display differences
- Deadline has passed but isActive is still true

## Acceptance Criteria

- Clicking any HeistCard or ExpiredHeistCard navigates to `/heists/[slug]`
- Details page displays all heist information clearly and readably
- Page follows the existing dark theme design language
- Loading state displays skeleton UI matching the page structure
- Error state displays appropriate message (e.g., "Heist not found")
- Page is responsive and looks good on mobile and desktop
- User can navigate back to `/heists` page via Navbar or browser back button
- URL uses heist ID as the slug parameter
- Page metadata includes appropriate title for SEO

## Open Questions

- Should we show different UI elements for expired vs active heists on the details page?
- Should there be a "Back to Heists" button or rely on the Navbar?
- Do we want to display any additional computed information (e.g., "Time remaining" for active heists)?
- Should the page preload/prefetch when hovering over cards on the heists page?

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- Rendering heist details with complete valid data
- Displaying loading state while fetching
- Handling heist not found (404) error
- Handling network/fetch errors
- Displaying expired heist with finalStatus
- Displaying active heist without finalStatus
- Formatting dates correctly using existing formatDeadline utility
- Navigation from HeistCard to details page
- Navigation from ExpiredHeistCard to details page

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
