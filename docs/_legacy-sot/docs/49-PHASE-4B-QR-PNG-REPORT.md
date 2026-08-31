# Phase 4B — QR PNG Report

Date: 2026-07-19
Status: **ACCEPTED**

## Delivered

- `GET /api/v1/public/cards/{slug}/qr` with inline PNG and optional `download=true` attachment.
- Self-hosted `qrcode` adapter behind `QrCodeRendererPort`.
- Fixed 512×512, error correction M, black-on-white profile.
- Payload is exclusively the server-built canonical URL of a published card.
- Content-addressed filesystem cache using SHA-256 card ID, canonical URL, and render profile; no QR database table and no raw slug path.
- ETag/304, immutable cache headers, safe filename, and database-backed public rate limiting.

## Verification

- Strict TypeScript: passed.
- Active unit/security/HTTP suite: 47 passed, 0 failed.
- Generated PNG decoded back to the exact mixed-case canonical URL.
- Cache MISS→HIT and new key after canonical URL change passed.
- Dependency audit: 0 known vulnerabilities.

## Risks and boundary

1. Android/iOS camera scanning remains device UAT.
2. Scheduled removal of obsolete content-addressed cache files remains a deployment operation.
3. Admin QR health/purge operations are deferred to the approved admin phase; public runtime QR is complete.
4. Logo overlay, custom colors, SVG, arbitrary payloads, and external QR fallback remain prohibited.
