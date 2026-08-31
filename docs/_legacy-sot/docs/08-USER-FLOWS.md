# User Flows

## Starter create
`Landing -> Form -> Validation -> Preview -> Submit -> Card Created -> Public URL + QR + Manage Access`

## Starter edit
`Manage Access -> Token Validation -> Editor -> Save -> Public Card Updated`

## Claim/upgrade
`Starter Editor -> Upgrade -> Register/Login -> Claim -> Choose Basic or Pro -> Payment -> Verified Webhook -> Activate target tier for 365 days`

Basic members see only Upgrade to Pro. Pro members do not see an upgrade CTA.

## Public visitor
`Public URL -> View -> CTA/Maps/Catalog -> Save Contact`

## Webhook
`POST -> Parse -> Verify signature -> Idempotency -> Status transition -> Subscription -> Audit -> 2xx`

## Basic/Pro custom URL flow

`Card Settings -> Suggested URL -> Edit or Accept -> Availability Check -> Privacy Warning -> Save -> Canonical URL Updated -> QR Cache Updated`

Failure:
- unavailable slug -> show alternatives;
- reserved slug -> validation error;
- concurrent collision -> return conflict and recheck;
- invalid format -> inline validation.

## v2.3 Midtrans
Midtrans flow: Valid Upgrade Transition -> Backend Fixed Fee Checkout -> Snap -> Pending UI -> Verified Webhook -> Target-tier 365-day Activation -> Feature Unlock.
