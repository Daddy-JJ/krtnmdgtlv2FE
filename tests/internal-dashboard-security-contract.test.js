import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

test('Super Admin dashboard guards role, redirects anonymous sessions, exposes logout and tier totals', async () => {
  const [workspace, login] = await Promise.all([
    readFile(resolve(root, 'pages/admin/super-admin-workspace.js'), 'utf8'),
    readFile(resolve(root, 'pages/auth/login.js'), 'utf8'),
  ]);
  assert.match(workspace, /api\.get\('\/me'\)/);
  assert.match(workspace, /\['super_admin','admin'\]\.includes\(actor\.role\)/);
  assert.match(workspace, /error\.status===401[\s\S]*\/login\//);
  assert.match(workspace, /authService\.logout\(\)/);
  for (const tier of ['starterUsers', 'basicUsers', 'proUsers']) assert.match(workspace, new RegExp(tier));
  assert.match(login, /super_admin[\s\S]*\/admin\//);
  assert.doesNotMatch(workspace, /innerHTML|localStorage|sessionStorage/);
});

test('CV Specialist logout handles expired access tokens without hiding server errors', async () => {
  const [dashboard, request, auth] = await Promise.all([
    readFile(resolve(root, 'pages/specialist/dashboard.js'), 'utf8'),
    readFile(resolve(root, 'pages/specialist/request.js'), 'utf8'),
    readFile(resolve(root, 'services/auth-service.js'), 'utf8'),
  ]);
  for (const source of [dashboard, request]) {
    assert.match(source, /authService\.logout\(\)/);
    assert.match(source, /status\.textContent = error\.message/);
    assert.match(source, /logout\.disabled = false/);
  }
  assert.match(auth, /error\?\.status !== 401/);
  assert.match(auth, /api\.post\('\/auth\/refresh'/);
  assert.match(auth, /return request\(\);/);
});
