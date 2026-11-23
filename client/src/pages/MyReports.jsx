import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { StatusBadge } from '../components/ReportCard.jsx';

export default function MyReports() {
  const [state, setState] = useState({ loading: true, error: '', reports: [] });
  const [msg, setMsg] = useState('');

  const load = () => api('/reports/mine')
    .then((d) => setState({ loading: false, error: '', reports: d.reports }))
    .catch((e) => setState({ loading: false, error: e.message, reports: [] }));
  useEffect(() => { load(); }, []);

  async function recovered(id) {
    try { const d = await api(`/reports/${id}/resolve`, { method: 'POST' }); setMsg(d.message); load(); }
    catch (e) { setState((s) => ({ ...s, error: e.message })); }
  }

  return (
    <section>
      <h1>My reports</h1>
      {msg && <p className="alert success" role="status">{msg}</p>}
      {state.loading && <p role="status">Loading your reports…</p>}
      {state.error && <p className="alert error" role="alert">{state.error}</p>}
      {!state.loading && !state.error && state.reports.length === 0 && (
        <p className="empty">You have no reports yet. <Link to="/report/new">Report an item</Link>.</p>
      )}
      <ul className="list">
        {state.reports.map((r) => (
          <li key={r.id} className="row">
            <div>
              <h2><Link to={`/reports/${r.id}`}>{r.title}</Link></h2>
              <p className="meta"><span className={`badge ${r.type}`}>{r.type}</span> <StatusBadge status={r.status} /> <span className="muted">{r.event_date}</span></p>
            </div>
            {r.status === 'open' && (
              <div className="actions">
                <Link className="btn secondary" to={`/report/${r.id}/edit`}>Edit</Link>
                {r.type === 'lost' && <button className="btn secondary" onClick={() => recovered(r.id)}>Mark as recovered</button>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
