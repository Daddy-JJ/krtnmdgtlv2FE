# Frontend Pages

Public: landing, pricing, starter create, public card, auth/legal, and the
indexable articles `/blog/satu-link-untuk-identitas-profesional/` and
`/blog/cv-resume-builder/`. The latter explains the Resume Enhancement Pro
benefit using the shared monochrome system and routes eligibility actions to
the authenticated billing/member flow.

The landing page follows this locked order: header, hero, key benefits, more
than a business card, professional-social use case, how it works, membership,
security, final CTA, and footer. Marketing visuals are CSS/SVG/code-native,
bright monochrome, mobile-first, and do not depend on raster screenshots.

All public, legal, authentication, member, and admin pages share the same
monochrome design vocabulary and Light/Dark preference control. First-time
visitors are offered an explicit choice. Later pages follow the cached
preference without changing the selected theme of a user's public card.

The member Resume Enhancement workspace creates the career brief, uploads a
private source CV as `.docx` up to 10 MiB, exposes a recoverable DRAFT upload
state, and enables authenticated download only after the Specialist candidate
passes quality review and is released. The Specialist workspace downloads the
authorized source, uploads internal/final DOCX versions, and performs the
existing quality-release workflow; storage paths remain private.

Dashboard: overview, card identity/contact/design/social/catalog/settings, billing, account.

Starter: secure management entry/editor; manage token tidak masuk analytics/error log.

Admin: dashboard, users, cards, plans, payments, themes, activity.

Dashboard includes QR sharing panel; public card may open an accessible QR dialog.

## Card settings

Basic/Pro card settings include `SlugField`.
Starter settings display the random public URL as read-only with copy action.

## Card design page

`/app/card/design` provides ThemePicker, live preview, orientation filter, plan locks, and save.
