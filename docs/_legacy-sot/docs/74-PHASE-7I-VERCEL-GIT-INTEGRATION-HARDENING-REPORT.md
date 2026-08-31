# Phase 7I Vercel Git Integration Hardening Report

Status: RETIRED AS AN ACTIVE DEPLOYMENT PATH ON 2026-07-22 — HISTORICAL EVIDENCE ONLY

The product owner cancelled Vercel for frontend checking/deployment after Phase 8E. The repository no longer carries the Vercel deployment configuration described below.

Date: 2026-07-19
Status: IN PROGRESS — GIT DEPLOY SETTINGS HARDENED

## Scope

Phase 7I hardens the Vercel Git integration path after confirming the frontend should remain inside the `frontend/` directory.

Included:

- Confirm Vercel project root-directory expectation.
- Avoid moving `frontend/index.html` to repository root.
- Add static build no-op scripts so Vercel Git deployments do not fail when a build command is configured.
- Record safe Vercel settings for Git-based preview deployments.
- Keep active temporary tunnel URLs out of tracked files.

Excluded:

- Production promotion.
- Custom domain cutover.
- Stable backend hosting.
- Live Midtrans or SMTP credentials.
- Moving frontend files to repository root.

## Findings

| Area | Finding |
|---|---|
| Frontend location | `frontend/index.html` is the correct static entrypoint. |
| Vercel Root Directory | The active Git project `krtnmdgtlv2` is configured with Root Directory `frontend`. |
| Build command risk | Frontend is static and previously had no `build` or `vercel-build` script, so default Git build behavior could fail. |
| Local Vercel link | The local CLI link can become stale after project recreation/rename; relink to `krtnmdgtlv2` before CLI deploys. |
| API rewrite | `frontend/vercel.json` must stay sanitized in Git. Temporary tunnel origins are deployment-time only. |

## Remote Vercel project settings

The active project was updated through Vercel CLI:

| Setting | Value |
|---|---|
| Project | `krtnmdgtlv2` |
| Root Directory | `frontend` |
| Framework | Other/static |
| Install Command | `npm install` |
| Build Command | `npm run vercel-build` |
| Output Directory | `.` |

## Repository hardening

`frontend/package.json` now includes:

- `build`: no-op static build script.
- `vercel-build`: no-op Vercel build script.

This keeps Git integration resilient if Vercel runs a build command, while preserving the current HTML/Tailwind CDN/Vanilla JS architecture.

`frontend/.gitignore` now explicitly ignores:

- `.vercel`
- `.env*`

This keeps local Vercel link metadata and OIDC/environment files out of Git.

The local Vercel CLI link was refreshed to:

```text
phoenikz-s-projects/krtnmdgtlv2
```

## Correct deployment rule

Do not move files from `frontend/` to repository root.

Use one of these paths:

1. Git integration: Vercel project root directory is `frontend`.
2. CLI preview: run Vercel commands from `frontend/`, linked to project `krtnmdgtlv2`.

## Current gate

Gate result: VERCEL GIT INTEGRATION HARDENED FOR STATIC FRONTEND.

Next recommended action:

- Run a Git-triggered preview deployment or Vercel redeploy from the `krtnmdgtlv2` project, then smoke test static root and `/api/v1/health` with a valid backend staging origin.
