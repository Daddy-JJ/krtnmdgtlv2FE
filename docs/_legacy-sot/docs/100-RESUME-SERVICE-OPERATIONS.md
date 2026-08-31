# Resume Service Operations

Workers are idempotent and support cPanel cron:

- mail outbox;
- SLA breach detection;
- 30/7/1-day retention notices;
- physical-file expiry and deletion;
- stale processing-lock release;
- abandoned-draft cleanup.

Operational metrics are sanitized: queue depth, turnaround, SLA rate, revisions,
downloads, expiry, cleanup failure, upload rejection, and workload adjusted for
waiting time, complexity, career level, revision, and reassignment. Raw CV
content is forbidden in logs and metrics.

## cPanel schedule

- Every five minutes: `npm run mail:work`
- Daily at 00:15 Asia/Jakarta: `npm run resume:work`

Both commands run from the private backend application root under the same
non-root Node.js 24 application user and environment as Passenger. The resume
worker queues 30/7/1-day warnings and deletes expired physical files before
marking database records expired. A physical deletion failure is logged without
storage path disclosure and leaves the request retryable.
