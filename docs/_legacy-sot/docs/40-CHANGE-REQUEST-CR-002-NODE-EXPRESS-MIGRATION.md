# Change Request CR-002 — Node.js and Express.js Backend Migration

## Requested change
Replace the PHP 8.2/Composer/PDO backend foundation with a Node.js 24 LTS, Express 5, and strict TypeScript modular monolith using MySQL2.

## Reason
The product owner explicitly selected Node.js + Express.js as the backend implementation stack after the backend/API readiness gate.

## Business impact
No MVP feature, tier, field, URL, payment, theme, OTP, or security rule changes. The migration changes only the backend runtime and implementation adapters.

## Technical decisions

- Node.js 24 LTS production baseline.
- Express 5 HTTP framework.
- Strict TypeScript with ESM and per-project TypeScript dependency.
- MySQL2 Promise API; repositories use `execute()` prepared statements.
- No ORM during MVP; existing SQL migrations/schema remain authoritative.
- npm with committed `package-lock.json`.
- Native `node:test` runner plus TypeScript typecheck.
- Same-origin REST JSON `/api/v1` remains unchanged.
- Service/repository/policy/rendering boundaries remain unchanged.
- SMTP adapter changes from PHPMailer to Nodemailer behind the same application-level mailer contract.

## Data/API/UI/security impact

- Database schema and OpenAPI paths remain stable.
- Token, cookie, CSRF, payment verification, prepared SQL, upload, and secret rules remain mandatory.
- Frontend integration remains contract-driven and does not depend on runtime language.
- Dependency and middleware security checks are added to QA.

## Deployment impact

- XAMPP PHP hosting is no longer the application runtime; local MariaDB may still be used.
- cPanel deployment requires hosting support for Node.js Application Manager/Phusion Passenger and a supported Node runtime.
- VPS deployment uses a supervised Node process/reverse proxy.
- The deployment gate must verify Node support before production hosting is selected.

## Migration/backward compatibility

The PHP Phase 1 foundation was retained temporarily during parity testing and removed after Phase 1M acceptance. Historical evidence remains in `docs/37-PHASE-1-FOUNDATION-REPORT.md`; no PHP runtime is deployed alongside Express.

## Files to update
Locked/context/decision/status documents, backend architecture/folder/coding/testing/deployment specs, prompts, email adapter specs, backend runtime/package/test files, reports, manifest, and checksums.

## Approval
Approved explicitly by the product owner in the Codex project session on 2026-07-18: “Saya confirm Change Request migrasi backend ke Node.js + Express.js”.

## Acceptance
Phase 1M accepted explicitly by the product owner on 2026-07-18: “approved Phase 1M”. Controlled PHP/Composer cleanup and Node regression were then completed without starting Phase 2.
