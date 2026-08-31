# Phase 3C — Card Customization, Publish, and Public Report

Date: 2026-07-19
Status: **ACCEPTED**

## Delivered

- Basic/Pro custom slug normalization, reserved-root rejection, availability, collision handling, and mutation.
- Name/mobile suggestion with explicit phone-exposure warning and alternatives without the phone number.
- Active theme catalog, access flags, per-card theme listing, and selection through `plan_theme_access`.
- Ownership and session-bound CSRF protected card publication.
- Anonymous public card retrieval only for non-deleted `published` cards with active themes.
- Case-sensitive database lookup preserves Starter mixed-case slugs.

## Verification

- Strict TypeScript: passed.
- Active unit/security/HTTP suite: 38 passed, 0 failed.
- Disposable MariaDB full Auth + Starter + Card + slug/theme + publish/public lifecycle: passed.
- Draft invisibility, cross-owner 404, publish, public retrieval, soft-delete removal, slug collision, reserved paths, and theme access were verified.

## Files changed

- `backend/src/modules/cards/`: DTOs, controllers, routes, services, repository contracts, and MySQL2 persistence.
- `backend/src/modules/plans/`: capability service and prepared-query reader.
- `backend/src/shared/security/authenticated-actor.ts`.
- Migration 003, database reference/dictionary, OpenAPI, implementation status, changelog, tests, and manifests.

## Residual risks and boundary

1. Public Card returns data only; HTML frontend rendering is Phase 6.
2. `qrImageUrl` remains a contract URL. QR and VCF endpoints are Phase 4 and are not implemented.
3. Slug availability is advisory; the unique database index remains final authority during mutation.
4. Production cookie/domain behavior and concurrency/load remain QA environment gates.
5. The product owner accepted Phase 3 and authorized Phase 4 on 2026-07-19.
