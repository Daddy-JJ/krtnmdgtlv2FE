# API Contract

Base: `/api/v1`.

## Envelope
Success: `success`, `message`, `data`, optional `meta`.
Failure: `success=false`, `message`, `code`, optional field `errors`.

## Status
422 validation; 401 unauthenticated; 403 forbidden/capability; 404 not found; 409 conflict/limit; 429 rate limit; 500 non-sensitive server error.

Groups: Auth, Starter, Cards, Social, Catalog, Plans, Payments, Public, Admin.

Machine-readable contract: `openapi/openapi.yaml`.

Unsafe operations authenticated by access/Starter cookies require the `X-CSRF-Token` header. Card responses distinguish the root `canonicalUrl` from the same-origin QR PNG `qrImageUrl`.

`GET /public/cards/{slug}/qr` returns PNG for published cards; optional download; server-built payload only.

## Slug endpoints

```http
GET /api/v1/cards/slug-suggestion?fullName=...&mobilePhone=...
GET /api/v1/cards/slug-availability?slug=...
PATCH /api/v1/cards/{publicId}/slug
```

Rules:
- suggestion and availability are advisory;
- PATCH performs the authoritative validation and conflict check;
- Starter cannot call slug update successfully.

## v2.3 Midtrans
Payment endpoints: POST /payments/checkout, GET /payments/{publicId}, POST /payments/{publicId}/reconcile, POST /payments/midtrans/webhook, GET /subscriptions/current.

Basic/Pro checkout and payment responses use `durationDays: 365`. Admin plan
mutation rejects any paid duration other than 365. Price remains editable.
Initial activation and annual renewal remain backend-authoritative.

## Theme endpoints

```http
GET /themes
GET /cards/{publicId}/themes
PATCH /cards/{publicId}/theme
```

Theme update request:

```json
{
  "themeCode": "pro-vertical-light-panel"
}
```

The backend returns `403 FEATURE_NOT_AVAILABLE` or `409 THEME_NOT_ALLOWED` when the effective plan cannot use the theme.

## Phase 9

Member Resume endpoints use `/resume-service` and `/resume-requests`.
Operational endpoints use `/admin/resume-requests`; Super Admin statistics and
interventions use `/admin/statistics` and `/admin/users/{publicId}/interventions`.
Every response preserves the common envelope. Private downloads are authorized
per request and return DOCX attachments without a storage URL.
