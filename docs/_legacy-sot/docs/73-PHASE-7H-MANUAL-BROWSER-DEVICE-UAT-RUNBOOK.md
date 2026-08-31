# Phase 7H Manual Browser/Device UAT Runbook

Date: 2026-07-19
Status: IN PROGRESS — READY FOR PRODUCT OWNER MANUAL UAT

## Scope

Phase 7H translates the fresh Vercel preview + local/staging backend runtime from Phase 7G into a manual browser/device UAT script.

Included:

- Browser and mobile-device UAT sequence for the public Vercel preview.
- Evidence rules that avoid storing secrets, OTPs, cookies, or manage tokens.
- Pass/fail criteria for release-readiness decisions.
- Drift capture process for defects discovered during manual testing.

Excluded:

- Production deployment or custom-domain cutover.
- Live Midtrans credentials or live payment settlement.
- Live SMTP credential disclosure.
- Persisting temporary backend tunnel domains in repository files.

## Environment under test

| Field | Value |
|---|---|
| Frontend preview | `https://frontend-e70347igf-phoenikz-s-projects.vercel.app` |
| API routing | Same-origin `/api/v1/*` rewrite to temporary backend staging tunnel |
| Backend runtime | Local Node.js + Express.js staging process |
| Database | Temporary MariaDB staging database |
| Protection | Public preview access enabled for UAT |

Important: the temporary backend tunnel must remain running while manual UAT is executed. If API calls start returning `502`, pause testing and restart the backend+tunnel preview path instead of recording product defects.

## Evidence hygiene

Record results in `qa/UAT-EVIDENCE-LOG.md` using sanitized notes only.

Never store:

- Passwords, OTP codes, reset links, access tokens, refresh tokens, Starter manage tokens, or raw cookies.
- Midtrans server/client keys, SMTP credentials, API keys, JWT private/public key material, or active temporary tunnel domains.
- Unredacted personal phone numbers or email inbox screenshots.

Allowed evidence:

- Browser/device name and version.
- Sanitized screenshots with personal data redacted.
- HTTP status, visible UI state, generic error code, and non-sensitive request ID.
- Public preview URL and public card slug only when it does not expose sensitive personal data.

## Manual UAT matrix

| ID | Area | Device/browser | Required result |
|---|---|---|---|
| 7H-001 | Public preview | Chrome desktop | `/`, `/login`, `/create`, and `/app` render without console-breaking errors. |
| 7H-002 | Starter flow | Chrome desktop | Create Starter, open public URL, open QR image, and manage edit with CSRF-backed cookie flow. |
| 7H-003 | Starter QR | Android Chrome | Scan generated QR and confirm it opens the canonical public preview URL. |
| 7H-004 | Starter QR | iPhone Safari | Scan generated QR and confirm it opens the canonical public preview URL. |
| 7H-005 | Auth flow | Chrome desktop | Register, verify OTP, login, logout; no tokens visible in local/session storage. |
| 7H-006 | Dashboard/card editor | Chrome desktop | Authenticated dashboard and card identity/contact/settings pages load and save allowed fields. |
| 7H-007 | Theme/social/catalog | Chrome desktop | Plan-limited theme, social, and catalog UI respects locked Starter/Basic/Pro limits. |
| 7H-008 | Billing sandbox | Chrome desktop | Checkout can be initiated in sandbox/stub mode; membership is not active until backend verified status. |
| 7H-009 | Email | Real inbox clients | OTP/reset delivery works only when live SMTP staging credentials are configured outside the repository. |
| 7H-010 | Security smoke | Chrome desktop | Cookies are HttpOnly/Secure where applicable; no auth token appears in browser storage. |

## Recommended test sequence

1. Open the frontend preview on desktop Chrome.
2. Confirm static navigation: `/`, `/login`, `/create`, `/app`.
3. Create an anonymous Starter card with non-sensitive dummy contact data.
4. Open the returned public URL and confirm the public page loads.
5. Open/download the QR image and scan it with Android and iPhone.
6. Use Starter manage page to edit a non-sensitive field and confirm the public page reflects the update.
7. Register a test account using a disposable inbox controlled by the tester.
8. Verify OTP, login, visit dashboard, and logout.
9. If sandbox payment and SMTP staging credentials are available outside the repo, run billing and email checks.
10. Update `qa/UAT-EVIDENCE-LOG.md` with pass/fail status and sanitized evidence references.

## Pass/fail gate

Phase 7H can be accepted when:

- Preview static pages and API health are stable during the manual session.
- Starter public URL and QR pass on desktop plus Android/iPhone.
- Auth cookie/CSRF behavior passes without browser token storage.
- Any Critical/High finding is fixed and retested, or explicitly accepted as a release blocker.
- UAT evidence log is updated with sanitized results.

## Current gate

Gate result: MANUAL UAT RUNBOOK READY; refreshed preview smoke and dummy-account login checks passed.

Next recommended action:

- Product owner runs the 7H manual matrix against the fresh preview while the current backend+tunnel sessions remain active.

## Refreshed preview evidence

On 2026-07-19, the temporary tunnel path was refreshed because the prior quick tunnel hostname stopped resolving.

Fresh preview:

```text
https://frontend-e70347igf-phoenikz-s-projects.vercel.app
```

Evidence:

- Preview root returned `200`.
- `/api/v1/health` returned `200`.
- `/api/v1/plans` returned `200`.
- Dummy Starter, Basic, and Pro public cards returned `200`.
- Dummy admin, Starter, Basic, and Pro account login checks returned `200`.
- Local `frontend/vercel.json` was sanitized back to the placeholder rewrite target after deployment.
