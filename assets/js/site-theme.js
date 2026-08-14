(function bootstrapSiteTheme() {
  'use strict';

  var storageKey = 'knd.theme.preference';
  var root = document.documentElement;
  var systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function readPreference() {
    try {
      var value = window.localStorage.getItem(storageKey);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  function storePreference(theme) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // A blocked storage API must not prevent theme selection for this page.
    }
  }

  function applyTheme(theme) {
    var normalized = theme === 'dark' ? 'dark' : 'light';
    root.dataset.siteTheme = normalized;
    root.classList.toggle('app-theme-dark', normalized === 'dark');
    root.style.colorScheme = normalized;

    var colorMeta = document.querySelector('meta[name="theme-color"]');
    if (colorMeta instanceof HTMLMetaElement) {
      colorMeta.content = normalized === 'dark' ? '#141414' : '#e4e3e0';
    }

    var toggle = document.querySelector('[data-site-theme-toggle]');
    if (toggle instanceof HTMLButtonElement) {
      var nextLabel = normalized === 'dark' ? 'Gunakan tema terang' : 'Gunakan tema gelap';
      toggle.setAttribute('aria-label', nextLabel);
      toggle.setAttribute('title', nextLabel);
      toggle.setAttribute('aria-pressed', String(normalized === 'dark'));
      var label = toggle.querySelector('[data-site-theme-label]');
      if (label instanceof HTMLElement) label.textContent = normalized === 'dark' ? 'Gelap' : 'Terang';
    }
  }

  function currentTheme() {
    return root.dataset.siteTheme === 'dark' ? 'dark' : 'light';
  }

  var savedPreference = readPreference();
  applyTheme(savedPreference || (systemQuery.matches ? 'dark' : 'light'));

  function createElement(tag, className, text) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function mountThemeControls() {
    if (!document.body || document.querySelector('[data-site-theme-toggle]')) return;

    var toggle = createElement('button', 'site-theme-toggle');
    toggle.type = 'button';
    toggle.dataset.siteThemeToggle = '';
    toggle.setAttribute('aria-live', 'polite');

    var icon = createElement('span', 'site-theme-toggle__icon', '◐');
    icon.setAttribute('aria-hidden', 'true');
    var label = createElement('span', 'site-theme-toggle__label');
    label.dataset.siteThemeLabel = '';
    toggle.append(icon, label);
    document.body.append(toggle);
    applyTheme(currentTheme());

    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      storePreference(next);
      applyTheme(next);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountThemeControls, { once: true });
  } else {
    mountThemeControls();
  }

  function followSystemTheme(event) {
    if (!readPreference()) applyTheme(event.matches ? 'dark' : 'light');
  }

  if (typeof systemQuery.addEventListener === 'function') {
    systemQuery.addEventListener('change', followSystemTheme);
  } else if (typeof systemQuery.addListener === 'function') {
    systemQuery.addListener(followSystemTheme);
  }
}());
