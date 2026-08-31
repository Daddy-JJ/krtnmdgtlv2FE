# Backend Modules

- Auth: register/login/verification/reset/refresh/logout.
- StarterAccess: anonymous create, manage token verify/rotate, claim.
- Cards: identity/contact/slug/theme/status/logo.
- Membership: effective plan/capability.
- Payment: transaction, verified event, subscription.
- PublicProfile: optimized read aggregate.
- QR/vCard: deterministic published output.
- Admin: users/cards/plans/payments/themes/audit.

QR converts canonical public URL to PNG; vCard converts published contact aggregate to VCF.

## Themes

Theme catalog, plan access, selection validation, and admin activation/order.
Theme module does not own contact values or VCF serialization.
