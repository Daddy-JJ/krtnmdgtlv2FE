# Theme Engine Specification

## Responsibilities

- list active themes;
- resolve theme access by effective plan;
- validate theme selection;
- return theme metadata to frontend;
- save only `cards.theme_code`;
- keep contact data independent from presentation;
- support orientation metadata;
- support admin activation/order/preview management.

## Services

```text
ThemeCatalogService
ThemeAccessPolicy
ThemeSelectionService
ThemeRepository
```

## Access rules

- Starter: Aksara (`starter-clean`) only.
- Basic: Aksara plus Bayu (`basic-blue-line`) and Baskara (`basic-soft-geometry`).
- Pro: all ten themes — Aksara, Bayu, Baskara, Nilam, Prasasti, Padma, Kanaka, Naya, Kirana, and Mahardika.

Every authenticated user may preview all active themes. The frontend marks unavailable
themes as locked, while the backend remains authoritative and rejects unauthorized selection.

## API

- `GET /themes`
- `GET /cards/{publicId}/themes`
- `PATCH /cards/{publicId}/theme`
- Admin: `GET/POST/PATCH /admin/themes`

## Theme selection transaction

1. Load card and owner.
2. Resolve effective plan.
3. Load active theme.
4. Check minimum plan access.
5. Save `cards.theme_code`.
6. Write activity log.
7. Return updated public preview metadata.
