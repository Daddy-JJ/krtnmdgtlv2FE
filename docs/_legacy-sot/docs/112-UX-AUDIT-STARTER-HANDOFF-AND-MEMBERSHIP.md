# UX Audit & Flow Analysis — Starter Handoff and Membership

## Scope

Audited journey: Landing Page → Starter creation → Signup → email OTP verification → Login → Starter claim → member workspace → membership upgrade.

## Primary finding

The previous handoff could reach the dashboard without a claimed card. The login header on the Starter management page did not preserve the `returnTo` context, and a failed claim could still redirect away from recovery feedback. This created the misleading empty-dashboard state despite the user having a public Starter URL.

## Approved target flow

1. A visitor creates a Starter card and receives a public URL plus an email management link.
2. The email link exchanges its fragment credential for HttpOnly Starter management cookies and removes the fragment.
3. Every Login or Signup link preserves a validated internal `returnTo` value.
4. Signup carries the handoff through OTP verification to login.
5. Login claims the Starter card before navigating to the workspace. A failed claim remains recoverable on the login page; it never silently enters an empty dashboard.
6. The workspace confirms a successful claim, shows the Starter card, and exposes the existing Basic/Pro billing path.

## Accessibility and feedback changes

- Field errors receive a stable `id`, `aria-describedby`, `aria-invalid`, and alert semantics.
- Form status has atomic polite or assertive live-region behavior according to its tone.
- The Starter handoff states explain the next action and provide a retry action after a claim failure.
- OTP and authentication errors translate non-sensitive runtime failures into actionable user language while retaining a request reference when supplied by the API.

## Membership conversion

Landing Basic and Pro CTAs preserve their intended tier through account creation and open the billing page with the target tier focused when it remains eligible. The backend remains authoritative for transition eligibility, price, payment state, and annual activation.

## Security invariants

- The Starter email credential remains in a URL fragment only until exchanged, then is removed.
- No credential is added to localStorage, sessionStorage, or a query parameter.
- Starter claim still relies on the existing HttpOnly Starter management and access cookies plus the manage-bound CSRF token.
- Only Basic and Pro remain paid annual tiers; Starter is not changed into a paid subscription.
