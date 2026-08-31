# Legacy SOT Archive

Status: **READ-ONLY HISTORICAL SNAPSHOT**

Arsip ini mempertahankan dokumen SOT lama sebelum pembentukan SOT kanonis
frontend-only. Isinya bukan instruksi implementasi aktif dan tidak boleh dipakai
untuk menimpa keputusan product owner atau kontrak frontend yang akan dibentuk
pada fase berikutnya.

## Layout

- `docs/`: 162 file yang sebelumnya berada di `docs/`, dengan struktur relatif
  aslinya dipertahankan.
- `root/`: snapshot 12 file governance root sebelum rekonsiliasi.
- `../hosting-handover.md`: tidak termasuk arsip karena merupakan dokumen
  operasional tracked yang masih aktif.

Versi root `AGENTS.md`, `FILE-INDEX.md`, dan dokumen governance lainnya sengaja
tetap berada di root selama transisi agar urutan baca dan tooling tidak putus.
Snapshot di folder `root/` mempertahankan isi legacy sebelum file root tersebut
diganti pada fase pembentukan SOT kanonis.

## Integrity record

Tanggal karantina: 2026-09-01

| Collection | Files | Bytes | Aggregate SHA-256 |
|---|---:|---:|---|
| Legacy `docs/` | 162 | 2,861,325 | `8AE0B73883ECD856C6EC55542383E0DE8588CFFE8F2D0237326170FF3D77E58C` |
| Root governance snapshot | 12 | 95,338 | `BB3795E8A3CDA063891C5CDEA946F899600A0C048B65177A50BB01AB7646D54B` |

Aggregate dihitung dari daftar path asli yang diurutkan. Setiap baris memakai
format `path|byteLength|fileSha256`, digabung dengan LF, kemudian di-hash memakai
SHA-256. Seluruh 174 file diverifikasi kembali setelah move/copy dan cocok dengan
checksum sumbernya.

## Archive rules

- Jangan mengedit file snapshot untuk memperbaiki konflik SOT.
- Keputusan yang masih relevan harus diangkat secara eksplisit ke SOT kanonis.
- Jangan mengimpor arsitektur backend, database, atau deployment lama sebagai
  scope implementasi frontend.
- File dapat dikembalikan ke path asal menggunakan struktur yang dipertahankan,
  tetapi pemulihan harus dilakukan sebagai operasi terpisah dan terverifikasi.
