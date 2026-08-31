# Change Request CR-006 — Fixed Upgrade Fees

Status: Approved.

## Context

Midtrans does not support automatic prorated membership upgrade handling for
the MVP. Upgrade pricing and eligibility must therefore be controlled inside
Kartunama Digital's backend workflow.

## Locked rules

| Current tier | Target tier | Fee |
|---|---|---:|
| Starter | Basic | IDR 55,000 |
| Starter | Pro | IDR 97,000 |
| Basic | Pro | IDR 55,000 |
| Pro | - | No upgrade available |

Browser requests may submit only the target tier. The backend controls amount,
duration, order ID, payment status, and membership activation.

## Subscription effect

A verified successful upgrade starts a fresh target-tier entitlement for exactly
365 days from the verified payment timestamp and supersedes the prior active
subscription.

## UI effect

- Starter dashboard shows Upgrade to Basic and Upgrade to Pro.
- Basic dashboard shows only Upgrade to Pro.
- Pro dashboard shows no upgrade checkout CTA.

## Implementation notes

- No schema migration is required because `payments.amount` and
  `payments.duration_days_snapshot` already store immutable checkout snapshots.
- Seed capability sets `upgrade_enabled=false` for Pro.
- Midtrans webhook/status verification remains the only authoritative payment
  evidence.
