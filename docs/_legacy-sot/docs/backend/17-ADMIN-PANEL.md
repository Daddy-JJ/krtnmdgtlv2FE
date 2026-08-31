# Admin Panel Specification

Areas: Dashboard, Users, Cards, Plans/Features, Themes, Payments/Subscriptions, Activity Logs, System Health, QR Rendering.

QR screen shows adapter/version, writer health, render profile, cache status, sanitized failures. Actions: health test and purge expired/all/card cache. Forbidden: arbitrary payload, external QR API credential, raw HTML/SVG, manage token display. All actions authorized and audited.

## Theme administration

Admin may:
- view ten theme records;
- preview;
- activate/deactivate;
- reorder;
- inspect minimum plan and orientation.

Admin cannot edit arbitrary template HTML/CSS from browser in MVP.
Template code remains deployment-controlled.

## Email operations
Admin sees masked recipient, template, state, attempts, sanitized error, and timestamps; may retry eligible jobs; never sees OTP, SMTP password, or rendered sensitive body.
