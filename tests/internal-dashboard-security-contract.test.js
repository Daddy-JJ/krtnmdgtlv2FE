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
