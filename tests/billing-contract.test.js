import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiClient } from '../services/api-client.js';
import { billingStatusLabel, validatePlanCode } from '../validators/payment-validator.js';
import{readFile}from'node:fs/promises';

test('billing reads omit CSRF while checkout and reconcile use access CSRF', async () => {
  const requests = [];
  const client = new ApiClient({
    baseUrl: 'https://example.test/api/v1',
    cookieSource: () => 'csrf_token=access-csrf; starter_csrf_token=starter-csrf',
    fetchImpl: async (url, options) => {
      requests.push({ url, method: options.method, csrf: options.headers.get('x-csrf-token'), body: options.body ? JSON.parse(options.body) : null });
      const data = url.endsWith('/payments/checkout') ? { publicId: 'payment-1', snapToken: 'snap-token', redirectUrl: 'https://pay.example' } : [];
      return new Response(JSON.stringify({ success: true, data }), { status: url.endsWith('/payments/checkout') ? 201 : 200 });
    },
  });

  await client.get('/subscriptions/current');
  await client.get('/payments');
  await client.post('/payments/checkout', { planCode: 'basic' }, { csrfContext: 'access' });
  await client.post('/payments/payment-1/reconcile', null, { csrfContext: 'access' });

  assert.deepEqual(requests.map((request) => request.csrf), [null, null, 'access-csrf', 'access-csrf']);
  assert.equal(requests[2].body.planCode, 'basic');
});

test('billing validator locks checkout plans and status labels', () => {
  assert.equal(validatePlanCode('basic'), '');
  assert.equal(validatePlanCode('pro'), '');
  assert.equal(validatePlanCode('starter'), 'Pilih paket Basic atau Pro.');
  assert.equal(billingStatusLabel('paid'), 'Successful');
  assert.equal(billingStatusLabel('pending'), 'Pending');
});

test('billing UI identifies Basic and Pro as annual 365-day subscriptions',async()=>{
  const html=await readFile(new URL('../app/billing/index.html',import.meta.url),'utf8');
  assert.match(html,/Basic Annual/);
  assert.match(html,/Pro Annual/);
  assert.match(html,/365 hari/g);
  assert.doesNotMatch(html,/one-time|sekali bayar/i);
});
