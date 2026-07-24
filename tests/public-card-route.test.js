import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const rewrite = await readFile(new URL('../.htaccess', import.meta.url), 'utf8');
const shell = await readFile(new URL('../public-card/index.html', import.meta.url), 'utf8');
const page = await readFile(new URL('../pages/public/card.js', import.meta.url), 'utf8');

test('Apache routes only missing one-segment slugs to the public shell', () => {
  assert.match(rewrite, /RewriteCond %\{REQUEST_FILENAME\} !-f/);
  assert.match(rewrite, /RewriteCond %\{REQUEST_FILENAME\} !-d/);
  assert.match(rewrite, /RewriteRule \^\[A-Za-z0-9\]/);
  assert.match(rewrite, /public-card\/index\.html \[L\]/);
});

test('public card shell exposes accessible loading, content, action, and error states', () => {
  assert.match(shell, /<main id="main"/);
  assert.match(shell, /data-public-loading/);
  assert.match(shell, /data-public-content hidden/);
  assert.match(shell, /data-public-error hidden/);
  assert.match(shell, /data-theme-root/);
  assert.doesNotMatch(shell, /data-public-plan/);
  assert.match(shell, /data-vcard-link/);
  assert.match(shell, /data-qr-link/);
  assert.match(shell, /<script type="module" src="\/pages\/public\/card\.js"><\/script>/);
});

test('public page allowlists registry templates and renders remote data through safe DOM APIs', () => {
  assert.match(page, /\/components\\\/card-themes\\\//);
  assert.match(page, /new DOMParser\(\)\.parseFromString/);
  assert.match(page, /replaceChildren/);
  assert.match(page, /textContent/);
  assert.doesNotMatch(page, /\.innerHTML\s*=|\.outerHTML\s*=/);
  assert.doesNotMatch(page, /localStorage|sessionStorage/);
});
