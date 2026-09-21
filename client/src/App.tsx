import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';

// Admin Pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { StudentsPage } from './pages/Admin/StudentsPage';
import { LecturersPage } from './pages/Admin/LecturersPage';
import { DepartmentsPage } from './pages/Admin/DepartmentsPage';
import { CoursesPage } from './pages/Admin/CoursesPage';
import { AssignmentsPage } from './pages/Admin/AssignmentsPage';
import { QuestionsPage } from './pages/Admin/QuestionsPage';
import { EvaluationPeriodPage } from './pages/Admin/EvaluationPeriodPage';
import { ReportsPage } from './pages/Admin/ReportsPage';

// Student Pages
import { StudentDashboard } from './pages/Student/StudentDashboard';
import { EvaluateLecturerPage } from './pages/Student/EvaluateLecturerPage';
import { EvaluationHistoryPage } from './pages/Student/EvaluationHistoryPage';

// Lecturer Pages
import { LecturerDashboard } from './pages/Lecturer/LecturerDashboard';
import { LecturerAnalyticsPage } from './pages/Lecturer/LecturerAnalyticsPage';
import { CommentsPage } from './pages/Lecturer/CommentsPage';

// Shared Pages
import { ProfilePage } from './pages/Shared/ProfilePage';

// Index Redirect Component
const IndexRedirect: React.FC = () => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user.role === 'LECTURER') {
    return <Navigate to="/lecturer/dashboard" replace />;
  } else {
    return <Navigate to="/student/dashboard" replace />;
  }
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/student" element={<Signup />} />

            {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<StudentsPage />} />
              <Route path="/admin/lecturers" element={<LecturersPage />} />
              <Route path="/admin/departments" element={<DepartmentsPage />} />
              <Route path="/admin/courses" element={<CoursesPage />} />
              <Route path="/admin/assignments" element={<AssignmentsPage />} />
              <Route path="/admin/questions" element={<QuestionsPage />} />
              <Route path="/admin/periods" element={<EvaluationPeriodPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/evaluations" element={<StudentDashboard />} />
              <Route
                path="/student/evaluate/:assignmentId"
                element={<EvaluateLecturerPage />}
              />
              <Route path="/student/history" element={<EvaluationHistoryPage />} />
              <Route path="/student/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Lecturer Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['LECTURER']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
              <Route path="/lecturer/analytics" element={<LecturerAnalyticsPage />} />
              <Route path="/lecturer/comments" element={<CommentsPage />} />
              <Route path="/lecturer/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </ModalProvider>
    </AuthProvider>
  );
};

export default App;
