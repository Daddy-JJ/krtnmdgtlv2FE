# Change Request CR-008 — UTC Persistence Consistency

## Requested change

Configure the MySQL2 application pool to serialize JavaScript `Date` values
as UTC and initialize every MariaDB session in UTC.

## Reason

The database integration test found that a subscription activated with a
JavaScript timestamp could be written in local server time while entitlement
queries correctly used MariaDB `UTC_TIMESTAMP()`. In a non-UTC process
timezone, the new subscription was temporarily treated as not yet active and
the Basic-to-Pro checkout selected the wrong Starter-to-Pro transition fee.

## Decision

Set `timezone: 'Z'` in the shared MySQL2 pool and run `SET time_zone =
'+00:00'` for every new connection. The integration test uses the same pool,
asserts its session timezone, and verifies that a newly activated Basic
subscription is current before it can be upgraded to Pro.

## Impact

No migration, stored-data conversion, OpenAPI change, feature change, tier
change, or price change is required. Existing stored timestamps already
represent UTC application events; the change prevents future local-time
serialization drift.

## Approval

Approved by the product owner in this Codex session on 2026-08-03: “perbaiki
konsistensi timestamp UTC”.

## Acceptance

- Database integration test passes on MariaDB with a non-UTC system timezone.
- Starter-to-Basic remains IDR55.000, Starter-to-Pro IDR97.000, and
  Basic-to-Pro IDR55.000.
- Shared pool contract asserts `timezone: 'Z'` and `SET time_zone = '+00:00'`.
- MariaDB integration test observes session timezone `+00:00`.
