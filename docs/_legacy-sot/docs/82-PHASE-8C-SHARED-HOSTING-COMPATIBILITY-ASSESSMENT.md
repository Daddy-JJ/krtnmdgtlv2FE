# Phase 8C Shared Hosting Compatibility Assessment

> Historical assessment. CR-009/D-059 remove the native Argon2 installation gate while retaining Node.js `>=22.18 <23`.

Date: 2026-07-22
Status: SUPERSEDED BY PHASE 8D — NODE.JS 22 CONFIRMED, NODE.JS 24 REQUEST PENDING

## Scope

Phase 8C assesses the provided shared hosting environment as the backend target for the Node.js + Express.js API.

Included:

- Interpret the provided cPanel/phpMyAdmin hosting details.
- Decide whether the current hosting data is sufficient for backend deployment.
- Identify exact missing checks before attempting deployment.
- Keep production no-go boundary intact.

Excluded:

- Logging in to hosting.
- Creating databases, users, DNS records, or app services.
- Reverting the approved Node.js + Express.js backend migration.
- Adding PHP backend fallback.

## Provided hosting evidence

| Area | Provided value |
|---|---|
| Database server | Localhost via UNIX socket |
| Database engine | MariaDB |
| Database version | `11.4.8-MariaDB-cll-lve` |
| Database SSL | Not used |
| Protocol version | 10 |
| Server charset | `cp1252` West European / latin1 |
| Web server | `cpsrvd 11.136.0.29` |
| Database client | `libmysql - mysqlnd 8.4.22` |
| PHP extension | `mysqli`, `curl`, `mbstring` |
| PHP version | `8.4.22` |

## Additional hosting features reported after initial assessment

| Feature | Impact |
|---|---|
| SSH access | Positive; enables direct runtime/version checks and CLI deployment steps. |
| Python & Node.js | Positive; changes this host from PHP-only unknown to conditional Node candidate. |
| Redis Object Cache | Not required for MVP; do not add Redis dependency now. |
| Monarx Security | Operational note; deployment smoke must verify it does not block Node runtime files. |
| Turbo Booster / AccelerateWP | Not required for Node API correctness. |

## Compatibility result

| Requirement | Status | Notes |
|---|---|---|
| MariaDB/MySQL database | Likely compatible | MariaDB 11.4 is newer than local test engines; schema should still be validated with migrations. |
| UTF-8 storage | Needs explicit setup | Server default `cp1252` is not acceptable for app tables; database/tables must use `utf8mb4_unicode_ci`. |
| Node.js runtime | Available | Current provider runtime is Node.js 22. |
| Node.js version floor | Not met | Backend requires Node.js `>=24.7 <25` because native Argon2id is used; Node.js 24 activation is being requested. |
| Express process hosting | Pending | Need cPanel Setup Node.js App / Application Manager / Passenger support details. |
| Backend database access | Depends on runtime location | `Localhost via UNIX socket` works only if backend runs on the same hosting account/server. |
| Frontend-to-database direct access | Not allowed | Browser/frontend must never connect to DB. Backend API is required. |
| VPS-to-shared-DB access | Not confirmed | Would require Remote MySQL, firewall allowlist, TLS review, and credentials outside Git. |

## Decision

The shared hosting target is a conditional candidate, but is not approved for deployment yet.

Reason:

- The updated hosting feature list proves Node.js is available, but does not prove Node.js `>=24.7 <25` or Passenger/Application Manager compatibility.
- PHP 8.4 support does not help the current backend because the active runtime was migrated and accepted as Node.js + Express.js in CR-002.
- A PHP fallback backend would be a new Change Request and would increase drift from the accepted architecture.

## Required hosting checks

Before deployment can continue on this shared hosting, confirm whether cPanel has one of these:

1. **Setup Node.js App**
2. **Application Manager**
3. **Node.js Selector**
4. Provider-confirmed **Phusion Passenger for Node.js**

Required values:

| Check | Required value |
|---|---|
| Node.js version | `>=24.7 <25` |
| App startup file | `backend/app.js` (physical CommonJS bridge) |
| App root | backend directory or provider-supported equivalent |
| Environment variables | Configurable outside public web root |
| Process restart | Available through cPanel UI or command line |
| Cron/worker | Available for `npm --prefix backend run mail:work` |
| Storage write access | Backend `storage/` writable and not directory-listable |
| Shell access | Strongly recommended for `npm ci`, migrations, seeds, and key generation |

## Database setup requirement

If this shared hosting is used, create the application database with UTF-8 settings regardless of server default:

```sql
CREATE DATABASE digital_identity
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

The migration tables already specify `utf8mb4`, but the database default should still be corrected to avoid future drift.

## Safe next options

Option A — continue with shared hosting only if Node.js 24 is available:

- Confirm Node.js Application Manager support.
- Deploy backend through the default physical CommonJS `backend/app.js` bridge.
- Use local MariaDB via socket/localhost.

Option B — use VPS for backend:

- Deploy Node.js 24 + Express on VPS.
- Use MariaDB on same VPS or managed database.
- Host the static frontend on the selected web host and route `/api/v1/*` to the VPS HTTPS backend through a reviewed same-origin reverse proxy/gateway.

Option C — keep shared hosting for database only:

- Only possible if Remote MySQL is supported and securely allowlisted.
- Not preferred because DB exposure and latency risks increase.

## Gate

Gate result: PHASE 8C SUPERSEDED BY PHASE 8D.

Next required input:

- SSH output and cPanel Node.js App/Application Manager details listed in Phase 8D.
