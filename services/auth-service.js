import { api } from './api-client.js';

export const authService = {
  register(input) {
    return api.post('/auth/register', input, { csrfContext: null, skipRefresh: true });
  },
  verifyEmailOtp(input) {
    return api.post('/auth/email/verify-otp', input, { csrfContext: null, skipRefresh: true });
  },
  resendEmailOtp(input) {
    return api.post('/auth/email/resend-otp', input, { csrfContext: null, skipRefresh: true });
  },
  login(input) {
    return api.post('/auth/login', input, { csrfContext: null, skipRefresh: true });
  },
  logout() {
    return api.post('/auth/logout', null, { csrfContext: 'access', skipRefresh: true });
  },
  forgotPassword(input) {
    return api.post('/auth/forgot-password', input, { csrfContext: null, skipRefresh: true });
  },
  resetPassword(input) {
    return api.post('/auth/reset-password', input, { csrfContext: null, skipRefresh: true });
  },
};
