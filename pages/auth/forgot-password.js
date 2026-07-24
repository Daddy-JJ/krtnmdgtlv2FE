import { authService } from '../../services/auth-service.js';
import { normalizeEmail, validateForgotPassword } from '../../validators/auth-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';

const form = document.querySelector('[data-forgot-form]');
const status = document.querySelector('[data-form-status]');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = formValues(form);
  input.email = normalizeEmail(input.email);
  const errors = validateForgotPassword(input);
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    return;
  }
  clearFieldErrors(form);
  setBusy(form, true);
  showStatus(status, 'Mengirim instruksi reset...', 'info');
  try {
    await authService.forgotPassword(input);
    showStatus(status, 'Jika email valid, instruksi reset akan dikirim.', 'success');
  } catch (error) {
    showFieldErrors(form, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
});
