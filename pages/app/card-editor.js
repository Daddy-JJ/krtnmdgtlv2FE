import { cardService } from '../../services/card-service.js';
import { buildCardInput, validateCardInput } from '../../validators/card-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';

const form = document.querySelector('[data-card-editor-form]');
const status = document.querySelector('[data-form-status]');
const section = form?.dataset.editorSection ?? 'identity';
const editableFields = section === 'contact'
  ? ['officePhone', 'mobilePhone', 'email', 'websiteUrl', 'addressText']
  : ['fullName', 'jobTitle', 'organization'];
const state = { card: null };

init();

function init() {
  load();
  form?.addEventListener('submit', save);
}

async function load() {
  if (!form) return;
  setBusy(form, true);
  showStatus(status, 'Memuat data kartu...', 'info');
  try {
    const cards = await cardService.list();
    const first = Array.isArray(cards) ? cards[0] : null;
    if (!first) {
      showStatus(status, 'Belum ada kartu aktif untuk diedit.', 'error');
      return;
    }
    state.card = await cardService.get(first.publicId);
    fillForm(state.card);
    showStatus(status, 'Data kartu siap diedit.', 'success');
  } catch (error) {
    if (error.status === 401) {
      location.assign('/login/');
      return;
    }
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
}

async function save(event) {
  event.preventDefault();
  if (!state.card) return;
  const input = buildCardInput(formValues(form), state.card, document.documentElement.lang);
  const errors = validateCardInput(input, editableFields);
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    showStatus(status, 'Periksa field yang ditandai.', 'error');
    return;
  }
  clearFieldErrors(form);
  setBusy(form, true);
  showStatus(status, 'Menyimpan perubahan...', 'info');
  try {
    state.card = await cardService.update(state.card.publicId, input);
    fillForm(state.card);
    document.dispatchEvent(new CustomEvent('card:saved', { detail: { publicId: state.card.publicId, section } }));
    showStatus(status, 'Perubahan tersimpan.', 'success');
  } catch (error) {
    showFieldErrors(form, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
}

function fillForm(card) {
  for (const field of editableFields) {
    if (form.elements[field]) form.elements[field].value = card.contact?.[field] ?? '';
  }
}
