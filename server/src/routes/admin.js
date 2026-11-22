const express = require('express');
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireAdmin); // every route below is admin-only, enforced on the backend

// All claims with evidence and the report's private details, for review.
router.get('/claims', async (req, res) => {
  const { status } = req.query;
  const params = [];
  let where = '';
  if (['pending', 'approved', 'rejected', 'collected'].includes(status)) { where = 'WHERE cl.status = ?'; params.push(status); }
  const [rows] = await db.query(
    `SELECT cl.id, cl.report_id, cl.evidence, cl.status, cl.admin_reason, cl.collection_info, cl.created_at,
            r.title AS report_title, r.private_details, r.status AS report_status,
            u.full_name AS claimant_name, u.email AS claimant_email, u.phone AS claimant_phone
     FROM claims cl JOIN reports r ON r.id = cl.report_id JOIN users u ON u.id = cl.claimant_id
     ${where} ORDER BY cl.id DESC`,
    params
  );
  res.json({ claims: rows });
});

// Approve or reject a claim, always recording a reason.
router.patch('/claims/:id/review', async (req, res) => {
  const { decision, reason, collection_info } = req.body;
  if (!['approve', 'reject'].includes(decision)) return res.status(400).json({ error: 'Decision must be approve or reject.', fields: { decision: 'Choose approve or reject.' } });
  if (!reason || reason.trim().length < 5) return res.status(400).json({ error: 'A reason is required.', fields: { reason: 'Record a reason of at least 5 characters.' } });
  if (decision === 'approve' && (!collection_info || collection_info.trim().length < 3))
    return res.status(400).json({ error: 'Collection details are required.', fields: { collection_info: 'Tell the student where and when to collect the item.' } });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [cs] = await conn.query('SELECT * FROM claims WHERE id = ? FOR UPDATE', [req.params.id]);
    const c = cs[0];
    if (!c) { await conn.rollback(); return res.status(404).json({ error: 'This claim does not exist.' }); }
    if (c.status !== 'pending') { await conn.rollback(); return res.status(409).json({ error: `This claim is already ${c.status}.` }); }
    const [rs] = await conn.query('SELECT * FROM reports WHERE id = ? FOR UPDATE', [c.report_id]);
    const r = rs[0];
    if (r.status === 'returned') { await conn.rollback(); return res.status(409).json({ error: 'This item has already been returned.' }); }
    if (decision === 'approve') {
      const [other] = await conn.query("SELECT id FROM claims WHERE report_id=? AND status IN ('approved','collected') AND id <> ?", [r.id, c.id]);
      if (other.length) { await conn.rollback(); return res.status(409).json({ error: 'Another claim for this item is already approved.' }); }
    }
    await conn.query(
      'UPDATE claims SET status=?, admin_reason=?, collection_info=?, reviewed_by=? WHERE id=?',
      [decision === 'approve' ? 'approved' : 'rejected', reason.trim(),
       decision === 'approve' ? collection_info.trim() : null, req.user.id, c.id]
    );
    await conn.commit();
    res.json({ message: decision === 'approve' ? 'Claim approved for collection.' : 'Claim rejected.' });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});

// Confirm collection: only now is the item marked returned.
router.post('/claims/:id/confirm-return', async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [cs] = await conn.query('SELECT * FROM claims WHERE id = ? FOR UPDATE', [req.params.id]);
    const c = cs[0];
    if (!c) { await conn.rollback(); return res.status(404).json({ error: 'This claim does not exist.' }); }
    if (c.status !== 'approved') { await conn.rollback(); return res.status(409).json({ error: 'Only an approved claim can be confirmed as collected.' }); }
    await conn.query("UPDATE claims SET status='collected' WHERE id=?", [c.id]);
    await conn.query("UPDATE reports SET status='returned' WHERE id=?", [c.report_id]);
    await conn.query(
      "UPDATE claims SET status='rejected', admin_reason='Item was returned to another claimant.' WHERE report_id=? AND status='pending'",
      [c.report_id]
    );
    await conn.commit();
    res.json({ message: 'Return confirmed. The listing now shows as returned.' });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
});

module.exports = router;
