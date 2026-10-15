'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
const { CAVENTRA_ESTIMATOR_CONFIG, calculateEstimate } = require(path.join(ROOT, 'estimator-config.js'));

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

console.log('\n--- CAVENTRA WEBSITE PROJECT COST ESTIMATOR TEST SUITE ---\n');

// 1. CONFIGURATION CHECKS
test('Estimator Config: pricingStatus is valid (APPROVED or PENDING_CAVENTRA_APPROVAL)', () => {
  assert.ok(['APPROVED', 'PENDING_CAVENTRA_APPROVAL'].includes(CAVENTRA_ESTIMATOR_CONFIG.pricingStatus));
  assert.ok(CAVENTRA_ESTIMATOR_CONFIG.statusNote && CAVENTRA_ESTIMATOR_CONFIG.statusNote.length > 10);
});

test('Estimator Config: Mandatory disclaimer copy is exact verbatim string', () => {
  const expectedDisclaimer = 'This is an indicative estimate based on your selected requirements, not a binding quotation. Final pricing may vary after reviewing your project scope. Request a formal quote for confirmed pricing.';
  assert.strictEqual(CAVENTRA_ESTIMATOR_CONFIG.disclaimerText, expectedDisclaimer);
});

test('Estimator Config: Multi-currency support (INR & USD)', () => {
  assert.deepStrictEqual(CAVENTRA_ESTIMATOR_CONFIG.supportedCurrencies, ['INR', 'USD']);
  assert.strictEqual(CAVENTRA_ESTIMATOR_CONFIG.currencySymbols.INR, '₹');
  assert.strictEqual(CAVENTRA_ESTIMATOR_CONFIG.currencySymbols.USD, '$');
});

test('Estimator Config: Contains all 7 approved website types with INR and USD pricing', () => {
  const expectedTypes = ['landing-page', 'small-business', 'corporate', 'portfolio', 'ecommerce', 'booking', 'custom-web-app'];
  assert.strictEqual(CAVENTRA_ESTIMATOR_CONFIG.websiteTypes.length, 7);
  
  expectedTypes.forEach(id => {
    const t = CAVENTRA_ESTIMATOR_CONFIG.websiteTypes.find(x => x.id === id);
    assert.ok(t, `Website type ${id} must exist`);
    assert.ok(t.title && t.title.length > 0);
    assert.ok(t.defaultPages >= 1);
    assert.ok(t.pricing.INR.baseMin > 0 && t.pricing.INR.baseMax >= t.pricing.INR.baseMin);
    assert.ok(t.pricing.USD.baseMin > 0 && t.pricing.USD.baseMax >= t.pricing.USD.baseMin);
    assert.ok(t.pricing.INR.extraPageRate > 0);
    assert.ok(t.pricing.USD.extraPageRate > 0);
  });
});

test('Estimator Config: Features structure and default inclusions', () => {
  assert.ok(CAVENTRA_ESTIMATOR_CONFIG.features.length >= 8);
  const contactForm = CAVENTRA_ESTIMATOR_CONFIG.features.find(f => f.id === 'contact-form-routing');
  assert.ok(contactForm, 'Contact form feature must exist');
  assert.ok(contactForm.includedByDefaultIn.includes('small-business'));
  assert.ok(contactForm.includedByDefaultIn.includes('landing-page'));

  const bookingFeat = CAVENTRA_ESTIMATOR_CONFIG.features.find(f => f.id === 'online-booking-system');
  assert.ok(bookingFeat.includedByDefaultIn.includes('booking'));

  const ecomFeat = CAVENTRA_ESTIMATOR_CONFIG.features.find(f => f.id === 'ecommerce-payment-gateway');
  assert.ok(ecomFeat.includedByDefaultIn.includes('ecommerce'));
});

test('Estimator Config: Additional services separate one-time vs recurring', () => {
  const recurring = CAVENTRA_ESTIMATOR_CONFIG.additionalServices.filter(s => s.type === 'recurring');
  const oneTime = CAVENTRA_ESTIMATOR_CONFIG.additionalServices.filter(s => s.type === 'one-time');
  
  assert.ok(recurring.length >= 1, 'Must have at least one recurring maintenance option');
  assert.ok(oneTime.length >= 4, 'Must have multiple one-time add-on services');
  assert.strictEqual(recurring[0].id, 'ongoing-maintenance');
});

