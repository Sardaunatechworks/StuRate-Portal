# Student Rating Teachers' Effectiveness System (SRTES)

> **University Final-Year Project Implementation**  
> A complete, secure, and modern academic evaluation management system developed using React, TypeScript, Tailwind CSS, Express.js, PostgreSQL, and Prisma ORM.

---

## 🌟 Key Features

### 🔐 Authentication & Access Control
- Role-based Access Control (RBAC) supporting **Administrator**, **Student**, and **Lecturer** portals.
- Password encryption using `bcrypt` and token authorization via `JWT`.

### 🛡️ Student Evaluation Engine
- Interactive 5-star rating matrix covering **9 teaching effectiveness criteria**:
  1. Subject Knowledge
  2. Teaching Method
  3. Communication Skills
  4. Punctuality
  5. Course Organization
  6. Student Engagement
  7. Fairness in Assessment
  8. Availability to Students
  9. Overall Satisfaction
- **100% Student Anonymity**: Student identities are strictly hidden from lecturer feedback feeds.
- **Duplicate Prevention**: System enforces one evaluation per lecturer per course during active sessions.

### 📊 Lecturer Analytics & Reports
- Overall teaching score gauge and course rating breakdown.
- Anonymized student feedback comments stream.
- Recharts graphical visualizations of score distributions.

### ⚙️ Administration & Academic Governance
- Manage Students, Lecturers, Departments, and Course Catalogs.
- Assign lecturers to specific course offerings.
- Toggle evaluation period sessions (Open/Close).
- Institution-wide read-only summary reports.

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, React Router, Recharts, Axios, Lucide Icons.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Zod.
- **Database & ORM**: PostgreSQL, Prisma ORM.

---

## 📁 Repository Structure

```
Stu-rat-sys/
├── client/                     # Vite + React TypeScript Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable Glassmorphism UI components (Sidebar, Header, RatingStars)
│   │   ├── context/            # React AuthContext with hybrid demo fallback
│   │   ├── pages/              # Auth, Admin, Student, and Lecturer module screens
│   │   ├── services/           # Axios API client & mock datasets
│   │   └── types/              # TypeScript interface definitions
├── server/                     # Express.js REST API Backend
│   ├── prisma/                 # Prisma schema & seed script
│   └── src/                    # API controllers, middleware, and routes
├── docs/                       # Technical Project Documentation
│   ├── SYSTEM_ANALYSIS.md      # Functional requirements, user stories, architecture diagrams
│   ├── DATABASE_DOCUMENTATION.md # ERD, data dictionary, integrity constraints
│   ├── API_DOCUMENTATION.md    # OpenAPI/REST API endpoint specifications
│   └── INSTALLATION_AND_DEPLOYMENT_GUIDE.md # Setup instructions & credentials
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Server Setup
```bash
cd server
npm install
npm run dev
```

### 2. Frontend App Setup
```bash
cd client
npm install
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

### 🔑 Demo Login Credentials
- **Admin**: `admin@university.edu.ng` / `Password123!`
- **Student**: `john.doe@student.university.edu.ng` / `Password123!`
- **Lecturer**: `alan.turing@university.edu.ng` / `Password123!`
