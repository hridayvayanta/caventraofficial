// test/blog-interaction.test.js
// Test suite verifying blog interaction: Show All, Load More, Category filtering, and Search.

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
console.log('  CAVENTRA: Blog & Portfolio Interaction Test Suite');
console.log('======================================================\n');

// 1. FILE PARITY
test('File Parity: app.js and public/app.js are 100% byte-for-byte identical', () => {
  const rootApp = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
  const pubApp = fs.readFileSync(path.join(ROOT, 'public', 'app.js'), 'utf8');
  assert.strictEqual(rootApp, pubApp);
});

// Setup DOM simulation
const eventListeners = {};
const mockElements = new Map();

function createMockEl(tag = 'div', attrs = {}) {
  const el = {
    tagName: tag.toUpperCase(),
    attributes: { ...attrs },
    dataset: {},
    classList: {
      _classes: new Set((attrs.class || '').split(' ').filter(Boolean)),
      contains(c) { return this._classes.has(c); },
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      toggle(c, force) {
        if (force === undefined) {
          if (this._classes.has(c)) { this._classes.delete(c); return false; }
          this._classes.add(c); return true;
        }
        if (force) this._classes.add(c); else this._classes.delete(c);
        return force;
      }
    },
    style: {
      setProperty: () => {},
      transform: '',
      opacity: ''
    },
    id: attrs.id || '',
    innerHTML: '',
    textContent: '',
    value: attrs.value || '',
    children: [],
    getAttribute(k) { return this.attributes[k] || (k === 'id' ? this.id : null); },
    setAttribute(k, v) { this.attributes[k] = v; if (k === 'id') this.id = v; },
    closest(selector) {
      if (!selector) return null;
      const parts = selector.split(',').map(s => s.trim());
      for (const sel of parts) {
        if (sel.startsWith('#') && this.id === sel.slice(1)) return this;
        if (sel.startsWith('.') && this.classList.contains(sel.slice(1))) return this;
        if (sel.startsWith('[') && sel.endsWith(']')) {
          const attr = sel.slice(1, -1);
          if (this.attributes[attr] !== undefined || this.dataset[attr.replace(/^data-/, '')] !== undefined) return this;
        }
      }
      return null;
    },
    querySelector: () => null,
    querySelectorAll: () => []
  };

  // Populate dataset from data-* attributes
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('data-')) {
      const prop = k.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      el.dataset[prop] = v;
    }
  }

  return el;
}

const mockDoc = {
  documentElement: { getAttribute: () => 'dark' },
  body: createMockEl('body'),
  addEventListener(event, handler) {
    if (!eventListeners[event]) eventListeners[event] = [];
    eventListeners[event].push(handler);
  },
  querySelector(s) {
    if (s === '#cv') return null;
    if (s === '#app') return mockDoc.body;
    if (s === '#lk') return createMockEl('div', { id: 'lk' });
    if (s === '#sp' || s === '#fl' || s === '#cur img') return createMockEl('img');
    if (s === '#fdesc' || s === '#fsoc') return createMockEl('div');
    return createMockEl('div');
  },
  querySelectorAll() { return []; },
  getElementById(id) {
    return mockElements.get(id) || null;
  }
};

const sandbox = {
  window: { BLOGS: [] },
  document: mockDoc,
  location: { pathname: '/blog/', hash: '', search: '' },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  scrollY: 100,
  innerWidth: 1200,
  innerHeight: 800,
  scrollTo: (x, y) => { sandbox.scrollY = y; },
  addEventListener: (event, handler) => {
    if (!eventListeners[event]) eventListeners[event] = [];
    eventListeners[event].push(handler);
  },
  setTimeout: () => {},
  clearTimeout: () => {},
  requestAnimationFrame: () => {},
  cancelAnimationFrame: () => {},
  matchMedia: () => ({ matches: false }),
  IntersectionObserver: class { observe() {} unobserve() {} },
  fetch: () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }),
  console,
  Math,
  Date
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;
sandbox.window.addEventListener = sandbox.addEventListener;
sandbox.window.scrollTo = sandbox.scrollTo;
sandbox.window.scrollY = sandbox.scrollY;

vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'estimator-config.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'blogs.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'), sandbox);
vm.runInContext('this.V = V; this.getB = getB; Object.defineProperty(this, "blogShowAll", { get: () => blogShowAll, set: v => blogShowAll = v, configurable: true }); Object.defineProperty(this, "blogFilter", { get: () => blogFilter, set: v => blogFilter = v, configurable: true }); Object.defineProperty(this, "blogPage", { get: () => blogPage, set: v => blogPage = v, configurable: true }); Object.defineProperty(this, "workFilter", { get: () => workFilter, set: v => workFilter = v, configurable: true }); Object.defineProperty(this, "blogQuery", { get: () => blogQuery, set: v => blogQuery = v, configurable: true });', sandbox);

// 2. BLOG LISTING INITIAL STATE
test('Initial Blog State: 62 articles loaded, initial visible count is 24, hasMore is true', () => {
  const blogs = sandbox.getB();
  assert.strictEqual(blogs.length, 62, 'Expected 62 articles in window.BLOGS');
  
  const initialHtml = sandbox.V.blog();
  assert.ok(initialHtml.includes('Showing 24 of 62 articles'), 'Must show initial 24 of 62');
  assert.ok(initialHtml.includes('id="b-showall"'), 'Must render bottom Show All button');
  assert.ok(initialHtml.includes('id="b-showall-top"'), 'Must render top Show All button');
  assert.ok(initialHtml.includes('id="b-more"'), 'Must render Load More button');
});

// 3. SHOW ALL BUTTON CLICK SIMULATION
test('Clicking #b-showall sets blogShowAll=true and renders all 62 articles', () => {
  const clickHandlers = eventListeners['click'] || [];
  assert.ok(clickHandlers.length > 0, 'Must register click handler');

  const bottomBtn = createMockEl('button', { id: 'b-showall', class: 'btn b-showall-btn' });
  const fakeEvent = { target: bottomBtn };

  // Trigger click on #b-showall
  for (const handler of clickHandlers) {
    handler(fakeEvent);
  }

  assert.strictEqual(sandbox.blogShowAll, true, 'blogShowAll must be set to true');
  const allHtml = sandbox.V.blog();
  assert.ok(allHtml.includes('Showing 62 of 62 articles'), 'Must show all 62 of 62 articles');
  assert.ok(!allHtml.includes('id="b-more"'), 'Load More button must disappear');
  assert.ok(!allHtml.includes('id="b-showall-top"'), 'Top Show All button must disappear');
  // Check count of articles rendered
  const cardCount = (allHtml.match(/class="b-card"/g) || []).length;
  assert.strictEqual(cardCount, 62, 'Must render exactly 62 b-card elements');
});

// 4. CATEGORY FILTER CLICK
test('Clicking category button resets blogShowAll and filters articles', () => {
  const clickHandlers = eventListeners['click'] || [];
  const pricingCatBtn = createMockEl('button', { 'data-bcat': 'Pricing & Strategy' });
  const fakeEvent = { target: pricingCatBtn };

  for (const handler of clickHandlers) {
    handler(fakeEvent);
  }

  assert.strictEqual(sandbox.blogFilter, 'Pricing & Strategy');
  assert.strictEqual(sandbox.blogShowAll, false);
  assert.strictEqual(sandbox.blogPage, 1);

  const filteredHtml = sandbox.V.blog();
  assert.ok(filteredHtml.includes('Showing 5 of 5 articles'));
  const cardCount = (filteredHtml.match(/class="b-card"/g) || []).length;
  assert.strictEqual(cardCount, 5);
});

