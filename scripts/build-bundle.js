#!/usr/bin/env node
'use strict';

/**
 * CAVENTRA Source Code Bundler & Distribution Pipeline
 *
 * Compiles modular source code from `src/` into root and public distribution
 * files (`app.js`, `styles.css`) ensuring 100% byte-for-byte parity for both
 * static hosting (GitHub Pages) and the full-stack Node.js server.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');

console.log('====================================================');
console.log('  CAVENTRA: Compiling Source Modules (frontend/ -> dist)');
console.log('====================================================\n');

// 1. Compile Stylesheets (frontend/styles/ -> styles.css & public/styles.css)
const styleFiles = [
  '01-base-layout.css',
  '02-layout-components.css',
  '03-blog-responsive.css',
  '04-theme-toggle.css',
  '05-ventrabot.css',
  '06-whatsapp-cta.css',
  '07-project-submission.css',
  '08-estimator.css',
  '09-services-work.css',
  '10-portal-dashboard.css',
  '11-shader.css'
];

const bundleStyles = styleFiles.map(file => {
  let filePath = path.join(ROOT, 'frontend', 'styles', file);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT, 'src', 'styles', file);
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing style module: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}).join('\n');

fs.writeFileSync(path.join(ROOT, 'styles.css'), bundleStyles);
fs.writeFileSync(path.join(PUB, 'styles.css'), bundleStyles);
console.log(`✓ Compiled styles.css (${styleFiles.length} modules, ${bundleStyles.length.toLocaleString()} bytes)`);

// 2. Compile Client JavaScript (frontend/src/ -> app.js & public/app.js)
const clientFiles = [
  'config.js',
  'modules/estimator.js',
  'modules/services.js',
  'modules/process.js',
  'modules/views-core.js',
  'modules/blog.js',
  'modules/views-support.js',
  'modules/admin.js',
  'router.js',
  'main.js'
];

const bundleClient = clientFiles.map(file => {
  let filePath = path.join(ROOT, 'frontend', 'src', file);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(ROOT, 'src', 'client', file);
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing client module: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}).join('\n');

fs.writeFileSync(path.join(ROOT, 'app.js'), bundleClient);
fs.writeFileSync(path.join(PUB, 'app.js'), bundleClient);
console.log(`✓ Compiled app.js (${clientFiles.length} modules, ${bundleClient.length.toLocaleString()} bytes)`);

// Sync theme.js to public/
if (fs.existsSync(path.join(ROOT, 'theme.js'))) {
  fs.copyFileSync(path.join(ROOT, 'theme.js'), path.join(PUB, 'theme.js'));
}

// 3. Parity Self-Verification
assert.strictEqual(
  fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8'),
  fs.readFileSync(path.join(PUB, 'styles.css'), 'utf8'),
  'styles.css root/public parity mismatch'
);
assert.strictEqual(
  fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'),
  fs.readFileSync(path.join(PUB, 'app.js'), 'utf8'),
  'app.js root/public parity mismatch'
);
console.log('✓ Verified 100% byte-for-byte parity across root and public/\n');

console.log('====================================================');
console.log('  Build Completed Successfully');
console.log('====================================================\n');
