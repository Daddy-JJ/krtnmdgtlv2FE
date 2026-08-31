# Local E2E UI QA report

Date: 2026-07-22
Status: **PASS — REMOTE PHASES 8H–8J DEFERRED**

## Scope

Local same-origin Chrome E2E against Apache, the Node.js API, and `digital_identity_local` covered:

1. Admin, Starter, Basic, and Pro login, dashboard, cookie policy, and logout.
2. Admin authorization, subscription summaries, and cumulative theme locks (`1/3/10`).
3. Reversible Basic identity/theme mutation, QR PNG, VCF, social create/delete, and catalog create/delete.
4. Desktop `1440x1000` and mobile `390x844` landing/dashboard visibility and horizontal overflow.

## Defects resolved

| ID | Cause | Resolution |
|---|---|---|
| LOCAL-E2E-001 | Native `window.fetch` was invoked with the `ApiClient` object as receiver, causing Chromium `Illegal invocation` before network dispatch. | Invoke the stored fetch implementation with `globalThis` as receiver and add regression coverage. |
| LOCAL-E2E-002 | No-payload actions serialized `null` with JSON content type; Express strict JSON parsing rejected logout with HTTP 500. | Treat `null` as no request body and add regression coverage. |

## Evidence

- Native frontend tests: `35 passed`, `0 failed`.
- Temporary Playwright suite: `11 passed`, `0 failed`.
- Four auth cookies verified: access and refresh are HttpOnly; CSRF is readable and session-bound; logout clears all three.
- Tier authorization: Admin endpoint returns 200 only for Admin; Starter/Basic/Pro return 403.
- Theme availability: Starter 1, Basic 3, Pro 10.
- CRUD fixture mutations were reverted or deleted after assertions.
- Desktop/mobile audit found no horizontal overflow; Secure remains right-aligned below QR Ready.

Temporary browser tooling and evidence stayed under `/private/tmp` and are not release artifacts. No QA password, cookie, token, screenshot, or trace is committed.

## Post-template card integration QA — 2026-07-23

Status: **PASS**

After the ten approved card compositions were implemented, the same-origin local stack was retested against the real QA database and canonical public-card shell:

- frontend native tests: `44 passed`, `0 failed`;
- backend strict typecheck: passed;
- backend tests: `85 passed`, `0 failed`, one opt-in database integration test skipped;
- Chrome headless integration scenarios: `16 passed`, `0 failed`;
- Admin, Starter, Basic, and Pro login/cookie policy passed;
- cumulative theme availability remained Starter `1/10`, Basic `3/10`, and Pro `10/10`;
- Starter/Basic locked theme mutations failed with authoritative `409 THEME_NOT_ALLOWED`;
- Basic revised B2 and Pro revised P3 were selected and saved through the actual design UI;
- Starter, Basic, and Pro public cards rendered their selected template without a visible plan label;
- public QR PNG and VCF endpoints passed for all three published cards;
- stress-length identity/contact fields and an empty office phone adapted at `390px` without card overflow;
- Basic logo upload was rejected, while Pro upload, WebP normalization, public delivery, and template rendering passed.

All mutated QA contacts and themes were restored to their baseline values. The temporary Pro logo, normalized logo file, generated QR cache files, browser dependency, and browser process were removed or kept outside the repository as applicable. Database recheck confirmed no stress fixture or logo path remained.

## Deferred boundary

Per D-041, remote Phases 8H, 8I, and 8J are deferred, not complete. Production remains NO-GO until cPanel runtime/database, HTTPS routing, disposable staging Postman, real-device, and external-service evidence passes.
