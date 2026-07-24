import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const publicPages = ['about', 'contact', 'faq', 'privacy', 'cookies', 'terms', 'refund'];
const privatePages = [
  'login/index.html',
  'register/index.html',
  'verify-email/index.html',
  'forgot-password/index.html',
  'reset-password/index.html',
  'create/index.html',
  'starter/manage/index.html',
];

test('standard public pages expose unique indexable SEO metadata and landmarks', async () => {
  const titles = new Set();
  const descriptions = new Set();

  for (const page of publicPages) {
    const html = await readFile(new URL(`../${page}/index.html`, import.meta.url), 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];

    assert.ok(title, `${page} needs a title`);
    assert.ok(description, `${page} needs a meta description`);
    assert.ok(description.length >= 90 && description.length <= 180, `${page} description length`);
    assert.ok(html.includes(`<link rel="canonical" href="https://kartunamadigital.id/${page}/">`));
    assert.match(html, /<meta name="robots" content="index, follow/);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${page} needs exactly one h1`);
    assert.match(html, /<header\b/);
    assert.match(html, /<main\b[^>]*id="main"/);
    assert.match(html, /<footer\b/);
    assert.match(html, /class="marketing-shell"/);
    assert.match(html, /href="\/assets\/css\/tailwind\.css"/);
    assert.doesNotMatch(html, /cdn\.tailwindcss\.com/);
    titles.add(title);
    descriptions.add(description);
  }

  assert.equal(titles.size, publicPages.length);
  assert.equal(descriptions.size, publicPages.length);
});

test('about page provides parseable Organization structured data', async () => {
  const html = await readFile(new URL('../about/index.html', import.meta.url), 'utf8');
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json);
  const data = JSON.parse(json);
  assert.equal(data['@type'], 'Organization');
  assert.equal(data.url, 'https://kartunamadigital.id/');
  assert.equal(data.email, 'support@kartunamadigital.id');
});

test('robots and sitemap include only intended indexable marketing routes', async () => {
  const robots = await readFile(new URL('../robots.txt', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../sitemap.xml', import.meta.url), 'utf8');
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/kartunamadigital\.id\/sitemap\.xml/);

  for (const page of publicPages) {
    assert.ok(sitemap.includes(`<loc>https://kartunamadigital.id/${page}/</loc>`));
  }
  assert.doesNotMatch(sitemap, /\/(?:login|register|create|app)\//);
});

test('authentication and Starter management pages remain noindex', async () => {
  for (const page of privatePages) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex, follow">/);
    assert.match(html, /class="auth-shell/);
    assert.match(html, /href="\/assets\/css\/tailwind\.css"/);
  }
});

test('all frontend HTML uses compiled CSS instead of Tailwind Play CDN', async () => {
  async function collect(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const results = [];
    for (const entry of entries) {
      const url = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
      if (entry.isDirectory()) results.push(...await collect(url));
      else if (entry.name.endsWith('.html')) results.push(url);
    }
    return results;
  }

  const files = await collect(new URL('../', import.meta.url));
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    assert.doesNotMatch(html, /cdn\.tailwindcss\.com/, file.pathname);
    if (/<!doctype html>/i.test(html) && !/<meta http-equiv="refresh"/i.test(html)) {
      assert.match(html, /href="\/assets\/css\/[^"]+\.css"/, file.pathname);
    }
  }
});
