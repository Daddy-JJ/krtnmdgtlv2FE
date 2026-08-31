# Subscription Lifecycle

Effective plan is the active, non-expired subscription; otherwise Starter.

Basic and Pro use one fixed annual term: exactly 365 days. Price is
administrator-managed, while the annual duration is policy-locked.

Verified activation transaction:
1. lock payment;
2. validate successful verified state;
3. mark paid;
4. create/update subscription;
5. calculate starts_at/ends_at;
6. update card plan snapshot;
7. record event and audit log.

Verified same-plan annual renewal extends `ends_at` by exactly 365 days from the
later of the current active end date or verified payment timestamp. An upgrade
uses the backend-owned fixed transition fee, starts a new 365-day target-plan
term from verified payment timestamp, and supersedes the prior active
subscription. Browser callbacks never activate, renew, or upgrade access.

Expiry job marks expired subscriptions and restores Starter capabilities without deleting paid-only data. Manual admin changes require reason and audit trail.
