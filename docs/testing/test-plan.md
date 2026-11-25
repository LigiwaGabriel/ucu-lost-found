# member 5


## Test setup

Use a working app and test database with two student accounts (Student A and Student B), one staff/admin account, and valid categories and campus locations. Keep the report, claim, and account IDs created during testing for the access-control checks. Start with a new found-item report in `open` status for the full workflow.

Priority: **High** covers core workflows or access controls; **Medium** covers validation and usability checks.

## 1. Full workflow: report → search → claim → review → return

| ID | Test case | Steps | Expected result | Priority |
|---|---|---|---|---|
| WF-01 | Student reports a found item | Sign in as Student A; submit a found-item report with a title, category, location, past event date, public description, and private identifying details. | Report is saved and appears in Student A's reports and the open listings. Private details are not shown in the public listing. | High |
| WF-02 | Find report using search and filters | As Student B, browse and search for the report by keyword; apply its type, category, location, date, and open-status filters; then clear filters. | Matching report appears when filters match; non-matching results are excluded; Clear restores unfiltered results. | High |
| WF-03 | Claim, review, and return item | As Student B, open the found report and submit at least 15 characters of identifying evidence. Sign in as staff, approve the pending claim with a reason and collection details, then confirm collection. Check the report and Student B's claims. | Claim moves from pending to approved to collected; the report becomes returned; Student B sees the updated status and collection details; no further claim is accepted. | High |

## 2. Missing/invalid input and failed login

| ID | Test case | Steps | Expected result | Priority |
|---|---|---|---|---|
| VAL-01 | Required report fields are missing | Sign in as a student, open the new-report form, leave title, category, location, description, or date empty one at a time, and submit. | Submission is blocked; the missing field is identified; no report is created. | High |
| VAL-02 | Report or claim input is invalid | Submit a report with a too-short description or a future date; then try to claim a found item with evidence shorter than 15 characters. | Each invalid submission is rejected with a clear field error and no invalid record is saved. | High |
| VAL-03 | Staff decision is incomplete | As staff, try to approve a claim without a reason or collection details, then try a reason shorter than five characters. | Approval is blocked with an error explaining the missing or invalid field; claim remains pending. | High |
| VAL-04 | Login credentials are incorrect | Sign out; try logging in with an unknown email and then with a valid test email and incorrect password. | Login fails with an error; no authenticated session is created and protected pages remain inaccessible. | High |

## 3. Ownership, claim privacy, competing claims, and returned items

| ID | Test case | Steps | Expected result | Priority |
|---|---|---|---|---|
| AUTH-01 | Edit another student's report | Sign in as Student A and open the edit URL for a report owned by Student B; attempt to save a change if the form loads. | Student A cannot edit or change the report; the app redirects or reports an access error. | High |
| AUTH-02 | View another student's claim | As Student A, open My Claims and request the single-claim endpoint using Student B's claim ID. | Student A sees only their own claims; the other student's claim and evidence are not disclosed. | High |
| AUTH-03 | Competing claims for one item | Two different students submit claims for the same open found item. As staff, approve one claim, then try to approve the other. | Pending claims may be listed, but only one can be approved; the second approval is rejected and the item remains associated with the approved claim. | High |
| AUTH-04 | Claim an item after it is returned | Complete return confirmation for a found item; sign in as a different student and attempt to submit a claim for it. | Claim submission is rejected with a returned-item message; no new claim is created. | High |

## 4. Mobile-sized screen and keyboard-only navigation

| ID | Test case | Steps | Expected result | Priority |
|---|---|---|---|---|
| UX-01 | Use core pages on a mobile viewport | Set the browser viewport to 390 × 844; browse and filter reports, open a report, submit a report or claim, and view claim review where applicable. | Content and controls fit the viewport without horizontal scrolling; forms and actions remain readable and usable. | Medium |
| UX-02 | Navigate without a mouse | Reload the app and use only Tab, Shift+Tab, Enter, and Space to reach the skip link, navigation, search filters, report links, and form controls; submit a form and open the mobile menu. | Focus is visible and follows a logical order; all links, buttons, menu controls, and form fields are operable by keyboard; submission feedback is reachable. | High |
