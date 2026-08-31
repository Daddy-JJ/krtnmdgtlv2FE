# Phase 2B — Auth and OTP API Report

Date: 2026-07-18  
Status: **ACCEPTED**

## Delivered endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/email/verify-otp`
- `POST /api/v1/auth/email/resend-otp`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

## Backend implementation

- Thin Express controller/router with strict Zod request validation.
- MySQL2 repository and transaction boundary for users, OTP, refresh families, and reset tokens.
- Access/refresh/CSRF cookie issuance and clearing through centralized policy.
- Refresh rotation, used-token detection, and committed family revocation before returning failure.
- Generic login/forgot responses and dummy Argon2 verification to reduce account-enumeration signals.
- Database-backed fixed-window rate limits using hash-only bucket identifiers.
- Immediate non-durable registration OTP delivery through `MailerPort` and Nodemailer SMTP adapter.
- Password-reset durable outbox dispatch without token plaintext: the worker generates the token at claim time, persists only its hash, and sends the link from memory.
- One-time RSA key-generation script and production HTTPS/Secure-cookie/SMTP configuration gates.

## Schema/API changes

- Added migration `002_auth_rate_limits.sql` and updated the database dictionary/reference schema.
- Updated OpenAPI Auth request strictness and documented rate-limit, email-verification, cookie, CSRF, and refresh-reuse behavior.
- No product-tier or Starter-card schema changed.

## Verification

| Gate | Result |
|---|---|
| Strict TypeScript | Passed |
| Active unit/security/HTTP suite | 20 passed, 0 failed |
| Isolated MariaDB integration | 1 full lifecycle test passed |
| Migration | 001 + 002 up/idempotency/down/remigrate passed |
| Auth lifecycle | register → OTP → login → refresh → reuse revoke passed |
| Reset lifecycle | outbox → worker → reset → session revoke passed |
| Plaintext persistence checks | password, OTP, refresh, reset values absent from database/outbox |
| npm audit | 0 known vulnerabilities |
| OpenAPI/JSON syntax | Valid |

## Residual risks and environment gates

1. Real cPanel SMTP authentication/deliverability was not tested because production credentials are intentionally absent.
2. Postman/Newman was not executed; curated Phase 2 requests remain ready for a running configured environment.
3. The outbox worker is cron-invoked with `npm run mail:work`; production scheduling and stale-lock recovery require deployment verification.
4. Rate-limit expiry cleanup requires an operational scheduled delete job.
5. Native Argon2 still requires Node 24.7+; Node/cPanel compatibility remains a production gate.
6. Starter create/manage/claim and authenticated authorization middleware for card endpoints remain Phase 2C.

## Next boundary

Phase 2C implements Starter card creation, seven-letter case-sensitive slug generation, hash-only manage cookie rotation, CSRF-bound edit, and transactional claim into a verified account. It requires explicit owner approval.
