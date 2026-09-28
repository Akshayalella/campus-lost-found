import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'Student') return <Navigate to="/student-dashboard" replace />;
  if (user?.role === 'Faculty') return <Navigate to="/faculty-dashboard" replace />;
  if (user?.role === 'Owner') return <Navigate to="/owner-dashboard" replace />;
  return <div className="state-box">Unable to determine your role.</div>;
}
