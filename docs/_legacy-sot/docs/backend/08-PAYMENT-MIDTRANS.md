# Payment — Midtrans

Server membuat unique order/payment pending → request gateway → browser payment UI → redirect informational → webhook → signature verify → idempotency → transition validation → subscription → audit.

`order_id` unique; gateway event/payload hash deduplicated. Internal status: pending, paid, failed, expired, canceled, refunded. Unknown status tidak mengaktifkan plan.
