# Definition of Done

Acceptance criteria pass; scope follows SSOT; validation/authorization tested; errors follow catalog; tests pass; OpenAPI/migration/data dictionary updated if relevant; no secret/debug; accessibility considered; changed files reported; no unrelated refactor.

QR done only after exact decode, no token, cache/header tests, and Android/iOS UAT.

URL work is done only when Starter case-sensitive routing, reserved route protection, suggestion privacy warning, concurrent conflict handling, and QR refresh are tested.

## v2.3 Midtrans
Payment work requires tested signature, amount, status/fraud checks, duplicate/out-of-order handling, transactional activation, sandbox flows, and secret handling.

Theme work is done only when all ten templates render the core field contract, plan access is enforced server-side, user editing is available in control panel, database seeds are correct, and VCF output is theme-independent.

Frontend theme work also requires runtime templates to match their approved previews, safe HTTP(S) external-link handling, graceful removal of empty field rows, and distinct `canonicalUrl`/`qrImageUrl` handling.

Cookie-authenticated mutations are not done until CSRF header/session-binding tests pass. OTP work is not done until storage inspection proves plaintext never enters the database, outbox, or logs.
