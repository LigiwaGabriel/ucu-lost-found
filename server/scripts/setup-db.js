// Creates the database, tables, lookup data and fictional demo accounts/reports.
// Run: npm run db:setup
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });
  const dir = path.join(__dirname, '..', 'database');
  await conn.query(fs.readFileSync(path.join(dir, 'schema.sql'), 'utf8'));
  await conn.query(fs.readFileSync(path.join(dir, 'seed.sql'), 'utf8'));
  await conn.query(`USE ${process.env.DB_NAME || 'ucu_lost_found'}`);

  const users = [
    ['Okello Denis', 'okello@example.test', 'Student@123', 'student'],
    ['Namusoke Grace', 'namusoke@example.test', 'Student@123', 'student'],
    ['Lost&Found Admin', 'admin@example.test', 'Admin@12345', 'admin'],
  ];
  for (const [name, email, pw, role] of users) {
    const hash = await bcrypt.hash(pw, 10);
    await conn.query(
      'INSERT IGNORE INTO users (full_name,email,password_hash,role) VALUES (?,?,?,?)',
      [name, email, hash, role]
    );
  }
  const [[nam]] = await conn.query("SELECT id FROM users WHERE email='namusoke@example.test'");
  const [[oke]] = await conn.query("SELECT id FROM users WHERE email='okello@example.test'");
  const [[{ n }]] = await conn.query('SELECT COUNT(*) n FROM reports');
  if (n === 0) {
    await conn.query(
      `INSERT INTO reports (user_id,type,title,category_id,location_id,description,private_details,event_date)
       VALUES
       (?, 'found','Set of keys with blue keyring',1,1,'Found beneath a chair after the Health and Wholeness lecture.','Inscription on back of keyring reads "O.D. 2024".', CURDATE()),
       (?, 'lost','Black laptop charger',2,2,'Lost near the second floor study area.',NULL, CURDATE())`,
      [nam.id, oke.id]
    );
  }
  console.log('Database ready. Demo logins are listed in server/database/seed.sql');
  await conn.end();
})().catch((e) => { console.error(e); process.exit(1); });
