# Phase 8E Shared Hosting Deployment Dry-Run

Date: 2026-07-22
Status: DRY-RUN READY — PROVIDER CONFIRMS NODE.JS V24.18.0

## Scope

Phase 8E prepares the exact cPanel/shared-hosting deployment sequence while the provider processes the Node.js 24 request.

Included:

- Map the repository backend to cPanel Node.js Application Manager/Passenger fields.
- Define a safe install, environment, database, migration, startup, smoke, and rollback sequence.
- Separate verified hosting evidence from the temporary Node.js 24 planning assumption.
- Keep secrets, credentials, and live infrastructure changes outside the repository.

Excluded:

- Claiming Node.js 24 is already active.
- Logging in to cPanel/SSH or changing live hosting.
- Running migrations against the shared-hosting database.
- Changing DNS, shared-host routing, SMTP, or Midtrans configuration.
- Downgrading the backend to Node.js 22.

## Runtime gate

| Item | Value |
|---|---|
| Provider-confirmed runtime | Node.js `v24.18.0` — compatible with the locked backend runtime |
| Effective runtime evidence | Sanitized cPanel application/SSH output still pending |
| Required final evidence | Sanitized `node -v`, `npm -v`, and cPanel selected runtime |
| Gate behavior | Stop before dependency install or app start when the effective runtime is outside `>=24.7 <25` |

Provider capability confirmation is not deployment approval. D-059 supersedes the former native Argon2 gate; the effective application process must report Node.js `>=22.18 <23` with built-in asynchronous scrypt available.

## cPanel application mapping

Preferred mapping when only the backend directory is uploaded as the application root:

| cPanel field | Planned value |
|---|---|
| Node.js version | Provider-selected Node.js `24.x`, at least `24.7.0` |
| Application mode | Production |
| Application root | `/home/<cpanel-user>/apps/kartunamadigital/backend` |
| Application URL | `https://api-staging.kartunamadigital.id` or the approved backend subdomain |
| Application startup file | `app.js` (physical CommonJS bridge) |
| Package file | `package.json` in the application root |

If the complete repository is uploaded instead, keep the backend as the registered application root. Do not register `frontend/` as the Node application.

`backend/passenger.cjs` is the LiteSpeed-compatible CommonJS bridge and dynamically imports `src/server.ts`. The app therefore needs the locked Node.js 22 runtime that can execute the checked-in erasable TypeScript directly.

## Filesystem and permission plan

The following backend paths must exist and remain non-public:

```text
backend/storage/private/             JWT key pair
backend/storage/cache/qr/            generated QR cache
backend/storage/public/uploads/logos user logo files
```

Requirements:

- Application source and `storage/private/` must not be placed under a directory-listable public document root.
- The Node process needs write access only to the storage directories it uses.
- JWT private keys, logs, `.env`, and database credentials must never be web-accessible.
- Monarx quarantine/history must be checked after install and startup; do not disable Monarx globally just to make the app run.

## Environment plan

Use the cPanel Node application environment-variable UI, based on `backend/.env.production.example`. Do not commit or paste real values into repository documentation.

Staging-safe decisions:

| Variable | Planned rule |
|---|---|
| `APP_ENV` | `staging` until production promotion |
| `APP_DEBUG` | `false` |
| `APP_URL` | Exact public HTTPS frontend origin (`https://staging.kartunamadigital.id` for staging); used for canonical card and user-facing links, not a separate API origin |
| `PORT` | Use the value assigned/injected by the process manager when required |
| `DB_HOST` | Provider-confirmed local database hostname; normally `localhost` |
| `DB_SOCKET` | Empty unless the provider supplies an exact Node-accessible socket path |
| `DB_DATABASE`, `DB_USERNAME` | cPanel-prefixed database/user names when cPanel requires prefixes |
| `DB_PASSWORD` | Secret entered only in cPanel |
| `JWT_*_KEY_PATH` | Keep defaults when keys are generated under `backend/storage/private/` |
| `CSRF_HMAC_KEY`, `OTP_HMAC_KEY` | Independent random secrets, at least 32 characters |
| `COOKIE_SECURE` | `true` |
| `COOKIE_SAMESITE` | `Lax` for the preferred same-origin frontend/API flow |
| `COOKIE_DOMAIN` | Empty unless a reviewed cross-subdomain cookie design requires it |
| `CORS_ALLOWED_ORIGINS` | Empty for same-origin routing; otherwise exact HTTPS frontend origins, never `*` |
| `MIDTRANS_ENABLED` | `false` during infrastructure smoke |

