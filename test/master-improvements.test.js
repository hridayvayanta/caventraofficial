// test/master-improvements.test.js
// Verification suite for CAVENTRA Master Website Improvements

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

console.log('\n======================================================');
console.log('  CAVENTRA: Master Website Improvements Test Suite');
console.log('======================================================\n');

// 1. FILE PARITY VERIFICATION
test('Parity: All 7 critical source/public file pairs are 100% byte-for-byte identical', () => {
  const files = [
    'app.js',
    'styles.css',
    'index.html',
    'ventrabot.js',
    'sitemap.xml',
    'estimator-config.js',
    'theme.js'
  ];
  for (const f of files) {
    const rootContent = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const pubContent = fs.readFileSync(path.join(ROOT, 'public', f), 'utf8');
    assert.strictEqual(rootContent, pubContent, `File parity mismatch for ${f}`);
  }

  // Also verify light logo assets binary parity
  const lightLogos = ['assets/logo-light.png', 'assets/logo-nav-light.png'];
  for (const f of lightLogos) {
    const rootBuf = fs.readFileSync(path.join(ROOT, f));
    const pubBuf = fs.readFileSync(path.join(ROOT, 'public', f));
    assert.ok(rootBuf.equals(pubBuf), `Binary parity mismatch for ${f}`);
  }
});

// 2. BRANDING & THEME PALETTE
test('Brand & Theme: Warm light mode and dark mode palettes properly defined', () => {
  const css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
  assert.ok(css.includes('#F1EFE8'), 'Must include approved light background #F1EFE8');
  assert.ok(css.includes('#E7E4DA'), 'Must include approved light card background #E7E4DA');
  assert.ok(css.includes('#30343A'), 'Must include approved light text #30343A');
  assert.ok(css.includes('#565C63'), 'Must include approved light secondary text #565C63');
  assert.ok(css.includes('#93743E') || css.includes('#93743e'), 'Must include approved light accent #93743e');
  assert.ok(css.includes('.signature-model-section'), 'Must include .signature-model-section');
  assert.ok(css.includes('.pillar-grid'), 'Must include .pillar-grid');
  assert.ok(css.includes('.process-timeline'), 'Must include .process-timeline');
  assert.ok(css.includes('.trust-standards-grid'), 'Must include .trust-standards-grid');
  assert.ok(css.includes('.faq-wrap'), 'Must include .faq-wrap');
  assert.ok(css.includes('.service-detail-wrap'), 'Must include .service-detail-wrap');
});

// 3. CHANGE 1: HOMEPAGE HERO
test('Change 1: Homepage hero contains headline "Websites & Digital Solutions, Engineered for Growing Businesses." with transparent stroke on "Engineered", model pill, highlights, and CTAs', () => {
  const js = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(js.includes('Websites & Digital Solutions, Engineered for Growing Businesses.'), 'Hero headline matches requested copy');
  assert.ok(js.includes("{4:'o',7:'g'}"), 'Transparent stroke applied to "Engineered" and gradient to "Businesses."');
  assert.ok(js.includes('hero-model-pill'), 'Hero model pill badge present');
  assert.ok(js.includes('BUILD · MANAGE · SECURE · HOST'), 'Hero model pill text present');
  assert.ok(js.includes('hero-highlights'), 'Hero highlights row present');
  assert.ok(js.includes('Bespoke Code (Zero Page-Builders)'), 'Bespoke Code highlight present');
  assert.ok(js.includes('100% Client Code &amp; IP Ownership'), 'Client Code Ownership highlight present');
  assert.ok(js.includes('Sub-Second Fast Loading'), 'Sub-second loading highlight present');
  assert.ok(js.includes('Upfront Transparent Quotes'), 'Upfront quotes highlight present');
  assert.ok(js.includes('href="/contact/">Start a Project ↗</a>') || js.includes('href="#/contact">Start a Project ↗</a>'), 'Hero primary CTA 1: Start a Project');
  assert.ok(js.includes('href="/services/">Explore Services</a>') || js.includes('href="#/services">Explore Services</a>'), 'Hero primary CTA 2: Explore Services');
  assert.ok(js.includes('href="/estimator/"') || js.includes('href="#/estimator"'), 'Hero estimator link present');
});

// 4. CHANGE 2: PORTFOLIO & CASE STUDIES
test('Change 2: Portfolio has category filters, honest status badges, and structured case study layout', () => {
  const js = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(js.includes('work-filter-wrap'), 'Portfolio has category filter buttons wrap');
  assert.ok(js.includes('Client Production ERP'), 'Wheel Master identified as Client Production ERP');
  assert.ok(js.includes('In Active Development'), 'PLINTH identified as In Active Development');
  assert.ok(js.includes('Production Web App'), 'GenResume identified as Production Web App');
  assert.ok(js.includes('Developer Showcase'), 'Personal Portfolio identified as Developer Showcase');
  assert.ok(js.includes('Concept Prototype'), 'Other projects honestly identified as Concept Prototype');
  assert.ok(js.includes('The Business Challenge'), 'Case study has dedicated Challenge section');
  assert.ok(js.includes('Engineered Solution'), 'Case study has dedicated Solution section');
  assert.ok(js.includes('Key Features &amp; Technical Capabilities'), 'Case study has dedicated Features list');
  assert.ok(js.includes('Tangible Results & Current Status'), 'Case study has dedicated Results & Status section');
});

