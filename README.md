# UCU Campus Lost-and-Found System

A responsive web application where students report lost and found items, search listings,
submit private ownership claims and track their progress, and where a designated administrator
reviews claims and confirms returns. Built for CSC1202 (Advent 2026 project-based exam). All data is fictional.

**Stack:** React (Vite) · Node.js + Express · MySQL

## Prerequisites
- Node.js 20 or newer and npm
- MySQL 8 running locally (or a hosted MySQL instance)
- Git

## Installation
```bash
git clone <REPOSITORY-URL>
cd ucu-lost-found
cd server && npm install
cd ../client && npm install
```

## Configuration
Copy the example environment files and fill in your own values. **Never commit `.env` files.**
```bash
cp server/.env.example server/.env     # set DB_PASSWORD and a long random JWT_SECRET
cp client/.env.example client/.env     # VITE_API_URL=http://localhost:5000
```

## Database setup
Creates the database, tables, categories, locations and fictional demo data:
```bash
cd server
npm run db:setup
```
Scripts: `server/database/schema.sql`, `server/database/seed.sql`, `server/scripts/setup-db.js`.

## Running the application
```bash
# terminal 1
cd server && npm run dev        # API on http://localhost:5000
# terminal 2
cd client && npm run dev        # app on http://localhost:5173
```

## Tests
```bash
cd server && npm test
```
Manual test cases and results are in `docs/testing/`.

## Demo accounts
Fictional student and administrator accounts are created by `npm run db:setup`.
The assessment login details are submitted privately through Moodle.

## Deployment
- Deployed URL: _to be added_
- Final commit ID: _to be added_

## Team and contributions
| Member | Area |
|---|---|
| _Member 1 (lead)_ | Repository, server foundation, authentication, deployment, README |
| _Member 2_ | Database design and setup, reports and search API |
| _Member 3_ | Claims and administrator API, claim review screens |
| _Member 4_ | Frontend foundation, accessibility, login and registration |
| _Member 5_ | Browse, report and detail pages, automated and manual testing |

## Acknowledgements
See `docs/acknowledgements.md` for external code, references and AI assistance.
