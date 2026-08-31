# Phase 7C Vercel Preview Preflight Report

Status: RETIRED AS AN ACTIVE DEPLOYMENT PATH ON 2026-07-22 — HISTORICAL EVIDENCE ONLY

The product owner cancelled Vercel for frontend checking/deployment after Phase 8E. The results below remain only as historical QA evidence.

Date: 2026-07-19
Status: ACCEPTED — PUBLIC PREVIEW ACCESS UNBLOCKED

## Scope

Phase 7C prepares the actual Vercel frontend preview path selected in Phase 7B.

Included:

- Verify the active Vercel config scaffold.
- Add Vercel schema metadata to `frontend/vercel.json`.
- Add a safe backend staging environment template.
- Record the remaining inputs required before preview deployment.

Excluded:

- Vercel deployment.
- Vercel project linking.
- Backend staging/tunnel creation.
- Live SMTP/Midtrans execution.
- Git commit or push.

## Preflight findings

| Check | Result |
|---|---|
| `frontend/vercel.json` exists | PASS |
| Vercel rewrite configured for `/api/v1/:path*` | PASS |
| Backend rewrite target is real | PASS during local preflight; active tunnel URL sanitized before Git push |
| Tunnel health endpoint | PASS — `/api/v1/health` returned 200, staging, database available |
| Vercel CLI available through `npx` | PASS — Vercel CLI 56.3.2 |
| Vercel login | PASS — device login completed |
| Vercel project link `.vercel/` exists | PASS — ignored by Git |
| Explicit preview deployment | PASS — `https://frontend-6m31framt-phoenikz-s-projects.vercel.app` |
| Preview public access | PASS — `200` without Vercel CLI bypass after SSO protection disabled |
| Preview API rewrite access | PASS — `/api/v1/health` returned backend `200` through Vercel rewrite |

## Prepared files

- `frontend/vercel.json`
- `backend/.env.staging.example`
- `docs/70-PHASE-7C-VERCEL-PREVIEW-PREFLIGHT-REPORT.md`

## Active deployment evidence

Vercel project:

```text
phoenikz-s-projects/frontend
```

Initial CLI deployment:

```text
https://frontend-gl7ddufna-phoenikz-s-projects.vercel.app
```

Note:

- The initial `vercel --yes` command created a Vercel deployment reported as `target: production` because the project had no Git preview context yet.
- No custom domain or KartunamaDigital production domain was attached.
- This deployment also redirects to Vercel SSO protection.

Preview deployment:

```text
https://frontend-6m31framt-phoenikz-s-projects.vercel.app
```

Protected smoke deployment:

```text
https://frontend-3hzgksgvo-phoenikz-s-projects.vercel.app
```

Inspect URL:

```text
https://vercel.com/phoenikz-s-projects/frontend/2XbMDXpc1ziGzgvHxc7TSBBFMDWS
```

Vercel inspect result:

- Deployment ID: `dpl_2XbMDXpc1ziGzgvHxc7TSBBFMDWS`
- Target: preview
- Status: Ready

Access result:

- `GET /` returned `302` to Vercel SSO.
- `GET /api/v1/health` returned `302` to Vercel SSO before reaching the backend rewrite.
- `vercel curl /` against the protected smoke deployment returned `200`.
- `vercel curl /api/v1/health` against the protected smoke deployment returned backend `200` with staging database available.

Conclusion:

- Frontend preview deployment exists and is ready.
- Protected smoke testing passes through Vercel's bypass-aware CLI.
- Public/manual browser UAT is now unblocked for the active preview URL.

## Public access evidence

Active public preview:

```text
https://frontend-3hzgksgvo-phoenikz-s-projects.vercel.app
```

Evidence:

- `curl -I /` returned `HTTP/2 200`.
- `curl -i /api/v1/health` returned `HTTP/2 200`.
- Health body returned `environment: staging` and `database: available`.
- Vercel project protection readback returned `ssoProtection: null`.

## Required inputs before deployment

The selected backend path is now HTTPS tunnel for backend local.

Active tunnel:

```text
Temporary Cloudflare Tunnel URL verified during Phase 7C; sanitized before Git push.
```

Tunnel target:

```text
http://127.0.0.1:3000
```

Before deployment, provide or create:

- A temporary HTTPS tunnel URL for local backend UAT, for example:

```text
https://<temporary-tunnel-domain>
```

- A working local backend on `http://127.0.0.1:3000`.
- A tunnel tool such as Cloudflare Tunnel, ngrok, or localtunnel.

Current preflight result:

- `cloudflared` is available and running a temporary quick tunnel.
- Local backend is running on port 3000 with ephemeral staging environment variables.
- Temporary MariaDB is running via Unix socket under `/private/tmp`.
- Database migrations and seeders completed.
- JWT keys under `backend/storage/private/` were generated and are ignored by Git.
- No root `.env` file was written; runtime values were supplied through process environment.

Then replace this placeholder in `frontend/vercel.json`:

```text
https://backend-staging.example.test
```

## Recommended preview route

Keep frontend API base as:

```text
/api/v1
```

and let Vercel rewrite proxy API calls to the backend staging/tunnel URL. This keeps the browser-facing path same-origin for the static preview.

## Cookie mode notes

Same-origin rewrite mode:

- `COOKIE_SECURE=true` for HTTPS preview/staging.
- `COOKIE_SAMESITE=Lax` is acceptable because the browser sees `/api/v1` as same-site on the preview origin.
- `CORS_ALLOWED_ORIGINS` can remain empty.

Direct cross-origin API mode:

- `COOKIE_SECURE=true`.
- `COOKIE_SAMESITE=None`.
- `CORS_ALLOWED_ORIGINS=https://<exact-vercel-preview-origin>`.
- Never use wildcard credentialed CORS.

## Phase gate

Gate result: ACCEPTED BY PRODUCT OWNER.

Remaining manual gates:

- Execute browser/device UAT checklist.
- Re-enable Vercel protection after UAT if public access is no longer needed.
