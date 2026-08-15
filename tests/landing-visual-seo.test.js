import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const dashboard = await readFile(new URL('../app/index.html', import.meta.url), 'utf8');
const styles = await readFile(new URL('../assets/css/marketing-monochrome.css', import.meta.url), 'utf8');

test('landing page exposes canonical SEO and social metadata', () => {
  assert.match(landing, /<title>[^<]*Identitas Profesional[^<]*KartuNamaDigital\.id<\/title>/);
  assert.match(landing, /<meta name="description" content="[^"]{100,180}">/);
  assert.match(landing, /<link rel="canonical" href="https:\/\/kartunamadigital\.id\/">/);
  assert.match(landing, /<link rel="icon" href="\/assets\/favicon\.svg" type="image\/svg\+xml">/);
  assert.match(landing, /<meta property="og:title"/);
  assert.match(landing, /<meta property="og:description"/);
  assert.match(landing, /<meta property="og:url" content="https:\/\/kartunamadigital\.id\/">/);
  assert.match(landing, /<script type="application\/ld\+json">/);
  assert.match(landing, /"@type": "WebSite"/);
});

test('landing visual contract contains the approved monochrome sections and accessible navigation', () => {
  assert.match(landing, /<body class="mono-page">/);
  assert.match(landing, /Satu Link untuk Membuat Anda Lebih Dikenal, Dihubungi, dan Diingat/);
  assert.match(landing, /data-mobile-menu-button/);
  assert.match(landing, /aria-expanded="false"/);
  assert.match(landing, /aria-controls="mobile-menu"/);
  assert.match(landing, /class="mono-product-scene"/);
  assert.match(landing, /class="mono-qr-placeholder"/);
  assert.match(landing, /id="fitur"/);
  assert.match(landing, /Lebih dari Sekadar Kartu Nama/);
  assert.match(landing, /Jadikan Profil LinkedIn Anda Lebih Mudah Dihubungi/);
  assert.match(landing, /id="cara-kerja"/);
  assert.match(landing, /Pilih Sesuai Kebutuhan Anda/);
  assert.match(landing, /Keamanan sebagai Fondasi/);
  assert.match(landing, /Siap Meningkatkan Profesionalitas Anda/);
  assert.equal((landing.match(/<h1\b/g) ?? []).length, 1);
  assert.doesNotMatch(landing, /terminal-window|floating-badge|gradient-text|backdrop-filter/);
  assert.match(styles, /--mono-paper:\s*#fff/);
  assert.doesNotMatch(styles, /box-shadow|backdrop-filter/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
});

test('dashboard adopts the visual system while remaining out of search indexes', () => {
  assert.match(dashboard, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(dashboard, /class="dashboard-shell/);
  assert.match(dashboard, /class="dashboard-panel/);
  assert.match(dashboard, /data-app-status/);
  assert.match(dashboard, /data-card-name/);
  assert.match(dashboard, /data-subscription/);
  assert.match(dashboard, /data-logout/);
  assert.match(dashboard, /data-primary-card-action/);
  assert.match(dashboard, /data-starter-action/);
});
