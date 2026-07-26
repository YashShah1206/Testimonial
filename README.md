# 🌟 Testimonial Platform — Enterprise Verified Customer Feedback System

A full-stack, production-ready web application designed for collecting, curating, analyzing, and showcasing verified customer testimonials. Featuring real-time AI sentiment analysis, optimistic UI moderation workflows, masonry grids, and white-label embeddable iframe widgets.

---

## 🚀 Project Overview

The Testimonial Platform bridges the gap between customer advocacy and public brand trust. It empowers businesses to capture multi-media feedback, automatically evaluate emotional sentiment using AI, moderate submissions in real time, and publish approved reviews to responsive public walls or third-party client websites via customizable iframe widgets.

---

## 🛠️ Technology Stack

### **Frontend (`client/`)**
- **Framework**: React 18 (with Vite fast bundling)
- **Routing**: React Router DOM v6 (Single Page Application architecture)
- **HTTP Client**: Axios with centralized error handling & environment configuration
- **Styling**: Vanilla CSS Modules with custom CSS Variables for dynamic white-label theming
- **UX Components**: Glassmorphic Skeleton Loaders, Keyboard-accessible Pagination, Optimistic UI badges

### **Backend (`server/`)**
- **Runtime**: Node.js & Express.js
- **ORM & Database**: Prisma ORM with SQLite (dev/production portable)
- **AI Engine**: Google Gemini API integration (with fault-tolerant offline NLP heuristic fallback)
- **File Storage**: Multer middleware for multipart/form-data image uploads (`/uploads/`)
- **Security & CORS**: Strict schema validation, CORS cross-origin headers, duplicate submission prevention (`409 Conflict`)

---

## 📁 Folder Structure

```text
Testimonial/
├── client/                 # React frontend application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── TestimonialForm.jsx         # Public review submission form
│   │   │   ├── StarRatingInput.jsx         # Interactive star rating selector
│   │   │   ├── TestimonialCard.jsx         # Moderation review card with Approve/Reject actions
│   │   │   ├── PublicTestimonialCard.jsx   # Wall/Widget card with initials avatar & sentiment badge
│   │   │   ├── SkeletonLoader.jsx          # Shimmer loading skeleton
│   │   │   └── Pagination.jsx              # Reusable accessible pagination bar
│   │   ├── pages/          # Application pages (Home, Dashboard, Wall, Widget)
│   │   ├── services/       # Centralized Axios API service (`api.js`)
│   │   ├── App.jsx         # Router & main application wrapper
│   │   └── main.jsx        # React DOM entry point
│   ├── vercel.json         # Vercel SPA routing & iframe security headers
│   ├── .env.example        # Client environment variables reference
│   └── package.json
├── server/                 # Node.js + Express backend API
│   ├── controllers/        # Route controllers (`testimonialController.js`)
│   ├── middleware/         # Upload & error handling middleware
│   ├── prisma/             # Prisma schema (`schema.prisma`) & SQLite database
│   ├── routes/             # RESTful API routes (`testimonialRoutes.js`)
│   ├── services/           # AI sentiment analysis service (`aiService.js`)
│   ├── utils/              # Payload validation helper functions
│   ├── uploads/            # Static image storage for uploaded photos
│   ├── .env.example        # Server environment variables reference
│   ├── server.js           # Express application entry point
│   └── package.json
├── demo.html               # Standalone third-party website iframe widget demo
├── render.yaml             # Render backend deployment blueprint
├── JOURNAL_CHECKLIST.md    # Structured checklist for manual JOURNAL.md review
├── README.md               # Project documentation
└── GEMINI.md               # AI Agent collaboration setup & guidelines
```

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### 1. Backend Setup (`server/`)
Open a terminal and navigate to the `server/` directory:
```bash
cd server
npm install
```

Copy the example environment file:
```bash
cp .env.example .env
```
*(Default values: `PORT=5000`, `DATABASE_URL="file:./dev.db"`, optional `GEMINI_API_KEY`)*

