# Caventra Architecture & Codebase Navigation Guide

This document is the single source of truth for the structure, architecture, and maintenance of the Caventra web application.

---

## 1. High-Level Architecture Overview

Caventra is a high-performance web platform designed for fast load times, robust SEO (Core Web Vitals), and zero framework bloat. It combines:
1. **Frontend**: Lightweight vanilla JavaScript with a client-side hash router, reactive DOM updates, GSAP micro-animations, and CSS design system (supporting both Dark and Light themes).
2. **Backend**: Node.js HTTP server backed by SQLite (WAL mode) with cookie sessions, rate limiting, inquiries management, image uploads, and CRM lead persistence.
3. **Deployment**:
   - **Static Host / Edge CDN (GitHub Pages)**: Serves static assets, pre-rendered routes, and client-side application directly from root on `caventraofficial.in`.
   - **Full-Stack Node.js Server (`server.js`)**: Serves API endpoints (`/api/*`), dynamic project management, and uploads from `data/uploads/`.
   - **Static Pre-Rendering (`scripts/build-static.js`)**: Generates 90 static HTML routes for search engine crawlers and CDN distribution.

---

## 2. Directory Structure

```
caventra-app/
├── src/                                  # Modular source files (edit here)
│   ├── client/                           # Frontend application source
│   │   ├── config.js                     # Site defaults (D), SVG icon library, utilities
│   │   ├── router.js                     # Hash-based navigation & view mounting
│   │   ├── modules/
│   │   │   ├── services.js               # 5 dedicated service profiles (web dev, branding, etc.)
│   │   │   ├── work.js                   # Portfolio projects, case studies, status badges
│   │   │   ├── founders.js               # Founder cards, visible contacts, and emails
│   │   │   ├── contact.js                # Inquiry form & automatic CRM lead recording
│   │   │   ├── blog.js                   # Blog listing, search, category chips & reader
│   │   │   ├── process.js                # 7-stage delivery process & buying FAQs
│   │   │   └── admin.js                  # Protected CMS editor & inquiry manager
│   │   └── main.js                       # Entry point, event listeners & initialization
│   ├── server/                           # Backend server architecture
│   │   ├── db/                           # SQLite WAL database & schema migrations
│   │   ├── auth/                         # Timing-safe password hashing & cookie sessions
│   │   └── routes/                       # Inquiries, upload, and static file endpoints
│   └── styles/                           # Modular CSS sheets
│       ├── 01-variables.css              # Design tokens, dark/light theme variables
│       ├── 02-reset-base.css             # CSS reset, box-sizing, and typography
│       ├── 03-components.css             # Navigation, buttons, badges, footer
│       ├── 04-services-work.css          # Services grid & case study styling
│       ├── 05-blog.css                   # Blog layout, reader, TOC, and mobile stack
│       ├── 06-portal-estimator.css       # Client portal & cost estimator styles
│       └── 07-responsive.css             # Unified mobile & tablet breakpoints
│
├── public/                               # Distribution output for Node.js server
├── assets/                               # Images, logos, SVG diagrams, founder photos
├── data/                                 # Runtime SQLite database (caventra.db) and uploads
├── docs/                                 # Architectural & content documentation
│   ├── ARCHITECTURE.md                   # This navigation guide
│   ├── CONTENT_PLAYBOOK.md               # Blog content & SEO playbook
│   └── legacy/                           # Archived specification documents
├── scripts/                              # Build tools
│   ├── build-bundle.js                   # Assembles src/ into distribution files
│   ├── build-static.js                   # Pre-renders 90 static routes
│   └── build-all.js                      # Compiles bundles, runs static build & tests
├── test/                                 # Comprehensive automated test suites (212+ tests)
├── app.js & styles.css                   # Distribution bundles for GitHub Pages
└── server.js                             # Backend server entry point
```

---

## 3. "Where Do I Find...?" Quick Reference

| To modify or inspect... | Look inside... |
| :--- | :--- |
| **Service profiles & offerings** | `src/client/modules/services.js` (`CAVENTRA_SERVICES_DATA`) |
| **Founder names, emails, phones** | `src/client/modules/founders.js` |
| **Portfolio projects & case studies** | `src/client/modules/work.js` & `assets/projects/` |
| **Blog articles & content** | `blogs.js` (66 markdown articles & metadata) |
| **Blog layout & mobile responsiveness** | `src/styles/05-blog.css` & `src/client/modules/blog.js` |
| **Contact inquiry & lead tracking** | `src/client/modules/contact.js` (`CaventraStore.recordPublicLead`) |
| **Cost Estimator rates & formulas** | `estimator-config.js` |
| **Client Portal & Founder Dashboard** | `portal.js` & `firebase-config.js` |
| **Database schema & migrations** | `src/server/db/` or `server.js` |
| **Backend API endpoints** | `src/server/routes/` or `server.js` |
| **Automated tests** | `test/` (`npm run test:all`) |

---

## 4. Build & Development Commands

- `npm start`: Starts the local Node.js development server at `http://localhost:3000`.
- `npm run build:bundle`: Compiles `src/` modules into distribution files (`app.js` and `styles.css`) in both root and `public/`.
- `npm run build:static`: Pre-renders all 90 static HTML routes with SEO metadata.
- `npm run build`: Bundles source files and re-generates static routes.
- `npm test`: Runs end-to-end smoke tests against a temporary test server.
- `npm run test:all`: Runs all 7 test suites (smoke, master improvements, interactions, auth, submissions, estimator, founder & leads).
