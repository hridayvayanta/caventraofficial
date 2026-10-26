'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load environment variables (.env or env.txt)
try {
  const envFile = [
    path.join(__dirname, '..', '..', '.env'),
    path.join(__dirname, '..', '..', 'env.txt')
  ].find(f => fs.existsSync(f));

  if (envFile) {
    for (const l of fs.readFileSync(envFile, 'utf8').split('\n')) {
      const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  }
} catch {}

const E = process.env;
const PORT = +E.PORT || 3000;
const DATA = path.resolve(E.DATA_DIR || path.join(__dirname, '..', '..', 'data'));
const PUB = path.join(__dirname, '..', '..', 'public');
const UP = path.join(DATA, 'uploads');
const PROD = E.NODE_ENV === 'production';
const NOTIFY_TO = E.NOTIFY_TO || 'caventraofficial@gmail.com';

if ((!E.ADMIN_PASSWORD || E.ADMIN_PASSWORD.length < 10) && !E.ADMIN_PASSWORD_HASH) {
  console.error('Set ADMIN_PASSWORD (at least 10 characters) or ADMIN_PASSWORD_HASH in .env or the environment.');
  process.exit(1);
}

fs.mkdirSync(UP, { recursive: true });

let SECRET = E.SESSION_SECRET;
if (!SECRET) {
  const f = path.join(DATA, '.secret');
  try {
    SECRET = fs.readFileSync(f, 'utf8');
  } catch {
    SECRET = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(f, SECRET, { mode: 0o600 });
  }
}

const SEC = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://*.googleusercontent.com; connect-src 'self' https://script.google.com https://script.googleusercontent.com https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebaseapp.com; frame-src 'self' https://*.firebaseapp.com https://accounts.google.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

module.exports = { E, PORT, DATA, PUB, UP, PROD, NOTIFY_TO, SECRET, SEC, MIME };
