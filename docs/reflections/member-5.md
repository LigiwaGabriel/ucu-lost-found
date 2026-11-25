# Member 5 

## My responsibilities
- I built the report browsing, reporting, and claim pages.
- I wrote server-side validation tests.
- I prepared the test plan and results documents.

## What I built (files, features, commits)
I created `client/src/pages/Browse.jsx` and `client/src/components/ReportCard.jsx` for browsing reports, with keyword, type, category, campus location, date, and status filters. I also built `client/src/pages/ReportForm.jsx` and `client/src/pages/MyReports.jsx` for creating, editing, and viewing my reports. In `client/src/pages/ReportDetail.jsx`, I added report details, status, edit access for my own report, and a claim form with evidence validation and submission feedback. I added `server/tests/validate.test.js` to cover valid and invalid registration, report, and claim input. I prepared `docs/testing/test-plan.md` and `docs/testing/test-results.md`. My contribution appears in four commits: two UI feature commits, one test commit, and one documentation commit.

## Decisions I made and why
- I sent selected browse filters as query parameters so the API receives only active criteria.
- I checked claim evidence in the page for quick feedback and kept server validation as the final check.
- I used Node's built-in test runner to keep the validation tests simple and dependency-free.

## Challenges and how I solved them
Keeping filters and results in sync was a challenge; I made Clear reset the filters and reload all reports, and omitted empty values from the API query.

I also needed to distinguish completed unit tests from planned workflow tests. I tested valid and invalid inputs and listed broader workflow and accessibility checks in the plan, while leaving their results unclaimed.

## What I learned / what I would do differently
I learned to trace a report from its React form to the API, and that client-side validation must be backed by server checks. I also learned that a test plan is not evidence; the results file still needs actual outcomes.


