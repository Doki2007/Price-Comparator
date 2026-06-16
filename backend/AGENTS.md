# Backend Guidelines (compare-prices)

This document provides specific instructions for AI Agents working within the `backend/` component of the `compare-prices` monorepo. This file overrides the global `AGENTS.md` for backend-specific implementations.

## 1. Architecture & Frameworks
- **Core Framework:** **FastAPI**. All API routing and handling must be managed exclusively with FastAPI.
- **Language:** Python 3.10+
- **Asynchronous Code:** Maintain fast, asynchronous code. Use `async def` for all endpoints. For network calls, prioritize asynchronous libraries (like `httpx` or `aiohttp`) over synchronous ones (like `requests`).
- **Data Validation & Documentation:** Use **Pydantic** models extensively for request and response validation.
- **Strict Typing:** Emphasize strict Python typing (using `List`, `Dict`, `Optional` from the `typing` module) to ensure FastAPI auto-generates the Swagger documentation cleanly and accurately.

## 2. Scraping & Data Extraction Strategy
- **Reverse Engineering First:** Rely heavily on sending direct HTTP Requests by analyzing original source network traffic (Reverse Engineering).
- **No Browser Automation:** Do **not** use Browser Automation (Puppeteer, Selenium, Playwright) unless the source strictly blocks our HTTP requests and all other workarounds have failed. Direct HTTP responses are prioritized for maximum operational speed.
- **Evite Bans:** Always try to implement visual or programmatic mechanisms in the headers (User-Agents, Cookies) to simulate genuine human traffic when needed.

## 3. Code Formatting & Linting
- **Formatter & Linter:** **Ruff** will act as the standard formatter and linter (replacing flake8/black).
- **Enforcement:** No Python code should be left unformatted after AI generation. Ensure `ruff format` and `ruff check --fix` logic is applied.

## 4. Testing Policy
- **Testing Framework:** `pytest`.
- **Policy:** Tests are **not mandatory** in this current phase of development. 
- **Rule:** Only create test files solely and explicitly when the human user commands it. Do not generate mocks or pre-emptive unit tests under any other circumstance.

## 5. Approved Commands for AI Agents
When an agent needs to manually spin up local servers or interact with the OS in the backend:
- **Executing standalone scraping scripts:** `python path/to/script_name.py`
- **Run FastAPI Server (Development):** `uvicorn main:app --reload` *(Note: Update `main:app` if the entry point changes).*
- **Format Code:** `ruff format .`
- **Lint Code:** `ruff check .`

## 6. Local Skills
Automated AI development skills specific to the backend are located under `.agents/skills/`. Agents should utilize these local skills when requested for specialized backend tasks (e.g., `fastapi-pro`, `web-scraper`).
