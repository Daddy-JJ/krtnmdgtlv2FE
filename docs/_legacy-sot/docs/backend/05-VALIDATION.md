# Validation and Normalization

Unicode-aware length untuk identity; lowercase email/slug; phone normalize; URL HTTPS production; slug ASCII-hyphen + reserved list; social platform enum; catalog plain text bounded; IDs strict.

Validation sebelum Service. Output encoding tetap wajib.

## Slug validation

Starter random slug:
- generated server-side;
- exactly seven ASCII letters;
- case-sensitive;
- not accepted from client.

Basic/Pro custom slug:
- lowercase ASCII letters, digits, hyphen;
- reserved path check;
- uniqueness check;
- plan capability check;
- transaction-safe final conflict handling.

## Theme code

- exact allowlisted code;
- active theme;
- plan access;
- valid orientation metadata;
- no path accepted from client.
