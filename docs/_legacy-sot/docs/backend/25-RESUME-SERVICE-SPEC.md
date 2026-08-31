# Resume Service Backend Specification

The module follows Controller → Validator → Service/Policy → Repository.
Controllers contain no workflow or authorization rules.

## Status

`DRAFT`, `SUBMITTED`, `ASSIGNED`, `NEED_MORE_INFORMATION`, `DATA_COMPLETE`,
`IN_PROGRESS`, `READY_FOR_REVIEW`, `COMPLETED`, `REVISION_REQUESTED`,
`REVISION_IN_PROGRESS`, `EXPIRED`, `CANCELLED`, `ARCHIVED`.

Transitions are allowlisted by `ResumeWorkflowService`. Release and revision
limits are transaction-safe.

## Authorization

Members access only their requests. Specialists access assigned requests or a
pool explicitly granted by permission. Quality release needs
`resume.quality_review` or `resume.release`. Super Admin interventions require
recent authentication and immutable audit.

## Storage

Private root:
`storage/private/resume-service/{userPublicId}/{requestPublicId}`.
Stored names are random and paths are never returned. Download sets attachment,
nosniff, and a safe filename after ownership/role, retention, scan, and
existence checks.

## API

Member endpoints use `/api/v1/resume-service` and `/api/v1/resume-requests`.
Operational endpoints use `/api/v1/admin/resume-requests`. All unsafe
cookie-authenticated requests require `X-CSRF-Token`.
