# Database Dictionary

## Conventions
BIGINT UNSIGNED PK; UUID `public_id`; UTC timestamps; email lowercase; Basic/Pro custom slugs lowercase; Starter slugs preserve generated case; phone menuju E.164; soft delete hanya bila berguna.

## Core tables

### users
`public_id`, unique `email`, `password_hash`, compatibility snapshot `role`,
`status`, verification timestamps. Authorization authority is the set of active
rows in `user_roles`; `users.role` must never be used for an authorization
decision.

### themes dan plan_theme_access
`themes` menyimpan code/template/preview/status. `plan_theme_access` menentukan tema yang boleh dipilih tiap plan.

### cards
`public_id`, nullable `user_id`, generated nullable `active_user_id`, unique `slug`, `plan_code`, `theme_id`, `locale`, nullable `logo_path`, `status`, publish/delete timestamps. Unique `active_user_id` enforces at most one non-deleted card per account while retaining soft-deleted history.

### card_contacts
`card_id`, `full_name`, `job_title`, `organization`, `office_phone`, `mobile_phone`, `email`, `website_url`, `address_text`, nullable `maps_url`.

### starter_manage_tokens
`card_id`, unique `token_hash`, created/last_used/revoked. Plaintext token tidak disimpan.

### auth_rate_limits
`bucket_hash`, internal action, hit count, fixed-window start/expiry, and timestamps. Email/IP/account signals are hashed into the bucket key before persistence; raw rate-limit identifiers are not stored. Rows are operational and may be purged after expiry.

### plan_features
`plan_id`, `feature_key`, `value_type`, bool/int/text values.

### payments
Unique merchant order, gateway transaction, amount/currency/status, paid/expiry timestamps.

Physical reference: `database/schema-reference.sql`.

No QR table or QR binary/filename columns on cards for MVP.

## cards.slug revision

`cards.slug` must support both:
- case-sensitive Starter random values;
- lowercase Basic/Pro custom values.

Recommended physical behavior:
- use a binary/case-sensitive collation for the slug column or a separate normalized lookup strategy;
- unique index must not collapse `aBcDeFg` and `abcdefg`;
- Basic/Pro service normalizes custom slug to lowercase before storage.

Suggested columns:
- `slug VARCHAR(100)` using case-sensitive collation;
- optional `slug_kind VARCHAR(20)` with `random` or `custom`.

## v2.3 Midtrans
Payments store immutable target plan, plan name, price, currency, duration, order ID, gateway transaction ID, gateway/fraud status, timestamps, and event idempotency keys. Never store Server Key.

Migration `005_annual_subscription_term.sql` aligns existing catalog data:
Starter uses `duration_days=0`; Basic and Pro use the policy-locked annual
`duration_days=365`. Every paid payment snapshot must therefore retain 365
days, and same-plan verified renewal extends by exactly that snapshot.

## themes

| Column | Type | Rule |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| code | VARCHAR(50) | unique immutable key |
| name | VARCHAR(100) | display name |
| orientation | VARCHAR(20) | landscape/portrait |
| preview_path | VARCHAR(255) | internal asset path |
| template_path | VARCHAR(255) | frontend component path |
| minimum_plan_code | VARCHAR(30) | starter/basic/pro |
| display_order | INT UNSIGNED | gallery order |
| is_active | TINYINT(1) | availability |
| created_at | DATETIME | UTC |
| updated_at | DATETIME | UTC |

## plan_theme_access

Composite unique:
- `plan_id`
- `theme_id`

Access is cumulative through explicit seed rows.

## cards.theme_id

The physical schema stores the selected theme as `cards.theme_id`, a foreign key to `themes.id`. API responses and requests expose the joined immutable `themes.code` as `themeCode`; no duplicate `cards.theme_code` column is used.

## Email tables
`email_otps` stores hash-only OTP lifecycle. `mail_outbox` stores durable non-OTP jobs and sanitized template payload. `mail_delivery_logs` stores masked recipients and sanitized results. OTP plaintext, SMTP password, and rendered sensitive body are forbidden in every table. OTP delivery follows D-030.

## Complete physical table matrix

Migration files are authoritative. This matrix records module ownership, primary relationship, and lifecycle intent so future changes remain modular.

