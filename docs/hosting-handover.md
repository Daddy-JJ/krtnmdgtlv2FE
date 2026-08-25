# KartuNamaDigital — Hosting Handover

Dokumen ini adalah peta operasional non-rahasia untuk troubleshooting dan deploy. Jangan menyimpan PAT, password database, isi `.env`, private key, atau token di repository.

## Repository dan lokasi kerja

| Komponen | Repository GitHub | Lokasi server | Catatan |
| --- | --- | --- | --- |
| Frontend | `Daddy-JJ/krtnmdgtlv2FE` | `/home/karj9582/public_html/repositories/krtnmdgtlv2FE` | Sumber deploy website utama. Branch `main`. |
| Frontend live | — | `/home/karj9582/public_html` | Document root `kartunamadigital.id`; ini **bukan** working tree Git. |
| Backend canonical source | `Daddy-JJ/krtnmdgtlv2` | `/home/karj9582/repositories/krtnmdgtlv2-source/backend` | Monorepo yang di-clone dengan PAT; gunakan sebagai sumber update backend. |
| Backend runtime | — | `/home/karj9582/apps/kartu-api` | Application root Node.js untuk `api.kartunamadigital.id`. Simpan `.env` dan `storage/` di sini. |
| Backend Git lama (legacy) | `Daddy-JJ/krtnmdgtlv2API` | `/home/karj9582/repositories/krtnmdgtlv2API` | **Jangan deploy, reset, atau commit** dari sini. Working tree pernah tercampur runtime, cache, frontend, dan perubahan lokal. |

Lokasi lokal pengembangan frontend yang digunakan Codex:

```text
/Applications/XAMPP/xamppfiles/htdocs/KartuNamaDigital-v2/frontend
```

Backend lokal berada di sibling `../backend` dari folder frontend tersebut.

## Deploy frontend

Setelah commit sudah di-push ke `main`, update repository server lalu salin file tracked ke document root:

```bash
cd /home/karj9582/public_html/repositories/krtnmdgtlv2FE
git pull --ff-only origin main
git status --short
/bin/cp -R ./* /home/karj9582/public_html/
/bin/cp .htaccess /home/karj9582/public_html/
```

Kemudian hard refresh browser. Jangan menaruh repository Git baru langsung di `/home/karj9582/public_html`: folder tersebut sudah berisi website live.

`.cpanel.yml` di root repo FE memakai `DEPLOYPATH=/home/karj9582/public_html/`. Jika cPanel Git Version Control gagal deploy, gunakan proses terminal di atas setelah memastikan repository bersih.

## Deploy backend

Backend menjalankan Node.js 22 dan Passenger dengan application root:

```text
/home/karj9582/apps/kartu-api
```

Aktifkan virtual environment sebelum `npm`:

```bash
source /home/karj9582/nodevenv/apps/kartu-api/22/bin/activate
```

Proses update aman:

1. Pull sumber canonical di `/home/karj9582/repositories/krtnmdgtlv2-source`.
2. Salin hanya isi folder `backend/` ke `/home/karj9582/apps/kartu-api`, dengan mengecualikan `.env` dan `storage/`.
3. Jalankan `npm ci --omit=dev` dan `npm run migrate` dari application root.
4. Restart aplikasi lewat cPanel Node.js Selector.
5. Verifikasi `https://api.kartunamadigital.id/api/v1/health`.

Jangan mengganti atau menghapus `.env` maupun `storage/` pada runtime. Backup sebelum rebuild sebelumnya berada di:

```text
/home/karj9582/backups/kartu-api-before-rebuild-20260825
```

Migration `009_starter_email_claim_lookup.sql` sudah diterapkan di production. Migration `007_rbac_authority_reconciliation.sql` memiliki checksum yang sudah tercatat di database; jangan mengubah isinya. Source canonical harus memakai versi yang sama dengan production.

## Catatan Starter ownership

- Kartu Starter dibuat sebelum akun mempunyai `user_id` kosong dan menyimpan email kontak.
- Saat registrasi terverifikasi atau login, backend auto-claim hanya jika **tepat satu** kartu Starter tanpa pemilik memiliki email yang sama.
- Bila ada lebih dari satu kartu test dengan email sama, backend sengaja tidak memilih kartu mana pun. Gunakan link `Kelola kartu` dari email kartu spesifik, atau lakukan rekonsiliasi administratif yang mengunci tepat satu `public_id` dan email verified.
- Untuk testing, jangan hapus row `users` saja di phpMyAdmin. Hapus juga data kartu/test token terkait atau gunakan alias email unik, misalnya `name+test1@gmail.com`.

## Perubahan penting terakhir

- FE `9382719`: ownership flow Starter melalui link pengelolaan, login, dan claim aman.
- FE `a9fccb6`: pada Media Sosial/Katalog Starter, error `PLAN_LIMIT_REACHED` ditampilkan sebagai `Sedang kami siapkan.`
- Backend sebelumnya sudah memuat auto-claim Starter berbasis email verified serta migration index `009`.

## Prinsip troubleshooting

1. Bedakan source Git, runtime backend, dan document root live—ketiganya bukan folder yang sama.
2. Gunakan `git status --short`, `git log -1 --oneline`, dan health endpoint sebelum menyimpulkan deploy berhasil.
3. Jangan memasukkan secret ke command history, commit, screenshot, atau dokumen ini.
4. Jika frontend produksi tampak lama, verifikasi commit di repository FE server lalu ulangi copy ke `public_html`; restart API tidak diperlukan untuk perubahan frontend.
