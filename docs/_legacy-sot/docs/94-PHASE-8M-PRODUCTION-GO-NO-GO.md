# Phase 8M — Production deployment decision

Date: 2026-07-22
Decision: **NO-GO FOR PRODUCTION; READY FOR SHARED-HOSTING STAGING EXECUTION**

## What is ready

- Provider capability confirms Node.js v24.18.0, compatible with the locked runtime.
- Backend preflight, modular database/CRUD architecture, release inventory, frontend/API routing plan, Postman E2E collection, SMTP verifier, mail worker hardening, and external-services runbook are prepared.
- Local backend/frontend/OpenAPI/Postman/dependency/security gates pass.
- Disposable MariaDB integration and backup/restore rehearsal pass.

## Production blockers

| Blocker | Required evidence |
|---|---|
| Effective cPanel runtime/Passenger | `node -v`, application mapping, preflight 20/20, stable restart/log evidence |
| Hosting MariaDB | least-privilege utf8mb4 database, backup, migrations/seeds, health database available |
| Frontend/API topology | same-origin `/api/v1` or reviewed API-subdomain configuration over valid HTTPS |
| E2E UAT | Postman CRUD plus Chrome/Safari/Android/iPhone and QR/VCF evidence |
| Email | SMTP verify, Gmail/Outlook/Yahoo OTP/reset, cron/outbox/delivery-log evidence |
| Payment | Midtrans sandbox checkout, valid webhook, idempotency, negative states, reconciliation |
| Recovery | provider-side restore and previous-release rollback rehearsal |
| Release identity | approved Git commit/release artifact; current local changes are intentionally uncommitted |
| Frontend hardening | production CSP/performance decision for current CDN-loaded Tailwind pages |

## Authorized next execution sequence

1. Create an approved Git checkpoint/release artifact when the product owner requests commit/push.
2. Execute Phase 8H cPanel backend/database checklist.
3. Execute Phase 8I frontend/API routing and HTTPS smoke.
4. Run Phase 8J Postman/browser/device UAT.
5. Run Phase 8K SMTP/cron and Midtrans sandbox tests.
6. Repeat Phase 8L on the provider, resolve every Critical/High defect, and record sign-off.
7. Reopen Phase 8M for a production go decision.

Auto-approval through Phase 8M authorizes preparation and safe local verification, but cannot substitute for unavailable hosting credentials, third-party secrets, real inbox/payment evidence, or product-owner UAT sign-off.
