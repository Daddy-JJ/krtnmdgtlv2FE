# Backend Architecture

Runtime: Node.js `>=22.18 <23`, Express 5, strict TypeScript, MySQL2 Promise API.

Modular monolith:
`HTTP -> Middleware -> Controller -> Validator -> Service -> Policy/Capability -> Repository -> Database`.

Modules: Auth, Users, StarterAccess, Cards, Social, Catalog, Themes, Plans, Subscriptions, Payments, PublicProfile, QR, vCard, Admin, Audit.

Controller menerjemahkan HTTP; Service memegang use case; Repository persistence; Policy authorization; capability service plan limits.

Rendering/QR and Rendering/VCard are separate boundaries. Rendering cannot mutate business state.

Database connections serialize JavaScript `Date` values as UTC (`timezone: 'Z'`)
and initialize each MariaDB session with `SET time_zone = '+00:00'`. Persistence,
default SQL timestamps, and entitlement queries therefore use the same UTC basis;
do not compare application-local timestamps against `UTC_TIMESTAMP()`.

## v2.3 Midtrans
Payments module contains PaymentGatewayInterface, CheckoutService, PaymentNotificationService, MidtransSnapGateway, repositories; Membership owns SubscriptionActivationService.

## Email module
`UseCase -> TransactionalEmailService -> MailerPort -> CpanelSmtpMailer (Nodemailer) -> SMTP`, with immediate non-durable OTP delivery and a separate outbox worker for non-OTP messages.
