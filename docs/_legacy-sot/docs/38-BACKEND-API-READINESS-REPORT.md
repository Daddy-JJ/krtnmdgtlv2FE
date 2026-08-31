# Backend, Database, REST API, and Postman Readiness

Date: 2026-07-18  
Status: **PHASE 1M ACCEPTED; PHASE 2 START PENDING**

## Executive result

CR-002 selected Node.js 24 LTS, Express 5, strict TypeScript, and MySQL2 as the active backend stack. The Node foundation now matches the verified Phase 1 database/health baseline. Phase 2 starts only after product-owner acceptance.

## Environment readiness

| Area | Current state | Readiness |
|---|---|---|
| Legacy PHP runtime | Runtime files removed after accepted parity | Retired |
| MariaDB | XAMPP MariaDB 10.4.28 installed | Engine ready; normal port 3306 server was not running during audit |
| Application database | Migration and seeds passed in isolated MariaDB | Ready to provision; root `.env` is intentionally absent |
| Node.js | Node 24.18.0, npm 11.16.0 | Runtime ready |
| Express.js | Express 5.2.1 with Helmet and strict JSON boundary | Foundation ready |
| Postman CLI/Newman | Not installed | Desktop import assets ready; CLI automation pending installation approval |
| Git/CI | Workspace is not a Git repository | Not ready for automated pipeline/history |

## Database readiness

- 19 product tables plus the operational `auth_rate_limits` table exist in two executable migrations with reverse-order safe down.
- Migration checksum, rerun, rollback, and remigration are tested.
- Seed output is verified: 3 plans, 33 capabilities, 10 themes, and 14 cumulative plan-theme mappings.
- Starter slug uses a binary/case-sensitive database collation.
- MySQL2 prepared `execute()` is the repository rule; schema-controlled migration/seed DDL is executed only by the runner.
- Basic/Pro price and duration intentionally remain configurable and zero in the initial seed.

Operational work still required before a local API server can use the database:

1. Start XAMPP MariaDB.
2. Create a dedicated application database/user with least privilege.
3. Copy `.env.example` to untracked `.env` and configure connection values.
4. Run migrations and seeds.
5. Confirm backup/restore before production data exists.

## REST and CRUD readiness

OpenAPI currently defines 55 operations: 23 GET, 20 POST, 7 PUT, 3 DELETE, and 2 PATCH.

CRUD coverage present:

- Cards: list/create/read/update/delete plus publish, slug, and theme selection.
- Social links: list/create/update/delete.
- Catalog: list/create/update/delete.
- Account: read/update.
- Plans/themes: public reads and partial admin management.
- Payments/subscription/public profile/QR/vCard/email administration: contract routes present.

Contract corrections completed during this audit:

- `/auth/refresh` now uses a distinct `refresh_token` cookie security scheme.
- Starter create/update now use `StarterCardInput`, which exposes only locale and contact data; slug/theme/paid fields are not accepted by contract.

Remaining contract gaps to resolve before or within their implementation phase:

1. Many responses use generic `SuccessEnvelope`: only 17 operations currently point to a typed Card/Plan envelope, while 40 reference the generic envelope. Frontend and Postman assertions need typed schemas.
2. Auth responses do not fully document cookie issuance/clearing, CSRF cookie rotation, email-unverified `403`, rate-limit headers, or examples.
3. Admin PRD/UAT requires card suspension and audit visibility, but explicit mutation/activity endpoints are absent.
4. Pagination/filter/sort schemas for admin and collection endpoints are incomplete.
5. Card deletion semantics (soft delete, response, restoration/non-restoration) require explicit API wording.

## Frontend/API integration readiness

Frontend implementation should not begin against inferred payloads. It can safely depend on:

- `/api/v1` same-origin base;
- JSON success/error envelope;
- cookie-based authentication with `credentials: include`;
- `X-CSRF-Token` for unsafe cookie-authenticated requests;
- `X-Request-ID` response header;
- exact Starter/Basic/Pro codes and immutable theme codes.

Before each frontend module starts, its backend endpoint must have:

- typed OpenAPI request and response schemas;
- error/status coverage;
- example payloads;
- passing integration and Postman tests;
- documented cookie/CSRF behavior where applicable.

## Postman readiness

The curated collection under `qa/postman/` covers Phase 1 health, Phase 2 auth/Starter flow, and core card CRUD. Postman must retain auth/manage cookies in its cookie jar; authentication tokens must never be copied into environment variables.

The collection intentionally contains future requests. Run folders only after the matching backend phase is complete. For all contract routes, import `openapi/openapi.yaml` directly into Postman.

## Architecture decision

CR-002 resolves the gate: strict TypeScript, Express 5, MySQL2 prepared statements, no ORM, npm lockfile, and Node-native tests are implemented and verified. The PHP/Composer runtime files were removed after Phase 1M acceptance; only historical reports remain.