When the hosting layout exposes a separate backend HTTPS origin, it is used for infrastructure smoke and `MIDTRANS_NOTIFICATION_URL`. Browser traffic should still use the reviewed same-origin `/api/v1` route whenever supported.

Even with `APP_ENV=staging`, SMTP variables should contain only provider-approved test credentials when OTP testing begins. Infrastructure health/plans smoke does not require enabling Midtrans.

## Database dry-run plan

Create the database and least-privilege user through cPanel. The database default must be:

```sql
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci
```

Before migration, record sanitized evidence for:

```sql
SELECT VERSION();
SHOW CREATE DATABASE your_database_name;
```

Do not paste passwords into shell commands or evidence. The migration sequence is allowed only after the database backup/restore method is known:

```bash
npm run migrate:status
npm run migrate
npm run seed
npm run migrate:status
```

These commands assume the SSH working directory is the registered backend application root and cPanel has already injected the environment variables.

## Ordered execution checklist

### Gate 1 — provider/runtime

```bash
node -v
npm -v
which node
which npm
```

Expected: Node.js `v24.7.0` through the latest `v24.x`. Stop if the result is Node.js 22, lower than 24.7, or 25+.

On cPanel installations that expose a per-application virtual environment, activate it using the exact command shown by cPanel before repeating the version checks. A system-shell Node 22 result does not prove the selected application runtime is Node 22.

### Gate 2 — package and static verification

From the backend application root:

```bash
npm ci
npm run typecheck
npm test
npm audit --audit-level=high
```

Expected: deterministic lockfile install; typecheck and tests pass; no high/critical dependency finding. Review Monarx events if native packages or runtime files disappear.

### Gate 3 — storage and keys

Confirm the private directory is outside public document exposure, then run:

```bash
npm run keys:generate
```

Expected: private/public keys are created under `storage/private/`. Never print or download the private key as QA evidence.

### Gate 4 — database

Confirm backup/restore method, database collation, least-privilege user, and environment mapping. Then execute the migration/seed sequence above.

Expected: migration status is clean and Starter/Basic/Pro plus approved theme seeds exist.

### Gate 5 — Passenger startup

Register/restart the cPanel application after the environment and database gates pass. Use the UI restart control or the provider-documented Passenger restart mechanism; do not invent a generic process-kill command.

Expected direct smoke:

```bash
curl -i https://api-staging.kartunamadigital.id/api/v1/health
curl -i https://api-staging.kartunamadigital.id/api/v1/plans
```

- Health returns `200` and reports `database: available`.
- Plans returns only Starter, Basic, and Pro.
- Logs do not expose environment secrets, tokens, OTPs, cookies, or SQL credentials.

### Gate 6 — worker capability

Confirm cPanel Cron Jobs can select the same Node.js 24 application environment and run:

```bash
npm run mail:work
```

Do not schedule the worker until its provider-specific invocation, overlap prevention, and sanitized log destination are reviewed. Redis Object Cache is not required.

### Gate 7 — shared-hosting frontend handoff

Only after the direct backend smoke is stable:

1. Upload the static contents of `frontend/` to the provider-approved staging document root.
2. Configure provider-supported same-origin routing from `/api/v1/*` to the Node application.
3. Repeat health, plans, unauthenticated `/me`, and frontend route smoke through `https://staging.kartunamadigital.id`.
4. If same-origin routing is unavailable, stop for a CORS, cookie-domain, SameSite, and CSRF-cookie review before using a separate API origin.
5. Keep temporary tunnel origins and secrets out of tracked configuration.

## Rollback boundary

Before migration/startup, preserve:

- Previous application release/commit reference.
- A server-side environment backup outside the public root.
- Database backup plus a documented restore route.
- Previous cPanel application-root/startup settings.

For application failure, restore the prior release and restart through cPanel. Do not run `migrate:rollback`, delete tables, or restore a database until data impact is reviewed.

## Evidence required to close Phase 8E deployment gate

- Node.js `v24.7.0–v24.x` from the effective cPanel application environment.
- Successful lockfile install, typecheck, tests, and dependency audit.
- MariaDB version and `utf8mb4` database definition.
- Migration and seed status without credentials.
- Direct HTTPS health/plans results.
- Passenger restart/log evidence without secrets.
- Cron/worker capability confirmation.

## Gate

Gate result: PHASE 8E DRY-RUN PLAN READY; PROVIDER NODE.JS CAPABILITY VERIFIED, EFFECTIVE APPLICATION PREFLIGHT PENDING.

Next step after provider confirmation: execute Phase 8F hosting preflight using sanitized SSH/cPanel evidence. No server mutation is authorized by this document alone.
