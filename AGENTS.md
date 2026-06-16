# Repository Guidelines (compare-prices)

## How to Use This Guide

- Start here for cross-project norms. `compare-prices` is a monorepo with several components.
- Each component will have an `AGENTS.md` file with specific guidelines (e.g., `frontend/AGENTS.md`, `backend/AGENTS.md`).
- Component docs override this file when guidance conflicts.

This document serves as the **source of truth** for all foundational rules and conventions for AI Agents interacting with this codebase.

---

## Project Overview & Objective

`compare-prices` is a web-based price explorer and comparator built explicitly upon extracting data from external sources via Reverse Engineering techniques (private APIs and network traffic requests).

**Objective:**
The primary goal of this project is to provide a fast, beautifully designed, and highly responsive platform where users can compare prices across multiple sources seamlessly. The system aims to build robust, ban-resistant data extraction methods on the backend, while delivering a premium, GSAP-animated user experience on the frontend.

**Architecture:** Monorepo. The code is placed under a single repository to provide comprehensive context to AI Agents when working concurrently across Frontend and Backend boundaries.

| Component | Path | Tech Stack |
|-----------|----------|------------|
| Backend | `backend/` | Python, FastAPI. (Database to be defined) |
| Frontend | `frontend/` | React (Vite), TailwindCSS, GSAP (advanced scroll animations) |
| Scraping / Core | *(TBD)* | Price extraction via Reverse Engineering (Requests, Headers) |

---

## Technical Directives for AI Agents

### 1. Frontend Frameworks & Tech Stack
- Use **React** (via Vite) as the core rendering framework.
- Build the UI entirely with React components.
- For styling, exclusively use **TailwindCSS**.
- Scroll animations and visual effects must feel highly premium. Utilize **GSAP** and ScrollTrigger. Avoid basic CSS animations when GSAP offers superior and more interactive aesthetics.

### 2. Backend Frameworks & Tech Stack
- All API routing and handling must be managed exclusively with **FastAPI** in Python.
- Maintain fast, asynchronous code (`async def` for all endpoints).
- Emphasize strict Python typing (`dict`, `List`, `Optional`, Pydantic models) to ensure FastAPI auto-generates the Swagger documentation cleanly and accurately.

### 3. Scraping Strategy
- Current data-gathering libraries rely heavily on sending direct **HTTP Requests** by analyzing original source network traffic (Reverse Engineering).
- Do not use Browser Automation (Puppeteer, Selenium) unless the source strictly blocks our HTTP requests. Direct HTTP responses are prioritized for maximum operational speed.
- **Evite bans:** Always try to implement visual or programmatic mechanisms in the headers (User-Agents, Cookies) to simulate genuine human traffic when needed in the future.

### 4. Code Styling & Linters
- All JavaScript, TypeScript, React, HTML, CSS, and related files inside the repository MUST pass through **Prettier** for formatting.
- For Python files, **Ruff** will act as the standard formater (the modern, fast industry-standard replacing flake8/black). No Python code should be left unformatted after AI generation.

### 5. Testing Policy
- Tests are **not mandatory** in this current phase of development. 
- You should only create test files (using `pytest` for Python, or `Jest` for React) **solely and explicitly when the human user commands it.**
- Do not generate mocks or pre-emptive unit tests under any other circumstance.

### 6. Approved Commands for AI Agents
When an agent needs to manually spin up local servers or interact with the OS, these are the primary commands allowed:

**Frontend**:
- Use pnpm commands exclusively.
- Install dependencies: `pnpm install`
- Run dev environment: `pnpm run dev`
- Build for production: `pnpm build`

**Backend / Core Scripts**:
- Executing standalone scraping scripts: `python script_name.py`
- *[Note: Update this section with Uvicorn commands once the FastAPI server has been thoroughly structured]*

---

## Commit & Pull Request Guidelines

Follow conventional-commit style: `<type>[scope]: <description>`

**Types:** `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

Before committing/PR:
1. Make sure to format the code utilizing Prettier (Frontend) and Ruff (Backend).
2. Refrain from bundling massive, unrelated frontend and backend changes within a single commit unless they rely on the same shared feature. Keep commits as atomic as possible.

---

## Available & Auto-invoke Skills
AI skills have been compartmentalized by domain to maintain a clean context:
- **Frontend Skills:** Located in `frontend/.agents/skills/` (focusing on React, Tailwind, and GSAP).
- **Backend Skills:** Located in `backend/.agents/skills/` (focusing on FastAPI, Python, and Scraping).

Agents must refer strictly to the local `.agents/skills/` folder within the specific component they are working on.
