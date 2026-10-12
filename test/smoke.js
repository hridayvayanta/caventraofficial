'use strict';
// End-to-end smoke test: starts the server on a temp data dir and exercises the API.
const { spawn } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-')), port = 4100 + Math.floor(Math.random() * 500), B = `http://localhost:${port}`;
const H = { 'Content-Type': 'application/json', 'X-Requested-With': 'caventra' };
const srv = spawn('node', ['--no-warnings', path.join(__dirname, '..', 'server.js')], { env: { ...process.env, PORT: port, DATA_DIR: dir, ADMIN_PASSWORD: 'test-password-123', NODE_ENV: 'development' }, stdio: 'inherit' });
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
(async () => {
  for (let i = 0; i < 40; i++) { try { if ((await fetch(B + '/healthz')).ok) break; } catch {} await new Promise(r => setTimeout(r, 150)); }
  let r = await fetch(B + '/'); ok(r.status === 200 && (await r.text()).includes('Caventra'), 'home page served');
  ok((await fetch(B + '/assets/logo.png')).status === 200, 'logo asset served');
  ok((await fetch(B + '/..%2f..%2fserver.js')).status !== 200, 'path traversal blocked');
  ok((await (await fetch(B + '/api/site')).json()).projects === undefined, 'empty site has no projects');
  r = await fetch(B + '/api/admin/site'); ok(r.status === 401 || r.status === 403, 'admin API locked when signed out');
  r = await fetch(B + '/api/admin/login', { method: 'POST', headers: H, body: JSON.stringify({ password: 'nope' }) }); ok(r.status === 401, 'wrong password rejected');
  r = await fetch(B + '/api/admin/login', { method: 'POST', headers: H, body: JSON.stringify({ password: 'test-password-123' }) }); ok(r.status === 200, 'login works');
  const cookie = r.headers.get('set-cookie').split(';')[0], A = { ...H, Cookie: cookie };
  ok((await (await fetch(B + '/api/admin/me', { headers: { Cookie: cookie } })).json()).admin === true, 'session recognised');
  r = await fetch(B + '/api/admin/site', { method: 'PUT', headers: { Cookie: cookie, 'Content-Type': 'application/json' }, body: '{}' }); ok(r.status === 403, 'state change without CSRF header blocked');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  r = await fetch(B + '/api/admin/upload?name=a.png', { method: 'POST', headers: { Cookie: cookie, 'X-Requested-With': 'caventra', 'Content-Type': 'image/png' }, body: png }); const up = await r.json(); ok(r.status === 200 && /^\/uploads\//.test(up.url), 'image upload');
  ok((await fetch(B + up.url)).status === 200, 'uploaded image served');
  r = await fetch(B + '/api/admin/upload', { method: 'POST', headers: { Cookie: cookie, 'X-Requested-With': 'caventra' }, body: Buffer.from('<script>alert(1)</script>') }); ok(r.status === 400, 'non-image upload rejected');
  r = await fetch(B + '/api/admin/site', { method: 'PUT', headers: A, body: JSON.stringify({ projects: [{ name: 'Alpha', published: true, cover: up.url, live: 'javascript:alert(1)' }, { name: 'Alpha', published: false }], contact: { email: 'a@b.co' } }) });
  const saved = await r.json(); ok(r.status === 200 && saved.site.projects[1].slug === 'alpha-2' && saved.site.projects[0].live === '', 'save site: unique slugs + unsafe URL stripped');
  const pub = await (await fetch(B + '/api/site')).json(); ok(pub.projects.length === 1 && pub.projects[0].name === 'Alpha', 'public API hides unpublished projects');
  r = await fetch(B + '/api/contact', { method: 'POST', headers: H, body: JSON.stringify({ name: 'T', email: 'bad', message: 'x' }) }); ok(r.status === 400, 'contact validation');
  r = await fetch(B + '/api/contact', { method: 'POST', headers: H, body: JSON.stringify({ name: 'Tester', email: 't@example.com', message: 'Hello', type: 'Web Development' }) }); ok(r.status === 200, 'contact submit');
  const inq = await (await fetch(B + '/api/admin/inquiries', { headers: { Cookie: cookie } })).json(); ok(inq.length === 1 && inq[0].name === 'Tester', 'inquiry stored and visible to admin');
  r = await fetch(B + '/api/admin/inquiries/' + inq[0].id, { method: 'DELETE', headers: A }); ok(r.status === 200, 'inquiry delete');
  ok((await fetch(B + '/', {})).headers.get('content-security-policy').includes("script-src 'self'"), 'CSP header present');
  srv.kill(); fs.rmSync(dir, { recursive: true, force: true }); console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED'); process.exit(fails ? 1 : 0);
})().catch(e => { console.error(e); srv.kill(); process.exit(1); });
