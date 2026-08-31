# Design System

Token: primary/neutral/success/warning/danger; typography; spacing 4-48; radius; subtle shadow; focus ring.

Components: button, form field, card preview, pricing card, badge, alert, toast, modal/drawer, empty/skeleton, pagination, admin table.

Tailwind utility konsisten; class berulang menjadi component snippet; arbitrary value hanya bila token tidak cukup.

QR uses black on white, preserves quiet zone, and always shows normal URL fallback.

## URL editor component

`SlugField` contains:
- fixed domain prefix;
- editable slug input;
- availability icon/text;
- suggestion chips;
- privacy helper text;
- destructive-impact warning on change.

## Card theme primitives

- fixed theme registry code;
- orientation metadata;
- safe field slots;
- QR quiet zone;
- optional logo slot;
- social link container;
- responsive overflow rules;
- preview image;
- tier badge.

Theme-specific colors may vary, but text contrast and QR readability remain mandatory.
