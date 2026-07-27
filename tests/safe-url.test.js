import assert from 'node:assert/strict';
import test from 'node:test';
import { safeHttpUrl, safeMailtoHref, safeTelHref } from '../utils/safe-url.js';

test('safeHttpUrl permits only complete HTTP(S) URLs', () => {
  assert.equal(safeHttpUrl('https://example.com/a?b=1'), 'https://example.com/a?b=1');
  assert.equal(safeHttpUrl('http://example.com'), 'http://example.com/');
  for (const unsafe of [
    'javascript:alert(1)',
    'data:text/html,test',
    'file:///tmp/test',
    '//example.com',
    'https://user:password@example.com',
    'https://exam ple.com',
    'https://example.com/\nscript',
  ]) {
    assert.equal(safeHttpUrl(unsafe), '', unsafe);
  }
});

test('safeMailtoHref validates the address before creating a link', () => {
  assert.equal(safeMailtoHref(' User@Example.com '), 'mailto:user@example.com');
  assert.equal(safeMailtoHref('user@example.com?subject=unsafe'), '');
  assert.equal(safeMailtoHref('javascript:alert(1)'), '');
});

test('safeTelHref accepts phone punctuation but rejects protocol injection', () => {
  assert.equal(safeTelHref('+62 812-3456 (7890)'), 'tel:+62812-3456(7890)');
  assert.equal(safeTelHref('123;phone-context=evil.example'), '');
  assert.equal(safeTelHref('javascript:alert(1)'), '');
  assert.equal(safeTelHref('---'), '');
});
