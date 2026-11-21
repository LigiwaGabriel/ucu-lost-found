const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validateRegister, sendInvalid } = require('../utils/validate');

const router = express.Router();

function sign(user, tv) {
  return jwt.sign({ id: user.id, tv }, process.env.JWT_SECRET, { expiresIn: '8h' });
}

router.post('/register', async (req, res) => {
  const errors = validateRegister(req.body);
  if (Object.keys(errors).length) return sendInvalid(res, errors);
  const { full_name, email, password, phone } = req.body;
  const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
  if (exists.length) return sendInvalid(res, { email: 'An account with this email already exists. Try logging in.' });
  const hash = await bcrypt.hash(password, 10);
  await db.query(
    'INSERT INTO users (full_name,email,phone,password_hash,role) VALUES (?,?,?,?,"student")',
    [full_name.trim(), email.toLowerCase(), phone || null, hash]
  );
  res.status(201).json({ message: 'Account created. You can now log in.' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Enter your email and password.' });
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
  const u = rows[0];
  if (!u || !(await bcrypt.compare(password, u.password_hash)))
    return res.status(401).json({ error: 'Email or password is incorrect. Check them and try again.' });
  res.json({
    token: sign(u, u.token_version),
    user: { id: u.id, full_name: u.full_name, email: u.email, role: u.role },
  });
});

// Logout invalidates all tokens issued earlier for this user.
router.post('/logout', requireAuth, async (req, res) => {
  await db.query('UPDATE users SET token_version = token_version + 1 WHERE id = ?', [req.user.id]);
  res.json({ message: 'You have been logged out.' });
});

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

module.exports = router;
