# Decision Log

- D-001: Positioning = Digital Identity Platform.
- D-002: Tier = Starter, Basic, Pro.
- D-003: Core identity includes Name, Job Title, Organization.
- D-004: Core contact maps to VCF; marketing stays web-only.
- D-005: Modular monolith, not microservices.
- D-006: Starter editing uses hash-only manage token; slug cannot authorize.
- D-007: Auth token not in localStorage; Secure HttpOnly cookie strategy.
- D-008: Subscription requires verified idempotent server-side payment event.
- D-009: HTML + Tailwind Play CDN + Vanilla JS; production may compile CSS for hardening.
- D-010: No feature additions before MVP completion.
- D-011: Satu akun memiliki satu kartu aktif pada MVP agar billing dan limit konsisten.

- D-012: QR is rendered self-hosted through an internal adapter. The original Endroid implementation choice is superseded by D-036 after CR-002.
- D-013: QR contains the canonical URL only and is cached as a derived artifact.

## D-014 — Root public URL

Public card URL uses `https://kartunamadigital.id/{slug}` without `/c/`.

## D-015 — Starter random slug

Starter uses an immutable, backend-generated, exactly seven-character, case-sensitive alphabetic code using lowercase and uppercase letters.

## D-016 — Basic/Pro custom slug suggestion

Basic and Pro can edit their custom slug. The default suggestion uses the first two letters of the first name plus normalized mobile phone digits. The UI must warn that this exposes the phone number in the URL and offer alternatives.

## v2.3 Midtrans
D-017: Midtrans Snap. D-018: backend-only membership activation. D-019: one-time/manual renewal. D-020: PaymentGatewayInterface abstraction.

## D-021 — Theme allocation

Starter has one theme, Basic has three cumulative themes, and Pro has all ten themes.

## D-022 — Theme/data separation

Themes are presentation templates only. All themes consume the same normalized card contact data and do not alter VCF behavior.

## D-023 — Theme orientation

The catalog contains seven landscape themes and three Pro portrait themes.

## D-024 — Official mail server
Transactional email uses authenticated cPanel SMTP at `mail.kartunamadigital.id`.

## D-025 — OTP
Registration uses six-digit, ten-minute, hash-only, single-use OTP.

## D-026 — Scope
cPanel SMTP is transactional only, not bulk marketing.

## D-027 — Stable theme codes
Theme codes are the descriptive immutable codes in `frontend/config/theme-registry.json` and `database/seeds/002-card-themes.sql`, beginning with `starter-clean`. Generic `theme-01` through `theme-10` codes are retired and must not be seeded.

## D-028 — Physical theme reference
The database stores `cards.theme_id` as a foreign key. API and frontend contracts expose the corresponding immutable `themeCode`; services perform the mapping.

## D-029 — CSRF contract
Every unsafe request authenticated by an access or Starter manage cookie requires the `X-CSRF-Token` header. The backend sets a session-bound, signed, non-HttpOnly CSRF cookie; access sessions use `csrf_token`, while D-039 clarifies the separate `starter_csrf_token` needed for simultaneous manage and login contexts. Frontend code echoes the relevant value in the header. Neither cookie contains an authentication credential. SameSite remains defense-in-depth.

## D-030 — OTP delivery without durable plaintext
OTP values are persisted only as a hash/HMAC. Registration and email-change OTP messages are sent immediately in the issuing request after the hash record is committed; plaintext OTP is never written to `mail_outbox`, logs, or delivery logs. If delivery fails, resend issues and invalidates with a new OTP. Non-OTP transactional messages continue to use the durable outbox and retry worker.

## D-031 — Backend runtime migration
The MVP backend runtime is Node.js 24 LTS with Express 5 and strict TypeScript. PHP is retired as the active runtime after Phase 1M parity acceptance. REST paths and business rules do not change.

## D-032 — Database access
MySQL2 Promise API is the database adapter. Repositories use prepared `execute()` calls. No ORM is used during MVP; SQL migrations and the database dictionary remain authoritative.

