# Full Application Audit and Go-Live Readiness

Tanggal audit: 2026-08-14
Scope: frontend, backend source-of-truth, database/migrations, OpenAPI, deployment mirror `kartu-api`, dan deployment publik.

## A. Executive summary

**Keputusan: NOT READY.** Risiko keseluruhan: **tinggi**.

Codebase memiliki fondasi keamanan yang cukup baik: cookie auth, rotating refresh token, session-bound CSRF, prepared SQL, server-verified payment, ownership checks, file signature validation, security headers API, dan test kontrak yang luas. Namun, production belum boleh menerima user baru sampai SMTP benar-benar lolos dan flow registrasi/reset password diuji end-to-end. Drift role/RBAC dan gap admin mail outbox sudah diperbaiki secara lokal, tetapi production masih melaporkan environment `staging`, katalog plan production berisi harga nol, dan deployment/migrasi perubahan ini belum diverifikasi.

Jumlah temuan/gap yang dilacak:

| Severity | Jumlah | Terverifikasi selesai | Open/blocked |
|---|---:|---:|---:|
| P0 | 1 | 0 | 1 |
| P1 | 5 | 2 | 3 |
| P2 | 6 | 3 | 3 |
| P3 | 2 | 1 | 1 |

## Evidence baseline

- Frontend: `98/98` test lulus setelah perbaikan.
- Backend source-of-truth: `121` lulus, `1` database integration test di-skip; typecheck lulus.
- Deployment mirror: `121` lulus, `1` database integration test di-skip; typecheck lulus.
- `npm audit`: frontend, backend, dan mirror masing-masing `0` vulnerability pada seluruh severity.
- Static local-link scan: 67 HTML shells termasuk template; tidak ditemukan referensi file lokal yang hilang.
- Secret scan: tidak ditemukan private key atau production credential yang ter-commit. Nilai test fixture tidak dianggap secret.
- Production API `/api/v1/health`: HTTP 200, database available, tetapi environment `staging`.
- Production CORS preflight: origin exact `https://kartunamadigital.id`, credentials aktif, tidak wildcard.
- Protected production endpoints yang dites tanpa sesi mengembalikan 401.
- Production `/api/v1/plans`: Starter, Basic, dan Pro mengembalikan `price=0`.
- Bukti SMTP terakhir dari hosting yang diberikan owner: `{"smtp":"unavailable"}`. Belum ada bukti pengujian sukses setelahnya.
- Browser visual runtime tidak tersedia dalam environment audit, sehingga responsive/visual E2E tidak ditandai PASS.

## B. Critical findings

| ID | Area | Bug/gap | Severity | Root cause | Status |
|---|---|---|---|---|---|
| AUD-001 | Email/onboarding | SMTP production belum terbukti tersedia; registration verification dan forgot-password tidak dapat dinyatakan bekerja | P0 | Kredensial/transport SMTP hosting belum lolos `mail:verify`; worker sebelumnya memproses 0 job | BLOCKED |
| AUD-002 | Production config | Host production melaporkan `APP_ENV=staging` | P1 | Environment hosting belum dipromosikan dan tervalidasi sebagai production | OPEN |
| AUD-003 | Plan data | Katalog plan production menyimpan harga Basic/Pro nol | P1 | Data konfigurasi plan production belum dikonfigurasi; checkout memakai matriks transition fee locked sehingga kontrak katalog dan billing dapat membingungkan | OPEN |
| AUD-004 | API/admin email | `/admin/mail/outbox` dan retry sebelumnya hanya tercantum di OpenAPI | P1 | Implementasi operasional email tidak diselesaikan bersama kontraknya | FIXED lokal — deploy pending |
| AUD-005 | RBAC | `GRANT_ROLE` sebelumnya hanya mengubah `user_roles`, sedangkan login/JWT/redirect memakai `users.role` | P1 | Dua sumber otoritas role berjalan paralel | FIXED lokal — migration/deploy pending |
| AUD-006 | UI verification | Audit visual seluruh route pada desktop/tablet/mobile belum dapat dieksekusi | P1 | Browser automation runtime tidak tersedia pada environment audit | BLOCKED |

## C. Bugs fixed

