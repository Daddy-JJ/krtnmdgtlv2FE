# Billing and Checkout UX

Show current plan, valid upgrade target, fixed transition price, duration,
feature comparison, and exact checkout summary. Prevent double submit.

Upgrade visibility:
- Starter shows Upgrade to Basic for IDR 55,000 and Upgrade to Pro for
  IDR 97,000.
- Basic shows only Upgrade to Pro for IDR 55,000.
- Pro shows no upgrade CTA.

Frontend requests checkout, opens Snap using returned token, and treats onSuccess/onPending/onError/onClose as UI signals only. Then it refreshes payment status from the backend.

Billing result states: preparing, pending, processing, successful, expired,
failed, canceled. Paid features remain locked until backend reports active
membership. Successful upgrade means the target tier receives a new 365-day
entitlement from verified payment time.
