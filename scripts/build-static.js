#!/usr/bin/env node
'use strict';

/**
 * CAVENTRA Static Page Generator & Sitemap Builder
 * Pre-renders all 35 application routes as static HTML with clean URLs,
 * unique SEO metadata, and JSON-LD schema for search engine crawlers and GitHub Pages.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://caventraofficial.in';

console.log('====================================================');
console.log('  CAVENTRA: Building Pre-Rendered Static Pages');
console.log('====================================================\n');

// 1. Initialize DOM Simulation Sandbox to run app.js
const dummyEl = () => ({
  style: { setProperty: () => {} },
  classList: { add: () => {}, remove: () => {}, toggle: () => false, contains: () => false },
  setAttribute: () => {},
  getAttribute: () => null,
  addEventListener: () => {},
  querySelector: () => dummyEl(),
  querySelectorAll: () => [],
  contains: () => false,
  innerHTML: '',
  textContent: '',
  src: '',
  getContext: () => ({ clearRect: () => {}, fillRect: () => {} })
});

const sandbox = {
  window: { BLOGS: [] },
  document: {
    documentElement: { getAttribute: () => 'dark' },
    body: dummyEl(),
    querySelector: (s) => s === '#cv' ? null : dummyEl(),
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  location: { hash: '', pathname: '/' },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  scrollY: 0,
  innerWidth: 1200,
  innerHeight: 800,
  scrollTo: () => {},
  addEventListener: () => {},
  setTimeout: () => {},
  clearTimeout: () => {},
  requestAnimationFrame: () => {},
  cancelAnimationFrame: () => {},
  onresize: null,
  matchMedia: () => ({ matches: false }),
  IntersectionObserver: class { observe(){} unobserve(){} },
  fetch: () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }),
  console,
  Math,
  Date
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;
sandbox.window.addEventListener = sandbox.addEventListener;
sandbox.window.localStorage = sandbox.localStorage;
sandbox.window.scrollTo = sandbox.scrollTo;
sandbox.window.scrollY = 0;
vm.createContext(sandbox);

// 2. Load configurations and application
vm.runInContext(fs.readFileSync(path.join(ROOT, 'estimator-config.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'blogs.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'), sandbox);
vm.runInContext('this.V = V; this.D = D; this.S = S; this.CAVENTRA_SERVICES_DATA = CAVENTRA_SERVICES_DATA; this.getB = getB;', sandbox);

const templateHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const baseTemplate = templateHtml.replace(/<main id="app">[\s\S]*?<\/main>/, '<main id="app"></main>');

// Helper to escape HTML attributes
const escAttr = (s) => String(s || '').replace(/"/g, '&quot;');

// 3. Assemble all routes to pre-render
const routes = [];

// Homepage
routes.push({
  slug: '',
  urlPath: '',
  title: 'Caventra — Digital Solutions & Web Engineering Studio | Ideas to Impact',
  description: 'Caventra is an engineering-focused digital solutions studio. We build, host, secure, and manage custom websites, web applications, and digital products for modern businesses.',
  activeNav: '',
  changefreq: 'weekly',
  priority: '1.0',
  render: () => sandbox.V.home()
});

// Services Hub
routes.push({
  slug: 'services',
  urlPath: 'services',
  title: 'Website Design, Hosting & Security Services | Caventra',
  description: 'Explore Caventra\'s core engineering services: custom web development, brand identity, ongoing website maintenance, high-speed cloud hosting, and enterprise-grade security.',
  activeNav: 'services',
  changefreq: 'weekly',
  priority: '0.9',
  render: () => sandbox.V.services()
});

// 5 Dedicated Service Pages
const serviceMeta = {
  'web-development': {
    title: 'Custom Web Development & Engineering | Caventra',
    description: 'Bespoke full-stack web engineering with zero page-builders, sub-second performance, clean architectural design, and 100% client code ownership.',
    priority: '0.9'
  },
  'branding': {
    title: 'Brand Identity & Digital Design | Caventra',
    description: 'Strategic visual identity, design systems, and user experience engineering for modern, ambitious brands.',
    priority: '0.85'
  },
  'maintenance': {
    title: 'Website Management & Maintenance Plans | Caventra',
    description: 'Dedicated ongoing website management, uptime monitoring, security patching, Core Web Vitals optimization, and continuous technical care.',
    priority: '0.85'
  },
  'hosting': {
    title: 'High-Performance Cloud Hosting & Infrastructure | Caventra',
    description: 'Ultra-low latency global CDN hosting, automated SSL, isolated database environments, and 99.9% uptime reliability.',
    priority: '0.85'
  },
  'security': {
    title: 'Website Security, Hardening & Protection | Caventra',
    description: 'Comprehensive website security audits, DDoS mitigation, vulnerability patching, CSP hardening, and automated intrusion monitoring.',
    priority: '0.85'
  }
};

for (const [slug, meta] of Object.entries(serviceMeta)) {
  routes.push({
    slug: `services/${slug}`,
    urlPath: `services/${slug}`,
    title: meta.title,
    description: meta.description,
    activeNav: 'services',
    changefreq: 'weekly',
    priority: meta.priority,
    render: () => sandbox.V.serviceDetail(slug),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': meta.title.split(' | ')[0],
      'serviceType': meta.title.split(' | ')[0],
      'provider': {
        '@type': 'Organization',
        'name': 'Caventra',
        'url': BASE_URL
      },
      'description': meta.description,
      'areaServed': 'Worldwide'
    }
  });
}

// Work / Portfolio Hub
routes.push({
  slug: 'work',
  urlPath: 'work',
  title: 'Selected Work & Case Studies | Caventra',
  description: 'Explore real production projects, client software, ERP implementations, and technical case studies engineered by Caventra.',
  activeNav: 'work',
  changefreq: 'weekly',
  priority: '0.85',
  render: () => sandbox.V.work()
});

// 7 Project Case Study Pages
const projects = sandbox.S.projects || [];
for (const p of projects) {
  routes.push({
    slug: `work/${p.slug}`,
    urlPath: `work/${p.slug}`,
    title: `${p.name} — Technical Case Study | Caventra`,
    description: p.short || `Comprehensive engineering case study for ${p.name} built by Caventra.`,
    activeNav: 'work',
    changefreq: 'monthly',
    priority: '0.8',
    render: () => sandbox.V.project(p.slug)
  });
}

// Interactive Cost Estimator
routes.push({
  slug: 'estimator',
  urlPath: 'estimator',
  title: 'Interactive Website Project Cost Estimator | Caventra',
  description: 'Configure your website type, page count, and technical features to receive a transparent, indicative project cost estimate in INR or USD.',
  activeNav: 'estimator',
  changefreq: 'weekly',
  priority: '0.85',
  render: () => sandbox.V.estimator()
});

// About Page
routes.push({
  slug: 'about',
  urlPath: 'about',
  title: 'About Caventra — Founders & Engineering Philosophy',
  description: 'Meet the founding engineers behind Caventra. We combine architectural rigor, direct engineer collaboration, and clean code principles to solve real business challenges.',
  activeNav: 'about',
  changefreq: 'monthly',
  priority: '0.8',
  render: () => sandbox.V.about()
});

// Process Page
routes.push({
  slug: 'process',
  urlPath: 'process',
  title: 'Our 7-Stage Engineering Methodology | Caventra',
  description: 'From discovery and architectural planning to full-stack engineering, testing, and continuous post-launch support — how Caventra builds digital products.',
  activeNav: 'process',
  changefreq: 'monthly',
  priority: '0.8',
  render: () => sandbox.V.process()
});

// Contact Page
routes.push({
  slug: 'contact',
  urlPath: 'contact',
  title: 'Start a Project | Caventra',
  description: 'Reach out to discuss your website or digital software requirements with our founding engineers. Upfront transparent quotes and direct collaboration.',
  activeNav: 'contact',
  changefreq: 'weekly',
  priority: '0.9',
  render: () => sandbox.V.contact()
});

// Blog / Insights Hub
routes.push({
  slug: 'blog',
  urlPath: 'blog',
  title: 'Knowledge & Engineering Insights | Caventra',
  description: 'Actionable articles on website pricing in India, hosting and maintenance plans, security hardening, Core Web Vitals, and bespoke web engineering.',
  activeNav: 'blog',
  changefreq: 'weekly',
  priority: '0.85',
  render: () => sandbox.V.blog()
});

// 12 Curated Blog Articles
const blogArticles = sandbox.getB ? sandbox.getB() : [];
for (const b of blogArticles) {
  routes.push({
    slug: `blog/${b.slug}`,
    urlPath: `blog/${b.slug}`,
    title: `${b.title} | Caventra`,
    description: b.summary,
    activeNav: 'blog',
    changefreq: 'monthly',
    priority: '0.8',
    render: () => sandbox.V.article(b.slug),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': b.title,
      'description': b.summary,
      'author': {
        '@type': 'Person',
        'name': b.author
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Caventra',
        'logo': {
          '@type': 'ImageObject',
          'url': `${BASE_URL}/assets/logo-nav.png`
        }
      },
      'mainEntityOfPage': `${BASE_URL}/blog/${b.slug}/`,
      'datePublished': '2026-10-01'
    }
  });
}

// Legal Pages
routes.push({
  slug: 'privacy',
  urlPath: 'privacy',
  title: 'Privacy Policy | Caventra',
  description: 'Caventra privacy policy: zero tracking SDKs, data minimization, and strict client data security standards.',
  activeNav: '',
  changefreq: 'monthly',
  priority: '0.3',
  render: () => sandbox.V.privacy()
});

routes.push({
  slug: 'terms',
  urlPath: 'terms',
  title: 'Terms of Service | Caventra',
  description: 'Caventra terms of service governing access to digital software engineering and website studio services.',
  activeNav: '',
  changefreq: 'monthly',
  priority: '0.3',
  render: () => sandbox.V.terms()
});

routes.push({
  slug: 'cookies',
  urlPath: 'cookies',
  title: 'Cookie Policy | Caventra',
  description: 'Caventra cookie policy: essential security cookies only. Zero advertising or third-party behavioral cookies.',
  activeNav: '',
  changefreq: 'monthly',
  priority: '0.3',
  render: () => sandbox.V.cookies()
});

console.log(`Prepared ${routes.length} routes for pre-rendering.\n`);

// Clean up any stale blog directories
const activeBlogSlugs = new Set(blogArticles.map(b => b.slug));
for (const base of [path.join(ROOT, 'blog'), path.join(ROOT, 'public', 'blog')]) {
  if (fs.existsSync(base)) {
    for (const item of fs.readdirSync(base)) {
      const full = path.join(base, item);
      if (fs.statSync(full).isDirectory() && !activeBlogSlugs.has(item)) {
        fs.rmSync(full, { recursive: true, force: true });
        console.log(`- Removed obsolete blog folder: ${item}`);
      }
    }
  }
}

// 4. Render each route and write out files
let generatedCount = 0;

for (const r of routes) {
  const canonicalUrl = `${BASE_URL}/${r.urlPath ? r.urlPath + '/' : ''}`;
  let html = baseTemplate;

  // Title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escAttr(r.title)}</title>`);

  // Description
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escAttr(r.description)}">`);

  // Canonical Link
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${canonicalUrl}">`);

  // OpenGraph Tags
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escAttr(r.title)}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escAttr(r.description)}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonicalUrl}">`);

  // Twitter Tags
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escAttr(r.title)}">`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escAttr(r.description)}">`);

  // Nav Active States
  if (r.activeNav) {
    html = html.replace(new RegExp(`(<a [^>]*href="#/${r.activeNav}"[^>]*)`), '$1 class="on"');
  }

  // Optional JSON-LD injection
  if (r.jsonLd) {
    const jsonStr = JSON.stringify(r.jsonLd, null, 2);
    html = html.replace('</head>', `<script type="application/ld+json">\n${jsonStr}\n</script>\n</head>`);
  }

  // Pre-rendered body content into <main id="app">
  const bodyContent = r.render();
  html = html.replace('<main id="app"></main>', `<main id="app">${bodyContent}</main>`);

  // Output paths
  if (r.urlPath === '') {
    // Root index.html
    fs.writeFileSync(path.join(ROOT, 'index.html'), html);
    fs.writeFileSync(path.join(ROOT, 'public', 'index.html'), html);
  } else {
    const outDirRoot = path.join(ROOT, r.urlPath);
    const outDirPub = path.join(ROOT, 'public', r.urlPath);
    fs.mkdirSync(outDirRoot, { recursive: true });
    fs.mkdirSync(outDirPub, { recursive: true });
    fs.writeFileSync(path.join(outDirRoot, 'index.html'), html);
    fs.writeFileSync(path.join(outDirPub, 'index.html'), html);
  }

  generatedCount++;
  console.log(`✓ [${generatedCount}/${routes.length}] Pre-rendered: /${r.urlPath ? r.urlPath + '/' : ''}`);
}

// 5. Generate canonical clean sitemap.xml
console.log('\nGenerating canonical sitemap.xml...');

const sitemapEntries = routes.map(r => {
  const loc = `${BASE_URL}/${r.urlPath ? r.urlPath + '/' : ''}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>2026-10-15</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`;
}).join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml);
fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), sitemapXml);
console.log(`✓ Saved sitemap.xml with ${routes.length} canonical URLs.`);

console.log('\n====================================================');
console.log(`  Static Build Completed: ${generatedCount} pages generated.`);
console.log('====================================================\n');
