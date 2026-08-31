# QA and Security Execution Plan

Status: **PHASE 1M EXECUTED — CONTINUE PER COMPLETED PHASE**

Phase 1M evidence on 2026-07-18: strict typecheck passed; eight active unit/HTTP tests passed; the database integration test passed separately on isolated MariaDB 10.4.28; dependency audit reported zero known vulnerabilities. Business-authentication, CRUD, payment, upload, and browser security checks remain gated to their implementation phases.

Phase 2B evidence on 2026-07-18: 20 active unit/security/HTTP tests passed; the isolated MariaDB lifecycle test passed register/OTP/login/refresh/reuse revocation/reset/session revocation and plaintext-secret checks; dependency audit reported zero known vulnerabilities. Live SMTP delivery and Postman execution remain environment gates.

Phase 2C evidence on 2026-07-18: 24 active unit/security/HTTP tests passed; isolated MariaDB passed Starter create/update/rotation/old-token rejection/claim/revocation/one-card conflict and plaintext-manage-token checks.

## Quality gates

| Gate | Timing | Required evidence |
|---|---|---|
| QA-1 Foundation | Phase 1 | lint, unit tests, migration/seed/rollback, health 200/503, manifest |
| QA-2 Auth/Starter | Phase 2 | auth lifecycle, OTP states, refresh reuse, CSRF, rate limits, Starter manage/claim, Postman folder |
| QA-3 Card CRUD | Phase 3 | ownership/IDOR, validation, one-card rule, slug/theme policy, API contract tests |
| QA-4 Sharing | Phase 4 | QR decode/cache/headers, VCF device tests, social/catalog limits, upload hardening |
| QA-5 Commerce/Admin | Phase 5 | verified/idempotent webhook, amount/fraud checks, subscription transitions, admin audit |
| QA-6 Frontend | Phase 6 | browser/device/accessibility, API error states, cookie/CSRF integration, no localStorage tokens |
| QA-7 Release | Phase 7 | full regression, backup restore, production configuration, CSP/performance, UAT sign-off |

No phase passes with a Critical/High unresolved defect, a failing required test, an undocumented API drift, a secret in source/logs, or an unverified migration.

## API QA workflow

1. Validate OpenAPI syntax, local references, unique operation IDs, and schema coverage.
2. Run unit and repository tests.
3. Run HTTP integration tests against a disposable database.
4. Run the corresponding Postman folder; later automate the same collection with Newman if approved.
5. Compare response status/body/headers against OpenAPI.
6. Run negative cases: malformed JSON, missing fields, duplicate data, unauthorized actor, forbidden plan, stale CSRF, and rate limit.
7. Record defects with request ID, endpoint, sanitized request, response, expected behavior, environment, and reproduction steps.

## CRUD acceptance matrix

Every CRUD resource must test:

- valid create/read/update/delete or explicit non-delete policy;
- validation boundary and unknown fields;
- missing authentication;
- wrong owner/IDOR;
- non-existent and deleted resource behavior;
- repeated/idempotent request behavior where relevant;
- concurrent update/unique-key conflict;
- pagination/filter/sort for collection endpoints;
- prepared SQL and repository-only persistence;
- activity/audit event for privileged mutations.

## Security gates

### Authentication and tokens

- Versioned asynchronous scrypt passwords with exact locked parameters.
- Access, refresh, and Starter manage credentials are Secure HttpOnly cookies.
- Only hashed refresh/manage/reset/OTP values are persisted.
- Refresh rotation revokes the token family on reuse.
- Logout and password/security events revoke applicable sessions.
- No credential appears in JSON, URL, Postman variables, localStorage, analytics, or logs.

### CSRF and cookies

- Every unsafe cookie-authenticated request requires valid session-bound `X-CSRF-Token`.
- Missing, mismatched, stale, and cross-session tokens fail.
- The readable CSRF cookie cannot authenticate by itself.
- Secure/SameSite/domain/path/expiry behavior is checked for local and production configuration.

### Authorization and API abuse

- Ownership/admin policies are tested independently of hidden UI.
- IDOR attempts across all public IDs fail safely.
- Starter slug cannot authorize or mutate a card.
- Plan limits are enforced server-side.
- Login, OTP, reset, slug availability, and public endpoints are rate-limited.

### Input, database, and output

- SQL is parameterized; no dynamic user values are concatenated.
- Unknown JSON properties are rejected for sensitive commands.
- URL protocols are allowlisted to HTTP(S).
- Output is contextually encoded; raw HTML/script is never rendered from user data.
- File uploads are decoded/re-encoded, MIME checked, bounded, randomized, and stored non-executable.

### Operational security

- Production debug/stack trace is disabled.
- Logs redact cookies, password, OTP, reset/manage/auth tokens, SMTP and Midtrans keys.
- Secrets exist only in untracked environment configuration.
- Database account uses least privilege and remote access is restricted.
- Backup restore is tested, not merely configured.
- Dependency audit and supported runtime versions are checked before release.

## Defect severity

- Critical: credential/payment compromise, remote code execution, auth bypass, destructive data loss.
- High: IDOR, stored XSS, CSRF mutation, token reuse, privilege/plan bypass, migration corruption.
- Medium: contract mismatch, reflected XSS with constraints, missing rate limit, significant accessibility or data-validation defect.
- Low: cosmetic inconsistency, minor diagnostics/documentation issue without security or data impact.

## Phase 2 minimum suite

Phase 2 cannot pass until tests cover:

- register → OTP verify → login → refresh rotation → logout;
- invalid/unverified login and generic anti-enumeration responses;
- expired/consumed OTP, resend cooldown, attempt/send limit;
- refresh reuse/family revoke;
- missing/mismatched/stale CSRF;
- Starter create with seven mixed-case slug;
- manage cookie edit, invalid/revoked manage access, rotation, and claim;
- claim ownership conflict and one-card-per-account rule;
- proof that plaintext password, OTP, refresh, and manage token never enters database/logs;
- Postman Phase 2 folder passing against a disposable database.
