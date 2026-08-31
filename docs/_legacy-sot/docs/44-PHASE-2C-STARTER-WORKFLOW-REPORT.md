# Phase 2C — Starter Workflow Report

Date: 2026-07-18  
Status: **ACCEPTED**

## Delivered endpoints

- `POST /api/v1/starter/cards`
- `PUT /api/v1/starter/cards/{publicId}`
- `POST /api/v1/starter/cards/{publicId}/claim`

## Rules implemented

- Anonymous create accepts only locale/contact fields; client slug, plan, theme, logo, and paid capabilities are rejected.
- Starter slug is exactly seven CSPRNG letters from `a-zA-Z`, case-sensitive, collision-checked, bounded to ten attempts, and immutable.
- Theme `starter-clean` must be active and explicitly accessible to the active Starter plan through database joins.
- Manage credential contains at least 256 bits, is returned only as Secure/HttpOnly cookie, and only its SHA-256 hash is persisted.
- Separate readable `starter_csrf_token` is HMAC-signed and bound to the current manage hash, so access login cannot overwrite Starter manage context.
- Successful edit updates only Starter locale/contact data and atomically revokes/replaces manage and CSRF credentials.
- Claim requires valid access and manage credentials, manage-bound CSRF, active verified user, and no existing active card.
- Successful claim assigns ownership and revokes every manage token; CSRF is rebound to the access session.

## Verification

| Gate | Result |
|---|---|
| Strict TypeScript | Passed |
| Active unit/security/HTTP suite | 24 passed, 0 failed |
| Isolated MariaDB lifecycle | Passed |
| Slug profile | 1,000 generated values matched seven ASCII letters and mixed case |
| Token rotation | New token works; old token rejected |
| Claim | Ownership assigned; manage access revoked |
| One-card rule | Second claim by same account rejected |
| Plaintext persistence | Manage plaintext absent; stored hashes revoked after claim |
| Contract injection | Client slug/theme fields rejected |

## Files changed

- `backend/src/modules/starter/`: controllers, routes, service, slug generator, repository contracts, and MySQL2 adapter.
- `backend/src/shared/http/cookie-reader.ts` and Auth controller cookie parsing.
- `backend/src/app.ts` and `backend/src/server.ts` wiring.
- Starter unit/HTTP/database integration tests.
- OpenAPI, Auth/CSRF decision records, QA status, changelog, and manifest.

## Residual risks and environment gates

1. Postman Phase 2 Auth/Starter folders still require a configured running database, RSA/HMAC secrets, and SMTP credentials.
2. Public card rendering and QR endpoints are not implemented; `qrImageUrl` remains the contract URL for Phase 4.
3. Starter rate-limit expiry cleanup remains a deployment cron concern shared with Auth limits.
4. Browser UAT must confirm cookie path/domain/SameSite behavior on the final production hostname.
5. Claim does not activate Basic/Pro; paid membership remains server-verified Midtrans work in its later phase.

## Next boundary

The product owner accepted Phase 2C and closed Phase 2 on 2026-07-18. Phase 3 Card Core must not start without a new explicit approval.
