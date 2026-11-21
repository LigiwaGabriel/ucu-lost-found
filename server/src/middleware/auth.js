const jwt = require('jsonwebtoken');
const db = require('../db');

async function loadUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query(
      'SELECT id, full_name, email, role, token_version FROM users WHERE id = ?',
      [payload.id]
    );
    const u = rows[0];
    // Logging out bumps token_version, which invalidates every earlier token.
    if (!u || u.token_version !== payload.tv) return null;
    return { id: u.id, full_name: u.full_name, email: u.email, role: u.role };
  } catch {
    return null;
  }
}

// Requires a valid login.
async function requireAuth(req, res, next) {
  const user = await loadUser(req);
  if (!user) return res.status(401).json({ error: 'Please log in to continue.' });
  req.user = user;
  next();
}

// Attaches req.user when a valid token is present, otherwise continues anonymously.
async function optionalAuth(req, res, next) {
  req.user = await loadUser(req);
  next();
}

// Backend enforcement of administrator-only routes.
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Administrator access is required.' });
  }
  next();
}

module.exports = { requireAuth, optionalAuth, requireAdmin };
