# KartuNamaDigital Frontend Hosting Handover

Dokumen ini berisi informasi operasional frontend yang tidak rahasia. Backend
source, database, migration, mail worker, dan payment operations dikelola di
repository backend terpisah.

## Canonical topology

```text
Browser
  → Vercel frontend
  → same-origin /api/v1/*
  → Vercel Function proxy
  → backend HTTPS di shared hosting
```

Frontend tidak mengetahui credential backend. Proxy hanya membutuhkan
`BACKEND_API_BASE_URL`, misalnya `https://api.kartunamadigital.id`, tanpa path
`/api/v1`, query, fragment, username, atau password.

## Vercel project settings

| Setting | Value |
|---|---|
| Root Directory | Repository root |
| Framework Preset | Other |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` melalui `vercel.json` |
| Server variable | `BACKEND_API_BASE_URL` untuk Preview dan Production |

Jangan mengubah Output Directory kembali ke `.`. Source root memuat dokumentasi,
test, dan metadata yang bukan public asset.

## Release sequence

1. Pastikan working tree hanya memuat perubahan yang dimaksud.
2. Jalankan `npm ci`, `npm run build`, dan `npm test`.
3. Buat Vercel Preview deployment.
4. Verifikasi `/`, route publik, satu public slug, dan `/api/v1/health`.
5. Uji Login/Signup, Starter claim, cookie/CSRF, public card, serta file download
   terhadap backend staging yang stabil.
6. Promote deployment yang sama setelah acceptance; jangan rebuild source berbeda.

Proxy fail-closed ketika upstream kosong/tidak valid, memakai HTTP, localhost,
credentialed URL, path tambahan, atau `*.trycloudflare.com`.

## Transitional cPanel fallback

Vercel adalah target kanonis. Bila frontend lama masih harus diperbarui sementara
di cPanel, salin hanya static allowlist:

```bash
git pull --ff-only origin main
npm run build:static
/bin/cp -R dist/* /home/karj9582/public_html/
/bin/cp .htaccess /home/karj9582/public_html/
```

`.cpanel.yml` memakai boundary yang sama. Fallback memerlukan
`PUBLIC_API_BASE_URL=https://api.kartunamadigital.id/api/v1` dalam `.env` server
yang tidak di-track.

Copy tidak menghapus artefak lama. Jika document root pernah menerima seluruh
repository, lakukan audit dan pembersihan manual terpisah setelah target dan
backup diverifikasi. Operasi tersebut tidak dilakukan dari fase reintegrasi ini.

## Troubleshooting

- `BACKEND_NOT_CONFIGURED`: periksa `BACKEND_API_BASE_URL` di Vercel lalu redeploy.
- Static route hilang: pastikan directory/file runtime masuk allowlist
  `scripts/build-static.mjs` dan hasilnya ada di `dist/`.
- Login loop atau CSRF error: verifikasi same-origin proxy, cookie Secure/HttpOnly,
  backend origin, dan tidak ada direct cross-origin override yang tidak disetujui.
- Frontend lama: verifikasi deployment ID/commit Vercel dan lakukan hard refresh.
- API error: catat request ID; troubleshooting backend dilakukan di repository
  dan hosting backend terpisah.

Jangan menyimpan PAT, password, `.env`, private key, OTP, cookie, atau API token
di repository, command history, screenshot, dan dokumen ini.
