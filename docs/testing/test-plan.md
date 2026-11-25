# Test Plan — member_5

## 1. Full workflow

| ID | Area | Test case | Preconditions | Steps | Expected result | Priority |
|---|---|---|---|---|---|---|
| WF-01 | Report | Create found-item report | Student A is signed in. | Submit a found report with valid required fields. | Report is saved with `open` status and appears in browse and My Reports. | High |
| WF-02 | Search | Find report | WF-01 report is open; Student B is signed in. | Search by keyword and apply type, category, location, date, and status filters. | Matching report appears in the results. | High |
| WF-03 | Claim | Submit claim | Report is open; Student B did not report it. | Submit meaningful identifying evidence for the found item. | Claim is saved with `pending` status and appears in My Claims. | High |
| WF-04 | Review | Approve claim | A claim is pending; Staff/Admin is signed in. | Review the evidence, enter a decision reason and collection details, then approve. | Claim becomes `approved`; report remains `open`; claimant can see the decision. | High |
| WF-05 | Return | Confirm item returned | Claim is approved. | Staff/Admin confirms the item was collected. | Claim becomes `collected`; report becomes `returned`. | High |
| WF-06 | End-to-end | Complete report-to-return workflow | Test accounts and clean data are available. | Run WF-01 through WF-05 in sequence; check the listing and each user's view. | Claim progresses `pending` → `approved` → `collected`; report stays `open` until collection, then becomes `returned`. | High |

## 2. Missing/invalid input and failed login

| ID | Area | Test case | Preconditions | Steps | Expected result | Priority |
|---|---|---|---|---|---|---|
| VAL-01 | Input | Missing required fields | Student is signed in. | Submit a report with a required field missing. | Submission is blocked, the field error is shown, and no report is created. | High |
| VAL-02 | Input | Invalid or overlong input | Student is signed in; a found report is open. | Try a malformed/future date, text exceeding a field limit, and claim evidence that is too short. | Invalid input is rejected with a clear error; no invalid report or claim is saved. | High |
| AUTH-01 | Login | Incorrect or unknown credentials | User is signed out. | Try an unknown email, then a valid test email with the wrong password. | Login fails; user stays signed out and protected pages remain inaccessible. | High |

## 3. Authorization and claims

| ID | Area | Test case | Preconditions | Steps | Expected result | Priority |
|---|---|---|---|---|---|---|
| ACL-01 | Authorization | Edit another student's report | Student B owns a report; Student A is signed in. | Student A opens the report's edit page and tries to save a change. | Access is denied or redirected; the report remains unchanged. | High |
| ACL-02 | Authorization | View another student's claim | Student B has a claim; Student A is signed in. | Check My Claims and request Student B's claim by ID. | Only Student A's claims are shown; the other claim is denied with an access error. | High |
| CLM-01 | Claims | Competing claims | An open found report exists; two students can claim it. | Both students submit claims; staff approves one and then tries to approve the other. | At most one claim is approved; the second approval is rejected. | High |
| CLM-02 | Claims | Claim an item already returned | A found report is `returned`; another student is signed in. | Try to submit a claim for the report. | Claim is blocked with an error; no new claim is created. | High |

## 4. Mobile and keyboard use

| ID | Area | Test case | Preconditions | Steps | Expected result | Priority |
|---|---|---|---|---|---|---|
| UX-01 | Mobile | Use app at 375px width | App is open at a 375px viewport. | Browse reports, open a report, and use the report and claim forms. | No horizontal scrolling; text, fields, and buttons remain visible and usable. | Medium |
| UX-02 | Keyboard | Navigate and submit without a mouse | App is open; use keyboard only. | Tab through navigation and forms; use Enter/Space to activate controls and submit. | Focus is visible and ordered logically; all controls and form submission work by keyboard. | High |
