import { clearFieldErrors, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';
import { feedbackService } from '../../services/feedback-service.js';
import { validateFeedback } from '../../validators/feedback-validator.js';

const form = document.querySelector('[data-feedback-form]');
const input = form?.elements.message;
const counter = document.querySelector('[data-feedback-counter]');
const status = document.querySelector('[data-form-status]');

input?.addEventListener('input', updateCounter);
form?.addEventListener('submit', submit);
updateCounter();

function updateCounter() {
  if (counter && input) counter.textContent = `${[...input.value].length}/300`;
}

async function submit(event) {
  event.preventDefault();
  clearFieldErrors(form);
  const result = validateFeedback({ message: input.value });
  if (!result.valid) {
    showFieldErrors(form, result.errors);
    return;
  }
  setBusy(form, true);
  showStatus(status, 'Mengirim feedback...');
  try {
    await feedbackService.submit(result.value.message);
    form.reset();
    updateCounter();
    showStatus(status, 'Terima kasih. Feedback Anda sudah tersimpan.', 'success');
  } catch (error) {
    const errors = mapApiFieldErrors(error.details);
    if (Object.keys(errors).length) showFieldErrors(form, errors);
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
}
