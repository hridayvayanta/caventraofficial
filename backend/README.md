# Caventra Backend Layer

The `backend/` directory contains the production Node.js HTTP server, REST APIs, authentication security, and email notification services.

---

## Architecture

```
backend/
├── src/
│   ├── config.js                 # Environment variables loader (.env / env.txt) & headers
│   ├── auth/
│   │   └── session.js            # Cryptographic sessions, timing-safe auth & rate limiting
│   └── routes/                   # Endpoint definitions
└── server.js                     # Server entry point (binds to 0.0.0.0:3000)
```

---

## API Endpoints

- `GET /healthz`: Health check endpoint.
- `GET /api/site`: Retrieves published portfolio projects & site details.
- `POST /api/contact`: Validates & stores client inquiries, honeypot spam protection, and sends email notification via Resend.
- `POST /api/auth/send-otp`: Dispatches 6-digit registration / sign-in verification OTPs.
- `POST /api/tickets/notify`: Dispatches corporate task assignment email notifications.
- `POST /api/admin/login`: Secure timing-safe administrative login with signed cookies.
- `GET /api/admin/inquiries`: Admin view of all captured project leads.
- `POST /api/admin/upload`: Image uploads with magic-byte validation (PNG, JPEG, WebP, GIF).

---

## Running Backend

```bash
npm start
# Server listens on http://localhost:3000
```
