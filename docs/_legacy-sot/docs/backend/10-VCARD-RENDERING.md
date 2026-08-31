# vCard Rendering Service

QR and vCard are separate rendering concerns.

`PublishedCardAggregate -> VCardRenderingService -> VCardFormatter -> VCF bytes`

VCF 3.0 default, UTF-8/CRLF, correct escaping/folding, no QR dependency, generated from current published card, no relational binary storage.

## Name and address field mapping

`N` is emitted as the structured vCard 3.0 value `Family;Given;Additional;Prefix;Suffix`.
For the existing single `fullName` field, a comma is treated as `Family, Given`; otherwise the first token is `Given` and the remaining tokens are `Family`.
`FN` remains the original display name.

`ADR;TYPE=WORK` is emitted as `PO Box;Extended;Street;Locality;Region;Postal Code;Country`.
Existing one-line addresses remain in the Street slot. To provide all address slots without a schema change, the address field may contain newline-separated values in this order: Street, City, Province/Region, Postal Code, Country (pipe separators are also accepted).
Each component is escaped independently while vCard field separators remain structural, so iOS and Android can populate their City, Province, Postal Code, and Country fields correctly.
