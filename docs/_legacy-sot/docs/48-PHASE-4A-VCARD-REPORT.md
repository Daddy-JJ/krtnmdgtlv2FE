# Phase 4A — VCF 3.0 Report

Date: 2026-07-19
Status: **ACCEPTED**

## Delivered

- `GET /api/v1/public/cards/{slug}/vcard` for published cards only.
- UTF-8 VCF 3.0 with CRLF, core contact mapping, escaping, CRLF-injection prevention, and 75-octet folding.
- Safe attachment filename preserving valid mixed-case Starter slugs.
- Rendering remains independent from theme, QR, logo, social, catalog, and other web-only fields.

## Verification

- Strict TypeScript: passed.
- Active unit/security/HTTP suite: 43 passed, 0 failed.
- Published-card database visibility is reused from the Phase 3C MariaDB lifecycle gate.

## Risks and boundary

1. Device import behavior remains a mobile UAT gate.
2. VCF 4.0 remains optional and is not implemented.
3. Phase 4B QR requires the exact `qrcode` dependency, adapter isolation, content-addressed cache, and PNG decode verification.
