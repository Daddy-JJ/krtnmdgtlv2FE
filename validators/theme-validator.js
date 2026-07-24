const allowedCodes = new Set([
  'starter-clean',
  'basic-blue-line',
  'basic-soft-geometry',
  'pro-navy-gold-split',
  'pro-white-navy-panel',
  'pro-editorial-gold',
  'pro-luxury-frame',
  'pro-vertical-black-gold',
  'pro-vertical-light-panel',
  'pro-vertical-modern-dark',
]);

export function validateThemeCode(value) {
  const code = String(value ?? '').trim();
  if (!allowedCodes.has(code)) return 'Tema tidak valid.';
  return '';
}

export function filterThemes(themes, orientation = 'all') {
  const list = Array.isArray(themes) ? themes : [];
  if (orientation === 'landscape' || orientation === 'portrait') return list.filter((theme) => theme.orientation === orientation);
  return list;
}
