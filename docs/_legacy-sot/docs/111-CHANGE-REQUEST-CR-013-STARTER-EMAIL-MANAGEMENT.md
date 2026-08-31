# CR-013 — Starter Email Management Flow

## Scope

After anonymous Starter creation, send the supplied email address the public
Starter URL and a secure management link. The management page presents only
Login or Signup actions; editing and claiming occur through a verified account
workspace.

## Security contract

- The email link uses a high-entropy opaque token.
- Only the SHA-256 token hash is stored in `starter_email_access_tokens`.
- The token is carried in the URL fragment and exchanged through a POST body;
  it is removed from the browser URL after exchange.
- Exchange creates a Secure HttpOnly Starter manage cookie and a readable,
  manage-bound CSRF cookie.
- Claim still requires an authenticated, verified account and revokes all
  Starter manage and email-access tokens.
- The public URL remains the existing random Starter slug.

## User flow

1. Create Starter with an email address.
2. Show the public URL and email-delivery status.
3. Send the public URL and management link by SMTP.
4. Open the link on any device and choose Login or Signup.
5. Signup users verify email, then login; the pending Starter card is claimed
   and the user enters the workspace.

## Operational behavior

Card creation is retained if SMTP delivery fails. The API reports
`emailSent: false` so the frontend can show an actionable warning. The access
token lifetime is one year and is revoked when the card is claimed.

## Verification

- Backend typecheck and tests pass.
- Frontend tests pass except environment-dependent local-stack binding when
  the sandbox denies `127.0.0.1` listening.
- Production requires migration `008_starter_email_access_tokens.sql`, SMTP
  configuration, and a Passenger restart.
