const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  const [categories] = await db.query('SELECT id, name FROM categories ORDER BY name');
  const [locations] = await db.query('SELECT id, name FROM locations ORDER BY name');
  res.json({ categories, locations });
});

module.exports = router;
