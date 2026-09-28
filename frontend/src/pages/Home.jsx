import { Link } from 'react-router-dom';

const FEATURES = [
  { title: 'Report Lost Items', text: 'Lost something on campus? Post the details so others can help you find it.' },
  { title: 'Report Found Items', text: 'Found something? Post it so the rightful owner can get it back.' },
  { title: 'Search Easily', text: 'Search by title, description or location and filter by type and category.' },
  { title: 'Manage Your Posts', text: 'Track your posts from your dashboard, mark them resolved or delete them.' },
];

export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Campus Lost &amp; Found</h1>
        <p className="hero-sub">Find what you lost. Return what you found.</p>
        <p className="hero-text">
          A simple platform for students, faculty and owners on campus to report, search and resolve
          lost and found items in one place.
        </p>
        <div className="hero-actions">
          <Link to="/items" className="btn btn-primary">Browse Items</Link>
          <Link to="/add-item?type=Lost" className="btn btn-accent">Report Lost Item</Link>
          <Link to="/add-item?type=Found" className="btn btn-success">Report Found Item</Link>
        </div>
      </section>

      <section>
        <h2 className="section-title">What you can do</h2>
        <div className="grid grid-4">
          {FEATURES.map((f) => (
            <div className="card feature-card" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
