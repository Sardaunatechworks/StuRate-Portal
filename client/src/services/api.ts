import axios from 'axios';
import {
  User,
  Department,
  Course,
  LecturerProfile,
  StudentProfile,
  CourseAssignment,
  EvaluationPeriod,
  EvaluationQuestion,
  StudentDashboardData,
  EligibleEvaluation,
  EvaluationHistoryItem,
  LecturerDashboardData,
  LecturerAnalyticsData,
  LecturerCommentItem,
  AdminDashboardData,
  AdminReportsData,
  PeriodStatus,
  Semester,
} from '../types';

const getBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (envUrl) {
    const cleanUrl = envUrl.replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  return import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseUrl();

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach bearer token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('srtes_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: standardize error extraction
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Auth APIs
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await API.post('/auth/login', credentials);
    return res.data.data as { token: string; user: User };
  },
  signupStudent: async (data: {
    name: string;
    email: string;
    studentId: string;
    departmentId: string;
    level: number;
    password: string;
  }) => {
    const res = await API.post('/auth/signup/student', data);
    return res.data.data as { token: string; user: User };
  },
  getMe: async () => {
    const res = await API.get('/auth/me');
    return res.data.data as User;
  },
  changePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    const res = await API.post('/auth/change-password', passwords);
    return res.data;
  },
  updateProfile: async (data: { name: string }) => {
    const res = await API.put('/auth/profile', data);
    return res.data.data as User;
  },
};

// Department APIs
export const departmentApi = {
  getAll: async () => {
    const res = await API.get('/departments');
    return res.data.data as Department[];
  },
  getById: async (id: string) => {
    const res = await API.get(`/departments/${id}`);
    return res.data.data as Department;
  },
  create: async (data: { name: string; code: string }) => {
    const res = await API.post('/departments', data);
    return res.data.data as Department;
  },
  update: async (id: string, data: { name?: string; code?: string }) => {
    const res = await API.put(`/departments/${id}`, data);
    return res.data.data as Department;
  },
};

// Course APIs
export const courseApi = {
  getAll: async (params?: { departmentId?: string; level?: number; search?: string }) => {
    const res = await API.get('/courses', { params });
    return res.data.data as Course[];
  },
  getById: async (id: string) => {
    const res = await API.get(`/courses/${id}`);
    return res.data.data as Course;
  },
  create: async (data: {
    code: string;
    title: string;
    creditUnit: number;
    departmentId: string;
    level: number;
  }) => {
    const res = await API.post('/courses', data);
    return res.data.data as Course;
  },
  update: async (id: string, data: Partial<Course>) => {
    const res = await API.put(`/courses/${id}`, data);
    return res.data.data as Course;
  },
};

// Lecturer APIs
export const lecturerApi = {
  getAll: async (params?: { departmentId?: string; search?: string }) => {
    const res = await API.get('/lecturers', { params });
    return res.data.data as LecturerProfile[];
  },
  getById: async (id: string) => {
    const res = await API.get(`/lecturers/${id}`);
    return res.data.data as LecturerProfile;
  },
  create: async (data: {
    name: string;
    email: string;
    staffId: string;
    departmentId: string;
    password: string;
  }) => {
    const res = await API.post('/lecturers', data);
    return res.data.data as LecturerProfile;
  },
  update: async (
    id: string,
    data: {
      name?: string;
      email?: string;
      staffId?: string;
      departmentId?: string;
      password?: string;
      isActive?: boolean;
    }
  ) => {
    const res = await API.put(`/lecturers/${id}`, data);
    return res.data.data as LecturerProfile;
  },
};

// Student APIs
export const studentApi = {
  getAll: async (params?: { departmentId?: string; level?: number; search?: string }) => {
    const res = await API.get('/students', { params });
    return res.data.data as StudentProfile[];
  },
  getById: async (id: string) => {
    const res = await API.get(`/students/${id}`);
    return res.data.data as StudentProfile;
  },
  create: async (data: {
    name: string;
    email: string;
    matricNumber: string;
    departmentId: string;
    level: number;
    password: string;
  }) => {
    const res = await API.post('/students', data);
    return res.data.data as StudentProfile;
  },
  update: async (
    id: string,
    data: {
      name?: string;
      email?: string;
      matricNumber?: string;
      departmentId?: string;
      level?: number;
      password?: string;
      isActive?: boolean;
    }
  ) => {
    const res = await API.put(`/students/${id}`, data);
    return res.data.data as StudentProfile;
  },
};

