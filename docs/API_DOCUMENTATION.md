# REST API Reference Documentation

## Base URL
`/api`

---

## 1. Authentication Endpoints

### `POST /auth/login`
Authenticates a user and returns a JWT access token.

#### Request Body
```json
{
  "email": "admin@university.edu.ng",
  "password": "Password123!"
}
```

#### Response (200 OK)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "usr-admin-1",
    "email": "admin@university.edu.ng",
    "name": "System Administrator",
    "role": "ADMIN"
  }
}
```

---

## 2. Administrator Endpoints (Requires ADMIN Token)

### `GET /admin/students`
Retrieves list of all enrolled students.

### `POST /admin/students`
Creates a new student account.

### `GET /admin/lecturers`
Retrieves list of academic staff.

### `GET /admin/courses`
Retrieves course catalog.

### `GET /admin/assignments`
Retrieves lecturer course assignments.

### `POST /admin/evaluation-periods`
Creates a new evaluation period.

### `PATCH /admin/evaluation-periods/:id/toggle`
Toggles an evaluation period's active status.

---

## 3. Student Endpoints (Requires STUDENT Token)

### `GET /student/courses`
Returns courses assigned to student with evaluation completion status.

### `POST /student/evaluations`
Submits 5-point ratings across 9 questions + optional comment.

---

## 4. Lecturer Endpoints (Requires LECTURER Token)

### `GET /lecturer/dashboard`
Returns overall rating score gauge, response counts, and anonymized student feedback feed.
