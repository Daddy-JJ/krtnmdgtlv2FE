// cPanel replaces these public-only placeholders from its local .env during deployment.
// They must never contain credentials, tokens, or database settings.
const injectedApiBaseUrl = '__PUBLIC_API_BASE_URL__';
const injectedTimeout = '__PUBLIC_API_TIMEOUT_MS__';
const apiBaseUrl = injectedApiBaseUrl === '__PUBLIC_API_BASE_URL__' ? '/api/v1' : injectedApiBaseUrl;
const requestTimeoutMs = /^\d+$/.test(injectedTimeout) ? Number(injectedTimeout) : 12_000;

globalThis.__KND_CONFIG__ = Object.freeze({
  apiBaseUrl: globalThis.__KND_CONFIG__?.apiBaseUrl ?? apiBaseUrl,
  requestTimeoutMs: globalThis.__KND_CONFIG__?.requestTimeoutMs ?? requestTimeoutMs,
});
