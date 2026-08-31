# Deployment Runbook

Environments: local, staging, production.

Phase 7 release work must not deploy production until the release checklist, UAT evidence, backup/restore drill, and environment gates are signed off.

## Pre-deploy gate

- Confirm hosting target: cPanel Passenger with Node 22.18 support, or VPS/reverse proxy.
- Confirm `APP_ENV=production`, `APP_DEBUG=false`, HTTPS `APP_URL`, `COOKIE_SECURE=true`, and production `COOKIE_DOMAIN` when needed.
- Generate JWT keys outside public web root and keep `.env`, keys, storage, dependency metadata, and logs outside public access.
- Configure `CSRF_HMAC_KEY`, `OTP_HMAC_KEY`, database credentials, SMTP credentials, and Midtrans keys only in untracked environment configuration.
- Install backend dependencies from `backend/package-lock.json`.
- Run migrations and seed using the production database user with least privilege.
- Verify writable non-executable storage for QR cache and logo uploads.
- Configure mail outbox cron/worker and stale operational cleanup jobs.
- Run database backup and restore drill before production data exists.

## Required automated release checks

- `npm --prefix backend run typecheck`
- `npm --prefix backend test`
- `npm --prefix backend audit --audit-level=moderate`
- `npm --prefix frontend test`
- OpenAPI YAML parse.
- Postman collection JSON parse.
- Manifest regeneration and SHA-256 verification.

## Manual smoke/UAT gate

- Health/readiness endpoint.
- Register, OTP verify, login, refresh, logout, forgot/reset password.
- Starter create/manage/update/claim.
- Card create/update/publish, public card read, VCF, QR scan on Android and iPhone.
- Slug change and QR refresh behavior.
- Theme access for Starter, Basic, and Pro.
- Social/catalog limits and public visibility.
- Pro logo upload/public logo and WhatsApp URL.
- Basic/Pro checkout, webhook activation, payment history, reconciliation, and subscription status.
- Admin reads, plan/theme mutation audit, and secret-free logs.

## cPanel

Register the default physical `backend/app.js` CommonJS entrypoint only after verifying Node Application Manager/LiteSpeed Passenger supports the locked Node 22 runtime. The root package is CommonJS while `src/`, `scripts/`, and `tests/` retain explicit ESM package boundaries. PHP-only shared hosting is not sufficient. If Node 22.18 is unavailable, use a VPS.

## Stable backend staging

Use a stable HTTPS backend origin before full browser/device UAT. Account-less quick tunnels are acceptable only for short manual smoke tests and must not be committed to Git.

Preferred stable path:

1. Provision VPS or cPanel Passenger with Node.js 22.18 support.
2. Configure MariaDB with least-privilege credentials.
3. Copy `backend/.env.production.example` to an untracked server-side env file and fill secrets only on the server.
4. Generate JWT keys under backend private storage outside public web access.
5. Run `npm ci`, migrations, and seeds.
6. Start the backend with systemd, Passenger, or equivalent process supervision.
7. Place HTTPS reverse proxy in front of `127.0.0.1:3000`.
8. Verify `/api/v1/health` returns `200` and `database: available`.
9. Publish the static frontend through the selected hosting document root and route same-origin `/api/v1/*` requests to the Node application using provider-supported configuration.
10. If the provider cannot support same-origin routing, stop and review the cross-origin CORS/cookie/CSRF model before deployment.

## Rollback

Rollback uses previous release artifacts and a tested database restore path. Database restore is allowed only after confirming whether the failed migration is backward-compatible.

## v2.3 Midtrans

Midtrans production requires active production account/payment methods, production keys, HTTPS notification URL, correct callback URLs, sandbox/production separation, and smoke payment verification. Browser callbacks never activate membership.

## cPanel SMTP

Create mailboxes, copy exact secure settings, keep secrets outside repo, verify TLS/SPF/DKIM/DMARC, configure outbox cron, run inbox tests, and inspect Track Delivery.
