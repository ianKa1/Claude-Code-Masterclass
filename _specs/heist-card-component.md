# Spec for Heist Card Component

branch: claude/feature/heist-card-component
figma_component: HeistCard

## Summary
Create a reusable HeistCard UI component that displays heist information in a card format. The component will be used to render active heists (both assigned to and created by the user) on the /heists page. The design should follow the HeistCard component from the Figma design.

## Functional Requirements
- Create a HeistCard component in `components/ui/` directory
- Component should accept a Heist object as a prop
- Display key heist information:
  - Title
  - Description
  - Created by codename
  - Assigned to codename
  - Deadline (formatted date/time)
  - Active status indicator
- Apply styling based on the Figma HeistCard design
- Make the card interactive (clickable to navigate to heist detail page)
- Integrate the HeistCard into the /heists page to render lists of active heists
- Use the useHeists hook to fetch and display heists in two sections:
  - Active heists (assigned to current user)
  - Assigned heists (created by current user)

## Figma Design Reference
- File: See Figma design file
- Component name: HeistCard
- Key visual constraints: Refer to Figma for exact spacing, colors, typography, border radius, and layout

Note: Design reference could not be retrieved automatically. Please check Figma manually for the HeistCard component details including:
- Card dimensions and padding
- Typography styles for title, description, and metadata
- Color scheme for active/inactive states
- Icon usage and placement
- Border and shadow specifications

## Possible Edge Cases
- Very long heist titles or descriptions (need truncation or wrapping)
- Missing or null values in heist data
- Deadline in the past vs. future (visual indication)
- Different states based on isActive flag
- User viewing their own created heist vs. assigned heist
- Card responsiveness on different screen sizes

## Acceptance Criteria
- HeistCard component renders all required heist information correctly
- Styling matches the Figma HeistCard design
- Card is clickable and navigates to the heist detail page (placeholder for now)
- Component handles missing or edge case data gracefully
- /heists page successfully renders two lists of HeistCards using useHeists hook
- Active heists section shows heists assigned to current user
- Assigned heists section shows heists created by current user
- Loading and empty states are handled appropriately
- Component is responsive and works on mobile and desktop

## Open Questions
- Should the card show different visual states for expired vs. active heists?
- Should clicking the card navigate to a detail page or open a modal?
- Do we need action buttons on the card (e.g., mark complete, delete)?
- Should we show the finalStatus (success/failure) on the card?

## Testing Guidelines
Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:
- HeistCard renders with valid heist data
- HeistCard handles missing optional fields gracefully
- HeistCard displays correct user codenames
- HeistCard formats deadline correctly
- /heists page renders correct lists using useHeists hook
- Empty states display when no heists are available
- Loading states display while fetching heists

## Checking Documentation
Always check for up-to-date documentation when implementing features from libraries and frameworks, using the Context7 MCP server, to plan your work.
