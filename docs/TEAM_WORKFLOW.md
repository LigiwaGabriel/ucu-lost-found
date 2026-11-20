# Team Git Workflow - UCU Lost-and-Found (CSC1202)

Five members, one GitHub repository, one branch per member, pull requests into `main`.
Everyone owns different files, so merge conflicts are almost impossible.

## Ground rules
1. **Commit from your own computer and your own GitHub account.** The exam marks each student's contribution individually and reads the Git history. Never commit on someone else's behalf.
2. **Understand every file you push.** In the oral defence you are questioned individually, must trace an action from screen to API to database, and must make a small code change live.
3. **Acknowledge AI assistance and external code** in `docs/acknowledgements.md`, as the exam rules require. Check the exam rules on what AI use is permitted.
4. **Never commit secrets.** No `.env`, passwords or tokens. `.gitignore` already blocks `.env`.
5. Nobody pushes straight to `main` (except Member 1's first baseline commit). Work on a branch, open a pull request, get one teammate to review it.
6. Commit messages: `feat(area): ...`, `fix(area): ...`, `docs: ...`, `test: ...`. Small, frequent commits. This is what "meaningful Git history" (4 marks) means.

## Who owns what
| Member | Branch | Code | Documents |
|---|---|---|---|
| 1 Lead | `feature/server-auth` | server package/config, `app.js`, `db.js`, auth middleware and routes, `validate.js` | problem and users, architecture and plan, README, acknowledgements, report assembly, deployment, Moodle submission |
| 2 | `feature/database-reports` | `schema.sql`, `seed.sql`, `setup-db.js`, `routes/reports.js`, `routes/lookups.js` | database design and ERD |
| 3 | `feature/claims-admin` | `routes/claims.js`, `routes/admin.js`, `AdminClaims.jsx`, `MyClaims.jsx` | requirements and acceptance criteria |
| 4 | `feature/frontend-foundation` | client config, `main.jsx`, `App.jsx`, `api.js`, `auth.jsx`, `styles.css`, `Layout`, `Field`, `Login`, `Register` | wireframes, slide deck |
| 5 | `feature/pages-testing` | `Browse`, `ReportCard`, `ReportForm`, `ReportDetail`, `MyReports`, server tests | test plan and results (all evidence) |

Each member also writes `docs/reflections/member-N.md` themselves.

## Step 1 - Member 1 creates the repository (Day 1, ~20 min)
1. github.com -> **New repository** -> name `ucu-lost-found` -> **Private** -> do NOT add a README, .gitignore or licence -> Create.
2. Settings -> Collaborators -> add the other four members by GitHub username (they must accept the email invite).
3. Baseline commit:
```bash
git clone https://github.com/<OWNER>/ucu-lost-found.git
cd ucu-lost-found
tar -xf ~/Downloads/member1-lead-baseline.zip      # or right-click -> Extract All into this folder
git add .
git commit -m "chore: add .gitignore, README skeleton, report and slides folders"
git branch -M main
git push -u origin main
```
4. Settings -> Branches -> **Add rule** for `main`: require a pull request with 1 approval before merging.
5. Tell the group the repo URL.

## Step 2 - Everyone: one-time setup (Day 1)
```bash
git config --global user.name  "Your Real Name"
git config --global user.email "the-email-on-your-GitHub-account"
git clone https://github.com/<OWNER>/ucu-lost-found.git
cd ucu-lost-found
```
Install Node 20+, MySQL 8 and VS Code. Put your zip in Downloads.

## Step 3 - Each member's push commands (Day 1-2)
Run from the repository root. Each block is several commits on purpose.

### Member 1 - `member1-lead.zip`
```bash
git switch -c feature/server-auth
tar -xf ~/Downloads/member1-lead.zip
git add server/package.json server/package-lock.json server/.env.example server/src/index.js server/src/app.js server/src/db.js
git commit -m "feat(server): express app, MySQL pool and environment config"
git add server/src/middleware server/src/routes/auth.js server/src/utils/validate.js
git commit -m "feat(auth): register, login, logout with bcrypt hashing and JWT; backend validation"
git add docs
git commit -m "docs: problem statement, architecture and plan templates"
git push -u origin feature/server-auth
```
Then GitHub -> **Compare & pull request** -> reviewer: Member 2.

### Member 2 - `member2-database-reports.zip`
```bash
git switch -c feature/database-reports
tar -xf ~/Downloads/member2-database-reports.zip
git add server/database
git commit -m "feat(db): schema with users, reports, claims, categories, locations; seed data"
git add server/scripts
git commit -m "feat(db): setup script creating database and fictional demo accounts"
git add server/src/routes/reports.js server/src/routes/lookups.js
git commit -m "feat(reports): create, edit, search and filter reports; private details hidden from public"
git add docs
git commit -m "docs: database design template and reflection"
git push -u origin feature/database-reports
```
Reviewer: Member 3.

### Member 3 - `member3-claims-admin.zip`
```bash
git switch -c feature/claims-admin
tar -xf ~/Downloads/member3-claims-admin.zip
git add server/src/routes/claims.js
git commit -m "feat(claims): submit private claim, list own claims, block self-claims and returned items"
git add server/src/routes/admin.js
git commit -m "feat(admin): approve/reject with reason, confirm return, one approved claim per item"
git add client/src/pages/MyClaims.jsx client/src/pages/AdminClaims.jsx
git commit -m "feat(ui): my claims and admin claim review screens"
git add docs
git commit -m "docs: requirements and acceptance criteria template and reflection"
git push -u origin feature/claims-admin
```
Reviewer: Member 4.

### Member 4 - `member4-frontend-foundation.zip`
```bash
git switch -c feature/frontend-foundation
tar -xf ~/Downloads/member4-frontend-foundation.zip
git add client/package.json client/package-lock.json client/vite.config.js client/index.html client/.env.example
git commit -m "chore(client): Vite + React project setup"
git add client/src/main.jsx client/src/App.jsx client/src/api.js client/src/auth.jsx client/src/hooks.js
git commit -m "feat(client): routing, protected routes, API helper and auth context"
git add client/src/styles.css client/src/components
git commit -m "feat(ui): responsive, accessible layout, form fields and styles"
git add client/src/pages/Login.jsx client/src/pages/Register.jsx
git commit -m "feat(ui): login and registration pages with inline validation messages"
git add docs
git commit -m "docs: wireframes template and reflection"
git push -u origin feature/frontend-foundation
```
Reviewer: Member 5.

### Member 5 - `member5-pages-testing.zip`
```bash
git switch -c feature/pages-testing
tar -xf ~/Downloads/member5-pages-testing.zip
git add client/src/pages/Browse.jsx client/src/components/ReportCard.jsx
git commit -m "feat(ui): browse page with keyword, category, location, date and type filters"
git add client/src/pages/ReportForm.jsx client/src/pages/MyReports.jsx
git commit -m "feat(ui): create/edit report form and my reports page"
git add client/src/pages/ReportDetail.jsx
git commit -m "feat(ui): report detail with claim form and status"
git add server/tests
git commit -m "test: unit tests for server-side validation"
git add docs
git commit -m "docs: test plan and results templates and reflection"
git push -u origin feature/pages-testing
```
Reviewer: Member 1.

## Step 4 - Merge order (Day 2)
Merge the pull requests in this order, because later parts import earlier ones:
**1 -> 2 -> 3 -> 4 -> 5.** Use **Squash and merge only if** you want one commit per PR; prefer **Create a merge commit** so each member's individual commits stay visible in history.

Then everyone:
```bash
git switch main
git pull
cd server && npm install && cp .env.example .env     # edit .env: DB_PASSWORD, JWT_SECRET
npm run db:setup
npm run dev
# second terminal
cd client && npm install && cp .env.example .env && npm run dev
```
The app only runs once all five PRs are merged. That is expected.

## Step 5 - Daily routine (Day 2 onward)
```bash
git switch main && git pull                      # start of every work session
git switch -c fix/<short-description>            # one branch per change, e.g. fix/claim-validation-message
# ...edit, test...
git add <files you changed>
git commit -m "fix(claims): show reason field error under the textarea"
git push -u origin fix/<short-description>       # open a PR, ask a teammate to review
```
- Only edit files you own. If you need a change in someone else's file, message them or open an issue.
- If you get a conflict: `git pull origin main` into your branch, fix the marked sections in VS Code, `git add`, `git commit`.
- Never use `git push --force` on `main`.

## Step 6 - Six-day plan
| Day | Everyone | Lead extras |
|---|---|---|
| 1 (Fri 20 Nov) | Setup, accounts, clone | Create repo, baseline, branch rule |
| 2 | Push branch, review a teammate's PR, merge in order, run the app locally | Merge PRs, confirm app runs for all |
| 3 | Read your own files until you can explain them; fix bugs in your area via small PRs; write your document section | Choose a host and start deployment |
| 4 | Real testing: M5 runs the plan, every member tests their own area and logs defects; M4 checks mobile and keyboard use | Deploy, put URL in README |
| 5 | Fix defects, finish docs and reflections, M4 builds slides, M1 assembles report | Report assembly |
| 6 | Freeze code. Rehearse the 15-minute defence. Submit on Moodle | Record final commit ID and submit |

Check these days against the lecturer's actual milestone dates on Moodle.

## Step 7 - Who submits what
Confirm with the lecturer whether Moodle submission is per student or per group. If per group, Member 1 submits the package and every member confirms their contribution.

| Item | Prepared by | Submitted by |
|---|---|---|
| Project report (Trebuchet MS 12pt, 1.5 spacing, justified, IEEE) | M1 assembles; M1 intro/architecture/limitations, M2 database, M3 requirements and claim rules, M4 design/wireframes/accessibility, M5 testing | M1 |
| Repository link and final commit ID (`git rev-parse HEAD` on `main`) | M1 | M1 |
| Deployed application URL | M1 | M1 |
| Assessment login details (fictional accounts), privately | M1 | M1 |
| README | M1 | in repo |
| Database scripts and fictional sample data | M2 | in repo |
| Test results (steps, expected, actual, pass/fail, unresolved defects) | M5 | M5 attaches |
| Presentation slides | M4 assembles; each member one slide on their part | M4 / M1 |
| Milestone evidence and acknowledgements | Everyone | M1 |
| Reflection (your own words) | Each member | in repo |

## Step 8 - Oral defence: who traces what
| Member | Trace this action: screen -> API -> database |
|---|---|
| 1 | Login: `Login.jsx` -> `POST /api/auth/login` -> `users` table, JWT |
| 2 | Search: `Browse.jsx` filters -> `GET /api/reports` -> SQL query |
| 3 | Approve claim then confirm return: `AdminClaims.jsx` -> `/api/admin/...` -> `claims` and `reports` rows |
| 4 | Register: `Register.jsx` -> `api.js` -> `POST /api/auth/register` |
| 5 | Report found item: `ReportForm.jsx` -> `POST /api/reports` -> `reports` row with private details |

## Final checklist (Day 6)
- [ ] `main` runs from a fresh clone using only the README
- [ ] No `.env` or secrets in Git history
- [ ] Deployed URL works; a local copy also runs
- [ ] Test results complete, defects listed honestly
- [ ] Every member has several commits of their own
- [ ] Acknowledgements and IEEE references done
- [ ] Final commit ID recorded
