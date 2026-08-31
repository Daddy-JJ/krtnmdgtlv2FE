# CR-011 — Landing Page Content Management

## Scope

Add one dedicated Super Admin page at `/admin/landing-content/` for changing
approved wording fields on the public home page. This is deliberately not an
editable generic settings page and does not add a CMS, HTML editor, media
library, navigation editor, SEO editor, or new membership feature.

## Contract and security

- Public read: `GET /api/v1/public/content/landing`.
- Admin read/write: `GET` and `PUT /api/v1/admin/landing-content`.
- Write access requires `settings.manage`, an authenticated CSRF-protected
  request, fresh session authentication, strict complete payload validation,
  plain text only, and a 10–300 character reason.
- The MySQL update, setting history, and activity event share one transaction.
- The public HTML contains the default wording, so a temporary API outage does
  not render an empty landing page.

## Data and rollback

Migration `006_landing_page_content.sql` creates one `website_settings` row.
Rollback deletes only that row; code continues to use its safe typed defaults.
The page is deployed only after the migration has run.
