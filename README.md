# Tesko — Full Stack Task Management System

**Company**: Koncepthive Technical Assessment
**Position**: Intern – Full Stack Web Developer
**System Name**: Tesko Task Management System

---

## 🚀 Project Overview

Tesko is a full-stack Task Management System that lets a user authenticate and
manage their daily tasks. It provides complete task CRUD, a dashboard with live
statistics, title-based search, status & priority filtering, sorting, strict
validation on both the frontend and backend, and a responsive light/dark UI.

This project was built for the Koncepthive Full Stack Web Developer Intern
technical assessment.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19 (Vite), TypeScript, Tailwind CSS, React Hook Form, Zod, Axios, Sonner (toasts), next-themes (dark mode), Lucide icons |
| **Backend** | Node.js, Express 5, TypeScript, JSON Web Tokens (JWT), bcryptjs, Zod |
| **Database** | PostgreSQL, managed with Prisma ORM 7 (`@prisma/adapter-pg`) |

---

## 📁 Project Structure

```
Tesko/
├── frontend/          # React + Vite client
│   ├── src/
│   │   ├── components/ # UI + feature components
│   │   ├── context/    # Auth context
│   │   ├── lib/        # Axios API client
│   │   └── types/      # Shared TypeScript types
│   └── .env.example
├── backend/           # Express + Prisma REST API
│   ├── src/
│   │   ├── config/     # Env & Prisma client
│   │   ├── controllers/# Route handlers
│   │   ├── middleware/ # JWT auth
│   │   ├── routes/     # Express routers
│   │   └── validations/# Zod schemas
│   ├── prisma/         # Schema, migrations, seed
│   └── .env.example
├── database/          # SQL schema dump + DB notes
└── README.md
```

---

## 🔐 Default Authentication Credentials

No registration is required (per the assessment). Log in with:

- **Email**: `admin@test.com`
- **Password**: `123456`

A one-click "Auto-fill Default Admin Credentials" button is available on the
login page.

---

## 🌐 Application URLs (local development)

- **Frontend URL**: http://localhost:5173
- **Backend URL / API base**: http://localhost:5000/api

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and fill in the values:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | No | Token lifetime (default `24h`) |
| `PORT` | No | Backend port (default `5000`) |
| `CORS_ORIGIN` | No | Allowed frontend origin (default `http://localhost:5173`) |

Generate a strong `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` (optional):

| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | No | Backend API base URL (default `http://localhost:5000/api`) |

---

## 🗄️ Database Setup

1. Ensure PostgreSQL is running and create a database (e.g. `tesko_db`).
2. Set `DATABASE_URL` in `backend/.env`.
3. Apply the schema using **one** of these approaches (run from `backend/`):

   ```bash
   npx prisma migrate deploy   # apply committed migrations
   # or
   npx prisma db push          # sync schema directly (no migration history)
   ```

4. Seed the default admin user and sample tasks:

   ```bash
   npm run db:seed
   ```

A raw SQL dump of the schema is also provided at
[`database/schema.sql`](database/schema.sql). See
[`database/README.md`](database/README.md) for details.

---

## 📦 Installation & Running

### Prerequisites
- Node.js v18+
- PostgreSQL

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # then edit .env with your values
npx prisma generate
npx prisma migrate deploy    # or: npx prisma db push
npm run db:seed
npm run dev                  # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env         # optional
npm run dev                  # http://localhost:5173
```

---

## 📡 REST API Documentation

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Authenticate with email & password, returns a JWT |
| `GET` | `/auth/me` | JWT | Returns the authenticated user |
| `GET` | `/tasks/stats` | JWT | Dashboard counts (total, pending, in progress, completed, overdue) |
| `GET` | `/tasks` | JWT | List tasks; supports `search`, `status`, `priority`, `sortBy` query params |
| `GET` | `/tasks/:id` | JWT | Get a single task by ID |
| `POST` | `/tasks` | JWT | Create a task |
| `PUT` | `/tasks/:id` | JWT | Update a task |
| `DELETE` | `/tasks/:id` | JWT | Delete a task |

**Query parameters for `GET /tasks`:**

- `search` — case-insensitive substring match on the task title
- `status` — `PENDING` \| `IN_PROGRESS` \| `COMPLETED`
- `priority` — `LOW` \| `MEDIUM` \| `HIGH`
- `sortBy` — `newest` (default) \| `oldest` \| `dueDate`

**Example login request:**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Demo","priority":"HIGH","status":"PENDING","dueDate":"2026-12-31"}'
```

---

## ✨ Features

- **JWT authentication** with bcrypt-hashed passwords and persisted sessions.
- **Dashboard** showing total, pending, in progress, completed and overdue counts.
- **Full task CRUD** with a create/edit modal and quick status actions.
- **Search** by title (updates dynamically as you type).
- **Filtering** by status and priority (combinable).
- **Sorting** by newest created, oldest created, or due date.
- **Validation** on both the frontend (React Hook Form + Zod) and backend
  (Express + Zod) with meaningful error messages.
- **Responsive** layout for desktop, tablet and mobile.

### Bonus features included
- Dark / light mode
- Toast notifications
- Loading indicators / skeletons

---

## 💡 Assumptions & Design Decisions

- **Single default user**: authentication uses the seeded `admin@test.com`
  account; there is no registration flow (per the assessment).
- **Task ownership**: tasks are linked to a user via `userId` (foreign key with
  cascade delete). Task queries are scoped to the authenticated user.
- **Overdue definition**: a task is overdue if its due date is before today and
  its status is not `COMPLETED`.
- **Due date rule**: new tasks cannot be created with a past due date. Existing
  tasks that are already overdue can still be edited (e.g. marked complete)
  without being forced to change their date.
- **Sample data**: the seed script creates a few sample tasks so the dashboard
  and list are populated on first run.

---

## ⚠️ Known Limitations

- Single hard-coded seed user; there is no registration or user management UI.
- No refresh-token rotation — the JWT simply expires after `JWT_EXPIRES_IN`.
- No pagination yet; all matching tasks are returned in one response.
- No automated test suite is included.
- Deletion uses a native browser confirmation dialog rather than a custom modal.

---

## 📤 Submission Checklist

- [x] Frontend + Backend + PostgreSQL database
- [x] JWT authentication with default credentials
- [x] Dashboard, Task CRUD, search, filtering, sorting
- [x] Frontend & backend validation
- [x] Responsive design
- [x] REST API matching the required endpoints
- [x] SQL dump / migration files (`database/`, `backend/prisma/migrations/`)
- [x] `README.md` and `.env.example` (backend & frontend)
