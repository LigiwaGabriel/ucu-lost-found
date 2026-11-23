const test = require('node:test');
const assert = require('node:assert');
const { validateRegister, validateReport, validateClaim } = require('../src/utils/validate');

test('register rejects weak password and bad email', () => {
  const e = validateRegister({ full_name: 'Al', email: 'bad', password: 'short' });
  assert.ok(e.email && e.password);
});

test('register accepts valid input', () => {
  const e = validateRegister({ full_name: 'Okello Denis', email: 'o@example.test', password: 'Student@123' });
  assert.deepStrictEqual(e, {});
});

test('report requires fields and rejects future date', () => {
  const e = validateReport({ type: 'lost', title: '', category_id: '', location_id: '', description: 'x', event_date: '2999-01-01' });
  assert.ok(e.title && e.category_id && e.location_id && e.description && e.event_date);
});

test('claim needs meaningful evidence', () => {
  assert.ok(validateClaim({ evidence: 'mine' }).evidence);
  assert.deepStrictEqual(validateClaim({ evidence: 'The keyring has the initials O.D. engraved.' }), {});
});
