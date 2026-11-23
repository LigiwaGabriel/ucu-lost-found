import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useLookups } from '../hooks.js';
import Field from '../components/Field.jsx';

const today = () => new Date().toISOString().slice(0, 10);

export default function ReportForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const nav = useNavigate();
  const { categories, locations } = useLookups();
  const [form, setForm] = useState({ type: 'lost', title: '', category_id: '', location_id: '', description: '', private_details: '', event_date: today() });
  const [photo, setPhoto] = useState(null);
  const [fields, setFields] = useState({});
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (!editing) return;
    api(`/reports/${id}`).then(({ report }) => {
      if (!report.is_mine) return nav('/my-reports');
      setForm({ type: report.type, title: report.title, category_id: report.category_id, location_id: report.location_id,
        description: report.description, private_details: report.private_details || '', event_date: report.event_date });
    }).catch((e) => setErr(e.message));
  }, [id]);

  function check() {
    const f = {};
    if (form.title.trim().length < 3) f.title = 'Enter a title of at least 3 characters.';
    if (!form.category_id) f.category_id = 'Select a category.';
    if (!form.location_id) f.location_id = 'Select a campus location.';
    if (form.description.trim().length < 10) f.description = 'Describe the item in at least 10 characters.';
    if (!form.event_date) f.event_date = 'Choose the date.';
    else if (form.event_date > today()) f.event_date = 'The date cannot be in the future.';
    if (photo && !/^image\/(jpeg|png|webp)$/.test(photo.type)) f.photo = 'Photo must be a JPG, PNG or WEBP image.';
    if (photo && photo.size > 3 * 1024 * 1024) f.photo = 'Photo is too large. Use an image under 3 MB.';
    return f;
  }

  async function submit(e) {
    e.preventDefault();
    const f = check();
    setFields(f); setErr('');
    if (Object.keys(f).length) return;
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append('photo', photo);
    setBusy(true);
    try {
      const d = await api(editing ? `/reports/${id}` : '/reports', { method: editing ? 'PUT' : 'POST', form: fd });
      nav(editing ? '/my-reports' : `/reports/${d.id}`);
    } catch (e2) { setErr(e2.message); setFields(e2.fields || {}); }
    setBusy(false);
  }

  return (
    <section className="narrow">
      <h1>{editing ? 'Edit report' : 'Report an item'}</h1>
      {err && <p className="alert error" role="alert">{err}</p>}
      <form onSubmit={submit} noValidate>
        {!editing && (
          <Field label="Was the item lost or found?" id="type" as="select" value={form.type} onChange={set('type')} error={fields.type}>
            <option value="lost">I lost it</option><option value="found">I found it</option>
          </Field>
        )}
        <Field label="Title" id="title" value={form.title} error={fields.title} onChange={set('title')} />
        <Field label="Category" id="category_id" as="select" value={form.category_id} error={fields.category_id} onChange={set('category_id')}>
          <option value="">Select a category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Field>
        <Field label="Campus location" id="location_id" as="select" value={form.location_id} error={fields.location_id} onChange={set('location_id')}>
          <option value="">Select a location</option>
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </Field>
        <Field label="Date" id="event_date" type="date" max={today()} value={form.event_date} error={fields.event_date} onChange={set('event_date')} />
        <Field label="Public description" id="description" as="textarea" rows="4" value={form.description} error={fields.description}
          hint="Visible to everyone. Do not include details that prove ownership." onChange={set('description')} />
        {form.type === 'found' && (
          <Field label="Private identifying details (optional)" id="private_details" as="textarea" rows="3" value={form.private_details}
            error={fields.private_details}
            hint="Only you and the administrator can see this. Keep these details out of the public description and photo."
            onChange={set('private_details')} />
        )}
        <Field label="Photo (optional)" id="photo" type="file" accept="image/jpeg,image/png,image/webp" error={fields.photo}
          hint="Do not photograph identifying marks such as inscriptions or ID numbers."
          onChange={(e) => setPhoto(e.target.files[0] || null)} />
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Submit report'}</button>
      </form>
    </section>
  );
}
