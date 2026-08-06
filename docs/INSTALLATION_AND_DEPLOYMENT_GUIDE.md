# Installation and Deployment Guide

## Prerequisites
- Node.js (v18.x or higher)
- npm or yarn
- PostgreSQL Database Instance (or Neon Cloud PostgreSQL URL)

---

## 1. Local Development Setup

### Backend Setup (`/server`)
```bash
cd server
npm install
cp .env.example .env
```

Configure `.env` with your PostgreSQL database connection string:
```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/sturatsys?schema=public"
JWT_SECRET="super-secret-student-rating-jwt-key-2026"
```

#### Run Database Migrations & Seed Data:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

#### Start Express Server:
```bash
npm run dev
```
The backend API server will run at `http://localhost:5000`.

---

### Frontend Setup (`/client`)
```bash
cd client
npm install
npm run dev
```
The React frontend application will run at `http://localhost:3000`.

---

## 2. Seed Account Credentials

| Role | Email | Password | Access Portal |
|:---|:---|:---|:---|
| **Administrator** | `admin@university.edu.ng` | `Password123!` | `/admin/dashboard` |
| **Student** | `john.doe@student.university.edu.ng` | `Password123!` | `/student/dashboard` |
| **Lecturer** | `alan.turing@university.edu.ng` | `Password123!` | `/lecturer/dashboard` |
