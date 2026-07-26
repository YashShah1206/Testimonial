# GEMINI.md — Agent Collaboration Guidelines & Project Rules

This document defines the rules, behavior guidelines, and project constraints for AI agents (Gemini / Antigravity) working on the Testimonial Platform repository.

## 1. Project Boundaries & Incremental Execution
- **Strict Task Scoping**: Never implement features outside the current task's explicit instructions. For example, during Task 1, strictly avoid creating moderation dashboard routes, public walls, or embeddable widgets.
- **No Hallucinated Requirements**: Adhere strictly to the `ASSIGNMENT.md` requirements. Avoid adding authentication, billing, or multi-tenant complexity.

## 2. Coding & Architectural Standards
- **Backend Architecture**:
  - Use controller-based architecture in Express (`server/controllers/`, `server/routes/`, `server/middleware/`).
  - Use `async/await` with comprehensive `try/catch` error wrapping or global error middleware.
  - Validate all incoming payloads before database operations.
  - Return meaningful HTTP status codes (201 Created, 400 Bad Request, 500 Internal Server Error) with structured JSON error messages.
- **Frontend Architecture**:
  - Use functional React components with hooks.
  - Keep components modular and reusable (e.g., separating `StarRatingInput` from `TestimonialForm`).
  - Keep API calls centralized in an Axios service layer (`client/src/services/api.js`) using environment variables (`import.meta.env.VITE_API_URL`). Never hardcode API endpoints in components.
- **Design & Aesthetics**:
  - Prioritize visual excellence: Use modern typography, curated color palettes, glassmorphic card containers, subtle box shadows, and responsive layouts.
  - Implement dynamic user interactions: Micro-animations on star rating hover focus transitions, loading spinners during network requests, and clear success/error state messaging.

## 3. Tool Usage Rules
- Prioritize specific file system tools (`write_to_file`, `replace_file_content`, `view_file`) over generic shell commands.
- Never use `cat`, `sed`, or `echo` in bash to create or edit files.
- Always run database migrations and verification commands after making structural backend modifications.
