import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

const LABEL = { pending: 'Pending review', approved: 'Approved – ready for collection', rejected: 'Rejected', collected: 'Collected – returned' };

export default function MyClaims() {
  const [state, setState] = useState({ loading: true, error: '', claims: [] });
  useEffect(() => {
    api('/claims/mine')
      .then((d) => setState({ loading: false, error: '', claims: d.claims }))
      .catch((e) => setState({ loading: false, error: e.message, claims: [] }));
  }, []);

  return (
    <section>
      <h1>My claims</h1>
      {state.loading && <p role="status">Loading your claims…</p>}
      {state.error && <p className="alert error" role="alert">{state.error}</p>}
      {!state.loading && !state.error && state.claims.length === 0 && (
        <p className="empty">You have not made any claims. <Link to="/">Browse found items</Link>.</p>
      )}
      <ul className="list">
        {state.claims.map((c) => (
          <li key={c.id} className="row stack">
            <h2><Link to={`/reports/${c.report_id}`}>{c.report_title}</Link></h2>
            <p><span className={`badge claim-${c.status}`}>{LABEL[c.status]}</span></p>
            <p><strong>Your explanation:</strong> {c.evidence}</p>
            {c.admin_reason && <p><strong>Administrator's response:</strong> {c.admin_reason}</p>}
            {c.collection_info && <p><strong>Collection details:</strong> {c.collection_info}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
