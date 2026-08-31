# File Index

## Start here

| File | Purpose |
|---|---|
| `README.md` | Entry point dan perintah lokal |
| `AGENTS.md` | Aturan wajib kerja dan precedence |
| `AI_CONTEXT.md` | Konteks ringkas repository |
| `LOCKED-PLAN.md` | Scope dan keputusan produk terkunci |
| `SOT-MANIFEST.md` | Peta source of truth |
| `STATUS.md` | Fakta implementasi, gap, dan validasi terakhir |

## Canonical frontend SOT

| File | Purpose |
|---|---|
| `docs/01-FRONTEND-ARCHITECTURE.md` | Struktur runtime, layer, route, dan dependency rule |
| `docs/02-PRODUCT-AND-MEMBERSHIP.md` | Fitur, tier, limit, dan user-flow contract |
| `docs/03-API-CONSUMER-CONTRACT.md` | REST contract yang dibutuhkan frontend |
| `docs/04-DEPLOYMENT.md` | Build dan deployment Vercel |
| `docs/05-DECISION-LOG.md` | Keputusan frontend yang disetujui product owner |
| `docs/hosting-handover.md` | Handover operasional non-secret |

## Runtime entry points

| Path | Purpose |
|---|---|
| `index.html` | Landing page |
| `create/index.html` | Starter creation |
| `login/`, `register/` | Authentication |
| `app/` | Member workspace |
| `admin/` | Super Admin workspace |
| `specialist/` | CV Specialist workspace |
| `public-card/index.html` | Shell kartu publik root-slug |
| `api/v1/[...path].js` | Vercel same-origin API proxy |

## Frontend layers

| Path | Responsibility |
|---|---|
| `pages/` | Controller per halaman |
| `services/` | API adapter dan presentation service |
| `components/` | Shared shell, form helper, dan card template |
| `validators/` | Client-side validation |
| `utils/` | Cookie, URL, dan auth-flow utilities |
| `config/` | Runtime config dan theme registry |
| `assets/` | Compiled CSS, source CSS, image, icon, theme preview |
| `locales/` | Locale resources; English saat ini deferred |
| `tests/` | Native Node contract/security tests |
| `scripts/build-static.mjs` | Allowlisted static build |

## Deployment files

- `vercel.json`: build, rewrites, dan output `dist/`.
- `.vercelignore`: material yang tidak diunggah.
- `.env.example`: nama variable publik/server-side tanpa secret.
- `.cpanel.yml` dan `.htaccess`: fallback transisi, bukan target kanonis.

## Historical material

`docs/_legacy-sot/` adalah snapshot read-only dari SOT monorepo lama. Gunakan
hanya untuk provenance atau audit. Jangan mengikuti path, status, atau precedence
di dalamnya sebagai instruksi aktif.
