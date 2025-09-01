import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth.js';

export default function PrivateRoute({ children, roles = [] }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.some(role => hasRole(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}