# Frontend Security Policy

Laporkan kerentanan melalui kanal privat kepada project owner. Jangan memasukkan
credential, exploit payload sensitif, data pengguna, atau token ke issue publik,
commit, screenshot, dan log.

## Browser storage

- Access token, refresh token, Starter/manage token, reset token, OTP, payment
  token, dan API key dilarang di `localStorage` dan `sessionStorage`.
- `localStorage` hanya diizinkan untuk preferensi non-sensitive
  `knd.theme.preference`.
- `sessionStorage` hanya diizinkan untuk navigation context non-secret yang
  didokumentasikan, misalnya public ID claim; bukan credential.

## Authentication and CSRF

- Auth credential berasal dari backend dalam Secure HttpOnly cookie.
- Fetch authenticated memakai `credentials: 'include'`.
- POST/PUT/PATCH/DELETE cookie-authenticated wajib mengirim `X-CSRF-Token` dengan
  access atau Starter context yang benar.
- 401 hanya boleh memicu satu controlled refresh/retry.
- Role dan entitlement dari UI tidak pernah menjadi authorization control.

## Untrusted input and output

- Render response/user content melalui `textContent`, attribute allowlist, atau
  DOM node APIs.
- Validasi redirect, slug, external URL, `mailto`, `tel`, filename, dan MIME.
- Browser validation adalah UX defense-in-depth; backend tetap authoritative.
- Download URL harus mengikuti configured API base dan tidak membawa token.

## Payments and files

- Checkout tetap disabled selama pause.
- Browser callback atau UI state tidak boleh mengaktifkan membership.
- Resume upload hanya menawarkan DOCX maksimal 10 MB; server harus memvalidasi
  ulang format, ukuran, authorization, malware status, dan retention.

## Deployment

- Secret hanya berada di Vercel/backend environment, tidak di static config.
- `BACKEND_API_BASE_URL` adalah origin HTTPS tanpa credential dan tanpa path.
- Hanya `dist/` yang dipublikasikan sebagai static output.
- Source docs, tests, `.env*`, repository metadata, dan historical SOT tidak boleh
  menjadi public asset.
- Proxy menolak localhost, HTTP, credentialed URL, path tambahan, dan temporary
  tunnel sebagai upstream production.

## Known security work

Open redirect `returnTo`, API-base duplication pada download, reserved slug drift,
dan local-stack test coupling tercatat di `STATUS.md` dan harus diselesaikan pada
fase remediation sebelum production readiness.
