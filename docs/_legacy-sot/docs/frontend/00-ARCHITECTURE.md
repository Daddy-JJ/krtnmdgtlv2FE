# Frontend Architecture

## Global visual theme

Every substantive website shell loads `/assets/css/site-theme.css` and
`/assets/js/site-theme.js`. The controller applies the preferred Light or Dark
palette before body rendering, offers an accessible choice on the first visit,
and stores only `knd.theme.preference` in browser storage. Authentication,
manage, refresh, edit, and API credentials remain forbidden from browser
storage.

The theme applies to public information, legal, authentication, user workspace,
and admin workspace pages. The canonical public-card renderer is deliberately
excluded because its appearance is controlled by the card owner's authorized
theme selection.

HTML + Tailwind CSS Play CDN + Vanilla JavaScript modules + Fetch API. No React/Vue/Next.

Layers: pages, layouts, components, services, small page state, validators, locales. Backend tetap validation authority.

## Theme rendering

Theme templates live under `frontend/components/card-themes`.
A shared renderer binds normalized card data using safe `data-field` slots.
Theme registry metadata lives in `frontend/config/theme-registry.json`.
