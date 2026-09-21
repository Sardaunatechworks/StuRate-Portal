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

// Response interceptor: standardize error extraction and handle expired sessions
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('srtes_token');
      localStorage.removeItem('srtes_user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/' && !path.startsWith('/signup')) {
        window.location.href = '/login';
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

// Helper to unpack both wrapped `{ data: ... }` and direct payload responses
const unpack = <T>(res: any): T => {
  if (res && res.data !== undefined) {
    if (res.data.data !== undefined) return res.data.data as T;
    return res.data as T;
  }
  return res as T;
};

// Auth APIs
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await API.post('/auth/login', credentials);
    const data = res.data?.data || res.data;
    const token = data?.token || data?.accessToken || data?.jwt || res.data?.token;
    const user = data?.user || (data?.role ? data : res.data?.user);
    return { token, user } as { token: string; user: User };
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
    const resData = res.data?.data || res.data;
    const token = resData?.token || resData?.accessToken || resData?.jwt || res.data?.token;
    const user = resData?.user || (resData?.role ? resData : res.data?.user);
    return { token, user } as { token: string; user: User };
  },
  getMe: async () => {
    const res = await API.get('/auth/me');
    const data = res.data?.data || res.data?.user || res.data;
    return data as User;
  },
  changePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    const res = await API.post('/auth/change-password', passwords);
    return unpack(res);
  },
  updateProfile: async (data: { name: string }) => {
    const res = await API.put('/auth/profile', data);
    return unpack<User>(res);
  },
};

// Department APIs
// Department APIs
export const departmentApi = {
  getAll: async () => {
    const res = await API.get('/departments');
    return unpack<Department[]>(res);
  },
  getById: async (id: string) => {
    const res = await API.get(`/departments/${id}`);
    return unpack<Department>(res);
  },
  create: async (data: { name: string; code: string }) => {
    const res = await API.post('/departments', data);
    return unpack<Department>(res);
  },
  update: async (id: string, data: { name?: string; code?: string }) => {
    const res = await API.put(`/departments/${id}`, data);
    return unpack<Department>(res);
  },
};

// Course APIs
export const courseApi = {
  getAll: async (params?: { departmentId?: string; level?: number; search?: string }) => {
    const res = await API.get('/courses', { params });
    return unpack<Course[]>(res);
  },
  getById: async (id: string) => {
    const res = await API.get(`/courses/${id}`);
    return unpack<Course>(res);
  },
  create: async (data: {
    code: string;
    title: string;
    creditUnit: number;
    departmentId: string;
    level: number;
  }) => {
    const res = await API.post('/courses', data);
    return unpack<Course>(res);
  },
  update: async (id: string, data: Partial<Course>) => {
    const res = await API.put(`/courses/${id}`, data);
    return unpack<Course>(res);
  },
};

// Lecturer APIs
export const lecturerApi = {
  getAll: async (params?: { departmentId?: string; search?: string }) => {
    const res = await API.get('/lecturers', { params });
    return unpack<LecturerProfile[]>(res);
  },
  getById: async (id: string) => {
    const res = await API.get(`/lecturers/${id}`);
    return unpack<LecturerProfile>(res);
  },
  create: async (data: {
    name: string;
    email: string;
    staffId: string;
    departmentId: string;
    password: string;
  }) => {
    const res = await API.post('/lecturers', data);
    return unpack<LecturerProfile>(res);
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
    return unpack<LecturerProfile>(res);
  },
};

// Student APIs
export const studentApi = {
  getAll: async (params?: { departmentId?: string; level?: number; search?: string }) => {
    const res = await API.get('/students', { params });
    return unpack<StudentProfile[]>(res);
  },
  getById: async (id: string) => {
    const res = await API.get(`/students/${id}`);
    return unpack<StudentProfile>(res);
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
    return unpack<StudentProfile>(res);
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
    return unpack<StudentProfile>(res);
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
    return unpack<CourseAssignment[]>(res);
  },
  create: async (data: {
    lecturerId: string;
    courseId: string;
    academicSession: string;
    semester: Semester;
  }) => {
    const res = await API.post('/course-assignments', data);
    return unpack<CourseAssignment>(res);
  },
  delete: async (id: string) => {
    const res = await API.delete(`/course-assignments/${id}`);
    return unpack(res);
  },
};

