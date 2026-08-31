# Phase 7G UAT Runtime Stabilization Report

Date: 2026-07-19
Status: IN PROGRESS — FRESH TEMPORARY TUNNEL PREVIEW SMOKE PASSED

## Scope

Phase 7G stabilizes the environment path needed for longer manual/browser/device UAT after the Phase 7F drift fixes.

Included:

- Record runtime findings from Phase 7F.
- Define the reliable path for continuing browser/device UAT.
- Keep runtime secrets and temporary tunnel values out of tracked files.

Excluded:

- Production deployment.
- Custom domain cutover.
- Live Midtrans or live SMTP credentials.
- Git push.

## Current findings

| Area | Finding |
|---|---|
| Frontend preview | Vercel preview is public and serves static routes. |
| API rewrite | Rewrite path works when the backend tunnel is connected to a running backend. |
| Backend local/staging | One-shot local staging smoke with the same temporary MariaDB passed after Phase 7F fixes. |
| Tunnel reliability | The temporary Cloudflare Tunnel can return `502` when local backend process is not running or the origin refuses connection. |
| Fresh temporary path | Fresh MariaDB, backend, tunnel, and Vercel preview smoke passed for immediate manual UAT. |
| Manual device UAT | Ready while current backend and tunnel sessions remain running. |

## Fresh temporary tunnel evidence

Fresh preview:

```text
https://frontend-ifqw75s1v-phoenikz-s-projects.vercel.app
```

Evidence:

- Preview root returned `HTTP/2 200`.
- `/api/v1/health` returned `HTTP/2 200`, `environment: staging`, and `database: available`.
- `/api/v1/plans` returned `HTTP/2 200` with Starter, Basic, and Pro.
- Starter create returned `201`.
- New Starter canonical URL uses the fresh preview origin.
- Starter public card returned `200`.
- Starter QR returned `200` with `image/png`.
- Local `frontend/vercel.json` was sanitized back to a placeholder rewrite target after deployment.

## Recommended continuation path

Preferred path:

1. Use a stable backend staging host with HTTPS.
2. Configure frontend preview rewrite to that stable backend origin.
3. Run browser/device UAT against the preview URL.
4. Re-enable Vercel preview protection when public UAT is done.

Acceptable temporary path:

1. Start local MariaDB staging database.
2. Run backend with `APP_URL` set to the exact Vercel preview origin.
3. Start a fresh Cloudflare Tunnel to `http://127.0.0.1:3000`.
4. Deploy a fresh Vercel preview with the active tunnel URL in runtime config only.
5. Sanitize `frontend/vercel.json` before any Git checkpoint.

## Phase 7F checkpoint

Local Git checkpoint:

```text
ec515bd Checkpoint Phase 7F UAT drift fixes
```

This checkpoint is local only unless a separate push is explicitly requested.

## Security notes

- Do not commit active temporary Cloudflare Tunnel domains.
- Do not commit `.env`, `.vercel`, cookies, OTPs, manage tokens, JWT keys, SMTP credentials, Midtrans keys, or generated QR cache files.
- Same-origin rewrite mode can keep `COOKIE_SAMESITE=Lax`.
- Direct cross-origin API mode requires exact CORS allowlist and `COOKIE_SAMESITE=None`.

## Phase gate

Gate result: FRESH TEMPORARY TUNNEL PATH READY FOR IMMEDIATE MANUAL UAT.

Next recommended action:

- Choose whether to continue with a fresh temporary tunnel or prepare a stable backend staging host.
