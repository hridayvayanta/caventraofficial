# Caventra — full-stack web app

The Caventra website with a real backend: Node.js server, SQLite database, password-protected admin dashboard, image uploads and a contact-inquiry inbox. **No npm packages to install** (zero dependencies).

## What it does
- **Public site:** Home, Services, Work, project pages, About, Process, Technology, Contact (same design and logo as the preview).
- **Admin dashboard** at `/#/admin`: add, edit, delete, publish/unpublish, feature and reorder projects; upload cover and gallery images; edit About text, contact details, phone numbers, social links and technologies; read and delete contact inquiries.
- **Contact form:** saves every inquiry to the database (shown in the admin dashboard) and, if configured, emails you at caventraofficial@gmail.com.
- **No fake content:** the site starts with zero projects. Only what you add in admin is shown.

## Run it locally
Requires **Node.js 22.5 or newer** (uses the built-in SQLite).

```bash
cp .env.example .env        # then edit .env and set ADMIN_PASSWORD
npm start                   # http://localhost:3000
npm test                    # optional: runs the end-to-end API tests
```
Open `http://localhost:3000/#/admin` and sign in with your `ADMIN_PASSWORD`.

## Email notifications (optional)
1. Create a free account at https://resend.com and an API key.
2. Put `RESEND_API_KEY=...` in `.env`. Until you verify your own domain in Resend, set `NOTIFY_TO` to the email you signed up with (Resend's test sender only delivers to that address). After verifying a domain, set `MAIL_FROM=Caventra <hello@yourdomain.com>` and `NOTIFY_TO=caventraofficial@gmail.com`.
Inquiries are always saved in the dashboard even if email is not configured or fails.

## Deploy
Any host that runs Node 22.5+ and has a **persistent disk** works (Render, Railway, Fly.io, a VPS). Set these environment variables:

| Variable | Purpose |
|---|---|
| `ADMIN_PASSWORD` | required, 10+ characters |
| `NODE_ENV=production` | secure cookies + HSTS (use HTTPS) |
| `TRUST_PROXY=1` | when behind the host's proxy (correct rate limiting) |
| `DATA_DIR` | path of the persistent disk (database + uploaded images live here) |
| `SESSION_SECRET` | optional; random one is generated and stored in `DATA_DIR` |

Start command: `npm start`. A `Dockerfile` is included (`docker build -t caventra . && docker run -p 3000:3000 -e ADMIN_PASSWORD=... -v caventra-data:/data caventra`).

**Back up `DATA_DIR`** — it contains your projects, inquiries and uploads.

## Security notes
- Single admin, password checked in constant time; login limited to 5 attempts / 15 min per IP; contact form limited to 5 / hour per IP, plus a honeypot field.
- Session cookie is HttpOnly + SameSite=Strict; state-changing requests also need a custom header (CSRF protection).
- Uploads are verified by file signature (PNG/JPEG/GIF/WebP only, 6 MB max) and stored under random names.
- Saved content is validated and trimmed on the server; unsafe links (e.g. `javascript:`) are removed.
- Strict Content-Security-Policy (no inline scripts), plus standard security headers.

## Structure
```
server.js          HTTP server, API, SQLite, auth, uploads, email
public/            index.html, styles.css, app.js, assets/ (your logo files)
test/smoke.js      end-to-end API tests
data/              created at runtime (database + uploads) — not committed
```
