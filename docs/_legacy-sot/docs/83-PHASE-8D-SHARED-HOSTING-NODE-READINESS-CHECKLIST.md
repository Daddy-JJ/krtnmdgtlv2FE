# Phase 8D Shared Hosting Node.js Readiness Checklist

Date: 2026-07-22
Status: SUPERSEDED BY PHASE 8F — PROVIDER CONFIRMS NODE.JS V24.18.0

## Scope

Phase 8D updates the shared-hosting assessment after the product owner confirmed the hosting package includes:

- SSH access
- Python & Node.js
- Redis Object Cache
- Monarx Security
- Turbo Booster
- AccelerateWP

Included:

- Reclassify the hosting target from PHP-only unknown to conditional Node.js candidate.
- Define exact cPanel/SSH checks needed before backend deployment.
- Keep the accepted Node.js + Express backend architecture.

Excluded:

- Logging in to hosting.
- Running deployment commands on the shared host.
- Entering secrets into repository files.
- Switching backend to PHP.

## Updated compatibility result

| Requirement | Status | Notes |
|---|---|---|
| SSH access | Positive | Enables `node -v`, `npm -v`, dependency install checks, migrations, and logs. |
| Node.js availability | Confirmed by provider | Provider now reports Node.js `v24.18.0`. |
| Node.js runtime floor | Met at capability level | `v24.18.0` satisfies `>=24.7 <25`; effective application environment still needs sanitized CLI evidence. |
| cPanel app process manager | Pending | Need Setup Node.js App/Application Manager/Passenger details. |
| MariaDB | Likely compatible | MariaDB `11.4.8-MariaDB-cll-lve`; must create app DB as `utf8mb4`. |
| Redis Object Cache | Not required for MVP | Useful later, but not part of locked backend MVP. Do not add Redis dependency now. |
| Monarx Security | Operational note | May scan/quarantine Node files; deployment smoke must verify it does not block runtime files. |
| Turbo Booster / AccelerateWP | Not required | WordPress-oriented accelerators should not be relied on for Node API correctness. |

## Required cPanel UI checks

Confirm these values from cPanel:

1. Menu name:
   - `Setup Node.js App`, or
   - `Application Manager`, or
   - equivalent Node.js selector.
2. Available Node.js versions.
3. Whether the default physical CommonJS `backend/app.js` bridge is preserved.
4. Whether app root can point to the backend directory.
5. Whether environment variables can be configured in UI.
6. Whether app restart is available from UI.
7. Whether terminal/SSH can run `npm ci`.

## Required SSH checks

Run these on the shared hosting terminal and send back sanitized output:

```bash
node -v
npm -v
which node
which npm
pwd
```

The provider subsequently confirmed Node.js `v24.18.0`. This supersedes the earlier Node.js 22 evidence at the hosting-capability level.

If the effective cPanel application runtime remains lower than `v24.7.0`, the current backend cannot be deployed there without either:

- changing hosting target, or
- CR-009 now replaces the native Argon2id implementation with built-in scrypt; see D-059 for the current gate.

## Required database checks

Create or verify the app database uses `utf8mb4`:

```sql
SHOW VARIABLES LIKE 'character_set_server';
SHOW VARIABLES LIKE 'collation_server';
SHOW CREATE DATABASE your_database_name;
```

Application database target:

```sql
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci
```

## Minimal dry-run package check

After uploading the repository but before configuring secrets:

```bash
cd /path/to/repo
npm --prefix backend ci
npm --prefix backend run typecheck
```

Do not run migrations until the real database name/user and backup plan are confirmed.

## Gate

Gate result: PHASE 8D SUPERSEDED; PROVIDER CAPABILITY GATE MET BY NODE.JS V24.18.0.

Next required input:

- Provider/cPanel evidence that the effective application runtime is Node.js `>=24.7 <25`.
- Sanitized SSH/application-environment output for `node -v`, `npm -v`, `which node`, `which npm`.
- cPanel Node.js app screen showing the selected Node.js 24 version and startup/app-root fields.
