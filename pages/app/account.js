import { authService } from '../../services/auth-service.js';
import { normalizeEmail, validateEmail, validateForgotPassword, validateVerifyOtp } from '../../validators/auth-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';

const verifyForm = document.querySelector('[data-account-verify-form]');
const resetForm = document.querySelector('[data-account-reset-form]');
const resendButton = document.querySelector('[data-account-resend]');
const logoutButton = document.querySelector('[data-account-logout]');
const status = document.querySelector('[data-form-status]');

verifyForm?.elements.code?.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);
});

verifyForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = formValues(verifyForm);
  input.email = normalizeEmail(input.email);
  input.code = String(input.code ?? '').replace(/\D/g, '').slice(0, 6);
  const errors = validateVerifyOtp(input);
  if (Object.keys(errors).length) {
    showFieldErrors(verifyForm, errors);
    return;
  }
  clearFieldErrors(verifyForm);
  setBusy(verifyForm, true);
  showStatus(status, 'Memverifikasi email...', 'info');
  try {
    await authService.verifyEmailOtp(input);
    showStatus(status, 'Email berhasil diverifikasi.', 'success');
  } catch (error) {
    showFieldErrors(verifyForm, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(verifyForm, false);
  }
});

resendButton?.addEventListener('click', async () => {
  const email = normalizeEmail(verifyForm?.elements.email?.value);
  const message = validateEmail(email);
  if (message) {
    showFieldErrors(verifyForm, { email: message });
    return;
  }
  resendButton.disabled = true;
  showStatus(status, 'Mengirim ulang OTP...', 'info');
  try {
    await authService.resendEmailOtp({ email });
    showStatus(status, 'Jika email memenuhi syarat, OTP baru sudah dikirim.', 'success');
    cooldown(resendButton, 60);
  } catch (error) {
    showStatus(status, error.message, 'error');
    resendButton.disabled = false;
  }
});

resetForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = formValues(resetForm);
  input.email = normalizeEmail(input.email);
  const errors = validateForgotPassword(input);
  if (Object.keys(errors).length) {
    showFieldErrors(resetForm, errors);
    return;
  }
  clearFieldErrors(resetForm);
  setBusy(resetForm, true);
  showStatus(status, 'Mengirim instruksi reset password...', 'info');
  try {
    await authService.forgotPassword(input);
    showStatus(status, 'Jika email valid, instruksi reset akan dikirim.', 'success');
  } catch (error) {
    showFieldErrors(resetForm, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(resetForm, false);
  }
});

logoutButton?.addEventListener('click', async () => {
  logoutButton.disabled = true;
  showStatus(status, 'Keluar dari akun...', 'info');
  try {
    await authService.logout();
    location.assign('/login/');
  } catch (error) {
    showStatus(status, error.message, 'error');
    logoutButton.disabled = false;
  }
});

function cooldown(button, seconds) {
  const label = button.textContent;
  let remaining = seconds;
  const timer = setInterval(() => {
    remaining -= 1;
    button.textContent = `Kirim ulang (${remaining})`;
    if (remaining <= 0) {
      clearInterval(timer);
      button.textContent = label;
      button.disabled = false;
    }
  }, 1000);
}
