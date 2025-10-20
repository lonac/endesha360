import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import SchoolOwnerProtectedRoute from './components/SchoolOwnerProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Pages
import Home from './pages/Home';
import RegisterRoute from './routes/RegisterRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import ResultsProgressPage from './pages/ResultsProgressPage';
import ExamPage from './pages/ExamPage';
import StudentProtectedRoute from './components/StudentProtectedRoute';
import ExamResultPage from './pages/ExamResultPage';
import SchoolRegistration from './pages/SchoolRegistration';
import AdminLogin from './pages/AdminLogin';
import AdminOverview from './pages/AdminOverview';
import SchoolManagement from './pages/SchoolManagement';
import QuestionManagement from './pages/QuestionManagement';
import UserManagement from './pages/UserManagement';
import FinancialManagement from './pages/FinancialManagement';
import AnalyticsReports from './pages/AnalyticsReports';
import SystemSettings from './pages/SystemSettings';
import SupportLogs from './pages/SupportLogs';
import SelectRole from './pages/SelectRole';
import ComingSoon from './pages/ComingSoon';
import StudentProfile from './pages/student/StudentProfile';
import SchoolMarketingProfile from './pages/SchoolMarketingProfile';
import SchoolAdvertisement from './pages/SchoolAdvertisement';
// import SchoolsDirectory from './pages/SchoolsDirectory';

      <Route 
        path="/select-role" 
        element={
          <SelectRole />
        } 
      />

// Layout wrapper component
const Layout = ({ children }) => (
  <div className="min-h-screen bg-[#F1F6F9]">
    <Header />
    <main>{children}</main>
  </div>
);

// App content component
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const { isAdminAuthenticated } = useAdmin();

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          <Layout>
            <Home />
          </Layout>
        } 
      />
      
      {/* Auth routes - use RegisterRoute for /register logic */}
      <Route 
        path="/register" 
        element={<RegisterRoute />} 
      />
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        } 
      />
      
      {/* Admin routes */}
      <Route 
        path="/admin/login" 
        element={
          isAdminAuthenticated ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <AdminLogin />
          )
        } 
      />
      <Route 
        path="/admin/schools" 
        element={
          <AdminProtectedRoute>
            <SchoolManagement />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminProtectedRoute>
            <AdminOverview />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/admin/questions" 
        element={
          <AdminProtectedRoute>
            <QuestionManagement />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <AdminProtectedRoute>
            <UserManagement />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/admin/financial" 
        element={
          <AdminProtectedRoute>
            <FinancialManagement />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/admin/reports" 
        element={
          <AdminProtectedRoute>
            <AnalyticsReports />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/admin/settings" 
        element={
          <AdminProtectedRoute>
            <SystemSettings />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/admin/logs" 
        element={
          <AdminProtectedRoute>
            <SupportLogs />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/select-role" 
        element={
          <SelectRole />
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <SchoolOwnerProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </SchoolOwnerProtectedRoute>
        } 
      />
      <Route
        path="/student-dashboard"
        element={
          <StudentProtectedRoute>
            <Layout>
              <StudentDashboard />
            </Layout>
          </StudentProtectedRoute>
        }
      />
       <Route
          path="/results-progress"
          element={
            <StudentProtectedRoute>
              <Layout>
                <ResultsProgressPage />
              </Layout>
            </StudentProtectedRoute>
          }
        />
      <Route
        path="/exam"
        element={
          <StudentProtectedRoute>
            <Layout>
              <ExamPage />
            </Layout>
          </StudentProtectedRoute>
        }
      />
      <Route
        path="/exam-result"
        element={
          <StudentProtectedRoute>
            <Layout>
              <ExamResultPage />
            </Layout>
          </StudentProtectedRoute>
        }
      />
      <Route 
        path="/school-registration" 
        element={
          <ProtectedRoute>
            <Layout>
              <SchoolRegistration />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/school-marketing-profile" 
        element={
          <SchoolOwnerProtectedRoute>
            <Layout>
              <SchoolMarketingProfile />
            </Layout>
          </SchoolOwnerProtectedRoute>
        } 
      />
      <Route 
        path="/coming-soon"
        element={
          <Layout>
            <ComingSoon />
          </Layout>
        }
      />
      <Route
        path="/student/profile"
        element={
          <StudentProtectedRoute>
            <Layout>
              <StudentProfile />
            </Layout>
          </StudentProtectedRoute>
        }
      />
      {/* Public school directory */}
      {/* <Route 
        path="/schools" 
        element={
          <Layout>
            <SchoolsDirectory />
          </Layout>
        } 
      /> */}
      <Route 
        path="/schools/:schoolId" 
        element={
          <Layout>
            <SchoolAdvertisement />
          </Layout>
        } 
      />
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <AppContent />
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
