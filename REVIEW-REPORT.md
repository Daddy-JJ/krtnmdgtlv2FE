# Frontend SOT Reintegration Review

Review date: 2026-09-01

Status: **SOT RECOVERED THROUGH PHASE 4; IMPLEMENTATION REMEDIATION PENDING**

## Repository classification

Repository adalah static multi-page frontend, bukan monorepo lama. Backend berada
di luar repository dan hanya terhubung melalui API. Stack aktual adalah Vanilla
JavaScript ES modules, compiled Tailwind CSS, browser Fetch/DOM, Node tests, dan
Vercel Function proxy.

## Recovery completed

1. Product owner menyelesaikan tujuh keputusan high-risk.
2. Deployment output dipindahkan dari root ke allowlisted `dist/`.
3. 162 dokumen legacy dan 12 governance snapshot dikarantina tanpa checksum
   mismatch.
4. Frontend-only SOT, Decision Log, arsitektur, membership contract, API consumer
   contract, dan deployment contract dibentuk kembali.

## Confirmed implementation strengths

- Broad public/auth/member/internal route coverage.
- Central API client dengan credentials, timeout, request ID, refresh, dan CSRF.
- Sepuluh template kartu beserta registry dan responsive renderer.
- Root public-card route, QR/vCard links, safe URL helpers, dan SEO coverage.
- Billing UI sudah fail-closed selama checkout paused.
- Resume UI sudah memakai DOCX maksimal 10 MB.
- Test suite luas untuk contract, security, accessibility, routing, dan themes.

## Priority defects retained for Phase 5

- `safeReturnTo()` belum menolak seluruh bentuk backslash/network-path redirect.
- Beberapa download URL mengabaikan configured API base.
- Starter validator menggunakan normalisasi URL pada field nama.
- Reserved slug frontend belum mencakup seluruh route top-level.
- Login routing belum mencakup semua internal role.
- Test local stack masih tergantung helper di parent monorepo.

## Product gaps retained for later phases

- First-visit Light/Dark chooser wajib tetapi belum ada di runtime saat ini.
- Copy checkout belum memakai teks final `Under development` secara konsisten.
- English resource ada tetapi English launch ditunda.
- Social/catalog belum mempunyai complete edit/reorder workflow.
- Maps/logo/WhatsApp presentation support belum lengkap di editor.
- Beberapa admin surface dan unsaved live preview masih belum lengkap.

## Assessment

Dokumentasi dan deployment boundary sudah cukup jelas untuk melanjutkan remediation
secara bertahap. Repository belum dinyatakan production-ready sampai Phase 5–10,
remote Vercel/API smoke, real-device UAT, dan known defects selesai.