| ID | Root cause | Fix | Verification | Status |
|---|---|---|---|---|
| AUD-007 | Endpoint CSRF production hanya ada di deployment mirror, tidak di backend source-of-truth | Port `GET /auth/csrf` ke service/controller/router dan tambah contract test | Backend typecheck dan seluruh 118 test: 117 pass, 1 DB skip | VERIFIED |
| AUD-008 | `.env.example` mirror memakai nama env retired (`DB_USER`, `DB_NAME`, `CORS_ORIGIN`, bcrypt, symmetric JWT) dan backend tidak memiliki template lokal | Tambah template canonical backend; perbarui template mirror dan instruksi README | Environment key review + `git diff --check` + backend tests | VERIFIED |
| AUD-009 | Frontend production tidak mengirim header keamanan browser dasar | Tambah HSTS, nosniff, deny framing, referrer policy, dan permissions policy melalui guarded `.htaccess` | Contract test baru; frontend 97/97 pass | VERIFIED lokal; deploy pending |
| AUD-010 | Favicon duplikat tidak direferensikan | Hapus `assets/favicon copy.svg` | Reference scan hanya menunjuk `assets/favicon.svg` | FIXED |
| AUD-004 | Admin mail outbox belum memiliki implementation | Tambah list tersanitasi, retry failed-only dengan permission, recent auth, CSRF, confirmation, reason, transaction, dan immutable intervention; tambah halaman admin | Backend/frontend/mirror typecheck dan contract tests | VERIFIED lokal |
| AUD-005 | Otoritas role ganda | Jadikan active `user_roles` authority untuk login, refresh, `/me`, permissions, redirect; `users.role` hanya compatibility snapshot; tambah migration 007 | Backend/frontend/mirror contract tests | VERIFIED lokal; DB integration/deploy pending |

## D. UI/UX findings

### Terverifikasi dari source dan contract test

- Seluruh authenticated member shell memakai shared application shell.
- Admin memakai shared noindex shell; specialist workspace assignment-only.
- Loading, empty, error, disabled, success, dan form validation contract tersedia pada flow utama.
- Semua HTML memakai compiled CSS, bukan Tailwind Play CDN.
- Tidak ditemukan image tanpa `alt` pada static HTML atau link `_blank` tanpa `rel` pada static HTML.
- Tidak ditemukan unsafe DOM sink (`innerHTML`, `insertAdjacentHTML`, `eval`) pada source frontend utama.
- Tema menyimpan hanya preferensi visual non-sensitif di localStorage; token autentikasi tidak disimpan di browser storage.
- Typography cap dan inverse theme memiliki contract tests, termasuk landing editor dan auth CTA.

### Belum dapat dinyatakan PASS

- Pixel/visual regression seluruh 57 page shell pada desktop, tablet, dan mobile.
- Focus order, zoom 200%, screen-reader announcement, table horizontal behavior, dan real-device touch targets.
- CSP frontend. CSP belum ditambahkan karena JSON-LD masih inline; memaksa `script-src 'self'` sekarang akan memblok structured data. Migrasikan JSON-LD menjadi external resource atau gunakan hash sebelum mengaktifkan CSP ketat.

## E. Authentication and authorization

| Area | Evidence | Status |
|---|---|---|
| Password hashing | Versioned salted Node `scrypt`; downgrade/legacy hash fail closed | PASS |
| Login invalid/nonexistent | Dummy hash mengurangi timing enumeration; generic invalid credentials; rate limit persisted | PASS unit/contract |
| Unverified login | Ditolak 403 `EMAIL_NOT_VERIFIED` | PASS unit/contract |
| Access token | RS256 issuer/audience/session/expiry validation | PASS |
| Refresh | Rotating opaque token hash, one-use token, family revoke on invalid/reuse | PASS |
| CSRF | Token HMAC terikat session; unsafe API membutuhkan header + cookie/session | PASS |
| Cookie | Access/refresh HttpOnly; Secure production; explicit paths; readable CSRF cookie | PASS config/unit |
| Logout | Revoke refresh family, clear access/refresh/CSRF; production specialist logout telah dibuktikan owner | PASS untuk flow yang diuji |
| Registration | DB/OTP/error contracts lulus; real SMTP delivery belum lulus | BLOCKED |
| Forgot/reset | Generic forgot response, hashed reset token, one-use/expiry, revoke all sessions | PASS unit; E2E email BLOCKED |
| IDOR | Owner queries dan specialist assignment scope diuji; missing ownership menghasilkan non-enumerating 404 | PASS unit/contract |
| RBAC grants | Active `user_roles` menjadi authority; `/me` membawa roles/permissions; grant menyinkronkan snapshot legacy | PASS lokal; migration/deploy pending |

## F. Security

### PASS dalam scope source/test

