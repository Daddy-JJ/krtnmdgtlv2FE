# Phase 8E Vercel Retirement and Deployment Recheck

Date: 2026-07-22
Status: COMPLETE — VERCEL-SPECIFIC ACTIVE DEPLOYMENT SETUP RETIRED

## Decision

The product owner cancelled Vercel as the frontend checking/deployment path. Phase 8F must not depend on a Vercel project, Vercel rewrite, Vercel CLI link, or Vercel-specific build command.

Historical Phase 7 reports and evidence remain in the repository as an audit trail. They are not active deployment instructions.

## Removed active setup

| Item | Result |
|---|---|
| `frontend/vercel.json` | Removed |
| `frontend/.vercel/` local project link | Removed |
| `vercel-build` npm script | Removed |
| Vercel URLs in active backend environment templates | Replaced with project staging/production domains |
| Vercel handoff in Phase 8 runbooks | Replaced with shared-hosting static frontend/API routing |
| Vercel-specific CORS unit-test naming/fixture | Replaced with a generic exact frontend origin |

The generic `frontend/config/runtime-config.js` remains because it is a deployment-neutral API base override and defaults to same-origin `/api/v1`.

## Replacement frontend check path

Until shared hosting is ready:

1. Run frontend automated tests locally.
2. Serve `frontend/` through a local static HTTP server for browser layout checks.
3. Use local Node.js/MariaDB for integrated development smoke when needed.

For shared-hosting staging:

1. Publish the static contents of `frontend/` to the provider-approved staging document root.
2. Register the Node.js 24 backend through cPanel Application Manager/Passenger.
3. Prefer a single HTTPS frontend origin with provider-supported `/api/v1/*` routing to the Node application.
4. If only a separate API subdomain is possible, do not deploy authentication flows until exact CORS, cookie-domain, SameSite, and CSRF-cookie behavior is reviewed and tested.

## Active target placeholders

| Purpose | Value |
|---|---|
| Staging frontend/canonical origin | `https://staging.kartunamadigital.id` |
| Staging direct backend health origin | `https://api-staging.kartunamadigital.id` when required by provider topology |
| Production frontend/canonical origin | `https://kartunamadigital.id` |

These are non-secret planning values. DNS and cPanel routing have not been changed.

## Remaining Phase 8F gates

- Provider confirms Node.js `v24.18.0`; effective application-environment output remains required.
- Provider/cPanel confirms how one frontend origin routes `/api/v1/*` to Passenger.
- Static document root and Node application root are separate and non-public where required.
- MariaDB database/user uses `utf8mb4` with a backup/restore route.
- Cron can invoke the same Node.js 24 application environment.

## Gate

Gate result: PHASE 8E DEPLOYMENT-PATH RECHECK COMPLETE.

Phase 8F is approved for hosting preflight. Live execution remains blocked until effective runtime and provider routing evidence are available.
