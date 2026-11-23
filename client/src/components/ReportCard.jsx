import { Link } from 'react-router-dom';
import { photoUrl } from '../api.js';

export function StatusBadge({ status }) {
  return <span className={`badge ${status}`}>{status === 'returned' ? 'Returned' : 'Open'}</span>;
}

export default function ReportCard({ r }) {
  return (
    <li className="card">
      {r.photo_path && <img src={photoUrl(r.photo_path)} alt={`Photo of ${r.title}`} loading="lazy" />}
      <div className="card-body">
        <p className="meta">
          <span className={`badge ${r.type}`}>{r.type === 'lost' ? 'Lost' : 'Found'}</span>
          <StatusBadge status={r.status} />
        </p>
        <h3><Link to={`/reports/${r.id}`}>{r.title}</Link></h3>
        <p className="muted">{r.category} · {r.location} · {r.event_date}</p>
      </div>
    </li>
  );
}
