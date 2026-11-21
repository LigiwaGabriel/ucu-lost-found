require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const uploads = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploads, { recursive: true });

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

// Only photos are served statically; private details live in the database, never in files.
app.use('/uploads', express.static(uploads));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lookups', require('./routes/lookups'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api', require('./routes/claims'));
app.use('/api/admin', require('./routes/admin'));

app.use((req, res) => res.status(404).json({ error: 'Route not found.' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server. Please try again.' });
});

module.exports = app;
