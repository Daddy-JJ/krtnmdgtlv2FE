# CR-004 — Resume Enhancement and Operational RBAC

Status: **APPROVED**
Approved by product owner: 2026-07-29

## Scope

Add the human-delivered Pro perk **Resume Enhancement by Kartunama Digital
Specialist** and upgrade internal authorization to permission-based RBAC.
Midtrans live integration remains paused.

## Locked role model

Membership tier and authorization role are independent.

- Customer role: `member`.
- Internal roles: `cv_specialist`, `resume_quality_reviewer`,
  `resume_service_admin`, and `super_admin`.
- Existing `user` and `admin` values are migrated to `member` and
  `super_admin`.
- Effective customer tier remains Starter, Basic, or Pro and is derived from
  server-side subscription state.

RBAC uses `roles`, `permissions`, `role_permissions`, and `user_roles`.
Backend permission checks are authoritative. High-risk interventions require
recent authentication, CSRF, explicit confirmation, a reason, a transaction,
and an immutable audit event. Unrestricted impersonation is forbidden.

## Locked Resume Enhancement rules

- Authenticated, email-verified, active Pro members only.
- One named beneficiary for each immutable 365-day Pro annual subscription
  period.
- Maximum one active request and three user revisions.
- Human service only; no automatic AI generation or fictional facts.
- SLA is 48 working hours, Monday–Friday, starting at `DATA_COMPLETE`.
- `NEED_MORE_INFORMATION` pauses SLA; a later `DATA_COMPLETE` resumes it.
- Source: one DOCX/PDF file up to 5 MiB or pasted resume up to 30,000
  characters. One optional DOCX/PDF/TXT job-description file up to 3 MiB.
- Released output is DOCX only, up to 10 MiB.
- Files are private and downloadable only through authorized controllers.
- Files expire 90 days after the latest official release. A released revision
  resets the retention deadline.
- Specialist internal notes never enter member responses.

## Operational workspace

Member routes are rooted at `/app/resume-enhancement`. Operational routes are
rooted at `/admin/resume-services`, with queue, assignment, information,
in-progress, quality-review, revisions, completion, retention, and request
detail views.

Release requires a completed quality checklist. Release atomically selects the
current deliverable, completes the request, records SLA result, starts
retention, queues email, and writes status/audit events.

## Delivery phases

9A SOT; 9B RBAC; 9C Super Admin; 9D resume workflow/SLA; 9E private files;
9F specialist/quality/revisions; 9G retention/email/workers; 9H frontend; 9QA.
