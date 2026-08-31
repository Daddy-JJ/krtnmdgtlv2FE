# Information Architecture

## Public
`/`, `/pricing`, `/create`, `/blog/satu-link-untuk-identitas-profesional/`,
`/blog/cv-resume-builder/`, root public card `/{slug}`, auth pages,
terms/privacy.

The landing page uses the approved bright monochrome marketing system. The
article routes are semantic, indexable long-form pages with the same header,
footer, accessibility baseline, and code-native visual language. The CV Resume
Builder article explains the locked Resume Enhancement benefit for Pro without
exposing member-only documents or operational data.

System routes are matched before the root slug route. Reserved system words cannot be used as Basic/Pro custom slugs. `/c/{slug}` is not a public route.

## Dashboard
`/app`, card identity/contact/design/social/catalog/settings, billing, account.

## Starter
`/manage` melalui secure cookie/one-time handoff; public slug tidak cukup untuk edit.

## Admin
Dashboard, users, cards, plans, payments, themes, activity.

Add `/admin/system/qr`.

## Card settings route

`/app/card/settings`

Contains:
- Custom URL field for Basic/Pro;
- URL preview;
- suggested URL actions;
- availability state;
- slug-change warning.

## Design routes

- `/app/card/design`
- `/admin/themes`
- `/admin/themes/{code}`

The user design screen includes gallery, orientation filter, preview, tier lock, and save action.
