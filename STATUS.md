# Frontend Repository Status

Updated: 2026-09-01

Overall: **SOT reintegration Phase 4 complete; frontend remediation and final UAT pending.**

## Baseline

| Area | Status |
|---|---|
| Repository boundary | Frontend-only |
| Stack | Static HTML, Vanilla JS modules, Tailwind CSS 4 |
| Canonical hosting | Vercel |
| Backend | Separate repository/shared-hosted API |
| Static build | 152 allowlisted runtime files in `dist/` |
| Automated tests | 103 passing; 1 known monorepo-coupling failure |
| Launch locale | Bahasa Indonesia |
| English | Deferred; scaffold remains |
| Checkout | Paused |
| Production readiness | Not yet approved |

## Implemented frontend surfaces

| Surface | Current implementation |
|---|---|
| Public marketing | Landing, About, FAQ, Contact, legal pages, two blog articles, SEO metadata |
| Authentication | Register, OTP verify/resend, login/logout, forgot/reset password |
| Starter | Anonymous creation, email handoff, Login/Signup claim flow |
| Member workspace | Dashboard, card editor/settings/design/social/catalog, billing, account, feedback |
| Public card | Root slug shell, ten templates, adaptive fields, QR/vCard links |
| Card themes | 1 Starter, 3 cumulative Basic, 10 cumulative Pro |
| Resume Enhancement | Pro member forms/detail/revision, DOCX 10 MB validation, internal workspaces |
| Internal workspace | Super Admin and assignment-scoped CV Specialist shells |
| API transport | Cookie credentials, CSRF contexts, timeout, refresh, normalized errors |
| Deployment | `dist/` allowlist and Vercel HTTPS upstream proxy |

## Locked decisions not yet fully reflected in runtime

- First visit currently follows stored/system theme and shows a toggle; mandatory
  Light/Dark chooser has not been restored.
- Checkout is disabled, but all paused copy has not yet been normalized to exact
  `Under development` wording.
- Locale loader and English JSON remain even though launch is Indonesian-only.

## Known defects for Phase 5

1. `utils/auth-flow.js:safeReturnTo()` can accept backslash variants that resolve
   as an external navigation target.
2. Resume/admin/public download URLs contain duplicated hard-coded `/api/v1`
   construction instead of one API URL builder.
3. `validators/starter-validator.js` applies website normalization during name
   length validation.
4. `validators/slug-validator.js` does not reserve every current top-level route.
5. Login role routing handles `super_admin` and `cv_specialist`, but not every
   approved internal role.
6. `tests/local-stack.test.js` imports missing `../../tools/local-stack.mjs`.

## Incomplete locked frontend scope

- Complete edit/reorder workflow for social links and catalog items.
- Editor controls for Maps, logo, and WhatsApp fields already supported by the
  presentation contract.
- True unsaved-form live preview on design/editor flow.
- Remaining admin plan/payment/theme/activity/QR operations where required by
  approved frontend scope and available backend API.
- Role-specific routing for resume quality reviewer/service administrator.

## Reintegration phase status

| Phase | Status |
|---|---|
| 1. Human decisions | Complete |
| 2. Deployment safety | Complete |
| 3. Legacy quarantine | Complete |
| 4. Canonical frontend SOT | Complete |
| 5. Security/runtime remediation | Pending instruction |
| 6. Product-rule reconciliation | Pending |
| 7. Remaining frontend implementation | Pending |
| 8. Duplication/orphan cleanup | Pending |
| 9. Documentation synchronization | Pending |
| 10. Final validation/readiness report | Pending |

## Validation note

`npm run build` passes. All 103 tests that do not depend on the missing monorepo
helper pass. Full `npm test` reports only `tests/local-stack.test.js` as failed.
No live Vercel deployment, external API mutation, or server cleanup was performed
during SOT reintegration.
