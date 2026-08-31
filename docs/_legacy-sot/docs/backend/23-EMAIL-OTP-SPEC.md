# Email OTP Specification

## Defaults
- six numeric digits
- expires in 10 minutes
- maximum 5 verification attempts
- resend cooldown 60 seconds
- maximum 5 sends/hour per destination and purpose
- single-use
- newest OTP invalidates prior active OTP
- stored as HMAC/hash only
- delivered immediately without durable plaintext storage

Generate with `random_int(0, 999999)` and preserve leading zeros. Never use `rand()`, timestamps, or user IDs.

## Issuance and delivery
Commit the new hash-only OTP record and invalidate prior active OTPs, then send the one in-memory plaintext value immediately through `TransactionalEmailService`. Do not enqueue OTP content. If SMTP delivery fails, expose only the generic delivery-unavailable state; a resend creates a new OTP and invalidates the failed value.

## Verification transaction
Lock active OTP, reject expired/consumed/attempt-limited, compare in constant time, consume OTP, verify email, revoke other active OTPs, and enqueue welcome mail.

## Anti-enumeration
Use generic responses such as “Jika alamat email valid, kode akan dikirim.” Do not reveal whether an account exists.

## Logging
Log purpose, public IDs, masked destination, and sanitized result. Never log OTP, SMTP password, reset token, or rendered OTP body.
