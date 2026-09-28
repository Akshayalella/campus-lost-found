import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api';
import ItemCard from '../components/ItemCard';
import { CATEGORIES } from '../constants';

export default function Items() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [type, setType] = useState('All');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    const params = {};
    if (debounced) params.search = debounced;
    if (type !== 'All') params.type = type;
    if (category) params.category = category;

    api
      .get('/items', { params })
      .then((res) => {
        if (!cancelled) setItems(res.data.items);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, 'Could not load items.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced, type, category]);

  const clearFilters = () => {
    setSearch('');
    setType('All');
    setCategory('');
  };
  const hasFilters = search || type !== 'All' || category;

  return (
    <div>
      <h1 className="page-title">Browse Items</h1>

      <div className="card toolbar">
        <input
          type="search"
          className="search-input"
          placeholder="Search by title, description or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search items"
        />
        <div className="filters">
          <div className="segmented" role="group" aria-label="Filter by type">
            {['All', 'Lost', 'Found'].map((t) => (
              <button
                key={t}
                type="button"
                className={type === t ? 'seg active' : 'seg'}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {hasFilters && (
            <button type="button" className="btn btn-outline btn-sm" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      {loading ? (
        <div className="state-box">Loading items...</div>
      ) : !error && items.length === 0 ? (
        <div className="state-box">
          <h3>No items found</h3>
          <p>{hasFilters ? 'Try changing your search or filters.' : 'No active lost or found items have been posted yet.'}</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
