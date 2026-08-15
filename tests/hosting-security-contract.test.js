import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('LiteSpeed/Apache frontend deployment applies baseline browser security headers', async () => {
  const configuration = await readFile(new URL('../.htaccess', import.meta.url), 'utf8');
  for (const header of [
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ]) {
    assert.match(configuration, new RegExp(`Header always set ${header}\\b`));
  }
  assert.doesNotMatch(configuration, /Access-Control-Allow-Origin\s+["']?\*/i);
});
