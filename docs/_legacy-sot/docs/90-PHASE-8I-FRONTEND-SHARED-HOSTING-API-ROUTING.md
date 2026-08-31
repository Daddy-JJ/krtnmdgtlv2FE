# Phase 8I — Frontend shared hosting and API routing

Date: 2026-07-22
Last revalidated: 2026-08-11
Status: BACKEND HEALTHY — FRONTEND CPANEL RELEASE PENDING

## Result

- Same-origin `/api/v1` remains the preferred deployment model.
- A reviewed sibling API subdomain fallback is documented with exact credentialed CORS and cookie-domain requirements.
- Static upload/root/cache/security checks are defined without using `.htaccess` as an unsupported API reverse proxy.
- The frontend stays under `frontend/`; its contents are uploaded to the document root and `index.html` is not moved to repository root.
- Exact production hosts use `https://api.kartunamadigital.id/api/v1`; local and preview hosts retain same-origin `/api/v1`.

## Canonical public-card routing

The frontend now includes an ordinary static Apache rewrite in `frontend/.htaccess` for a missing one-segment `/{slug}` path. It internally loads `public-card/index.html`; JavaScript preserves the exact case-sensitive slug and calls the existing public aggregate API. The rule checks `!-f` and `!-d`, so real application pages/assets are not intercepted, and it does not proxy `/api/v1`.

This static fallback returns the shell with HTTP 200 before the browser knows whether a card exists. Missing or wrong-case slugs are changed to an accessible `noindex, nofollow` not-found state after the API returns 404. A true HTTP 404 at the canonical root requires an edge/server-rendering design and remains a production SEO review item.

## Browser integration defect fixed

Readable signed `csrf_token` and `starter_csrf_token` cookies previously used `Path=/api/v1`. Pages under `/app`, `/create`, and other frontend paths could therefore not read them through `document.cookie`. Their path is now `/`; credential cookies remain Secure, HttpOnly, and API-path restricted. Clear-cookie behavior, tests, backend/frontend security documentation, and OpenAPI descriptions were updated together.

## Gate

Local Apache same-origin routing was re-executed with the existing XAMPP stack:
`/`, `/login/`, `/create/`, and `/app/` returned HTML 200;
`/api/v1/health` and `/plans` returned JSON 200; unauthenticated `/me`
returned JSON 401; and an unknown API route returned JSON 404.

Public inspection found a remote stop condition: `https://kartunamadigital.id/`
currently returns an Apache `Index of /` directory listing rather than the
frontend. The staging frontend/API hostnames also do not resolve. The tracked
frontend `.htaccess` already contains `Options -Indexes`, but it cannot protect
a server where the frontend release has not been uploaded to the active
DocumentRoot.

On 2026-08-11 the public backend returned JSON HTTP 200 with security headers
and an available database through LiteSpeed at
`https://api.kartunamadigital.id/api/v1/health`. The reviewed API-subdomain
fallback is now selected. Remote Phase 8I remains pending until the frontend is
uploaded to the intended HTTPS DocumentRoot, directory listing is disabled,
the exact credentialed CORS/shared-cookie environment is applied, and browser
auth/CSRF smoke tests pass.
