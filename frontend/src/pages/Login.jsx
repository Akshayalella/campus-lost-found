import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api';

const ROLES = [
  { key: 'Student', title: 'Student', subtitle: 'Report and find campus items' },
  { key: 'Faculty', title: 'Faculty', subtitle: 'Review and resolve student reports' },
  { key: 'Owner', title: 'Owner', subtitle: 'Complete system management' },
];

const dashboardFor = (role) => ({ Student: '/student-dashboard', Faculty: '/faculty-dashboard', Owner: '/owner-dashboard' }[role] || '/dashboard');

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectFrom = location.state && location.state.from;
  const [role, setRole] = useState('Student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={dashboardFor(user.role)} replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password) return setError('Email and password are required');
    setSubmitting(true);
    try {
      const loggedUser = await login(form.email.trim(), form.password, role);
      const destination = redirectFrom || dashboardFor(loggedUser.role);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const active = ROLES.find((r) => r.key === role);

  return (
    <div className="auth-wrap">
      <div className="card form login-card">
        <div className="role-tabs" role="tablist" aria-label="Choose login type">
          {ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              className={role === r.key ? 'role-tab active' : 'role-tab'}
              onClick={() => { setRole(r.key); setError(''); }}
              role="tab"
              aria-selected={role === r.key}
            >
              {r.title}
            </button>
          ))}
        </div>

        <div className="login-heading">
          <span className="login-role-icon">{role === 'Owner' ? '👑' : role === 'Faculty' ? '👩‍🏫' : '👨‍🎓'}</span>
          <h2>{active.title} Login</h2>
          <p className="muted">{active.subtitle}</p>
        </div>

        {redirectFrom && <div className="alert alert-info">Please log in to continue.</div>}
        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <form onSubmit={onSubmit} noValidate>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder={`${role.toLowerCase()}@college.edu`} autoComplete="email" />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="Your password" autoComplete="current-password" />

          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Logging in...' : `${role} Login`}
          </button>
        </form>

        <p className="form-foot">New here? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