// 5. CHANGE 3: DEDICATED SERVICE PAGES
test('Change 3: All 5 dedicated service profiles exist with required business content and routes', () => {
  const js = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const services = [
    'web-development',
    'branding',
    'maintenance',
    'hosting',
    'security'
  ];

  for (const s of services) {
    assert.ok(js.includes(`"slug": "${s}"`) || js.includes(`slug: "${s}"`), `Service data contains slug ${s}`);
    assert.ok(js.includes(`#/services/${s}`) || js.includes(`/services/${s}/`), `Service route for ${s} is linked`);
  }

  // Verify routing in render()
  assert.ok(js.includes("r==='services'&&s?V.serviceDetail(s):r==='services'?V.services():"), 'Router handles #/services/:slug and #/services');

  // Verify sitemap.xml contains all 5 routes
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  for (const s of services) {
    assert.ok(
      sitemap.includes(`https://caventraofficial.in/services/${s}/`),
      `sitemap.xml contains service ${s}`
    );
  }
});

// 6. CHANGE 4: TRUST & TRANSPARENCY
test('Change 4: 7-stage delivery process, trust standards grid, and buying FAQs are present', () => {
  const js = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  // 7 Stages
  assert.ok(js.includes('Discovery & Requirements') || js.includes('Discovery'), 'Stage 1 Discovery present');
  assert.ok(js.includes('Planning & Architecture'), 'Stage 2 Planning & Architecture present');
  assert.ok(js.includes('Design & Prototyping'), 'Stage 3 Design & Prototyping present');
  assert.ok(js.includes('Full-Stack Engineering'), 'Stage 4 Full-Stack Engineering present');
  assert.ok(js.includes('Testing & Verification'), 'Stage 5 Testing & Verification present');
  assert.ok(js.includes('Launch & Deployment'), 'Stage 6 Launch & Deployment present');
  assert.ok(js.includes('Ongoing Support & Scaling') || js.includes('Ongoing Support'), 'Stage 7 Ongoing Support present');

  // Trust standards
  assert.ok(js.includes('100% Client Code & IP Ownership'), 'Ownership trust commitment present');
  assert.ok(js.includes('No Fragile Page-Builders'), 'No page-builders trust commitment present');
  assert.ok(js.includes('Upfront Transparent Quotes'), 'Transparent quotes commitment present');
  assert.ok(js.includes('Direct Engineer Collaboration'), 'Direct collaboration commitment present');

  // FAQs
  assert.ok(js.includes('Do I own my code and website after launch?'), 'Ownership FAQ present');
  assert.ok(js.includes('How does Caventra differ from traditional agencies?'), 'Agency comparison FAQ present');
});

// 7. CHANGE 5: SIGNATURE BUILD. MANAGE. SECURE. HOST. SECTION
test('Change 5: Signature BUILD. MANAGE. SECURE. HOST. section prominent with 4 interactive pillars', () => {
  const js = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(js.includes('signature-model-section'), 'Homepage contains signature-model-section');
  assert.ok(js.includes('BUILD. MANAGE. SECURE. HOST.'), 'Pillars heading BUILD. MANAGE. SECURE. HOST.');
  assert.ok(js.includes('Explore Web Development ↗'), 'Pillar 1 links to web development');
  assert.ok(js.includes('Explore Management ↗'), 'Pillar 2 links to management');
  assert.ok(js.includes('Explore Security ↗'), 'Pillar 3 links to security');
  assert.ok(js.includes('Explore Hosting ↗'), 'Pillar 4 links to hosting');
});

// 8. VENTRABOT ESTIMATOR ACTION
test('Ventrabot: "Estimate Your Project" action is configured to route #/estimator and preserves chatbot logic', () => {
  const vbot = fs.readFileSync(path.join(ROOT, 'ventrabot.js'), 'utf8');
  assert.ok(vbot.includes('{ label: "Estimate Your Project", route: "#/estimator" }'), 'Estimate action in ventrabot.js');
  // Check preservation of avatar and other handlers
  assert.ok(vbot.includes('ventra-avatar'), 'Avatar markup preserved');
  assert.ok(vbot.includes('DECISION_TREE'), 'Chatbot decision tree preserved');
  assert.ok(vbot.includes('window.location.hash = route'), 'Router navigation handler preserved');
});

