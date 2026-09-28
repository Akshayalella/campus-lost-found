import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api';
import { ROLES } from '../constants';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Student' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      return setError('Please fill in all fields');
    }
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');

    setSubmitting(true);
    try {
      await register({ ...form, name: form.name.trim(), email: form.email.trim() });
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card form" onSubmit={onSubmit} noValidate>
        <h2>Create your account</h2>
        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <label htmlFor="name">Full Name</label>
        <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Your full name" />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@college.edu" />

        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={form.role} onChange={onChange}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={onChange} placeholder="At least 6 characters" />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} placeholder="Repeat password" />

        <button className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
        <p className="form-foot">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