| Table | Module owner | Main relationship / key | Lifecycle |
|---|---|---|---|
| `users` | Auth / Account | unique `public_id`, unique lowercase `email` | Account state is updated; physical deletion is not an MVP user action. |
| `plans` | Plans / Admin | unique immutable `code` | Seeded catalog; controlled price/status update. Only Starter, Basic, Pro are valid; Basic/Pro duration is locked at 365 days. |
| `plan_features` | Plans | unique (`plan_id`, `feature_key`) | Controlled typed capability configuration; not a generic EAV store. |
| `themes` | Plans / Admin | unique immutable `code` | Seeded catalog; availability can be updated. |
| `plan_theme_access` | Plans | unique (`plan_id`, `theme_id`) | Explicit access mapping; cascade only with catalog removal. |
| `subscriptions` | Payments | indexed (`user_id`, `status`) | Server-verified lifecycle; browser input never activates membership. |
| `cards` | Cards | unique `public_id`, case-sensitive unique `slug`, unique active owner | Soft delete retains history; migration 003 permits a replacement active card. |
| `card_contacts` | Cards | one-to-one unique `card_id` | Created/updated with card aggregate; cascades on physical card removal. |
| `starter_manage_tokens` | Starter | unique hash-only token, FK `card_id` | Rotated/revoked; plaintext token is never persisted. |
| `refresh_tokens` | Auth | unique hash-only token; indexes on user/family | Rotated, used, expired, or revoked; plaintext token is never persisted. |
| `password_reset_tokens` | Auth | unique hash-only token, FK `user_id` | One-time expiry/consumption lifecycle. |
| `email_otps` | Auth / Email | indexed destination/purpose/consumption/expiry | Hash-only OTP with attempts, expiry, and consumption. |
| `card_social_links` | Card Content | indexed (`card_id`, `sort_order`) | Owner-scoped create/read/update/delete; plan limits enforced in Service. |
| `catalog_items` | Card Content | unique `public_id`; indexed (`card_id`, `sort_order`) | Owner-scoped create/read/update/delete; plan limits enforced in Service. |
| `payments` | Payments | unique merchant order; indexed (`user_id`, `status`) | Append/lifecycle record; target plan and price are immutable snapshots. |
| `payment_events` | Payments | unique gateway event key | Append-only idempotency/audit record; rejected events are retained. |
| `mail_outbox` | Email | indexed worker queue fields | Durable queued/sent/failed lifecycle; sensitive rendered bodies are forbidden. |
| `mail_delivery_logs` | Email | indexed nullable `outbox_id` | Append-only sanitized delivery evidence with masked recipient. |
| `activity_logs` | Shared audit | indexes on time, user, and card | Append-only sanitized audit trail. |
| `auth_rate_limits` | Auth | unique hashed bucket; expiry index | Operational fixed-window state; expired rows may be purged. |
| `user_feedback` | Feedback | unique `public_id`; indexed user/status chronology | Authenticated append-only improvement requests; message is limited to 300 characters. |

## CRUD and deletion policy

- Full owner-scoped CRUD applies to cards, social links, and catalog items.
- Account, plan, and theme writes are controlled updates, not unrestricted generic CRUD.
- Payments, payment events, delivery logs, activity logs, and user feedback are lifecycle or append-only records. Exposing generic user delete endpoints would weaken audit and operational follow-up.
- Tokens are lifecycle-managed through rotate, consume, expire, and revoke operations. They are never returned through administrative list APIs.
- All domain SQL uses `mysql2.execute()` parameter binding. Raw `query()` is restricted to trusted, checked-in migration and seed SQL runners.
- Controllers remain transport adapters; tier limits, ownership, payment verification, and lifecycle rules belong in Services.

## Integrity and indexing baseline

- Every table uses `InnoDB` and `utf8mb4`; `cards.slug` alone uses `utf8mb4_bin` for case-sensitive Starter slugs.
- Foreign keys protect aggregate relationships. Cascades are limited to dependent configuration/content/token rows where removal is intentional.
- `uq_cards_active_user` is backed by generated `active_user_id` and enforces one non-deleted card per account without destroying card history.
- Worker, lookup, ownership, ordering, status, and idempotency paths have explicit indexes or unique keys.
- cPanel databases must be created with `utf8mb4`; the provider control-panel default `latin1`/`cp1252` must not become the application database default.

## Extension protocol

Future schema work uses a new forward migration; an applied migration is never edited. Every schema change must update this dictionary and `database/schema-reference.sql`; API-visible changes must also update `openapi/openapi.yaml`. New business modules should add a repository interface, a MySQL adapter, a Service boundary, thin controller/router adapters, and tests. Core entities must use explicit columns/tables rather than an unrestricted key-value/EAV design.

## Phase 9 RBAC and Resume Service

Migration `004_phase9_rbac_resume_service.sql` adds:

- RBAC: `roles`, `permissions`, `role_permissions`, `user_roles`;
- controlled operations: `admin_interventions`, `website_settings`,
  `setting_change_logs`, `usage_adjustments`, `user_tier_history`;
- immutable benefit periods: `subscription_periods`,
  `resume_service_entitlements`;
- workflow: `resume_requests`, files, assignments, messages, status/SLA logs,
  revisions, deliverables, quality reviews, download logs, retention notices.

Resume paths are private metadata and are never API-visible. Resume content is
forbidden in audit/metrics. Entitlement uniqueness is enforced by immutable
subscription period; revisions and deliverable versions use composite unique
keys.

Migration `007_rbac_authority_reconciliation.sql` repairs accounts without an
active canonical role and synchronizes the legacy `users.role` snapshot from
the highest-priority active `user_roles` assignment. Active RBAC assignments
are never replaced by the migration.

## Landing page wording

Migration `006_landing_page_content.sql` adds the single typed public setting
`website_settings.landing_page.wording`. Its JSON structure is validated at the
service boundary and contains only the approved landing-page plain-text fields;
it is not a general-purpose CMS or EAV store. Every published value change is
written transactionally to `setting_change_logs` together with a required
reason and to `activity_logs` without copying content into operational logs.
