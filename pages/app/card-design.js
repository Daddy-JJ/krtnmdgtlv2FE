import { cardService } from '../../services/card-service.js';
import { filterThemes, validateThemeCode } from '../../validators/theme-validator.js';
import { showStatus } from '../../components/forms/form-utils.js';

const state = { card: null, themes: [], selectedCode: '', orientation: 'all' };
const nodes = {
  status: document.querySelector('[data-form-status]'),
  gallery: document.querySelector('[data-theme-gallery]'),
  previewImage: document.querySelector('[data-theme-preview-image]'),
  previewName: document.querySelector('[data-theme-preview-name]'),
  save: document.querySelector('[data-save-theme]'),
  filters: document.querySelectorAll('[data-orientation-filter]'),
};

init();

function init() {
  load();
  nodes.save?.addEventListener('click', saveTheme);
  nodes.filters.forEach((button) => button.addEventListener('click', () => {
    state.orientation = button.dataset.orientationFilter ?? 'all';
    render();
  }));
}

async function load() {
  showStatus(nodes.status, 'Memuat theme gallery...', 'info');
  try {
    const cards = await cardService.list();
    const first = Array.isArray(cards) ? cards[0] : null;
    if (!first) {
      showStatus(nodes.status, 'Belum ada kartu aktif untuk design.', 'error');
      return;
    }
    state.card = await cardService.get(first.publicId);
    state.themes = await cardService.themes(state.card.publicId);
    state.selectedCode = state.card.themeCode;
    render();
    showStatus(nodes.status, 'Theme gallery siap.', 'success');
  } catch (error) {
    if (error.status === 401) {
      location.assign('/login/');
      return;
    }
    showStatus(nodes.status, error.message, 'error');
  }
}

function render() {
  nodes.gallery.replaceChildren();
  for (const theme of filterThemes(state.themes, state.orientation)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'rounded-lg border border-slate-200 bg-white p-3 text-left disabled:opacity-60';
    button.disabled = !theme.isAvailable;
    button.setAttribute('aria-pressed', String(theme.code === state.selectedCode));
    button.dataset.themeCode = theme.code;
    const image = document.createElement('img');
    image.className = 'aspect-[16/10] w-full rounded-md object-cover';
    image.src = theme.previewPath;
    image.alt = `${theme.name} preview`;
    const name = document.createElement('span');
    name.className = 'mt-3 block font-bold';
    name.textContent = theme.name;
    const meta = document.createElement('span');
    meta.className = 'mt-1 block text-sm text-slate-600';
    meta.textContent = `${theme.orientation} · ${theme.isAvailable ? 'available' : 'locked'}`;
    button.append(image, name, meta);
    button.addEventListener('click', () => selectTheme(theme.code));
    nodes.gallery.append(button);
  }
  const selected = state.themes.find((theme) => theme.code === state.selectedCode);
  if (selected) {
    nodes.previewImage.src = selected.previewPath;
    nodes.previewImage.alt = `${selected.name} preview`;
    nodes.previewImage.hidden = false;
    nodes.previewName.textContent = selected.name;
  }
  nodes.filters.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.orientationFilter === state.orientation));
  });
}

function selectTheme(code) {
  const theme = state.themes.find((item) => item.code === code);
  if (!theme?.isAvailable) {
    document.dispatchEvent(new CustomEvent('theme:locked-selected', { detail: { themeCode: code } }));
    return;
  }
  state.selectedCode = code;
  document.dispatchEvent(new CustomEvent('theme:selected', { detail: { themeCode: code } }));
  render();
}

async function saveTheme() {
  if (!state.card) return;
  const message = validateThemeCode(state.selectedCode);
  if (message) {
    showStatus(nodes.status, message, 'error');
    return;
  }
  nodes.save.disabled = true;
  showStatus(nodes.status, 'Menyimpan tema...', 'info');
  try {
    state.card = await cardService.updateTheme(state.card.publicId, state.selectedCode);
    document.dispatchEvent(new CustomEvent('theme:saved', { detail: { themeCode: state.card.themeCode } }));
    showStatus(nodes.status, 'Tema tersimpan.', 'success');
  } catch (error) {
    showStatus(nodes.status, error.message, 'error');
  } finally {
    nodes.save.disabled = false;
  }
}
