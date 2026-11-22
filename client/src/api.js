export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getToken() {
  return localStorage.getItem('token');
}

// Throws { message, fields } on any non-2xx response so forms can show field errors.
export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }
  let res;
  try {
    res = await fetch(`${API}/api${path}`, { method, headers, body: payload });
  } catch {
    throw { message: 'Cannot reach the server. Check your connection and try again.', fields: {} };
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { message: data.error || 'Request failed.', fields: data.fields || {}, status: res.status };
  return data;
}

export const photoUrl = (name) => (name ? `${API}/uploads/${name}` : null);
