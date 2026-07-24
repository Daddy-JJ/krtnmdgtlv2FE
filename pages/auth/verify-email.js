import { authService } from '../../services/auth-service.js';
import { normalizeEmail, validateEmail, validateVerifyOtp } from '../../validators/auth-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';

const form = document.querySelector('[data-verify-form]');
const resend = document.querySelector('[data-resend-otp]');
const status = document.querySelector('[data-form-status]');
const params = new URLSearchParams(location.search);
const emailInput = form?.elements.email;
if (emailInput && params.get('email')) emailInput.value = normalizeEmail(params.get('email'));

form?.elements.code?.addEventListener('input', (event) => {
  event.target.value = event.target.value.replace(/\D/g, '').slice(0, 6);
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = formValues(form);
  input.email = normalizeEmail(input.email);
  input.code = String(input.code ?? '').replace(/\D/g, '').slice(0, 6);
  const errors = validateVerifyOtp(input);
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    showStatus(status, 'OTP belum valid.', 'error');
    return;
  }
  clearFieldErrors(form);
  setBusy(form, true);
  showStatus(status, 'Memverifikasi email...', 'info');
  try {
    await authService.verifyEmailOtp(input);
    showStatus(status, 'Email berhasil diverifikasi. Silakan login.', 'success');
    location.assign('/login/');
  } catch (error) {
    showFieldErrors(form, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
});

resend?.addEventListener('click', async () => {
  const email = normalizeEmail(form?.elements.email?.value);
  const emailError = validateEmail(email);
  const errors = emailError ? { email: emailError } : {};
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    return;
  }
  resend.disabled = true;
  try {
    await authService.resendEmailOtp({ email });
    showStatus(status, 'Jika email memenuhi syarat, OTP baru sudah dikirim.', 'success');
    startCooldown(60);
  } catch (error) {
    showStatus(status, error.message, 'error');
    resend.disabled = false;
  }
});

function startCooldown(seconds) {
  let remaining = seconds;
  const label = resend.textContent;
  const timer = setInterval(() => {
    remaining -= 1;
    resend.textContent = `Kirim ulang (${remaining})`;
    if (remaining <= 0) {
      clearInterval(timer);
      resend.textContent = label;
      resend.disabled = false;
    }
  }, 1000);
}
