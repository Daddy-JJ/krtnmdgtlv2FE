# Midtrans Snap Integration Specification

## Package
```bash
npm install midtrans-client
```
Use the official Node.js library only inside an adapter behind `PaymentGatewayPort`; install it during the commerce phase.

## Environment
```env
MIDTRANS_ENV=sandbox
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_MERCHANT_ID=
MIDTRANS_NOTIFICATION_URL=https://kartunamadigital.id/api/v1/payments/midtrans/webhook
MIDTRANS_FINISH_URL=https://kartunamadigital.id/app/billing/result
MIDTRANS_UNFINISH_URL=https://kartunamadigital.id/app/billing/result
MIDTRANS_ERROR_URL=https://kartunamadigital.id/app/billing/result
```
Sandbox and production credentials are different.

## Checkout flow
1. User selects an allowed target tier for the current membership.
2. Backend validates account/card/plan.
3. Backend resolves the fixed internal upgrade fee for the current-tier to
   target-tier transition and requires the locked annual duration of exactly
   365 days.
4. Backend creates a pending payment with unique order ID and immutable snapshot.
5. Backend requests a Snap token.
6. Frontend opens Snap.
7. Browser callback updates UX only.
8. Midtrans webhook is verified server-side.
9. Idempotent processing updates payment and activates/extends subscription.

## Interface
```ts
interface PaymentGatewayPort {
  createCheckout(input: CreateGatewayCheckout): Promise<GatewayCheckoutResult>;
  verifyNotification(payload: unknown): Promise<VerifiedGatewayNotification>;
  getTransactionStatus(orderId: string): Promise<GatewayTransactionStatus>;
}
```

## Webhook
`POST /api/v1/payments/midtrans/webhook`

Rules:
- valid HTTPS endpoint;
- parse JSON tolerantly;
- verify signature;
- validate order ID, amount, transaction status, and fraud status;
- process in a database transaction;
- unique event/order idempotency;
- ignore regressive/out-of-order state;
- return 2xx for already processed valid notifications.

For classic Midtrans notifications verify:
`SHA512(order_id + status_code + gross_amount + server_key)`
using exact supplied strings and constant-time comparison.

Activate only for:
- `settlement`; or
- `capture` with `fraud_status=accept`.

Never activate for pending, challenge, deny, cancel, expire, or failure.

## Membership policy
- Starter -> Basic/Pro after verified payment.
- Basic -> Pro after verified payment.
- Pro -> no upgrade path; dashboard must not show an upgrade checkout CTA.
- Basic and Pro are annual subscriptions with an exact 365-day term.
- Annual renewal uses verified server-side payment evidence.
- Renewal extends exactly 365 days from the later of current end date or
  verified payment time.
- No proration in MVP. Allowed upgrade fees are fixed internally: Starter to
  Basic IDR 55,000; Starter to Pro IDR 97,000; Basic to Pro IDR 55,000.
- A verified successful upgrade supersedes the prior active subscription and
  starts a new target-plan 365-day entitlement from verified payment time.
- Failed/expired payment does not alter current membership.
- Provider-specific automated renewal collection remains paused until the
  Midtrans Change Request resumes; annual entitlement rules remain active.

## Security
- Frontend never receives Server Key.
- Amount, plan, duration, order ID, and user/card references are backend-controlled.
- Browser success callback is untrusted.
- Webhook payload storage is minimized/redacted.
- Uncertain status is reconciled with Midtrans Get Status API.
