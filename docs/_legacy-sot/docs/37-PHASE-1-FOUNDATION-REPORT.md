# Phase 1 Foundation Report

Date: 2026-07-18  
Status: **COMPLETE**

## Scope delivered

- PHP 8.2 bootstrap with Composer PSR-4 metadata and a dependency-free fallback autoloader.
- Strict environment parser/validation and timezone initialization.
- PDO MySQL/MariaDB connection factory with native prepared statements and optional Unix socket.
- Exact-route HTTP router, request/response objects, central exception mapping, safe JSON envelopes, request ID propagation, and JSON-line application logging.
- Apache front controller/rewrite hardening.
- `GET /api/v1/health` with database readiness and non-sensitive `503` response.
- Migration CLI with immutable checksums, status, last-batch rollback, and safe down SQL.
- Idempotent plan/capability/theme seed runner.
- Native PHP unit and MariaDB integration test harness.

## Explicitly excluded

Auth, Starter access, card business operations, QR/vCard rendering, Midtrans, email delivery, admin behavior, and frontend application code remain unimplemented.

## Data acceptance

The initial migration creates the 19 SOT application tables. Seeding produces:

- exactly Starter, Basic, and Pro;
- 33 plan capability rows (11 capabilities × 3 plans);
- ten descriptive immutable themes;
- 14 cumulative plan-theme rows: Starter 1, Basic 3, Pro 10;
- binary/case-sensitive `cards.slug` collation.

Commercial Basic/Pro price and duration remain zero/configurable and are not overwritten on repeated seed runs.

## Verification

- PHP runtime: XAMPP PHP 8.2.4 with PDO MySQL.
- Database: isolated temporary MariaDB 10.4.28; no user/XAMPP database was touched.
- PHP syntax lint: all Phase 1 PHP files passed.
- Unit suite: 8 passed, 0 failed.
- Full suite with database integration: 9 passed, 0 failed.
- Integration coverage: empty migration, repeat migration, repeat seed, row allocation, slug collation, rollback, remigration, and reseed.
- OpenAPI JSON/YAML references and repository checksums are validated separately during handoff.

## Risks and assumptions

- Composer CLI is not available on the current shell PATH; tests use the fallback autoloader. `backend/composer.json` is present for deployment environments.
- Browser/cPanel HTTP serving is not part of Phase 1 verification; document root must point to `backend/public`.
- The imported workspace is still not a Git repository, so commit history and rollback are unavailable.
