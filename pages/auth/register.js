import { authService } from '../../services/auth-service.js';
import { validateRegister, normalizeEmail } from '../../validators/auth-validator.js';
import { clearFieldErrors, formValues, mapApiFieldErrors, setBusy, showFieldErrors, showStatus } from '../../components/forms/form-utils.js';
import { authErrorMessage, pendingStarterClaim, safeMembershipIntent, safeReturnTo, starterPublicIdFromReturnTo, withAuthContext } from '../../utils/auth-flow.js';

const form = document.querySelector('[data-register-form]');
const status = document.querySelector('[data-form-status]');
const query = new URLSearchParams(location.search);
const returnTo = safeReturnTo(query.get('returnTo'));
const intent = safeMembershipIntent(query.get('intent'));
const starterId = starterPublicIdFromReturnTo(returnTo) || pendingStarterClaim();
const loginLink = document.querySelector('a[href="/login/"]');

if (loginLink) loginLink.href = withAuthContext('/login/', { returnTo, intent });
if (starterId) {
  document.querySelector('.auth-intro')?.replaceChildren(document.createTextNode('Buat akun untuk menghubungkan kartu Starter Anda. Setelah verifikasi email, kartu akan muncul di workspace.'));
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = formValues(form);
  input.email = normalizeEmail(input.email);
  const errors = validateRegister(input);
  if (Object.keys(errors).length) {
    showFieldErrors(form, errors);
    showStatus(status, 'Periksa field yang ditandai.', 'error');
    return;
  }
  clearFieldErrors(form);
  setBusy(form, true);
  showStatus(status, starterId ? 'Membuat akun untuk menghubungkan kartu Starter...' : 'Mendaftarkan akun...', 'info');
  try {
    await authService.register(input);
    showStatus(status, 'Registrasi diterima. Kode OTP dikirim ke email Anda.', 'success');
    const next = new URL(`/verify-email/?email=${encodeURIComponent(input.email)}`, location.origin);
    if (returnTo) next.searchParams.set('returnTo', returnTo);
    if (intent) next.searchParams.set('intent', intent);
    location.assign(`${next.pathname}${next.search}`);
  } catch (error) {
    showFieldErrors(form, mapApiFieldErrors(error.details));
    showStatus(status, authErrorMessage(error, 'Pendaftaran belum dapat diproses.'), 'error');
  } finally {
    setBusy(form, false);
  }
});
