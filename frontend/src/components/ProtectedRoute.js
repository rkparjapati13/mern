import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Assuming you have a context for user data

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  console.log('asdfasdfasdf', user);

  if (!user && !loading) {
    return <Navigate to="/login" replace />; // Redirect if no user
  }

  if (allowedRoles && !loading && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect if user role is not allowed
  }

  return children; // Render the protected route
};

export default ProtectedRoute;
