// Small validation helpers. Each returns an object of field -> message.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister({ full_name, email, password, phone }) {
  const e = {};
  if (!full_name || full_name.trim().length < 2) e.full_name = 'Enter your full name (at least 2 characters).';
  if (!email || !EMAIL_RE.test(email)) e.email = 'Enter a valid email address, for example name@example.com.';
  if (!password || password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password))
    e.password = 'Use at least 8 characters including a letter and a number.';
  if (phone && !/^[0-9+\-\s]{7,20}$/.test(phone)) e.phone = 'Enter a phone number using digits, spaces, + or - only.';
  return e;
}

function validateReport(b) {
  const e = {};
  if (!['lost', 'found'].includes(b.type)) e.type = 'Choose whether the item was lost or found.';
  if (!b.title || b.title.trim().length < 3 || b.title.length > 120) e.title = 'Enter a title of 3 to 120 characters.';
  if (!Number.isInteger(Number(b.category_id)) || Number(b.category_id) < 1) e.category_id = 'Select a category.';
  if (!Number.isInteger(Number(b.location_id)) || Number(b.location_id) < 1) e.location_id = 'Select a campus location.';
  if (!b.description || b.description.trim().length < 10) e.description = 'Describe the item in at least 10 characters.';
  if (!b.event_date || !/^\d{4}-\d{2}-\d{2}$/.test(b.event_date) || isNaN(Date.parse(b.event_date)))
    e.event_date = 'Enter the date as YYYY-MM-DD.';
  else if (new Date(b.event_date) > new Date()) e.event_date = 'The date cannot be in the future.';
  if (b.type === 'found' && b.private_details && b.private_details.length > 1000)
    e.private_details = 'Keep identifying details under 1000 characters.';
  return e;
}

function validateClaim({ evidence }) {
  const e = {};
  if (!evidence || evidence.trim().length < 15)
    e.evidence = 'Explain why this item is yours in at least 15 characters, with a detail only the owner would know.';
  else if (evidence.length > 2000) e.evidence = 'Keep your explanation under 2000 characters.';
  return e;
}

function sendInvalid(res, errors) {
  return res.status(400).json({ error: 'Please correct the highlighted fields.', fields: errors });
}

module.exports = { validateRegister, validateReport, validateClaim, sendInvalid };
