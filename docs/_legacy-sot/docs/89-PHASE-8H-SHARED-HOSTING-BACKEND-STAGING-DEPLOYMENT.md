# Phase 8H — Shared-hosting backend staging deployment

Date: 2026-07-22
Last revalidated: 2026-07-28
Status: LOCAL RELEASE GATE PASS — REMOTE STAGING BLOCKED

## Scope

Prepare and validate the reproducible Node.js 24 backend release, then execute the cPanel application, MariaDB migration/seed, Passenger startup, and direct backend smoke gates when effective hosting access is available.

## Local implementation

- Added a release verifier that validates required runtime/migration/seed files, Node engine lock, checksum integrity, and secret/runtime-artifact exclusions.
- Added an ordered cPanel staging execution checklist with explicit stop conditions and sanitized evidence requirements.
- Preserved the repository layout required by the root `database/seeds/` dependency.
- Kept JWT keys, environment files, cache, logs, uploads, credentials, and Vercel-specific artifacts outside the release inventory.

## Remote evidence still required

- Effective cPanel application `node -v` and `npm -v`.
- Application root, URL, startup file, and Passenger runtime evidence.
- `hosting:preflight` 20/20.
- Least-privilege `utf8mb4` database plus verified backup/restore path.
- Applied migration and seed evidence.
- Direct HTTPS backend smoke: health/plans/me/unknown route.

## 2026-07-28 execution result

- Shared-hosting manifest was regenerated for 523 release files.
- All 523 SHA-256 file checks passed.
- Release verifier passed 1,057/1,057 checks with no runtime cache, secret,
  `.vercel`, Vercel Function, or Vercel routing artifact in the shared-hosting
  inventory.
- The earlier Node.js 24/native Argon2 preflight is historical. CR-009/D-059
  now require Node.js `>=22.18 <23` with built-in asynchronous scrypt.
- The provider-confirmed Node.js 24.18.0 capability remains historical input;
  there is still no sanitized effective cPanel application output.
- `staging.kartunamadigital.id` and `api-staging.kartunamadigital.id` did not
  resolve publicly, so Passenger, migration, database, and direct HTTPS smoke
  could not be executed.

## Gate

The local Phase 8H package is complete. Remote Phase 8H remains blocked—not
failed or waived—until the operator executes the checklist on the effective
cPanel application. No database generation or migration was performed during
this revalidation.
