import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ModalProvider } from './context/ModalContext';
import { SidebarProvider } from './context/SidebarContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Landing & Auth Pages
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
import { AnalyticsPage } from './pages/Admin/AnalyticsPage';

// Student Pages
import { StudentDashboard } from './pages/Student/StudentDashboard';
import { MyCoursesPage } from './pages/Student/MyCoursesPage';
import { EvaluateLecturerPage } from './pages/Student/EvaluateLecturerPage';
import { EvaluationHistoryPage } from './pages/Student/EvaluationHistoryPage';

// Lecturer Pages
import { LecturerDashboard } from './pages/Lecturer/LecturerDashboard';
import { RatingSummaryPage } from './pages/Lecturer/RatingSummaryPage';
import { CommentsPage } from './pages/Lecturer/CommentsPage';
import { LecturerAnalyticsPage } from './pages/Lecturer/LecturerAnalyticsPage';

// Shared Pages
import { ProfilePage } from './pages/Shared/ProfilePage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ModalProvider>
          <SidebarProvider>
            <Router>
              <Routes>
                {/* Public Landing & Auth Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signup/student" element={<Signup />} />

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/students" element={<StudentsPage />} />
                  <Route path="/admin/lecturers" element={<LecturersPage />} />
                  <Route path="/admin/departments" element={<DepartmentsPage />} />
                  <Route path="/admin/courses" element={<CoursesPage />} />
                  <Route path="/admin/assignments" element={<AssignmentsPage />} />
                  <Route path="/admin/questions" element={<QuestionsPage />} />
                  <Route path="/admin/evaluation-period" element={<EvaluationPeriodPage />} />
                  <Route path="/admin/reports" element={<ReportsPage />} />
                  <Route path="/admin/analytics" element={<AnalyticsPage />} />
                </Route>

                {/* Student Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/courses" element={<MyCoursesPage />} />
                  <Route path="/student/evaluate/:assignmentId" element={<EvaluateLecturerPage />} />
                  <Route path="/student/history" element={<EvaluationHistoryPage />} />
                  <Route path="/student/profile" element={<ProfilePage />} />
                </Route>

                {/* Lecturer Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['LECTURER']} />}>
                  <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
                  <Route path="/lecturer/summary" element={<RatingSummaryPage />} />
                  <Route path="/lecturer/comments" element={<CommentsPage />} />
                  <Route path="/lecturer/analytics" element={<LecturerAnalyticsPage />} />
                  <Route path="/lecturer/profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </SidebarProvider>
        </ModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
