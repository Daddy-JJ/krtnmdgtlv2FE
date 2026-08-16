import { starterService } from '../../services/starter-service.js';
import { buildStarterInput, validateStarterInput } from '../../validators/starter-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';
import { bindWebsiteUrlInput } from '../../utils/website-url.js';

const form = document.querySelector('[data-starter-manage-form]');
const claim = document.querySelector('[data-starter-claim]');
const status = document.querySelector('[data-form-status]');
const publicId = new URLSearchParams(location.search).get('publicId') ?? '';

if (form?.elements.publicId) form.elements.publicId.value = publicId;
bindWebsiteUrlInput(form?.elements.websiteUrl);

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = String(form.elements.publicId.value ?? '').trim();
  const input = buildStarterInput(formValues(form), document.documentElement.lang);
  const errors = { publicId: id ? '' : 'Public ID wajib diisi.', ...validateStarterInput(input) };
  if (Object.values(errors).some(Boolean)) {
    showFieldErrors(form, Object.fromEntries(Object.entries(errors).filter(([, message]) => message)));
    return;
  }
  clearFieldErrors(form);
  setBusy(form, true);
  showStatus(status, 'Menyimpan perubahan Starter...', 'info');
  try {
    const card = await starterService.update(id, input);
    showStatus(status, 'Kartu Starter berhasil diperbarui. Kredensial manage dirotasi oleh server.', 'success');
    if (card?.canonicalUrl) location.assign(`/starter/manage/?publicId=${encodeURIComponent(card.publicId)}`);
  } catch (error) {
    showFieldErrors(form, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
});

claim?.addEventListener('click', async () => {
  const id = String(form?.elements.publicId?.value ?? '').trim();
  if (!id) {
    showFieldErrors(form, { publicId: 'Public ID wajib diisi.' });
    return;
  }
  claim.disabled = true;
  showStatus(status, 'Menghubungkan kartu ke akun login...', 'info');
  try {
    await starterService.claim(id);
    showStatus(status, 'Kartu berhasil diklaim ke akun Anda.', 'success');
    location.assign('/app/');
  } catch (error) {
    showStatus(status, error.message, 'error');
  } finally {
    claim.disabled = false;
  }
});
