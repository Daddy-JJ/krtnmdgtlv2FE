# CR-003 — Consistent App Shell and User Feedback

Status: implemented locally, pending product-owner visual acceptance.

## Approval and scope

The product owner requested a persistent left workspace navigation across authenticated pages, a restrained modern page transition, and a User Feedback menu with one open improvement question limited to 300 characters.

## Decisions

- One shared frontend shell owns the header, responsive workspace navigation, active state, logout, and page transition.
- Desktop keeps the left navigation visible; small screens use an explicit accessible Menu toggle.
- Motion is short and disabled effectively through `prefers-reduced-motion`.
- Feedback requires an authenticated active account and session-bound access CSRF.
- `POST /api/v1/feedback` accepts only `{ message }`, trimmed and limited to 1–300 characters.
- Feedback persistence is append-only and owned by the Feedback module through Controller → Service → Repository.
- No tier, payment, card, public-page, or membership behavior changes.

## Security and data

The UI warns users not to submit passwords, tokens, or secrets. SQL is parameterized. The API rejects unknown fields, unauthenticated requests, invalid CSRF, empty messages, and messages above 300 characters.
