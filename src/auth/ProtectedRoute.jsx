import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ element, roles }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated && (location.pathname.toLowerCase() === '/login')) {
    return <Navigate to="/Students" replace />;
  }

  if (!isAuthenticated && location.pathname.toLowerCase() !== '/login') {
    return <Navigate to="/Login" replace />;
  }

 

  return element;
};

export default ProtectedRoute;