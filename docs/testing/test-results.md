# Test Results — UCU Lost & Found

**Owner:** Member 5

**Execution:** Automated server validation tests, run with `npm test` in `server`.

## Automated results

| Test area | Actual outcome | Result |
|---|---|---|
| Registration validation | Valid registration input was accepted; malformed email and weak password were rejected. | Pass |
| Report validation | Missing/invalid report fields and a future date were rejected. | Pass |
| Claim validation | Too-short evidence was rejected; meaningful evidence was accepted. | Pass |

**Summary:** 4 tests passed, 0 failed. Test file: `server/tests/validate.test.js`.

## Not run

The automated suite covers validation helpers only. The report-to-return workflow, search and filters, login/session behavior, ownership and claim authorization, competing claims, returned-item claims, file uploads, mobile layout, and keyboard navigation were not tested in this run. Record their outcomes here after manual execution; do not treat them as passed based on these unit tests.

## Defects found and fixed

None during this automated test run.

## Unresolved defects / limitations

- The test suite does not exercise the application UI, API/database integration, or the end-to-end workflow.
- Planned manual and responsive/accessibility tests remain to be executed and recorded.
