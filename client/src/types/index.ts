export type Role = 'ADMIN' | 'STUDENT' | 'LECTURER';
export type Semester = 'FIRST' | 'SECOND';
export type PeriodStatus = 'DRAFT' | 'OPEN' | 'CLOSED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  student?: StudentProfile;
  lecturer?: LecturerProfile;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  _count?: {
    students: number;
    courses: number;
    lecturers: number;
  };
}

export interface StudentProfile {
  id: string;
  userId: string;
  matricNumber: string;
  departmentId: string;
  level: number;
  department?: Department;
  user?: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
  };
}

export interface LecturerProfile {
  id: string;
  userId: string;
  staffId: string;
  departmentId: string;
  department?: Department;
  user?: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: string;
  };
}

export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnit: number;
  departmentId: string;
  level: number;
  department?: Department;
}

export interface CourseAssignment {
  id: string;
  lecturerId: string;
  courseId: string;
  academicSession: string;
  semester: Semester;
  createdAt: string;
  lecturer: {
    id: string;
    staffId: string;
    user: {
      name: string;
      email: string;
    };
    department?: Department;
  };
  course: {
    id: string;
    code: string;
    title: string;
    creditUnit: number;
    department?: Department;
  };
  _count?: {
    evaluations: number;
  };
}

export interface EvaluationPeriod {
  id: string;
  title: string;
  academicSession: string;
  semester: Semester;
  startDate: string;
  endDate: string;
  status: PeriodStatus;
  createdAt: string;
  _count?: {
    evaluations: number;
  };
}

export interface EvaluationQuestion {
  id: string;
  questionText: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface EligibleEvaluation {
  assignmentId: string;
  courseCode: string;
  courseTitle: string;
  creditUnit: number;
  level: number;
  lecturerName: string;
  academicSession: string;
  semester: Semester;
  isCompleted: boolean;
}

export interface StudentDashboardData {
  student: {
    id: string;
    matricNumber: string;
    department: string;
    level: number;
  };
  activePeriod: {
    id: string;
    title: string;
    academicSession: string;
    semester: Semester;
    startDate: string;
    endDate: string;
  } | null;
  totalEligible: number;
  completedCount: number;
  pendingCount: number;
  evaluations: EligibleEvaluation[];
}

export interface EvaluationHistoryItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  lecturerName: string;
  academicSession: string;
  semester: Semester;
  submittedAt: string;
  periodTitle: string;
}

export interface LecturerDashboardData {
  lecturer: {
    id: string;
    name: string;
    staffId: string;
    department: string;
  };
  activePeriod: {
    id: string;
    title: string;
    academicSession: string;
    semester: Semester;
  } | null;
  totalEvaluations: number;
  coursesEvaluatedCount: number;
  overallAverage: number;
}

export interface LecturerAnalyticsData {
  totalEvaluations: number;
  overallAverage: number;
  criteriaAverages: Array<{
    criterion: string;
    average: number;
    responsesCount: number;
  }>;
  coursesBreakdown: Array<{
    courseCode: string;
    courseTitle: string;
    average: number;
    evaluationCount: number;
  }>;
  ratingDistribution: Array<{
    rating: number;
    count: number;
    label: string;
  }>;
}

export interface LecturerCommentItem {
  id: string;
  comment: string;
  courseCode: string;
  courseTitle: string;
  submittedAt: string;
  session: string;
  author: string;
}

export interface AdminDashboardData {
  totalStudents: number;
  totalLecturers: number;
  totalDepartments: number;
  totalCourses: number;
  totalEvaluations: number;
  institutionAverage: number;
  activePeriod: EvaluationPeriod | null;
}

export interface AdminReportsData {
  totalEvaluationsFound: number;
  lecturerSummaries: Array<{
    lecturerId: string;
    lecturerName: string;
    staffId: string;
    departmentName: string;
    evaluationCount: number;
    coursesCount: number;
    coursesList: string;
    averageScore: number;
  }>;
}
