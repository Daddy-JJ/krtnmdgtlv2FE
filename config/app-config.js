import './runtime-config.js';

export const appConfig = Object.freeze({
  apiBaseUrl: globalThis.__KND_CONFIG__?.apiBaseUrl ?? 'http://127.0.0.1:3000/api/v1',
  requestTimeoutMs: 12_000,
  defaultLocale: 'id',
  supportedLocales: Object.freeze(['id', 'en']),
});
