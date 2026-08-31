# Phase 8J — Postman E2E CRUD and UAT

Date: 2026-07-22
Last revalidated: 2026-07-28
Status: LOCAL COLLECTION GATE PASS — REMOTE CRUD E2E BLOCKED

## Changes

- Added a secret-empty shared-hosting staging environment template.
- Completed Postman coverage for social/catalog list-update-delete, theme update, public QR/VCF, and current subscription.
- Moved destructive card/content operations into a final cleanup folder so they do not invalidate content/public checks.
- Added an automated Postman coverage contract for core auth, card CRUD, content CRUD, public assets, payment, and subscription routes.

## Execution rules

- Use a disposable staging database or disposable test records.
- Use the Basic account for card/social/catalog CRUD; use Pro for logo and Pro limits; use Admin only for admin folders when added/executed.
- Enter password and OTP only into local Postman secret/current values. Never export a populated environment or cookie jar.
- Run destructive cleanup last.
- A valid Midtrans settlement notification must come from Midtrans sandbox or server-side reconciliation; the collection intentionally tests only invalid-signature rejection without a server key.

## Gate

The 2026-07-28 local readiness rerun passed:

- Collection plus both environment templates parsed successfully (3/3).
- The automated Postman endpoint-coverage contract passed inside the backend
  suite.
- Newman executed the Foundation/Health folder against the local backend with
  1 request and 3/3 assertions passing.
- Backend regression passed 89 tests with 1 opt-in database test skipped;
  frontend regression passed 64/64.

The complete destructive CRUD collection was not run against the persistent
local developer database because the runbook requires disposable records/data.
Remote CRUD E2E remains blocked until Phases 8H and 8I provide a stable HTTPS
frontend/API environment and the operator supplies only local Postman secret
values. This is the correct stop boundary before the separately approved
database/backend preparation stage.
