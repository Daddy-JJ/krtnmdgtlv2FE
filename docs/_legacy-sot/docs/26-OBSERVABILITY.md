# Observability

Structured log: timestamp, level, request_id, route, actor/card public id, event, duration, status.

Never log password, auth/manage token, Server Key, raw cookie.

Metrics: requests/errors/latency, login/manage failures, card creation, VCF download, webhook failure, activation, upload rejection.

Alerts: repeated 5xx, signature failures, DB failure, disk/backup failure.

QR events: render success/failure, cache hit/miss/purge; metrics include duration, failure rate, hit ratio, 429.
