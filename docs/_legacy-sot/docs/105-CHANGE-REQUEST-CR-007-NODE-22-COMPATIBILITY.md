# Change Request CR-007 — Node.js 22.18 Hosting Compatibility

> Superseded in password-hashing implementation details by approved CR-009 and D-059. The Node.js `>=22.18 <23` runtime decision remains active.

## Requested change

Change the backend runtime from Node.js `>=24.7 <25` to Node.js `>=22.18 <23`
because the target hosting environment supports Node.js 22.18.

## Reason

The backend must run in the Node.js version actually available through the
hosting provider's Application Manager/Passenger environment. The existing
Node 24-only native Argon2 API prevents that deployment even though the rest of
the Node/Express modular monolith is compatible with Node 22.18.

## Scope and non-goals

- Express 5, strict TypeScript, MySQL2, the modular architecture, REST path
  `/api/v1`, database schema, OpenAPI contract, tiers, and payment rules do
  not change.
- Password security remains Argon2id; no fallback to bcrypt, PBKDF2, or a
  weaker password algorithm is permitted.
- The change adds no product feature and does not authorize production
  deployment.

## Technical decision

- Backend engine: `>=22.18 <23`.
- Password adapter: production dependency `argon2` `0.45.1` using Argon2id.
- Parameters stay locked: version 19, unique 16-byte salt, memory 65,536 KiB,
  time cost 3, parallelism 1, and 32-byte tag.
- The adapter verifies both the former Node 24 base64url PHC output and the
  standard PHC output emitted after this change. Existing account passwords do
  not require a migration or reset.
- Hosting preflight requires the exact engine range and a loadable Argon2id
  adapter. A missing prebuilt/native binding fails closed before staging work.

## Documentation and implementation impact

The current architecture, coding, backend README, hosting preflight/runbooks,
package engine, type definitions, password adapter, security test, and
Decision Log are updated. Historical phase reports retain their original Node
24 evidence and are not retroactively changed.

## Approval

Approved by the product owner in this Codex session on 2026-08-03: “harap
sesuaikan node.js dengan versi 22.18 sesuai yang di dukung nantinya oleh
hosting saya”.

## Acceptance evidence

- Node 22.23 local typecheck passes.
- Backend test suite passes with 101 tests passing and one opt-in database
  integration test skipped.
- Security tests prove Argon2id verification for new and legacy Node 24 PHC
  encodings.
- Hosting preflight tests accept Node 22.18 and fail closed for incompatible
  runtime/adapter conditions.

## Residual hosting gate

The provider must still demonstrate Node.js 22.18+ in the effective Passenger
application and cron environment, successful `npm ci` with the locked
dependency, and a passing `npm run hosting:preflight` before database
migration or public routing is attempted.
