# Phase 3A — Card Core Foundation Report

Date: 2026-07-18
Status: **ACCEPTED**

## Delivered

- D-040 locks authenticated card creation to verified active Basic/Pro subscription entitlement.
- `PlanCapabilityService` implements `isEnabled`, `getLimit`, `assertEnabled`, and `assertWithinLimit` with fail-closed configuration handling.
- MySQL capability reads use parameterized `execute()` queries and active plan authority.
- `AuthenticatedActorService` centralizes RS256 access-cookie validation and session-bound CSRF validation for unsafe Card Core requests.
- OpenAPI documents the paid-entitlement and one-card conflict outcomes for `POST /cards`.

## Verification

- Strict TypeScript: passed.
- Active unit/security/HTTP suite: 26 passed, 0 failed.
- Database integration test: 1 skipped because no disposable database was enabled for this subphase.

## Files changed

- Decision, authorization, membership enforcement, OpenAPI, repository status, changelog, and file index documentation.
- `backend/src/modules/plans/`: capability service and MySQL reader.
- `backend/src/shared/security/authenticated-actor.ts`.
- Capability unit tests.

## Risks and next boundary

1. CRUD repositories do not yet consume these foundations; that is Phase 3B.
2. Effective paid entitlement must be resolved from active subscription dates/status in the Card repository transaction.
3. Full MariaDB lifecycle verification is required after CRUD persistence is wired.
4. The product owner accepted Phase 3A and authorized Phase 3B on 2026-07-18.
