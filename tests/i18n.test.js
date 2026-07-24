import assert from 'node:assert/strict';
import test from 'node:test';
import { I18n } from '../services/i18n.js';

test('i18n falls back to Indonesian and resolves nested keys', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let requestedUrl;
  globalThis.fetch = async url => {
    requestedUrl = url;
    return new Response(JSON.stringify({ nav: { login: 'Masuk' } }), { status: 200 });
  };

  const i18n = await new I18n().load('unsupported');
  assert.equal(requestedUrl, '/locales/id.json');
  assert.equal(i18n.t('nav.login'), 'Masuk');
  assert.equal(i18n.t('unknown.key', 'Fallback'), 'Fallback');
});

test('i18n applies translations through textContent', async t => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => new Response(JSON.stringify({ label: 'Safe text' }), { status: 200 });
  const i18n = await new I18n().load('en');
  const element = { dataset: { i18n: 'label' }, textContent: 'Old' };
  i18n.apply({ querySelectorAll: () => [element] });
  assert.equal(element.textContent, 'Safe text');
});
