# Phase 6F — Theme Picker and Design Panel Report

Date: 2026-07-19
Status: **ACCEPTED**

## Delivered

- Design page at `/app/card/design/`.
- Theme gallery with available/locked state.
- Landscape/portrait/all orientation filter.
- Preview panel using the selected theme preview image.
- Save action using the existing card theme endpoint.
- Theme validator for the locked ten-theme catalog.

## Security Notes

- Theme list is an authenticated safe `GET` request without CSRF headers.
- Theme update is an unsafe cookie-authenticated request and uses access CSRF.
- Theme selection changes presentation only and does not mutate contact data or VCF mapping.
- Rendering uses safe DOM creation and text operations, without inline event handlers.

## Verification

- Frontend automated suite: 24 passed, 0 failed.
- Static frontend security scan covers Phase 6A through Phase 6F HTML/JS files.
- Backend regression was not rerun in this phase because the implementation only changed static frontend files and frontend tests cover the changed theme-picker contract.

## Boundaries

1. Full live template rendering with unsaved field preview remains out of Phase 6F.
2. Social/catalog, logo, Maps editing, WhatsApp preview, billing UI, account settings, admin UI, deployment, commit, and push remain out of Phase 6F.
3. Backend remains the authority for plan-based theme access.

## Phase Gate

Phase 6F was explicitly accepted by the product owner on 2026-07-19. Phase 6G must not start without explicit approval.
