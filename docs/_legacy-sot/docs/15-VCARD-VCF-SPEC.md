# vCard / VCF Specification

## Default
VCF 3.0 default untuk kompatibilitas import mobile yang luas; VCF 4.0 dapat menjadi alternatif eksplisit.

## Mapping
| App | VCF |
|---|---|
| full_name | FN dan N |
| job_title | TITLE |
| organization | ORG |
| office_phone | TEL WORK |
| mobile_phone | TEL CELL |
| email | EMAIL |
| website_url | URL |
| address_text | ADR |

Logo/catalog/WhatsApp tetap web-only. Maps dapat menjadi URL tambahan tetapi tidak menggantikan ADR. Social links tidak memakai property non-standard secara default.

UTF-8, CRLF, proper escaping/folding, CRLF injection prevention, safe filename.

## Theme independence

The selected visual theme has no effect on generated VCF.
VCF always reads normalized values from `card_contacts`.
Logo, QR, social links, catalog, and visual colors are not required core VCF fields.
