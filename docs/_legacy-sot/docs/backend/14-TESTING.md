# Backend Testing

TypeScript typecheck plus native `node:test`. Unit-test services/validators/VCF/capabilities. Repository integration uses a disposable MariaDB database. HTTP integration covers auth/authz/envelopes. Payment fixtures cover valid/invalid/duplicate events. Security regressions cover token/ownership/CSRF/rate limits. Automated tests never call real payment or email services.

Release gates include `npm audit`, OpenAPI contract validation, Postman/Newman when installed, and production dependency/runtime support checks.
