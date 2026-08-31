# Transactional Email Specification

```ts
interface MailerPort {
  send(message: MailMessage): Promise<MailDeliveryResult>;
}
```

Default adapter: `CpanelSmtpMailer` backed by Nodemailer.
```bash
npm install nodemailer
```

Templates:
- auth.registration-otp
- auth.welcome
- auth.password-reset
- auth.email-change-new-otp
- billing.payment-pending/success/failed
- membership.upgrade-success/expiry-reminder
- security.password-changed

Autoreply is application-triggered, not an unrestricted mailbox autoresponder. Set Reply-To to support and avoid mail loops.

## Outbox
Non-OTP business transactions write `mail_outbox`; a cron worker sends them, retries transient failures up to three attempts, and writes sanitized delivery logs.

Password-reset jobs store only non-secret routing/template data in the outbox. The worker generates the reset token at dispatch time, persists only its hash, sends the plaintext link from memory, and never writes the token or rendered link to outbox/delivery logs. Each retry generates a new token and invalidates the previous active reset token.

OTP is the exception required by D-025/D-030: after the hash record is committed, the issuing request sends the OTP immediately through `TransactionalEmailService`. OTP plaintext is never written to the outbox or logs. A delivery failure returns a generic unavailable result; resend generates a new OTP and invalidates the previous active value.

Templates are server-owned, values are escaped, absolute HTTPS links are used, and plain-text alternatives are provided.
