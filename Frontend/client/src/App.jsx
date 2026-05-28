import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded pages for code splitting & faster initial page load
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LobbyPage = lazy(() => import('./pages/LobbyPage'));
const MeetingRoomPage = lazy(() => import('./pages/MeetingRoomPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-offwhite dark:bg-primary text-secondary dark:text-offwhite/70 transition-colors duration-300">
        <div className="w-10 h-10 border-3 border-gray-200 dark:border-border-primary border-t-brand rounded-full animate-spin" />
        <p className="font-[Outfit]">Checking authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-offwhite dark:bg-primary text-secondary dark:text-offwhite/70 transition-colors duration-300">
    <div className="w-10 h-10 border-3 border-gray-200 dark:border-border-primary border-t-brand rounded-full animate-spin" />
    <p className="font-[Outfit]">Loading page...</p>
  </div>
);

const App = () => {
  return (
    <div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/join/:roomId" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lobby/:roomId" 
            element={
              <ProtectedRoute>
                <LobbyPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/room/:roomId" 
            element={
              <ProtectedRoute>
                <MeetingRoomPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            } 
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
