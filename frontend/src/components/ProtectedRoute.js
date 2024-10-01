import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const {isAuthenticated, user} = useSelector((state) => state.auth); // Get user from Redux store
  const userRole = user?.user.role;
  // If there are allowed roles and the user role is not permitted, navigate to login
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  // // If no user, navigate to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;  // Render protected content
};

export default ProtectedRoute;
