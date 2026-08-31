# QR Change Impact Review

## Decision
QR dibuat sendiri oleh backend; tidak diperlukan API eksternal.

## Frontend/UI/UX
- QRPanel di dashboard/editor.
- Preview, Copy Link, Open Card, Download PNG, enlarged dialog.
- Loading, unpublished, rate-limit, dan renderer-error states.
- Warning bahwa perubahan slug menghasilkan QR baru.
- Canonical URL selalu menjadi fallback aksesibel.

## Admin
Tambahkan `System > QR Rendering`: engine/version, PNG writer health, default profile, cache status, recent sanitized errors, purge cache, dan render health test. Admin tidak boleh memasukkan payload arbitrer.

## Backend
```text
QrCodeRendererPort
└── NodeQrCodeRenderer
QrCodeRenderingService
├── CanonicalUrlBuilder
├── QrCachePort
└── QrCodeRendererPort
```
Controller tidak memanggil library langsung.

## Database
Tidak perlu tabel QR. QR adalah derived artifact dari canonical URL, slug, dan render profile. Cache disimpan di filesystem/object storage.

## Security
Canonical HTTPS URL only; no token; no arbitrary payload; PNG-only public output; rate limit; normalized cache key; nosniff; no custom logo/color in MVP.

## Functions
Render, cache, invalidate, inline/download, health check, admin purge, logging/metrics, decode test.

## Structure
```text
backend/src/modules/rendering/qr/
backend/src/modules/rendering/vcard/
backend/storage/cache/qr/
frontend/components/QRPanel/
frontend/components/QRDialog/
```

Conclusion: membership dan core database tidak berubah; rendering, sharing UI, admin operations, caching, security, test, dan deployment direvisi.
