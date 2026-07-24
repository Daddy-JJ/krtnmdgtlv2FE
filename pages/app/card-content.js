import { cardService } from '../../services/card-service.js';
import { contentService } from '../../services/content-service.js';
import { buildCatalogInput, buildSocialInput, validateCatalogInput, validateSocialInput } from '../../validators/content-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';

const mode = document.querySelector('[data-content-page]')?.dataset.contentPage ?? 'social';
const form = document.querySelector('[data-content-form]');
const list = document.querySelector('[data-content-list]');
const status = document.querySelector('[data-form-status]');
const state = { card: null, items: [] };

init();

function init() {
  load();
  form?.addEventListener('submit', createItem);
  list?.addEventListener('click', deleteItem);
}

async function load() {
  if (!form) return;
  setBusy(form, true);
  showStatus(status, 'Memuat data...', 'info');
  try {
    const cards = await cardService.list();
    const first = Array.isArray(cards) ? cards[0] : null;
    if (!first) {
      showStatus(status, 'Belum ada kartu aktif.', 'error');
      return;
    }
    state.card = await cardService.get(first.publicId);
    await refreshList();
    showStatus(status, 'Data siap.', 'success');
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

async function refreshList() {
  state.items = mode === 'social'
    ? await contentService.listSocial(state.card.publicId)
    : await contentService.listCatalog(state.card.publicId);
  renderList();
}

async function createItem(event) {
  event.preventDefault();
  const input = mode === 'social' ? buildSocialInput(formValues(form)) : buildCatalogInput(formValues(form));
  const errors = mode === 'social' ? validateSocialInput(input) : validateCatalogInput(input);
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    return;
  }
  clearFieldErrors(form);
  setBusy(form, true);
  showStatus(status, 'Menyimpan...', 'info');
  try {
    if (mode === 'social') await contentService.createSocial(state.card.publicId, input);
    else await contentService.createCatalog(state.card.publicId, input);
    form.reset();
    await refreshList();
    showStatus(status, 'Item tersimpan.', 'success');
  } catch (error) {
    showFieldErrors(form, mapApiFieldErrors(error.details));
    showStatus(status, error.message, 'error');
  } finally {
    setBusy(form, false);
  }
}

async function deleteItem(event) {
  const button = event.target.closest('[data-delete-id]');
  if (!button || !state.card) return;
  button.disabled = true;
  try {
    if (mode === 'social') await contentService.deleteSocial(state.card.publicId, button.dataset.deleteId);
    else await contentService.deleteCatalog(state.card.publicId, button.dataset.deleteId);
    await refreshList();
    showStatus(status, 'Item dihapus.', 'success');
  } catch (error) {
    showStatus(status, error.message, 'error');
    button.disabled = false;
  }
}

function renderList() {
  list.replaceChildren();
  if (!state.items.length) {
    const empty = document.createElement('p');
    empty.className = 'rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600';
    empty.textContent = 'Belum ada item.';
    list.append(empty);
    return;
  }
  for (const item of state.items) {
    const row = document.createElement('article');
    row.className = 'rounded-lg border border-slate-200 bg-white p-4';
    const title = document.createElement('h2');
    title.className = 'font-bold';
    title.textContent = mode === 'social' ? item.platform : item.title;
    const meta = document.createElement('p');
    meta.className = 'mt-1 break-all text-sm text-slate-600';
    meta.textContent = mode === 'social' ? item.url : item.targetUrl || item.description || '-';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'mt-3 min-h-11 rounded-lg border border-red-200 bg-white px-4 py-2.5 font-semibold text-red-700';
    remove.dataset.deleteId = String(mode === 'social' ? item.id : item.publicId);
    remove.textContent = 'Hapus';
    row.append(title, meta, remove);
    list.append(row);
  }
}
