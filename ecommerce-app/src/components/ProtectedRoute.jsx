import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessProtectedRoute } from '../logic/auth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const access = canAccessProtectedRoute(isAuthenticated, loading);

  if (access.status === 'loading') {
    return (
      <div className="page-loading" data-testid="auth-loading">
        Loading...
      </div>
    );
  }

  if (access.status === 'redirect') {
    return <Navigate to={access.to} replace state={{ from: location }} />;
  }

  return children;
}
