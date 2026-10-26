# Caventra Architecture & Codebase Navigation Guide

This document is the authoritative guide to the structure, architecture, and maintenance of the Caventra web application.

---

## 1. High-Level Architecture Overview

Caventra is a high-performance web platform designed for fast load times, robust SEO (Core Web Vitals), and zero framework bloat:
1. **Frontend (`frontend/`)**: Modular vanilla JavaScript with client-side hash routing, reactive DOM updates, GSAP micro-animations, and a responsive CSS design system (supporting Dark and Light themes).
2. **Backend (`backend/`)**: Node.js HTTP server backed by SQLite (WAL mode) with cookie sessions, rate limiting, inquiries management, image uploads, and CRM lead persistence.
3. **Database (`database/`)**: Better-SQLite3 persistence layer with schema definitions, WAL pragma, and transactional inquiries storage.
4. **Distribution & Deployment**:
   - **Static Host / Edge CDN (GitHub Pages)**: Serves static assets, pre-rendered routes, and client-side application directly from root on `caventraofficial.in`.
   - **Full-Stack Node.js Server (`server.js`)**: Serves API endpoints (`/api/*`), dynamic project management, and uploads from `data/uploads/`.
   - **Static Pre-Rendering (`scripts/build-static.js`)**: Generates 90 static HTML routes for search engine crawlers and CDN distribution.

---

## 2. Directory Structure

```
caventra-app/
├── frontend/                             # User interface, styles, and client components
│   ├── src/                              # Frontend modular source files
│   │   ├── config.js                     # Site defaults (D), SVG icon library, utilities
│   │   ├── router.js                     # Hash-based navigation & view mounting
│   │   ├── modules/
│   │   │   ├── services.js               # 5 dedicated service profiles (BUILD, MANAGE, SECURE, HOST)
│   │   │   ├── work.js                   # Portfolio projects, case studies, status badges
│   │   │   ├── founders.js               # Founder cards, visible contacts, and emails
│   │   │   ├── contact.js                # Inquiry form & automatic CRM lead recording
│   │   │   ├── blog.js                   # Blog listing, search, category chips & reader
│   │   │   ├── process.js                # 7-stage delivery process & buying FAQs
│   │   │   ├── estimator.js              # Interactive project cost estimator
│   │   │   └── admin.js                  # Protected CMS editor & inquiry manager
│   │   └── main.js                       # Application bootstrap & event listeners
│   ├── styles/                           # Modular CSS sheets
│   │   ├── 01-base-layout.css            # Design tokens, reset, grid, typography & navigation
│   │   ├── 02-layout-components.css      # Responsive layout & footer
│   │   ├── 03-blog-responsive.css        # Mobile blog card stack & fluid typography
│   │   ├── 04-theme-toggle.css           # Light and Dark theme palettes
│   │   ├── 05-ventrabot.css              # Ventrabot AI widget & chat UI
│   │   ├── 06-whatsapp-cta.css           # Direct WhatsApp floating button
│   │   ├── 07-project-submission.css     # Project submission modal & wizard
│   │   ├── 08-estimator.css              # Cost estimator interactive styles
│   │   ├── 09-services-work.css          # Services detail pages & portfolio grid
│   │   ├── 10-portal-dashboard.css       # Client portal & founder desk styling
│   │   └── 11-shader.css                 # Background shaders
│   └── README.md                         # Frontend guide
│
├── backend/                              # Production Node.js server, APIs & security
│   ├── src/
│   │   ├── config.js                     # Environment variables loader (.env / env.txt) & headers
│   │   ├── auth/
│   │   │   └── session.js                # Cryptographic sessions, timing-safe auth & rate limiting
│   │   └── routes/                       # Endpoint definitions
│   ├── server.js                         # Production server entry point
│   └── README.md                         # Backend guide
│
├── database/                             # Dedicated SQLite database layer
│   ├── connection.js                     # Better-SQLite3 connection, WAL pragma & migrations
│   ├── schema.sql                        # SQL definitions for kv and inquiries tables
│   ├── data/                             # SQLite database storage directory
│   └── README.md                         # Database guide
│
├── public/                               # Distribution output for Node.js server
├── assets/                               # Images, logos, SVG diagrams, founder photos
├── data/                                 # Runtime SQLite database (caventra.db) and uploads
├── docs/                                 # Architectural & content documentation
│   ├── ARCHITECTURE.md                   # This navigation guide
│   ├── CONTENT_PLAYBOOK.md               # Blog content & SEO playbook
│   └── legacy/                           # Archived specification documents
├── scripts/                              # Build tools
│   ├── build-bundle.js                   # Assembles frontend/ into distribution files
│   ├── build-static.js                   # Pre-renders 90 static routes
│   └── build-all.js                      # Compiles bundles, runs static build & tests
├── test/                                 # Comprehensive automated test suites (212+ tests)
├── app.js & styles.css                   # Distribution bundles for GitHub Pages live serving
└── server.js                             # Root server entry point
```

---

## 3. "Where Do I Find...?" Quick Reference

| To modify or inspect... | Look inside... |
| :--- | :--- |
| **Service profiles & offerings** | `frontend/src/modules/services.js` (`CAVENTRA_SERVICES_DATA`) |
| **Founder names, emails, phones** | `frontend/src/modules/founders.js` |
| **Portfolio projects & case studies** | `frontend/src/modules/work.js` & `assets/projects/` |
| **Blog articles & content** | `blogs.js` (66 markdown articles & metadata) |
| **Blog layout & mobile responsiveness** | `frontend/styles/03-blog-responsive.css` & `frontend/src/modules/blog.js` |
| **Contact inquiry & lead tracking** | `frontend/src/modules/contact.js` (`CaventraStore.recordPublicLead`) |
| **Cost Estimator rates & formulas** | `estimator-config.js` & `frontend/src/modules/estimator.js` |
| **Client Portal & Founder Dashboard** | `portal.js` & `firebase-config.js` |
| **Database schema & migrations** | `database/schema.sql` & `database/connection.js` |
| **Backend API endpoints** | `backend/src/` & `server.js` |
| **Automated tests** | `test/` (`npm run test:all`) |

---

## 4. Build & Development Commands

- `npm start`: Starts the local Node.js development server at `http://localhost:3000`.
- `npm run build:bundle`: Compiles `frontend/` source into distribution files (`app.js` and `styles.css`) in both root and `public/`.
- `npm run build:static`: Pre-renders all 90 static HTML routes with SEO metadata.
- `npm run build`: Bundles source files and re-generates static routes.
- `npm run build:all`: Compiles bundles, runs static build, and executes all 212+ automated tests.
- `npm test`: Runs end-to-end smoke tests against a temporary test server.
- `npm run test:all`: Runs all 7 test suites (smoke, master improvements, interactions, auth, submissions, estimator, founder & leads).
