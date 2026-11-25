Architecture, Folder Structure & Security
Architecture (React → Express REST API → MySQL)
Frontend (client/): React SPA communicating with /api via credentials: 'same-origin', served directly by Express in production (client/dist).

Backend (server/): Express REST API organized by feature (/auth, /reports, /claims, /admin) with helmet headers, 20kb JSON body limits, input validation, and Multer file uploads.

Database (database/): MySQL 8 (InnoDB) storing users, sessions, reports, and claims, using withTransaction (SELECT ... FOR UPDATE) and generated unique indexes to prevent duplicate active claims or multiple approved claims per item.   
ucu-lost-and-found.zip

Folder Structure
Plaintext
ucu-lost-and-found/
├── database/schema.sql          # Tables, foreign keys, and unique constraints
├── server/
│   ├── scripts/                 # setup-db.js, seed.js
│   ├── src/
│   │   ├── middleware/          # auth.js (sessions & RBAC), upload.js
│   │   ├── routes/              # auth.js, reports.js, claims.js, admin.js
│   │   └── app.js, config.js, db.js, errors.js, validate.js
│   ├── tests/                   # Automated API integration tests
│   └── uploads/                 # Item photo storage
├── client/src/                  # React pages, components, api.js, auth.jsx
└── docs/                        # Project documentation
Security Decisions
Authentication & Passwords: Passwords are hashed with bcryptjs (cost 12), login uses a dummy hash comparison to prevent email enumeration timing leaks, and auth routes are rate-limited. Sessions use 32-byte random tokens stored as SHA-256 hashes in MySQL inside HttpOnly, SameSite=Strict cookies (enabling immediate server-side revocation on logout rather than stateless JWTs).

Permissions & RBAC: Server middleware (requireAuth, requireStudent, requireAdmin) and ownership checks guard every protected route; public registration only creates student accounts, students can only edit/close their own reports and cannot claim items they reported, and /admin routes require the admin role.

Private Fields & Uploads: Public endpoints select an allow-list of columns (PUBLIC_COLS), restricting identifying_details and claim evidence to authorized owners, claimants, and admins; uploaded images are renamed and verified via raw file magic bytes (JPG, PNG, WebP)[cite: 1].