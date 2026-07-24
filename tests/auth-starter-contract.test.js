import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiClient } from '../services/api-client.js';
import { buildStarterInput, validateStarterInput } from '../validators/starter-validator.js';
import { validateLogin, validateRegister, validateResetPassword, validateVerifyOtp } from '../validators/auth-validator.js';

test('public auth and Starter create POST can opt out of CSRF header', async () => {
  const observed = [];
  const client = new ApiClient({
    baseUrl: 'https://example.test/api/v1',
    cookieSource: () => 'csrf_token=access-csrf; starter_csrf_token=starter-csrf',
    fetchImpl: async (url, options) => {
      observed.push({ url, csrf: options.headers.get('x-csrf-token') });
      return new Response(JSON.stringify({ success: true, data: null }), { status: 200 });
    },
  });

  await client.post('/auth/login', { email: 'a@example.com', password: 'password' }, { csrfContext: null, skipRefresh: true });
  await client.post('/starter/cards', { contact: {} }, { csrfContext: null, skipRefresh: true });

  assert.deepEqual(observed.map((item) => item.csrf), [null, null]);
});

test('Starter update and claim use Starter CSRF context', async () => {
  const csrfHeaders = [];
  const client = new ApiClient({
    baseUrl: 'https://example.test/api/v1',
    cookieSource: () => 'csrf_token=access-csrf; starter_csrf_token=starter-csrf',
    fetchImpl: async (_url, options) => {
      csrfHeaders.push(options.headers.get('x-csrf-token'));
      return new Response(JSON.stringify({ success: true, data: {} }), { status: 200 });
    },
  });

  await client.put('/starter/cards/card-id', { contact: {} }, { csrfContext: 'starter' });
  await client.post('/starter/cards/card-id/claim', null, { csrfContext: 'starter' });

  assert.deepEqual(csrfHeaders, ['starter-csrf', 'starter-csrf']);
});

test('auth validators mirror backend-facing minimum contract', () => {
  assert.deepEqual(validateRegister({ email: ' USER@Example.COM ', password: '12345678' }), {});
  assert.equal(validateRegister({ email: 'bad', password: '123' }).email, 'Format email belum valid.');
  assert.equal(validateLogin({ email: 'me@example.com', password: '' }).password, 'Password wajib diisi.');
  assert.deepEqual(validateVerifyOtp({ email: 'me@example.com', code: '123456' }), {});
  assert.equal(validateVerifyOtp({ email: 'me@example.com', code: 'abc' }).code, 'Kode OTP harus 6 digit.');
  assert.equal(validateResetPassword({ token: 'short', password: '12345678' }).token, 'Token reset tidak valid.');
});

test('Starter validator builds strict backend contact payload', () => {
  const input = buildStarterInput({
    fullName: ' Arwan ',
    jobTitle: 'Owner',
    organization: 'KND',
    officePhone: '',
    mobilePhone: '08123',
    email: ' OWNER@EXAMPLE.COM ',
    websiteUrl: 'https://example.com',
    addressText: 'Jakarta',
  });

  assert.equal(input.contact.fullName, 'Arwan');
  assert.equal(input.contact.email, 'owner@example.com');
  assert.deepEqual(validateStarterInput(input), {});
  assert.equal(validateStarterInput(buildStarterInput({ fullName: '', email: 'bad', websiteUrl: 'ftp://bad.test' })).fullName, 'Nama wajib diisi.');
});
