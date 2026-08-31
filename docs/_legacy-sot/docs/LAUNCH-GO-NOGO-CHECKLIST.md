# Launch Go/No-Go Checklist

## How to use
- Check each item after verified, not assumed.
- If any **Blocking** item is incomplete, status is **NO-GO**.
- If all **Blocking** items are complete and **High** items have mitigations, status is **GO with controlled rollout**.
- Keep evidence links/screenshots in `qa/LAUNCH-CHECK-EVIDENCE.md`.

---

## 1) SEO & public card integrity
Status: `pending`

-[ ] Every public card exposes a **per-slug canonical URL** (not `/`).
- Evidence: `frontend/public-card/index.html` + `frontend/pages/public/card.js` show exact `location.pathname`-derived canonical.
- Verify with 3 random slugs: `/aBcDeFg`, `/test-slug-123`, `/Pro`.

-[ ] Invalid slugs return safe `noindex` not-found state; correct slugs return `index, follow`.
- Evidence: 404 path renders `noindex, nofollow`; 200 path preserves indexing meta.

-[ ] Public card OG/twitter metadata reflects actual card data (name/title), not generic home.
- Evidence: Inspect rendered `<head>` for 1 active card.

---

## 2) Billing & payment clarity
Status: `pending`

-[ ] Pending Midtrans payment shows **“Menunggu verifikasi server…”** state explicitly.
- Evidence: `frontend/pages/app/billing.js` renders pending state before/after redirect.

-[ ] User cannot interpret “pending” as active entitlement.
- Evidence: UI text + CTA clearly states activation only after verified backend event.

-[ ] Reconcile/refresh action exists and is reachable from billing history.
- Evidence: Button visible in payment history list.

---

## 3) Destructive-action safety
Status: `pending`

-[ ] Delete social link requires confirmation before API call.
- Evidence: `window.confirm` or modal before `contentService.deleteSocial(...)`.

-[ ] Delete catalog item requires confirmation before API call.
- Evidence: same as above for catalog delete.

-[ ] Admin intervention requires confirmation + reason field (already implemented).
- Evidence: `frontend/pages/admin/super-admin-workspace.js` confirmation + reason.

---

## 4) Error/empty states & retry paths
Status: `pending`

-[ ] Public card loading/error/retry UX is explicit.
- Evidence: retry button / refresh action visible on network failure.

-[ ] App pages show actionable empty states (not blank).
- Evidence: dashboard, billing, social, catalog each render empty-state message + CTA.

-[ ] Form status messages use accessible live region and are not timed-out silently.
- Evidence: `[data-form-status]` updates without `setTimeout` removal.

---

## 5) Admin surface readiness
Status: `pending`

-[ ] `/admin/*` is unreachable without authorized role.
- Backend: every admin route asserts `resume_service_admin` / `super_admin` as applicable.
- Frontend: unauthorized users see redirect message, not raw data.

-[ ] Sensitive columns are masked in admin tables.
- Evidence: no OTP, reset token, SMTP password, raw vCard body in rendered tables.

-[ ] Admin pages render empty state (not blank) when data is zero.
- Evidence: at least 1 admin list view shows “Belum ada data.”

---

## 6) Cookie consent & legal pages
Status: `pending`

-[ ] Cookie consent banner is implemented before non-essential storage access.
- Evidence: banner + storage gating in JS; preference stored only after consent.

-[ ] Legal pages are reachable and contain current template placeholders.
- Pages: `/about/`, `/contact/`, `/faq/`, `/privacy/`, `/cookies/`, `/terms/`, `/refund/`, blog articles.
- Evidence: 200 OK + updated year/template variables.

-[ ] No hardcoded placeholder remains (e.g., `xxx`, `TBD`, `TODO`, `2025` outdated).
- Evidence: grep across `frontend/*/index.html`.

---

## 7) Authentication & security hardening
Status: `pending`

-[ ] Login/register/verify/reset flows end-to-end verified in staging.
- Evidence: recorded successful + failed cases (invalid OTP, expired reset, wrong password).

-[ ] CSRF cookies are present and echoed on unsafe requests.
- Evidence: Network tab shows `X-CSRF-Token` header for POST/PUT/PATCH/DELETE.

-[ ] No sensitive value stored in `localStorage` / `sessionStorage`.
- Evidence: `frontend/tests/static-security.test.js` passes; manual Storage inspector empty.

