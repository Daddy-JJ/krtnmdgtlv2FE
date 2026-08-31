# Phase 5C — Verified Webhook and Subscription Activation Report

Date: 2026-07-19
Status: **ACCEPTED**

## Delivered

- Public `POST /api/v1/payments/midtrans/webhook` server-to-server endpoint without browser authentication or CSRF assumptions.
- Mandatory Midtrans payload validation and constant-time SHA-512 signature verification before repository mutation.
- Payment lookup by unique server-generated merchant order ID and exact gross-amount comparison against the immutable payment snapshot.
- Unique event-key and SHA-256 payload-hash idempotency with duplicate acknowledgement and conflicting-event rejection.
- State mapping for pending, paid, failed, expired, canceled, and refunded notifications; unknown and regressive notifications do not unlock features.
- Activation only for `settlement` or `capture` with `fraud_status=accept` and success status code.
- Atomic payment, payment-event, subscription, card-plan, and sanitized activity-log updates.
- Same-plan annual renewal extension by exactly 365 days from the later of
  active subscription end time or verified payment time, as corrected by
  CR-005/D-049.
- Upgrade activation that supersedes the prior active subscription without deleting paid-tier card data.

## Verification

- Strict TypeScript: passed.
- Active unit/security/HTTP suite: 69 passed, 0 failed; database lifecycle skipped in the non-DB run.
- Disposable MariaDB lifecycle: 1 passed, 0 failed after final amount-mismatch coverage.
- Verified public webhook routing, verify-before-mutate ordering, duplicate acknowledgement, event conflict handling, unknown-order rejection, amount mismatch rejection, one-event persistence, paid activation, card plan synchronization, activity logging, and renewal extension.
- Invalid signature behavior is included in unit tests and the Postman negative test; no Server Key is stored in Postman.

## Security boundary

1. Browser redirect, finish callback, query string, and frontend state never activate membership.
2. Invalid signatures are rejected before any payment-event or subscription write.
3. Amount mismatch is durably recorded as rejected while the payment remains non-paid.
4. Duplicate delivery is safe and does not extend a subscription twice.
5. Server Key stays in backend environment configuration and is removed from verified notification output.
6. Activity metadata contains only payment public ID and plan code—no credential or raw gateway payload.

## Remaining scope

- Phase 5D: user reconciliation endpoint, gateway status reconciliation policy, current-subscription endpoint, plan/payment minimal admin reads/mutations, role enforcement, and audit trail.
- Live Midtrans sandbox end-to-end verification still requires sandbox credentials and a reachable HTTPS notification URL.

## Phase gate

Phase 5C was explicitly accepted by the product owner on 2026-07-19. Phase 5D then started under separate approval. No commit or push was performed.
