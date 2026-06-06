const fs = require('fs');
const path = require('path');

function ensureAllowedPath(targetPath, allowedBase) {
  if (!targetPath || typeof targetPath !== 'string') {
    throw new Error('Path must be a non-empty string');
  }

  const normalizedBase = path.resolve(path.normalize(allowedBase));
  const normalizedTarget = path.resolve(path.normalize(targetPath));

  const existingBase = fs.realpathSync(normalizedBase);
  const existingTarget = fs.realpathSync(normalizedTarget);

  if (!existingTarget.startsWith(existingBase + path.sep) && existingTarget !== existingBase) {
    throw new Error('Path traversal detected: target is outside allowed base');
  }

  return existingTarget;
}

module.exports = { ensureAllowedPath };
