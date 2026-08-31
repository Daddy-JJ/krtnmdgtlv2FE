# Membership Matrix — Final

| Kategori | Fitur/Field | Starter | Basic | Pro |
|---|---|:---:|:---:|:---:|
| Access | Login | ❌ | ✅ | ✅ |
| URL | Public URL | Random | Custom | Custom |
| Feature | QR Code | ✅ | ✅ | ✅ |
| Feature | Design kartu | 1 | 3 | 10 |
| Feature | Edit kapan saja | ✅ | ✅ | ✅ |
| Identity | Nama | ✅ | ✅ | ✅ |
| Identity | Role/Jabatan | ✅ | ✅ | ✅ |
| Identity | Organization/Perusahaan | ✅ | ✅ | ✅ |
| Contact | Office Phone | ✅ | ✅ | ✅ |
| Contact | Mobile Phone | ✅ | ✅ | ✅ |
| Contact | Email | ✅ | ✅ | ✅ |
| Contact | Website | ✅ | ✅ | ✅ |
| Contact | Alamat | ✅ | ✅ | ✅ |
| Branding | Logo | ❌ | ❌ | ✅ |
| CTA | Click to WhatsApp | ❌ | ❌ | ✅ |
| Social | Social URL | 0 | 2 | 5 |
| Marketing | Catalog | 0 | 2 | 10 |
| Location | Google Maps | ❌ | ✅ | ✅ |
| Commerce | Upgrade & Payment | ✅ | ✅ | ✅ |
| Commerce | Subscription term | Free | Annual · 365 hari | Annual · 365 hari |
| Service | Resume Enhancement | ❌ | ❌ | 1 beneficiary / subscription period |

Resume Enhancement is manually delivered by Kartunama Digital Specialist,
includes at most three revisions, and has private 90-day result retention.

## Capability keys
`design_limit` 1/3/10; `social_link_limit` 0/2/5; `catalog_item_limit` 0/2/10; custom slug/logo/WhatsApp/Maps booleans.

## URL detail

| Rule | Starter | Basic | Pro |
|---|---|---|---|
| Root public URL | ✅ | ✅ | ✅ |
| Random mixed-case slug | ✅ | ❌ | ❌ |
| Custom slug editing | ❌ | ✅ | ✅ |
| Suggested slug | ❌ | ✅ | ✅ |

## Final card-theme allocation

| Plan | Total themes available | Landscape | Portrait |
|---|---:|---:|---:|
| Starter | 1 | 1 | 0 |
| Basic | 3 cumulative | 3 | 0 |
| Pro | 10 cumulative | 7 | 3 |

Basic receives the Starter theme plus two Basic additions.
Pro receives all Starter/Basic themes plus seven Pro additions.

Basic dan Pro adalah subscription tahunan 365 hari. Harga dapat dikelola admin,
namun durasi annual tidak dapat diubah menjadi term lain melalui dashboard.
Aktivasi dan renewal tetap authoritative di backend setelah payment evidence
terverifikasi.

## Fixed upgrade fee matrix

Midtrans tidak menghitung prorate upgrade membership secara otomatis untuk MVP,
sehingga checkout upgrade memakai harga transisi internal yang dikontrol
backend:

| Current tier | Target tier | Upgrade fee |
|---|---|---:|
| Starter | Basic | IDR 55,000 |
| Starter | Pro | IDR 97,000 |
| Basic | Pro | IDR 55,000 |
| Pro | - | Tidak ada opsi upgrade |

Setelah pembayaran upgrade terverifikasi server-side, target tier aktif selama
365 hari baru sejak timestamp pembayaran sukses.
