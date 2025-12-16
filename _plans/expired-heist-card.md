# Implementation Plan: ExpiredHeistCard Component

## Overview
Create a new ExpiredHeistCard component with a compact horizontal layout to display expired heists on the /heists page. The component will show heist status (COMPLETED/FAILED), deadline timestamp, and user assignments.

## Key Decisions

### Status Badge Logic
- Use `finalStatus` field from Heist type (not `completed`)
- `finalStatus === "success"` → "COMPLETED" badge (green)
- `finalStatus === "failure"` or `null` → "FAILED" badge (red)

### Date Formatting
- Extract existing `formatDeadline()` from HeistCard to shared utility
- Create new `formatExpiredDate()` for expired heists showing "Expired Xd ago - Dec 15, 2:30 PM" format

### Navigation
- Card always clickable/focusable by default
- Navigates to `/heists/[id]` route (using heist.id as slug)
- Optional onClick prop to override default behavior

### Missing Data Handling
- Missing codenames display as "Unknown Agent"
- Maintains layout consistency

## Implementation Steps

### 1. Create Shared Date Utilities
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/lib/date-utils.ts`

Create new file with two functions:
- `formatDeadline(date: Date): string` - Move from HeistCard (lines 5-33)
- `formatExpiredDate(date: Date): string` - New function for expired heists

Format for expired dates:
- Same day: "Expired today - Dec 15, 2:30 PM"
- Yesterday: "Expired yesterday - Dec 14, 5:00 PM"
- 2-7 days: "Expired 3d ago - Dec 12, 4:30 PM"
- 8-30 days: "Expired 2w ago - Dec 1, 10:00 AM"
- 30+ days: "Expired Dec 1, 10:00 AM"

### 2. Update HeistCard to Use Shared Utility
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/HeistCard.tsx`

- Add import: `import { formatDeadline } from "@/lib/date-utils"`
- Remove embedded `formatDeadline` function (lines 5-33)

