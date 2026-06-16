# Frontend Guidelines (compare-prices)

This document provides specific instructions for AI Agents working within the `frontend/` component of the `compare-prices` monorepo. This file overrides the global `AGENTS.md` for frontend-specific implementations.

## 1. Architecture & Frameworks

- **Core Framework:** **React** (via Vite). Do not use Next.js, Astro, or other metaframeworks.
- **Language:** TypeScript (`.tsx`, `.ts`).
- **Styling:** Exclusivamente **TailwindCSS**. No vanilla CSS files should be created for layout unless absolutely necessary (like a global reset or extremely custom GSAP setups in `index.css`).
- **Animations:** Emphasize premium scroll and micro-animations using **GSAP** and `gsap/ScrollTrigger`. Do not rely on plain CSS transitions when GSAP provides a better, more interactive experience.

## 2. Component Design & Best Practices

- Use functional components and React Hooks (`useState`, `useEffect`, `useRef`).
- **GSAP in React:** When using GSAP, always use the `@gsap/react` hook `useGSAP()` to ensure proper cleanup of animations and avoid memory leaks.
- Keep components small and focused. Extract reusable UI elements into a `components/` folder.

## 3. Code Formatting & Linting

- **Formatter:** **Prettier**. All `.ts`, `.tsx`, `.css`, and `.html` files must be formatted using Prettier.
- Ensure Tailwind classes are logically ordered (ideally using `prettier-plugin-tailwindcss` if configured).

## 4. Testing Policy

- **Testing Framework:** `Jest` / `Vitest` / React Testing Library.
- **Policy:** Tests are **not mandatory** in this phase.
- **Rule:** Do not generate test files or unit tests preemptively. Only create tests if the human user explicitly commands it.

## 5. Approved Commands for AI Agents

When an agent needs to manually interact with the OS in the frontend:

- **Install Dependencies:** `pnpm install <package>` (Do not use `npm` or `yarn`).
- **Run Dev Server:** `pnpm run dev`
- **Build:** `pnpm build`

## 6. Local Skills

Automated AI development skills specific to the frontend are located under `frontend/.agents/skills/`. Agents should utilize these local skills for specialized UI tasks (e.g., `react-pro`, `tailwind-expert`, `gsap-animator`).
