const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { validateClaim, sendInvalid } = require('../utils/validate');

const router = express.Router();

// Submit a claim on a found item.
router.post('/reports/:id/claims', requireAuth, async (req, res) => {
  const errors = validateClaim(req.body);
  if (Object.keys(errors).length) return sendInvalid(res, errors);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM reports WHERE id = ? FOR UPDATE', [req.params.id]);
    const r = rows[0];
    if (!r) { await conn.rollback(); return res.status(404).json({ error: 'This report does not exist.' }); }
    if (r.type !== 'found') { await conn.rollback(); return res.status(400).json({ error: 'Only found items can be claimed.' }); }
    if (r.user_id === req.user.id) { await conn.rollback(); return res.status(403).json({ error: 'You cannot claim an item you reported as found.' }); }
    if (r.status === 'returned') { await conn.rollback(); return res.status(409).json({ error: 'This item has already been returned, so no further claims are accepted.' }); }
    const [dup] = await conn.query('SELECT id FROM claims WHERE report_id=? AND claimant_id=?', [r.id, req.user.id]);
    if (dup.length) { await conn.rollback(); return res.status(409).json({ error: 'You have already claimed this item. Check My Claims for its status.' }); }
    const [ok] = await conn.query("SELECT id FROM claims WHERE report_id=? AND status IN ('approved','collected')", [r.id]);
    if (ok.length) { await conn.rollback(); return res.status(409).json({ error: 'A claim for this item has already been approved.' }); }
    const [ins] = await conn.query('INSERT INTO claims (report_id, claimant_id, evidence) VALUES (?,?,?)',
      [r.id, req.user.id, req.body.evidence.trim()]);
    await conn.commit();
    res.status(201).json({ id: ins.insertId, message: 'Claim submitted. An administrator will review it.' });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});

// The student's own claims only.
router.get('/claims/mine', requireAuth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT cl.id, cl.report_id, cl.evidence, cl.status, cl.admin_reason, cl.collection_info,
            cl.created_at, cl.updated_at, r.title AS report_title, r.status AS report_status
     FROM claims cl JOIN reports r ON r.id = cl.report_id
     WHERE cl.claimant_id = ? ORDER BY cl.id DESC`,
    [req.user.id]
  );
  res.json({ claims: rows });
});

// One claim: claimant or administrator only.
router.get('/claims/:id', requireAuth, async (req, res) => {
  const [rows] = await db.query(
    `SELECT cl.*, r.title AS report_title FROM claims cl JOIN reports r ON r.id = cl.report_id WHERE cl.id = ?`,
    [req.params.id]
  );
  const c = rows[0];
  if (!c) return res.status(404).json({ error: 'This claim does not exist.' });
  if (c.claimant_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'You can only view your own claims.' });
  res.json({ claim: c });
});

module.exports = router;
