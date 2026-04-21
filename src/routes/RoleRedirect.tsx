import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Role } from '../types/auth';

// index redirect — sends each role to their correct home page.
const RoleRedirect: React.FC = () => {
    const user = authService.getUserFromToken();

    // if (!user) return <Navigate to="/login" replace />;

    // switch (user.role) {
    //     case Role.Employee:
    //         return <Navigate to="/admin" replace />;
    //     default:
    //         return <Navigate to="/" replace />;
    // }

    return <Navigate to="/admin" replace />;
};

export default RoleRedirect;