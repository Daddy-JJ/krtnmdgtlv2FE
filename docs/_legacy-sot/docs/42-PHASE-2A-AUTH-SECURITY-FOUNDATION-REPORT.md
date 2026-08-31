# Phase 2A — Auth Security Foundation Report

Date: 2026-07-18  
Status: **ACCEPTED**

## Scope delivered

- Asynchronous native Argon2id password hashing with a unique 16-byte salt, 64 MiB memory, three passes, and PHC-style encoded storage.
- RS256 access-token issue/verification with issuer, audience, subject, session ID, role, issue time, and expiry validation.
- CSPRNG opaque token generation for refresh/manage/reset credentials and SHA-256 hash-only persistence values.
- HMAC-signed CSRF tokens bound to a session/family identifier and compared in constant time.
- Central cookie policy for access, refresh, Starter manage, and readable CSRF cookies.
- Strict Auth/OTP/reset and Starter input schemas, including normalization, unknown-field rejection, paid-field rejection, and HTTP(S)-only URL validation.
- Environment gates for JWT identity, token TTL, CSRF HMAC key, and cookie policy.

## Explicitly not implemented

- No Auth or Starter routes were mounted.
- No user, refresh, OTP, reset, card, contact, or manage-token repository was added.
- No database schema or OpenAPI path changed.
- No SMTP delivery, OTP persistence, login rate limiter, refresh reuse transaction, or claim transaction was implemented.

These remain Phase 2B/2C work and cannot be inferred from the presence of security primitives.

## Verification

| Gate | Result |
|---|---|
| Strict TypeScript | Passed |
| Active unit/security/HTTP tests | 15 passed, 0 failed |
| Database integration in combined suite | 1 skipped; no schema/database change in 2A |
| Password regression | Salt uniqueness, correct/wrong/malformed verification passed |
| Token regression | Entropy floor, hash-only value, signature tamper, expiry passed |
| CSRF regression | Correct binding passed; wrong session and tamper rejected |
| Cookie regression | Credential HttpOnly boundary and SameSite=None/Secure invariant passed |
| Input regression | Normalization, unknown fields, paid-field injection, unsafe URL rejected |

## Files changed

- `backend/src/shared/security/`: password, access token, opaque token, CSRF, and cookie policy.
- `backend/src/modules/auth/dto/`: Auth and Starter boundary schemas.
- `backend/src/config/environment.ts` and `.env.example`: required security configuration.
- `backend/tests/security/` and `backend/tests/unit/`: Phase 2A regression tests.
- Runtime/status/decision/report/manifest documents.

## Risks and assumptions

1. Node's native Argon2 API requires Node 24.7 or newer and remains tied to the locked Node 24 deployment baseline.
2. Key generation is operational work: private/public JWT keys and the CSRF HMAC key must be provisioned outside the repository before the API starts.
3. SHA-256 is used only for high-entropy opaque tokens; human passwords use Argon2id and future six-digit OTP values require keyed HMAC.
4. The access JWT cannot replace database checks for revoked sessions, current user status, ownership, or authorization policies.
5. Cookie paths are intentionally narrow and must be verified again when Phase 2B routes are mounted.

## Next approval boundary

Phase 2A was accepted by the product owner. Phase 2B was then implemented under the next approved phase boundary; see `docs/43-PHASE-2B-AUTH-API-REPORT.md`.
