import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../config/runtime-config.js', import.meta.url), 'utf8');

function runtimeConfig(hostname, existingConfig) {
  const context = { location: { hostname } };
  if (existingConfig) context.__KND_CONFIG__ = existingConfig;
  runInNewContext(source, context);
  return context.__KND_CONFIG__;
}

test('canonical production hosts use the reviewed HTTPS API subdomain', () => {
  for (const hostname of ['kartunamadigital.id', 'www.kartunamadigital.id']) {
    const config = runtimeConfig(hostname);
    assert.equal(config.apiBaseUrl, 'https://api.kartunamadigital.id/api/v1');
    assert.equal(Object.isFrozen(config), true);
  }
});

test('local and preview hosts retain the same-origin API route', () => {
  for (const hostname of ['127.0.0.1', 'localhost', 'preview.example.test']) {
    assert.equal(runtimeConfig(hostname).apiBaseUrl, '/api/v1');
  }
});

test('a server-owned runtime override remains authoritative', () => {
  assert.equal(
    runtimeConfig('kartunamadigital.id', { apiBaseUrl: '/controlled-api' }).apiBaseUrl,
    '/controlled-api',
  );
});
