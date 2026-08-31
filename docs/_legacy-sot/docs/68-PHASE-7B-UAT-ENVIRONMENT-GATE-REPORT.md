# Phase 7B Manual UAT/Environment Gate Report

Date: 2026-07-19
Status: ACCEPTED

## Scope

Phase 7B prepares the manual UAT and environment readiness evidence gate after Phase 7A automated release readiness was accepted.

Included:

- Correct stale release status notes that could mislead UAT/deployment planning.
- Expand UAT checklist into environment readiness, browser/device, and sign-off gates.
- Add a sanitized manual evidence log template.
- Preserve the no-secret evidence rule.
- Prepare the selected Vercel frontend preview + backend local/staging setup path.

Excluded:

- Live SMTP execution.
- Midtrans sandbox/production transaction execution.
- Production, Vercel, cPanel, or VPS deployment.
- Database backup restore execution.
- Git commit or push.

## Files changed

- `STATUS.md`
- `docs/24-UAT-CHECKLIST.md`
- `qa/README.md`
- `qa/UAT-EVIDENCE-LOG.md`
- `CHANGELOG.md`
- `FILE-INDEX.md`
- `tools/generate-manifest.mjs`
- `frontend/config/runtime-config.js`
- `frontend/vercel.json`
- `backend/src/app.ts`
- `backend/src/config/environment.ts`
- `backend/src/server.ts`
- `.env.example`
- `backend/tests/Unit/environment.test.ts`
- `backend/tests/Unit/http.test.ts`
- `docs/69-PHASE-7B-VERCEL-FRONTEND-BACKEND-STAGING-GATE.md`

## Selected environment path

The selected path is Vercel frontend preview plus backend local/staging.

Recommended execution:

- Use Vercel same-origin rewrite `/api/v1/*` to an HTTPS backend staging/tunnel URL.
- Keep frontend `apiBaseUrl` as `/api/v1`.
- Replace the placeholder backend URL in `frontend/vercel.json` before manual preview deploy.
- Use `CORS_ALLOWED_ORIGINS` only as a fallback when the frontend calls the backend staging domain directly.

Important caveat:

- A private `http://localhost:3000` backend cannot be reached by a public Vercel preview browser. Use staging or an HTTPS tunnel for local backend UAT.

## Automated evidence

| Check | Result |
|---|---|
| `npm --prefix backend run typecheck` | PASS |
| `npm --prefix backend test` | PASS — 76 passed, 0 failed, 1 skipped |
| `npm --prefix frontend test` | PASS — 30 passed, 0 failed |
| `frontend/vercel.json` parse | PASS |
| Postman collection JSON parse | PASS |

## Manual gates still requiring execution

- Browser/device UAT on Chrome desktop, Safari desktop, Android Chrome, and iPhone Safari.
- Keyboard/focus pass.
- QR scan and VCF import on target devices.
- Live SMTP OTP/reset inbox verification.
- Midtrans sandbox checkout/webhook/reconcile verification.
- Target hosting validation for Vercel/static frontend and backend runtime target.
- Backup restore drill.

## Phase gate

Gate result: ACCEPTED BY PRODUCT OWNER.
