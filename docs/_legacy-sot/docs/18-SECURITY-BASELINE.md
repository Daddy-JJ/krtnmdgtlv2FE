# Security Baseline

## Authentication
Versioned scrypt (`N=65536`, `r=8`, `p=1`, 16-byte salt, 32-byte key), generic login errors, short access token, refresh rotation/hash-only, Secure HttpOnly SameSite cookie, family revoke on reuse.

Unsafe cookie-authenticated requests require a signed, session-bound readable CSRF cookie echoed as `X-CSRF-Token`; access uses `csrf_token` and Starter manage uses `starter_csrf_token`. These CSRF values are not authentication credentials.

## Authorization
Ownership/admin check untuk mutation; plan capability terpisah; admin role explicit; hidden field tidak dipercaya.

## Starter
High-entropy manage token, hash-only, tidak terkait slug, dapat rotate/revoke, tidak masuk log/analytics.

## Input/output
Server validation/normalization, contextual output encoding, prepared statement, CSP, Referrer-Policy, nosniff, frame restriction, same-origin CORS.

## Upload
AuthN/AuthZ, extension+MIME allowlist, decode/re-encode, size/dimension limit, random name, non-executable storage; SVG disabled MVP.

## Payment
Signature verification, idempotency, server-to-server confirmation bila perlu, Server Key tidak terekspos.

## Logging
Redact credential/token; production stack trace off.

QR: canonical URL only, no token, no arbitrary payload, PNG-only, rate limit, normalized cache key, safe headers.

## URL and slug security

- Starter random codes use a CSPRNG.
- Exact case is preserved.
- Reserved route protection prevents route takeover.
- Custom slug is normalized and encoded safely.
- Availability endpoint is rate-limited.
- Do not reveal account ownership through slug availability responses.
- Phone-based suggestion requires visible privacy warning.
- Slug is not an authorization secret.

## v2.3 Midtrans
Midtrans: Server Key backend-only; amount backend-authoritative; verify signature/amount/status/fraud status; idempotent monotonic transitions; browser callbacks untrusted; redact logs.

## Theme security

- Theme code is allowlisted from database/registry.
- Users cannot submit arbitrary template paths, CSS, HTML, or JavaScript.
- User field values are rendered as text, not raw HTML.
- External social/website links use validated URLs and safe rel attributes.
- External website, Maps, social, and catalog targets allow only HTTP(S); the frontend must reject unsafe schemes before assigning `href`.
- Uploaded logos follow image upload controls.

## Email/OTP
SMTP secret is environment-only; TLS peer verification is enabled; OTP is CSPRNG, hash-only, single-use, expiring, attempt/rate-limited; responses are anti-enumeration; logs/templates are redacted and escaped.

## Resume documents and internal operations

Resume files use private non-executable storage, random stored names, signature
and MIME validation, macro/encryption rejection, malware-scan hook, authenticated
download, assignment/ownership checks, nosniff, and no raw path. High-risk Super
Admin actions additionally require recent session authentication, reason,
confirmation, transaction, and immutable intervention records.
