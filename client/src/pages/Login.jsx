import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import Field from '../components/Field.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [fields, setFields] = useState({});
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const f = {};
    if (!form.email.trim()) f.email = 'Enter your email address.';
    if (!form.password) f.password = 'Enter your password.';
    setFields(f); setErr('');
    if (Object.keys(f).length) return;
    setBusy(true);
    try {
      const u = await login(form.email, form.password);
      nav(u.role === 'admin' ? '/admin' : '/');
    } catch (e2) { setErr(e2.message); }
    setBusy(false);
  }

  return (
    <section className="narrow">
      <h1>Log in</h1>
      {err && <p className="alert error" role="alert">{err}</p>}
      <form onSubmit={submit} noValidate>
        <Field label="Email" id="email" type="email" autoComplete="email" value={form.email}
          error={fields.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Field label="Password" id="password" type="password" autoComplete="current-password" value={form.password}
          error={fields.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </section>
  );
}
