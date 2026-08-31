# CR-009 — Built-in scrypt password hashing

## Status

Approved by the product owner on 2026-08-09 for all impacted authentication,
hosting, fixture, test, documentation, and deployment-mirror changes.

## Reason

The selected shared hosting can run Node.js 22.23.0 but cannot fork enough
processes to build the native `argon2` dependency. Installation fails inside
`node-gyp-build` before application startup. The database hosting target has no
production users yet.

## Decision

Use asynchronous `node:crypto.scrypt` with the locked D-059 format and remove
the native Argon2 dependency. Password plaintext remains prohibited from
storage and logs. Unknown-account login continues to execute a dummy password
derivation. Rate limiting, generic credential errors, reset-token lifecycle,
refresh revocation after password reset, HttpOnly cookies, and CSRF controls
remain unchanged.

## Compatibility

- New registrations and password resets emit only `$scrypt$v=1$` hashes.
- Exact version and parameters are required during verification.
- Legacy `$argon2id$` hashes fail closed and require password reset.
- Local QA fixture hashes are regenerated with unique scrypt salts.
- No database schema migration is required because `users.password_hash`
  already stores an opaque versioned string within `VARCHAR(255)`.

## Verification

- Two hashes of the same password differ.
- Correct-password verification succeeds; wrong, malformed, downgraded, and
  legacy hashes fail.
- Production dependencies contain no `argon2` or node-gyp password adapter.
- Hosting preflight gates built-in scrypt availability.
- Typecheck, full backend tests, dependency audit, local QA login smoke, and
  standalone API mirror verification are required before deployment.
