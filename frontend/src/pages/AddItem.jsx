import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../constants';

const today = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export default function AddItem() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialType = params.get('type') === 'Found' ? 'Found' : 'Lost';

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: initialType,
    category: CATEGORIES[0],
    location: '',
    date: today(),
    contact: user ? user.email : '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.title.trim().length < 3) return setError('Title must be at least 3 characters');
    if (form.description.trim().length < 10) return setError('Description must be at least 10 characters');
    if (!form.location.trim()) return setError('Location is required');
    if (!form.date) return setError('Date is required');
    if (form.date > today()) return setError('Date cannot be in the future');
    if (!form.contact.trim()) return setError('Contact information is required');

    setSubmitting(true);
    try {
      const res = await api.post('/items', form);
      navigate(`/items/${res.data.item._id}`, { state: { created: true } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card form form-wide" onSubmit={onSubmit} noValidate>
        <h2>Report an Item</h2>
        {error && <div className="alert alert-error" role="alert">{error}</div>}

        <label>Item is</label>
        <div className="segmented" role="group" aria-label="Lost or found">
          {['Lost', 'Found'].map((t) => (
            <button
              key={t}
              type="button"
              className={form.type === t ? 'seg active' : 'seg'}
              onClick={() => setForm({ ...form, type: t })}
            >
              {t}
            </button>
          ))}
        </div>

        <label htmlFor="title">Item Title</label>
        <input id="title" name="title" value={form.title} onChange={onChange} maxLength={100} placeholder="e.g. Black backpack" />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} value={form.description} onChange={onChange} maxLength={1000} placeholder="Describe the item (colour, brand, marks, etc.)" />

        <div className="row">
          <div>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={onChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" max={today()} value={form.date} onChange={onChange} />
          </div>
        </div>

        <label htmlFor="location">Location</label>
        <input id="location" name="location" value={form.location} onChange={onChange} maxLength={120} placeholder="e.g. Library, 2nd floor" />

        <label htmlFor="contact">Contact Information</label>
        <input id="contact" name="contact" value={form.contact} onChange={onChange} maxLength={120} placeholder="Email or phone number" />

        <button className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Submitting...' : `Post ${form.type} Item`}
        </button>
      </form>
    </div>
  );
}
