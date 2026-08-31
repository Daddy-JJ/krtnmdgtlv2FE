# Migration Plan

1 users; 2 plans; 3 plan_features; 4 themes; 5 plan_theme_access; 6 subscriptions; 7 cards; 8 card_contacts; 9 starter_manage_tokens; 10 refresh_tokens; 11 password reset; 12 email_otps; 13 social; 14 catalog; 15 payments; 16 payment_events; 17 mail_outbox/mail_delivery_logs; 18 activity_logs; 19 seed tiers/capabilities/themes.

Migration membutuhkan up, safe down, index review, empty/existing DB test, backup note untuk destructive change.

Add/verify:
- themes;
- plan_theme_access;
- selected theme reference on cards;
- ten theme seed records;
- cumulative plan access seed records.