// 5. LOAD MORE BUTTON
test('Clicking #b-more increments blogPage and loads remaining articles', () => {
  // Reset filter to All
  sandbox.blogFilter = 'All';
  sandbox.blogPage = 1;
  sandbox.blogShowAll = false;

  const clickHandlers = eventListeners['click'] || [];
  const moreBtn = createMockEl('button', { id: 'b-more', class: 'btn solid' });
  const fakeEvent = { target: moreBtn };

  for (const handler of clickHandlers) {
    handler(fakeEvent);
  }

  assert.strictEqual(sandbox.blogPage, 2);
  const page2Html = sandbox.V.blog();
  assert.ok(page2Html.includes('Showing 48 of 62 articles'));
  const cardCount = (page2Html.match(/class="b-card"/g) || []).length;
  assert.strictEqual(cardCount, 48);

  // Click #b-more once more to reach page 3 (all 62)
  for (const handler of clickHandlers) {
    handler(fakeEvent);
  }
  assert.strictEqual(sandbox.blogPage, 3);
  const page3Html = sandbox.V.blog();
  assert.ok(page3Html.includes('Showing 62 of 62 articles'));
  const cardCount3 = (page3Html.match(/class="b-card"/g) || []).length;
  assert.strictEqual(cardCount3, 62);
});

// 6. WORK CATEGORY FILTER
test('Clicking [data-wcat] updates workFilter and does not error', () => {
  const clickHandlers = eventListeners['click'] || [];
  const workCatBtn = createMockEl('button', { 'data-wcat': 'Web Development' });
  const fakeEvent = { target: workCatBtn };

  for (const handler of clickHandlers) {
    handler(fakeEvent);
  }

  assert.strictEqual(sandbox.workFilter, 'Web Development');
});

// 7. TOP SHOW ALL BUTTON CLICK
test('Clicking top #b-showall-top button sets blogShowAll=true and renders all 62 articles', () => {
  sandbox.blogFilter = 'All';
  sandbox.blogPage = 1;
  sandbox.blogShowAll = false;

  const clickHandlers = eventListeners['click'] || [];
  const topBtn = createMockEl('button', { id: 'b-showall-top', class: 'btn sm b-showall-btn' });
  const fakeEvent = { target: topBtn };

  for (const handler of clickHandlers) {
    handler(fakeEvent);
  }

  assert.strictEqual(sandbox.blogShowAll, true);
  const allHtml = sandbox.V.blog();
  assert.ok(allHtml.includes('Showing 62 of 62 articles'));
  const cardCount = (allHtml.match(/class="b-card"/g) || []).length;
  assert.strictEqual(cardCount, 62);
});

// 8. SEARCH INPUT EVENT
test('Typing in #b-search updates blogQuery and filters articles dynamically', () => {
  const inputHandlers = eventListeners['input'] || [];
  assert.ok(inputHandlers.length > 0, 'Must register input handler');

  const gridEl = createMockEl('div', { id: 'bg-grid' });
  const countEl = createMockEl('p', { id: 'b-count' });
  const pagEl = createMockEl('div', { id: 'b-pagination' });
  const topWrap = createMockEl('div', { id: 'b-top-showall-wrap' });

  mockElements.set('bg-grid', gridEl);
  mockElements.set('b-count', countEl);
  mockElements.set('b-pagination', pagEl);
  mockElements.set('b-top-showall-wrap', topWrap);

  const searchInput = createMockEl('input', { id: 'b-search', value: 'dental' });
  const fakeEvent = { target: searchInput };

  for (const handler of inputHandlers) {
    handler(fakeEvent);
  }

  assert.strictEqual(sandbox.blogQuery, 'dental');
  assert.ok(countEl.textContent.includes('Showing 2 of 2 articles'));
  assert.ok(gridEl.innerHTML.includes('dental-website-not-getting-patients'));
  assert.ok(gridEl.innerHTML.includes('dentist-website-design'));
});

console.log('\n========================================');
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('========================================\n');

if (failed > 0) process.exit(1);
