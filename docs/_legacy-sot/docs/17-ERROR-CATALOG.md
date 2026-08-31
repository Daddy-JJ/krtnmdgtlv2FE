# Error Catalog

| Code | HTTP | Meaning |
|---|---:|---|
| VALIDATION_ERROR | 422 | Field invalid |
| AUTH_REQUIRED | 401 | Authentication required |
| INVALID_CREDENTIALS | 401 | Login failed |
| EMAIL_NOT_VERIFIED | 403 | Verification required |
| FORBIDDEN | 403 | Permission denied |
| RESOURCE_NOT_FOUND | 404 | Resource absent |
| SLUG_UNAVAILABLE | 409 | Slug used/reserved |
| PLAN_LIMIT_REACHED | 409 | Limit reached |
| PLAN_NOT_PURCHASABLE | 409 | Paid plan price or annual 365-day term is invalid |
| PLAN_DURATION_LOCKED | 409 | Basic/Pro duration cannot differ from 365 days |
| FEATURE_NOT_AVAILABLE | 403 | Not in plan |
| STARTER_TOKEN_INVALID | 401 | Manage token invalid/revoked |
| CSRF_INVALID | 403 | Missing or invalid session-bound CSRF token |
| PAYMENT_NOT_VERIFIED | 409 | Payment unconfirmed |
| PAYMENT_SIGNATURE_INVALID | 400 | Invalid webhook signature |
| RATE_LIMITED | 429 | Too many requests |
| FILE_INVALID | 422 | Upload rejected |
| INTERNAL_ERROR | 500 | Unexpected error |
| SERVICE_UNAVAILABLE | 503 | Required infrastructure is unavailable |
| METHOD_NOT_ALLOWED | 405 | Route exists but does not support the HTTP method |

Response tidak boleh membuka SQL, stack trace, secret, atau filesystem path.

| QR_RENDER_FAILED | 503 | QR renderer unavailable |
| QR_CACHE_FAILED | 500 | QR cache failed |

| SLUG_RESERVED | 422 | Slug is a reserved route |
| SLUG_FORMAT_INVALID | 422 | Slug format is invalid |
| SLUG_CHANGE_NOT_ALLOWED | 403 | Current plan cannot edit slug |

| THEME_NOT_FOUND | 404 | Theme code is unknown/inactive |
| THEME_NOT_ALLOWED | 409 | Effective plan cannot use selected theme |
| THEME_RENDER_FAILED | 500 | Theme template could not render |

| OTP_INVALID_OR_EXPIRED | 422 | OTP invalid/expired |
| OTP_ATTEMPTS_EXCEEDED | 429 | Attempts exceeded |
| OTP_RESEND_COOLDOWN | 429 | Resend too soon |
| EMAIL_DELIVERY_UNAVAILABLE | 503 | SMTP unavailable |
| PERMISSION_REQUIRED | 403 | RBAC permission missing |
| RECENT_AUTH_REQUIRED | 403 | High-risk action requires recent authentication |
| RESUME_SERVICE_PRO_REQUIRED | 403 | Active Pro required |
| RESUME_SERVICE_EMAIL_VERIFICATION_REQUIRED | 403 | Verified email required |
| RESUME_SERVICE_ENTITLEMENT_USED | 409 | Period benefit consumed |
| RESUME_SERVICE_BENEFICIARY_LOCKED | 409 | Beneficiary immutable |
| RESUME_SERVICE_ACTIVE_REQUEST_EXISTS | 409 | Another active request exists |
| RESUME_REQUEST_NOT_FOUND | 404 | Resume request absent/inaccessible |
| RESUME_REQUEST_INVALID_STATUS | 409 | Invalid workflow transition |
| RESUME_REQUEST_NOT_ASSIGNED | 403 | Specialist assignment required |
| RESUME_FILE_TOO_LARGE | 413 | Resume file exceeds role limit |
| RESUME_FILE_TYPE_NOT_ALLOWED | 422 | Extension not allowed |
| RESUME_FILE_MIME_MISMATCH | 422 | Signature/type mismatch |
| RESUME_FILE_UNSAFE | 422 | Unsafe/encrypted/macro file |
| RESUME_OUTPUT_MUST_BE_DOCX | 422 | Deliverable must be DOCX |
| RESUME_REVISION_LIMIT_REACHED | 409 | Three revisions consumed |
| RESUME_REVISION_NOT_ALLOWED | 409 | Revision unavailable in status |
| RESUME_INFORMATION_INCOMPLETE | 422 | Required quality/data check missing |
| RESUME_DOWNLOAD_FORBIDDEN | 403 | Download authorization denied |
| RESUME_FILE_EXPIRED | 410 | Retention elapsed |
| RESUME_FILE_DELETED | 410 | Physical file deleted |
