import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useLookups } from '../hooks.js';
import Field from '../components/Field.jsx';
import ReportCard from '../components/ReportCard.jsx';

const EMPTY = { q: '', type: '', category_id: '', location_id: '', date: '', status: '' };

export default function Browse() {
  const { categories, locations } = useLookups();
  const [filters, setFilters] = useState(EMPTY);
  const [state, setState] = useState({ loading: true, error: '', reports: [] });
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  async function load(f = filters) {
    setState((s) => ({ ...s, loading: true, error: '' }));
    const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
    try {
      const d = await api(`/reports${qs ? `?${qs}` : ''}`);
      setState({ loading: false, error: '', reports: d.reports });
    } catch (e) {
      setState({ loading: false, error: e.message, reports: [] });
    }
  }
  useEffect(() => { load(EMPTY); }, []);

  return (
    <section>
      <h1>Lost &amp; found items</h1>
      <form className="filters" role="search" aria-label="Search reports" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <Field label="Keyword" id="q" value={filters.q} onChange={set('q')} placeholder="e.g. keys" />
        <Field label="Type" id="type" as="select" value={filters.type} onChange={set('type')}>
          <option value="">All</option><option value="lost">Lost</option><option value="found">Found</option>
        </Field>
        <Field label="Category" id="category_id" as="select" value={filters.category_id} onChange={set('category_id')}>
          <option value="">All</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Field>
        <Field label="Campus location" id="location_id" as="select" value={filters.location_id} onChange={set('location_id')}>
          <option value="">All</option>
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </Field>
        <Field label="Date" id="date" type="date" value={filters.date} onChange={set('date')} />
        <Field label="Status" id="status" as="select" value={filters.status} onChange={set('status')}>
          <option value="">All</option><option value="open">Open</option><option value="returned">Returned</option>
        </Field>
        <div className="actions">
          <button className="btn">Search</button>
          <button type="button" className="btn secondary" onClick={() => { setFilters(EMPTY); load(EMPTY); }}>Clear</button>
        </div>
      </form>

      <div aria-live="polite">
        {state.loading && <p role="status">Loading reports…</p>}
        {state.error && <p className="alert error" role="alert">{state.error}</p>}
        {!state.loading && !state.error && state.reports.length === 0 && (
          <p className="empty">No reports match your search. Try clearing a filter.</p>
        )}
      </div>
      <ul className="grid">{state.reports.map((r) => <ReportCard key={r.id} r={r} />)}</ul>
    </section>
  );
}
