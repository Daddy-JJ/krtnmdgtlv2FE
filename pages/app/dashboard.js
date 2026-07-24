import { authService } from '../../services/auth-service.js';
import { dashboardService } from '../../services/dashboard-service.js';

const state = { cards: [], subscription: null, loading: true, error: null };
const nodes = {
  status: document.querySelector('[data-app-status]'),
  cardName: document.querySelector('[data-card-name]'),
  cardMeta: document.querySelector('[data-card-meta]'),
  cardUrl: document.querySelector('[data-card-url]'),
  cardStatus: document.querySelector('[data-card-status]'),
  subscription: document.querySelector('[data-subscription]'),
  navLinks: document.querySelectorAll('[data-app-link]'),
  logout: document.querySelector('[data-logout]'),
};

init();

function init() {
  bindEvents();
  load();
}

async function load() {
  renderLoading();
  try {
    const overview = await dashboardService.loadOverview();
    state.cards = overview.cards;
    state.subscription = overview.subscription;
    state.error = null;
  } catch (error) {
    if (error.status === 401) {
      document.dispatchEvent(new CustomEvent('auth:expired'));
      location.assign('/login/');
      return;
    }
    state.error = error;
  } finally {
    state.loading = false;
    render();
  }
}

function bindEvents() {
  nodes.logout?.addEventListener('click', async () => {
    nodes.logout.disabled = true;
    try {
      await authService.logout();
      location.assign('/login/');
    } catch (error) {
      setText(nodes.status, error.message);
      nodes.logout.disabled = false;
    }
  });
}

function renderLoading() {
  setText(nodes.status, 'Memuat dashboard...');
  nodes.navLinks.forEach((link) => link.setAttribute('aria-disabled', 'true'));
}

function render() {
  if (state.error) {
    setText(nodes.status, state.error.message);
    return;
  }
  const card = state.cards[0] ?? null;
  setText(nodes.status, card ? 'Dashboard siap.' : 'Belum ada kartu aktif di akun ini.');
  setText(nodes.cardName, card?.contact?.fullName || 'Belum ada kartu');
  setText(nodes.cardMeta, card ? `${labelPlan(card.planCode)} · ${labelStatus(card.status)}` : 'Claim kartu Starter atau aktifkan paket Basic/Pro.');
  setText(nodes.cardStatus, card ? labelStatus(card.status) : 'Kosong');
  if (card?.canonicalUrl) {
    nodes.cardUrl.href = card.canonicalUrl;
    setText(nodes.cardUrl, card.canonicalUrl);
  } else {
    nodes.cardUrl.removeAttribute('href');
    setText(nodes.cardUrl, '-');
  }
  setText(nodes.subscription, formatSubscription(state.subscription, card));
  nodes.navLinks.forEach((link) => link.removeAttribute('aria-disabled'));
}

function formatSubscription(subscription, card) {
  if (subscription?.planCode) return `${labelPlan(subscription.planCode)} aktif sampai ${formatDate(subscription.endsAt)}.`;
  if (card?.planCode === 'starter') return 'Starter aktif tanpa subscription berbayar.';
  return 'Belum ada subscription aktif.';
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date);
}

function labelPlan(plan) {
  return ({ starter: 'Starter', basic: 'Basic', pro: 'Pro' })[plan] ?? 'Unknown';
}

function labelStatus(status) {
  return ({ draft: 'Draft', published: 'Published', suspended: 'Suspended', deleted: 'Deleted', active: 'Active' })[status] ?? status ?? '-';
}

function setText(node, value) {
  if (node) node.textContent = value;
}
