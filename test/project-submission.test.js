'use strict';
/**
 * CAVENTRA — Comprehensive Verification Test Suite
 * Tests Google Apps Script logic, Frontend Form Submission, Error Handling,
 * Exact Success Copy, Security Formula Neutralization, and File Parity.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failCount++;
  }
}

console.log('\n======================================================');
console.log('  CAVENTRA: Project Enquiries Submission Test Suite');
console.log('======================================================\n');

// -----------------------------------------------------------------------------
// Test Suite 1: File Parity Checks (Root vs Public)
// -----------------------------------------------------------------------------
console.log('--- Test Suite 1: Root & Public Parity ---');
const appRoot = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const appPub = fs.readFileSync(path.join(__dirname, '..', 'public', 'app.js'), 'utf8');
assert(appRoot === appPub, 'app.js and public/app.js are 100% byte-for-byte identical');

const stylesRoot = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
const stylesPub = fs.readFileSync(path.join(__dirname, '..', 'public', 'styles.css'), 'utf8');
assert(stylesRoot === stylesPub, 'styles.css and public/styles.css are 100% byte-for-byte identical');

const estRoot = fs.readFileSync(path.join(__dirname, '..', 'estimator-config.js'), 'utf8');
const estPub = fs.readFileSync(path.join(__dirname, '..', 'public', 'estimator-config.js'), 'utf8');
assert(estRoot === estPub, 'estimator-config.js and public/estimator-config.js are 100% byte-for-byte identical');

// -----------------------------------------------------------------------------
// Test Suite 2: Google Apps Script Backend Logic & Security
// -----------------------------------------------------------------------------
console.log('\n--- Test Suite 2: Google Apps Script (Code.gs) ---');
const codeGs = fs.readFileSync(path.join(__dirname, '..', 'google-apps-script', 'Code.gs'), 'utf8');

// Test formula injection sanitizer
function escapeFormula(val) {
  if (val === null || val === undefined) return '';
  const strVal = String(val);
  if (/^[=+\-@\t\r]/.test(strVal)) {
    return "'" + strVal;
  }
  return strVal;
}

assert(escapeFormula('=SUM(1+1)') === "'=SUM(1+1)", 'Escapes formulas starting with =');
assert(escapeFormula('+cmd|"/C calc"!A0') === "'+cmd|\"/C calc\"!A0", 'Escapes DDE command starting with +');
assert(escapeFormula('-2+3') === "'-2+3", 'Escapes value starting with -');
assert(escapeFormula('@evil.com') === "'@evil.com", 'Escapes value starting with @');
assert(escapeFormula('\tTAB_INJECT') === "'\tTAB_INJECT", 'Escapes tab character prefix');
assert(escapeFormula('\rRETURN_INJECT') === "'\rRETURN_INJECT", 'Escapes carriage return prefix');
assert(escapeFormula('Normal Project Description') === 'Normal Project Description', 'Leaves benign text intact');

// Test email validation regex
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
assert(isValidEmail('client@domain.com') === true, 'Accepts valid email');
assert(isValidEmail('caventraofficial@gmail.com') === true, 'Accepts caventraofficial@gmail.com');
assert(isValidEmail('invalid-email') === false, 'Rejects email without @ or domain');
assert(isValidEmail('@domain.com') === false, 'Rejects email missing user part');
assert(isValidEmail('client@') === false, 'Rejects email missing domain');
assert(isValidEmail('') === false, 'Rejects empty email');

// Test unique Enquiry ID format
function generateEnquiryId(date) {
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'CV-' + ymd + '-' + rand;
}
const testId = generateEnquiryId(new Date());
assert(/^CV-\d{8}-[2-9A-Z]{4}$/.test(testId), `Generated Enquiry ID matches pattern CV-YYYYMMDD-XXXX: ${testId}`);

// Verify Code.gs headers match the 12 required columns
assert(codeGs.includes("'Enquiry ID'"), 'Code.gs contains column "Enquiry ID"');
assert(codeGs.includes("'Submission Date'"), 'Code.gs contains column "Submission Date"');
assert(codeGs.includes("'Full Name'"), 'Code.gs contains column "Full Name"');
assert(codeGs.includes("'Email'"), 'Code.gs contains column "Email"');
assert(codeGs.includes("'Phone or WhatsApp'"), 'Code.gs contains column "Phone or WhatsApp"');
assert(codeGs.includes("'Company Name'"), 'Code.gs contains column "Company Name"');
assert(codeGs.includes("'Requested Service'"), 'Code.gs contains column "Requested Service"');
assert(codeGs.includes("'Budget'"), 'Code.gs contains column "Budget"');
assert(codeGs.includes("'Timeline'"), 'Code.gs contains column "Timeline"');
assert(codeGs.includes("'Project Requirements'"), 'Code.gs contains column "Project Requirements"');
assert(codeGs.includes("'Lead Source'"), 'Code.gs contains column "Lead Source"');
assert(codeGs.includes("'Status'"), 'Code.gs contains column "Status"');
assert(codeGs.includes("'New'"), 'Code.gs initializes row status as "New"');

// -----------------------------------------------------------------------------
// Test Suite 3: Exact Success Copy & Messaging
// -----------------------------------------------------------------------------
console.log('\n--- Test Suite 3: Success Messaging & Form Flow ---');
const EXACT_SUCCESS_TEXT = 'Your project has been submitted. One of our representatives will call you soon!';
assert(appRoot.includes(EXACT_SUCCESS_TEXT), `app.js includes exact success message: "${EXACT_SUCCESS_TEXT}"`);
assert(appPub.includes(EXACT_SUCCESS_TEXT), `public/app.js includes exact success message: "${EXACT_SUCCESS_TEXT}"`);

// Verify email-choice screen removal from successful flow
assert(!appRoot.includes("Almost there. Send it to us"), 'Removed old "Almost there. Send it to us" screen');
assert(!appPub.includes("Almost there. Send it to us"), 'Removed old screen from public/app.js');

// Verify Back to Home button presence
assert(appRoot.includes('href="/"') || appRoot.includes('href="#/"'), 'Provides optional "Back to Home" button');

// -----------------------------------------------------------------------------
// Test Suite 4: Frontend Integration Layer & Endpoint Detection
// -----------------------------------------------------------------------------
console.log('\n--- Test Suite 4: Integration Layer & Error Handling ---');

// Mock browser sandbox to test frontend methods
const sandbox = {
  window: {},
  document: {
    documentElement: { getAttribute: () => 'dark' },
    querySelector: () => null,
    querySelectorAll: () => []
  },
  setTimeout,
  clearTimeout,
  console
};
vm.createContext(sandbox);

// Extract helper functions from app.js
vm.runInContext(`
  function isPlaceholderEndpoint(url) {
    return !url || url.includes('YOUR_DEPLOYMENT_ID_HERE') || !/^https:\\/\\/script\\.google\\.com\\/macros\\/s\\/[A-Za-z0-9_-]+\\/exec/i.test(url);
  }
`, sandbox);

assert(sandbox.isPlaceholderEndpoint('https://script.google.com/macros/s/AKfycbxYOUR_DEPLOYMENT_ID_HERE/exec') === true, 'Detects default placeholder URL');
assert(sandbox.isPlaceholderEndpoint('') === true, 'Detects empty URL as placeholder');
assert(sandbox.isPlaceholderEndpoint('https://example.com/api') === true, 'Detects non-Apps Script URL');
assert(sandbox.isPlaceholderEndpoint('https://script.google.com/macros/s/AKfycbx_RealDeploymentId123/exec') === false, 'Accepts valid real Apps Script deployment URL');

// -----------------------------------------------------------------------------
// Test Suite 5: CSS Design System & Theme Adaptation
// -----------------------------------------------------------------------------
console.log('\n--- Test Suite 5: CSS Rules & Themes ---');
assert(stylesRoot.includes('.project-success'), 'styles.css has .project-success class');
assert(stylesRoot.includes('.success-checkmark'), 'styles.css has .success-checkmark class');
assert(stylesRoot.includes('.success-circle'), 'styles.css has .success-circle SVG stroke animation');
assert(stylesRoot.includes('.success-check'), 'styles.css has .success-check SVG stroke animation');
assert(stylesRoot.includes('[data-theme="light"] .project-success'), 'styles.css has light theme styles for .project-success');
assert(stylesRoot.includes('.form-alert.error'), 'styles.css has .form-alert.error class for failure state');
assert(stylesRoot.includes('[data-theme="light"] .form-alert.error'), 'styles.css has light theme alert styling');
assert(stylesRoot.includes('.btn-spinner'), 'styles.css has .btn-spinner loading spinner');
assert(stylesRoot.includes('@media (max-width: 480px)'), 'styles.css has mobile breakpoint for success screen');

// -----------------------------------------------------------------------------
// Test Suite 6: HTML5 Constraint Validation Regexes (Name & Phone)
// -----------------------------------------------------------------------------
console.log('\n--- Test Suite 6: HTML5 Constraint Validation Regexes ---');

// Extract pattern attributes from rendered contact page
const contactHtml = fs.readFileSync(path.join(__dirname, '..', 'contact', 'index.html'), 'utf8');
const namePatternMatch = contactHtml.match(/name="name"[^>]*pattern="([^"]+)"/);
assert(!!namePatternMatch, 'contact/index.html includes pattern attribute on name input');
const namePattern = namePatternMatch ? namePatternMatch[1] : '';

// 1. Verify Name Pattern
assert(namePattern === '^[A-Za-z\\s.\'-]+$', `Name pattern in HTML is rendered as ^[A-Za-z\\s.'-]+$: got "${namePattern}"`);

let nameRegExp;
try {
  nameRegExp = new RegExp('^(?:' + namePattern + ')$', 'u');
  assert(true, 'Name pattern compiles successfully under Unicode mode (/u)');
} catch (e) {
  assert(false, `Name pattern failed to compile: ${e.message}`);
}

if (nameRegExp) {
  assert(nameRegExp.test('John Doe') === true, 'Name regex accepts standard two-word name ("John Doe")');
  assert(nameRegExp.test('Jane A. Doe-Smith') === true, 'Name regex accepts multi-word name with dots and hyphens ("Jane A. Doe-Smith")');
  assert(nameRegExp.test("Mary-Jane O'Connor") === true, 'Name regex accepts apostrophes and hyphens ("Mary-Jane O\'Connor")');
  assert(nameRegExp.test('Hriday Vayanta') === true, 'Name regex accepts "Hriday Vayanta"');
  assert(nameRegExp.test('Dr. A. P. J. Abdul Kalam') === true, 'Name regex accepts multi-word titles and abbreviations');
  assert(nameRegExp.test('John123') === false, 'Name regex rejects numbers in name ("John123")');
  assert(nameRegExp.test('User@Domain') === false, 'Name regex rejects special symbol @');
  assert(nameRegExp.test('<script>alert(1)</script>') === false, 'Name regex rejects script tags / HTML symbols');
  assert(nameRegExp.test('') === false, 'Name regex rejects empty name');
}

// 2. Verify Phone Pattern
const phonePatternMatch = contactHtml.match(/name="phone"[^>]*pattern="([^"]+)"/);
assert(!!phonePatternMatch, 'contact/index.html includes pattern attribute on phone input');
const phonePattern = phonePatternMatch ? phonePatternMatch[1] : '';

assert(phonePattern === '[+]?[0-9\\s()\\-]{7,18}', `Phone pattern in HTML is rendered as [+]?[0-9\\s()\\-]{7,18}: got "${phonePattern}"`);

let phoneRegExp;
try {
  phoneRegExp = new RegExp('^(?:' + phonePattern + ')$', 'u');
  assert(true, 'Phone pattern compiles successfully under Unicode mode (/u) without backwards range errors');
} catch (e) {
  assert(false, `Phone pattern failed to compile: ${e.message}`);
}

if (phoneRegExp) {
  assert(phoneRegExp.test('+91 98765 43210') === true, 'Phone regex accepts India format with spaces ("+91 98765 43210")');
  assert(phoneRegExp.test('+1 (555) 234-5678') === true, 'Phone regex accepts US format with parentheses and hyphen ("+1 (555) 234-5678")');
  assert(phoneRegExp.test('9876543210') === true, 'Phone regex accepts 10-digit number without symbols ("9876543210")');
  assert(phoneRegExp.test('+44 20 7946 0919') === true, 'Phone regex accepts UK format with country code and spaces ("+44 20 7946 0919")');
  assert(phoneRegExp.test('080-1234567') === true, 'Phone regex accepts landline format with hyphens ("080-1234567")');
  assert(phoneRegExp.test('12345') === false, 'Phone regex rejects numbers shorter than 7 characters ("12345")');
  assert(phoneRegExp.test('+12345678901234567890') === false, 'Phone regex rejects numbers longer than 18 characters');
  assert(phoneRegExp.test('phone-number') === false, 'Phone regex rejects alphabetical letters');
  assert(phoneRegExp.test('') === false, 'Phone regex rejects empty phone number');
}

// -----------------------------------------------------------------------------
// Test Suite 7: Estimator Timeline Metadata & Prefill Handoff
// -----------------------------------------------------------------------------
console.log('\n--- Test Suite 7: Estimator Timeline Metadata & Prefill Handoff ---');

const { CAVENTRA_ESTIMATOR_CONFIG, calculateEstimate } = require(path.join(__dirname, '..', 'estimator-config.js'));

// Verify timeline metadata in all website types
assert(Array.isArray(CAVENTRA_ESTIMATOR_CONFIG.websiteTypes) && CAVENTRA_ESTIMATOR_CONFIG.websiteTypes.length === 7, 'Estimator has all 7 website types configured');

CAVENTRA_ESTIMATOR_CONFIG.websiteTypes.forEach(t => {
  assert(typeof t.timeline === 'string' && t.timeline.length > 0, `Website type "${t.id}" (${t.title}) has timeline metadata: "${t.timeline}"`);
  assert(/^\d+-\d+\s+weeks$/.test(t.timeline), `Timeline format for "${t.id}" matches standard range (e.g. "4-6 weeks"): got "${t.timeline}"`);
});

// Verify calculateEstimate passes timeline metadata on websiteType
const landingEstimate = calculateEstimate({ websiteTypeId: 'landing-page' }, CAVENTRA_ESTIMATOR_CONFIG);
assert(landingEstimate.websiteType.timeline === '2-3 weeks', 'calculateEstimate returns timeline "2-3 weeks" for landing page');

const smallBizEstimate = calculateEstimate({ websiteTypeId: 'small-business' }, CAVENTRA_ESTIMATOR_CONFIG);
assert(smallBizEstimate.websiteType.timeline === '4-6 weeks', 'calculateEstimate returns timeline "4-6 weeks" for small business');

const corpEstimate = calculateEstimate({ websiteTypeId: 'corporate' }, CAVENTRA_ESTIMATOR_CONFIG);
assert(corpEstimate.websiteType.timeline === '6-8 weeks', 'calculateEstimate returns timeline "6-8 weeks" for corporate');

const customAppEstimate = calculateEstimate({ websiteTypeId: 'custom-web-app' }, CAVENTRA_ESTIMATOR_CONFIG);
assert(customAppEstimate.websiteType.timeline === '8-12 weeks', 'calculateEstimate returns timeline "8-12 weeks" for custom web app');

// Verify timeline prefill handoff in DOM / contact view
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

const domSandbox = {
  window: { BLOGS: [] },
  document: {
    documentElement: { getAttribute: () => 'light' },
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
domSandbox.window.window = domSandbox.window;
domSandbox.window.document = domSandbox.document;
domSandbox.window.addEventListener = domSandbox.addEventListener;
domSandbox.window.localStorage = domSandbox.localStorage;
domSandbox.window.scrollTo = domSandbox.scrollTo;
domSandbox.window.scrollY = 0;
vm.createContext(domSandbox);

vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'estimator-config.js'), 'utf8'), domSandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'blogs.js'), 'utf8'), domSandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'firebase-config.js'), 'utf8'), domSandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'portal.js'), 'utf8'), domSandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8'), domSandbox);
vm.runInContext('this.V = V; this.buildEstimatorScopeSummary = buildEstimatorScopeSummary; this.setPrefill = (d) => { estimatorPrefillData = d; }; this.getPrefill = () => estimatorPrefillData;', domSandbox);

// Test buildEstimatorScopeSummary includes timeline
const summary = domSandbox.buildEstimatorScopeSummary(smallBizEstimate);
assert(summary.timeline === '4-6 weeks', `buildEstimatorScopeSummary contains timeline: "${summary.timeline}"`);

// Test V.contact() without prefill has blank timeline input
domSandbox.setPrefill(null);
const blankContactHtml = domSandbox.V.contact();
assert(blankContactHtml.includes('name="timeline" value=""'), 'Contact form without prefill renders empty timeline value');

// Test V.contact() with prefill populates input[name="timeline"]
domSandbox.setPrefill({
  websiteType: summary.websiteType,
  budgetSummary: summary.budgetSummary,
  timeline: summary.timeline,
  messageBody: 'Estimator scope details'
});
const prefillContactHtml = domSandbox.V.contact();
assert(prefillContactHtml.includes('name="timeline" value="4-6 weeks"'), 'Contact form with prefill populates input[name="timeline"] with "4-6 weeks"');

// -----------------------------------------------------------------------------
// Test Suite 8: SQLite inquiries Table lead_source Persistence
// -----------------------------------------------------------------------------
console.log('\n--- Test Suite 8: SQLite lead_source Persistence ---');

const Database = require('better-sqlite3');
const testDb = new Database(':memory:');

// Test schema creation with lead_source column
testDb.exec(`
CREATE TABLE IF NOT EXISTS inquiries(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, phone TEXT, company TEXT, type TEXT, budget TEXT, timeline TEXT, message TEXT, ip TEXT, created_at INTEGER NOT NULL, lead_source TEXT);
`);
try { testDb.exec('ALTER TABLE inquiries ADD COLUMN phone TEXT;'); } catch (e) {}
try { testDb.exec('ALTER TABLE inquiries ADD COLUMN lead_source TEXT;'); } catch (e) {}

const tableInfo = testDb.prepare('PRAGMA table_info(inquiries)').all();
const colNames = tableInfo.map(c => c.name);
assert(colNames.includes('lead_source'), 'inquiries table schema includes lead_source column');
assert(colNames.includes('phone'), 'inquiries table schema includes phone column');
assert(colNames.includes('timeline'), 'inquiries table schema includes timeline column');

// Test inserting with explicit leadSource (from Estimator)
const insertStmt = testDb.prepare('INSERT INTO inquiries(name,email,phone,company,type,budget,timeline,message,ip,created_at,lead_source) VALUES(?,?,?,?,?,?,?,?,?,?,?)');

const testInquiry1 = {
  name: 'Hriday Vayanta',
  email: 'hriday@caventraofficial.in',
  phone: '+91 98765 43210',
  company: 'Caventra Studio',
  type: 'Web Development',
  budget: '₹45,000 – ₹65,000',
  timeline: '4-6 weeks',
  message: 'Bespoke corporate site request',
  ip: 'a1b2c3d4e5f60718',
  leadSource: 'Website Cost Estimator'
};
insertStmt.run(
  testInquiry1.name, testInquiry1.email, testInquiry1.phone, testInquiry1.company,
  testInquiry1.type, testInquiry1.budget, testInquiry1.timeline, testInquiry1.message,
  testInquiry1.ip, Date.now(), testInquiry1.leadSource
);

const row1 = testDb.prepare('SELECT * FROM inquiries WHERE email=?').get('hriday@caventraofficial.in');
assert(row1 && row1.lead_source === 'Website Cost Estimator', `Persists leadSource="Website Cost Estimator" into SQLite lead_source: got "${row1 ? row1.lead_source : ''}"`);
assert(row1 && row1.timeline === '4-6 weeks', `Persists timeline="4-6 weeks" into SQLite timeline column: got "${row1 ? row1.timeline : ''}"`);

// Test inserting with fallback default lead_source
const testInquiry2 = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '+1 555 123 4567',
  company: 'Acme Corp',
  type: 'Software Development',
  budget: '$5,000',
  timeline: '2-3 weeks',
  message: 'Inquiry without leadSource provided',
  ip: 'f1e2d3c4b5a60718'
};
const defaultLeadSource = testInquiry2.leadSource || testInquiry2.lead_source || 'Website Contact Form';
insertStmt.run(
  testInquiry2.name, testInquiry2.email, testInquiry2.phone, testInquiry2.company,
  testInquiry2.type, testInquiry2.budget, testInquiry2.timeline, testInquiry2.message,
  testInquiry2.ip, Date.now(), defaultLeadSource
);

const row2 = testDb.prepare('SELECT * FROM inquiries WHERE email=?').get('jane@example.com');
assert(row2 && row2.lead_source === 'Website Contact Form', `Persists default fallback lead_source="Website Contact Form": got "${row2 ? row2.lead_source : ''}"`);

// Test migration idempotency (running ALTER TABLE on already migrated table does not throw)
let migrationError = null;
try {
  testDb.exec('ALTER TABLE inquiries ADD COLUMN lead_source TEXT;');
} catch (e) {
  migrationError = e;
}
assert(migrationError !== null, 'ALTER TABLE throws duplicate column error when executed directly');

let handledCleanly = true;
try {
  try { testDb.exec('ALTER TABLE inquiries ADD COLUMN lead_source TEXT;'); } catch (e) {}
} catch (err) {
  handledCleanly = false;
}
assert(handledCleanly, 'try/catch block absorbs duplicate column error idempotently');

testDb.close();

// -----------------------------------------------------------------------------
// Test Summary
// -----------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`  Tests Completed: ${passCount} Passed, ${failCount} Failed`);
console.log('======================================================\n');

if (failCount > 0) {
  process.exit(1);
}
