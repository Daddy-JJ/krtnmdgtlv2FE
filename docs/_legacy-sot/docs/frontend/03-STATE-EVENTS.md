# State and Events

Lifecycle: `init()`, `load()`, `bindEvents()`, `render()`, `destroy()`.

Custom event naming: `domain:action`, contoh `card:saved`, `plan:limit-reached`, `auth:expired`, `payment:updated`.

Prefer local page state; auth state hanya status user/session, tidak raw refresh token.

Add `qr:loaded`, `qr:downloaded`, `qr:error`, `link:copied`, and `slug:changed`.

Slug events:
- `slug:suggested`
- `slug:checking`
- `slug:available`
- `slug:unavailable`
- `slug:changed`
- `slug:saved`

Theme events:
- `theme:selected`
- `theme:previewed`
- `theme:saved`
- `theme:locked-selected`
- `card-field:changed`
