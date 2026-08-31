# Component Catalog

Global: AppHeader, PublicNavbar, DashboardSidebar, LanguageSwitcher, ToastRegion, ConfirmDialog, Loading/Error/Empty State.

Card: CardPreview, IdentityForm, ContactForm, DesignPicker, LogoUploader, SocialLinkList, CatalogList, MapsField, WhatsAppPreview, QRPanel, SaveContactButton.

Commerce: PricingCard, PlanBadge, UpgradeBanner, CheckoutButton, PaymentStatus.

Admin: DataTable, FilterBar, StatusBadge, PlanFeatureEditor, AuditTimeline.

Add QRPanel and QRDialog with loading, ready, unpublished, rate-limit, error, copy, open, enlarge, and download actions.

## SlugField

Inputs:
- current slug;
- suggested slug;
- public domain;
- plan;
- publication state.

Actions:
- edit;
- use suggestion;
- check availability;
- save;
- copy URL.

States:
- read-only Starter;
- dirty;
- checking;
- available;
- unavailable;
- invalid;
- conflict;
- saved.

## SlugChangeDialog

Warns that old links and QR images may stop working.

## v2.3 Midtrans
Payment components: UpgradePlanCard, CheckoutSummary, MidtransPayButton, PaymentStatusCard, PaymentTimeline, RetryPaymentButton.

## Theme components

- ThemePicker
- ThemeTile
- ThemePreview
- OrientationFilter
- LockedThemeOverlay
- CardFieldEditor
- ten approved card theme templates

## Email components
EmailOtpForm, OtpInput, ResendOtpButton, EmailVerificationStatus, and admin MailDeliveryStatus.
