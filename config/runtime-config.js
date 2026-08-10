const directApiHosts = new Set([
  'kartunamadigital.id',
  'www.kartunamadigital.id',
]);
const hostname = globalThis.location?.hostname?.toLowerCase() ?? '';
const defaultApiBaseUrl = directApiHosts.has(hostname)
  ? 'https://api.kartunamadigital.id/api/v1'
  : '/api/v1';

globalThis.__KND_CONFIG__ = Object.freeze({
  apiBaseUrl: globalThis.__KND_CONFIG__?.apiBaseUrl ?? defaultApiBaseUrl,
});
