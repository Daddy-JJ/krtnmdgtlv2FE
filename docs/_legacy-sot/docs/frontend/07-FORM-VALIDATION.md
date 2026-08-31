# Form Validation

Client validation untuk UX, bukan authority. Tampilkan field error, fokus first invalid, preserve safe input, debounce slug check, prevent double submit, unsaved warning, map API 422 ke fields.

## Slug validation

Starter:
- no editable field.

Basic/Pro:
- lowercase letters, digits, hyphen;
- 3–100 characters;
- no leading/trailing hyphen;
- reserved words blocked;
- debounced availability check;
- final server check on save.
