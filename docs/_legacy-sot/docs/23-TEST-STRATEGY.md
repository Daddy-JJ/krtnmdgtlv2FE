# Test Strategy

## Unit
Slug/reserved words, plan capabilities, VCF escaping/folding, phone/URL normalization, payment transition, token hash/verify.

## Integration
Auth lifecycle, Starter create/edit/claim, ownership denial, plan limits, public status, upload rejection, webhook signature/idempotency.

## Contract
Validate API response terhadap OpenAPI.

## Security
SQLi, XSS, IDOR, CSRF, token reuse, malicious upload, webhook replay.

CSRF coverage includes missing/mismatched header, session binding, rotation, and confirmation that the readable CSRF cookie cannot authenticate a request by itself. URL tests reject `javascript:`, `data:`, and other non-HTTP(S) external targets.

## Device/browser
Mobile viewport, real iOS/Android VCF import, keyboard navigation, slow network/error states.

QR unit/integration/manual tests cover URL, cache, headers, publication, rate limit, Android/iPhone.

## Slug tests

- CSPRNG output format and length.
- Case-sensitive uniqueness.
- collision retry.
- reserved routes.
- suggestion normalization.
- short/missing name fallback.
- missing phone fallback.
- concurrent custom slug conflict.
- route precedence between system routes and public slugs.

## v2.3 Midtrans
Midtrans tests: signature, amount mismatch, valid/invalid webhook,
duplicate/out-of-order event, capture accept/challenge, settlement,
expire/cancel/deny, locked annual duration, exact 365-day renewal extension,
and timeout.

## Theme tests

- Starter sees/selects one theme.
- Basic sees/selects three cumulative themes.
- Pro sees/selects ten themes.
- Unauthorized direct API selection is rejected.
- Changing theme does not modify contact data.
- Every template supports all core fields.
- Empty optional fields hide safely.
- Long fields wrap.
- QR remains scannable.
- VCF output is identical regardless of theme.
- Portrait and landscape responsive behavior.

## Email tests
OTP leading zeros/hash/expiry/consume/attempts/resend, anti-enumeration, concurrent verification, immediate SMTP failure, proof that OTP plaintext never enters outbox/log storage, non-OTP queue retries, escaping, TLS configuration, and real inbox delivery.
