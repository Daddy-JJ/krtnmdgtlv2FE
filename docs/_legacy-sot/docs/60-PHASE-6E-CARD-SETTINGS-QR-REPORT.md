# Phase 6E — Card Settings, Slug, Publish, and QR Panel Report

Date: 2026-07-19
Status: **ACCEPTED**

## Delivered

- Card settings page at `/app/card/settings/`.
- Current public URL display and open action.
- Starter read-only slug handling.
- Basic/Pro custom slug suggestion, availability check, validation, and save flow.
- Publish action using existing Card publish endpoint.
- QR panel using backend `qrImageUrl` with PNG download link.
- Slug validator and tests for reserved roots and locked format.

## Security Notes

- Slug advisory reads are authenticated safe `GET` requests without CSRF headers.
- Slug update and publish are unsafe cookie-authenticated requests and use access CSRF.
- QR output is backend-rendered from canonical public URL only.
- No auth token, manage token, contact payload, payment token, or third-party QR payload is embedded into the QR panel.
- Rendering uses safe text operations and avoids inline event handlers.

## Verification

- Frontend automated suite: 22 passed, 0 failed.
- Static frontend security scan covers Phase 6A through Phase 6E HTML/JS files.
- Backend regression was not rerun in this phase because the implementation only changed static frontend files and frontend tests cover the changed slug/settings contract.

## Boundaries

1. Theme/design picker, social links, catalog items, logo, Maps editing, WhatsApp preview, billing UI, account settings, admin UI, deployment, commit, and push remain out of Phase 6E.
2. Slug availability remains advisory; final save remains backend-authoritative.
3. Starter public URL remains backend-generated and read-only.

## Phase Gate

Phase 6E was explicitly accepted by the product owner on 2026-07-19. Phase 6F must not start without explicit approval.
