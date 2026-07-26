# JOURNAL.md — Decision Journal

## 1. Prioritization

- **What did you decide to build, in what order, and why?**
  - We prioritized building the foundational full-stack core loop first (Task 1: Project Setup + Backend + Database + Customer Submission Form). This represents the P0 minimum bar required to collect testimonials and persist them in a database with a default `Pending` status.
  - We structured the backend cleanly using Express and Prisma ORM with SQLite, ensuring zero-friction local development without requiring external cloud DB dependencies.
  - We designed a rich, modern React frontend (using Vite + Vanilla CSS variables and CSS modules) with interactive star ratings, photo upload previews, and comprehensive error/loading states to deliver a premium user experience from day one.
- **What did you deliberately cut or skip? Why those?**
  - In accordance with Task 1 boundaries and the non-goals defined in `ASSIGNMENT.md`, we strictly skipped building the Moderation Dashboard, Public Testimonial Wall, Embeddable Widget, AI features, Authentication, and Cloud Deployment. Focusing purely on the submission foundation ensures robust validation, clean architecture, and reliable database persistence before adding moderation layers.

## 2. Key decisions

- **Decision 1:** Use SQLite via Prisma ORM for database persistence.
  - **Options:** PostgreSQL, MySQL, MongoDB Atlas, Supabase.
  - **Why:** SQLite requires zero external infrastructure setup or Docker containers, making it lightweight, instantaneous to migrate, and reliable for evaluating the core P0 loop locally. Prisma ORM provides type-safe queries and clean schema management that can easily swap to PostgreSQL in production.

- **Decision 2:** Implement local filesystem storage for optional photo uploads via `multer`.
  - **Options:** Base64 encoding in text fields, AWS S3 / Cloudinary external uploads.
  - **Why:** Base64 bloats database tables, while Cloudinary/S3 introduces third-party API key requirements. Using `multer` to store images in `server/uploads/` and serving them statically via Express keeps the app self-contained and performant.

- **Decision 3:** Use Vanilla CSS with CSS Variables and CSS Modules over heavy UI frameworks.
  - **Options:** Tailwind CSS, Material UI, Bootstrap.
  - **Why:** Vanilla CSS gives us maximum flexibility over custom animations (glassmorphic cards, smooth focus transitions, interactive hover ratings) while keeping bundle sizes small and component styles cleanly isolated without utility-class clutter.

## 3. Working with AI agents

- **Tools and models used:** Gemini 3.1 Pro (High) via Antigravity Agentic IDE.
- **How you split the work:** The agent was tasked with setting up the complete project boilerplate, Prisma schema, API endpoints, validation logic, and responsive UI components. Human review focused on validating architectural decisions against the assignment brief and verifying end-to-end functionality.
- **Your agent setup:** We established an explicit planning workflow (`implementation_plan.md`) to verify architectural choices before generating code. We also created `GEMINI.md` to document tool priority rules, styling guidelines, and strict task boundaries.
- **Your 3–5 most important prompts:**
  - *Task 1 specification prompt*: Clearly defining scope, required files, tech stack, and explicit instructions not to overstep into dashboard/widget development.
- **At least one time AI was wrong:** *To be updated during execution and testing phases.*
- **Something you rejected:** *To be updated as development progresses.*

## 4. Verification

- **How did you convince yourself the code actually works?**
  - Automated migration check: Executed `npx prisma migrate dev` to verify schema validity and table creation.
  - API Verification: Executed HTTP requests to `POST /api/testimonials` with valid and invalid payloads to test Express validation and error handling.
  - End-to-End Browser UI Check: Started Vite dev server and submitted testimonials through the interactive frontend form, verifying that database rows were created with `status = "Pending"`.
- **What do you know is still broken or fragile?**
  - Currently, uploaded images are stored locally; in a serverless cloud deployment (like Vercel/Render), local uploads would be ephemeral without persistent disk volumes.

## 5. If I had 5 more hours

- Implement P0 Moderation Dashboard with filterable tables and one-click Approve/Reject actions.
- Build the P0 Public Wall with responsive masonry layout and empty states.
- Develop the P1 Embeddable JavaScript Widget `<script>` tag snippet with customizable theme attributes.
