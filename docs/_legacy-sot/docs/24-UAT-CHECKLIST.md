# UAT Checklist

Use this checklist together with `qa/UAT-EVIDENCE-LOG.md`. Every failed item must record browser/device, account role, sanitized request ID or screenshot reference, expected result, actual result, severity, and retest status. Do not store OTPs, passwords, access/refresh tokens, Starter manage tokens, SMTP credentials, Midtrans keys, or API keys in evidence files.

## Environment readiness

- [ ] Target environment selected: local staging, shared-hosting static frontend + cPanel Passenger backend, or VPS/reverse proxy.
- [ ] Frontend and `/api/v1` use the same HTTPS origin, or the provider-specific routing limitation is documented.
- [ ] If direct cross-origin API mode is unavoidable, exact CORS, cookie-domain, SameSite, and CSRF-cookie readability behavior has passed security review.
- [ ] Node 24 runtime confirmed for backend target.
- [ ] HTTPS `APP_URL` points to the public frontend origin used for canonical card and user-facing links.
- [ ] `APP_DEBUG=false` confirmed outside local.
- [ ] `COOKIE_SECURE=true` confirmed outside local HTTPS.
- [ ] `.env`, JWT keys, logs, and storage are outside public web root.
- [ ] Database backup created.
- [ ] Database restore drill completed on non-production clone.
- [ ] Mail outbox cron/worker configured.
- [ ] QR/logo storage writable and non-executable.

## Browser/device matrix

- [ ] Chrome desktop
- [ ] Safari desktop
- [ ] Android Chrome
- [ ] iPhone Safari
- [ ] Keyboard-only navigation
- [ ] Reduced-motion preference
- [ ] Narrow mobile viewport
- [ ] Public page performance smoke

## Starter
- [ ] Create tanpa login
- [ ] Random URL
- [ ] Manage access dapat edit
- [ ] Public URL tidak dapat edit
- [ ] QR membuka URL
- [ ] VCF import
- [ ] Upgrade claim existing card

## Basic
- [ ] Login/custom slug
- [ ] 3 desain
- [ ] Social 2
- [ ] Catalog 2
- [ ] Maps
- [ ] Logo/WhatsApp unavailable

## Pro
- [ ] 10 desain
- [ ] Logo/WhatsApp
- [ ] Social 5
- [ ] Catalog 10
- [ ] Aktivasi hanya verified webhook

## Admin
- [ ] Edit plan price/duration
- [ ] View payment
- [ ] Suspend card
- [ ] Audit action

QR UAT: exact URL, no token, Android/iPhone scan, slug refresh, fallback, admin purge.

## Public URL

- [ ] Starter URL uses exactly seven mixed-case letters
- [ ] Starter cannot edit URL
- [ ] Basic/Pro can edit custom URL
- [ ] Suggested URL matches two name letters plus phone digits
- [ ] Privacy warning appears for phone-based suggestion
- [ ] Reserved URLs are rejected
- [ ] Existing slug change warning appears
- [ ] QR follows the newly saved URL

## v2.3 Midtrans
Midtrans UAT: Basic/Pro checkout, correct amount, pending lock, verified activation, duplicate safety, retry with new order, admin reconcile, sandbox/production separation.

## Card themes

- [ ] Starter has exactly 1 available theme
- [ ] Basic has exactly 3 cumulative themes
- [ ] Pro has exactly 10 cumulative themes
- [ ] Pro has 7 landscape and 3 portrait themes
- [ ] User can edit all contact fields from control panel
- [ ] Theme switch preserves field values
- [ ] Logo appears only when allowed and supplied
- [ ] QR scans in all ten themes
- [ ] VCF imports correctly for every theme
- [ ] Locked themes show upgrade action

## Email/OTP
- [ ] OTP arrives at Gmail/Yahoo/Outlook
- [ ] paste/autofill works
- [ ] expired/wrong OTP rejected
- [ ] resend invalidates old OTP
- [ ] limits work
- [ ] welcome sent after verification
- [ ] admin cannot view OTP
- [ ] SPF/DKIM/DMARC checked

## Release sign-off

- [ ] No Critical/High defects open.
- [ ] Medium defects have owner/decision.
- [ ] OpenAPI and Postman match deployed API.
- [ ] Secret-free logs reviewed.
- [ ] Rollback path rehearsed.
- [ ] Product owner UAT sign-off recorded.
