'use strict';
// Caventra — Node.js server with better-sqlite3 (Node 18+)
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const Database = require('better-sqlite3');

// ---------- config ----------
try { // tiny .env loader (supports .env or visible env.txt)
  const envFile = [path.join(__dirname, '.env'), path.join(__dirname, 'env.txt')].find(f => fs.existsSync(f));
  if (envFile) {
    for (const l of fs.readFileSync(envFile, 'utf8').split('\n')) {
      const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch {}
const E = process.env;
const PORT = +E.PORT || 3000;
const DATA = path.resolve(E.DATA_DIR || path.join(__dirname, 'data'));
const PUB = path.join(__dirname, 'public'), UP = path.join(DATA, 'uploads');
const PROD = E.NODE_ENV === 'production';
const NOTIFY_TO = E.NOTIFY_TO || 'caventraofficial@gmail.com';
if ((!E.ADMIN_PASSWORD || E.ADMIN_PASSWORD.length < 10) && !E.ADMIN_PASSWORD_HASH) { console.error('Set ADMIN_PASSWORD (at least 10 characters) or ADMIN_PASSWORD_HASH in .env or the environment.'); process.exit(1); }
fs.mkdirSync(UP, { recursive: true });
let SECRET = E.SESSION_SECRET;
if (!SECRET) { const f = path.join(DATA, '.secret'); try { SECRET = fs.readFileSync(f, 'utf8'); } catch { SECRET = crypto.randomBytes(32).toString('hex'); fs.writeFileSync(f, SECRET, { mode: 0o600 }); } }

// ---------- database ----------
const db = new Database(path.join(DATA, 'caventra.db'));
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS kv(key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS inquiries(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, company TEXT, type TEXT, budget TEXT, timeline TEXT, message TEXT, ip TEXT, created_at INTEGER NOT NULL);`);
const getSite = () => { const r = db.prepare('SELECT value FROM kv WHERE key=?').get('site'); return r ? JSON.parse(r.value) : {}; };
const setSite = o => db.prepare('INSERT INTO kv(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at').run('site', JSON.stringify(o), Date.now());

// ---------- helpers ----------
const sha = s => crypto.createHash('sha256').update(s).digest();
const b64 = b => Buffer.from(b).toString('base64url');
const sign = p => crypto.createHmac('sha256', SECRET).update(p).digest('base64url');
const makeSession = () => { const p = b64(JSON.stringify({ a: 1, exp: Date.now() + 7 * 864e5 })); return p + '.' + sign(p); };
function isAdmin(req) {
  const m = (req.headers.cookie || '').match(/(?:^|;\s*)cv_sess=([^;]+)/); if (!m) return false;
  const [p, s] = m[1].split('.'); if (!p || !s) return false;
  const good = sign(p); if (s.length !== good.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(good))) return false;
  try { return JSON.parse(Buffer.from(p, 'base64url')).exp > Date.now(); } catch { return false; }
}
const hits = new Map();
function limited(key, max, ms) { const n = Date.now(), a = (hits.get(key) || []).filter(t => n - t < ms); a.push(n); hits.set(key, a); return a.length > max; }
setInterval(() => { const n = Date.now(); for (const [k, a] of hits) if (!a.some(t => n - t < 36e5)) hits.delete(k); }, 6e5).unref();
const ipOf = req => (E.TRUST_PROXY === '1' && (req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress || '?';
function send(res, code, body, extra = {}) {
  const isJ = typeof body !== 'string' && !Buffer.isBuffer(body);
  res.writeHead(code, { 'Content-Type': isJ ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8', ...extra });
  res.end(isJ ? JSON.stringify(body) : body);
}
const SEC = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://*.googleusercontent.com; connect-src 'self' https://script.google.com https://script.googleusercontent.com https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.firebaseapp.com; frame-src 'self' https://*.firebaseapp.com https://accounts.google.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'",
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', ...(PROD ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' } : {})
};
function readBody(req, limit) {
  return new Promise((ok, no) => {
    const c = []; let n = 0;
    req.on('data', d => { n += d.length; if (n > limit) { no(Object.assign(new Error('Payload too large'), { code: 413 })); req.destroy(); } else c.push(d); });
    req.on('end', () => ok(Buffer.concat(c))); req.on('error', no);
  });
}
const readJSON = async (req, limit = 1.5e6) => { try { return JSON.parse((await readBody(req, limit)).toString() || '{}'); } catch (e) { if (e.code === 413) throw e; throw Object.assign(new Error('Invalid JSON'), { code: 400 }); } };

// ---------- validation ----------
const str = (v, n = 2000) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, n).trim() : '');
const pairs = a => (Array.isArray(a) ? a.slice(0, 50).map(x => (Array.isArray(x) ? [str(x[0], 200), str(x[1], 2000)] : null)).filter(x => x && x[0]) : []);
const url = v => { v = str(v, 500); return /^https?:\/\/[^\s]+$/i.test(v) ? v : ''; };
const upl = v => { v = str(v, 300); return (/^\/uploads\/[a-f0-9]{32}\.(png|jpe?g|webp|gif)$/.test(v) || /^\/assets\/projects\/[a-z0-9\-_\.]+\.(svg|png|jpe?g|webp)$/.test(v) || /^data:image\/[a-z0-9+]+;base64,[a-zA-Z0-9+/=]+$/.test(v)) ? v : ''; };
const slugify = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'project';
function cleanSite(b) {
  const a = b.about || {}, c = b.contact || {}, used = new Set();
  const projects = (Array.isArray(b.projects) ? b.projects : []).slice(0, 100).map(p => {
    if (!p || typeof p !== 'object') return null;
    const name = str(p.name, 120); if (!name) return null;
    let s = slugify(name), n = 2; const base = s; while (used.has(s)) s = base + '-' + n++; used.add(s);
    return { name, slug: s, category: str(p.category, 120), short: str(p.short, 400), tech: str(p.tech, 400), client: str(p.client, 200), overview: str(p.overview, 6000), challenge: str(p.challenge, 6000), solution: str(p.solution, 6000), features: str(p.features, 4000), results: str(p.results, 4000), live: url(p.live), github: url(p.github), case: url(p.case), cover: upl(p.cover), gallery: (Array.isArray(p.gallery) ? p.gallery : []).slice(0, 20).map(upl).filter(Boolean), published: !!p.published, featured: !!p.featured };
  }).filter(Boolean);
  return {
    services: pairs(b.services), process: pairs(b.process), techs: pairs(b.techs), socials: pairs(b.socials).filter(x => url(x[1])).map(x => [x[0], url(x[1])]),
    about: { who: str(a.who, 3000), believe: str(a.believe, 3000), approach: str(a.approach, 3000), philosophy: str(a.philosophy, 3000), different: str(a.different, 3000) },
    desc: str(b.desc, 500), contact: { email: str(c.email, 200), phone: str(c.phone, 200), address: str(c.address, 300) }, projects
  };
}
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.json': 'application/json', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const sniff = b => (b.length > 12 && ((b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && 'png') || (b[0] === 0xff && b[1] === 0xd8 && 'jpg') || (b.slice(0, 3).toString() === 'GIF' && 'gif') || (b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP' && 'webp'))) || null;

async function notify(q) {
  if (!E.RESEND_API_KEY) return;
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + E.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: E.MAIL_FROM || 'CAVENTRA <security@caventraofficial.in>', to: [NOTIFY_TO], reply_to: q.email, subject: 'New project inquiry from ' + q.name,
        text: `Name: ${q.name}\nEmail: ${q.email}\nCompany: ${q.company}\nProject type: ${q.type}\nBudget: ${q.budget}\nTimeline: ${q.timeline}\n\n${q.message}` }) });
    if (!r.ok) console.error('Email notification failed:', r.status, await r.text());
  } catch (e) { console.error('Email notification error:', e.message); }
}

async function sendAuthEmail(toEmail, otpCode, type) {
  let subject = 'CAVENTRA — Verify Your Client Account';
  let heading = 'Here is your 6-digit registration verification code:';
  if (type === 'LOGIN_OTP' || type === 'LOGIN_2FA') {
    subject = 'CAVENTRA — Sign-In Verification Code';
    heading = 'Here is your 6-digit sign-in verification code:';
  } else if (type === 'EMAIL_VERIFICATION') {
    subject = 'CAVENTRA — Email Verification Code';
    heading = 'Here is your 6-digit email verification code:';
  }
  const text = `Hello,\n\nYour CAVENTRA security verification code is: ${otpCode}\n\nThis 6-digit code is valid for 5 minutes. If you did not request this verification, please contact security@caventraofficial.in immediately.\n\nBest regards,\nCAVENTRA Digital Solutions\nAhmedabad, Gujarat, India\nhttps://caventraofficial.in`;

  console.log(`\n======================================================`);
  console.log(`[CAVENTRA REAL EMAIL DISPATCH]`);
  console.log(`To:        ${toEmail}`);
  console.log(`Subject:   ${subject}`);
  console.log(`OTP Code:  ${otpCode}`);
  console.log(`Type:      ${type || 'AUTH'}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  if (E.RESEND_API_KEY) {
    try {
      const html = `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:28px;background:#0d1117;color:#f0f6fc;border-radius:12px;border:1px solid #30363d;"><h2 style="color:#58a6ff;margin-top:0;font-size:20px;">CAVENTRA Security</h2><p style="font-size:15px;line-height:1.5;">${heading}</p><div style="font-size:32px;font-weight:bold;letter-spacing:8px;padding:18px;background:#161b22;border-radius:8px;text-align:center;color:#3fb950;margin:24px 0;border:1px solid #30363d;">${otpCode}</div><p style="color:#8b949e;font-size:13px;line-height:1.4;">This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p><hr style="border:none;border-top:1px solid #30363d;margin:24px 0;"/><p style="color:#8b949e;font-size:11px;margin:0;">CAVENTRA Digital Solutions &bull; Ahmedabad, Gujarat, India &bull; <a href="https://caventraofficial.in" style="color:#58a6ff;text-decoration:none;">caventraofficial.in</a></p></div>`;
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + E.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: E.MAIL_FROM || 'CAVENTRA Security <security@caventraofficial.in>',
          to: [toEmail],
          subject: subject,
          text: text,
          html: html
        })
      });
      if (!r.ok) {
        const errText = await r.text();
        console.error('Email dispatch notice from Resend:', r.status, errText);
        if (r.status === 403 && errText.includes('You can only send testing emails to your own email address')) {
          console.log(`[Resend Sandbox Mode]: Free unverified accounts only deliver external emails to the registered address (${NOTIFY_TO}).`);
          console.log(`To deliver to ${toEmail}, verify your domain at https://resend.com/domains.`);
          console.log(`-> Local Dev OTP Code for ${toEmail}: [ ${otpCode} ]`);
        }
      } else {
        console.log(`✓ Real email dispatched to ${toEmail} via Resend`);
      }
    } catch (e) {
      console.error('Email dispatch error:', e.message);
    }
  }
}

