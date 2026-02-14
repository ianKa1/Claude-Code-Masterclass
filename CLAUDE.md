# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pocket Heist — a Next.js 16 web app for managing office heist missions. Starter project for the Claude Code Masterclass. Currently a frontend-only application with placeholder pages ready for feature implementation.

## Commands

- `npm run dev` — Start dev server at localhost:3000
- `npm run build` — Production build
- `npm run start` — Serve production build
- `npm run lint` — ESLint (next/core-web-vitals + next/typescript, flat config)
- `npm run test` — Run all tests with Vitest (watch mode)
- `npx vitest run` — Run tests once (no watch)
- `npx vitest run tests/components/Navbar.test.tsx` — Run a single test file

## Architecture

### Routing

**Next.js App Router** with two route groups:

- `app/(public)/` — Unauthenticated pages (home, login, signup, preview). Layout wraps children in `<main className="public">`.
- `app/(dashboard)/` — Authenticated pages. Layout renders `<Navbar />` above `<main>{children}</main>`.

Dashboard routes:
- `/heists` — Mission list with three sections: active, assigned, expired
- `/heists/create` — Heist creation form (placeholder)
- `/heists/[id]` — Individual heist detail page (placeholder)

The home page (`app/(public)/page.tsx`) is intended to route logged-in users to `/heists` and unauthenticated users to `/login`. No auth logic is implemented yet.

### Components

Components live in `components/<Name>/` with:
- `<Name>.tsx` — Component implementation
- `<Name>.module.css` — Scoped styles using CSS Modules
- `index.ts` — Barrel re-export (`export { default } from "./<Name>"`)

Currently only `Navbar` exists. It uses `next/link` for navigation and `lucide-react` for icons.

### Testing

Tests live in `tests/` mirroring the source structure (e.g., `tests/components/Navbar.test.tsx`).

- **Framework**: Vitest with jsdom environment
- **Libraries**: React Testing Library + jest-dom matchers (via `vitest.setup.ts`)
- **Globals**: `describe`, `it`, `expect` are globally available (no imports needed, though existing tests do import them from vitest)
- **Pattern**: Render with `render()`, query with `screen.getByRole()`, assert with jest-dom matchers like `toBeInTheDocument()`

### What Doesn't Exist Yet

No API routes, middleware, custom hooks, context providers, utility modules, env files, CI/CD config, or type definition directories. These are all opportunities for future implementation.

## Styling

**Tailwind CSS 4** with PostCSS. Custom theme tokens in `app/globals.css` via `@theme`:

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#C27AFF` (purple) | Accent color |
| `secondary` | `#FB64B6` (pink) | Secondary accent |
| `dark` | `#030712` | Page background |
| `light` | `#0A101D` | Component backgrounds |
| `lighter` | `#101828` | Elevated surfaces |
| `success` | `#05DF72` | Success states |
| `error` | `#FF6467` | Error states |
| `heading` | `white` | Heading text |
| `body` | `#99A1AF` | Body text |

Font: Inter (Google Fonts import).

**Global utility classes** defined in `globals.css`:
- `.page-content` — Centered container (`mx-auto w-6xl min-w-2xl max-w-full`)
- `.center-content` — Full-height centered flex column
- `.form-title` — Centered bold title for form pages

**CSS Modules** use `@reference "../../app/globals.css"` to access theme tokens and apply Tailwind utilities via `@apply`.

## Code Style

- **Do not use semicolons in JavaScript/TypeScript files**
- **Double quotes** for strings and imports
- **Trailing commas** in multiline structures
- Component props typed as `Readonly<{ children: React.ReactNode }>` with `import type` for type-only imports
- **Default exports** for page and component files
- **Conventional commits**: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`

## Path Aliases

`@/*` maps to the project root — configured in `tsconfig.json` and resolved in tests via `vite-tsconfig-paths`.