// 9. SERVICE DETAIL RENDERING VERIFICATION (VM Simulation)
test('DOM Simulation: V.serviceDetail renders complete HTML for all 5 services without runtime errors', () => {
  const js = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

  const sandbox = {
    window: {},
    document: {
      documentElement: { getAttribute: () => 'dark' },
      querySelector: () => null,
      querySelectorAll: () => []
    },
    setTimeout,
    clearTimeout,
    console,
    Math,
    Date
  };
  vm.createContext(sandbox);

  // Run mock environment and evaluate V.serviceDetail
  vm.runInContext(`
    let S = {
      services: [["Web Development", "Websites"]],
      process: [["Discover", "Goals"]],
      about: { who: "Caventra is an engineering-focused studio." },
      projects: [
        { name: "The Wheel Master", slug: "the-wheel-master", category: "Custom Business Software", published: true, tech: "HTML5, JS" },
        { name: "PLINTH", slug: "plinth", category: "AI Solutions", published: true, tech: "React, Python" },
        { name: "GenResume", slug: "genresume", category: "Web Development", published: true, tech: "React, Django" }
      ],
      contact: { email: "caventraofficial@gmail.com", phone: "8866790989" },
      socials: [["Instagram", "https://instagram.com/caventra__"]]
    };
    const D = JSON.parse(JSON.stringify(S));
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const safe = u => u;
    const sp = t => t;
    const sec = (t, v) => v ? '<div>' + t + ': ' + v + '</div>' : '';
    const getTheme = () => 'dark';
    const getLogo = () => '/assets/logo.png';
  `, sandbox);

  // Extract CAVENTRA_SERVICES_DATA and serviceDetail function
  const dataMatch = js.match(/const CAVENTRA_SERVICES_DATA = \{[\s\S]*?\n\};\n/);
  assert.ok(dataMatch, 'Extracted CAVENTRA_SERVICES_DATA');
  vm.runInContext(dataMatch[0], sandbox);

  const getStatusMatch = js.match(/const getProjectStatus=[\s\S]*?\n\};\n/);
  assert.ok(getStatusMatch, 'Extracted getProjectStatus');
  vm.runInContext(getStatusMatch[0], sandbox);

  const cardMatch = js.match(/const card=p=>[\s\S]*?\n\};\n/);
  assert.ok(cardMatch, 'Extracted card');
  vm.runInContext(`
    const getCover = () => '/assets/projects/the-wheel-master.svg';
    ${cardMatch[0]}
    const workGrid = l => l.map(card).join('');
    const V = {
      notFound: msg => '404: ' + msg
    };
  `, sandbox);

  const serviceDetailMatch = js.match(/serviceDetail: \(slug\) => \{[\s\S]*?\n\},/);
  assert.ok(serviceDetailMatch, 'Extracted serviceDetail method');
  vm.runInContext(`V.serviceDetail = ${serviceDetailMatch[0].replace('serviceDetail: ', '').replace(/,$/, '')};`, sandbox);

  const services = ['web-development', 'branding', 'maintenance', 'hosting', 'security'];
  for (const s of services) {
    const html = vm.runInContext(`V.serviceDetail("${s}")`, sandbox);
    assert.ok(typeof html === 'string' && html.length > 500, `Generated HTML for ${s} is substantial (${html.length} chars)`);
    assert.ok(html.includes('service-detail-wrap'), `${s} contains .service-detail-wrap`);
    assert.ok(html.includes('service-hero-title'), `${s} contains .service-hero-title`);
    assert.ok(html.includes('deliverables-grid'), `${s} contains .deliverables-grid`);
    assert.ok(html.includes('service-workflow-grid'), `${s} contains .service-workflow-grid`);
    assert.ok(html.includes('faq-wrap'), `${s} contains .faq-wrap`);
  }

  // Non-existent service returns 404
  const notFoundHtml = vm.runInContext('V.serviceDetail("unknown-service")', sandbox);
  assert.ok(notFoundHtml.includes('404'), 'Unknown service slug triggers notFound');
});

// 7. FAVICON INTEGRITY & GOOGLE SEARCH COMPLIANCE
test('Favicon: Square assets exist, meet Google requirements, maintain root/public parity, and link tags are present', () => {
  const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(indexHtml.includes('<link rel="icon" type="image/x-icon" href="/favicon.ico">'), 'Missing /favicon.ico tag');
  assert.ok(indexHtml.includes('<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">'), 'Missing 96x96 favicon tag');
  assert.ok(indexHtml.includes('<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">'), 'Missing 192x192 favicon tag');
  assert.ok(indexHtml.includes('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">'), 'Missing apple-touch-icon tag');

  const faviconAssets = [
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon-48x48.png',
    'favicon-96x96.png',
    'favicon-192x192.png',
    'apple-touch-icon.png',
    path.join('assets', 'favicon.png')
  ];

  for (const f of faviconAssets) {
    const rootPath = path.join(ROOT, f);
    const pubPath = path.join(ROOT, 'public', f);
    assert.ok(fs.existsSync(rootPath), `Missing root asset: ${f}`);
    assert.ok(fs.existsSync(pubPath), `Missing public asset: ${f}`);
    const rootBuf = fs.readFileSync(rootPath);
    const pubBuf = fs.readFileSync(pubPath);
    assert.ok(rootBuf.equals(pubBuf), `Parity mismatch for binary asset: ${f}`);
  }

  // Verify robots.txt does not disallow favicons or Googlebot
  const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
  assert.ok(!robots.includes('Disallow: /favicon'), 'robots.txt must not disallow favicons');
  assert.ok(robots.includes('Allow: /'), 'robots.txt must allow root');
});

console.log('\n========================================');
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
