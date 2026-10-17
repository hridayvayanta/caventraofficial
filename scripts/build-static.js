#!/usr/bin/env node
'use strict';

/**
 * CAVENTRA Static Page Generator & Sitemap Builder
 * Pre-renders all 57 application routes as static HTML with clean URLs,
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
  setInterval: () => {},
  clearInterval: () => {},
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
vm.runInContext(fs.readFileSync(path.join(ROOT, 'firebase-config.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'portal.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'), sandbox);
vm.runInContext('this.V = V; this.D = D; this.S = S; this.CAVENTRA_SERVICES_DATA = CAVENTRA_SERVICES_DATA; this.getB = getB; this.CaventraPortal = this.window ? this.window.CaventraPortal : null;', sandbox);

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
  title: 'Custom Websites & Web Applications for SMBs | Caventra',
  description: 'Custom web design, full-stack engineering, cloud hosting, and security for modern businesses. Bespoke code with zero page-builders and 100% IP ownership.',
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
  render: () => sandbox.V.services(),
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Services', 'item': `${BASE_URL}/services/` }
        ]
      }
    ]
  }
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
  const srvData = sandbox.CAVENTRA_SERVICES_DATA ? sandbox.CAVENTRA_SERVICES_DATA[slug] : null;
  const srvGraph = [
    {
      '@type': 'Service',
      '@id': `${BASE_URL}/services/${slug}/#service`,
      'name': meta.title.split(' | ')[0],
      'serviceType': meta.title.split(' | ')[0],
      'provider': {
        '@type': 'Organization',
        'name': 'Caventra',
        'url': `${BASE_URL}/`
      },
      'description': meta.description,
      'areaServed': ['IN', 'US', 'Worldwide']
    },
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Services', 'item': `${BASE_URL}/services/` },
        { '@type': 'ListItem', 'position': 3, 'name': meta.title.split(' | ')[0], 'item': `${BASE_URL}/services/${slug}/` }
      ]
    }
  ];

  if (srvData && Array.isArray(srvData.faqs) && srvData.faqs.length) {
    srvGraph.push({
      '@type': 'FAQPage',
      'mainEntity': srvData.faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a
        }
      }))
    });
  }

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
      '@graph': srvGraph
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
  render: () => sandbox.V.work(),
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Selected Work', 'item': `${BASE_URL}/work/` }
        ]
      }
    ]
  }
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
    render: () => sandbox.V.project(p.slug),
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
            { '@type': 'ListItem', 'position': 2, 'name': 'Selected Work', 'item': `${BASE_URL}/work/` },
            { '@type': 'ListItem', 'position': 3, 'name': p.name, 'item': `${BASE_URL}/work/${p.slug}/` }
          ]
        },
        {
          '@type': 'CreativeWork',
          '@id': `${BASE_URL}/work/${p.slug}/#project`,
          'name': p.name,
          'headline': `${p.name} — Technical Case Study`,
          'description': p.short || `Comprehensive engineering case study for ${p.name} built by Caventra.`,
          'creator': {
            '@type': 'Organization',
            'name': 'Caventra',
            'url': `${BASE_URL}/`
          },
          'url': `${BASE_URL}/work/${p.slug}/`,
          'image': `${BASE_URL}${p.cover || '/assets/og-caventra.png'}`
        }
      ]
    }
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
  render: () => sandbox.V.estimator(),
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Cost Estimator', 'item': `${BASE_URL}/estimator/` }
        ]
      }
    ]
  }
});

// About Page
routes.push({
  slug: 'about',
  urlPath: 'about',
  title: 'About Caventra — Leadership & Engineering Philosophy',
  description: 'Meet the leadership team behind Caventra. We combine architectural rigor, direct engineer collaboration, and clean code principles to solve real business challenges.',
  activeNav: 'about',
  changefreq: 'monthly',
  priority: '0.8',
  render: () => sandbox.V.about(),
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'About', 'item': `${BASE_URL}/about/` }
        ]
      }
    ]
  }
});

// Dedicated Founders Page
routes.push({
  slug: 'founders',
  urlPath: 'founders',
  title: 'Founders of Caventra — Leadership Team',
  description: 'Caventra was founded by three founders: Hriday Vayanta (Growth), Ved Nimbark (Design), and Sauranahmed Mansuri (Technology). Meet our founding leadership team.',
  activeNav: 'founders',
  changefreq: 'monthly',
  priority: '0.9',
  render: () => sandbox.V.founders(),
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Founders', 'item': `${BASE_URL}/founders/` }
        ]
      },
      {
        '@type': 'AboutPage',
        '@id': `${BASE_URL}/founders/#webpage`,
        'url': `${BASE_URL}/founders/`,
        'name': 'Founders of Caventra — Leadership Team',
        'description': 'Caventra was founded by three founders: Hriday Vayanta, Ved Nimbark, and Sauranahmed Mansuri.',
        'mainEntity': {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          'name': 'Caventra',
          'url': `${BASE_URL}/`,
          'logo': `${BASE_URL}/favicon-512x512.png`,
          'image': `${BASE_URL}/assets/og-caventra.png`,
          'founder': [
            {
              '@type': 'Person',
              '@id': `${BASE_URL}/founders/#hriday-vayanta`,
              'name': 'Hriday Vayanta',
              'jobTitle': 'Founder & Head of Growth',
              'worksFor': { '@id': `${BASE_URL}/#organization` },
              'image': `${BASE_URL}/assets/founders/hriday-vayanta.jpg`,
              'email': 'caventraofficial@gmail.com',
              'telephone': '+918866790989',
              'description': 'Founder and Head of Growth at Caventra, leading commercial strategy, client partnerships, marketing campaigns, and recruitment operations.',
              'sameAs': [
                'https://www.instagram.com/caventra__/'
              ]
            },
            {
              '@type': 'Person',
              '@id': `${BASE_URL}/founders/#ved-nimbark`,
              'name': 'Ved Nimbark',
              'jobTitle': 'Founder & Head of Design',
              'worksFor': { '@id': `${BASE_URL}/#organization` },
              'image': `${BASE_URL}/assets/founders/ved-nimbark.jpg`,
              'email': 'vednimbark08@gmail.com',
              'telephone': '+918849186747',
              'description': 'Founder and Head of Design at Caventra, directing brand identities, accessible design systems, typographic hierarchies, and high-conversion user interfaces.'
            },
            {
              '@type': 'Person',
              '@id': `${BASE_URL}/founders/#sauranahmed-mansuri`,
              'name': 'Sauranahmed Mansuri',
              'jobTitle': 'Founder & Head of Technology',
              'worksFor': { '@id': `${BASE_URL}/#organization` },
              'image': `${BASE_URL}/assets/founders/sauranahmed-mansuri.jpg`,
              'email': 'sauranahmed12345678@gmail.com',
              'telephone': '+917990652097',
              'description': 'Founder and Head of Technology at Caventra, architecting full-stack web software, database infrastructures, security protocols, and cloud deployment pipelines.'
            }
          ]
        }
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE_URL}/founders/#faq`,
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How many founders does Caventra have?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Caventra has exactly three founders: Hriday Vayanta (Founder & Head of Growth), Ved Nimbark (Founder & Head of Design), and Sauranahmed Mansuri (Founder & Head of Technology).'
            }
          },
          {
            '@type': 'Question',
            'name': 'Who are the founders of Caventra?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Caventra was founded by three founders: 1. Hriday Vayanta (Founder & Head of Growth - caventraofficial@gmail.com), 2. Ved Nimbark (Founder & Head of Design - vednimbark08@gmail.com), and 3. Sauranahmed Mansuri (Founder & Head of Technology - sauranahmed12345678@gmail.com).'
            }
          },
          {
            '@type': 'Question',
            'name': 'What are the roles of the founders at Caventra?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Hriday Vayanta leads business growth, client partnerships, digital advertising, and marketing. Ved Nimbark directs brand identities, design systems, and UI/UX design. Sauranahmed Mansuri architects full-stack web applications, database systems, security, and cloud infrastructure.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Where is Caventra based?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Caventra is headquartered in Ahmedabad, Gujarat, India, delivering bespoke software, web design, and digital engineering worldwide.'
            }
          }
        ]
      }
    ]
  }
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
  render: () => sandbox.V.process(),
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Our Process', 'item': `${BASE_URL}/process/` }
        ]
      }
    ]
  }
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
  render: () => sandbox.V.contact(),
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Contact', 'item': `${BASE_URL}/contact/` }
        ]
      }
    ]
  }
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
  render: () => sandbox.V.blog(),
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
          { '@type': 'ListItem', 'position': 2, 'name': 'Insights & Blog', 'item': `${BASE_URL}/blog/` }
        ]
      }
    ]
  }
});

// 34 Curated Blog Articles
const blogArticles = sandbox.getB ? sandbox.getB() : [];
for (const b of blogArticles) {
  const articleGraph = [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${BASE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': 'Insights & Blog', 'item': `${BASE_URL}/blog/` },
        { '@type': 'ListItem', 'position': 3, 'name': b.title, 'item': `${BASE_URL}/blog/${b.slug}/` }
      ]
    },
    {
      '@type': 'BlogPosting',
      '@id': `${BASE_URL}/blog/${b.slug}/#article`,
      'headline': b.title,
      'description': b.summary,
      'image': `${BASE_URL}/assets/og-caventra.png`,
      'author': {
        '@type': 'Person',
        'name': b.author,
        'jobTitle': b.authorRole || 'Engineering'
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
      'datePublished': '2026-10-01',
      'dateModified': '2026-10-16'
    }
  ];

  if (b.faqs && Array.isArray(b.faqs) && b.faqs.length > 0) {
    articleGraph.push({
      '@type': 'FAQPage',
      '@id': `${BASE_URL}/blog/${b.slug}/#faq`,
      'mainEntity': b.faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a
        }
      }))
    });
  }

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
      '@graph': articleGraph
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

// Portal Gateway
routes.push({
  slug: 'portal',
  urlPath: 'portal',
  title: 'Client Portal & Founder Command | Caventra',
  description: 'Caventra Client Portal and Founder Command Dashboard for active software project tracking, milestone reviews, and direct collaboration.',
  activeNav: 'portal',
  changefreq: 'weekly',
  priority: '0.7',
  render: () => sandbox.V.portal()
});

// Auth Routes
routes.push({
  slug: 'login',
  urlPath: 'login',
  title: 'Sign In — Client Portal | Caventra',
  description: 'Sign in to the Caventra Client Portal to access your project dashboard, review milestone progress, and download deliverables.',
  activeNav: 'portal',
  changefreq: 'monthly',
  priority: '0.5',
  render: () => sandbox.V.login()
});

routes.push({
  slug: 'register',
  urlPath: 'register',
  title: 'Create Client Account | Caventra',
  description: 'Register for a Caventra client account to collaborate with our engineering team and monitor digital software delivery.',
  activeNav: 'portal',
  changefreq: 'monthly',
  priority: '0.5',
  render: () => sandbox.V.register()
});

routes.push({
  slug: 'reset-password',
  urlPath: 'reset-password',
  title: 'Reset Password — Client Portal | Caventra',
  description: 'Recover or reset your Caventra client portal account password.',
  activeNav: 'portal',
  changefreq: 'monthly',
  priority: '0.2',
  render: () => sandbox.V['reset-password']()
});

routes.push({
  slug: 'client-dashboard',
  urlPath: 'client-dashboard',
  title: 'Client Dashboard | Caventra',
  description: 'Protected Caventra Client Dashboard for active projects, milestone sign-offs, documents, and support.',
  activeNav: 'portal',
  changefreq: 'monthly',
  priority: '0.2',
  render: () => sandbox.V['client-dashboard']()
});

routes.push({
  slug: 'founder-dashboard',
  urlPath: 'founder-dashboard',
  title: 'Founder Command Dashboard | Caventra',
  description: 'Caventra Founder Executive Dashboard for lead management, clients, active projects, and financial tracking.',
  activeNav: 'portal',
  changefreq: 'monthly',
  priority: '0.1',
  render: () => sandbox.V['founder-dashboard']()
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
    html = html.replace(new RegExp(`(<a [^>]*href="(?:#\/|\/)${r.activeNav}\/?"[^>]*)`), '$1 class="on"');
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

// Exclude legal pages and internal auth/dashboard routes from primary index sitemap
const sitemapRoutes = routes.filter(r => !['privacy', 'terms', 'cookies', 'login', 'register', 'reset-password', 'client-dashboard', 'founder-dashboard'].includes(r.urlPath));
const sitemapEntries = sitemapRoutes.map(r => {
  const loc = `${BASE_URL}/${r.urlPath ? r.urlPath + '/' : ''}`;
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${r.lastmod || '2026-10-15'}</lastmod>
  </url>`;
}).join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml);
fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), sitemapXml);
console.log(`✓ Saved sitemap.xml with ${sitemapRoutes.length} canonical URLs (legal routes excluded).`);

console.log('\n====================================================');
console.log(`  Static Build Completed: ${generatedCount} pages generated.`);
console.log('====================================================\n');
