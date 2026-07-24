import assert from 'node:assert/strict';
import test from 'node:test';
import { ApiClient } from '../services/api-client.js';
import { validateEmail, validateForgotPassword, validateVerifyOtp } from '../validators/auth-validator.js';

test('account email/reset public auth requests omit CSRF and logout uses access CSRF', async () => {
  const requests = [];
  const client = new ApiClient({
    baseUrl: 'https://example.test/api/v1',
    cookieSource: () => 'csrf_token=access-csrf',
    fetchImpl: async (url, options) => {
      requests.push({ url, csrf: options.headers.get('x-csrf-token'), body: options.body ? JSON.parse(options.body) : null });
      return new Response(JSON.stringify({ success: true, data: null }), { status: 200 });
    },
  });

  await client.post('/auth/email/verify-otp', { email: 'me@example.com', code: '123456' }, { csrfContext: null, skipRefresh: true });
  await client.post('/auth/email/resend-otp', { email: 'me@example.com' }, { csrfContext: null, skipRefresh: true });
  await client.post('/auth/forgot-password', { email: 'me@example.com' }, { csrfContext: null, skipRefresh: true });
  await client.post('/auth/logout', null, { csrfContext: 'access', skipRefresh: true });

  assert.deepEqual(requests.map((request) => request.csrf), [null, null, null, 'access-csrf']);
  assert.equal(requests[0].body.code, '123456');
});

test('account validators cover email verification and reset forms', () => {
  assert.equal(validateEmail(' user@example.com '), '');
  assert.deepEqual(validateVerifyOtp({ email: 'user@example.com', code: '123456' }), {});
  assert.equal(validateVerifyOtp({ email: 'bad', code: '12' }).code, 'Kode OTP harus 6 digit.');
  assert.deepEqual(validateForgotPassword({ email: 'user@example.com' }), {});
});
