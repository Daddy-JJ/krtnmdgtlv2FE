# cPanel Deployment

Verify that the hosting provider enables cPanel Application Manager/LiteSpeed Passenger and Node.js `>=22.18 <23`. PHP-only shared hosting is not sufficient. Install production dependencies from the npm lockfile, register `backend/app.js`, and configure environment variables outside source control. The root package and physical `app.js` are CommonJS because some LiteSpeed integrations ignore custom startup filenames and synchronously require `app.js`; explicit nested package boundaries keep `src/`, `scripts/`, and `tests/` ESM. Verify `app.js` is a regular file and `package.json` declares `"type": "commonjs"` before restart.

Protect `.env`, storage, dependency metadata, and logs. Configure cron/worker execution with the provider-supported Node binary. Use least-privilege permissions and disable directory listing. If Node 22.18+/Passenger is unavailable, deploy to a VPS rather than silently downgrading the runtime.

## Cron Resume Enhancement

From the private backend application root, schedule these commands with the
absolute Node.js 22 binary selected by cPanel:

- every 5 minutes: `npm run mail:work`
- daily at 00:15 Asia/Jakarta: `npm run resume:work`

Run each worker under the same non-root application user and server-side
environment as Passenger. Confirm `APP_URL` is the canonical HTTPS origin and
that `backend/storage/private/resume-service` is writable but not web-accessible.
Inspect sanitized worker exit status and `mail_delivery_logs`; never redirect
environment values or resume payloads to public log files.
