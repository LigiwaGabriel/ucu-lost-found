import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import Field from '../components/Field.jsx';

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [fields, setFields] = useState({});
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function check() {
    const f = {};
    if (form.full_name.trim().length < 2) f.full_name = 'Enter your full name (at least 2 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) f.email = 'Enter a valid email address, for example name@example.com.';
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      f.password = 'Use at least 8 characters including a letter and a number.';
    if (form.phone && !/^[0-9+\-\s]{7,20}$/.test(form.phone)) f.phone = 'Use digits, spaces, + or - only.';
    return f;
  }

  async function submit(e) {
    e.preventDefault();
    const f = check();
    setFields(f); setErr('');
    if (Object.keys(f).length) return;
    setBusy(true);
    try {
      await api('/auth/register', { method: 'POST', body: form });
      nav('/login');
    } catch (e2) { setErr(e2.message); setFields(e2.fields || {}); }
    setBusy(false);
  }

  return (
    <section className="narrow">
      <h1>Create an account</h1>
      {err && <p className="alert error" role="alert">{err}</p>}
      <form onSubmit={submit} noValidate>
        <Field label="Full name" id="full_name" autoComplete="name" value={form.full_name} error={fields.full_name} onChange={set('full_name')} />
        <Field label="Email" id="email" type="email" autoComplete="email" value={form.email} error={fields.email} onChange={set('email')} />
        <Field label="Phone (optional)" id="phone" type="tel" autoComplete="tel" value={form.phone} error={fields.phone}
          hint="Only shown to administrators, never in public listings." onChange={set('phone')} />
        <Field label="Password" id="password" type="password" autoComplete="new-password" value={form.password} error={fields.password}
          hint="At least 8 characters with a letter and a number." onChange={set('password')} />
        <button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button>
      </form>
      <p>Already registered? <Link to="/login">Log in</Link></p>
    </section>
  );
}
