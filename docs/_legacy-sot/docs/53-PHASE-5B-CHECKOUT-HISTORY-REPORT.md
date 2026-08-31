# Phase 5B — Checkout Persistence and Payment History Report

Date: 2026-07-19
Status: **ACCEPTED**

## Delivered

- `POST /api/v1/payments/checkout` with access-cookie authentication, session-bound CSRF, and strict Basic/Pro-only input.
- `GET /api/v1/payments` and `GET /api/v1/payments/{publicId}` with ownership isolation and non-enumerating `404` behavior.
- Authoritative checkout lookup requiring an active verified user and a claimed, non-deleted card.
- Database-owned plan price, currency, duration, name, current subscription, and customer identity.
- Server-generated UUID payment ID and unique `KND_` merchant order ID.
- Pending payment persistence before the gateway call, immutable commercial snapshots, Snap redirect persistence, and failed status on gateway error.
- Disabled gateway `503`, unpriced/incomplete plan rejection, and Pro-to-Basic checkout downgrade rejection.
- OpenAPI payment/checkout envelopes and Postman Phase 5B requests.

## Verification

- Strict TypeScript: passed.
- Active unit/security/HTTP suite: 66 passed, 0 failed; database lifecycle skipped in the non-DB run.
- Disposable MariaDB lifecycle: 1 passed, 0 failed.
- Verified CSRF, DTO injection rejection, pending-before-gateway ordering, gateway failure transition, disabled gateway behavior, history without Snap token, ownership isolation, unique order shape, and immutable price/duration snapshots after plan changes.

## Security boundary

1. Browser input is only `planCode`; amount, currency, duration, order ID, customer identity, and status remain server-controlled.
2. Snap token is returned only by the checkout response and is not stored in payment history.
3. Server Key remains confined to backend environment and adapter construction.
4. Payment checkout never activates or changes a subscription.
5. Gateway failure cannot mark a payment paid and cannot unlock plan capabilities.

## Remaining scope

- Phase 5C: verified idempotent webhook, state transition policy, payment event persistence, subscription activation/extension, and card plan synchronization.
- Phase 5D: reconciliation and minimal admin operations with audit trails.
- Live Midtrans sandbox checkout requires external sandbox credentials and is not claimed by local adapter/database tests.

## Phase gate

Phase 5B was explicitly accepted by the product owner on 2026-07-19. Phase 5C then started under separate approval. No commit or push was performed.
