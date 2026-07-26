# Testimonial Platform

A modern, full-stack testimonial collection and moderation platform built as an SDE-1 Take-Home Assignment. Businesses can collect customer testimonials, review them in a moderation dashboard, and embed approved testimonials on external websites.

## 🚀 Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Custom CSS (CSS Modules & Variables with vibrant, glassmorphic design aesthetics).
- **Backend**: Node.js, Express.js, Multer (for optional photo uploads).
- **Database**: SQLite with Prisma ORM.

---

## 📁 Project Structure

```
Testimonial/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (TestimonialForm, StarRatingInput, TestimonialCard, PublicTestimonialCard)
│   │   ├── pages/          # Application pages (Home, Dashboard, Wall, Widget)
│   │   ├── services/       # Axios API client & endpoints
│   │   ├── App.jsx         # Router & main application wrapper
│   │   └── main.jsx        # React DOM entry point
│   └── package.json
├── server/                 # Node.js + Express backend API
│   ├── controllers/        # Route controllers (testimonialController)
│   ├── middleware/         # Error handling & upload middleware
│   ├── prisma/             # Prisma schema & SQLite database
│   ├── routes/             # API routes
│   ├── utils/              # Validation helper functions
│   ├── uploads/            # Static image storage for uploaded photos
│   ├── server.js           # Express server entry point
│   └── package.json
├── demo.html               # Standalone third-party website iframe widget demo
├── README.md               # Project documentation
├── JOURNAL.md              # Decision & development log
└── GEMINI.md               # AI Agent collaboration setup & guidelines
```

---

## 🛠️ Setup & Installation Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
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
*(Default settings: `PORT=5000`, `DATABASE_URL="file:./dev.db"`)*

Run Prisma database migrations to create the SQLite database and generate the Prisma Client:
```bash
npx prisma migrate dev --name init
```

Start the backend API server:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

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
*(Default settings: `VITE_API_URL="http://localhost:5000/api"`)*

Start the development server:
```bash
npm run dev
```
The frontend application will be accessible at `http://localhost:5173`.

---

## ✅ Implemented Features

### Task 1: Core Foundation & Customer Submission Flow (`/`)
- **Public Submission Form**: Responsive card layout with real-time field validation, interactive star ratings, photo upload preview, loading indicators, and success banners.
- **Backend API**: RESTful endpoint (`POST /api/testimonials`) with server-side validation and multipart/form-data support for optional photo uploads.
- **Database Persistence**: Stores submitted testimonials in SQLite with an automatic default status of `Pending`.

### Task 2: Moderation Dashboard (`/dashboard`)
- **Review Dashboard**: Responsive public moderation page displaying all submitted testimonials ordered newest first, complete with live stats counters (Pending vs Approved vs Rejected).
- **Status Badges & Optimistic UI**: Distinct color-coded badges (Yellow/Pending, Green/Approved, Red/Rejected). Clicking Approve or Reject updates the badge in real time without reloading the webpage.
- **Moderation APIs**: RESTful endpoints (`GET /api/testimonials`, `PATCH /api/testimonials/:id/approve`, and `PATCH /api/testimonials/:id/reject`) with robust 404 validation and CORS support.

### Task 3: Public Testimonial Wall & Embeddable Widget (`/wall` & `/widget`)
- **Public Wall (`/wall`)**: Displays ONLY approved testimonials in a responsive masonry/grid layout. Automatically calculates and displays vibrant colored circle initials avatars (e.g., `"AS"` for Alice Smith) when no customer photo is uploaded.
- **Approved-Only Backend API (`GET /api/testimonials/approved`)**: RESTful endpoint strictly filtering by `status === 'Approved'` ordered by newest first, guaranteeing zero leakage of Pending or Rejected reviews.
- **Embeddable Widget (`/widget`)**: Lightweight, transparent iframe view designed for third-party embedding. Dynamically parses URL search parameters (`?accent=%23ef4444` or `?accent=#10b981`) to style star icons, badges, and card borders in real time.
- **Standalone Proof of Concept (`demo.html`)**: Standalone corporate landing page demonstrating live iframe embedding (`<iframe src="http://localhost:5173/widget" ...>`) with interactive JavaScript buttons to test live theme switching.
