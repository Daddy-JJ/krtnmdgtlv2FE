# Product Requirements Document

## Objective
MVP Digital Identity Platform yang cepat dibuat, aman diedit, dibagikan URL/QR, dan disimpan sebagai kontak.

## Functional
- Starter create tanpa akun, preview, manage access.
- Register/login/logout, email verification, forgot/reset, refresh rotation.
- Satu kartu aktif per akun pada MVP.
- Editor identity/contact, publish, slug/theme sesuai plan.
- Social/catalog CRUD dan sorting sesuai limit.
- Logo upload Pro, Maps Basic/Pro, WhatsApp Pro.
- QR ke canonical public URL.
- VCF dari data terkini.
- Midtrans checkout/webhook/subscription/payment history with backend-owned
  fixed upgrade transition fees.
- Admin plan/user/card/payment/theme/audit.
- Consistent authenticated workspace navigation and append-only user improvement feedback limited to 300 characters.

## Non-functional
Mobile-first, keyboard accessible, consistent errors, no frontend secret, fast public page, documented backup.

QR requirements: self-hosted PNG, canonical URL payload, preview/copy/open/download, admin health/cache operations.

### Public URL management

- Starter creation returns a seven-letter mixed-case random URL code.
- Basic/Pro card settings include an editable `Custom URL` field.
- Basic/Pro editor shows suggested URL based on name and mobile phone.
- Availability is checked before save.
- UI shows the full URL preview.
- UI warns that phone-based suggestions expose the phone number in the URL.
- UI warns that changing slug invalidates old links and requires a new QR.

## v2.3 Midtrans
Midtrans requirements: backend Snap token creation, billing history, verified
idempotent webhook, status reconciliation, and annual Basic/Pro subscription
activation or renewal for a fixed 365-day term.

Upgrade checkout is not prorated through Midtrans. The backend exposes only
valid transitions: Starter to Basic, Starter to Pro, and Basic to Pro. Pro
members do not receive an upgrade CTA. A verified upgrade starts a new 365-day
target-tier entitlement from the successful payment timestamp.

### Card theme system

- Provide ten approved card themes.
- Theme access is cumulative by plan.
- Users edit contact fields independently from design.
- Theme selection is available in user control panel.
- Live preview reflects unsaved field changes.
- Backend validates plan access.
- Admin can activate/deactivate and reorder themes without editing contact data.

### Official email
Authenticated cPanel SMTP sends OTP, welcome, reset, payment, membership, and security messages with sanitized admin visibility. Non-OTP mail uses durable queue/retry. OTP is delivered immediately without durable plaintext storage; resend issues a new hash-only OTP.

### Phase 9 Resume Enhancement and internal operations

Active verified Pro members receive one human Resume Enhancement for one named
beneficiary per immutable subscription period. The platform provides private
submission/download, specialist and quality-review workflow, three revisions,
working-day SLA, retention cleanup, RBAC, Super Admin interventions, and
sanitized operational statistics.