## D-033 — Package and test baseline
npm with a committed lockfile manages dependencies. TypeScript typecheck, the native Node test runner, HTTP integration tests, database migration/seed tests, Postman, dependency audit, and security regression gates are required.

## D-034 — Deployment capability gate
cPanel is supported only when the hosting provider enables Node.js Application Manager/Phusion Passenger and a compatible supported runtime. Otherwise deploy to a VPS/reverse proxy. PHP-only shared hosting is not a valid Node production target.

## D-035 — Email adapter migration
The application mailer contract remains transport-neutral. The Node implementation uses Nodemailer inside `CpanelSmtpMailer`; PHPMailer/Laravel adapters are retired with the PHP runtime.

## D-036 — Node rendering and payment adapters
The self-hosted QR rule remains unchanged; the Node QR adapter uses `qrcode` behind `QrCodeRendererPort`. Midtrans uses `midtrans-client` behind `PaymentGatewayPort`. Both are installed only in their approved implementation phase.

## D-037 — Password hashing runtime floor
Phase 2 uses the Node.js native asynchronous Argon2id implementation with the locked parameters encoded in PHC-style storage. Because native Argon2 was introduced in Node 24.7, the backend engine floor is Node 24.7 and production runtime compatibility is a deployment gate. Password plaintext is never logged or persisted.

## D-038 — Sensitive password-reset outbox dispatch
Password-reset email remains a durable non-OTP outbox job, but the job never contains a plaintext reset token. The worker generates the opaque token only when claiming the job, stores its hash transactionally, sends the plaintext link from memory, and records only sanitized delivery status. A retry generates a new token and invalidates the prior active reset token.

## D-039 — Starter manage rotation and claim CSRF binding
Starter manage credentials rotate after every successful edit; the old hash is revoked in the same transaction. Starter edit and claim validate a `starter_csrf_token` cookie value bound to the current manage-token hash, echoed through `X-CSRF-Token`. Access sessions retain the separate `csrf_token` cookie so login does not destroy anonymous manage context. Claim also requires a valid access session and verified active user; after claim, all manage tokens and the Starter CSRF cookie are cleared while access CSRF remains/reissues bound to the access-session ID.

## D-040 — Authenticated card creation requires paid entitlement

`POST /api/v1/cards` is available only to a verified active account with an active Basic or Pro subscription. It never creates an account-owned Starter card. Starter creation remains anonymous and ownership begins only through the manage-token claim flow; paid plan activation remains server-verified. The MVP one-active-card rule is enforced transactionally.

## D-041 — Shared-hosting gates deferred, not waived

The product owner deferred remote Phases 8H, 8I, and 8J while local E2E UI QA continues. This does not mark the phases complete and does not remove their production evidence requirements. Local browser/API results cannot substitute for effective cPanel runtime, HTTPS routing, disposable staging Postman, or provider-side evidence; the Phase 8M production decision remains NO-GO.

## D-042 — Static canonical public-card shell

The static frontend serves canonical `/{slug}` cards through an internal one-segment Apache rewrite to a single public-card shell. The shell derives the exact case-sensitive slug from `location.pathname`, retrieves the authoritative public aggregate from `/api/v1/public/cards/{slug}`, and loads only an active allowlisted theme template from the frontend registry. Real files, directories, and `/api/v1` remain outside the fallback. Invalid or wrong-case slugs render a safe `noindex` not-found state; a true HTTP 404 for a static shell requires a separately reviewed edge/server-rendering design.

## D-043 — Card presentation is plan-label-free and content-adaptive

Generated/public card artwork does not display `Starter`, `Basic`, or `Pro`; membership remains server-side authorization metadata. All ten templates share proportional responsive spacing, two-line wrapping/adaptive font reduction for long fields, and collapse empty contact/social/logo regions. Logo display remains restricted to Pro templates.

## D-044 — Shared authenticated app shell and feedback intake

