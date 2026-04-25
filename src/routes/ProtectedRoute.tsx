import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';
import { Role } from '../types/auth';

interface ProtectedRouteProps {
  requiredRole?: Role;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole) {
    const role = authService.getRole();
    if (role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
