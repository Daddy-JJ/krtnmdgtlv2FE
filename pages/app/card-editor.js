import { cardService } from '../../services/card-service.js';
import { buildCardInput, validateCardInput } from '../../validators/card-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';

const form = document.querySelector('[data-card-editor-form]');
const status = document.querySelector('[data-form-status]');
const section = form?.dataset.editorSection ?? 'card';
const editableFields = [
  'firstName', 'lastName', 'jobTitle', 'organization',
  'officePhone', 'mobilePhone', 'email', 'websiteUrl',
  'addressStreet', 'addressCity', 'addressProvince', 'addressPostalCode', 'addressCountry',
];
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
      showStatus(status, 'Belum ada kartu aktif. Isi form ini untuk membuat kartu Basic/Pro.', 'info');
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
  const values = formValues(form);
  const input = buildCardInput(values, state.card, document.documentElement.lang);
  const errors = validateCardInput(input, editableFields);
  if (!String(values.firstName ?? '').trim()) errors.firstName = 'Nama depan wajib diisi.';
  if (!String(values.lastName ?? '').trim()) errors.lastName = 'Nama belakang wajib diisi.';
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    showStatus(status, 'Periksa field yang ditandai.', 'error');
    return;
  }
  clearFieldErrors(form);
  setBusy(form, true);
  showStatus(status, 'Menyimpan perubahan...', 'info');
  const creating = !state.card;
  try {
    state.card = state.card
      ? await cardService.update(state.card.publicId, input)
      : await cardService.create(input);
    fillForm(state.card);
    document.dispatchEvent(new CustomEvent('card:saved', { detail: { publicId: state.card.publicId, section } }));
    showStatus(status, creating ? 'Kartu berhasil dibuat.' : 'Perubahan tersimpan.', 'success');
  } catch (error) {
    showFieldErrors(form, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
}

function fillForm(card) {
  const name = String(card.contact?.fullName ?? '').trim().replace(/\s+/g, ' ');
  const nameParts = name.split(' ').filter(Boolean);
  const address = String(card.contact?.addressText ?? '').split(/\r?\n|\|/).map((part) => part.trim());
  const values = {
    firstName: nameParts.shift() ?? '',
    lastName: nameParts.join(' '),
    jobTitle: card.contact?.jobTitle ?? '',
    organization: card.contact?.organization ?? '',
    officePhone: card.contact?.officePhone ?? '',
    mobilePhone: card.contact?.mobilePhone ?? '',
    email: card.contact?.email ?? '',
    websiteUrl: card.contact?.websiteUrl ?? '',
    addressStreet: address[0] ?? '',
    addressCity: address[1] ?? '',
    addressProvince: address[2] ?? '',
    addressPostalCode: address[3] ?? '',
    addressCountry: address[4] ?? '',
  };
  for (const field of editableFields) if (form.elements[field]) form.elements[field].value = values[field] ?? '';
}
