import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const landing = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const dashboard = await readFile(new URL('../app/index.html', import.meta.url), 'utf8');
const styles = await readFile(new URL('../assets/css/app.css', import.meta.url), 'utf8');

test('landing page exposes canonical SEO and social metadata', () => {
  assert.match(landing, /<title>[^<]*Kartu Nama Digital Profesional[^<]*<\/title>/);
  assert.match(landing, /<meta name="description" content="[^"]{100,180}">/);
  assert.match(landing, /<link rel="canonical" href="https:\/\/kartunamadigital\.id\/">/);
  assert.match(landing, /<link rel="icon" href="\/assets\/favicon\.svg" type="image\/svg\+xml">/);
  assert.match(landing, /<meta property="og:title"/);
  assert.match(landing, /<meta property="og:description"/);
  assert.match(landing, /<meta property="og:url" content="https:\/\/kartunamadigital\.id\/">/);
  assert.match(landing, /<script type="application\/ld\+json">/);
  assert.match(landing, /"@type": "WebSite"/);
});

test('landing visual contract contains responsive hero, terminal, checklist, CTA, and glass badges', () => {
  assert.match(landing, /class="landing-shell/);
  assert.match(landing, /lg:grid-cols-2/);
  assert.match(landing, /lg:items-start/);
  assert.match(landing, /lg:pb-24 lg:pt-16/);
  assert.match(landing, /terminal-stage[^"]*lg:self-center/);
  assert.doesNotMatch(landing, /lg:items-center|lg:py-24/);
  assert.match(landing, /class="gradient-text/);
  assert.match(landing, /class="terminal-window"/);
  assert.match(landing, /class="floating-badge/);
  assert.match(landing, /class="check-icon"/);
  assert.match(landing, /class="primary-cta/);
  assert.match(landing, />Buat Kartu Nama Digital, Sekarang<\/span>/);
  assert.match(landing, /Mulai sebagai Starter tanpa login\. Free\. Upgrade kapan saja saat dibutuhkan\./);
  assert.doesNotMatch(landing, /hero\.secondary|>Lihat paket<\/a>/);
  assert.match(styles, /backdrop-filter:\s*blur/);
  assert.match(styles, /--floating-badge-width:\s*clamp/);
  assert.match(styles, /\.floating-badge--secure\s*\{[^}]*top:\s*50%[^}]*transform:\s*translateY\(-50%\)/s);
  assert.match(styles, /--floating-badge-width:\s*calc\(50%\s*-\s*\.35rem\)/);
  assert.match(styles, /\.floating-badge--secure\s*\{[^}]*top:\s*var\(--floating-badge-edge\)[^}]*transform:\s*none/s);
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
});
