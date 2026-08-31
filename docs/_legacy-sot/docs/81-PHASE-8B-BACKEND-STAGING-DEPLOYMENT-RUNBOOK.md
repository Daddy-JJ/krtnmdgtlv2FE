# Phase 8B Backend Staging Deployment Runbook

Date: 2026-07-22
Status: READY FOR HOSTING DETAILS — DEPLOYMENT NOT EXECUTED

## Scope

Phase 8B converts the Phase 8A provisioning package into an executable backend staging runbook.

Included:

- Infrastructure intake checklist.
- VPS deployment sequence.
- cPanel Passenger decision path.
- Database migration/seed sequence.
- Shared-hosting static frontend/API routing handoff.
- Smoke, rollback, and evidence rules.

Excluded:

- Live server provisioning without credentials.
- DNS changes.
- Writing real secrets into the repository.
- Production custom-domain cutover.
- Midtrans live or SMTP live activation.

## Current blocker

The former Vercel frontend path was retired by product-owner decision. Integrated UAT remains blocked until shared hosting provides a stable frontend origin plus a working route to the Node backend.

## Hosting decision

Use this order:

1. VPS with Node.js 24 and MariaDB — preferred.
2. cPanel Passenger only if Node.js 24 is supported.
3. Managed Node host with managed MariaDB/MySQL.
4. Named Cloudflare Tunnel with controlled DNS only as a staging bridge.

Do not use account-less quick tunnels for long UAT or production readiness.

## VPS deployment sequence

These commands are examples for the server operator. Replace paths/users/domains on the target server and keep secrets outside Git.

1. Create app user and directories.
2. Copy repository release to `/var/www/kartunamadigital`.
3. Install Node.js `>=24.7 <25`.
4. Install MariaDB/MySQL and create database/user.
5. Copy `backend/.env.production.example` to `/etc/kartunamadigital/backend.env`.
6. Fill real environment values only on the server.
7. From repository root, run:

```bash
npm --prefix backend ci
npm --prefix backend run keys:generate
npm --prefix backend run migrate
npm --prefix backend run seed
npm --prefix backend run typecheck
```

8. Install `deploy/vps/kartunamadigital-backend.service.example` as a systemd service after adapting paths.
9. Install `deploy/vps/nginx-kartunamadigital-backend.conf.example` after adapting the domain.
10. Issue TLS certificate.
11. Start backend service and reload Nginx.

## cPanel Passenger decision path

Use cPanel only if the hosting provider confirms:

- Node.js runtime supports the locked backend floor: `>=24.7 <25`.
- Application Manager/LiteSpeed Passenger can start from the physical CommonJS `backend/app.js` bridge.
- Environment variables can be configured outside public web root.
- Storage paths are writable and not publicly listable.
- Cron/worker execution is available for mail outbox jobs.

If any item fails, use VPS instead.

## Shared-hosting frontend handoff

After backend origin is stable:

1. Confirm backend health directly:

```bash
curl -i https://api-staging.kartunamadigital.id/api/v1/health
```

2. Upload the static contents of `frontend/` to the provider-approved staging document root.
3. Configure provider-supported same-origin routing from `/api/v1/*` to the Node application.
4. Re-test through the selected frontend staging origin:

```bash
curl -i https://staging.kartunamadigital.id/api/v1/health
curl -i https://staging.kartunamadigital.id/api/v1/plans
```

## Smoke test checklist

| Check | Expected |
|---|---|
| Direct backend `/api/v1/health` | `200`, `database: available` |
| Frontend-origin `/api/v1/health` | `200`, same backend environment |
| Frontend-origin `/api/v1/plans` | `200`, Starter/Basic/Pro |
| Protected `/api/v1/me` without cookies | `401` |
| Static root | `200` |
| Static login/create | `200` |

## Rollback

Rollback requires:

- Previous Git commit/release artifact.
- Previous server env file backup.
- Database backup/restore decision before migration rollback.
- Service restart plan.

Do not run destructive database rollback until data impact is reviewed.

## Evidence rules

Record sanitized evidence in `qa/UAT-EVIDENCE-LOG.md`.

Never store:

- `.env` values.
- JWT keys.
- DB passwords.
- SMTP/Midtrans credentials.
- Cookies, OTPs, access/refresh tokens, or Starter manage tokens.

## Gate

Gate result: PHASE 8B RUNBOOK READY.

Next required input:

- Hosting target and access method, or confirmation that backend staging will remain deferred.
