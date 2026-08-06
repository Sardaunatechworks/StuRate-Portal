# Database Schema Documentation

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o| Student : "has profile"
    User ||--o| Lecturer : "has profile"
    Department ||--o{ Student : "belongs to"
    Department ||--o{ Lecturer : "belongs to"
    Department ||--o{ Course : "offers"
    Course ||--o{ CourseAssignment : "assigned in"
    Lecturer ||--o{ CourseAssignment : "teaches"
    Student ||--o{ StudentEnrollment : "enrolled in"
    CourseAssignment ||--o{ StudentEnrollment : "has students"
    CourseAssignment ||--o{ Evaluation : "receives"
    EvaluationPeriod ||--o{ Evaluation : "conducted during"
    Student ||--o{ Evaluation : "submits (confidential link)"
    Evaluation ||--|{ EvaluationRating : "contains"
    EvaluationQuestion ||--o{ EvaluationRating : "rated in"

    User {
        string id PK
        string email UK
        string passwordHash
        string name
        enum role
    }

    Department {
        string id PK
        string code UK
        string name
    }

    Course {
        string id PK
        string code UK
        string title
        int creditUnit
    }

    CourseAssignment {
        string id PK
        string courseId FK
        string lecturerId FK
        string academicSession
        enum semester
    }

    EvaluationPeriod {
        string id PK
        string title
        boolean isActive
    }

    EvaluationQuestion {
        string id PK
        string questionText
        string category
        int order
    }

    Evaluation {
        string id PK
        string courseAssignmentId FK
        string studentId FK
        string evaluationPeriodId FK
        string comment
    }

    EvaluationRating {
        string id PK
        string evaluationId FK
        string questionId FK
        int rating
    }
```

---

## Business Integrity Constraints

1. **Unique Evaluation Constraint**:
   ```sql
   ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_student_course_period_key" 
   UNIQUE ("studentId", "courseAssignmentId", "evaluationPeriodId");
   ```
   Enforces that a student cannot evaluate the same lecturer for the same course twice within an evaluation session.

2. **Cascade & Historical Persistence**:
   - `Evaluation.studentId` is set to `ON DELETE SET NULL`. If a student record is removed, historical evaluation scores remain intact for institution reports.
