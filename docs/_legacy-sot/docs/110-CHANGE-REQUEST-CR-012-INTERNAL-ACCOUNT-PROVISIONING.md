# CR-012 — Production Internal Account Provisioning

## Scope

Provide a one-time, create-only command for the two canonical internal users:

| Email | Canonical role | Workspace |
|---|---|---|
| `admin@kartunamadigital.id` | `super_admin` | `/admin/` |
| `cv-specialist@kartunamadigital.id` | `cv_specialist` | `/specialist/` |

The CV Specialist role remains assignment-scoped. It is not a Resume Service
Admin and cannot manage membership, global settings, assignment, or release.

## Security contract

- Passwords are accepted only through ephemeral environment variables, never
  source files, SQL fixtures, command arguments, logs, or Git.
- Each password must be 14–128 characters and contain uppercase, lowercase,
  number, and symbol characters. The two accounts must use different passwords.
- Passwords are persisted only through the canonical versioned scrypt hasher.
- Provisioning requires an explicit confirmation phrase and one database
  transaction.
- The command is create-only. If either canonical email already exists, no
  account is created and no credential or role is overwritten.
- Required RBAC roles must already exist through migration 004.
- Successful creation records an activity-log event without password material.

## Hosting procedure

Run after migrations with the hosting Node virtual environment active:

```bash
read -s -p "Super Admin password: " KND_SUPER_ADMIN_PASSWORD; echo
read -s -p "CV Specialist password: " KND_CV_SPECIALIST_PASSWORD; echo
export KND_SUPER_ADMIN_PASSWORD KND_CV_SPECIALIST_PASSWORD
export KND_PROVISION_CONFIRM=PROVISION_INTERNAL_USERS
npm run users:provision-internal
unset KND_SUPER_ADMIN_PASSWORD KND_CV_SPECIALIST_PASSWORD KND_PROVISION_CONFIRM
```

Create the corresponding mailboxes in the hosting mail panel and finish SMTP
configuration separately so password reset and notifications can be delivered.

## Verification

```sql
SELECT u.email,u.role,u.status,u.email_verified_at,r.code AS active_role
FROM users u
JOIN user_roles ur ON ur.user_id=u.id AND ur.revoked_at IS NULL
JOIN roles r ON r.id=ur.role_id
WHERE u.email IN ('admin@kartunamadigital.id','cv-specialist@kartunamadigital.id');
```

Expected result is exactly two active, verified users whose legacy `users.role`
and canonical active RBAC role match the table above.
