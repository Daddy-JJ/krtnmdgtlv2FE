# Phase 8A Stable Backend Staging Provisioning Package

Date: 2026-07-19
Status: READY FOR INFRASTRUCTURE INPUT — NO LIVE BACKEND DEPLOYED

## Scope

Phase 8A prepares the stable backend staging package needed to unblock Phase 7K, Phase 7L, and eventual production readiness.

Included:

- Production/staging environment template with no secret values.
- VPS systemd backend service example.
- VPS Nginx reverse proxy example.
- Deployment runbook expansion for stable backend staging.
- Explicit no-go boundary for real production/customer traffic.

Excluded:

- Provisioning a real VPS or cPanel host.
- Creating DNS records.
- Installing live certificates.
- Entering database, SMTP, Midtrans, or JWT secrets.
- Deploying production backend.

## Recommended staging architecture

```text
Shared-hosting static frontend
  staging.kartunamadigital.id
        |
        +-- static HTML/CSS/JS
        +-- /api/v1/* -> provider-supported same-origin route
                             |
                             v
                    Node.js 24 Express backend -> local MariaDB
```

## Added assets

| File | Purpose |
|---|---|
| `backend/.env.production.example` | Non-secret production/staging environment template. |
| `deploy/vps/kartunamadigital-backend.service.example` | Example systemd service for the backend process. |
| `deploy/vps/nginx-kartunamadigital-backend.conf.example` | Example Nginx HTTPS reverse proxy. |
| `deploy/README.md` | Deployment asset index. |

## Provisioning checklist

1. Choose hosting target:
   - VPS with Node.js 24 and MariaDB, recommended for control; or
   - cPanel Passenger only if Node.js 24 is supported.
2. Create a least-privilege database and user.
3. Copy backend code and install from `backend/package-lock.json`.
4. Create server-side env file from `backend/.env.production.example`.
5. Generate JWT keypair outside public web root.
6. Set strong `CSRF_HMAC_KEY` and `OTP_HMAC_KEY`.
7. Run migrations and seeds.
8. Start backend behind HTTPS reverse proxy.
9. Verify `GET /api/v1/health` returns `200` and `database: available`.
10. Configure the hosting provider's same-origin `/api/v1/*` route from the static frontend host to the Node application.
11. Re-run Phase 7K, then Phase 7L.

## Security notes

- Do not commit `.env`, JWT keys, SMTP credentials, Midtrans keys, database passwords, OIDC tokens, or temporary tunnel URLs.
- Keep `COOKIE_SECURE=true`.
- Same-origin frontend/API routing can keep `COOKIE_SAMESITE=Lax`.
- Direct cross-origin frontend/API mode requires exact credentialed CORS allowlist and cookie policy review.
- Production traffic remains blocked until backup/restore, SMTP, Midtrans, and UAT gates are complete.

## Gate

Gate result: PHASE 8A PROVISIONING PACKAGE READY.

Blocker remaining: real stable backend infrastructure and DNS details are required before deployment can proceed.
