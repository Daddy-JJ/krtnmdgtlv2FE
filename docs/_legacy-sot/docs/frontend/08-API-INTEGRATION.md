# API Integration

API client: configurable base, `credentials: include`, JSON, session-bound `X-CSRF-Token` header for unsafe cookie-authenticated requests, request ID, abort/timeout, one controlled refresh attempt, and a consistent error object. Echo signed `csrf_token` for access-session mutations and `starter_csrf_token` for Starter manage/claim mutations; never confuse either readable non-authentication value with the HttpOnly credential cookies.

Deployment requires readable CSRF cookies with `Path=/`, while access/refresh/manage credentials stay HttpOnly and API-path restricted. Prefer same-origin `/api/v1`; a cross-origin frontend/API split requires an exact CORS origin and a reviewed shared cookie-domain policy.

Tidak ada secret di JS; tidak ada token di localStorage; external links safe rel; hindari raw innerHTML.

Use same-origin QR endpoint; never send card data to third-party QR service; fallback to canonical link.

## Slug API

Use a debounced availability endpoint for convenience.
Saving the card slug remains authoritative and may still return `409 SLUG_UNAVAILABLE`.
Never assume a previously checked slug is reserved for the user.

## Theme APIs

Cache the theme catalog briefly, but refresh after membership changes.
Treat backend access flags as authoritative.
