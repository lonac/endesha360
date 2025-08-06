import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SchoolRegistration from './pages/SchoolRegistration';

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
      
      {/* Auth routes - redirect to dashboard if already authenticated */}
      <Route 
        path="/register" 
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Register />
          )
        } 
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
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
