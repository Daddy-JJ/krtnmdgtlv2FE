# Business Rules

## Starter ownership
- Tanpa akun.
- Random public slug.
- Dikelola dengan manage token yang tidak tampil di public URL.
- Token disimpan hash-only.

## Basic/Pro ownership
- Memerlukan akun.
- Satu akun memiliki satu kartu aktif pada MVP.
- Mutation memerlukan authentication dan ownership check.
- Custom slug unik case-insensitive.

## Edit anytime
Starter memakai manage token; Basic/Pro memakai login. Kartu tetap dapat disuspend karena abuse.

## Upgrade
Starter login/register lalu claim card. Plan aktif hanya setelah payment terverifikasi server-side. Limit selalu dihitung backend.
Midtrans tidak menangani prorate upgrade otomatis pada MVP, sehingga upgrade
memakai tiga harga transisi internal: Starter ke Basic IDR 55,000; Starter ke
Pro IDR 97,000; Basic ke Pro IDR 55,000. Pro tidak memiliki opsi upgrade.
Upgrade sukses memulai entitlement target tier baru selama 365 hari dari
timestamp payment sukses terverifikasi.

## Downgrade
Data berlebih tidak otomatis dihapus, tetapi penambahan/publikasi dibatasi sampai sesuai limit.

## Slug
Starter random minimal 12 karakter. Basic/Pro custom. Reserved words dilarang.

## Payment
Harga dikelola admin. Basic dan Pro adalah annual subscription dengan durasi
entitlement terkunci 365 hari. Aktivasi dan renewal hanya terjadi setelah
payment evidence diverifikasi server-side melalui proses idempotent.

## Public URL rules

- Starter receives a non-editable seven-letter mixed-case random slug.
- Basic/Pro may edit their custom slug in card settings.
- Basic/Pro receive a suggested slug from two first-name letters plus normalized mobile phone.
- The phone-based suggestion requires a visible privacy warning and user confirmation.
- Slug changes update the canonical URL and QR payload.

## v2.3 Midtrans
Paid membership uses server-side plan prices and a fixed annual 365-day term.
Browser callbacks cannot activate, renew, or upgrade a plan. A verified annual
renewal extends entitlement by exactly 365 days from the later active end date
or verified payment time. A verified upgrade starts a fresh target-tier
365-day entitlement from the verified payment time.
