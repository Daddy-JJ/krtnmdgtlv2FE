# Phase 8F Shared Hosting Preflight Package

Date: 2026-07-22
Status: PROVIDER NODE.JS V24.18.0 CONFIRMED — EFFECTIVE HOSTING PREFLIGHT PENDING

## Scope

Phase 8F prepares and verifies a secret-safe preflight package for the selected cPanel/shared-hosting backend target.

Included:

- Executable backend hosting preflight.
- Node.js 22.18+/built-in scrypt runtime gate (updated by CR-009/D-059).
- Passenger startup, JWT key, and writable-storage checks.
- Required environment-control checks without printing values.
- Generic shared-hosting execution/evidence guide.
- Automated positive, fail-closed, and secret-redaction regression tests.

Excluded:

- cPanel/SSH login.
- Provider runtime activation.
- Dependency installation on the remote host.
- Database connection, migration, seed, backup, or restore.
- Passenger registration/restart.
- DNS, TLS, static frontend upload, or `/api/v1` routing changes.
- SMTP or Midtrans activation.

## Added implementation

| File | Purpose |
|---|---|
| `backend/scripts/hosting-preflight.ts` | Standalone sanitized hosting readiness evaluator and CLI. |
| `backend/tests/Unit/hosting-preflight.test.ts` | Runtime failure and secret-output regression coverage. |
| `deploy/shared-hosting/README.md` | cPanel field mapping, command order, evidence, and stop boundary. |
| `backend/package.json` | Adds `npm run hosting:preflight`. |

## Gate model

The preflight reports 20 checks across:

1. Runtime and built-in asynchronous scrypt.
2. Locked package engine.
3. Passenger startup/server files.
4. Private/public keys.
5. Storage permissions.
6. Staging/production mode and debug state.
7. HTTPS public application URL.
8. Database endpoint/identity/password presence.
9. CSRF/OTP HMAC minimum lengths.
10. Secure cookie and no-wildcard CORS policy.

No environment value, hosting username/path, password, or key content is included in the result.

## Local verification

The original package was verified on Node.js 24; CR-009 replaces that historical gate with Node.js `>=22.18 <23` and built-in asynchronous scrypt.

Expected positive execution uses non-production test values injected only into the command process. Expected negative execution on an incomplete environment returns non-zero and reports failed check identifiers without exposing values.

Verification result:

- Positive preflight: `ready: true`, 20 passed, 0 failed.
- Empty-environment negative preflight: exit code 1, 9 failed controls, no values disclosed.
- Frontend tests: 30 passed, 0 failed.
- Backend TypeScript check: passed.
- Backend tests: 80 passed, 0 failed, 1 opt-in database integration test skipped.

## Remote execution gate

With Node.js `v24.18.0` now confirmed by the provider, run from the effective cPanel application environment:

```bash
node -v
npm -v
npm ci
npm run typecheck
npm test
npm run keys:generate
npm run hosting:preflight
```

Do not proceed to migration or Passenger restart unless the final preflight returns `ready: true` and database backup/restore planning is complete.

## Remaining evidence

- Effective cPanel application `node -v` is `v24.7.0–v24.x`.
- cPanel application root/startup fields match the approved mapping.
- Final sanitized preflight result is ready.
- Provider same-origin `/api/v1` routing method is known.
- MariaDB socket/host, `utf8mb4` database, least-privilege user, and backup/restore path are confirmed.
- Cron invokes the same Node.js 24 environment.

## Gate

Gate result: PHASE 8F PREFLIGHT PACKAGE VERIFIED LOCALLY; REMOTE HOSTING PREFLIGHT NOT YET EXECUTED.

The next action is evidence collection from the effective provider application environment. Live deployment remains no-go until those checks pass.
