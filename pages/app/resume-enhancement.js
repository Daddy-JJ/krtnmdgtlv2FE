import { resumeService } from '../../services/resume-service.js';

const status = document.querySelector('[data-status]');
const summary = document.querySelector('[data-summary]');
const list = document.querySelector('[data-list]');
const newLink = document.querySelector('[data-new]');

init();

async function init() {
  try {
    const [eligibility, requests] = await Promise.all([
      resumeService.eligibility(),
      resumeService.list(),
    ]);
    status.textContent = eligibility.hasActivePro
      ? eligibility.emailVerified
        ? 'Benefit Pro siap digunakan.'
        : 'Verifikasi email diperlukan.'
      : 'Resume Enhancement tersedia khusus membership Pro aktif.';
    newLink.hidden = !eligibility.available;
    summary.replaceChildren(
      card('Eligibility', eligibility.available ? 'Tersedia' : eligibility.requestStatus ?? 'Belum tersedia'),
      card('Periode subscription', `${date(eligibility.periodStart)} – ${date(eligibility.periodEnd)}`),
    );
    list.replaceChildren(...(requests.length
      ? requests.map(requestCard)
      : [card('Belum ada permintaan', 'Upload CV .docx Anda saat benefit Pro sudah siap.')]));
  } catch (error) {
    if (error.status === 401) {
      location.assign('/login/');
      return;
    }
    status.textContent = error.message;
  }
}

function requestCard(request) {
  const article = document.createElement('article');
  article.className = 'dashboard-panel p-5';
  const top = document.createElement('div');
  top.className = 'flex flex-wrap items-start justify-between gap-3';
  const copy = document.createElement('div');
  copy.append(
    title(request.beneficiaryName),
    text(`${request.status} · Revisi ${request.revisionCount}/${request.maxRevisions}`),
  );
  const actions = document.createElement('div');
  actions.className = 'flex flex-wrap gap-2';
  actions.append(actionLink(
    `/app/resume-enhancement/request/?id=${encodeURIComponent(request.publicId)}`,
    request.status === 'DRAFT' ? 'Lanjutkan upload' : 'Lihat detail',
    'dashboard-action',
  ));
  if (request.status === 'COMPLETED') {
    actions.append(actionLink(
      resumeService.downloadUrl(request.publicId),
      'Download hasil .docx',
      'primary-cta rounded-xl px-4 py-3 font-bold',
    ));
  }
  top.append(copy, actions);
  article.append(top);
  return article;
}

function actionLink(href, label, className) {
  const link = document.createElement('a');
  link.href = href;
  link.className = className;
  link.textContent = label;
  return link;
}

function card(label, value) {
  const element = document.createElement('article');
  element.className = 'dashboard-panel p-5';
  element.append(text(label, 'text-sm text-slate-400'), title(value));
  return element;
}

function title(value) {
  return text(value, 'mt-2 text-xl font-black');
}

function text(value, className = 'text-slate-300') {
  const paragraph = document.createElement('p');
  paragraph.className = className;
  paragraph.textContent = value ?? '-';
  return paragraph;
}

function date(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value));
}
