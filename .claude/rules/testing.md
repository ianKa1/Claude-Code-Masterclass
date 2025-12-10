---
paths: tests/**/*.{ts,tsx}
---

# Testing Rules

## Setup

- **Framework:** Vitest with jsdom environment
- **Libraries:** `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- **Run tests:** `npx vitest` (watch) or `npx vitest run` (single run)

## File Structure

```
tests/
├── components/     # Component tests
└── utils/          # Utility function tests
```

- Name test files: `ComponentName.test.tsx` or `utilName.test.ts`
- Mirror source structure (e.g., `components/Navbar.tsx` → `tests/components/Navbar.test.tsx`)


## Best Practices

- Query by accessibility: `getByRole`, `getByLabelText` > `getByTestId`
- Use `userEvent` over `fireEvent` for realistic interactions
- Test behavior, not implementation details
- One assertion focus per test where possible (can have multiple expects if related)

## Mocking

```tsx
// mock modules (example):
vi.mock('@/lib/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'test' }))
}))

// mock Next.js router (example):
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/test'
}))

// reset mocks between tests
beforeEach(() => vi.clearAllMocks())
```

## Available Matchers (jest-dom)

`toBeInTheDocument()`, `toBeVisible()`, `toBeDisabled()`, `toHaveTextContent()`, `toHaveAttribute()`, `toHaveClass()`, `toHaveFocus()`