import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ roles, children }) {
  const { user, token, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="state-box">Loading...</div>;
  if (!user || !token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}