Run Prisma database migrations to initialize the SQLite database and generate the Prisma Client:
```bash
npx prisma migrate dev --name init
```

Start the backend API server:
```bash
npm run dev
```
The server will run at `http://localhost:5000`.

---

### 2. Frontend Setup (`client/`)
Open a new terminal window and navigate to the `client/` directory:
```bash
cd client
npm install
```

Copy the example environment file:
```bash
cp .env.example .env
```
*(Default value: `VITE_API_URL="http://localhost:5000/api"`)*

Start the development server:
```bash
npm run dev
```
The frontend application will be accessible at `http://localhost:5173`.

---

## 🏗️ Build Instructions

To verify production readiness or compile static bundles for deployment:

### Compile Frontend Bundle
```bash
cd client
npm run build
```
This generates optimized static HTML/CSS/JS assets inside `client/dist/`.

### Generate Production Prisma Client
```bash
cd server
npx prisma generate
```

---

## ✅ Implemented Features (Tasks 1 — 4)

### Task 1: Customer Submission Flow (`/`)
- **Public Submission Form**: Responsive card layout with real-time field validation, interactive star ratings, photo upload preview, loading indicators, and success banners.
- **Backend API & Persistence**: RESTful endpoint (`POST /api/testimonials`) with server-side validation and multipart/form-data support. Stores submissions in SQLite with an automatic default status of `Pending`.

### Task 2: Moderation Dashboard (`/dashboard`)
- **Review Dashboard**: Responsive moderation page displaying all submitted testimonials ordered newest first, complete with live stats counters (Pending vs Approved vs Rejected).
- **Optimistic UI Badges**: Distinct color-coded badges (Yellow/Pending, Green/Approved, Red/Rejected). Clicking Approve or Reject updates the badge in real time without page reloads.
- **Moderation APIs**: Endpoints (`GET /api/testimonials`, `PATCH /api/testimonials/:id/approve`, `PATCH /api/testimonials/:id/reject`) with robust 404 validation and CORS support.

### Task 3: Public Wall (`/wall`) & Embeddable Widget (`/widget`)
- **Public Wall (`/wall`)**: Displays ONLY approved testimonials in a responsive masonry/grid layout. Automatically calculates circle initials avatars (e.g., `"AS"` for Alice Smith) when photos are omitted.
- **Approved-Only API (`GET /api/testimonials/approved`)**: Strictly filters by `status === 'Approved'`, preventing leakage of unmoderated reviews.
- **Embeddable Widget (`/widget`)**: Lightweight, transparent iframe view designed for third-party embedding. Dynamically parses URL search parameters (`?accent=%23ef4444` or `?accent=#10b981`) to style star icons, badges, and borders in real time.
- **Standalone Proof of Concept (`demo.html`)**: Landing page demonstrating live iframe embedding (`<iframe src="http://localhost:5173/widget" ...>`) with interactive buttons to test theme switching.

### Task 4: Final Polish, AI Sentiment Analysis & Deployment Prep
- **Duplicate Submission Protection**: Checks incoming submissions for matching `email` AND `testimonial text`. Returns an HTTP `409 Conflict` status with a friendly warning banner to prevent duplicate spam.
- **AI-Powered Sentiment Analysis**: Automatically evaluates review emotional tone upon submission. Stores `Positive`, `Neutral`, `Negative`, or `Unknown` in database.
  - *Fault Tolerant*: If `GEMINI_API_KEY` is omitted or network calls fail, the engine seamlessly falls back to a deterministic offline keyword/rating heuristic so your app never breaks!
  - *Colored Badges*: Displays emoji-enriched badges (Green `😊 Positive`, Gray `😐 Neutral`, Red `😞 Negative`) across Dashboard, Wall, and Widget.
