import { authService } from '../../services/auth-service.js';
import { validateRegister, normalizeEmail } from '../../validators/auth-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';

const form = document.querySelector('[data-register-form]');
const status = document.querySelector('[data-form-status]');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = formValues(form);
  input.email = normalizeEmail(input.email);
  const errors = validateRegister(input);
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    showStatus(status, 'Periksa field yang ditandai.', 'error');
    return;
  }
  clearFieldErrors(form);
  setBusy(form, true);
  showStatus(status, 'Mendaftarkan akun...', 'info');
  try {
    await authService.register(input);
    showStatus(status, 'Registrasi diterima. Silakan cek email untuk OTP.', 'success');
    location.assign(`/verify-email/?email=${encodeURIComponent(input.email)}`);
  } catch (error) {
    showFieldErrors(form, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
});
