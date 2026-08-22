const allowedIntents = new Set(['basic', 'pro']);

export function safeReturnTo(value) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '';
  return value;
}

export function starterPublicIdFromReturnTo(returnTo) {
  const safe = safeReturnTo(returnTo);
  if (!safe) return '';
  const target = new URL(safe, globalThis.location?.origin ?? 'https://kartunamadigital.id');
  return target.pathname === '/starter/manage/' ? target.searchParams.get('publicId') ?? '' : '';
}

export function safeMembershipIntent(value) {
  return allowedIntents.has(value) ? value : '';
}

export function withAuthContext(path, { returnTo = '', intent = '' } = {}) {
  const target = new URL(path, globalThis.location?.origin ?? 'https://kartunamadigital.id');
  const safePath = safeReturnTo(returnTo);
  const safeIntent = safeMembershipIntent(intent);
  if (safePath) target.searchParams.set('returnTo', safePath);
  if (safeIntent) target.searchParams.set('intent', safeIntent);
  return `${target.pathname}${target.search}`;
}

export function authErrorMessage(error, fallback = 'Kami belum dapat memproses permintaan ini. Silakan coba lagi.') {
  const code = String(error?.code ?? '');
  const messages = {
    INTERNAL_SERVER_ERROR: 'Layanan sedang mengalami kendala. Coba lagi beberapa menit lagi.',
    EMAIL_DELIVERY_UNAVAILABLE: 'Email belum dapat dikirim. Tunggu beberapa menit lalu coba lagi.',
    NETWORK_ERROR: 'Koneksi ke layanan terputus. Periksa internet Anda lalu coba lagi.',
    REQUEST_TIMEOUT: 'Permintaan terlalu lama. Silakan coba lagi.',
  };
  const message = messages[code] ?? error?.message ?? fallback;
  return error?.requestId ? `${message} Referensi: ${error.requestId}.` : message;
}