- **Server-Side Pagination**: Implemented offset-based pagination (`?page=1&limit=6`) across all backend endpoints and frontend views, complete with keyboard-accessible navigation bars.
- **UX & Accessibility Polish**: Replaced basic loading spinners with modern glassmorphic Shimmer Skeleton Loaders (`<SkeletonLoader />`). Enforced ARIA labels and focus outlines for accessibility.
- **Deployment & Journal Prep**: Generated production-ready `render.yaml` (backend) and `vercel.json` (frontend), alongside `JOURNAL_CHECKLIST.md`.

---

## 📡 API Reference & Endpoints

All endpoints are prefixed with `/api` and return standard JSON payloads.

| HTTP Method | Endpoint | Description | Query / Body Params | Response Status |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/testimonials` | Submit new testimonial | `FormData` (`name`, `email`, `testimonial`, `rating`, `photo`) | `201 Created` / `400 Bad Request` / `409 Conflict` |
| `GET` | `/testimonials` | Get all testimonials (Dashboard) | `?page=1&limit=6` | `200 OK` (`{ items, totalItems, totalPages, currentPage }`) |
| `GET` | `/testimonials/approved` | Get approved testimonials (Wall/Widget) | `?page=1&limit=6` | `200 OK` (`{ items, totalItems, totalPages, currentPage }`) |
| `PATCH` | `/testimonials/:id/approve` | Approve review by ID | `None` | `200 OK` / `404 Not Found` |
| `PATCH` | `/testimonials/:id/reject` | Reject review by ID | `None` | `200 OK` / `404 Not Found` |

---

## 🎨 Testing Widget Theming via URL Parameters
To customize the embeddable widget theme dynamically, append the `?accent=` query parameter with a hex color code (using `%23` in place of the `#` symbol):
- **Default Theme**: `http://localhost:5173/widget`
- **Red Theme**: `http://localhost:5173/widget?accent=%23ef4444`
- **Emerald Theme**: `http://localhost:5173/widget?accent=%2310b981`
- **Amber Theme**: `http://localhost:5173/widget?accent=%23f59e0b`

---

## 🌐 Deployment Instructions

### 1. Frontend Deployment (Vercel)
1. Push project code to GitHub.
2. Import project into Vercel and select the `client/` root directory.
3. Configure Environment Variables:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g., `https://testimonial-api.onrender.com/api`).
4. The included `client/vercel.json` automatically handles SPA routing and sets iframe-friendly CSP headers.

### 2. Backend Deployment (Render)
1. In Render Dashboard, click **New +** → **Blueprint** and connect your GitHub repository.
2. Render will read `render.yaml` and automatically configure the web service (`testimonial-backend-api`).
3. Add production environment variables in Render:
   - `DATABASE_URL`: Cloud PostgreSQL or mounted SQLite path.
   - `GEMINI_API_KEY`: Your Google Gemini API key.

---

## ⚠️ Known Limitations
1. **SQLite Concurrency**: By default, SQLite stores data in a local file (`dev.db`). In multi-instance serverless cloud environments without persistent volume mounting, database writes may not persist across horizontal scaling restarts. For high-scale production, migrate `schema.prisma` datasource provider to PostgreSQL.
2. **Local Image Uploads**: Uploaded customer photos are stored in `server/uploads/`. In ephemeral cloud storage (like Render Free Tier), local files vanish on dyno restarts. For production, integrate cloud object storage (AWS S3 or Cloudinary).
3. **Single-Tenant Moderation**: The moderation dashboard currently operates openly without admin password authentication or role-based access control (RBAC).

---

## 🔮 Future Improvements
- **Admin Authentication**: Implement JWT or OAuth2 login for the moderation dashboard.
- **Star Rating & Category Filters**: Add filtering by 5-star ratings or customer industry tags on the wall.
- **Automated AI Moderation**: Use LLMs to auto-reject toxic language or spam before human review.
- **Email Notifications**: Send automated thank-you emails when customer reviews are approved.
