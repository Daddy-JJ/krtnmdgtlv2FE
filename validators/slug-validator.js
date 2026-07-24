const reserved = new Set(['api', 'app', 'admin', 'login', 'logout', 'register', 'pricing', 'create', 'manage', 'privacy', 'terms', 'assets', 'storage', 'health', 'favicon.ico', 'robots.txt', 'sitemap.xml']);
const format = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSlug(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function validateSlug(value) {
  const slug = normalizeSlug(value);
  if (slug.length < 3) return 'Custom URL minimal 3 karakter.';
  if (slug.length > 100) return 'Custom URL maksimal 100 karakter.';
  if (!format.test(slug)) return 'Gunakan huruf kecil, angka, dan hyphen di tengah.';
  if (reserved.has(slug)) return 'Custom URL ini termasuk reserved word.';
  return '';
}

export function canEditSlug(planCode) {
  return planCode === 'basic' || planCode === 'pro';
}