- SQL aplikasi menggunakan `execute()` dengan parameters; migration/seed runner adalah pengecualian terkontrol untuk file SQL internal.
- Browser tidak mengirim role, tier, amount, duration, atau payment status sebagai otoritas.
- Payment activation hanya dari verified webhook/status backend.
- CORS production allowlist exact dan credentialed.
- API memakai Helmet, HSTS, no-sniff, framing policy, referrer policy, request ID, dan safe error envelope.
- Resume upload membatasi jumlah/ukuran, memeriksa signature PDF/DOCX, menolak macro/executable/EICAR fixture, dan menyimpan private path di server.
- No critical/high dependency advisories ditemukan.

### Remaining security/reliability debt

- Seluruh admin controller yang diperbaiki mengotorisasi permission dari active `user_roles`; JWT role hanya compatibility/UX claim dan bukan authority admin.
- Tidak ada bukti external alerting/error aggregation. JSON structured logs ada, tetapi retention, alert, dan uptime monitor belum dibuktikan (AUD-011, P2).
- CSP frontend belum aktif (P2 hardening).

## G. Routing and access matrix

Catatan: hosting statis secara normal mengembalikan HTML shell 200. Keamanan data tidak bergantung pada penyembunyian shell; JavaScript melakukan redirect UX dan API tetap menjadi enforcement authority.

### Frontend sitemap

| Route group | Routes | Expected access | Actual/evidence | Status |
|---|---|---|---|---|
| Marketing public | `/`, `/about/`, `/contact/`, `/faq/`, `/privacy/`, `/cookies/`, `/terms/`, `/refund/`, dua `/blog/.../` | Guest/all | HTTP/static contract; indexability matrix diuji | PASS |
| Public auth | `/login/`, `/register/`, `/verify-email/`, `/forgot-password/`, `/reset-password/` | Guest; active session diarahkan menurut role | Validator/redirect contract diuji; real email blocked | PARTIAL |
| Anonymous Starter | `/create/`, `/starter/manage/`, `/{slug}` via `/public-card/` | Guest dengan manage cookie untuk edit; card published public | Manage token HttpOnly, Starter CSRF, case-sensitive slug tests | PASS contract |
| Member core | `/app/`, `/app/account/`, `/app/feedback/`, `/app/billing/` | Authenticated member | Shared guard + protected API 401 without session | PASS contract |
| Member card | `/app/card/identity/`, `/contact/` legacy redirect, `/design/`, `/settings/`, `/social/`, `/catalog/` | Auth; feature gated by active tier | Backend entitlement/capability tests | PASS contract |
| Resume member | `/app/resume-enhancement/`, `/new/`, `/request/`, `/revision/` | Pro entitlement, one beneficiary/period | Backend entitlement/ownership/private-download tests | PASS contract |
| Specialist | `/specialist/`, `/specialist/request/` | `cv_specialist`, assigned requests only | UI contract + backend assignment and permission tests | PASS contract; RBAC grant drift remains |
| Super admin | `/admin/`, users/detail, subscriptions, usage, reports, settings, system, security, interventions, mail outbox, CV specialists/detail | Super admin/required permission | Noindex shared shell + protected API tests | PASS lokal; deploy pending |
| Resume operations admin | `/admin/resume-services/` plus queue, assigned, need-information, in-progress, quality-review, revisions, completed, retention, request | Operational roles by permission | Backend permission/status/assignment tests | PASS contract |
| Landing editor | `/admin/landing-content/` | Super admin | Required fresh session, reason, typed API, safe text-only rendering | PASS contract |

### Tier/role access matrix

| Feature | Guest | Starter member | Basic | Pro | CV specialist | Super admin |
|---|---:|---:|---:|---:|---:|---:|
| Marketing/public card | Yes | Yes | Yes | Yes | Yes | Yes |
| Anonymous Starter create/manage | Yes, manage cookie | Claim/manage | Claim/manage | Claim/manage | Independent | Independent |
| Member account/dashboard | No | Yes | Yes | Yes | Role-dependent | Role-dependent |
| Custom slug/maps | No | No | Yes | Yes | No by role alone | Permission/admin view only |
| Logo/social/catalog/WhatsApp | No | No | Limited by matrix | Yes | No by role alone | Permission/admin view only |
| Resume Enhancement request | No | No | No | Entitlement required | Assigned operations only | Oversight by permission |
| Admin API | No | No | No | No | No, except assigned resume APIs | Yes by permission |

### API coverage summary

- 74 OpenAPI paths were inventoried across health, auth, account, Starter, cards/content/media/rendering, plans/themes, payments/subscriptions, feedback, resume service, and admin.
- All implemented unsafe authenticated routes pass through session-bound CSRF in their controller/service boundary.
- All sampled protected production endpoints returned 401 without cookies.
- Dua admin mail paths sekarang diimplementasikan dan diselaraskan dengan OpenAPI; production verification menunggu deployment.

