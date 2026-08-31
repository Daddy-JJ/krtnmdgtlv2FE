# Email OTP UX
- masked destination
- one accessible six-digit input or visually segmented equivalent
- `inputmode="numeric"`
- `autocomplete="one-time-code"`
- paste/autofill support
- resend countdown
- ARIA live errors
- states: sending, sent, verifying, verified, invalid, expired, attempts exceeded, cooldown, delivery unavailable

Account settings show current email, verification status, change email, and resend. Admin sees masked destination and delivery status, never OTP.