// 2. CALCULATION ENGINE CHECKS
test('Calculation: Base Small Business in INR (5 pages, standard complexity)', () => {
  const state = {
    currency: 'INR',
    websiteTypeId: 'small-business',
    pageCount: 5,
    selectedFeatureIds: [],
    selectedServiceIds: [],
    complexityId: 'standard'
  };
  const est = calculateEstimate(state);
  assert.strictEqual(est.oneTimeDevMin, 45000);
  assert.strictEqual(est.oneTimeDevMax, 65000);
  assert.strictEqual(est.extraPages, 0);
  assert.strictEqual(est.extraPagesCost, 0);
  assert.strictEqual(est.recurringMax, 0);
  assert.strictEqual(est.currencySymbol, '₹');
});

test('Calculation: Small Business in INR with 10 pages (5 extra pages)', () => {
  const state = {
    currency: 'INR',
    websiteTypeId: 'small-business',
    pageCount: 10,
    selectedFeatureIds: [],
    selectedServiceIds: [],
    complexityId: 'standard'
  };
  const est = calculateEstimate(state);
  // Base: 45,000 - 65,000. Extra 5 pages @ 4,000/page = 20,000 extra.
  assert.strictEqual(est.extraPages, 5);
  assert.strictEqual(est.extraPagesCost, 20000);
  assert.strictEqual(est.oneTimeDevMin, 65000);
  assert.strictEqual(est.oneTimeDevMax, 85000);
});

test('Calculation: Small Business in USD with 10 pages (5 extra pages)', () => {
  const state = {
    currency: 'USD',
    websiteTypeId: 'small-business',
    pageCount: 10,
    selectedFeatureIds: [],
    selectedServiceIds: [],
    complexityId: 'standard'
  };
  const est = calculateEstimate(state);
  // Base: 800 - 1200. Extra 5 pages @ 75/page = 375 extra.
  assert.strictEqual(est.extraPages, 5);
  assert.strictEqual(est.extraPagesCost, 375);
  assert.strictEqual(est.oneTimeDevMin, 1175);
  assert.strictEqual(est.oneTimeDevMax, 1575);
  assert.strictEqual(est.currencySymbol, '$');
});

test('Calculation: Prevents double-charging for features included in base type', () => {
  const state = {
    currency: 'INR',
    websiteTypeId: 'booking', // default includes online-booking-system
    pageCount: 6,
    selectedFeatureIds: ['online-booking-system'],
    selectedServiceIds: [],
    complexityId: 'standard'
  };
  const est = calculateEstimate(state);
  // Base Booking: 60,000 - 90,000.
  assert.strictEqual(est.oneTimeDevMin, 60000);
  assert.strictEqual(est.oneTimeDevMax, 90000);
  const bookingFeat = est.selectedFeatures.find(f => f.id === 'online-booking-system');
  assert.strictEqual(bookingFeat.included, true);
  assert.strictEqual(bookingFeat.costMin, 0);
  assert.strictEqual(bookingFeat.costMax, 0);
});

test('Calculation: Correctly charges for optional features not included in base', () => {
  const state = {
    currency: 'INR',
    websiteTypeId: 'small-business', // does not include blog-cms
    pageCount: 5,
    selectedFeatureIds: ['blog-cms'], // INR: 12,000 - 18,000
    selectedServiceIds: [],
    complexityId: 'standard'
  };
  const est = calculateEstimate(state);
  // Base: 45,000 - 65,000 + Blog: 12,000 - 18,000 = 57,000 - 83,000.
  assert.strictEqual(est.oneTimeDevMin, 57000);
  assert.strictEqual(est.oneTimeDevMax, 83000);
});

