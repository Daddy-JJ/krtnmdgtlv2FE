# Frontend Decision Log

Only approved decisions that apply to this frontend repository belong here.
Historical monorepo decisions remain in `docs/_legacy-sot/` without precedence.

## FE-D-001 — Frontend-only SOT

Date: 2026-09-01  
Status: Accepted

The SOT in this repository governs only frontend code, UX, static deployment,
and the API contract consumed by the frontend. Backend implementation, database,
OpenAPI authority, and server operations remain in a separate repository.

## FE-D-002 — Authenticated Starter claim before editing

Date: 2026-09-01  
Status: Accepted

Starter creation remains available without login. Editing is unavailable to an
anonymous visitor. The user must Login or Signup, verify the account when required,
and claim the specific card before editing it.

## FE-D-003 — Resume source is DOCX-only, maximum 10 MB

Date: 2026-09-01  
Status: Accepted

Resume Enhancement accepts one Microsoft Word `.docx` source file up to 10 MB.
PDF source upload is not part of launch scope. Official output remains DOCX.

## FE-D-004 — Membership checkout remains paused

Date: 2026-09-01  
Status: Accepted

Checkout remains disabled until a later product decision resumes it. During the
pause, UI note must use `Under development`. Benefit and price information may be
visible, but the browser must not create checkout/payment requests.

## FE-D-005 — Mandatory first-visit Light/Dark chooser

Date: 2026-09-01  
Status: Accepted

A visitor without a stored website-theme preference must be shown an accessible
Light/Dark chooser. The selected non-sensitive value may be stored as
`knd.theme.preference`. Card artwork theme remains independent.

## FE-D-006 — Vercel frontend and external shared-hosted backend

Date: 2026-09-01  
Status: Accepted

Vercel is the canonical frontend host. Backend lives in a separate repository on
shared hosting. Browser traffic uses same-origin `/api/v1` through the Vercel
Function proxy, which reads a stable HTTPS `BACKEND_API_BASE_URL`.

## FE-D-007 — Indonesian-only launch

Date: 2026-09-01  
Status: Accepted

Bahasa Indonesia is sufficient for launch. English UI and a language switcher are
deferred. Existing English locale resources may remain dormant scaffolding.

## FE-D-008 — Preserve legacy SOT as read-only archive

Date: 2026-09-01  
Status: Accepted

Legacy documents are preserved at `docs/_legacy-sot/` with their relative paths
and checksums. They provide provenance only and cannot override canonical SOT.

## FE-D-009 — Explicit static deployment allowlist

Date: 2026-09-01  
Status: Accepted

Vercel serves `dist/`, not repository root. A deterministic build copies only
runtime files; docs, tests, governance, and repository metadata stay private.

## Decision change procedure

A superseding entry must identify the decision being changed, describe migration
impact, update every affected canonical document/test, and receive explicit
product-owner approval. Do not rewrite accepted history to simulate a new choice.
