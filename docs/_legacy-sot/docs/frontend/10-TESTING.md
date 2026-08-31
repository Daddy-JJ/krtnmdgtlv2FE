# Frontend Testing

Test form/limits/API error/auth expiry/responsive/keyboard/modal focus/public links/QR/VCF trigger/payment states. Minimal release gate: automated smoke + manual browser/device matrix.

Test slug refresh, no token, keyboard dialog, filename, fallback, and real device scans.

Slug tests:
- Starter read-only mixed-case URL;
- Basic/Pro suggestion;
- privacy warning;
- reserved slug;
- availability race/conflict;
- slug change refreshes canonical URL and QR;
- case-sensitive Starter routing.

Theme UI tests cover cumulative access, locked state, live preview, preservation of unsaved data, orientation filtering, and safe rendering of user text.
