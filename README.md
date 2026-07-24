# Frontend

Phase 6I provides the mobile-first public shell, Auth/Starter onboarding pages,
an authenticated dashboard shell, basic card identity/contact editors,
card settings with slug/publish/QR panel, theme picker, social/catalog editors,
billing/payment UI, account security UI,
Indonesian/English locale loader, and a cookie-authenticated API client with
separate access and Starter CSRF contexts. It does not yet implement full live
template editing, full account profile editing, or admin pages.

Run the automated frontend checks with:

```bash
npm --prefix frontend test
```

Ikuti `docs/frontend/`, UI guidelines, design system, dan prompt frontend. Jangan membuat halaman yang backend phase-nya belum selesai.

The current theme HTML/CSS/renderer is a pre-implementation visual scaffold, not production-ready code. Phase 6 must align every template with its approved preview, replace the legacy `qrUrl` binding with distinct `canonicalUrl`/`qrImageUrl`, hide complete empty field rows, and route all external links through an HTTP(S)-only safe URL helper.
