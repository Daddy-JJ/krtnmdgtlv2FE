# Phase 3B — Card CRUD Report

Date: 2026-07-18
Status: **ACCEPTED**

## Delivered

- Authenticated `GET/POST /cards` and `GET/PUT/DELETE /cards/{publicId}` routing.
- Strict contact/locale DTO; plan, slug, theme, logo, Maps, and unknown fields are rejected.
- Transactional verified active-user and active Basic/Pro subscription resolution.
- Transactional one-active-card enforcement and active plan-theme default selection.
- Ownership-scoped reads/mutations with uniform non-enumerating 404 responses.
- Soft delete through card status and timestamps.
- Parameterized MySQL2 persistence; controllers remain thin and business rules remain in the service.

## Verification

- Strict TypeScript: passed.
- Active unit/security/HTTP suite: 29 passed, 0 failed.
- Disposable MariaDB full Auth + Starter + Card lifecycle: passed.
- Verified migration/seed idempotency, entitlement denial, paid create/list/get/update/delete, ownership isolation, one-card conflict, soft-delete replacement, and migration rollback/reapply.

## Residual risks and boundary

1. The provisional random custom slug exists only to satisfy the non-null schema at paid card creation; user-facing suggestion/edit is Phase 3C.
2. Database unique enforcement and service one-card behavior passed MariaDB lifecycle verification; high-contention concurrency remains a production-load concern.
3. Publish/public, slug APIs, and theme APIs remain Phase 3C and have not started.
4. The product owner accepted Phase 3B and authorized Phase 3C on 2026-07-18.
5. Rolling migration 003 back to the legacy schema detaches deleted cards from their owner because the legacy unique constraint cannot represent retained deleted-card ownership.
