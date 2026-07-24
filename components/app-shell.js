import { authService } from '../services/auth-service.js';

const links = [
  ['/app/', 'Overview'],
  ['/app/card/identity/', 'Kartu Nama'],
  ['/app/card/design/', 'Design'],
  ['/app/card/settings/', 'Settings & QR'],
  ['/app/card/social/', 'Social'],
  ['/app/card/catalog/', 'Catalog'],
  ['/app/billing/', 'Billing'],
  ['/app/account/', 'Account'],
  ['/app/feedback/', 'User feedback'],
];

const main = document.querySelector('main#main');
if (main) mountShell(main);

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function mountShell(content) {
  document.body.classList.add('dashboard-shell', 'app-shell-page');
  document.body.classList.remove('bg-slate-100', 'text-slate-900');
  document.body.querySelector(':scope > header')?.remove();

  const oldParent = content.parentElement;
  oldParent?.querySelector(':scope > aside')?.remove();

  const header = element('header', 'dashboard-header app-shell__header sticky top-0 z-40');
  const headerNav = element('nav', 'app-shell__header-nav');
  headerNav.setAttribute('aria-label', 'Navigasi aplikasi');
  const brand = element('a', 'app-shell__brand');
  brand.href = '/app/';
  const mark = element('span', 'brand-mark');
  mark.setAttribute('aria-hidden', 'true');
  mark.append(element('span'));
  brand.append(mark, document.createTextNode('KartuNamaDigital'), element('span', 'app-shell__brand-domain', '.id'));

  const menuButton = element('button', 'app-shell__menu-button', 'Menu');
  menuButton.type = 'button';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-controls', 'app-sidebar');
  const logout = element('button', 'app-shell__logout', 'Keluar');
  logout.type = 'button';
  headerNav.append(brand, menuButton, logout);
  header.append(headerNav);

  const layout = element('div', 'app-shell__layout');
  const aside = element('aside', 'dashboard-panel app-shell__sidebar');
  aside.id = 'app-sidebar';
  aside.setAttribute('aria-label', 'Menu workspace');
  aside.append(element('p', 'app-shell__nav-label', 'Workspace'));
  const nav = element('nav', 'app-shell__nav');
  nav.setAttribute('aria-label', 'Halaman user');
  const currentPath = normalizePath(location.pathname);
  for (const [href, label] of links) {
    const link = element('a', 'dashboard-link', label);
    link.href = href;
    link.dataset.appLink = '';
    if (normalizePath(href) === currentPath) {
      link.classList.add('dashboard-link--active');
      link.setAttribute('aria-current', 'page');
    }
    nav.append(link);
  }
  aside.append(nav);
  const mobileLogout = element('button', 'app-shell__sidebar-logout', 'Keluar');
  mobileLogout.type = 'button';
  aside.append(mobileLogout);

  content.classList.add('app-shell__main');
  layout.append(aside, content);
  document.body.insertBefore(header, document.body.querySelector('.skip-link')?.nextSibling ?? document.body.firstChild);
  document.body.append(layout);
  if (oldParent && oldParent !== document.body && oldParent.childElementCount === 0) oldParent.remove();

  menuButton.addEventListener('click', () => {
    const open = document.body.classList.toggle('app-shell--menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  const handleLogout = async () => {
    logout.disabled = true;
    mobileLogout.disabled = true;
    try {
      await authService.logout();
      location.assign('/login/');
    } catch {
      logout.disabled = false;
      mobileLogout.disabled = false;
    }
  };
  logout.addEventListener('click', handleLogout);
  mobileLogout.addEventListener('click', handleLogout);
  requestAnimationFrame(() => document.body.classList.add('app-shell--ready'));
}

function normalizePath(path) {
  return path.endsWith('/') ? path : `${path}/`;
}
