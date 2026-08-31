# Authorization

Policies: Card view/update/delete/publish, Admin, StarterManage.

Order checks: actor/token valid → resource → ownership/admin → resource status → plan capability → limit.

Gunakan 404 bila perlu untuk mencegah resource enumeration.

Only Basic/Pro card owners and admins may update a custom slug.
Starter manage access cannot edit the random slug.

Theme mutation requires card ownership and effective-plan access.
Admin theme activation/reordering requires admin role.

Authenticated card creation requires a verified active user, an active Basic/Pro subscription, and no existing active card. Starter cards are not created through the authenticated card endpoint.