// ---------- routes ----------
async function api(req, res, u) {
  const p = u.pathname, m = req.method, ip = ipOf(req);
  if (limited('api_' + ip, 60, 6e4)) return send(res, 429, { error: 'Too many API requests. Please slow down.' });
  if (m !== 'GET' && req.headers['x-requested-with'] !== 'caventra') return send(res, 403, { error: 'Forbidden' });
  if (p === '/api/auth/send-otp' && m === 'POST') {
    const b = await readJSON(req, 2e3);
    const email = str(b.email, 200);
    const code = str(b.code, 10);
    const type = str(b.type, 50);
    if (!email || !code) return send(res, 400, { error: 'Email and code required.' });
    await sendAuthEmail(email, code, type);
    return send(res, 200, { ok: true, message: 'Dispatched to ' + email });
  }
  if (p === '/api/site' && m === 'GET') { const s = getSite(); if (s.projects) s.projects = s.projects.filter(x => x.published); return send(res, 200, s, { 'Cache-Control': 'no-store' }); }
  if (p === '/api/contact' && m === 'POST') {
    if (limited('c' + ip, 5, 36e5)) return send(res, 429, { error: 'Too many messages. Please try again later.' });
    const b = await readJSON(req, 2e4); if (b.website) return send(res, 200, { ok: true }); // honeypot
    const q = { name: str(b.name, 120), email: str(b.email, 200), company: str(b.company, 200), type: str(b.type, 100), budget: str(b.budget, 100), timeline: str(b.timeline, 100), message: str(b.message, 5000) };
    if (!q.name || !q.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q.email)) return send(res, 400, { error: 'Please fill in name, a valid email and a message.' });
    const ipHash = crypto.createHash('sha256').update(ip + (SECRET || 'caventra')).digest('hex').slice(0, 16);
    db.prepare('INSERT INTO inquiries(name,email,company,type,budget,timeline,message,ip,created_at) VALUES(?,?,?,?,?,?,?,?,?)').run(q.name, q.email, q.company, q.type, q.budget, q.timeline, q.message, ipHash, Date.now());
    notify(q); return send(res, 200, { ok: true });
  }
  if (p === '/api/admin/me' && m === 'GET') return send(res, 200, { admin: isAdmin(req) }, { 'Cache-Control': 'no-store' });
  if (p === '/api/admin/login' && m === 'POST') {
    if (limited('l' + ip, 5, 9e5)) return send(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' });
    const b = await readJSON(req, 2e3);
    const target = E.ADMIN_PASSWORD_HASH ? Buffer.from(E.ADMIN_PASSWORD_HASH, 'hex') : sha(E.ADMIN_PASSWORD || '');
    const given = typeof b.password === 'string' ? sha(b.password) : null;
    if (!given || given.length !== target.length || !crypto.timingSafeEqual(given, target)) return send(res, 401, { error: 'Wrong password.' });
    return send(res, 200, { ok: true }, { 'Set-Cookie': `cv_sess=${makeSession()}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${PROD ? '; Secure' : ''}` });
  }
  if (p === '/api/admin/logout' && m === 'POST') return send(res, 200, { ok: true }, { 'Set-Cookie': 'cv_sess=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
  if (p.startsWith('/api/admin/')) {
    if (!isAdmin(req)) return send(res, 401, { error: 'Not signed in.' });
    if (p === '/api/admin/site' && m === 'GET') return send(res, 200, getSite(), { 'Cache-Control': 'no-store' });
    if (p === '/api/admin/site' && m === 'PUT') { const s = cleanSite(await readJSON(req)); setSite(s); return send(res, 200, { ok: true, site: s }); }
    if (p === '/api/admin/inquiries' && m === 'GET') return send(res, 200, db.prepare('SELECT * FROM inquiries ORDER BY id DESC LIMIT 500').all());
    const d = p.match(/^\/api\/admin\/inquiries\/(\d+)$/); if (d && m === 'DELETE') { db.prepare('DELETE FROM inquiries WHERE id=?').run(+d[1]); return send(res, 200, { ok: true }); }
    if (p === '/api/admin/upload' && m === 'POST') {
      const body = await readBody(req, 6e6), kind = sniff(body);
      if (!kind) return send(res, 400, { error: 'Only PNG, JPEG, GIF or WebP images are allowed.' });
      const name = crypto.randomBytes(16).toString('hex') + '.' + kind; fs.writeFileSync(path.join(UP, name), body);
      return send(res, 200, { url: '/uploads/' + name });
    }
  }
  return send(res, 404, { error: 'Not found' });
}
function serveStatic(req, res, u) {
  let file;
  if (u.pathname.startsWith('/uploads/')) {
    const n = u.pathname.slice(9);
    if (!/^[a-f0-9]{32}\.(png|jpe?g|webp|gif)$/.test(n)) return send(res, 404, 'Not found');
    file = path.join(UP, n);
  } else {
    let rel = path.normalize(decodeURIComponent(u.pathname === '/' ? '/index.html' : u.pathname));
    file = path.join(PUB, rel);
    try {
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      else if (!path.extname(file) && fs.existsSync(file + '.html')) file = file + '.html';
      else if (!path.extname(file) && fs.existsSync(path.join(file, 'index.html'))) file = path.join(file, 'index.html');
    } catch {}
    if (!file.startsWith(PUB + path.sep) || path.basename(file).startsWith('.')) return send(res, 403, 'Forbidden');
  }
  fs.readFile(file, (e, buf) => {
    if (e) {
      return fs.readFile(path.join(PUB, '404.html'), (e2, b404) => {
        if (!e2 && b404) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
          return res.end(req.method === 'HEAD' ? undefined : b404);
        }
        send(res, 404, 'Not found');
      });
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : (u.pathname.startsWith('/uploads/') ? 'public, max-age=31536000, immutable' : 'no-cache') });
    res.end(req.method === 'HEAD' ? undefined : buf);
  });
}
const server = http.createServer(async (req, res) => {
  for (const [k, v] of Object.entries(SEC)) res.setHeader(k, v);
  try {
    const ip = ipOf(req);
    if (limited('g_' + ip, 240, 6e4)) return send(res, 429, 'Too many requests. Please slow down.');
    const u = new URL(req.url, 'http://x');
    if (u.pathname === '/healthz') return send(res, 200, { ok: true });
    if (u.pathname.startsWith('/api/')) return await api(req, res, u);
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
    serveStatic(req, res, u);
  } catch (e) {
    if (e.code === 413 || e.code === 400) return send(res, e.code, { error: e.message });
    console.error(e); send(res, 500, { error: 'Server error' });
  }
});
server.listen(PORT, () => console.log(`Caventra running on http://localhost:${PORT}`));
module.exports = server;
