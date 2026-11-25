**Milestone 1b – 6 Marks**  
**Owner: Member 3 – Claims and Admin**

## Functional Requirements

- **FR1:** Students must be able to submit claims for found items by explaining why the item belongs to them.
- **FR2:** Students must view their claim status and the administrator's response.
- **FR3:** Administrators must approve or reject claims and provide a reason.
- **FR4:** Administrators must confirm when an item has been collected and returned.
- **FR5:** Claim evidence and private details must only be accessible to the claimant and administrator.

## Non-functional Requirements

- **NFR1 – Mobile layout:** The claims and admin pages should work on phones and computers.
- **NFR2 – Accessibility:** Forms should have clear labels and readable messages.
- **NFR3 – Security:** Only logged-in users can submit claims, and only administrators can review them.
- **NFR4 – Persistence:** Claims and their statuses should remain saved in the database after refreshing or restarting the application.

## Acceptance Criteria

| ID | Requirement | Acceptance criterion |
|---|---|---|
| FR1 | Submit claim | Given a logged-in student, when they submit valid ownership evidence, then the claim is saved for review. |
| FR2 | View status | Given a student has submitted a claim, when they open My Claims, then they see its status and admin response. |
| FR3 | Review claim | Given an administrator is reviewing a pending claim, when they approve or reject it with a reason, then the decision is saved. |
| FR4 | Confirm return | Given a claim has been approved, when the administrator confirms collection, then the item is marked as returned. |
| FR5 | Privacy | Given a student tries to access another student's private claim, then access is denied. |

## Claim Rules

1. Only found items can be claimed.
2. A student cannot claim an item they reported as found.
3. A student cannot submit duplicate claims for the same item.
4. Only one claim can be approved for an item.
5. No new claims are accepted after an item is returned.
6. An item is marked returned only after collection is confirmed by the administrator.

