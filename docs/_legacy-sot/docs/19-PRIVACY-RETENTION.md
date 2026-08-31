# Privacy and Retention

Minimalkan data. UI membedakan public card fields dari private account data.

- Active account/card disimpan selama layanan aktif.
- Deleted card memakai configurable recovery window lalu purge.
- Verification/reset token expired lalu purge.
- Refresh token purge setelah expiry/revocation retention.
- Payment record mengikuti kebutuhan accounting/legal review.
- Log operasional berretensi pendek.

Sebelum production, privacy notice, terms, consent, dan retention period perlu legal review sesuai yurisdiksi.

Self-hosted QR avoids disclosure to third-party QR providers; purge cache on permanent deletion.

## Phone-derived URL privacy

A Basic/Pro suggestion may include the mobile phone number in a public URL.
The user must be informed and may replace it with a non-phone custom slug.
The system should not force a phone-derived slug.

## Resume Enhancement

Source, supplemental, working, revision, and deliverable files expire 90 days
after the latest official release. Warnings are queued at 30, 7, and 1 day.
Cleanup is idempotent and removes physical files before marking them deleted.
CV content is excluded from analytics, telemetry, audit values, and email.
