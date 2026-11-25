## My responsibilities
My responsibility was to develop the claims feature and help the administrator review students' claims. I worked on making sure students could submit ownership evidence, check their claim status, and receive feedback from the administrator.

## What I built (files, features, commits)
I worked on:
- `server/src/routes/claims.js` – submitting claims and allowing students to view their own claims.
- `server/src/routes/admin.js` – approving, rejecting and confirming returned items.
- `client/src/pages/MyClaims.jsx` – displaying students' claims and their status.
- `client/src/pages/AdminClaims.jsx` – allowing administrators to review claims and make decisions.

## Decisions I made and why
I made claim evidence private because it may contain information used to prove ownership. I also included reasons for approval or rejection so students could understand the administrator's decision.

## Challenges and how I solved them
1. **Preventing invalid claims:** I added checks to prevent students from claiming items they reported as found or items that had already been returned.
2. **Protecting claim information:** I used authentication and permission checks to restrict claim information to the claimant and administrator.
3. **Managing claim decisions:** I used different claim statuses to track claims from submission to approval, rejection or collection.

## What I learned / what I would do differently
I learned how frontend pages communicate with backend routes and how the database stores and updates claim information. I also learned the importance of security, validation and handling errors. In future, I would test each claim process earlier and document my changes more consistently.

