import { authService } from '../../services/auth-service.js';
import { validateResetPassword } from '../../validators/auth-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';

const form = document.querySelector('[data-reset-form]');
const status = document.querySelector('[data-form-status]');
const token = new URLSearchParams(location.search).get('token');
if (form?.elements.token && token) form.elements.token.value = token;

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = formValues(form);
  const errors = validateResetPassword(input);
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    return;
  }
  clearFieldErrors(form);
  setBusy(form, true);
  showStatus(status, 'Mereset password...', 'info');
  try {
    await authService.resetPassword(input);
    showStatus(status, 'Password berhasil direset. Silakan login.', 'success');
    location.assign('/login/');
  } catch (error) {
    showFieldErrors(form, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
});
