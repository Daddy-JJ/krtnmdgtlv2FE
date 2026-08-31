# Official Email Architecture

```text
kartunamadigital.id
├── website
├── admin
└── mail.kartunamadigital.id

Node.js application
└── SMTP authentication
    └── mail.kartunamadigital.id
        └── user
```

## Recommended mailboxes
- `no-reply@kartunamadigital.id`: transactional sender
- `support@kartunamadigital.id`: Reply-To and support
- `admin@kartunamadigital.id`: administration
- `security@kartunamadigital.id`: security notices
- `dmarc@kartunamadigital.id`: DMARC reports

## SMTP
Copy the exact secure settings from cPanel **Set Up Mail Client**. Preferred example:
```env
MAIL_HOST=mail.kartunamadigital.id
MAIL_PORT=465
MAIL_ENCRYPTION=ssl
MAIL_USERNAME=no-reply@kartunamadigital.id
```
Port 587 with STARTTLS is valid only when cPanel specifies it.

## Layers
`UseCase -> TransactionalEmailService -> MailerPort -> CpanelSmtpMailer -> SMTP`.
Controllers do not connect to SMTP.

## Node adapter
The Node.js baseline uses Nodemailer only inside `CpanelSmtpMailer` while preserving the transport-neutral application port. Only one active adapter is configured per deployment.

## Deliverability
Production requires valid MX, `mail` DNS, TLS certificate, SPF, DKIM, DMARC after SPF/DKIM, PTR review, and real inbox tests. cPanel Track Delivery is used for troubleshooting.

## Scope
Transactional email only: OTP, welcome/autoreply, password reset, email change, payment/membership, and security notices. Bulk marketing is outside MVP.
