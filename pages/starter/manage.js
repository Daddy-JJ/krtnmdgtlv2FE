import { starterService } from '../../services/starter-service.js';
import { withAuthContext } from '../../utils/auth-flow.js';
import { showStatus } from '../../components/forms/form-utils.js';

const status = document.querySelector('[data-form-status]');
const params = new URLSearchParams(location.search);
const publicId = params.get('publicId') ?? '';
const returnTo = publicId ? `/starter/manage/?publicId=${encodeURIComponent(publicId)}` : '';
const loginLinks = document.querySelectorAll('[data-starter-login]');
const signupLinks = document.querySelectorAll('[data-starter-signup]');

loginLinks.forEach((link) => { link.href = withAuthContext('/login/', { returnTo }); });
signupLinks.forEach((link) => { link.href = withAuthContext('/register/', { returnTo }); });

if (!publicId) {
  showStatus(status, 'Link pengelolaan tidak lengkap. Buka kembali link dari email Anda.', 'error');
  [...loginLinks, ...signupLinks].forEach((link) => link.setAttribute('aria-disabled', 'true'));
} else {
  openEmailAccess();
}

async function openEmailAccess() {
  const token = new URLSearchParams(location.hash.slice(1)).get('token');
  if (!token) {
    showStatus(status, 'Login atau signup untuk menghubungkan kartu ini ke akun Anda.', 'info');
    return;
  }
  showStatus(status, 'Memverifikasi link pengelolaan...', 'info');
  try {
    await starterService.openAccess(publicId, token);
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    showStatus(status, 'Kartu siap dihubungkan. Login atau signup untuk melanjutkan.', 'success');
  } catch (error) {
    showStatus(status, 'Link pengelolaan tidak valid atau sudah kedaluwarsa. Minta link baru melalui support.', 'error');
  }
}
