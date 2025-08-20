import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Pages
import Home from './pages/Home';
import RegisterRoute from './routes/RegisterRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentProtectedRoute from './components/StudentProtectedRoute';
import SchoolRegistration from './pages/SchoolRegistration';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SelectRole from './pages/SelectRole';
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
        path="/admin/dashboard" 
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
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
        path="/school-registration" 
        element={
          <ProtectedRoute>
            <Layout>
              <SchoolRegistration />
            </Layout>
          </ProtectedRoute>
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
