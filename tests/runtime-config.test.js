import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../config/runtime-config.js', import.meta.url), 'utf8');

function runtimeConfig(existingConfig) {
  const context = {};
  if (existingConfig) context.__KND_CONFIG__ = existingConfig;
  runInNewContext(source, context);
  return context.__KND_CONFIG__;
}

test('undeployed placeholders safely use the same-origin API route', () => {
  const config = runtimeConfig();
  assert.equal(config.apiBaseUrl, '/api/v1');
  assert.equal(config.requestTimeoutMs, 12_000);
  assert.equal(Object.isFrozen(config), true);
});

test('a server-owned runtime override remains authoritative', () => {
  assert.equal(
    runtimeConfig({ apiBaseUrl: '/controlled-api', requestTimeoutMs: 3456 }).apiBaseUrl,
    '/controlled-api',
  );
});