// Course Assignment APIs
export const assignmentApi = {
  getAll: async (params?: {
    lecturerId?: string;
    courseId?: string;
    academicSession?: string;
    semester?: Semester;
    departmentId?: string;
  }) => {
    const res = await API.get('/course-assignments', { params });
    return res.data.data as CourseAssignment[];
  },
  create: async (data: {
    lecturerId: string;
    courseId: string;
    academicSession: string;
    semester: Semester;
  }) => {
    const res = await API.post('/course-assignments', data);
    return res.data.data as CourseAssignment;
  },
  delete: async (id: string) => {
    const res = await API.delete(`/course-assignments/${id}`);
    return res.data;
  },
};

// Evaluation Period APIs
export const periodApi = {
  getAll: async () => {
    const res = await API.get('/evaluation-periods');
    return res.data.data as EvaluationPeriod[];
  },
  getActive: async () => {
    const res = await API.get('/evaluation-periods/active');
    return res.data.data as EvaluationPeriod | null;
  },
  create: async (data: {
    title: string;
    academicSession: string;
    semester: Semester;
    startDate: string;
    endDate: string;
    status?: PeriodStatus;
  }) => {
    const res = await API.post('/evaluation-periods', data);
    return res.data.data as EvaluationPeriod;
  },
  update: async (id: string, data: Partial<EvaluationPeriod>) => {
    const res = await API.put(`/evaluation-periods/${id}`, data);
    return res.data.data as EvaluationPeriod;
  },
  setStatus: async (id: string, status: PeriodStatus) => {
    const res = await API.patch(`/evaluation-periods/${id}/status`, { status });
    return res.data.data as EvaluationPeriod;
  },
};

// Evaluation Question APIs
export const questionApi = {
  getAll: async () => {
    const res = await API.get('/evaluation-questions');
    return res.data.data as EvaluationQuestion[];
  },
  getActive: async () => {
    const res = await API.get('/evaluation-questions/active');
    return res.data.data as EvaluationQuestion[];
  },
  create: async (data: {
    category: string;
    questionText: string;
    order: number;
    isActive?: boolean;
  }) => {
    const res = await API.post('/evaluation-questions', data);
    return res.data.data as EvaluationQuestion;
  },
  update: async (id: string, data: Partial<EvaluationQuestion>) => {
    const res = await API.put(`/evaluation-questions/${id}`, data);
    return res.data.data as EvaluationQuestion;
  },
};

// Student Evaluation APIs
export const studentEvalApi = {
  getDashboard: async () => {
    const res = await API.get('/student/evaluations/dashboard');
    return res.data.data as StudentDashboardData;
  },
  getEligible: async () => {
    const res = await API.get('/student/evaluations/eligible');
    return res.data.data as EligibleEvaluation[];
  },
  getFormDetails: async (assignmentId: string) => {
    const res = await API.get(`/student/evaluations/form/${assignmentId}`);
    return res.data.data as {
      assignment: {
        id: string;
        courseCode: string;
        courseTitle: string;
        creditUnit: number;
        departmentName: string;
        lecturerName: string;
        academicSession: string;
        semester: Semester;
      };
      period: { id: string; title: string };
      questions: EvaluationQuestion[];
    };
  },
  submit: async (data: {
    courseAssignmentId: string;
    comment?: string;
    ratings: Array<{ questionId: string; rating: number }>;
  }) => {
    const res = await API.post('/student/evaluations', data);
    return res.data;
  },
  getHistory: async () => {
    const res = await API.get('/student/evaluations/history');
    return res.data.data as EvaluationHistoryItem[];
  },
};

// Lecturer Portal APIs (Strictly Anonymous)
export const lecturerPortalApi = {
  getDashboard: async () => {
    const res = await API.get('/lecturer/dashboard');
    return res.data.data as LecturerDashboardData;
  },
  getAnalytics: async () => {
    const res = await API.get('/lecturer/analytics');
    return res.data.data as LecturerAnalyticsData;
  },
  getComments: async () => {
    const res = await API.get('/lecturer/comments');
    return res.data.data as LecturerCommentItem[];
  },
};

// Admin Portal APIs
export const adminPortalApi = {
  getDashboard: async () => {
    const res = await API.get('/admin/dashboard');
    return res.data.data as AdminDashboardData;
  },
  getReports: async (params?: {
    departmentId?: string;
    courseId?: string;
    lecturerId?: string;
    evaluationPeriodId?: string;
  }) => {
    const res = await API.get('/admin/reports', { params });
    return res.data.data as AdminReportsData;
  },
};

export default API;
