const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { validateReport, sendInvalid } = require('../utils/validate');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) =>
      cb(null, crypto.randomBytes(12).toString('hex') + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    /^image\/(jpeg|png|webp)$/.test(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Photo must be a JPG, PNG or WEBP image.')),
});

function handleUpload(req, res, next) {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Photo is too large. Use an image under 3 MB.' : err.message;
      return res.status(400).json({ error: msg, fields: { photo: msg } });
    }
    next();
  });
}

// Columns safe to show anyone. No private_details, no reporter contact details.
const PUBLIC_COLS = `r.id, r.type, r.title, r.description, r.event_date, r.photo_path, r.status,
  r.created_at, r.user_id, c.name AS category, l.name AS location, r.category_id, r.location_id`;
const FROM = `FROM reports r JOIN categories c ON c.id = r.category_id JOIN locations l ON l.id = r.location_id`;

function shape(row, user) {
  const mine = !!user && row.user_id === user.id;
  const out = { ...row, is_mine: mine };
  delete out.user_id;
  return out;
}

// Public listing with search and filters.
router.get('/', optionalAuth, async (req, res) => {
  const { q, type, category_id, location_id, date, status } = req.query;
  const where = [];
  const params = [];
  if (q) { where.push('(r.title LIKE ? OR r.description LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }
  if (['lost', 'found'].includes(type)) { where.push('r.type = ?'); params.push(type); }
  if (['open', 'returned'].includes(status)) { where.push('r.status = ?'); params.push(status); }
  if (category_id) { where.push('r.category_id = ?'); params.push(Number(category_id)); }
  if (location_id) { where.push('r.location_id = ?'); params.push(Number(location_id)); }
  if (date) { where.push('r.event_date = ?'); params.push(date); }
  const [rows] = await db.query(
    `SELECT ${PUBLIC_COLS} ${FROM} ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
     ORDER BY r.event_date DESC, r.id DESC LIMIT 100`,
    params
  );
  res.json({ reports: rows.map((r) => shape(r, req.user)) });
});

// The signed-in student's own reports (includes private details).
router.get('/mine', requireAuth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT ${PUBLIC_COLS}, r.private_details ${FROM} WHERE r.user_id = ? ORDER BY r.id DESC`,
    [req.user.id]
  );
  res.json({ reports: rows.map((r) => shape(r, req.user)) });
});

// Single report. Private details only for the reporter and an administrator.
router.get('/:id', optionalAuth, async (req, res) => {
  const [rows] = await db.query(`SELECT ${PUBLIC_COLS}, r.private_details ${FROM} WHERE r.id = ?`, [req.params.id]);
  const row = rows[0];
  if (!row) return res.status(404).json({ error: 'This report does not exist.' });
  const allowed = req.user && (req.user.role === 'admin' || req.user.id === row.user_id);
  if (!allowed) delete row.private_details;
  res.json({ report: shape(row, req.user) });
});

router.post('/', requireAuth, handleUpload, async (req, res) => {
  const errors = validateReport(req.body);
  if (Object.keys(errors).length) return sendInvalid(res, errors);
  const b = req.body;
  const [result] = await db.query(
    `INSERT INTO reports (user_id,type,title,category_id,location_id,description,private_details,event_date,photo_path)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [req.user.id, b.type, b.title.trim(), b.category_id, b.location_id, b.description.trim(),
     b.type === 'found' ? (b.private_details || null) : null, b.event_date,
     req.file ? req.file.filename : null]
  );
  res.status(201).json({ id: result.insertId, message: 'Report submitted.' });
});

// Only the owner can edit, and only while the report is open.
router.put('/:id', requireAuth, handleUpload, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM reports WHERE id = ?', [req.params.id]);
  const r = rows[0];
  if (!r) return res.status(404).json({ error: 'This report does not exist.' });
  if (r.user_id !== req.user.id) return res.status(403).json({ error: 'You can only edit your own reports.' });
  if (r.status === 'returned') return res.status(409).json({ error: 'Returned reports can no longer be edited.' });
  const b = { ...req.body, type: r.type };
  const errors = validateReport(b);
  if (Object.keys(errors).length) return sendInvalid(res, errors);
  await db.query(
    `UPDATE reports SET title=?, category_id=?, location_id=?, description=?, private_details=?, event_date=?,
       photo_path=COALESCE(?, photo_path) WHERE id=?`,
    [b.title.trim(), b.category_id, b.location_id, b.description.trim(),
     r.type === 'found' ? (b.private_details || null) : null, b.event_date,
     req.file ? req.file.filename : null, r.id]
  );
  res.json({ message: 'Report updated.' });
});

// Owner can close their own LOST report once they have recovered the item.
router.post('/:id/resolve', requireAuth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM reports WHERE id = ?', [req.params.id]);
  const r = rows[0];
  if (!r) return res.status(404).json({ error: 'This report does not exist.' });
  if (r.user_id !== req.user.id) return res.status(403).json({ error: 'You can only update your own reports.' });
  if (r.type !== 'lost') return res.status(400).json({ error: 'Found items are closed by an administrator after collection.' });
  await db.query("UPDATE reports SET status='returned' WHERE id = ?", [r.id]);
  res.json({ message: 'Marked as recovered.' });
});

module.exports = router;
