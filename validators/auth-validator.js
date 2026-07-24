const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function validateEmail(value) {
  const email = normalizeEmail(value);
  if (!email) return 'Email wajib diisi.';
  if (email.length > 190 || !emailPattern.test(email)) return 'Format email belum valid.';
  return '';
}

export function validatePassword(value, { login = false } = {}) {
  const password = String(value ?? '');
  if (!password) return 'Password wajib diisi.';
  if (password.length > 128) return 'Password maksimal 128 karakter.';
  if (!login && password.length < 8) return 'Password minimal 8 karakter.';
  return '';
}

export function validateOtp(value) {
  const code = String(value ?? '').replace(/\D/g, '').slice(0, 6);
  if (code.length !== 6) return 'Kode OTP harus 6 digit.';
  return '';
}

export function validateResetToken(value) {
  const token = String(value ?? '').trim();
  if (token.length < 32 || token.length > 512) return 'Token reset tidak valid.';
  return '';
}

export function validateRegister(input) {
  return compactErrors({
    email: validateEmail(input.email),
    password: validatePassword(input.password),
  });
}

export function validateLogin(input) {
  return compactErrors({
    email: validateEmail(input.email),
    password: validatePassword(input.password, { login: true }),
  });
}

export function validateVerifyOtp(input) {
  return compactErrors({
    email: validateEmail(input.email),
    code: validateOtp(input.code),
  });
}

export function validateForgotPassword(input) {
  return compactErrors({ email: validateEmail(input.email) });
}

export function validateResetPassword(input) {
  return compactErrors({
    token: validateResetToken(input.token),
    password: validatePassword(input.password),
  });
}

function compactErrors(errors) {
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}