### 3. Create ExpiredHeistCard Component
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/ExpiredHeistCard.tsx`

**Props**:
```typescript
interface ExpiredHeistCardProps {
  heist: Heist
  onClick?: () => void
}
```

**Layout Structure** (horizontal, 2-row):
- **Header Row**: Mission icon + title (left) | timestamp + status badge (right)
- **Metadata Row**: "To: @codename" and "By: @codename"

**Icons** (lucide-react):
- Target (16px) - mission icon
- Clock (12px) - timestamp
- User (12px) - user assignments

**Status Badge**:
- "COMPLETED" - green background/border when finalStatus === "success"
- "FAILED" - red background/border otherwise
- Uppercase, 12px font, 0.6px letter-spacing

**Accessibility**:
- `role="button"`
- `tabIndex={0}`
- `onKeyDown` handler for Enter/Space keys
- Focus outline with primary color

**Click Behavior**:
- Default: `router.push(\`/heists/${heist.id}\`)`
- Override: call optional onClick prop if provided

### 4. Create ExpiredHeistCard Styles
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/ExpiredHeistCard.module.css`

**Key Styles**:
- Card: `max-width: 771px`, `height: 86px`, `padding: 17px 17px 1px 17px`
- Background: `rgba(16, 24, 40, 0.3)` (semi-transparent)
- Border: `1px solid rgba(30, 41, 57, 0.3)`, `border-radius: 10px`
- Hover: `translateY(-2px)` + purple shadow glow
- Focus: 2px solid primary color outline with 2px offset

**Typography**:
- Title: Inter Medium, 16px, 500 weight, -0.3125px letter-spacing
- Timestamp/metadata: Inter Regular, 14px, 400 weight, -0.1504px letter-spacing
- Status badge: Inter Regular, 12px, uppercase, 0.6px letter-spacing

**Colors**:
- Title: `var(--color-heading)` (white)
- Body text: `var(--color-body)` (#99A1AF)
- Target user: `var(--color-primary)` (purple)
- Creator user: `var(--color-secondary)` (pink)
- Success badge: `rgba(5, 223, 114, 0.05)` bg, `rgba(5, 223, 114, 0.2)` border, `var(--color-success)` text
- Failed badge: `rgba(255, 100, 103, 0.05)` bg, `rgba(255, 100, 103, 0.2)` border, `var(--color-error)` text

**Responsive** (< 768px):
- Stack header elements vertically
- Stack metadata items vertically
- Auto height instead of fixed 86px

### 5. Create ExpiredHeistCardSkeleton
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/ExpiredHeistCardSkeleton.tsx`

Match ExpiredHeistCard layout:
- Header row with circular icon skeleton + title skeleton + status skeletons
- Metadata row with two text skeletons
- Same dimensions and spacing as ExpiredHeistCard

**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/ExpiredHeistCardSkeleton.module.css`

Reuse card structure styles from ExpiredHeistCard (background, border, padding, gaps)

### 6. Integrate into /heists Page
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(dashboard)/heists/page.tsx`

**Add imports**:
```typescript
import ExpiredHeistCard from "@/components/ui/ExpiredHeistCard"
import ExpiredHeistCardSkeleton from "@/components/ui/ExpiredHeistCardSkeleton"
```

**Add hook call** (after line 18):
```typescript
const {
  heists: expiredHeists,
  loading: expiredLoading,
  error: expiredError,
} = useHeists("expired")
```

**Add section** (after line 80, after "Heists You've Assigned"):
```typescript
{/* Section 3: Expired Heists */}
<section className={styles.section}>
  <h2 className={styles.sectionTitle}>Expired Heists</h2>

  {expiredLoading && (
    <div className={styles.expiredCardList}>
      <ExpiredHeistCardSkeleton />
      <ExpiredHeistCardSkeleton />
    </div>
  )}

  {!expiredLoading && expiredError && (
    <p className={styles.error}>
      Failed to load expired heists. Please try again.
    </p>
  )}

  {!expiredLoading && !expiredError && expiredHeists.length === 0 && (
    <p className={styles.empty}>No expired heists yet.</p>
  )}

  {!expiredLoading && !expiredError && expiredHeists.length > 0 && (
    <div className={styles.expiredCardList}>
      {expiredHeists.map((heist) => (
        <ExpiredHeistCard key={heist.id} heist={heist} />
      ))}
    </div>
  )}
</section>
```

### 7. Update Page Styles
**File**: `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(dashboard)/heists/page.module.css`

**Add at end**:
```css
.expiredCardList {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}
```

Note: Unlike cardGrid (grid layout), expired cards use flex column layout for horizontal cards

## Edge Cases Handled

1. **Long titles**: `text-overflow: ellipsis`, `white-space: nowrap`, `overflow: hidden`
2. **Missing codenames**: Fallback to "Unknown Agent"
3. **Null finalStatus**: Default to "FAILED" badge
4. **Empty list**: Show "No expired heists yet." message
5. **Responsive layout**: Stack elements vertically on mobile (< 768px)
6. **Keyboard navigation**: Tab to focus, Enter/Space to activate

## Files to Create (7 new files)

1. `/Users/shaun/Code/Sandbox/claude-pocket-heist/lib/date-utils.ts`
2. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/ExpiredHeistCard.tsx`
3. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/ExpiredHeistCard.module.css`
4. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/ExpiredHeistCardSkeleton.tsx`
5. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/ExpiredHeistCardSkeleton.module.css`

## Files to Modify (3 existing files)

1. `/Users/shaun/Code/Sandbox/claude-pocket-heist/components/ui/HeistCard.tsx` - Use shared date utility
2. `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(dashboard)/heists/page.tsx` - Add expired section
3. `/Users/shaun/Code/Sandbox/claude-pocket-heist/app/(dashboard)/heists/page.module.css` - Add expiredCardList class

## Testing Checklist

- [ ] ExpiredHeistCard renders with valid heist data
- [ ] Status badge shows "COMPLETED" for finalStatus === "success"
- [ ] Status badge shows "FAILED" for finalStatus === "failure" or null
- [ ] Long titles truncate with ellipsis
- [ ] Missing codenames display "Unknown Agent"
- [ ] Click navigates to correct route
- [ ] Keyboard accessible (Tab, Enter, Space work)
- [ ] Focus outline visible and styled correctly
- [ ] Hover state applies smoothly
- [ ] Responsive layout stacks on mobile
- [ ] Expired section appears on /heists page
- [ ] Loading state shows skeletons
- [ ] Error state shows error message
- [ ] Empty state shows "No expired heists yet."
- [ ] Multiple cards render without conflicts

## Implementation Order

1. Create `lib/date-utils.ts` first (foundation)
2. Create ExpiredHeistCard styles (CSS modules)
3. Create ExpiredHeistCardSkeleton (simple, no dependencies)
4. Create ExpiredHeistCard component (depends on 1-3)
5. Update HeistCard to use date-utils
6. Update /heists page (add section)
7. Update page styles (add expiredCardList)
8. Test in browser at http://localhost:3000/heists
