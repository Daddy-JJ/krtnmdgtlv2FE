# Backend Folder Structure

```text
backend/
├── src/package.json      # Explicit ESM boundary for application TypeScript
├── src/{modules,shared,config}/
├── src/modules/{auth,cards,catalog,membership,payments,public-profile,users}/
├── src/shared/{database,http,logging,security}/
├── database/{migrations,seeders}/
├── scripts/package.json  # Explicit ESM boundary for operational TypeScript
├── scripts/
├── storage/{cache,logs,private,public}/
├── tests/package.json    # Explicit ESM boundary for test TypeScript
├── tests/{unit,integration,contract,security}/
├── app.js               # Physical CommonJS bridge for hardcoded Passenger require()
├── passenger.cjs         # LiteSpeed Passenger CommonJS startup bridge
├── package.json          # CommonJS root boundary required by LiteSpeed
└── tsconfig.json
```

Module dapat berisi Controllers, Services, Repositories, Models, Validators, Policies, DTO.

`backend/src/modules/rendering/qr/`, `backend/src/modules/rendering/vcard/`, and `backend/storage/cache/qr/`.

```text
backend/src/modules/themes/
├── Controllers/
├── Services/
├── Repositories/
├── Policies/
├── DTO/
└── Validators/
```