## H. Email

| Flow | Code/test evidence | Production delivery evidence | Status |
|---|---|---|---|
| Registration OTP | Server-owned subject/body, plaintext OTP only in send call, hashed OTP in DB, expiry/attempt/resend limits | Last `mail:verify` supplied by owner: unavailable | BLOCKED |
| Verification | One-use/expiry/attempt checks; user marked verified transactionally | Cannot complete without delivered OTP | BLOCKED E2E |
| Forgot password | Generic response; outbox contains no plaintext token | Worker previously processed 0 jobs and SMTP unavailable | BLOCKED E2E |
| Reset link | Generated only in worker memory, HTTPS APP_URL, persisted token hash only | No received production email evidence | BLOCKED E2E |
| Reset confirmation | No explicit password-changed confirmation implementation | None | OPEN/P2 |
| Resume notifications | Outbox retry/backoff and masked delivery log | No production delivery evidence | BLOCKED E2E |

## I. Performance and architecture

- No SQL-in-loop N+1 was found on user-facing hot paths. Plan feature assembly filters a small fixed three-plan catalog in memory.
- API client deduplicates refresh and CSRF bootstrap promises and applies request timeout.
- Payment history query is unpaginated and can grow without bound per user (AUD-012, P2).
- Several repositories/controllers/services are minified into one line, reducing reviewability and stack-trace usability (P3 maintainability).
- Resume operations/file services execute SQL directly through Pool rather than a repository boundary (AUD-013, P2 architecture debt).
- Admin dashboard aggregate queries need production `EXPLAIN`/slow-query evidence at realistic scale; current schema has relevant tests but no load evidence.

## J. Regression matrix

| Gate | Result |
|---|---|
| Frontend full contract suite | PASS — 98/98 |
| Backend typecheck | PASS |
| Backend unit/HTTP/security suite | PASS — 121 pass, 1 DB integration skipped |
| Deployment mirror baseline suite | PASS — 121 pass, 1 DB integration skipped |
| Dependency audit | PASS — 0 advisories |
| Local link/file integrity | PASS |
| Production health/database probe | PASS, but reports staging |
| Production unauthorized API checks | PASS for sampled protected routes |
| Production registration/email/reset | BLOCKED |
| Real database migration/seed integration in isolated test DB | BLOCKED by missing test DB credentials |
| Desktop/tablet/mobile visual regression | BLOCKED by missing browser runtime |
| Production build/static CSS contract | PASS locally; current owner UI changes remain uncommitted |

## K. Remaining actions, ordered

### P0 — before accepting new users

1. Configure valid production SMTP credentials and DNS (`SPF`, `DKIM`, `DMARC`), run `npm run mail:verify`, then execute a real mailbox registration + forgot/reset test.

### P1 — before go-live declaration

2. Set `APP_ENV=production`, retain `APP_URL=https://kartunamadigital.id`, exact CORS origins, secure parent-domain cookies, restart Passenger, and verify health reports production.
3. Set and review plan catalog prices in the production admin/database; verify public catalog wording and all three locked transition fees.
4. Deploy backend/mirror/frontend changes, run migration `007_rbac_authority_reconciliation.sql`, restart Passenger, lalu smoke-test login/redirect/permission untuk member, CV specialist, dan super admin.
5. Smoke-test admin mail outbox: list tidak boleh mengekspos raw recipient/body/payload; retry hanya untuk status failed dan harus menghasilkan audit intervention.
6. Run real-browser desktop/tablet/mobile audit on all route groups and record screenshots/failures.

### P2/P3 hardening

7. Deploy the new frontend `.htaccess`, then verify headers from the public hostname.
8. Add pagination/cursor to member payment history before volume grows.
9. Move resume SQL from service/file classes behind repositories and format minified modules.
10. Add uptime/error alerting and define log retention/redaction policy.
11. Run DB integration tests against an isolated schema and production-scale `EXPLAIN` checks.
12. Resolve D-050 documentation drift: the theme chooser was explicitly removed, but the decision log still describes it.

## Go-live decision

### NOT READY

Alasan utama: production email/new-user/reset flow belum terverifikasi, production masih berjalan sebagai staging, harga plan production belum valid, dan remediasi RBAC/mail outbox belum dideploy serta diuji pada database hosting. Status dapat berubah menjadi **GO-LIVE WITH CONDITIONS** hanya setelah P0 selesai, seluruh P1 diperbaiki atau memiliki mitigation yang disetujui dan diverifikasi, serta visual responsive audit memperoleh evidence.
