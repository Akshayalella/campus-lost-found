import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../constants';

export default function ItemDetails() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);

  // Re-fetch when auth state changes so contact info appears/disappears correctly
  useEffect(() => {
    if (authLoading) return undefined;
    let cancelled = false;
    setLoading(true);
    setError('');
    api
      .get(`/items/${id}`)
      .then((res) => {
        if (!cancelled) setItem(res.data.item);
      })
      .catch((err) => {
        if (!cancelled) {
          setItem(null);
          setError(getErrorMessage(err, 'Could not load this item.'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, user, authLoading]);

  const resolve = async () => {
    setActionError('');
    setBusy(true);
    try {
      const res = await api.patch(`/items/${id}/resolve`);
      setItem({ ...item, status: res.data.item.status });
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this post permanently?')) return;
    setActionError('');
    setBusy(true);
    try {
      await api.delete(`/items/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setActionError(getErrorMessage(err));
      setBusy(false);
    }
  };

  if (loading || authLoading) return <div className="state-box">Loading item...</div>;
  if (error || !item) {
    return (
      <div className="state-box">
        <h3>{error || 'Item not found'}</h3>
        <Link to="/items" className="btn btn-primary">Back to Browse Items</Link>
      </div>
    );
  }

  return (
    <div className="details-wrap">
      {location.state && location.state.created && (
        <div className="alert alert-success">Your item was posted successfully.</div>
      )}
      <div className="card details">
        <div className="item-card-top">
          <span className={item.type === 'Lost' ? 'badge badge-lost' : 'badge badge-found'}>{item.type}</span>
          <span className={item.status === 'Resolved' ? 'badge badge-resolved' : 'badge badge-active'}>
            {item.status}
          </span>
        </div>
        <h1>{item.title}</h1>
        {item.status === 'Resolved' && (
          <div className="alert alert-success">This item has been resolved.</div>
        )}
        <p className="details-desc">{item.description}</p>

        <dl className="details-grid">
          <div><dt>Type</dt><dd>{item.type}</dd></div>
          <div><dt>Category</dt><dd>{item.category}</dd></div>
          <div><dt>Location</dt><dd>{item.location}</dd></div>
          <div><dt>Date</dt><dd>{formatDate(item.date)}</dd></div>
          <div><dt>Status</dt><dd>{item.status}</dd></div>
          <div>
            <dt>Posted by</dt>
            <dd>{item.createdBy ? `${item.createdBy.name} (${item.createdBy.role})` : 'Unknown'}</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>
              {user ? (
                item.contact
              ) : (
                <span>
                  <Link to="/login" state={{ from: `/items/${id}` }}>Login</Link> to view contact information
                </span>
              )}
            </dd>
          </div>
        </dl>

        {actionError && <div className="alert alert-error" role="alert">{actionError}</div>}

        <div className="actions">
          <Link to="/items" className="btn btn-outline">Back to Items</Link>
          {item.status === 'Active' && (item.isOwner || user?.role === 'Owner' || (user?.role === 'Faculty' && item.createdBy?.role === 'Student')) && (
            <button className="btn btn-success" onClick={resolve} disabled={busy}>Mark as Resolved</button>
          )}
          {(item.isOwner || user?.role === 'Owner') && (
            <button className="btn btn-danger" onClick={remove} disabled={busy}>Delete</button>
          )}
        </div>
        {!item.isOwner && user && (
          <p className="muted">Use the contact information above to reach the person who posted this item.</p>
        )}
      </div>
    </div>
  );
}
