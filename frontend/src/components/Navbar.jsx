import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const handleLogout = () => {
    logout();
    close();
    navigate('/login');
  };
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          Campus Lost &amp; Found
        </Link>
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '\u2715' : '\u2630'}
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          <NavLink to="/" end className={linkClass} onClick={close}>Home</NavLink>
          <NavLink to="/items" className={linkClass} onClick={close}>Browse Items</NavLink>
          <NavLink to="/add-item" className={linkClass} onClick={close}>Add Item</NavLink>
          <NavLink to="/dashboard" className={linkClass} onClick={close}>My Dashboard</NavLink>
          {user ? (
            <div className="nav-user">
              <span className="nav-user-info">
                {user.name} <span className="badge badge-role">{user.role}</span>
              </span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="nav-user">
              <Link to="/login" className="btn btn-outline btn-sm" onClick={close}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={close}>Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
