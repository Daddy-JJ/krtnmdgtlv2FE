# Public root-card defect fix report

Date: 2026-07-23
Status: **LOCAL PASS — REAL-DEVICE AND SHARED-HOSTING ROUTING PENDING**

## Defect

Published cards were available from `/api/v1/public/cards/{slug}`, but canonical `/{slug}` requests were treated as missing physical files by Apache and returned its default 404 page. The prior local E2E checked canonical link values and QR/VCF APIs without navigating the root public page.

## Resolution

- `frontend/.htaccess` internally routes only a missing one-segment slug to `public-card/index.html`.
- The public shell reads the exact case-sensitive path slug and fetches the authoritative aggregate API.
- `themeCode` resolves only through an active allowlisted registry entry; the corresponding local template is parsed without unsafe HTML assignment.
- The aggregate contact object is adapted to the shared theme field contract.
- VCF, QR download, optional Pro WhatsApp, social links, catalog, loading, unavailable, and not-found states are rendered with safe DOM APIs.
- Real files/directories and API routing remain unchanged.

## Verification

- Native frontend suite: `41 passed`, `0 failed`.
- Chrome E2E: `6 passed`, `0 failed`.
- Valid: `/QaStart`, `/qa-basic`, `/qa-pro` render their exact Starter, Basic, and Pro themes.
- Assets: QR returns PNG and VCF returns `text/vcard` for all three cards.
- Negative: `/qastart` and `/unknown-card` show `Kartu tidak ditemukan` and switch robots to `noindex, nofollow`.
- Responsive: Starter public card at 390x844 has no horizontal overflow.

## Static-hosting boundary

Apache returns the static shell with HTTP 200 before the browser calls the aggregate API. Therefore an unknown card can render a correct noindex not-found UI but cannot return a true root HTTP 404. A true status-aware canonical response requires an edge/server-rendering design and remains a production SEO decision, not a reason to weaken API or slug rules.

Remote Phase 8I remains deferred: shared-hosting support for ordinary rewrite overrides and stable HTTPS `/api/v1` mapping must still be verified.
