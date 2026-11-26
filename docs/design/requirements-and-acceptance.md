# Requirements and Acceptance Criteria
**Milestone 1b – Requirements and Acceptance Criteria**  
**Owner: Member 3 – Claims and Administration**

## 1. Functional Requirements

- **FR1 – Submit Claims:** A logged-in student shall be able to submit an ownership claim for a found item by providing an explanation of why they believe it belongs to them.
- **FR2 – View Claims:** Students shall be able to view their own claims, including their status, administrator's response and collection details.
- **FR3 – Claim Review:** An administrator shall be able to review claim evidence and approve or reject claims while providing a reason for the decision.
- **FR4 – Collection Confirmation:** An administrator shall be able to confirm that an approved item has been collected and mark the report as returned.
- **FR5 – Claim Restrictions:** The system shall prevent students from claiming items they reported as found, submitting duplicate claims for the same item, or claiming items that have already been returned.
- **FR6 – Administrative Permissions:** Only authorized administrators shall be able to review claims, make decisions and confirm item returns.

## 2. Non-Functional Requirements

- **NFR1 – Mobile Responsiveness:** The claims and administration pages shall be usable on mobile phones, tablets and desktop computers.
- **NFR2 – Accessibility:** Forms shall have labelled fields, readable text, clear error messages and accessible status messages.
- **NFR3 – Security:** Claim evidence and private information shall only be accessible to the claimant and authorized administrators. Administrative actions shall be protected by backend permissions.
- **NFR4 – Persistence:** Claims, decisions and return records shall be stored in MySQL and remain available after refreshing or restarting the application.
- **NFR5 – Reliability:** The system shall validate claim submissions and prevent invalid claim decisions or collection confirmations.

## 3. Acceptance Criteria

| ID | Requirement | Acceptance Criterion |
|---|---|---|
| FR1 | Submit claims | Given a logged-in student, when they submit a valid claim for a found item, then the claim is saved with pending status. |
| FR2 | View claims | Given a student has submitted claims, when they open My Claims, then they see their claims, statuses and administrator responses. |
| FR3 | Claim review | Given a pending claim, when an administrator approves or rejects it with a valid reason, then the decision is saved and visible to the claimant. |
| FR4 | Collection confirmation | Given a claim has been approved, when the administrator confirms collection, then the claim becomes collected and the item becomes returned. |
| FR5 | Claim restrictions | Given an item is returned, already approved for another claim, or reported as found by the claimant, when a student attempts to claim it, then the system rejects the request. |
| FR6 | Administrative permissions | Given a student account, when it attempts to access administrative claim-review functions, then the backend denies access. |

## 4. Claim Rules

1. Only logged-in students may submit claims.
2. Only found items may be claimed.
3. Students cannot claim items they reported as found.
4. A student cannot submit a duplicate claim for the same item.
5. Only one claim may be approved for an item at a time.
6. No further claims may be submitted after an item is returned.
7. Administrators must provide a reason when approving or rejecting claims.
8. An item is marked returned only after collection has been confirmed.
9. Claim evidence and private identifying details must not be exposed publicly.

## Conclusion

The claims and administration module helps students recover their lost property through a controlled process of claim submission, administrator review and confirmed collection. These requirements promote accountability, security and fairness within the UCU Campus Lost and Found System.

