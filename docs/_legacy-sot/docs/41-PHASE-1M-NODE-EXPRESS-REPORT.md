# Phase 1M — Node.js and Express.js Foundation Report

Date: 2026-07-18  
Status: **ACCEPTED — CLEANUP AND REGRESSION COMPLETE**

## Scope delivered

- Node.js 24 LTS and Express 5 bootstrap using strict, erasable TypeScript syntax.
- Exact npm dependency manifest and committed integrity lockfile.
- Validated environment configuration without printing secret values.
- Helmet security headers, disabled framework signature, bounded strict JSON parsing, request IDs, common JSON errors, and metadata-only structured request logs.
- MySQL2 Promise pool and database-backed `GET /api/v1/health` with safe `503` response.
- SQL migration checksum/status/up/down runner and idempotent seed runner using the existing authoritative SQL files.
- Graceful process shutdown and `app.js` cPanel Passenger startup bridge.
- Native Node unit, HTTP integration, and MariaDB integration tests.

No Auth, Starter workflow, card CRUD, payment, email transport, QR rendering, or frontend business feature was implemented in this migration phase.

## Verification evidence

| Gate | Result |
|---|---|
| Node/npm runtime | Node 24.18.0; npm 11.16.0 |
| Strict TypeScript | `npm run typecheck` passed |
| Unit and HTTP | 8 passed, 0 failed; DB test intentionally skipped in the combined command |
| Database integration | 1 passed on isolated MariaDB 10.4.28 |
| Migration parity | up, second-run idempotency, rollback, remigrate passed |
| Seed parity | 3 plans, 33 capabilities, 10 themes, 14 plan-theme mappings |
| Slug collation | `cards.slug` verified as `utf8mb4_bin` |
| Dependency security | `npm audit --audit-level=high`: 0 vulnerabilities |

The disposable MariaDB process and temporary data directory were removed after testing.

## Security assessment for delivered scope

- Database health uses a fixed prepared query; future repositories must use parameterized `execute()` calls.
- Request logging excludes headers, cookies, body content, credentials, and tokens.
- Production debug output is disabled by environment policy.
- The API sends Helmet headers, `X-Request-ID`, JSON error envelopes, and no `X-Powered-By` signature.
- No secret was added to the repository; `.env` remains ignored and absent.
- Auth/CSRF/IDOR/rate-limit/payment/upload checks cannot be executed before those modules exist and remain required gates in `docs/39-QA-SECURITY-EXECUTION-PLAN.md`.

## Files and runtime boundary

The active implementation is under `backend/src/`, `backend/scripts/`, and `backend/tests/`, governed by `backend/package.json` and `backend/package-lock.json`. After owner acceptance, the historical PHP/Composer runtime files, Apache front controller, and PHP test harness were removed. SQL migrations/seeds and reusable mail templates were preserved.

## Residual risks and decisions needed

1. Confirm production hosting supports Node 24 through cPanel Application Manager/Passenger; otherwise use a VPS/reverse proxy.
2. The workspace is not yet a Git repository, so CI/history gates are unavailable.
3. Postman desktop assets are ready, but Newman/Postman CLI automation is not installed.
4. OpenAPI response typing/cookie/error gaps recorded in `docs/38-BACKEND-API-READINESS-REPORT.md` must be resolved per feature phase.

## Phase boundary

The owner accepted Phase 1M on 2026-07-18. Cleanup was followed by Node typecheck and HTTP/unit regression. Phase 2 remains unstarted and requires an explicit start instruction under the phase protocol.
