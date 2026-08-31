# Phase 4D — Logo, Maps, WhatsApp, and Public Aggregate Report

Date: 2026-07-19
Status: **ACCEPTED**

## Delivered

- Nullable HTTP(S)-only Maps URL on card create/update, persisted with prepared MySQL2 queries and gated by `maps_enabled`.
- Read-only Pro WhatsApp CTA derived server-side from the card mobile number; clients cannot submit or persist a WhatsApp URL.
- Pro-only logo upload using authenticated session + session-bound CSRF, Multer memory transport, and a 5 MiB request limit.
- Sharp-based actual image decoding for JPEG/PNG/WebP, input-pixel and dimension limits, autorotation, maximum 1600×1600 output, and WebP normalization.
- Opaque UUID storage keys, traversal-resistant reads/removals, replacement cleanup, and rollback cleanup if persistence fails.
- Anonymous published Pro logo endpoint with WebP content type, ETag, immutable cache headers, and conditional `304` response.
- Public card aggregate containing capability-limited social links and published catalog items, with deterministic sorting; unpublished catalog items remain private.
- OpenAPI contract updates for logo upload/public delivery and aggregate response fields.

## Verification

- Strict TypeScript: passed.
- Active unit/security/HTTP suite: 57 passed, 0 failed; one database test skipped in the non-DB run.
- Disposable MariaDB full lifecycle: 1 passed, 0 failed.
- Dependency audit: 0 known vulnerabilities.
- OpenAPI YAML parse: passed.
- Verified image decode/resize/WebP conversion, invalid-image rejection, Pro-before-processing authorization, opaque storage keys, traversal rejection, Maps persistence, logo-path persistence, WhatsApp derivation, public aggregate tier limits, and database migration/seed rollback/reapply.

## Security boundary

1. Browser-supplied plan, logo path, WhatsApp URL, and payment state are never trusted.
2. Logo authorization occurs before CPU-intensive image processing.
3. Uploaded bytes are decoded and normalized; filename and claimed MIME type do not determine acceptance.
4. Public content is returned only for published, non-deleted cards; logos additionally require the current Pro plan.
5. SQL remains parameterized, and storage keys are generated server-side.

## Remaining deployment risks

1. Filesystem logo storage requires persistent shared storage. It is suitable for a single VPS/cPanel Node instance, but must move to object storage or another persistent adapter before stateless/serverless multi-instance deployment.
2. Production reverse proxy/body-size limits must be aligned with the application 5 MiB limit.
3. Image processing should receive production concurrency/load testing and resource monitoring.
4. Phone normalization currently targets Indonesian local numbers by converting a leading `0` to country code `62`; international product expansion needs a dedicated phone parser and country input.
5. Frontend runtime and Vercel preview remain Phase 6 work; Phase 4D completes backend/public API capability, not the deployable frontend.

## Phase gate

Phase 4D and Phase 4 overall were explicitly accepted by the product owner on 2026-07-19. No Phase 5 work, Git commit, or Git push was performed.