test('Calculation: Recurring services strictly separated from one-time development total', () => {
  const state = {
    currency: 'INR',
    websiteTypeId: 'small-business',
    pageCount: 5,
    selectedFeatureIds: [],
    selectedServiceIds: ['ongoing-maintenance', 'brand-identity'], // ongoing maintenance (recurring 4,500-8,000) + branding (one-time 15,000-25,000)
    complexityId: 'standard'
  };
  const est = calculateEstimate(state);
  // One-time: Base 45,000-65,000 + Branding 15,000-25,000 = 60,000 - 90,000.
  assert.strictEqual(est.oneTimeDevMin, 60000);
  assert.strictEqual(est.oneTimeDevMax, 90000);
  // Recurring maintenance is kept separate:
  assert.strictEqual(est.recurringMin, 4500);
  assert.strictEqual(est.recurringMax, 8000);
  assert.strictEqual(est.recurringPeriod, 'month');
});

test('Calculation: Complexity multiplier 1.2x applies to total one-time development', () => {
  const state = {
    currency: 'INR',
    websiteTypeId: 'small-business',
    pageCount: 5,
    selectedFeatureIds: [],
    selectedServiceIds: [],
    complexityId: 'elevated' // 1.2x
  };
  const est = calculateEstimate(state);
  // Base: 45,000 * 1.2 = 54,000; 65,000 * 1.2 = 78,000.
  assert.strictEqual(est.oneTimeDevMin, 54000);
  assert.strictEqual(est.oneTimeDevMax, 78000);
  assert.strictEqual(est.complexity.multiplier, 1.2);
});

// 3. FILE PARITY AND INTEGRATION CHECKS
test('File Parity: app.js is 100% byte-for-byte identical with public/app.js', () => {
  const root = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const pub = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
  assert.strictEqual(root, pub);
});

test('File Parity: index.html is 100% byte-for-byte identical with public/index.html', () => {
  const root = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const pub = fs.readFileSync(path.join(ROOT, 'public', 'index.html'), 'utf8');
  assert.strictEqual(root, pub);
});

test('File Parity: styles.css is 100% byte-for-byte identical with public/styles.css', () => {
  const root = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
  const pub = fs.readFileSync(path.join(ROOT, 'public', 'styles.css'), 'utf8');
  assert.strictEqual(root, pub);
});

test('File Parity: estimator-config.js is 100% byte-for-byte identical with public/estimator-config.js', () => {
  const root = fs.readFileSync(path.join(ROOT, 'estimator-config.js'), 'utf8');
  const pub = fs.readFileSync(path.join(ROOT, 'public', 'estimator-config.js'), 'utf8');
  assert.strictEqual(root, pub);
});

test('HTML Integration: Navigation link to /estimator/ and script tags present in index.html', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  assert.ok(html.includes('<a href="/estimator/">Estimator</a>') || html.includes('<a href="#/estimator">Estimator</a>'), 'Nav must have link to estimator');
  assert.ok(html.includes('estimator-config.js'), 'index.html must load estimator-config.js');
  assert.ok(html.indexOf('estimator-config.js') < html.indexOf('app.js'), 'estimator-config.js must load before app.js');
});

test('CSS Integration: Estimator classes and light mode styling present in styles.css', () => {
  const css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
  assert.ok(css.includes('.estimator-wrap'), 'Must include .estimator-wrap');
  assert.ok(css.includes('.type-grid'), 'Must include .type-grid');
  assert.ok(css.includes('.review-total-banner'), 'Must include .review-total-banner');
  assert.ok(css.includes('.service-estimator-callout'), 'Must include .service-estimator-callout');
  assert.ok(css.includes('.contact-estimator-banner'), 'Must include .contact-estimator-banner');
  assert.ok(css.includes('[data-theme="light"] .review-summary-sheet'), 'Must support light theme for estimator summary');
  assert.ok(css.includes('[data-theme="light"] .type-card'), 'Must support light theme for cards');
});

test('JavaScript Integration: Route #/estimator, callouts, and leadSource dynamic tracking', () => {
  const js = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  assert.ok(js.includes("r==='estimator'?V.estimator():"), 'Route handler for estimator must be in render()');
  assert.ok(js.includes('service-estimator-callout'), 'Services page must have estimator launch callout');
  assert.ok(js.includes('contact-estimator-banner'), 'Contact page must render prefill banner when prefilled');
  assert.ok(js.includes("leadSource: (estimatorPrefillData ? 'Website Cost Estimator' : 'Website Contact Form (caventraofficial.in)')"), 'Submission must tag estimator leadSource');
});

console.log(`\n========================================`);
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
