# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About Pocket Heist

Pocket Heist is a Next.js social web application for managing fun office missions ("heists") - tiny tasks and mischief among team members. The app uses Next.js 16 with App Router, React 19, TypeScript, and Tailwind CSS 4 with a dark theme featuring purple (#C27AFF) and pink (#FB64B6) accents.

## Development Commands

**Start development server:**
```bash
npm run dev
```
Opens at http://localhost:3000 with hot reload enabled.

**Build for production:**
```bash
npm run build
```

**Run production server:**
```bash
npm start
```

**Lint code:**
```bash
npm run lint
```

## Architecture Overview

**Framework:** Next.js 16 App Router (not Pages Router) with TypeScript strict mode.

**Route Organization:** Uses Next.js route groups to separate concerns:
- `app/(public)/` - Unauthenticated pages (splash, login, signup) with splash layout
- `app/(dashboard)/` - Authenticated pages (heists management) with Navbar layout
- Layouts apply automatically to all pages within each route group

**Key Routes:**
- `/` - Home/splash page
- `/login`, `/signup` - Authentication (placeholders)
- `/heists` - Main dashboard with three sections: active heists, assigned heists, expired heists
- `/heists/create` - Create new heist form
- `/heists/[slug]` - Individual heist detail page
- `/preview` - Development page for testing components before integration

**Component Structure:**
- `components/` - Reusable components (Navbar, etc.)
- `components/ui/` - UI primitives (empty, ready for Button, Card, etc.)
- `context/` - React Context providers (empty, add as needed)
- `hooks/` - Custom hooks (empty, add as needed)

**Styling System:**
Tailwind CSS 4 with custom theme in `app/globals.css`:
- Primary: #C27AFF (purple)
- Secondary: #FB64B6 (pink)
- Background: #030712 (dark), #0A101D (light), #101828 (lighter)
- Success: #05DF72, Error: #FF6467
- Text: white (headings), #99A1AF (body)

Use Tailwind utility classes exclusively. Define complex patterns in `globals.css` with `@apply`.

Do NOT apply tailwind classes directly in component templates unless essential or just 1 at most. If an element needs more than a single tailwind class, combine them into a custom class using the `@apply` directive.

**important:** Use CSS modules for component-specific styles (like UI components), and only use the global CSS file for reusable global styles & layout.

## Feature Development Workflow

**Before implementing features:**
1. Use `/spec <short description>` command to create feature spec
2. Specs are saved in `_specs/` directory following `_specs/template.md`
3. Branch name convention: `claude/feature/<feature-slug>`
4. If using Figma, include: `figma: <component-name>` in spec command

**Spec sections:**
- Summary, Functional Requirements, Figma Design Reference (if applicable)
- Possible Edge Cases, Acceptance Criteria, Open Questions
- Testing Guidelines (tests go in `./tests` folder)

**Implementation:**
1. Create spec first
2. Create feature branch
3. Implement feature
4. Test in `/preview` or relevant routes
5. Run `npm run lint` before committing

## Code Conventions

**File Naming:**
- Components: PascalCase (`Navbar.tsx`)
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx`
- Directories: kebab-case

**Import Path Alias:**
Use `@/` to import from root:
```tsx
import { Navbar } from '@/components/Navbar'
```

**Icons:**
Use lucide-react:
```tsx
import { Clock8, Plus } from 'lucide-react'
```

**Component Pattern:**
```tsx
import type { Metadata } from 'next'

export default function PageName() {
  return (
    <div className="page-content">
      {/* Content */}
    </div>
  )
}
```

**Layout Children Type:**
```tsx
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="layout-class">{children}</div>
}
```

## TypeScript Configuration

- Strict mode enabled
- Path alias `@/*` maps to root directory
- Incremental compilation enabled
- Target: ES2017

## Git Workflow

**Current Branch:** Check `git status` for active branch

**Branch Naming:**
- Features: `claude/feature/<feature-slug>`
- Fixes: `claude/fix/<issue-description>`
- Refactors: `claude/refactor/<area>`

**Commit Messages:**
Follow existing pattern - descriptive, present tense, explain "why" not just "what".

**Additional Guidelines**
- Never use semicolons for TypeScript/JavaScript code
- Use minimal project dependencies where possible