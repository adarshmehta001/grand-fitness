# The Grand Fitness — Full-Stack Gym Application

A complete, production-quality gym application built with React, Vite, TypeScript, Node.js, Express, Prisma, PostgreSQL, and Stripe.



## Getting Started

### Prerequisites

You need **Node.js 18 or later** installed on your machine.
A **PostgreSQL** database is required (local or cloud-hosted like Neon or Supabase).
A **Stripe** account is required for payment processing.

### Environment Setup

#### 1. Backend (`/server`)
Create a `.env` file in the `server` directory with the following variables:
```env
PORT=3001
FRONTEND_URL=http://localhost:5173

# Authentication
JWT_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Database
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...
```

#### 2. Frontend (Root)
Create a `.env` file in the project root:
```env
VITE_API_URL=http://localhost:3001
```

### Install & Run

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd server
npm install

# 3. Setup the database (from the server directory)
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 4. Start the backend server
npm run dev

# 5. Open a new terminal and start the frontend (from the root directory)
npm run dev
```

Then open your browser to **http://localhost:5173**

---

## Features & Architecture

This application is a complete full-stack solution featuring:

### Frontend (React + Vite)
- **Dynamic UI**: Built with React 18, React Router v6, and TypeScript.
- **3D Hero**: Interactive 3D dumbbell built using React Three Fiber and Three.js.
- **State Management**: Custom `useData` hook for centralized API fetching and error/loading state handling.
- **Authentication**: JWT-based auth flow with silent refresh tokens (HTTP-only cookies) and protected routes.
- **Accessibility**: Full keyboard navigation, ARIA live regions, focus trapping in modals, and `prefers-reduced-motion` support.

### Backend (Node.js + Express)
- **REST API**: Centralized routing for Memberships, Programs, Gallery, Schedule, and Enquiries.
- **Database**: PostgreSQL managed via Prisma ORM.
- **Authentication**: Secure registration, login, token refresh, and full forgot-password flows (using Argon2).
- **Email Services**: Integrated with Resend API for password reset emails and enquiry notifications.
- **Payments**: Full Stripe Checkout integration with webhook handling for membership subscriptions.
- **Rate Limiting**: Protection on public endpoints (e.g., Contact form) to prevent spam.

---

## Site Pages

| URL | Page | Description |
|---|---|---|
| `/` | Home | 3D hero, featured sections |
| `/about` | About | Gym story, philosophy, facilities |
| `/programs` | Programs | Filterable program list (Live API) |
| `/programs/:slug` | Program Detail | Dynamic program details (Live API) |
| `/memberships` | Memberships | Membership plans with Stripe Checkout |

| `/gallery` | Gallery | Facilities gallery with lightbox (Live API) |
| `/schedule` | Schedule | Weekly class timetable (Live API) |
| `/contact` | Contact | Contact and enquiry form (Live API with Rate Limiting) |
| `/login` & `/register` | Auth | User authentication and account creation |
| `/forgot-password` & `/reset-password` | Auth | Secure password recovery workflow |
| `/profile` | Dashboard | Protected route for member profile, favorites, and enquiry history |
| `*` | 404 | Not Found |

---

## 3D Hero

The homepage features an interactive 3D dumbbell built using **React Three Fiber** and **Three.js**. It:
- Rotates slowly with subtle pointer tracking
- Pauses when scrolled off screen
- Pauses when the browser tab is hidden
- Shows a CSS fallback when WebGL is unavailable
- Is fully disabled when `prefers-reduced-motion` is set

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend UI framework |
| Vite | Frontend Build tool and dev server |
| TypeScript | Type safety (Frontend & Backend) |
| Node.js & Express | Backend API server |
| Prisma | ORM |
| PostgreSQL | Relational Database |
| Stripe | Payment processing |
| Resend | Email API |
| Zod | Schema validation |
| React Router v6 | Client-side routing |
| React Three Fiber | 3D rendering (homepage hero) |
| Three.js | 3D geometry and materials |
| Lucide React | Icons |
| CSS Custom Properties | Design tokens |
