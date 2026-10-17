'use strict';
/**
 * Test Suite: Founder Emails Visibility, Mobile Phone Field & CRM Lead Sync
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let pass = 0;
let fail = 0;
function ok(cond, msg) {
  if (cond) {
    console.log('✓ PASS:', msg);
    pass++;
  } else {
    console.error('✗ FAIL:', msg);
    fail++;
  }
}

console.log('\n======================================================');
console.log('  CAVENTRA: Founder Visibility & CRM Lead Sync Tests');
console.log('======================================================\n');

// 1. File Parity Checks
const appRoot = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const appPub = fs.readFileSync(path.join(__dirname, '..', 'public', 'app.js'), 'utf8');
ok(appRoot === appPub, 'app.js and public/app.js are 100% byte-for-byte identical');

const stylesRoot = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');
const stylesPub = fs.readFileSync(path.join(__dirname, '..', 'public', 'styles.css'), 'utf8');
ok(stylesRoot === stylesPub, 'styles.css and public/styles.css are 100% byte-for-byte identical');

const fbRoot = fs.readFileSync(path.join(__dirname, '..', 'firebase-config.js'), 'utf8');
const fbPub = fs.readFileSync(path.join(__dirname, '..', 'public', 'firebase-config.js'), 'utf8');
ok(fbRoot === fbPub, 'firebase-config.js and public/firebase-config.js are 100% byte-for-byte identical');

// 2. Visible Founder Emails & Direct Phone Lines
ok(appRoot.includes('caventraofficial@gmail.com'), 'app.js contains Hriday Vayanta email');
ok(appRoot.includes('vednimbark08@gmail.com'), 'app.js contains Ved Nimbark email');
ok(appRoot.includes('sauranahmed12345678@gmail.com'), 'app.js contains Sauranahmed Mansuri email');

ok(appRoot.includes('founder-contact-meta'), 'app.js renders .founder-contact-meta badges');
ok(appRoot.includes('+91 88667 90989'), 'app.js contains Hriday phone number');
ok(appRoot.includes('+91 88491 86747'), 'app.js contains Ved phone number');
ok(appRoot.includes('+91 79906 52097'), 'app.js contains Sauranahmed phone number');

// Check static HTML files for pre-rendered founder contact info
const foundersHtml = fs.readFileSync(path.join(__dirname, '..', 'public', 'founders', 'index.html'), 'utf8');
ok(foundersHtml.includes('caventraofficial@gmail.com') && foundersHtml.includes('vednimbark08@gmail.com') && foundersHtml.includes('sauranahmed12345678@gmail.com'), 'founders/index.html pre-renders all 3 founder emails visibly');
ok(foundersHtml.includes('founder-contact-meta'), 'founders/index.html includes founder-contact-meta');

const aboutHtml = fs.readFileSync(path.join(__dirname, '..', 'public', 'about', 'index.html'), 'utf8');
ok(aboutHtml.includes('caventraofficial@gmail.com') && aboutHtml.includes('vednimbark08@gmail.com') && aboutHtml.includes('sauranahmed12345678@gmail.com'), 'about/index.html pre-renders all 3 founder emails visibly');

// 3. Contact Form Phone Field & Validation
const contactHtml = fs.readFileSync(path.join(__dirname, '..', 'public', 'contact', 'index.html'), 'utf8');
ok(contactHtml.includes('name="phone"'), 'contact/index.html includes name="phone" input');
ok(contactHtml.includes('type="tel"'), 'contact/index.html phone input uses type="tel"');
ok(contactHtml.includes('required'), 'contact/index.html inputs have required validation');
ok(appRoot.includes('name="phone"'), 'app.js includes phone input in contact route');

// 4. CaventraStore.recordPublicLead Integration
const dummyEl = () => ({
  style: {},
  classList: { add: () => {}, remove: () => {}, contains: () => false },
  setAttribute: () => {},
  getAttribute: () => '',
  appendChild: () => {},
  removeChild: () => {},
  addEventListener: () => {},
  querySelector: () => dummyEl(),
  querySelectorAll: () => [],
  contains: () => false,
  innerHTML: '',
  textContent: '',
  src: '',
  value: ''
});

const mockStorage = {};
const mockLocalStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

const sandbox = {
  window: {},
  document: {
    documentElement: { getAttribute: () => 'dark' },
    body: dummyEl(),
    querySelector: () => dummyEl(),
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  location: { hash: '', pathname: '/', hostname: 'localhost', search: '' },
  localStorage: mockLocalStorage,
  CustomEvent: class CustomEvent {
    constructor(type, params) {
      this.type = type;
      this.detail = params ? params.detail : null;
    }
  },
  dispatchEvent: () => true,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Date: Date,
  Math: Math
};
sandbox.window = sandbox;
sandbox.global = sandbox;
sandbox.window.CustomEvent = sandbox.CustomEvent;
sandbox.window.dispatchEvent = sandbox.dispatchEvent;
vm.createContext(sandbox);

// Load firebase-config.js in sandbox
vm.runInContext(fbRoot, sandbox);

ok(typeof sandbox.CaventraStore !== 'undefined', 'CaventraStore exists in context');
ok(typeof sandbox.CaventraStore.recordPublicLead === 'function', 'CaventraStore.recordPublicLead is a function');

// Test recording a public lead
const testEnquiry = {
  name: 'Rajesh Sharma',
  email: 'rajesh@sharmatech.in',
  phone: '+91 98250 12345',
  company: 'Sharma Tech Labs',
  type: 'Web Development',
  budget: '₹1,50,000 - ₹2,00,000',
  timeline: '6 weeks',
  message: 'Need a high performance website built with custom animations and zero page builders.',
  leadSource: 'Start a Project Form'
};

const recorded = sandbox.CaventraStore.recordPublicLead(testEnquiry);
ok(recorded && recorded.id, 'recordPublicLead returns created lead with ID: ' + (recorded ? recorded.id : ''));
ok(recorded.contactName === 'Rajesh Sharma', 'Lead contactName matches');
ok(recorded.email === 'rajesh@sharmatech.in', 'Lead email matches');
ok(recorded.phone === '+91 98250 12345', 'Lead phone matches');
ok(recorded.companyName === 'Sharma Tech Labs', 'Lead companyName matches');
ok(recorded.stage === 'New', 'Lead stage initialized to New');

// Authenticate as a founder and retrieve leads
const founderUser = {
  uid: 'founder_hriday',
  email: 'caventraofficial@gmail.com',
  displayName: 'Hriday Vayanta',
  role: 'founder',
  roleLevel: 100
};

const founderLeads = sandbox.CaventraStore.getLeads(founderUser);
ok(Array.isArray(founderLeads) && founderLeads.length > 0, 'Founders can see leads in the pipeline');
const foundLead = founderLeads.find(l => l.email === 'rajesh@sharmatech.in');
ok(foundLead !== undefined, 'Founder leads pipeline contains the newly submitted public lead');
ok(foundLead && foundLead.phone === '+91 98250 12345', 'Founder can view client phone number in lead details');

console.log(`\n========================================`);
console.log(`FOUNDER & LEAD TEST SUMMARY: ${pass} Passed, ${fail} Failed`);
console.log(`========================================\n`);

if (fail > 0) process.exit(1);
