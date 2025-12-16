# Spec for Expired Heist Card Component

branch: claude/feature/expired-heist-card
figma_component: ExpiredHeistCard

## Summary

Create a new `ExpiredHeistCard` component to display expired heists in a compact, horizontally-aligned card format. The component will show key heist information including title, deadline timestamp, status (failed/completed), target user, and creator. This card will be integrated into the `/heists` page to render all expired heists in a dedicated section.

## Functional Requirements

- Create `ExpiredHeistCard.tsx` component in `components/ui/` directory
- Create companion `ExpiredHeistCard.module.css` for scoped styling
- Component accepts a `Heist` object and optional `onClick` handler as props
- Display heist title with mission icon (Target from lucide-react)
- Show formatted deadline timestamp with clock icon
- Display status badge ("FAILED" or "COMPLETED") with appropriate styling
- Show target user ("To: @codename") and creator ("By: @codename") with user icons
- Implement hover state with subtle elevation and border highlight
- Add keyboard accessibility (focusable, role="button" when interactive)
- Make component responsive (stacks metadata vertically on mobile)
- Integrate component into `/heists` page to display expired heists section
- Use the existing `useHeists` hook to fetch expired heists data
- Handle edge cases (long titles with text truncation, missing user data)

## Figma Design Reference

**File**: ExpiredHeistCard component in Pocket Heist Figma
**Component name**: ExpiredHeistCard
**Key visual constraints**:

### Layout & Spacing
- Card dimensions: 100% width (max 771px) × 86px height (compact)
- Padding: 17px horizontal, 17px top, 1px bottom
- Two-row layout with 8px gap between rows
- Border: 1px solid with 10px border radius
- Header row contains: mission icon + title (left) | timestamp + status badge (right)
- Metadata row contains: "To: @user" and "By: @user" with 16px gap

### Colors
- Card background: `rgba(16, 24, 40, 0.3)` (semi-transparent --color-lighter)
- Border: `rgba(30, 41, 57, 0.3)` (subtle dark blue)
- Title text: `#FFFFFF` (--color-heading)
- Body text/labels: `#99A1AF` (--color-body)
- Target username: `#C27AFF` (--color-primary)
- Creator username: `#FB64B6` (--color-secondary)
- Failed badge: background `rgba(255, 100, 103, 0.05)`, border `rgba(255, 100, 103, 0.2)`, text `#FF6467` (--color-error)
- Completed badge: background `rgba(5, 223, 114, 0.05)`, border `rgba(5, 223, 114, 0.2)`, text `#05DF72` (--color-success)

### Typography
- Title: Inter Medium, 16px, 500 weight, -0.3125px letter-spacing
- Timestamp/metadata: Inter Regular, 14px, 400 weight, -0.1504px letter-spacing
- Status badge: Inter Regular, 12px, 400 weight, 0.6px letter-spacing, uppercase

### Icons
- Mission icon (Target): 16px × 16px, body color
- Clock icon: 12px × 12px, body color
- User icons: 12px × 12px, body color
- All icons from lucide-react

### Interactive States
- Hover: translateY(-2px), box-shadow with primary color glow, slightly more visible border
- Focus: 2px solid primary color outline with 2px offset
- Transition: 0.2s for transform and box-shadow

## Possible Edge Cases

- Very long heist titles (>50 characters) should truncate with ellipsis
- Missing `createdForCodename` or `createdByCodename` should handle gracefully (display "Unknown" or hide)
- Invalid or null deadline dates should display fallback text or handle error
- Heists without onClick handler should not be focusable or show pointer cursor
- Empty expired heists array should show appropriate empty state message
- Status determination logic when `completed` field is undefined or null

## Acceptance Criteria

- ExpiredHeistCard component renders with correct layout and styling matching Figma design
- Component displays all required heist information (title, timestamp, status, users)
- Status badge shows "FAILED" for incomplete heists and "COMPLETED" for completed ones
- Text truncation works correctly for long titles
- Hover and focus states work as expected with smooth transitions
- Component is keyboard accessible (Tab to focus, Enter/Space to activate)
- Clicking card navigates to heist detail page (`/heists/[slug]`)
- Component is responsive and stacks properly on mobile screens
- Expired heists section appears on `/heists` page using useHeists hook
- All expired heists are rendered with the new card component
- No console errors or warnings when rendering with valid or edge case data

## Open Questions

- Should the status badge support additional states beyond "FAILED" and "COMPLETED"? (e.g., "EXPIRED", "ABANDONED")
- What should happen when a user clicks an expired heist - navigate to read-only detail page?
- Should there be a limit on how many expired heists are displayed, or show all with pagination?
- Do we need a "load more" or "show all" functionality if there are many expired heists?

## Testing Guidelines

Create test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Component renders correctly with valid heist data
- Status badge displays "FAILED" when heist.completed is false
- Status badge displays "COMPLETED" when heist.completed is true
- Text truncation works for heist titles longer than container width
- onClick handler is called with correct parameters when card is clicked
- Component is not focusable when onClick is not provided
- Timestamp formatting displays correctly for various date inputs
- Component handles missing or undefined user codenames gracefully
- Responsive layout stacks correctly at mobile breakpoint (< 768px)
- Hover state applies and removes correctly
- Multiple ExpiredHeistCard components render in list without styling conflicts

## Checking Documentation

Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
