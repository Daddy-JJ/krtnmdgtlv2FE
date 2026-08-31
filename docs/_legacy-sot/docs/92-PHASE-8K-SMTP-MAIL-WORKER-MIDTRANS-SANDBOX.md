# Phase 8K — SMTP, mail worker, and Midtrans sandbox

Date: 2026-07-22
Status: LOCAL INTEGRATION HARDENING IN PROGRESS — LIVE SERVICES PENDING

## Fixes and safeguards

- Corrected password-reset links from nonexistent `/app/reset-password` to the actual frontend `/reset-password/` route.
- Mail outbox success/failure transitions now write transactional, sanitized `mail_delivery_logs` rows with masked recipients.
- Added `npm run mail:verify`, which verifies SMTP/TLS/auth connectivity without sending mail or printing credential/error details.
- Added SMTP adapter regression coverage and MariaDB integration assertions for reset URL, delivery status, recipient masking, and token-free logs.
- Added an ordered live SMTP/OTP/cron and Midtrans sandbox validation runbook with explicit stop conditions.

## External boundary

The approved mailbox configuration and DNS authentication are documented, but live SMTP auth/send, cross-provider inbox delivery, cPanel cron, and Midtrans sandbox transactions require server-side credentials and the stable Phase 8H/8I environment. They are not simulated or marked passed locally.
