# Phase 8L — QA, security, backup, and rollback

Date: 2026-07-22
Last revalidated: 2026-07-28
Status: LOCAL CODE/SECURITY GATE COMPLETE — RELEASE MANIFEST AND HOSTING-SIDE REHEARSAL PENDING

## Automated results

| Gate | Result |
|---|---|
| Backend TypeScript | Pass |
| Backend default suite | 89 passed, 0 failed, 1 opt-in DB test skipped |
| Frontend suite | 64 passed, 0 failed |
| Backend dependency audit | 0 vulnerabilities |
| Frontend dependency audit | 0 vulnerabilities |
| OpenAPI YAML | Parsed |
| Three Postman JSON files | Parsed |
| Release-inventory secret scan | No active private/API key pattern found |
| Release manifest/checksum | Pass: 523 files; verifier 1,057/1,057 |

## 2026-07-28 audit remediation

| Finding | Resolution |
|---|---|
| Temporary Quick Tunnel hardcoded in Vercel routing | Removed. Same-origin API now uses a server-side, environment-configured proxy that accepts only a stable HTTPS origin and rejects localhost/Quick Tunnel targets fail-closed. |
| User-controlled external URLs bound directly to links | Resolved with HTTP(S), mail, and telephone protocol sanitizers in the shared renderer and public page. Backend strict HTTP(S) DTO validation was revalidated by its regression suite. |
| Two-line artwork clamp could hide complete contact values | Artwork remains adaptive; the public page now also provides an accessible expandable full-detail list with per-field copy actions and complete un-clamped text. |
| Runtime QR cache files could enter the worktree | QR runtime artifacts are ignored while the directory `.gitkeep` remains tracked. Both current cache PNG paths were verified as ignored. |

The remediation changes do not alter the REST contract or database schema, so
no OpenAPI update or migration is required.

The manifest generator now excludes runtime cache/log/upload artifacts and
Vercel-only deployment files from the shared-hosting release. The regenerated
checksums and inventory verifier both pass.

## Disposable MariaDB recovery rehearsal

1. Created an isolated MariaDB instance with networking disabled.
2. Applied the complete integration lifecycle; result 1 passed, 0 failed.
3. Created a transactional SQL backup.
4. Restored it into a separate empty database.
5. Verified both databases contain 21 tables including migration metadata.
6. Verified all 3 migration names/checksums match.
7. Verified seed counts match: 3 plans, 33 features, 10 themes, 14 theme-access rows.
8. Stopped the database and removed both dumps/data directories from temporary storage.

This proves the repository migration/backup/restore path locally. It does not replace a provider-side cPanel backup/restore drill because provider permissions, limits, and tooling may differ.

## Security result

No Critical/High local automated defect remains open. The Phase 8I CSRF cookie-path defect and Phase 8K reset-link/delivery-log drifts were fixed and regression-tested. Credentials remain HttpOnly; readable CSRF values cannot authenticate; payment activation remains server-verified; domain SQL remains prepared; release inventory excludes runtime secrets.

## Residual gates

- Shared-hosting effective runtime, Passenger, database, routing, TLS, and sanitized-log evidence.
- Real browser/device and Postman E2E UAT.
- SMTP inbox/cron delivery and Midtrans sandbox lifecycle.
- Provider-side backup/restore and release rollback rehearsal.
- Production CSP/performance review. The frontend now uses compiled CSS and no
  browser-side Tailwind CDN runtime.
