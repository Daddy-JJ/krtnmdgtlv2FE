import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const script = await readFile(new URL('../pages/public/home.js', import.meta.url), 'utf8');
const admin = await readFile(new URL('../pages/admin/landing-content.js', import.meta.url), 'utf8');

test('landing page uses typed content anchors with an API fallback-safe hydrator', () => {
  for (const key of ['heroTitle', 'moreTitle', 'socialTitle', 'plansTitle', 'securityTitle', 'finalTitle']) assert.match(home, new RegExp(`data-landing-content="${key}"`));
  assert.match(script, /api\.get\('\/public\/content\/landing'/);
  assert.match(script, /element\.textContent = value/);
  assert.doesNotMatch(script, /innerHTML|outerHTML/);
});

test('admin editor uses dedicated typed route and required audit reason', () => {
  assert.match(admin, /\/admin\/landing-content/);
  assert.match(admin, /roles\.includes\('super_admin'\)/);
  assert.match(admin, /reason\.required = true/);
  assert.match(admin, /window\.confirm/);
  assert.doesNotMatch(admin, /innerHTML|outerHTML/);
});
