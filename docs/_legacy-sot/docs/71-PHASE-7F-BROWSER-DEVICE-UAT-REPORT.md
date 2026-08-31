# Phase 7F Browser/Device UAT Report

Date: 2026-07-19
Status: IN PROGRESS — AUTOMATED PREVIEW SMOKE PASSED; MANUAL DEVICE UAT PENDING

## Scope

Phase 7F starts UAT against the selected environment path:

- Vercel frontend preview.
- Same-origin `/api/v1` rewrite to HTTPS backend local/staging tunnel.
- Local Node.js + Express.js backend connected to a temporary MariaDB staging database.

Included in this checkpoint:

- Public preview access smoke.
- Static route availability smoke.
- Backend health/API rewrite smoke.
- Security header presence smoke.
- Sanitized UAT evidence logging.

Excluded from this automated checkpoint:

- Real Android/iPhone QR camera scans.
- Manual Chrome/Safari rendering review.
- Keyboard-only and reduced-motion manual accessibility pass.
- Midtrans sandbox payment execution.
- Live SMTP inbox delivery verification.
- Production promotion, custom domain, commit, or push.

## Environment

| Item | Value |
|---|---|
| Frontend preview | `https://frontend-3hzgksgvo-phoenikz-s-projects.vercel.app` |
| API mode | Same-origin rewrite from `/api/v1/*` |
| Backend target | Temporary Cloudflare Tunnel URL, sanitized from tracked files |
| Backend runtime | Node.js + Express.js staging process |
| Database | Temporary MariaDB staging database |
| Vercel access | Public preview access unblocked for UAT |

## Automated smoke evidence

| Check | Result |
|---|---|
| `GET /` | PASS — `HTTP/2 200` |
| `GET /login` | PASS — `HTTP/2 200` |
| `GET /app` | PASS — `HTTP/2 200` |
| `GET /api/v1/health` | PASS — backend `HTTP/2 200` through Vercel rewrite |
| Backend health body | PASS — `environment: staging`, `database: available` |
| Preview security headers | PASS — `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, and HSTS observed |
| `GET /api/v1/plans` | PASS AFTER FIX — initially `404`, then `HTTP/2 200` with Starter, Basic, and Pro |
| `GET /api/v1/themes` without cookies | PASS — `HTTP/2 401`, protected by session as declared in OpenAPI |
| `GET /api/v1/me` without cookies | PASS — `HTTP/2 401`, protected by session |
| Starter create/manage/public/QR/VCF | PASS AFTER FIX — local staging retest returned create `201`, public card `200`, QR PNG `200`, VCF `200`, missing-CSRF update `403`, CSRF update `200` |

## Drift fixed during UAT

| Defect | Result |
|---|---|
| `DEF-7F-001` | `/api/v1/plans` was present in OpenAPI but missing from the backend route mount. Added a read-only public plans catalog route, controller, and MySQL repository using parameterized queries. Retest through the Vercel preview rewrite returned `HTTP/2 200`. |
| `DEF-7F-002` | Anonymous Starter cards were created as `draft`, and public lookup joined `users`, so Starter public card, QR, and VCF returned `404`. Updated Starter creation to save `published`, changed public lookup to support anonymous cards while preserving case-sensitive slugs, and retested the Starter flow on local staging successfully. |

Files added for the fix:

- `backend/src/modules/plans/controllers/plan-catalog-controller.ts`
- `backend/src/modules/plans/repositories/plan-catalog-repository.ts`
- `backend/src/modules/plans/repositories/mysql-plan-catalog-repository.ts`
- `backend/src/modules/plans/routes/plan-router.ts`
- `backend/tests/Unit/plan-catalog-http.test.ts`

Files updated for the fix:

- `backend/src/app.ts`
- `backend/src/server.ts`
- `backend/src/modules/starter/repositories/mysql-starter-repository.ts`
- `backend/src/modules/cards/repositories/mysql-card-repository.ts`
- `backend/tests/Unit/starter-http.test.ts`

## Manual UAT still required

- Chrome desktop visual/interactive smoke.
- Safari desktop visual/interactive smoke.
- Android Chrome.
- iPhone Safari.
- Keyboard-only navigation.
- Reduced-motion preference.
- Narrow mobile viewport.
- QR scan on Android and iPhone.
- VCF import on target devices.
- Auth/session flow with sanitized evidence.
- Starter, Basic, Pro, Admin, Payment, and Email/OTP UAT cases.

## Security notes

- No active tunnel URL is recorded in tracked configuration.
- No OTPs, passwords, cookies, tokens, SMTP credentials, Midtrans keys, or API keys were written to evidence files.
- Manifest generation excludes local Vercel project metadata and local runtime JWT key files from tracked checksum evidence.
- Public plan catalog queries are parameterized and expose only plan code, name, price, duration, and feature flags already covered by the OpenAPI `Plan` schema.
- Starter public lookup uses a parameterized `BINARY ?` slug comparison to preserve seven-letter case-sensitive Starter URLs.
- Preview remains public after Vercel SSO protection was disabled for UAT; re-enable protection after public UAT is complete if the preview should no longer be publicly accessible.

## Phase gate

Gate result: PENDING PRODUCT OWNER REVIEW.

Recommended next step:

- Product owner opens the preview in target browsers/devices and supplies pass/fail evidence for the manual rows in `qa/UAT-EVIDENCE-LOG.md`.
