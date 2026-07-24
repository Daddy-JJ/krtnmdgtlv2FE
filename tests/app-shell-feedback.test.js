import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { validateFeedback } from '../validators/feedback-validator.js';

const root = new URL('../', import.meta.url);
const pages = [
  'app/index.html', 'app/card/identity/index.html', 'app/card/contact/index.html',
  'app/card/design/index.html', 'app/card/settings/index.html', 'app/card/social/index.html',
  'app/card/catalog/index.html', 'app/billing/index.html', 'app/account/index.html',
  'app/feedback/index.html',
];

test('every authenticated user page loads the shared application shell', async () => {
  for (const page of pages) {
    const source = await readFile(new URL(page, root), 'utf8');
    assert.match(source, /\/components\/app-shell\.js/, page);
  }
});

test('shared shell contains every user menu and reduced-motion-aware transition', async () => {
  const [script, css] = await Promise.all([
    readFile(new URL('components/app-shell.js', root), 'utf8'),
    readFile(new URL('assets/css/app.css', root), 'utf8'),
  ]);
  assert.match(script, /\/app\/feedback\//);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(css, /\.app-shell--leaving/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('feedback validator enforces a trimmed 1-300 character message', () => {
  assert.equal(validateFeedback({ message: ' ' }).valid, false);
  assert.equal(validateFeedback({ message: 'x'.repeat(301) }).valid, false);
  assert.deepEqual(validateFeedback({ message: '  useful  ' }).value, { message: 'useful' });
});