// Evaluation Period APIs
export const periodApi = {
  getAll: async () => {
    const res = await API.get('/evaluation-periods');
    return unpack<EvaluationPeriod[]>(res);
  },
  getActive: async () => {
    const res = await API.get('/evaluation-periods/active');
    return unpack<EvaluationPeriod | null>(res);
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
    return unpack<EvaluationPeriod>(res);
  },
  update: async (id: string, data: Partial<EvaluationPeriod>) => {
    const res = await API.put(`/evaluation-periods/${id}`, data);
    return unpack<EvaluationPeriod>(res);
  },
  setStatus: async (id: string, status: PeriodStatus) => {
    const res = await API.patch(`/evaluation-periods/${id}/status`, { status });
    return unpack<EvaluationPeriod>(res);
  },
};

// Evaluation Question APIs
export const questionApi = {
  getAll: async () => {
    const res = await API.get('/evaluation-questions');
    return unpack<EvaluationQuestion[]>(res);
  },
  getActive: async () => {
    const res = await API.get('/evaluation-questions/active');
    return unpack<EvaluationQuestion[]>(res);
  },
  create: async (data: {
    category: string;
    questionText: string;
    order: number;
    isActive?: boolean;
  }) => {
    const res = await API.post('/evaluation-questions', data);
    return unpack<EvaluationQuestion>(res);
  },
  update: async (id: string, data: Partial<EvaluationQuestion>) => {
    const res = await API.put(`/evaluation-questions/${id}`, data);
    return unpack<EvaluationQuestion>(res);
  },
};

// Student Evaluation APIs
export const studentEvalApi = {
  getDashboard: async () => {
    const res = await API.get('/student/evaluations/dashboard');
    return unpack<StudentDashboardData>(res);
  },
  getEligible: async () => {
    const res = await API.get('/student/evaluations/eligible');
    return unpack<EligibleEvaluation[]>(res);
  },
  getFormDetails: async (assignmentId: string) => {
    const res = await API.get(`/student/evaluations/form/${assignmentId}`);
    return unpack<{
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
    }>(res);
  },
  submit: async (data: {
    courseAssignmentId: string;
    comment?: string;
    ratings: Array<{ questionId: string; rating: number }>;
  }) => {
    const res = await API.post('/student/evaluations', data);
    return unpack(res);
  },
  getHistory: async () => {
    const res = await API.get('/student/evaluations/history');
    return unpack<EvaluationHistoryItem[]>(res);
  },
};

// Lecturer Portal APIs (Strictly Anonymous)
export const lecturerPortalApi = {
  getDashboard: async () => {
    const res = await API.get('/lecturer/dashboard');
    return unpack<LecturerDashboardData>(res);
  },
  getAnalytics: async () => {
    const res = await API.get('/lecturer/analytics');
    return unpack<LecturerAnalyticsData>(res);
  },
  getComments: async () => {
    const res = await API.get('/lecturer/comments');
    return unpack<LecturerCommentItem[]>(res);
  },
};

// Admin Portal APIs
export const adminPortalApi = {
  getDashboard: async () => {
    const res = await API.get('/admin/dashboard');
    return unpack<AdminDashboardData>(res);
  },
  getReports: async (params?: {
    departmentId?: string;
    courseId?: string;
    lecturerId?: string;
    evaluationPeriodId?: string;
  }) => {
    const res = await API.get('/admin/reports', { params });
    return unpack<AdminReportsData>(res);
  },
};

export default API;
