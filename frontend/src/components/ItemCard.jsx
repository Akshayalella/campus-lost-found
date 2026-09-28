import { Link } from 'react-router-dom';
import { formatDate } from '../constants';

export default function ItemCard({ item }) {
  const short =
    item.description.length > 110 ? `${item.description.slice(0, 110).trim()}...` : item.description;

  return (
    <article className={item.status === 'Resolved' ? 'card item-card resolved' : 'card item-card'}>
      <div className="item-card-top">
        <span className={item.type === 'Lost' ? 'badge badge-lost' : 'badge badge-found'}>{item.type}</span>
        <span className={item.status === 'Resolved' ? 'badge badge-resolved' : 'badge badge-active'}>
          {item.status}
        </span>
      </div>
      <h3 className="item-title">{item.title}</h3>
      <p className="item-desc">{short}</p>
      <ul className="item-meta">
        <li><strong>Category:</strong> {item.category}</li>
        <li><strong>Location:</strong> {item.location}</li>
        <li><strong>Date:</strong> {formatDate(item.date)}</li>
      </ul>
      <Link to={`/items/${item._id}`} className="btn btn-primary btn-sm">View Details</Link>
    </article>
  );
}
