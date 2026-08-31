# Membership Enforcement

`PlanCapabilityService`: `isEnabled`, `getLimit`, `assertEnabled`, `assertWithinLimit`.

Backend authoritative. Setiap mutation mengecek effective plan. Values dari `plan_features`, dapat di-cache, cache invalidated saat admin update. Excess data setelah downgrade dipertahankan tetapi tidak dapat diperluas/dipublish di luar policy.

Feature key:
- `custom_slug_enabled`: Starter false, Basic true, Pro true.

Starter slug mutation must be rejected even with a valid Starter manage token.

Theme access should use explicit `plan_theme_access` mapping.
Do not enforce only by a numeric count; validate the selected theme itself.

`POST /cards` resolves entitlement from an active server-side Basic/Pro subscription. A browser-supplied plan is never accepted, and the endpoint must not fall back to an owned Starter card.
