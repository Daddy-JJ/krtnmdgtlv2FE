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
let navigationController = null;
let navigationSequence = 0;

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
  bindPageNavigation();
  requestAnimationFrame(() => document.body.classList.add('app-shell--ready'));
}

function bindPageNavigation() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!isAppNavigation(event, link)) return;
    const destination = new URL(link.href, location.href);
    event.preventDefault();
    if (destination.href === location.href) return;
    navigate(destination, true);
  });
  addEventListener('popstate', () => navigate(new URL(location.href), false));
}

function isAppNavigation(event, link) {
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey
    || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return false;
  const destination = new URL(link.href, location.href);
  return destination.origin === location.origin && destination.pathname.startsWith('/app/');
}

async function navigate(destination, pushHistory) {
  navigationController?.abort();
  navigationController = new AbortController();
  const sequence = ++navigationSequence;
  document.body.classList.add('app-shell--navigating');
  document.querySelector('main#main')?.setAttribute('aria-busy', 'true');

  try {
    const response = await fetch(destination.href, {
      headers: { Accept: 'text/html' },
      credentials: 'same-origin',
      signal: navigationController.signal,
    });
    if (!response.ok) throw new Error(`Navigation failed with ${response.status}.`);
    const page = new DOMParser().parseFromString(await response.text(), 'text/html');
    const sourceMain = page.querySelector('main#main');
    if (!sourceMain) throw new Error('Destination does not expose the application main region.');
    const nextMain = document.importNode(sourceMain, true);
    nextMain.classList.add('app-shell__main');
    const moduleSources = [...page.querySelectorAll('script[type="module"][src]')]
      .map((script) => new URL(script.getAttribute('src'), destination).href)
      .filter((source) => !source.endsWith('/components/app-shell.js'));

    const update = () => {
      document.querySelector('main#main')?.replaceWith(nextMain);
      document.title = page.title;
      if (pushHistory) history.pushState({}, '', destination);
      updateActiveLink(destination.pathname);
      scrollTo({ top: 0, behavior: 'auto' });
    };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduced) {
      await document.startViewTransition(update).updateCallbackDone;
    } else {
      update();
    }
    if (sequence !== navigationSequence) return;
    await Promise.all(moduleSources.map((source) => import(`${source}?navigation=${sequence}`)));
  } catch (error) {
    if (error.name !== 'AbortError') location.assign(destination.href);
  } finally {
    if (sequence === navigationSequence) {
      document.body.classList.remove('app-shell--navigating', 'app-shell--menu-open');
      document.querySelector('main#main')?.removeAttribute('aria-busy');
      document.querySelector('.app-shell__menu-button')?.setAttribute('aria-expanded', 'false');
    }
  }
}

function updateActiveLink(pathname) {
  const currentPath = normalizePath(pathname);
  document.querySelectorAll('[data-app-link]').forEach((link) => {
    const active = normalizePath(new URL(link.href, location.href).pathname) === currentPath;
    link.classList.toggle('dashboard-link--active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function normalizePath(path) {
  return path.endsWith('/') ? path : `${path}/`;
}
