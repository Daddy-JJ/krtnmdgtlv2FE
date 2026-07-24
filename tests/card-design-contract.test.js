import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiClient } from '../services/api-client.js';
import { filterThemes, validateThemeCode } from '../validators/theme-validator.js';

test('theme list is safe GET and theme update uses access CSRF', async () => {
  const requests = [];
  const client = new ApiClient({
    baseUrl: 'https://example.test/api/v1',
    cookieSource: () => 'csrf_token=access-csrf; starter_csrf_token=starter-csrf',
    fetchImpl: async (url, options) => {
      requests.push({ url, method: options.method, csrf: options.headers.get('x-csrf-token'), body: options.body ? JSON.parse(options.body) : null });
      const data = url.endsWith('/themes') ? [{ code: 'starter-clean', orientation: 'landscape', isAvailable: true }] : { themeCode: 'starter-clean' };
      return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    },
  });

  await client.get('/cards/card-1/themes');
  await client.patch('/cards/card-1/theme', { themeCode: 'starter-clean' }, { csrfContext: 'access' });

  assert.deepEqual(requests.map((request) => request.csrf), [null, 'access-csrf']);
  assert.equal(requests[1].body.themeCode, 'starter-clean');
});

test('theme validator and orientation filter enforce locked catalog values', () => {
  const themes = [
    { code: 'starter-clean', orientation: 'landscape' },
    { code: 'pro-vertical-modern-dark', orientation: 'portrait' },
  ];

  assert.equal(validateThemeCode('starter-clean'), '');
  assert.equal(validateThemeCode('unknown-theme'), 'Tema tidak valid.');
  assert.equal(filterThemes(themes, 'portrait').length, 1);
  assert.equal(filterThemes(themes, 'all').length, 2);
});
