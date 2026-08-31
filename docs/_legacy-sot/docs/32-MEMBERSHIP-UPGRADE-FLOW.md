# Membership Upgrade Flow

Starter users register/login and claim their card before checkout. Starter may
upgrade to Basic for IDR 55,000 or directly to Pro for IDR 97,000. Basic users
can upgrade to Pro for IDR 55,000. Pro users have no upgrade path and should
not see an upgrade CTA.

Each checkout creates a new unique order with amount, target plan, and
duration controlled by the backend. Verified webhook activation supersedes any
prior active subscription and unlocks the target tier for a fresh 365-day
entitlement from verified payment time. Pending/failed/expired orders never
change the current plan. Retry creates a new order ID.
