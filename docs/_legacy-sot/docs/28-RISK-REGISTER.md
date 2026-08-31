# Risk Register

| Risk | Mitigation |
|---|---|
| Starter token lost | clear save/claim UX; recovery later |
| Token leaked | hash-only, cookie, rotation, no logs |
| VCF device variation | conservative properties, real-device test |
| Play CDN CSP/performance | production hardening/compile review |
| Webhook duplicate/replay | signature + idempotency |
| Scattered plan checks | central PlanCapabilityService |
| cPanel limitation | minimal stack, staging/runbook |
| Malicious upload | decode/re-encode and non-executable storage |
| Slug abuse | reserved list, rate limit, moderation |
| Pricing pending | admin-configurable price/duration |

QR risks: cPanel runtime, branded scan reliability, stale cache, arbitrary payload abuse; mitigations documented.

| Phone number exposed in suggested URL | Privacy/spam risk | Clear warning and non-phone alternatives |
| Case-insensitive DB collation | Starter collisions/routing errors | Case-sensitive slug storage/index |
| Root slug conflicts with app routes | Broken system pages | Reserved-word list and route precedence |
| Custom slug changed after distribution | Dead old links/QR | Warning and future redirect-history option |

| Theme duplicates contact data | Inconsistent VCF/public page | Shared normalized field contract |
| User injects template markup | XSS/security incident | Allowlisted server-defined theme codes |
| Long values break layout | Poor UX | Responsive wrapping and fixture tests |
| Paid theme remains after expiry | Plan leakage | Effective-plan rendering policy |
| QR styling reduces scanning | Broken sharing | Fixed QR rendering profile and quiet zone |
| Theme preview differs from runtime template | Misleading selection and visual regression | Treat previews as targets; Phase 6 must rebuild/verify each template against its preview before acceptance |
| Unsafe external URL schemes | XSS or unsafe navigation | Backend HTTP(S) allowlist plus frontend safe URL builder; never assign unvalidated user URL directly |
| OTP plaintext enters durable outbox | Credential exposure | Immediate in-memory OTP delivery only; resend generates a new hash-only OTP |
