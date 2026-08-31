# Phase 7B Vercel Frontend Preview + Backend Local/Staging Gate

Status: RETIRED AS AN ACTIVE DEPLOYMENT PATH ON 2026-07-22 — HISTORICAL EVIDENCE ONLY

The product owner cancelled Vercel for frontend checking/deployment after Phase 8E. Do not use this historical report as the current deployment runbook.

Date: 2026-07-19
Status: PREPARED — PENDING TARGET URL INPUT AND MANUAL EXECUTION

## Target choice

Selected target:

- Frontend: Vercel preview from the `frontend/` directory.
- Backend: local/staging Node.js + Express API.

## Recommended path

Use a same-origin preview proxy:

```text
Browser -> https://<vercel-preview>/api/v1/* -> backend staging/tunnel /api/v1/*
```

Why:

- The application uses HttpOnly cookies plus CSRF.
- Same-origin `/api/v1` keeps browser cookie behavior simpler.
- The frontend default `apiBaseUrl` remains `/api/v1`.
- No access/refresh/Starter manage token is exposed to JavaScript or Vercel environment variables.

Required edit before preview:

- Replace `https://backend-staging.example.test` in `frontend/vercel.json` with the actual HTTPS backend staging or HTTPS tunnel URL.

## Backend local caveat

Vercel preview cannot call a private `http://localhost:3000` backend from another user's browser. For local backend testing with Vercel preview, expose backend through a temporary HTTPS tunnel or use a staging server.

Do not use production secrets for this tunnel.

## Fallback direct cross-origin API mode

If the frontend calls the backend staging domain directly through `frontend/config/runtime-config.js`, configure backend:

```text
CORS_ALLOWED_ORIGINS=https://<vercel-preview-domain>
COOKIE_SAMESITE=None
COOKIE_SECURE=true
APP_URL=https://<vercel-preview-domain>
```

Rules:

- Never use wildcard CORS with credentials.
- Only allow the exact Vercel preview/staging frontend origin.
- Cross-site cookies require HTTPS and `SameSite=None; Secure`.
- `APP_URL` remains the public frontend origin because it generates canonical card and user-facing links; it is not the API origin.
- Backend `http://localhost` is not suitable for full cookie-auth UAT from Vercel preview.

## Files prepared

- `frontend/vercel.json`
- `frontend/config/runtime-config.js`
- `backend/src/app.ts`
- `backend/src/config/environment.ts`
- `.env.example`

## Manual preview checklist

- [ ] Replace Vercel rewrite destination with actual HTTPS backend staging/tunnel URL.
- [ ] Confirm frontend still uses `/api/v1` default API base.
- [ ] Configure backend `.env` for staging.
- [ ] Run backend migration/seed on staging database.
- [ ] Start backend staging and verify `/api/v1/health`.
- [ ] Deploy Vercel preview from `frontend/`.
- [ ] Run Postman against backend staging `baseUrl`.
- [ ] Run browser UAT from Vercel preview.
- [ ] Confirm cookies are set without exposing auth tokens in response JSON or localStorage.

## Phase gate

Gate result: READY FOR TARGET URL INPUT AND MANUAL PREVIEW EXECUTION.
