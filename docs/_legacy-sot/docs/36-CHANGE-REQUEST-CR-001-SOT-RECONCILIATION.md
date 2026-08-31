# Change Request CR-001 — SOT Reconciliation

## Requested change
Reconcile contradictions discovered during the initial read-only audit before Phase 1 implementation.

## Reason
The imported v2.5 package contained conflicting root/public routes, legacy theme codes, duplicate decision numbering, dual email-verification mechanisms, an ambiguous theme database field, an undefined CSRF transport contract, and an OTP outbox design incompatible with hash-only storage.

## Business impact
No MVP feature or membership limit changes. Starter, Basic, and Pro scope remains locked. The change prevents divergent implementations and makes security behavior explicit.

## Data/API/UI/security impact
- Canonical public route is `/{slug}`; `/c/{slug}` is invalid.
- Stable theme codes are the descriptive registry/seed codes.
- Physical cards store `theme_id`; API/frontend expose `themeCode`.
- Registration verification uses OTP only; the legacy email-verification token table/endpoint is removed from the pre-implementation baseline.
- Unsafe cookie-authenticated requests require `X-CSRF-Token`.
- Canonical card URL and QR PNG endpoint are separate `canonicalUrl` and `qrImageUrl` fields.
- OTP plaintext is not durably queued; non-OTP email retains outbox/retry.

## Migration/backward compatibility
Application code and production migrations do not yet exist, so no live data migration is required. Existing theme renderer/templates are non-production scaffold and remain pending alignment during Phase 6.

## Files to update
Locked/context/status documents, decision log, IA, QR/auth/email/frontend specs, PRD, database dictionary/reference schema/seed reference, theme registry, OpenAPI, risk register, manifest, and checksums.

## Approval
Approved by the product owner in the Codex project session on 2026-07-18 with the instruction `approved` for Phase 0 SOT Reconciliation.