CR-003 authorizes one shared responsive application shell across authenticated user pages. Desktop retains left workspace navigation; mobile uses an accessible toggle. Page transitions remain brief and respect reduced-motion preferences. Authenticated users may submit append-only product-improvement feedback through CSRF-protected `POST /api/v1/feedback`; the strict payload contains only a trimmed 1–300 character message.

## D-045 — Public theme names and cumulative selection access

The immutable theme codes remain unchanged, while their public display names are Aksara,
Bayu, Baskara, Nilam, Prasasti, Padma, Kanaka, Naya, Kirana, and Mahardika in display order.
All authenticated users may preview all active themes. Starter may select only Aksara;
Basic may select Aksara, Bayu, and Baskara; Pro may select all ten themes. The backend
`plan_theme_access` relationship is authoritative for saving a selection.

## D-046 — Stable deployment proxy and complete public contact fallback

Vercel keeps the frontend API same-origin at `/api/v1`, but the server-side
proxy resolves its upstream exclusively from the environment-specific
`BACKEND_API_BASE_URL`. The upstream must be a stable HTTPS origin; localhost
and `*.trycloudflare.com` are rejected fail-closed. Quick Tunnel remains local
QA infrastructure only and is never committed as a deployment destination.

Public-card external links are sanitized again in the browser as
defense-in-depth. Adaptive artwork may still clamp long content to protect its
composition, while an accessible expandable detail list exposes each complete
value and a copy action outside the artwork.

## D-047 — Resume Enhancement is a human Pro service

CR-004 adds one named-beneficiary Resume Enhancement per immutable Pro
subscription period. It is manually delivered, never an automatic AI
generator, allows three revisions, releases DOCX only, and retains private
files for 90 days from the latest official release.

## D-048 — Roles and membership are independent

Authorization uses permission-based RBAC with `member`, `cv_specialist`,
`resume_quality_reviewer`, `resume_service_admin`, and `super_admin`. Effective
tier remains Starter, Basic, or Pro from subscription state. High-risk
interventions require recent authentication, CSRF, confirmation, reason,
transaction, and immutable audit; unrestricted impersonation is forbidden.

## D-049 — Basic and Pro are annual subscriptions

Basic and Pro use a policy-locked 365-day annual entitlement term. Initial
activation and every annual renewal require verified idempotent server-side
payment evidence. Same-plan renewal extends from the later active end date or
verified payment timestamp by exactly 365 days. Price remains
administrator-managed, but the annual duration cannot be changed through plan
administration. D-049 supersedes the former D-019 one-time/manual-renewal rule.
Provider-specific automated renewal collection is implemented only through an
approved payment Change Request; pausing Midtrans work does not revert the
annual subscription model.

## D-050 — Unified website theme preference

Public information, legal, authentication, member, and admin website shells use
one solid monochrome design system with Light and Dark palettes. A first-visit
chooser records only the non-sensitive `knd.theme.preference` value in browser
storage; authentication tokens, edit credentials, payment state, and other
security data remain prohibited from `localStorage` and `sessionStorage`.
The user-selected public card artwork remains independent and is not recolored
by the website chrome preference.

## D-051 — Fixed-fee membership upgrade checkout

Midtrans does not support automatic prorated membership upgrade handling for
the MVP, so Kartunama Digital owns the upgrade transition matrix internally.
Allowed upgrade checkout transitions are Starter to Basic for IDR 55,000,
Starter to Pro for IDR 97,000, and Basic to Pro for IDR 55,000. Pro has no
upgrade path and must not show an upgrade CTA. Browser requests provide only
the target tier; amount, duration, order ID, and payment status remain
backend-owned. A verified successful upgrade starts a fresh target-tier
365-day entitlement from the verified payment timestamp and supersedes the
prior active subscription.

## D-052 — Node.js 22.18 hosting compatibility

CR-007 changes the production backend runtime to Node.js `>=22.18 <23` while
retaining Express 5, strict TypeScript, MySQL2, REST paths, and every business
rule. D-031 and D-037 are superseded only for their Node.js version and native
Argon2 implementation details.

