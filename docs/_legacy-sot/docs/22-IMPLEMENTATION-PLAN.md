# Implementation Plan

## Phase 1 Bootstrap
Node/Express entry point, strict environment validation, MySQL2 pool, router, response/error middleware, migration runner, schema, seed sesuai `database/seed-reference.md`, health, typecheck, and native test harness.

## Phase 2 Auth/Starter
Register/login/logout/refresh, verification/reset, Starter create/manage token/claim.

## Phase 3 Card Core
Card/contact CRUD, ownership, capability service, slug, theme, publish/public endpoint.

## Phase 4 Sharing/Marketing
VCF, QR, social, catalog, upload, Maps, WhatsApp.

## Phase 5 Payment/Admin
Plan admin, checkout, Midtrans webhook, subscription/payment history, admin APIs.

## Phase 6 Frontend
Pages/components/API client/auth/editor/public/billing/admin.

## Phase 7 Release
Security, test/UAT, backup restore drill, production deploy.

Setiap fase berhenti setelah acceptance/test pass.

Phase 4 QR: dependency, adapter, URL builder, filesystem cache, endpoint, UI, admin, decode tests.

## v2.3 Midtrans
Phase 5: gateway interface, Midtrans adapter, migrations, checkout API, Snap frontend, webhook, activation, reconciliation, billing/admin UI, sandbox tests.

## Card theme sub-phase

1. Seed ten approved themes.
2. Seed explicit plan-theme access.
3. Implement ThemeCatalogService and ThemeAccessPolicy.
4. Implement list/select APIs.
5. Implement ThemePicker and CardFieldEditor.
6. Integrate shared theme renderer and templates.
7. Verify all themes with long/empty field fixtures.
8. Verify VCF is unchanged across all themes.
9. Add admin theme activation/reorder controls.

## Email phase
Implement MailerPort, Nodemailer SMTP adapter, hash-only OTP and non-OTP outbox/log migrations, immediate OTP issue/delivery/verify/resend services per D-030, templates, non-OTP worker, frontend OTP UX, admin sanitized outbox, cPanel DNS setup, and tests.
