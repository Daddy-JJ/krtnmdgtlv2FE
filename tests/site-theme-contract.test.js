import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const themeScript = await readFile(new URL('../assets/js/site-theme.js', import.meta.url), 'utf8');
const themeStyles = await readFile(new URL('../assets/css/site-theme.css', import.meta.url), 'utf8');
const appStyles = await readFile(new URL('../assets/css/app.css', import.meta.url), 'utf8');
const loginPage = await readFile(new URL('../login/index.html', import.meta.url), 'utf8');
const registerPage = await readFile(new URL('../register/index.html', import.meta.url), 'utf8');

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules') continue;
    const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
    if (entry.isDirectory()) files.push(...await collect(url));
    else if (entry.name.endsWith('.html')) files.push(url);
  }
  return files;
}

test('every substantive frontend shell except public card loads the global theme assets', async () => {
  const files = await collect(new URL('../', import.meta.url));
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    if (!/<body\b/i.test(html) || file.pathname.endsWith('/public-card/index.html')) continue;
    assert.match(html, /href="\/assets\/css\/site-theme\.css"/, file.pathname);
    assert.match(html, /src="\/assets\/js\/site-theme\.js"/, file.pathname);
  }
});

test('theme controller uses one non-sensitive preference key and safe DOM APIs', () => {
  assert.match(themeScript, /knd\.theme\.preference/);
  assert.match(themeScript, /localStorage\.getItem\(storageKey\)/);
  assert.match(themeScript, /localStorage\.setItem\(storageKey, theme\)/);
  assert.doesNotMatch(themeScript, /token|password|credential|innerHTML|outerHTML/i);
  assert.match(themeScript, /dataSiteThemeToggle|siteThemeToggle/);
  assert.match(themeScript, /role', 'dialog'/);
  assert.match(themeScript, /Pilih tampilan Anda/);
});

test('theme stylesheet covers light, dark, public, auth, user, and admin shells', () => {
  assert.match(themeStyles, /html\[data-site-theme="light"\]/);
  assert.match(themeStyles, /html\[data-site-theme="dark"\]/);
  assert.match(themeStyles, /\.mono-page/);
  assert.match(themeStyles, /\.marketing-shell/);
  assert.match(themeStyles, /\.auth-shell/);
  assert.match(themeStyles, /\.dashboard-shell/);
  assert.match(themeStyles, /prefers-reduced-motion: reduce/);
  const shadowValues = [...themeStyles.matchAll(/box-shadow:\s*([^;]+)/g)].map((match) => match[1].trim());
  assert.ok(shadowValues.every((value) => value.startsWith('none')));
});

test('light workspace palette overrides legacy dark utility surfaces consistently', () => {
  assert.match(appStyles, /html:not\(\[data-site-theme="light"\]\) \.app-shell-page \.app-shell__main \.bg-white/);
  assert.match(appStyles, /html:not\(\[data-site-theme="light"\]\) \.app-shell-page \.app-shell__main input/);
  assert.match(appStyles, /html:not\(\[data-site-theme="light"\]\) \.app-shell-page \.app-shell__main \.text-slate-600/);
  assert.match(themeStyles, /html\[data-site-theme="light"\] \.dashboard-shell \.theme-option\s*\{[^}]*background:\s*var\(--site-paper\)[^}]*color:\s*var\(--site-ink\)/s);
  assert.match(themeStyles, /html\[data-site-theme="light"\] \.dashboard-shell \.theme-option\[aria-pressed="true"\]/);
});

test('login and register header CTAs use theme tokens instead of static color utilities', () => {
  assert.match(loginPage, /href="\/register\/" class="auth-header__cta"/);
  assert.match(registerPage, /href="\/login\/" class="auth-header__cta"/);
  assert.match(themeStyles, /\.auth-header \.auth-header__cta\s*\{[^}]*background:\s*var\(--site-ink\)[^}]*color:\s*var\(--site-inverse\)/s);
  assert.match(themeStyles, /\.auth-header \.auth-header__cta:hover\s*\{[^}]*background:\s*transparent[^}]*color:\s*var\(--site-ink\)/s);
});
