import assert from 'node:assert/strict';
import test from 'node:test';
import proxy from '../api/v1/[...path].js';

async function withEnvironment(value, callback) {
  const previous = process.env.BACKEND_API_BASE_URL;
  if (value === undefined) delete process.env.BACKEND_API_BASE_URL;
  else process.env.BACKEND_API_BASE_URL = value;
  try {
    await callback();
  } finally {
    if (previous === undefined) delete process.env.BACKEND_API_BASE_URL;
    else process.env.BACKEND_API_BASE_URL = previous;
  }
}

test('Vercel API proxy fails closed without a stable HTTPS backend', { concurrency: false }, async () => {
  for (const value of [
    undefined,
    'http://api.example.com',
    'https://127.0.0.1:3000',
    'https://temporary.trycloudflare.com',
    'https://api.example.com/api',
  ]) {
    await withEnvironment(value, async () => {
      const response = await proxy.fetch(new Request('https://frontend.example/api/v1/health'));
      assert.equal(response.status, 503, String(value));
    });
  }
});

test('Vercel API proxy forwards to the configured origin', { concurrency: false }, async () => {
  const originalFetch = globalThis.fetch;
  await withEnvironment('https://api.example.com', async () => {
    globalThis.fetch = async (url, options) => {
      assert.equal(String(url), 'https://api.example.com/api/v1/health?probe=1');
      assert.equal(options.method, 'GET');
      assert.equal(options.headers.get('x-test'), 'safe');
      return Response.json({ status: 'ok' }, { status: 200 });
    };
    try {
      const response = await proxy.fetch(new Request(
        'https://frontend.example/api/v1/health?probe=1',
        { headers: { 'x-test': 'safe' } },
      ));
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), { status: 'ok' });
      assert.equal(response.headers.get('cache-control'), 'no-store');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
