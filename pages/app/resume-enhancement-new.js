import { resumeService } from '../../services/resume-service.js';

const MAX_DOCX_BYTES = 10 * 1024 * 1024;
const form = document.querySelector('[data-form]');
const status = document.querySelector('[data-status]');
const fileInput = form.elements.sourceResume;
const fileStatus = document.querySelector('[data-file-status]');

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  fileStatus.textContent = file
    ? `${file.name} · ${formatBytes(file.size)}`
    : 'Belum ada file dipilih.';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = fileInput.files?.[0];
  const fileError = validateSourceDocx(file);
  if (fileError) {
    status.textContent = fileError;
    fileInput.focus();
    return;
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  delete data.sourceResume;
  data.experienceYears = data.experienceYears ? Number(data.experienceYears) : null;
  data.consents = {
    accurate: Boolean(data.accurate),
    specialistAccess: Boolean(data.specialistAccess),
    noFiction: Boolean(data.noFiction),
    userReview: Boolean(data.userReview),
    retention: Boolean(data.retention),
  };
  for (const key of ['accurate', 'specialistAccess', 'noFiction', 'userReview', 'retention']) delete data[key];
  for (const key of [
    'currentOrganization', 'targetCompany', 'linkedinUrl', 'pastedResumeText',
    'pastedJobDescription', 'additionalAchievements', 'certifications',
  ]) data[key] = String(data[key] ?? '').trim() || null;

  let publicId = null;
  setBusy(true, 'Membuat permintaan...');
  try {
    const created = await resumeService.create(data);
    publicId = created.publicId;
    status.textContent = 'Mengupload dan memvalidasi CV...';
    await resumeService.upload(publicId, 'SOURCE_RESUME', file);
    location.assign(`/app/resume-enhancement/request/?id=${encodeURIComponent(publicId)}`);
  } catch (error) {
    if (publicId) {
      location.assign(`/app/resume-enhancement/request/?id=${encodeURIComponent(publicId)}&upload=pending`);
      return;
    }
    status.textContent = error.message;
    setBusy(false);
  }
});

function validateSourceDocx(file) {
  if (!(file instanceof File) || !file.size) return 'Pilih file CV .docx terlebih dahulu.';
  if (!file.name.toLowerCase().endsWith('.docx')) return 'CV sumber wajib menggunakan format .docx.';
  if (file.size > MAX_DOCX_BYTES) return 'Ukuran file melebihi batas maksimum 10 MB.';
  return '';
}

function setBusy(busy, message) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = busy;
  if (message) status.textContent = message;
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
