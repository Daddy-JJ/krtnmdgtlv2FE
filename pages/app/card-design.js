import { cardService } from '../../services/card-service.js';
import { filterThemes, validateThemeCode } from '../../validators/theme-validator.js';
import { showStatus } from '../../components/forms/form-utils.js';

const state = {
  card: null,
  themes: [],
  selectedCode: '',
  previewCode: '',
  orientation: 'all',
  availabilityKnown: false,
};
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
  showStatus(nodes.status, 'Memuat varian desain...', 'info');
  try {
    state.themes = await loadStaticCatalog();
    state.previewCode = state.themes[0]?.code ?? '';
    render();
  } catch {
    showStatus(nodes.status, 'Katalog desain belum dapat dimuat.', 'error');
  }

  try {
    const cards = await cardService.list();
    const first = Array.isArray(cards) ? cards[0] : null;
    if (!first) {
      showStatus(nodes.status, 'Varian desain tersedia untuk preview. Belum ada kartu aktif untuk disimpan.', 'info');
      return;
    }
    state.card = await cardService.get(first.publicId);
    const entitledThemes = await cardService.themes(state.card.publicId);
    state.themes = mergeEntitlements(state.themes, entitledThemes);
    state.availabilityKnown = true;
    state.selectedCode = state.card.themeCode;
    state.previewCode = state.card.themeCode;
    render();
    showStatus(nodes.status, `${state.themes.length} varian desain siap dipreview.`, 'success');
  } catch (error) {
    if (error.status === 401) {
      location.assign('/login/');
      return;
    }
    render();
    showStatus(nodes.status, 'Varian desain dapat dipreview. Koneksi akun diperlukan untuk menyimpan pilihan.', 'error');
  }
}

async function loadStaticCatalog() {
  const response = await fetch('/config/theme-registry.json', {
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error('Theme registry unavailable.');
  const registry = await response.json();
  return (Array.isArray(registry?.themes) ? registry.themes : [])
    .filter((theme) => theme.active === true)
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .map((theme) => ({
      code: theme.code,
      name: theme.name,
      orientation: theme.orientation,
      previewPath: theme.previewImage,
      displayOrder: theme.displayOrder,
      minimumPlan: theme.minimumPlan,
      isAvailable: false,
    }));
}

function mergeEntitlements(catalog, entitledThemes) {
  const access = new Map((Array.isArray(entitledThemes) ? entitledThemes : [])
    .map((theme) => [theme.code, theme]));
  return catalog.map((theme) => ({
    ...theme,
    ...(access.get(theme.code) ?? {}),
    name: theme.name,
    previewPath: access.get(theme.code)?.previewPath || theme.previewPath,
    minimumPlan: theme.minimumPlan,
  }));
}

function render() {
  nodes.gallery.replaceChildren();
  for (const theme of filterThemes(state.themes, state.orientation)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-option';
    button.setAttribute('aria-pressed', String(theme.code === state.previewCode));
    button.dataset.themeCode = theme.code;
    button.dataset.available = String(theme.isAvailable);
    const stage = document.createElement('span');
    stage.className = `theme-option__preview theme-option__preview--${theme.orientation}`;
    const image = document.createElement('img');
    image.className = 'theme-option__image';
    image.src = theme.previewPath;
    image.alt = `${theme.name} preview`;
    image.loading = 'lazy';
    image.decoding = 'async';
    stage.append(image);
    const name = document.createElement('span');
    name.className = 'theme-option__name';
    name.textContent = theme.name;
    const meta = document.createElement('span');
    meta.className = 'theme-option__meta';
    meta.textContent = themeMeta(theme);
    button.append(stage, name, meta);
    button.addEventListener('click', () => previewTheme(theme.code));
    nodes.gallery.append(button);
  }
  const previewed = state.themes.find((theme) => theme.code === state.previewCode);
  if (previewed) {
    nodes.previewImage.src = previewed.previewPath;
    nodes.previewImage.alt = `${previewed.name} preview`;
    nodes.previewImage.hidden = false;
    nodes.previewName.textContent = previewed.name;
  }
  const canSave = Boolean(state.card && previewed?.isAvailable);
  nodes.save.disabled = !canSave;
  nodes.save.textContent = canSave
    ? 'Gunakan desain ini'
    : state.availabilityKnown && previewed
      ? `Tersedia mulai paket ${planLabel(previewed.minimumPlan)}`
      : 'Memuat akses desain...';
  nodes.filters.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.orientationFilter === state.orientation));
  });
}

function previewTheme(code) {
  const theme = state.themes.find((item) => item.code === code);
  if (!theme) return;
  state.previewCode = code;
  if (theme.isAvailable) {
    state.selectedCode = code;
    document.dispatchEvent(new CustomEvent('theme:selected', { detail: { themeCode: code } }));
  } else if (state.availabilityKnown) {
    document.dispatchEvent(new CustomEvent('theme:locked-selected', { detail: { themeCode: code } }));
  }
  render();
}

async function saveTheme() {
  if (!state.card) return;
  const selected = state.themes.find((theme) => theme.code === state.previewCode);
  if (!selected?.isAvailable) {
    showStatus(nodes.status, `Desain ini tersedia mulai paket ${planLabel(selected?.minimumPlan)}.`, 'error');
    return;
  }
  const message = validateThemeCode(state.previewCode);
  if (message) {
    showStatus(nodes.status, message, 'error');
    return;
  }
  nodes.save.disabled = true;
  showStatus(nodes.status, 'Menyimpan tema...', 'info');
  try {
    state.card = await cardService.updateTheme(state.card.publicId, state.previewCode);
    state.selectedCode = state.card.themeCode;
    document.dispatchEvent(new CustomEvent('theme:saved', { detail: { themeCode: state.card.themeCode } }));
    showStatus(nodes.status, 'Tema tersimpan.', 'success');
  } catch (error) {
    showStatus(nodes.status, error.message, 'error');
  } finally {
    nodes.save.disabled = false;
  }
}

function themeMeta(theme) {
  const orientation = theme.orientation === 'portrait' ? 'Vertikal' : 'Landscape';
  if (!state.availabilityKnown) return `${orientation} · Preview`;
  return theme.isAvailable
    ? `${orientation} · Tersedia`
    : `${orientation} · Mulai ${planLabel(theme.minimumPlan)}`;
}

function planLabel(plan) {
  return ({ starter: 'Starter', basic: 'Basic', pro: 'Pro' })[plan] ?? 'Pro';
}
