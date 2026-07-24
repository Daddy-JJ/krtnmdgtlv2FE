import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiClient } from '../services/api-client.js';
import { canEditSlug, normalizeSlug, validateSlug } from '../validators/slug-validator.js';

test('slug advisory reads use cookies without CSRF and slug/publish mutations use access CSRF', async () => {
  const requests = [];
  const client = new ApiClient({
    baseUrl: 'https://example.test/api/v1',
    cookieSource: () => 'csrf_token=access-csrf; starter_csrf_token=starter-csrf',
    fetchImpl: async (url, options) => {
      requests.push({ url, method: options.method, csrf: options.headers.get('x-csrf-token'), body: options.body ? JSON.parse(options.body) : null });
      const data = url.includes('slug-availability') ? { available: true } : {};
      return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    },
  });

  await client.get('/cards/slug-availability?slug=arwan-card');
  await client.patch('/cards/card-1/slug', { slug: 'arwan-card' }, { csrfContext: 'access' });
  await client.post('/cards/card-1/publish', null, { csrfContext: 'access' });

  assert.deepEqual(requests.map((request) => request.csrf), [null, 'access-csrf', 'access-csrf']);
  assert.equal(requests[1].body.slug, 'arwan-card');
});

test('slug validator enforces locked Basic/Pro custom URL rules', () => {
  assert.equal(normalizeSlug(' ArWan-Card '), 'arwan-card');
  assert.equal(validateSlug('arwan-card'), '');
  assert.equal(validateSlug('Starter URL'), 'Gunakan huruf kecil, angka, dan hyphen di tengah.');
  assert.equal(validateSlug('api'), 'Custom URL ini termasuk reserved word.');
  assert.equal(validateSlug('ab'), 'Custom URL minimal 3 karakter.');
  assert.equal(canEditSlug('starter'), false);
  assert.equal(canEditSlug('basic'), true);
  assert.equal(canEditSlug('pro'), true);
});
