import { paymentService } from '../../services/payment-service.js';
import { billingStatusLabel, validatePlanCode } from '../../validators/payment-validator.js';
import { showStatus } from '../../components/forms/form-utils.js';

const status = document.querySelector('[data-form-status]');
const subscription = document.querySelector('[data-subscription-summary]');
const history = document.querySelector('[data-payment-history]');
const checkoutButtons = document.querySelectorAll('[data-checkout-plan]');
const upgradeCards = document.querySelectorAll('[data-upgrade-card]');
const upgradeNote = document.querySelector('[data-upgrade-note]');
const proUpgradePrice = document.querySelector('[data-pro-upgrade-price]');
const proUpgradePath = document.querySelector('[data-pro-upgrade-path]');
const state = { payments: [], subscription: null };

init();

function init() {
  load();
  checkoutButtons.forEach((button) => button.addEventListener('click', () => checkout(button.dataset.checkoutPlan)));
  history?.addEventListener('click', reconcile);
}

async function load() {
  showStatus(status, 'Memuat billing...', 'info');
  try {
    const [sub, payments] = await Promise.all([
      paymentService.currentSubscription().catch((error) => error.status === 404 ? null : Promise.reject(error)),
      paymentService.listPayments(),
    ]);
    state.subscription = sub;
    state.payments = Array.isArray(payments) ? payments : [];
    render();
    showStatus(status, 'Billing siap.', 'success');
  } catch (error) {
    if (error.status === 401) {
      location.assign('/login/');
      return;
    }
    showStatus(status, error.message, 'error');
  }
}

async function checkout(planCode) {
  const message = validatePlanCode(planCode);
  if (message) {
    showStatus(status, message, 'error');
    return;
  }
  toggleCheckout(true);
  showStatus(status, `Menyiapkan checkout ${planCode.toUpperCase()}...`, 'info');
  try {
    const payment = await paymentService.checkout(planCode);
    state.payments = [payment, ...state.payments.filter((item) => item.publicId !== payment.publicId)];
    render();
    showStatus(status, 'Checkout dibuat. Status membership aktif hanya setelah backend memverifikasi pembayaran.', 'success');
    if (payment.redirectUrl) window.open(payment.redirectUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    showStatus(status, error.message, 'error');
  } finally {
    toggleCheckout(false);
  }
}

async function reconcile(event) {
  const button = event.target.closest('[data-reconcile-payment]');
  if (!button) return;
  button.disabled = true;
  showStatus(status, 'Menyegarkan status dari backend...', 'info');
  try {
    await paymentService.reconcile(button.dataset.reconcilePayment);
    await load();
  } catch (error) {
    showStatus(status, error.message, 'error');
    button.disabled = false;
  }
}

function render() {
  renderSubscription();
  renderUpgradeOptions();
  renderHistory();
}

function renderSubscription() {
  subscription.replaceChildren();
  const title = document.createElement('p');
  title.className = 'text-2xl font-black';
  title.textContent = state.subscription?.planCode ? state.subscription.planCode.toUpperCase() : 'Starter / no active paid plan';
  const meta = document.createElement('p');
  meta.className = 'mt-2 text-sm text-slate-600';
  meta.textContent = state.subscription?.endsAt ? `Annual subscription 365 hari · aktif sampai ${formatDate(state.subscription.endsAt)}` : 'Paid features tetap locked sampai backend melaporkan annual subscription aktif.';
  subscription.append(title, meta);
}

function renderUpgradeOptions() {
  const currentPlan = state.subscription?.planCode ?? 'starter';
  const allowed = currentPlan === 'starter' ? ['basic', 'pro'] : currentPlan === 'basic' ? ['pro'] : [];
  upgradeCards.forEach((card) => {
    const plan = card.dataset.upgradeCard;
    const isVisible = allowed.includes(plan);
    card.hidden = !isVisible;
    card.querySelectorAll('button').forEach((button) => { button.disabled = !isVisible; });
  });
  if (currentPlan === 'basic') {
    proUpgradePrice.textContent = 'Rp55.000';
    proUpgradePath.textContent = 'Basic ke Pro';
  } else {
    proUpgradePrice.textContent = 'Rp97.000';
    proUpgradePath.textContent = 'Starter ke Pro';
  }
  upgradeNote.textContent = currentPlan === 'pro'
    ? 'Membership Pro sudah aktif. Opsi upgrade tidak ditampilkan.'
    : 'Harga upgrade fixed dari backend dan masa aktif target tier menjadi 365 hari sejak pembayaran terverifikasi.';
}

function renderHistory() {
  history.replaceChildren();
  if (!state.payments.length) {
    const empty = document.createElement('p');
    empty.className = 'rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600';
    empty.textContent = 'Belum ada payment history.';
    history.append(empty);
    return;
  }
  for (const payment of state.payments) {
    const row = document.createElement('article');
    row.className = 'rounded-lg border border-slate-200 bg-white p-4';
    const title = document.createElement('h2');
    title.className = 'font-bold';
    title.textContent = `${payment.planName ?? payment.targetPlanCode?.toUpperCase()} · ${billingStatusLabel(payment.status)}`;
    const meta = document.createElement('p');
    meta.className = 'mt-1 text-sm text-slate-600';
    meta.textContent = `${formatMoney(payment.amount, payment.currency)} · ${payment.durationDays??365} hari · ${formatDate(payment.createdAt)}`;
    const actions = document.createElement('div');
    actions.className = 'mt-3 flex flex-wrap gap-2';
    if (payment.redirectUrl && payment.status === 'pending') {
      const pay = document.createElement('a');
      pay.className = 'min-h-11 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white';
      pay.href = payment.redirectUrl;
      pay.target = '_blank';
      pay.rel = 'noopener noreferrer';
      pay.textContent = 'Lanjut bayar';
      actions.append(pay);
    }
    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold';
    refresh.dataset.reconcilePayment = payment.publicId;
    refresh.textContent = 'Refresh status';
    actions.append(refresh);
    row.append(title, meta, actions);
    history.append(row);
  }
}

function toggleCheckout(disabled) {
  checkoutButtons.forEach((button) => { button.disabled = disabled; });
}

function formatMoney(amount, currency = 'IDR') {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(Number(amount ?? 0));
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(date);
}
