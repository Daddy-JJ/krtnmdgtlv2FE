# QR Code Specification

## Engine
```bash
npm install qrcode
```
Gunakan package hanya di adapter internal; package ini dipasang pada Phase 4, bukan fondasi Phase 1M.

## Payload
`{APP_URL}/{slug}`. The server preserves exact case for Starter random slugs and uses the normalized lowercase value already stored for Basic/Pro custom slugs. Canonical host is built server-side, HTTPS is required in production, and only published cards can produce QR output. No arbitrary payload, token, or raw vCard is allowed.

## MVP profile
- PNG 512×512
- Error correction Medium
- Black on white
- Logo/custom color/public SVG disabled

## Interface
```ts
interface QrCodeRendererPort {
  renderPng(payload: string, options: QrRenderOptions): Promise<QrRenderResult>;
}
```

## Flow
`PublicQrController -> PublishedCardQuery -> CanonicalUrlBuilder -> QrCodeRenderingService -> QrCache -> Renderer -> PNG`

## Cache
Path `backend/storage/cache/qr/`; key `qr:v1:{card-public-id}:{sha256(canonical-url + render-profile)}`. Lazy generation, immutable object, logical invalidation by new key, scheduled cleanup, no QR DB table.

## API
`GET /api/v1/public/cards/{slug}/qr` and optional `?download=true`. Headers: image/png, inline/attachment, ETag, Cache-Control, nosniff.

## Errors
404 unpublished/not found, 429 rate limited, 503 renderer unavailable. Frontend fallback Copy Link.

## Security
No arbitrary payload, token, user-supplied QR logo, raw slug cache path, secret logging, or external fallback.

## Tests
PNG decodes; exact canonical URL; no token; cache hit/miss; new key on slug/domain/profile; Android/iOS scan UAT.

## Sensitive data prohibition
The QR payload must never contain a Starter manage token, authentication token, payment token, or recovery token.

When a Basic/Pro slug changes, a new content-addressed QR cache key is generated. Starter mixed-case slug must preserve exact character case.
