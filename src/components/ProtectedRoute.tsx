import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, isLoading, appLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect logged-in users away from landing page
  React.useEffect(() => {
    if (user && location.pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 transition-colors">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (appLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 transition-colors mt-4">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Store the attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;