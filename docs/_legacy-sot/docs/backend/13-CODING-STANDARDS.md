# Backend Coding Standards

Node.js `>=22.18 <23`, Express 5, strict TypeScript/ESM, explicit types, dependency injection, thin controllers, transactions for multi-table state, immutable DTOs where practical, central exception mapping, no SQL in Controller/Service, and no business rules in views. Avoid global mutable state and unhandled promises.

Repositories use MySQL2 `execute()` with placeholders. User values, identifiers, sort keys, and table/column names must never be concatenated from request input. Dynamic identifiers require internal allowlists.

All persisted JavaScript dates use the MySQL2 pool UTC serialization setting
(`timezone: 'Z'`), and every connection session is set to `+00:00`. SQL that
evaluates time server-side uses `UTC_TIMESTAMP()`; local server time must not
be mixed into entitlement or expiry comparisons.

Slug generation and suggestion logic must live in dedicated services, not controllers:
- `StarterSlugGenerator`
- `CustomSlugNormalizer`
- `SlugSuggestionService`
- `SlugAvailabilityService`
