# Caventra Frontend Layer

The `frontend/` directory contains all user interface code, visual styles, interactive client components, and pre-rendering configurations for Caventra.

---

## Directory Organization

```
frontend/
├── src/                          # Modular JavaScript Source
│   ├── config.js                 # Site defaults, SVG icons & sanitize helpers
│   ├── router.js                 # Client-side hash routing & page titles
│   ├── modules/                  # Feature Modules
│   │   ├── services.js           # 5 dedicated service profiles (BUILD, MANAGE, SECURE, HOST)
│   │   ├── process.js            # 7-stage delivery process, trust standards, FAQs
│   │   ├── estimator.js          # Interactive website cost estimator logic
│   │   ├── views-core.js         # Core views (home, work, about, founders)
│   │   ├── blog.js               # Blog grid, category filters, search & reader
│   │   ├── views-support.js      # Contact, technology, legal & 404 views
│   │   └── admin.js              # Protected CMS editor & inquiry dashboard
│   └── main.js                   # Application bootstrap & event listeners
│
└── styles/                       # Modular CSS Sheets
    ├── 01-base-layout.css        # Variables, reset, grid, typography & navigation
    ├── 02-layout-components.css  # Responsive layout, legal styling & footer
    ├── 03-blog-responsive.css    # Mobile blog card stack & fluid typography
    ├── 04-theme-toggle.css       # Light and Dark theme palettes
    ├── 05-ventrabot.css          # Ventrabot AI widget & chat UI
    ├── 06-whatsapp-cta.css       # Direct WhatsApp floating button
    ├── 07-project-submission.css # Project submission modal & wizard
    ├── 08-estimator.css          # Cost estimator interactive styles
    ├── 09-services-work.css      # Services detail pages & portfolio grid
    ├── 10-portal-dashboard.css   # Client portal & founder desk styling
    └── 11-shader.css             # Background shaders
```

---

## Build Commands

- `npm run build:bundle`: Compiles `frontend/styles/` into `styles.css` and `frontend/src/` into `app.js`.
- `npm run build:static`: Pre-renders all 90 routes into static HTML.
- `npm run build`: Bundles assets and generates all static pages.
