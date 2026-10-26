'use strict';

const crypto = require('crypto');
const { E, SECRET, PROD } = require('../config');

const sha = s => crypto.createHash('sha256').update(s).digest('hex');

const makeSession = () => {
  const exp = Date.now() + 7 * 864e5;
  const sig = crypto.createHmac('sha256', SECRET).update(String(exp)).digest('hex');
  return `${exp}.${sig}`;
};

const isAdmin = req => {
  const m = (req.headers.cookie || '').match(/(?:^|;\s*)cv_sess=([^;]+)/);
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || +exp < Date.now()) return false;
  const expected = crypto.createHmac('sha256', SECRET).update(String(exp)).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
};

const BUCKETS = new Map();
const limited = (key, limit, windowMs) => {
  const now = Date.now();
  let b = BUCKETS.get(key);
  if (!b || b.reset < now) {
    b = { count: 0, reset: now + windowMs };
    BUCKETS.set(key, b);
  }
  b.count++;
  return b.count > limit;
};

const ipOf = req => (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';

const send = (res, code, body, headers = {}) => {
  const isStr = typeof body === 'string';
  const out = isStr ? body : JSON.stringify(body);
  res.writeHead(code, {
    'Content-Type': isStr ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers
  });
  res.end(out);
};

const readBody = (req, max = 1e6) => new Promise((resolve, reject) => {
  const chunks = [];
  let len = 0;
  req.on('data', c => {
    len += c.length;
    if (len > max) {
      reject(Object.assign(new Error('Body too large'), { code: 413 }));
      req.destroy();
    } else {
      chunks.push(c);
    }
  });
  req.on('end', () => resolve(Buffer.concat(chunks)));
  req.on('error', reject);
});

const readJSON = async (req, max) => {
  const b = await readBody(req, max);
  try {
    return JSON.parse(b.toString('utf8') || '{}');
  } catch {
    throw Object.assign(new Error('Invalid JSON'), { code: 400 });
  }
};

const sniff = b => {
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpg';
  if (b.length >= 6 && b.toString('ascii', 0, 6).startsWith('GIF8')) return 'gif';
  if (b.length >= 12 && b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
};

module.exports = {
  sha,
  makeSession,
  isAdmin,
  limited,
  ipOf,
  send,
  readBody,
  readJSON,
  sniff
};
