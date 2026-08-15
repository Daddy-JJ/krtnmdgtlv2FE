import { authService } from '../../services/auth-service.js';
import { validateLogin, normalizeEmail } from '../../validators/auth-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';

const form = document.querySelector('[data-login-form]');
const status = document.querySelector('[data-form-status]');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = formValues(form);
  input.email = normalizeEmail(input.email);
  const errors = validateLogin(input);
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    showStatus(status, 'Periksa email dan password.', 'error');
    return;
  }
  clearFieldErrors(form);
  setBusy(form, true);
  showStatus(status, 'Masuk ke akun...', 'info');
  try {
    const result = await authService.login(input);
    showStatus(status, 'Login berhasil.', 'success');
    const roles = Array.isArray(result?.user?.roles) ? result.user.roles : [result?.user?.role];
    const destination = roles.includes('super_admin')
      ? '/admin/'
      : roles.includes('cv_specialist')
        ? '/specialist/'
        : '/app/';
    location.assign(destination);
  } catch (error) {
    showFieldErrors(form, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
});
