import { authService } from '../../services/auth-service.js';
import { api } from '../../services/api-client.js';
import { resumeService } from '../../services/resume-service.js';

const body = document.querySelector('[data-queue]');
const search = document.querySelector('[data-search]');
const status = document.querySelector('[data-status]');
let rows = [];

document.querySelector('[data-logout]')?.addEventListener('click', async () => {
  await authService.logout();
  location.assign('/login/');
});
search?.addEventListener('input', render);
void init();

async function init() {
  try {
    const { user: actor } = await api.get('/me');
    if (actor.role !== 'cv_specialist') {
      location.replace(actor.role === 'super_admin' ? '/admin/' : '/app/');
      return;
    }
    rows = await resumeService.adminQueue();
    render();
  } catch (error) {
    if (error.status === 401) location.replace('/login/');
    else status.textContent = error.message;
  }
}

function render() {
  const query = search.value.trim().toLowerCase();
  const filtered = rows.filter((item) => JSON.stringify(item).toLowerCase().includes(query));
  body.replaceChildren(...filtered.map(row));
  status.textContent = filtered.length ? `${filtered.length} assigned request.` : 'Belum ada request yang ditugaskan kepada Anda.';
}

function row(item) {
  const line = document.createElement('tr');
  line.className = 'border-t border-white/10';
  const link = document.createElement('a');
  link.href = `/specialist/request/?id=${encodeURIComponent(item.publicId)}`;
  link.className = 'text-cyan-300 hover:underline';
  link.textContent = String(item.publicId).slice(0, 8);
  const values = [link, item.beneficiary, item.targetRole, item.status, item.slaDue ? new Date(item.slaDue).toLocaleString('id-ID') : '—', `${item.revisionCount}/3`];
  for (const value of values) {
    const cell = document.createElement('td');
    cell.className = 'px-2 py-3 align-top';
    if (value instanceof Node) cell.append(value); else cell.textContent = value ?? '—';
    line.append(cell);
  }
  return line;
}