Password hashing remains Argon2id with a unique 16-byte salt, 64 MiB memory,
three iterations, parallelism 1, a 32-byte tag, and PHC version 19. The
Node-22-compatible `argon2` server adapter is pinned in the production
dependency lockfile. It accepts the former Node 24 base64url PHC encoding for
existing accounts and emits standard PHC encoding for new hashes. Hosting
preflight must fail closed when Node 22.18+ or the Argon2id adapter is absent.

## D-053 — UTC persistence consistency

CR-008 sets the MySQL2 pool timezone to `Z` and sets each MariaDB connection
session to `+00:00`. JavaScript `Date` values, default SQL timestamps, and the
existing server-side `UTC_TIMESTAMP()` entitlement, subscription, payment, and
retention queries therefore share one UTC basis. This fixes a timezone-dependent
state where a newly activated subscription could be treated as not yet active.
No schema, API, tier, or payment-price rule changes.

## D-054 — Read-only migration status and separate DDL identity

`migrate:status` must not bootstrap or mutate `schema_migrations`; it reads the
recorded migration rows only, so the runtime application account can execute it
without DDL privilege. Migration and manual rollback remain administrative DDL
operations and require a distinct, short-lived migrator credential outside the
Passenger runtime environment. This preserves least privilege without changing
the schema or migration history.

## D-055 — Runtime-synchronized theme-picker previews

The member design gallery renders thumbnails and the selected preview from the
same registry template, shared card-theme stylesheet, and safe renderer used by
the public card. Rendering occurs inside an isolated style boundary so dashboard
theme rules cannot recolor card artwork. Versioned PNG preview paths remain
fallback/admin metadata only. This removes the drift created by manually drawn
SVG-to-PNG previews without changing theme codes, access allocation, contact
fields, API contracts, or database schema.

## D-056 — Visual field parity across card orientations

Portrait and landscape card artwork visibly render the same populated core
contact fields: office phone, mobile phone, email, website, and address, plus
social links. Portrait layouts may use a denser composition, adaptive text, and
collapsed empty rows, but may not hide populated fields as screen-reader-only
content. Theme orientation remains presentation-only and does not alter the
normalized data, VCF output, API contract, or plan access.

## D-057 — Authoritative backend source and read-only system settings

The authoritative backend source, tests, migrations, and shared scripts live in
`KartuNamaDigital-v2/backend`. The standalone `KartuNamaDigital-API` repository
is a deployment mirror and may retain only explicitly documented deployment
adapters such as its root Passenger bridge and root-relative environment
loader. Legacy CommonJS API implementations and database dumps are prohibited
from the deployment repository.

Super Admin services retain authorization and intervention business rules while
all SQL and transactions are isolated behind repository interfaces. Role grants
accept only the canonical RBAC roles and fail closed when persistence cannot
resolve the role. Website settings remain sanitized read-only data until every
editable key has an approved typed runtime consumer; the generic settings
mutation endpoint is removed until that gate is satisfied.

## D-063 — Typed landing-page wording management

`landing_page.wording` is the sole approved editable website setting. It has a
complete strict schema, a public read consumer with server-rendered fallback,
and a dedicated Super Admin route. Publishing requires `settings.manage`, CSRF,
recent authentication, a reason, transactional audit records, and plain text
only. Generic `/admin/settings` remains read-only.

## D-058 — Role-directed CV Specialist workspace

Authenticated `cv_specialist` users enter a dedicated operational workspace
that consumes the existing permission-filtered Resume Operations API. The
backend remains authoritative: specialists can list, open, download, transition,
and upload work only for requests assigned to their authenticated user. They do
not receive pool statistics, assignment, quality release, membership, feature,
or system-configuration controls. Super Admin remains permission-driven and
separate, so future approved capabilities can be added through canonical RBAC
permissions without widening the specialist role or trusting hidden UI state.

Local QA identities are idempotent development fixtures, forbidden outside
`local` and `testing`, and use scrypt password hashes plus canonical RBAC role
grants. They are not production bootstrap accounts.

## D-059 — Built-in scrypt password hashing for constrained Node hosting

