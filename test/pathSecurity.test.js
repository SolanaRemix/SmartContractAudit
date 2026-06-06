const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { ensureAllowedPath } = require('../script/utils/pathSecurity');

test('allows files within allowed base', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sca-safe-'));
  const base = path.join(root, 'base');
  const nested = path.join(base, 'reports');
  fs.mkdirSync(nested, { recursive: true });
  const file = path.join(nested, 'in.json');
  fs.writeFileSync(file, '{}');

  const resolved = ensureAllowedPath(file, base);
  assert.equal(resolved, fs.realpathSync(file));
});

test('rejects traversal payloads and normalized escapes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sca-traversal-'));
  const base = path.join(root, 'base');
  fs.mkdirSync(base, { recursive: true });

  const outside = '/etc/passwd';
  assert.throws(() => ensureAllowedPath(outside, base), /Path traversal detected/);

  assert.throws(
    () => ensureAllowedPath(path.join(base, '..', '.', '..', 'etc', 'passwd'), base),
    /Path traversal detected/
  );
});

test('rejects symlink escape attacks', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sca-symlink-'));
  const base = path.join(root, 'base');
  const outsideDir = path.join(root, 'outside');
  fs.mkdirSync(base, { recursive: true });
  fs.mkdirSync(outsideDir, { recursive: true });

  const outsideFile = path.join(outsideDir, 'secret.txt');
  fs.writeFileSync(outsideFile, 'secret');

  const linkPath = path.join(base, 'link.txt');
  fs.symlinkSync(outsideFile, linkPath);

  assert.throws(() => ensureAllowedPath(linkPath, base), /Path traversal detected/);
});
