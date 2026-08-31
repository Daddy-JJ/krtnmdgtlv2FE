# Authentication and Session

Access token TTL pendek (default 15 menit) melalui Secure HttpOnly cookie. Refresh token acak, hash-only, rotate on use, family revoked saat reuse, lifetime configurable 30 hari.

Unsafe cookie-authenticated methods require a session-bound `X-CSRF-Token` header. Access sessions set signed non-HttpOnly `csrf_token`; Starter manage sessions set `starter_csrf_token`. Frontend code echoes the relevant value and the backend validates its binding. CSRF values are not authentication tokens; access, refresh, and Starter manage credentials remain Secure HttpOnly cookies. SameSite is defense-in-depth.

The two readable CSRF cookies use `Path=/` because static frontend pages such as `/app` must read them through `document.cookie`. Authentication cookies remain HttpOnly and path-restricted to their API scope.

Password memakai format scrypt terversi dari `node:crypto`; reset token single-use/short-lived; login rate-limited berdasarkan account/IP signals. Hash Argon2 lama wajib melalui reset password dan tidak diverifikasi oleh runtime production.

Starter manage access uses the same header transport but a separate readable `starter_csrf_token` cookie bound to the current manage-token hash. A successful Starter edit rotates both manage and Starter CSRF values transactionally. Claim validates the manage-bound header plus the access session; after claim, the Starter CSRF cookie is cleared and access `csrf_token` remains/reissues bound to the access-session ID.