CR-009 supersedes D-037, D-052, and CR-007 only for password-hashing
implementation details. Human passwords use asynchronous `node:crypto.scrypt`
with a versioned `$scrypt$v=1$` encoding, a unique 16-byte salt, `N=65536`
(`ln=16`), `r=8`, `p=1`, a 32-byte derived key, and a 128 MiB maximum-memory
guard. Verification accepts only the exact locked version and parameters and
uses `timingSafeEqual`; malformed, downgraded, and legacy Argon2 hashes fail
closed. Registration and password reset issue only the new format.

The native `argon2` package is removed so production installation does not
require node-gyp, compiler processes, or provider-specific binaries. Existing
Argon2 accounts must complete the existing single-use password-reset flow;
there is no plaintext recovery or silent downgrade. The selected production
database was empty at approval time, so no production credential migration is
required. Preflight now gates the built-in scrypt API while retaining Node.js
`>=22.18 <23`.

## D-060 — CommonJS startup boundary for LiteSpeed Passenger

The selected cPanel LiteSpeed launcher loads the configured startup file with
CommonJS `require()`. Requiring the former ESM `app.js` pulled in the
`src/server.ts` graph with top-level await and failed with
`ERR_REQUIRE_ASYNC_MODULE` before Express could listen. The canonical hosting
bridge is now `passenger.cjs`: a synchronous CommonJS boundary that uses
dynamic `import()` to start the unchanged ESM/TypeScript server and reports an
explicit startup failure. After production evidence showed that the selected
LiteSpeed integration still required `app.js` despite its UI displaying the
custom filename, `app.js` became a Git symbolic link to `passenger.cjs`. The
application root, REST contract, database schema, and Node.js `>=22.18 <23`
runtime remain unchanged.

## D-061 — Physical CommonJS app.js with nested ESM boundaries

Production evidence proved that the selected LiteSpeed launcher preserved the
`app.js -> passenger.cjs` symlink but still classified the requested `app.js`
path through the root ESM package scope, repeating `ERR_REQUIRE_ASYNC_MODULE`.
The default `app.js` is therefore a physical CommonJS dynamic-import bridge and
the backend root declares `"type": "commonjs"`. Explicit `"type": "module"`
boundaries under `src/`, `scripts/`, and `tests/` preserve the existing
ESM/TypeScript implementation, operational scripts, and test runtime. This
supersedes only the D-060 symlink mechanism; API contracts, business logic,
database schema, security controls, and the Node.js runtime range are unchanged.

## D-062 — Exact-host frontend routing to the production API subdomain

The selected shared hosting exposes the frontend at `kartunamadigital.id` and
the healthy Node API at `api.kartunamadigital.id`; no same-origin reverse proxy
is available. Runtime configuration therefore selects the HTTPS API subdomain
only for the exact canonical frontend hosts, while localhost and preview hosts
retain `/api/v1`. Credentialed requests remain explicit and require exact CORS,
Secure `Lax` cookies, and `COOKIE_DOMAIN=.kartunamadigital.id`. No secret or
authentication credential is embedded in frontend JavaScript.

## D-064 — Create-only production internal identities

The canonical production internal identities are
`admin@kartunamadigital.id` with `super_admin` and
`cv-specialist@kartunamadigital.id` with assignment-scoped `cv_specialist`.
They are provisioned only by an explicit one-time operational command using
ephemeral, distinct strong passwords and the canonical scrypt hasher. The
operation is transactional and create-only: an existing canonical identity
causes the whole operation to fail without changing any password or role.
Local QA seeds remain forbidden in staging and production.

## D-065 — Starter email management handoff

Starter creation remains anonymous, but the supplied email becomes the secure
handoff channel for later management. The backend sends the public URL and a
one-year opaque management link. Only its SHA-256 hash is persisted; the link
token is exchanged for HttpOnly Starter management credentials and removed
from the browser URL. Editing and claim are unavailable to anonymous users:
the management page routes through Login or Signup, and claim remains gated
by authenticated, verified account state. Successful claim revokes the
Starter manage and email-access token set.
