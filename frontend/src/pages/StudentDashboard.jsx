import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api';
import { formatDate } from '../constants';

export default function StudentDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true); setError('');
    try { const res = await api.get('/items/my'); setItems(res.data.items); }
    catch (err) { setError(getErrorMessage(err, 'Could not load your reports.')); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const resolve = async (id) => {
    setBusyId(id); setError('');
    try { await api.patch(`/items/${id}/resolve`); setItems((p) => p.map((i) => i._id === id ? { ...i, status: 'Resolved' } : i)); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setBusyId(null); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this report permanently?')) return;
    setBusyId(id); setError('');
    try { await api.delete(`/items/${id}`); setItems((p) => p.filter((i) => i._id !== id)); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setBusyId(null); }
  };

  const active = items.filter((i) => i.status === 'Active').length;
  const resolved = items.filter((i) => i.status === 'Resolved').length;
  return (
    <div>
      <div className="dashboard-hero student-hero"><div><span className="dashboard-kicker">STUDENT PORTAL</span><h1 className="page-title">Student Dashboard</h1><p className="muted">Report lost or found belongings and track your own reports.</p></div><Link to="/add-item" className="btn btn-primary">+ Report Item</Link></div>
      <div className="grid grid-3 stats">
        <div className="card stat"><span className="stat-num">{items.length}</span><span>My Reports</span></div>
        <div className="card stat"><span className="stat-num blue">{active}</span><span>Active</span></div>
        <div className="card stat"><span className="stat-num green">{resolved}</span><span>Resolved</span></div>
      </div>
      <div className="quick-links"><Link to="/items" className="card quick-card"><strong>Browse Items</strong><span>Search all active campus reports</span></Link><Link to="/add-item" className="card quick-card"><strong>Report Lost / Found</strong><span>Create a new campus report</span></Link></div>
      <div className="section-head"><h2 className="section-title">My Reports</h2></div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? <div className="state-box">Loading your reports...</div> : items.length === 0 ? <div className="state-box"><h3>No reports yet</h3><p>Report a lost or found item to get started.</p><Link to="/add-item" className="btn btn-primary">Report Item</Link></div> : (
        <div className="list">{items.map((item) => <div className={item.status === 'Resolved' ? 'card list-row resolved' : 'card list-row'} key={item._id}>
          <div className="list-main"><div className="item-card-top"><span className={item.type === 'Lost' ? 'badge badge-lost' : 'badge badge-found'}>{item.type}</span><span className={item.status === 'Resolved' ? 'badge badge-resolved' : 'badge badge-active'}>{item.status}</span></div><h3 className="item-title">{item.title}</h3><p className="muted">{item.category} · {item.location} · {formatDate(item.date)}</p></div>
          <div className="actions"><Link to={`/items/${item._id}`} className="btn btn-outline btn-sm">View</Link>{item.status === 'Active' && <button className="btn btn-success btn-sm" onClick={() => resolve(item._id)} disabled={busyId === item._id}>Mark Resolved</button>}<button className="btn btn-danger btn-sm" onClick={() => remove(item._id)} disabled={busyId === item._id}>Delete</button></div>
        </div>)}</div>
      )}
    </div>
  );
}
