# Frontend Project Structure

```text
krtnmddgtlv2FE_SOT/
├── index.html                 # landing page
├── about/, blog/, ...         # public route shells
├── login/, register/, ...     # auth/onboarding shells
├── app/                       # authenticated member shells
├── admin/                     # Super Admin shells
├── specialist/                # CV Specialist shells
├── public-card/               # root-slug public card shell
├── pages/                     # page controllers
├── services/                  # API/presentation boundaries
├── components/                # shared UI and card templates
├── validators/                # browser validation
├── utils/                     # browser utilities
├── config/                    # runtime config and theme registry
├── assets/                    # CSS, images, icons, previews
├── locales/                   # locale resources
├── api/v1/[...path].js        # Vercel backend proxy
├── scripts/build-static.mjs   # public-output allowlist
├── tests/                     # native Node tests
├── docs/                      # canonical SOT and operations
├── docs/_legacy-sot/          # read-only historical archive
├── dist/                      # generated deployment output
├── package.json
└── vercel.json
```

## Shell and controller pairing

Route directories contain `index.html` shells. Behavior belongs in a matching
module under `pages/`. Shells may share `components/app-shell.js`, global theme
assets, validators, and service adapters.

Examples:

- `app/card/identity/index.html` → `pages/app/card-editor.js`
- `app/card/design/index.html` → `pages/app/card-design.js`
- `admin/index.html` → `pages/admin/super-admin-workspace.js`
- `public-card/index.html` → `pages/public/card.js`

Compatibility shells such as `/app/card/contact/` may redirect to a canonical
editor and are intentional when tested.

## Service boundary

`services/api-client.js` owns base URL, cookie credentials, timeout, refresh,
CSRF header, request ID, and normalized errors. Feature services define endpoint
operations. Page controllers should not duplicate API transport logic.

Direct `fetch()` is reserved for static resources or specialized download
handling documented in the architecture/API contract.

## Generated and historical directories

- `dist/` and `node_modules/` are generated and ignored.
- `docs/_legacy-sot/` is immutable historical evidence.
- Empty scaffold directories do not prove a feature is implemented; use code,
  test, and `STATUS.md`.
