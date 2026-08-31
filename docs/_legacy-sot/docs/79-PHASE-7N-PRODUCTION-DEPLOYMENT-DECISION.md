# Phase 7N Production Deployment Decision

Date: 2026-07-19
Decision: NO-GO FOR FULL PRODUCTION

## Decision summary

The project is ready for public static frontend preview on Vercel, but it is not ready for full production operation.

## What is approved now

- Git-connected Vercel static frontend deployment.
- Public static access to `krtnmdgtlv2.vercel.app`.
- Continued frontend/browser review of static pages.
- Continued backend local/staging testing with non-production data.

## What is not approved yet

- Custom production domain cutover.
- Production backend/database launch.
- Live Midtrans production activation.
- Live SMTP production activation.
- Real customer data onboarding.

## Required before changing to GO

1. Provision a stable HTTPS backend origin.
2. Provision staging/production MariaDB with backup/restore procedure.
3. Configure environment secrets outside Git.
4. Verify `/api/v1/health` on the public domain.
5. Complete Phase 7L browser/device UAT.
6. Complete Midtrans sandbox verification.
7. Complete SMTP inbox/deliverability verification.
8. Complete backup/restore and rollback rehearsal.
9. Re-run Phase 7M final checks.

## Final gate

Gate result: PRODUCTION NO-GO.

Next recommended phase: backend staging infrastructure provisioning.
