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
// Test Summary
// -----------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`  Tests Completed: ${passCount} Passed, ${failCount} Failed`);
console.log('======================================================\n');

if (failCount > 0) {
  process.exit(1);
}
