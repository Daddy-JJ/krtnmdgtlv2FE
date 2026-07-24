import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiClient } from '../services/api-client.js';

test('dashboard shell reads cards and current subscription with cookie credentials only', async () => {
  const requests = [];
  const client = new ApiClient({
    baseUrl: 'https://example.test/api/v1',
    cookieSource: () => 'csrf_token=access-csrf',
    fetchImpl: async (url, options) => {
      requests.push({ url, csrf: options.headers.get('x-csrf-token'), credentials: options.credentials });
      const data = url.endsWith('/cards') ? [{ publicId: 'card-1', planCode: 'starter', status: 'draft', contact: { fullName: 'Arwan' } }] : null;
      return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    },
  });

  const cards = await client.get('/cards');
  const subscription = await client.get('/subscriptions/current');

  assert.equal(cards[0].contact.fullName, 'Arwan');
  assert.equal(subscription, null);
  assert.deepEqual(requests.map((request) => request.csrf), [null, null]);
  assert.deepEqual(requests.map((request) => request.credentials), ['include', 'include']);
});
