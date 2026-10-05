import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login preserving the attempted page
    const isSeller = allowedRoles && allowedRoles.includes('seller');
    return <Navigate to={isSeller ? "/seller/login" : "/login"} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // User is logged in but lacks the required role
    return <Navigate to="/unauthorized" state={{ from: location, requiredRoles: allowedRoles }} replace />;
  }

  return children;
};
