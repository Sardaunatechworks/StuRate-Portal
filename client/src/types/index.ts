export type Role = 'ADMIN' | 'STUDENT' | 'LECTURER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  studentId?: string;
  lecturerId?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  _count?: {
    students: number;
    lecturers: number;
    courses: number;
  };
}

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  level: number;
  departmentId: string;
  user: User;
  department: Department;
}

export interface Lecturer {
  id: string;
  userId: string;
  staffId: string;
  title: string;
  departmentId: string;
  user: User;
  department: Department;
  courseAssignments?: CourseAssignment[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnit: number;
  departmentId: string;
  department?: Department;
}

export interface CourseAssignment {
  id: string;
  courseId: string;
  lecturerId: string;
  academicSession: string;
  semester: string;
  course: Course;
  lecturer: Lecturer;
  _count?: {
    enrollments: number;
    evaluations: number;
  };
}

export interface EvaluationPeriod {
  id: string;
  title: string;
  academicSession: string;
  semester: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface EvaluationQuestion {
  id: string;
  questionText: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface EvaluationRatingInput {
  questionId: string;
  rating: number;
}

export interface SystemAnalytics {
  totalStudents: number;
  totalLecturers: number;
  totalCourses: number;
  totalDepartments: number;
  totalEvaluations: number;
  activePeriod: EvaluationPeriod | null;
  averageRating: number;
  topLecturers: Array<{
    id: string;
    name: string;
    department: string;
    staffId: string;
    evaluationCount: number;
    averageRating: number;
  }>;
  ratingDistribution: Record<number, number>;
}
