const httpUrlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

export const starterFields = ['fullName', 'jobTitle', 'organization', 'officePhone', 'mobilePhone', 'email', 'websiteUrl', 'addressText'];

export function buildStarterInput(values, locale = 'id') {
  return {
    locale: locale === 'en' ? 'en' : 'id',
    contact: {
      fullName: clean(values.fullName),
      jobTitle: clean(values.jobTitle),
      organization: clean(values.organization),
      officePhone: clean(values.officePhone),
      mobilePhone: clean(values.mobilePhone),
      email: clean(values.email).toLowerCase(),
      websiteUrl: clean(values.websiteUrl),
      addressText: clean(values.addressText),
    },
  };
}

export function validateStarterInput(input) {
  const contact = input?.contact ?? {};
  return compactErrors({
    fullName: requiredMax(contact.fullName, 'Nama', 150),
    jobTitle: maxOnly(contact.jobTitle, 'Jabatan', 120),
    organization: maxOnly(contact.organization, 'Perusahaan', 150),
    officePhone: maxOnly(contact.officePhone, 'Telepon kantor', 32),
    mobilePhone: maxOnly(contact.mobilePhone, 'Nomor mobile', 32),
    email: email(contact.email),
    websiteUrl: website(contact.websiteUrl),
    addressText: maxOnly(contact.addressText, 'Alamat', 1000),
  });
}

function clean(value) {
  return String(value ?? '').trim();
}

function requiredMax(value, label, max) {
  const text = clean(value);
  if (!text) return `${label} wajib diisi.`;
  if (text.length > max) return `${label} maksimal ${max} karakter.`;
  return '';
}

function maxOnly(value, label, max) {
  const text = clean(value);
  if (text.length > max) return `${label} maksimal ${max} karakter.`;
  return '';
}

function email(value) {
  const text = clean(value).toLowerCase();
  if (!text) return 'Email wajib diisi.';
  if (text.length > 190 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return 'Format email belum valid.';
  return '';
}

function website(value) {
  const text = clean(value);
  if (!text) return 'Website wajib diisi.';
  if (text.length > 500 || !httpUrlPattern.test(text)) return 'Website wajib memakai URL http atau https.';
  return '';
}

function compactErrors(errors) {
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}
