# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pocket Heist — a Next.js 16 web app for managing office heist missions. Starter project for the Claude Code Masterclass.

## Commands

- `npm run dev` — Start dev server at localhost:3000
- `npm run build` — Production build
- `npm run lint` — ESLint (next/core-web-vitals + next/typescript)
- `npm run test` — Run all tests with Vitest (watch mode)
- `npx vitest run` — Run tests once (no watch)
- `npx vitest run tests/components/Navbar.test.tsx` — Run a single test file

## Architecture

**Next.js App Router** with two route groups:

- `app/(public)/` — Unauthenticated pages (home, login, signup, preview). Wrapped in a `<main className="public">` layout.
- `app/(dashboard)/` — Authenticated pages (heists list, create, detail at `heists/[id]`). Layout includes the `<Navbar />` component.

**Components** live in `components/<Name>/` with a barrel `index.ts` re-export and CSS Modules for styling (e.g., `Navbar.module.css`).

**Tests** live in `tests/` mirroring the source structure. Uses Vitest with jsdom, React Testing Library, and jest-dom matchers. Vitest globals are enabled (no need to import `describe`/`it`/`expect`).

## Styling

Tailwind CSS 4 with custom theme tokens defined in `app/globals.css` via `@theme`:
- Colors: `primary` (purple), `secondary` (pink), `dark`/`light`/`lighter` (backgrounds), `success`, `error`, `heading`, `body`
- Font: Inter

## Path Aliases

`@/*` maps to the project root (configured in both `tsconfig.json` and `vitest.config.mts` via `vite-tsconfig-paths`).
