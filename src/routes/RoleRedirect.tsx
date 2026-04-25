import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Role } from '../types/auth';

const RoleRedirect: React.FC = () => {
  const role = authService.getRole();

  if (role === Role.Employee) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/" replace />;
};

export default RoleRedirect;
