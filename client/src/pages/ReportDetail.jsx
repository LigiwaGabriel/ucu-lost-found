import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, photoUrl } from '../api.js';
import { useAuth } from '../auth.jsx';
import Field from '../components/Field.jsx';
import { StatusBadge } from '../components/ReportCard.jsx';

export default function ReportDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [r, setR] = useState(null);
  const [error, setError] = useState('');
  const [evidence, setEvidence] = useState('');
  const [fields, setFields] = useState({});
  const [msg, setMsg] = useState('');
  const [claimErr, setClaimErr] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api(`/reports/${id}`).then((d) => setR(d.report)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [id, user]);

  async function claim(e) {
    e.preventDefault();
    setMsg(''); setClaimErr(''); setFields({});
    if (evidence.trim().length < 15) {
      setFields({ evidence: 'Explain why this item is yours in at least 15 characters, with a detail only the owner would know.' });
      return;
    }
    setBusy(true);
    try {
      const d = await api(`/reports/${id}/claims`, { method: 'POST', body: { evidence } });
      setMsg(d.message); setEvidence('');
    } catch (e2) { setClaimErr(e2.message); setFields(e2.fields || {}); }
    setBusy(false);
  }

  if (error) return <p className="alert error" role="alert">{error}</p>;
  if (!r) return <p role="status">Loading report…</p>;

  const canClaim = r.type === 'found' && r.status === 'open' && user && !r.is_mine;

  return (
    <article>
      <p><Link to="/">← Back to browse</Link></p>
      <h1>{r.title}</h1>
      <p className="meta">
        <span className={`badge ${r.type}`}>{r.type === 'lost' ? 'Lost' : 'Found'}</span>
        <StatusBadge status={r.status} />
      </p>
      {r.photo_path && <img className="detail-photo" src={photoUrl(r.photo_path)} alt={`Photo of ${r.title}`} />}
      <dl className="details">
        <dt>Category</dt><dd>{r.category}</dd>
        <dt>Campus location</dt><dd>{r.location}</dd>
        <dt>Date</dt><dd>{r.event_date}</dd>
        <dt>Description</dt><dd>{r.description}</dd>
        {r.private_details && (<><dt>Private identifying details</dt><dd>{r.private_details} <em>(visible only to you and administrators)</em></dd></>)}
      </dl>

      {r.status === 'returned' && <p className="alert success">This item has been returned. No further claims are accepted.</p>}
      {r.is_mine && r.status === 'open' && <p><Link className="btn secondary" to={`/report/${r.id}/edit`}>Edit this report</Link></p>}
      {r.type === 'found' && r.is_mine && <p className="muted">You reported this item, so you cannot claim it.</p>}

      {r.type === 'found' && r.status === 'open' && !user && (
        <p>To claim this item, <Link to="/login">log in</Link> first.</p>
      )}

      {canClaim && (
        <form onSubmit={claim} noValidate className="claim-form">
          <h2>Claim this item</h2>
          {msg && <p className="alert success" role="status">{msg} <Link to="/my-claims">View my claims</Link></p>}
          {claimErr && <p className="alert error" role="alert">{claimErr}</p>}
          <Field as="textarea" rows="5" id="evidence" label="Why does this belong to you?" value={evidence}
            hint="Describe a detail not shown in the public listing. Only you and the administrator can read this."
            error={fields.evidence} onChange={(e) => setEvidence(e.target.value)} />
          <button className="btn" disabled={busy}>{busy ? 'Submitting…' : 'Submit claim'}</button>
        </form>
      )}
    </article>
  );
}
