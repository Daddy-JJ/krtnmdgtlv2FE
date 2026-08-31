# Card Theme Catalog

## Access model

Theme access is cumulative:

- Starter: 1 theme.
- Basic: 3 themes total — Starter plus 2 Basic additions.
- Pro: 10 themes total — all Starter/Basic themes plus 7 Pro additions.

## Themes

| # | Code | Name | Minimum plan | Orientation |
|---:|---|---|---|---|
| 1 | starter-clean | Aksara | Starter | Landscape |
| 2 | basic-blue-line | Bayu | Basic | Landscape |
| 3 | basic-soft-geometry | Baskara | Basic | Landscape |
| 4 | pro-navy-gold-split | Nilam | Pro | Landscape |
| 5 | pro-white-navy-panel | Prasasti | Pro | Landscape |
| 6 | pro-editorial-gold | Padma | Pro | Landscape |
| 7 | pro-luxury-frame | Kanaka | Pro | Landscape |
| 8 | pro-vertical-black-gold | Naya | Pro | Portrait |
| 9 | pro-vertical-light-panel | Kirana | Pro | Portrait |
| 10 | pro-vertical-modern-dark | Mahardika | Pro | Portrait |

Approved portrait visual mapping:

- P5 / `pro-vertical-black-gold`: midnight glass panels with cyan edge glow.
- P6 / `pro-vertical-light-panel`: ivory folded paper with navy corners and restrained gold trim.
- P7 / `pro-vertical-modern-dark`: raised white identity panel over an indigo field with translucent glass blocks.

All three portrait compositions use a centered logo-led hierarchy followed by
name, role, organization, a visible compact contact list, social links, and QR.
Office phone, mobile phone, email, website, and address have the same visual
field availability as landscape themes. Empty optional rows still collapse, so
orientation changes composition only and never removes populated contact data
from the card face.

## Field contract

Every theme must support the same core contact fields:

| UI field | Database | vCard/VCF |
|---|---|---|
| Full Name | card_contacts.full_name | FN and N |
| Job Title | card_contacts.job_title | TITLE |
| Organization | card_contacts.organization | ORG |
| Office Phone | card_contacts.office_phone | TEL;TYPE=WORK,VOICE |
| Mobile Phone | card_contacts.mobile_phone | TEL;TYPE=CELL,VOICE |
| Email | card_contacts.email | EMAIL;TYPE=INTERNET |
| Website | card_contacts.website_url | URL |
| Address | card_contacts.address_text | ADR |

Web-only fields:
- logo;
- Maps URL;
- `canonicalUrl`, the root public card link;
- `qrImageUrl`, the same-origin PNG endpoint rendered in an `<img>`;
- social links;
- catalog.

## Critical rule

A theme is presentation only. Theme templates must not own separate copies of contact information.

Generated and public cards never display membership labels such as `Starter`, `Basic`, or `Pro`. Plan codes remain authorization data, not visual card content.

Every template uses proportional responsive spacing and a shared adaptive typography contract. Long identity/contact values may wrap to a maximum of two lines and trigger smaller typography/dense spacing classes; empty contact rows, empty social lists, and empty logo slots collapse without leaving visual gaps. Company logo rendering remains Pro-only.

The member theme picker renders its thumbnail and selected preview directly from
the current template and `card-themes.css` composition inside an isolated style
boundary. This keeps the picker synchronized with the public-card renderer even
after a template or CSS revision. Registry preview PNGs remain deterministic
fallback/admin assets, use the normalized example field contract, and remain
free of membership labels. Pro previews may show only a neutral company-logo
placeholder; they must not invent or embed a KartuNamaDigital.id brand logo.
