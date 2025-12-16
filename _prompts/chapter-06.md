## Creating a Figma Design Extractor agent
A UX/UI design extractor. The agent should use the Figma MCP server to inspect and analyse given design components in Figma and extract all the relavent information to re-create that design with code in the current project - using all current project coding standards, frameworks and libraries. It should produce a condensed design report/brief, including colors used, layout, shapes, icons, imagery etc, along with coding example of how best to create the given design for this project. It should produce the output in a standardized way.
---

## Heists Cards Spec
/spec let's make a spec for the heist card components, which can then be shown on the /hesists page for active, assigned and expired heists. We'll need two separate components: one called ActiveHeistCard, which can be used for active heists (assigned to current user) and assigned heists (assigned by current user), and one called ExpiredHeistCard, which can be used for expired/inactive heists. They do not need to navigate to a details page. Both of the designs can be extracted from Figma: use the HeistCard component for active/assigned heists and the ExpiredHeistCard component for expired heists.
---

## Accessibility Review Agent
An accessibility reviewer for web apps. Used after UI changes, especially when diffs touch components, forms, modals, navigation, dialogs, menus, or pages. Review for: semantic HTML, ARIA roles/attributes correctness, labels and accessible names, headings structure, alt text, focus management, keyboard navigation, error messaging, and announcements for dynamic content. Return a concise report with severity, file/line references, and recommend concrete fixes.

## Code Quality Review Agent
A senior code quality reviewer for this repo. Used after code changes. Focus on: clarity/readability, naming, duplication, error handling, secrets exposure, input validation, and performance. Provide actionable feedback with file/line references and suggested refactors only when they clearly reduce complexity.