# cPanel Mail Setup Checklist
1. Configure `mail.kartunamadigital.id`, MX, TLS certificate, and correct Email Routing.
2. Create `no-reply`, `support`, `admin`, and `security` mailboxes in cPanel Email Accounts.
3. Copy outgoing SMTP host, port, TLS mode, username, and authentication requirement from Set Up Mail Client.
4. Verify SPF and DKIM in Email Deliverability; add DMARC after both are valid; review PTR with hosting provider.
5. Configure secrets and a mail outbox cron worker.
6. Test Gmail, Yahoo, and Outlook; inspect spam folder and cPanel Track Delivery.
7. Confirm no OTP or SMTP credential appears in logs.
