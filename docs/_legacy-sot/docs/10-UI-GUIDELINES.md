# UI Guidelines

Mobile-first, form ringan, live preview, primary action jelas, limit plan dijelaskan sebelum error, upgrade prompt relevan.

Forms wajib label nyata, inline error, safe input preservation, confirmation untuk destructive action.

Istilah konsisten: Nama, Jabatan, Perusahaan, Telepon kantor, Nomor handphone, Website, Alamat, Simpan Kontak.

## Custom URL field

Label: `Custom URL`

UI pattern:

```text
https://kartunamadigital.id/ [ editable-slug ]
```

States:
- suggested;
- checking;
- available;
- unavailable;
- reserved;
- invalid;
- saved.

Show:
- `Gunakan saran`;
- alternative non-phone suggestion;
- privacy note for phone-based URL;
- warning before changing an existing published slug.

## Theme gallery

Each tile shows:
- preview image;
- theme name;
- orientation;
- minimum plan;
- selected/locked state.

Do not communicate plan lock by color alone.
Preserve user data when switching previews.
