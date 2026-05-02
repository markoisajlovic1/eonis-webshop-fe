import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import type { Role } from '../types/auth';

interface ProtectedRouteProps {
  requiredRole?: Role;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { initializing, isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  if (initializing) return null;

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
