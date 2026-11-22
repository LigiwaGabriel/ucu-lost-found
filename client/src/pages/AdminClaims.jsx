import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import Field from '../components/Field.jsx';

function ClaimRow({ c, onDone }) {
  const [reason, setReason] = useState('');
  const [info, setInfo] = useState('');
  const [fields, setFields] = useState({});
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function review(decision) {
    setErr(''); setMsg(''); setFields({});
    try {
      const d = await api(`/admin/claims/${c.id}/review`, { method: 'PATCH', body: { decision, reason, collection_info: info } });
      setMsg(d.message); onDone();
    } catch (e) { setErr(e.message); setFields(e.fields || {}); }
  }
  async function confirm() {
    setErr(''); setMsg('');
    try { const d = await api(`/admin/claims/${c.id}/confirm-return`, { method: 'POST' }); setMsg(d.message); onDone(); }
    catch (e) { setErr(e.message); }
  }

  return (
    <li className="row stack">
      <h2><Link to={`/reports/${c.report_id}`}>{c.report_title}</Link></h2>
      <p><span className={`badge claim-${c.status}`}>{c.status}</span> · Claimant: {c.claimant_name} ({c.claimant_email}{c.claimant_phone ? `, ${c.claimant_phone}` : ''})</p>
      <p><strong>Claim evidence:</strong> {c.evidence}</p>
      <p><strong>Finder's private details:</strong> {c.private_details || 'None recorded'}</p>
      {c.admin_reason && <p><strong>Decision reason:</strong> {c.admin_reason}</p>}
      {c.collection_info && <p><strong>Collection details:</strong> {c.collection_info}</p>}
      {msg && <p className="alert success" role="status">{msg}</p>}
      {err && <p className="alert error" role="alert">{err}</p>}

      {c.status === 'pending' && (
        <div>
          <Field label="Reason for decision" id={`reason-${c.id}`} as="textarea" rows="2" value={reason} error={fields.reason} onChange={(e) => setReason(e.target.value)} />
          <Field label="Collection details (required to approve)" id={`info-${c.id}`} value={info} error={fields.collection_info}
            hint="Where and when the student should collect the item." onChange={(e) => setInfo(e.target.value)} />
          <div className="actions">
            <button className="btn" onClick={() => review('approve')}>Approve</button>
            <button className="btn danger" onClick={() => review('reject')}>Reject</button>
          </div>
        </div>
      )}
      {c.status === 'approved' && <button className="btn" onClick={confirm}>Confirm item collected and returned</button>}
    </li>
  );
}

export default function AdminClaims() {
  const [status, setStatus] = useState('pending');
  const [state, setState] = useState({ loading: true, error: '', claims: [] });

  const load = () => {
    setState((s) => ({ ...s, loading: true }));
    api(`/admin/claims${status ? `?status=${status}` : ''}`)
      .then((d) => setState({ loading: false, error: '', claims: d.claims }))
      .catch((e) => setState({ loading: false, error: e.message, claims: [] }));
  };
  useEffect(load, [status]);

  return (
    <section>
      <h1>Claim review</h1>
      <Field label="Show claims" id="status" as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All</option><option value="pending">Pending</option><option value="approved">Approved (awaiting collection)</option>
        <option value="collected">Collected</option><option value="rejected">Rejected</option>
      </Field>
      {state.loading && <p role="status">Loading claims…</p>}
      {state.error && <p className="alert error" role="alert">{state.error}</p>}
      {!state.loading && !state.error && state.claims.length === 0 && <p className="empty">No claims in this view.</p>}
      <ul className="list">{state.claims.map((c) => <ClaimRow key={c.id} c={c} onDone={load} />)}</ul>
    </section>
  );
}
