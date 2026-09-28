import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="state-box">
      <h1>404</h1>
      <h3>Page not found</h3>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Go to Home</Link>
    </div>
  );
}
