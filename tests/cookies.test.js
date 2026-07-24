import assert from 'node:assert/strict';
import test from 'node:test';
import { csrfToken, readCookie } from '../utils/cookies.js';

test('readCookie decodes an exact cookie name', () => {
  assert.equal(readCookie('csrf_token', 'other=1; csrf_token=a%2Bb; csrf_token_old=no'), 'a+b');
  assert.equal(readCookie('missing', 'csrf_token=value'), null);
});

test('access and Starter CSRF cookies remain separate', () => {
  const cookies = 'csrf_token=access-value; starter_csrf_token=starter-value';
  assert.equal(csrfToken('access', cookies), 'access-value');
  assert.equal(csrfToken('starter', cookies), 'starter-value');
});

test('malformed encoded cookies fail closed', () => {
  assert.equal(readCookie('csrf_token', 'csrf_token=%E0%A4%A'), null);
});