-[ ] Password reset email delivers without plaintext token in durable outbox.
- Evidence: backend worker + mail-outbox record excludes token after claim.

---

## 8) Email deliverability
Status: `pending`

-[ ] SMTP TLS handshake succeeds for `mail.kartunamadigital.id`.
- Evidence: `backend/scripts/smtp-verify.ts` green run.

-[ ] OTP email arrives within 60s during staging test.
- Evidence: timestamped send/receive log.

-[ ] Retry worker handles failed non-OTP mail without duplicate sends.
- Evidence: worker idempotency test or manual replay.

---

## 9) Payment gateway sandbox gate
Status: `pending`

-[ ] Midtrans sandbox returns Snap token + redirect URL.
- Evidence: successful `paymentService.checkout('basic')` response.

-[ ] Webhook endpoint accepts sandbox notification and activates subscription.
- Evidence: server log + DB subscription `endsAt` updated after webhook.

-[ ] Payment history persists immutable plan/price/duration snapshot.
- Evidence: row includes `plan_snapshot` fields unchanged after plan rename.

---

## 10) Database & migration hygiene
Status: `pending`

-[ ] Migration runner applies cleanly on empty DB.
- Evidence: fresh MariaDB + `backend/scripts/migrate.ts` green.

-[ ] Seed data matches locked spec (plans, themes, plan_theme_access).
- Evidence: `backend/tests/Unit/migration.test.ts` + manual count.

-[ ] Backup job exists and restore tested on staging.
- Evidence: recent dump + restore log under `deploy/shared-hosting/`.

---

## 11) Backend runtime & hosting gates
Status: `pending`

-[ ] Node.js 22 LTS active and `node --version` is within `>=22.18 <23`.
- Evidence: runtime check on target host.

-[ ] Hosting preflight passes.
- Evidence: `backend/scripts/hosting-preflight.ts` returns green.

-[ ] HTTPS origin enforced; HTTP redirects to HTTPS.
- Evidence: staging URL redirect + padlock on browser.

-[ ] `BACKEND_API_BASE_URL` points to stable HTTPS origin (no `localhost`, no `*.trycloudflare.com`).
- Evidence: backend environment + frontend proxy config.

---

## 12) Frontend performance & production hardening
Status: `pending`

-[ ] Landing and public pages render without CDN dependency failures (optional: compiled CSS).
- Evidence: offline/staging load test.

-[ ] Critical CSS path < 100KB first paint on mobile 4G simulation.
- Evidence: Lighthouse or similar.

-[ ] Images/PNG previews use lazy loading or are deferred.
- Evidence: `loading="lazy"` present on theme previews.

---

## 13) Accessibility & mobile UX
Status: `pending`

-[ ] Skip-link present and focused on Tab from top.
- Evidence: manual keyboard check.

-[ ] App shell mobile menu opens/closes with Escape + focus trap/return.
- Evidence: `frontend/components/app-shell.js` behavior verified.

-[ ] Form fields have associated labels/errors; no placeholder-only inputs.
- Evidence: HTML input + `aria-describedby` or visible label.

-[ ] Touch target size >= 44x44px for primary actions.
- Evidence: inspection or screenshots on mobile viewport.

---

## 14) Monitoring & rollback readiness
Status: `pending`

-[ ] Health endpoint returns 200 with DB check.
- Evidence: `curl /api/v1/health` green.

-[ ] Request logging includes `request_id`, route, method, status, duration.
- Evidence: sample log line.

-[ ] Rollback plan documented:
  - previous backend artifact/frontend tag,
  - DB backup timestamp,
  - revert DNS/routing steps.
- Evidence: 1-page runbook in `deploy/` or incident docs.

---

## 15) Final go/no-go decision
Status: `pending`

-[ ] All **Blocking** items marked `complete`.
-[ ] All **High** items have `complete` or `mitigated with date`.
-[ ] Staging smoke test passed end-to-end: register → verify → create/edit → publish → public card → QR/VCF download → billing checkout → admin view.

### Decision
- GO (controlled rollout): `__________`
- NO-GO: `__________`

### Notes & exceptions
-
-

### Sign-off
- Product Owner: `__________` Date: `__________`
- Tech Lead: `__________` Date: `__________`
- QA: `__________` Date: `__________`
