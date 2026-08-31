# Data Domain Model

- Identity/contact: `card_contacts`.
- Card/system/branding: `cards`; theme catalog/access: `themes`, `plan_theme_access`.
- Marketing: `card_social_links`, `catalog_items`.
- Access: `users`, refresh/manage/verification/reset tokens.
- Commerce: `plans`, `plan_features`, `subscriptions`, `payments`, `payment_events`.
- Governance: `activity_logs`.

WhatsApp CTA diturunkan dari mobile phone tervalidasi dan capability plan.

QR PNG and VCF are derived outputs, not core entities.

## Theme domain

`themes` stores presentation metadata.
`plan_theme_access` maps plan access.
`cards.theme_code` stores the selected theme.
Contact identity remains in `card_contacts`; themes never duplicate contact fields.
