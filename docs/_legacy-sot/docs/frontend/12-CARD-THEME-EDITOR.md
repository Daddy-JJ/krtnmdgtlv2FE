# Card Theme Editor

## Control panel

Path:
`/app/card/design`

Controls:
- theme gallery;
- tier badge;
- landscape/portrait filter for Pro;
- live card preview;
- locked theme overlay;
- upgrade CTA;
- save theme;
- reset preview;
- responsive preview switcher.

## Field editor

Path:
`/app/card/identity` and `/app/card/contact`.

The user edits normalized card fields once. All themes consume the same data.

## Preview behavior

- preview uses unsaved form state;
- theme change must not overwrite data;
- save theme and save fields are separate operations;
- unsupported/empty optional fields hide gracefully;
- long names, emails, websites, and addresses wrap safely;
- vertical themes remain readable on mobile.
- vertical and landscape themes visibly render the same populated core contact
  fields and social links; orientation may only change their composition.
- preview data keeps `canonicalUrl` and `qrImageUrl` separate; only `qrImageUrl` may be assigned to the QR image source.
- external website, Maps, social, and catalog links accept only validated HTTP(S) URLs.
- gallery thumbnails and the selected preview load the current registry template
  and shared card-theme stylesheet with cache revalidation, then render through
  the same safe card renderer used by the public card. Registry PNGs are fallback
  assets only and must not override the live composition.

## Membership

- Starter cannot select paid themes.
- Basic can select exactly three cumulative themes.
- Pro can select all ten.
- If a plan expires, current paid theme may remain stored but public rendering must apply downgrade policy defined by Membership service.
