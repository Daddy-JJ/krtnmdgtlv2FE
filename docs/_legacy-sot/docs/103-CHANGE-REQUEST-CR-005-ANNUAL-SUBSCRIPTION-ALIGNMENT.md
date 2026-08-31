# CR-005 — Annual Subscription Alignment

Date: 2026-07-29
Status: approved by product owner

## Correction

Basic and Pro are annual subscriptions with an entitlement term of exactly 365
days. The former one-time transaction, manual-renewal-only, and non-recurring
product statements are invalid and superseded.

## Authoritative rules

- Starter remains free and has no paid subscription term.
- Basic and Pro each use `duration_days = 365`.
- Price is configurable; annual duration is policy-locked.
- Initial activation and renewal require verified server-side payment evidence.
- Browser callbacks cannot activate, renew, extend, or change a tier.
- Same-plan renewal extends from the later active end date or verified payment
  time by exactly 365 days.
- Upgrade creates a new 365-day target-tier term and supersedes the former
  active subscription.
- Midtrans automated collection work remains paused until separately resumed;
  this operational pause does not alter the annual subscription product model.

## Impacted areas

SOT, decision log, membership matrix, PRD, database seed/migration, payment
service, admin plan validation, OpenAPI, billing UX, Postman/QA wording,
deployment validation, prompts, and Phase 9 entitlement documentation.
