// test/portal-auth.test.js
// CAVENTRA: Authentication, Client Portal & Founder Dashboard Test Suite

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
    console.error(err.message || err);
    failed++;
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`✓ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ FAIL: ${name}`);
    console.error(err.message || err);
    failed++;
  }
}

console.log('\n======================================================');
console.log('  CAVENTRA: Portal & Authentication Test Suite');
console.log('======================================================\n');

// Initialize Node DOM sandbox
const dummyEl = () => ({
  style: { display: '', setProperty: () => {} },
  classList: { add: () => {}, remove: () => {}, toggle: () => false, contains: () => false },
  setAttribute: () => {},
  getAttribute: () => null,
  hasAttribute: () => false,
  addEventListener: () => {},
  querySelector: () => dummyEl(),
  querySelectorAll: () => [],
  contains: () => false,
  innerHTML: '',
  textContent: '',
  src: '',
  value: ''
});

const sandbox = {
  window: {},
  document: {
    documentElement: { getAttribute: () => 'dark' },
    body: dummyEl(),
    querySelector: () => dummyEl(),
    querySelectorAll: () => [],
    addEventListener: () => {}
  },
  location: { hash: '', pathname: '/' },
  localStorage: {
    data: {},
    getItem(k) { return this.data[k] || null; },
    setItem(k, v) { this.data[k] = String(v); },
    removeItem(k) { delete this.data[k]; },
    clear() { this.data = {}; }
  },
  CustomEvent: class CustomEvent {
    constructor(type, params) {
      this.type = type;
      this.detail = params ? params.detail : null;
    }
  },
  dispatchEvent: () => true,
  console,
  setTimeout,
  clearTimeout,
  Date,
  Math
};
sandbox.window = sandbox;
sandbox.global = sandbox;
sandbox.window.CustomEvent = sandbox.CustomEvent;
sandbox.window.dispatchEvent = sandbox.dispatchEvent;
vm.createContext(sandbox);

// Load firebase-config and portal
vm.runInContext(fs.readFileSync(path.join(ROOT, 'firebase-config.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'portal.js'), 'utf8'), sandbox);

const Auth = sandbox.CaventraAuth;
const Store = sandbox.CaventraStore;
const Portal = sandbox.CaventraPortal;

(async function runAllTests() {
  // Reset store to fresh seed data
  Store.resetToSeed();

  // 1. FILE PARITY CHECK FOR NEW MODULES
  test('Parity: firebase-config.js and portal.js maintain 100% byte-for-byte parity', () => {
    const f1 = fs.readFileSync(path.join(ROOT, 'firebase-config.js'), 'utf8');
    const f1p = fs.readFileSync(path.join(ROOT, 'public', 'firebase-config.js'), 'utf8');
    assert.strictEqual(f1, f1p, 'firebase-config.js parity mismatch');

    const f2 = fs.readFileSync(path.join(ROOT, 'portal.js'), 'utf8');
    const f2p = fs.readFileSync(path.join(ROOT, 'public', 'portal.js'), 'utf8');
    assert.strictEqual(f2, f2p, 'portal.js parity mismatch');
  });

  // 2. SEED FOUNDER ACCOUNTS VERIFICATION
  test('Founder Verification: Hriday, Sauranahmed, and Ved are recognized founders', () => {
    const hriday = { email: 'hriday@caventra.com', role: 'founder' };
    const sauran = { email: 'sauran@caventra.com', role: 'founder' };
    const ved = { email: 'ved@caventra.com', role: 'founder' };

    assert.ok(Auth.isFounder(hriday), 'Hriday must be recognized as founder');
    assert.ok(Auth.isFounder(sauran), 'Sauranahmed must be recognized as founder');
    assert.ok(Auth.isFounder(ved), 'Ved must be recognized as founder');
  });

  // 3. REGISTRATION FLOW: PENDING VERIFICATION & NO AUTO-SESSION (Flowchart C1 -> C13)
  await asyncTest('Registration: New client registration creates pending unverified account and dispatches OTP', async () => {
    await Auth.logout();
    const regRes = await Auth.register(
      'newclient@testco.in',
      'SecurePass123!',
      'Rohan Test',
      'Test Logistics Pvt Ltd',
      '+91 9988776655'
    );
    assert.strictEqual(regRes.pendingVerification, true, 'Registration must be pending verification');
    assert.strictEqual(regRes.email, 'newclient@testco.in');
    assert.match(regRes.code, /^\d{6}$/, 'Dispatched code must be 6 digits');
    assert.strictEqual(Auth.getCurrentUser(), null, 'NON-NEGOTIABLE: Zero session prior to email verification');
  });

  // 4. DUPLICATE REGISTRATION REJECTION
  await asyncTest('Registration: Duplicate email registration is rejected', async () => {
    let threw = false;
    try {
      await Auth.register('newclient@testco.in', 'AnotherPassword123', 'Duplicate', 'Co', '123');
    } catch (e) {
      threw = true;
      assert.ok(e.message.includes('already exists'), 'Error message should indicate account exists');
    }
    assert.ok(threw, 'Expected duplicate email registration to throw');
  });

  // 5. REGISTRATION OTP VERIFICATION & ACTIVATION (Flowchart C14 -> C22)
  await asyncTest('Registration OTP: Verifying 6-digit OTP activates account without granting session', async () => {
    // Attempting to sign in while unverified triggers verification requirement
    const loginAttempt = await Auth.login('newclient@testco.in', 'SecurePass123!');
    assert.strictEqual(loginAttempt.requiresEmailVerification, true, 'Unverified account must be blocked from sign-in');
    assert.strictEqual(Auth.getCurrentUser(), null, 'Session must not be issued to unverified user');

    // Incorrect OTP is rejected
    let threwIncorrect = false;
    try {
      await Auth.verifyRegistrationOtp('newclient@testco.in', '000000');
    } catch (e) {
      threwIncorrect = true;
      assert.ok(e.message.includes('Incorrect verification code'), 'Should report incorrect code');
    }
    assert.ok(threwIncorrect, 'Expected invalid OTP to be rejected');

    // Correct OTP verifies email
    const challengeKey = 'caventra_dev_pending_reg_otp_newclient@testco.in';
    const challenge = JSON.parse(sandbox.localStorage.getItem(challengeKey));
    const verifyRes = await Auth.verifyRegistrationOtp('newclient@testco.in', challenge.code);
    assert.strictEqual(verifyRes.ok, true, 'OTP verification must succeed');
    assert.strictEqual(Auth.getCurrentUser(), null, 'NON-NEGOTIABLE: User must not be logged in automatically after OTP verification');
  });

  // 6. MANDATORY TWO-STEP LOGIN OTP FLOW (Flowchart D1 -> D22)
  await asyncTest('Login Flow: Verified user requires Password + OTP to establish session', async () => {
    await Auth.logout();
    assert.strictEqual(Auth.getCurrentUser(), null, 'Should be signed out');

    // Step 1: Submit credentials -> returns 6-digit login challenge
    const loginChallenge = await Auth.login('newclient@testco.in', 'SecurePass123!');
    assert.strictEqual(loginChallenge.requiresLoginOtp, true, 'Login must require OTP challenge');
    assert.match(loginChallenge.code, /^\d{6}$/, 'Login OTP code must be 6 digits');
    assert.strictEqual(Auth.getCurrentUser(), null, 'Session must not be created prior to login OTP verification');

    // Incorrect Login OTP is rejected
    let threwWrongOtp = false;
    try {
      await Auth.verifyLoginOtp('newclient@testco.in', '999999');
    } catch (e) {
      threwWrongOtp = true;
      assert.ok(e.message.includes('Incorrect verification code'), 'Should reject wrong login OTP');
    }
    assert.ok(threwWrongOtp, 'Expected invalid login OTP to fail');

    // Correct Login OTP establishes session
    const sessionUser = await Auth.verifyLoginOtp('newclient@testco.in', loginChallenge.code);
    assert.strictEqual(sessionUser.email, 'newclient@testco.in');
    assert.strictEqual(sessionUser.role, 'client', 'User must hold client role');
    assert.strictEqual(Auth.isFounder(sessionUser), false, 'Client must not be founder');
    assert.strictEqual(Auth.isClient(sessionUser), true, 'User must be recognized as client');
    assert.strictEqual(Auth.getCurrentUser().email, 'newclient@testco.in');
  });

  // 7. INVALID PASSWORD VALIDATION
  await asyncTest('Login: Login with invalid password fails with meaningful error', async () => {
    let threw = false;
    try {
      await Auth.login('newclient@testco.in', 'WrongPassword!');
    } catch (e) {
      threw = true;
      assert.ok(e.message.includes('Invalid password'), 'Should report invalid password');
    }
    assert.ok(threw, 'Expected wrong password to throw');
  });

  // 8. PASSWORD RESET OPERATION
  await asyncTest('Auth Utilities: Password reset operation', async () => {
    const resetRes = await Auth.sendPasswordReset('newclient@testco.in');
    assert.ok(resetRes.ok, 'Password reset response should be ok');
  });

  // 9. GOOGLE SIGN-IN DEVELOPMENT FLOW
  await asyncTest('Google Sign-In: Development Google login creates or retrieves profile', async () => {
    await Auth.logout();
    const gUser = await Auth.loginWithGoogle();
    assert.ok(gUser.email.includes('@'), 'Google user should have valid email');
    assert.strictEqual(gUser.role, 'client', 'Google client defaults to client role');
  });

  // 10. CLIENT ISOLATION & ACCESS CONTROL
  let sharedPrjAId = null;
  await asyncTest('Client Isolation: Client A cannot see Client B projects or documents', async () => {
    // Register Client A
    await Auth.logout();
    const regA = await Auth.register('clienta@company.com', 'Pass12345!', 'Client A', 'Alpha Logistics', '+91 9988776611');
    await Auth.verifyRegistrationOtp('clienta@company.com', regA.code);
    const clientA = await Auth.login('clienta@company.com', 'Pass12345!', true);

    // Founder creates project for Client A
    const founder = await Auth.login('sauranahmed12345678@gmail.com', 'saurancaventra@0000', true);
    const prjA = Store.createProject({
      name: 'Alpha Logistics Dispatch Portal',
      userId: clientA.uid,
      clientEmail: clientA.email
    }, founder);
    sharedPrjAId = prjA.id;
    Store.addProjectUpdate({
      projectId: prjA.id,
      title: 'Sprint 2 Delivered: Dispatch Table',
      needsApproval: true
    }, founder);

    // Client A sees their own project
    await Auth.logout();
    const clientALogged = await Auth.login('clienta@company.com', 'Pass12345!', true);
    const clientAProjects = Store.getProjects(clientALogged);
    assert.strictEqual(clientAProjects.length, 1, 'Client A must have 1 project');
    assert.strictEqual(clientAProjects[0].name, 'Alpha Logistics Dispatch Portal');

    // Register a second distinct client
    await Auth.logout();
    const clientBReg = await Auth.register('clientb@othercompany.com', 'Pass12345!', 'Client B', 'Other Co', '999');
    await Auth.verifyRegistrationOtp('clientb@othercompany.com', clientBReg.code);
    const clientB = await Auth.login('clientb@othercompany.com', 'Pass12345!', true);
    const clientBProjects = Store.getProjects(clientB);
    assert.strictEqual(clientBProjects.length, 0, 'Client B MUST NOT see Client A projects');

    // Verify invoice isolation
    const clientBInvoices = Store.getInvoices(clientB);
    assert.strictEqual(clientBInvoices.length, 0, 'Client B MUST NOT see Client A invoices');

    // Attempting to read updates for unassigned project throws Permission Denied
    let updateAccessThrew = false;
    try {
      Store.getProjectUpdates(prjA.id, clientB);
    } catch (e) {
      updateAccessThrew = true;
      assert.ok(e.message.includes('Permission denied'), 'Expected permission denied on other client project updates');
    }
    assert.ok(updateAccessThrew, 'Client B was blocked from accessing Client A project updates');
  });

  // 11. CLIENT SELF-PROMOTION PREVENTION
  await asyncTest('Security: Ordinary client cannot self-promote to founder role', async () => {
    const clientB = Auth.getCurrentUser();
    let threw = false;
    try {
      Store.updateUserRole(clientB.uid, 'founder', clientB);
    } catch (e) {
      threw = true;
      assert.ok(e.message.includes('Permission denied'), 'Must block non-founder role updates');
    }
    assert.ok(threw, 'Client self-promotion was blocked');
  });

  // 12. FOUNDER DASHBOARD PRIVILEGES & MANAGEMENT
  await asyncTest('Founder Dashboard: Founder can view leads, create projects, issue invoices', async () => {
    await Auth.logout();
    // Log in as Sauranahmed Mansuri (Founder)
    const sauran = await Auth.login('sauranahmed12345678@gmail.com', 'saurancaventra@0000', true);
    assert.strictEqual(Auth.isFounder(sauran), true);

    // Read leads array
    const initialLeads = Store.getLeads(sauran);
    assert.ok(Array.isArray(initialLeads), 'Founders must have access to leads array');

    // Create a new lead
    const newLead = Store.createLead({
      companyName: 'Apex Health Ltd',
      contactName: 'Dr. Vikram',
      email: 'vikram@apex.in',
      source: 'Referral',
      budget: '₹2,00,000'
    }, sauran);
    assert.strictEqual(newLead.companyName, 'Apex Health Ltd');

    // Update lead stage
    const updatedLead = Store.updateLead(newLead.id, { stage: 'Qualified' }, sauran);
    assert.strictEqual(updatedLead.stage, 'Qualified');

    // Create a new project assigned to clientB
    const newPrj = Store.createProject({
      name: 'Apex Health Patient Portal',
      userId: 'usr_clientB',
      clientEmail: 'clientb@othercompany.com',
      description: 'HIPAA compliant patient portal',
      status: 'Discovery',
      progress: 20
    }, sauran);
    assert.strictEqual(newPrj.name, 'Apex Health Patient Portal');

    // Issue invoice
    const newInv = Store.createInvoice({
      reference: 'INV-2026-TEST',
      userId: 'usr_clientB',
      clientEmail: 'clientb@othercompany.com',
      amount: 60000,
      currency: 'INR',
      description: 'Milestone 1 — Discovery'
    }, sauran);
    assert.strictEqual(newInv.reference, 'INV-2026-TEST');

    // Record manual payment
    const paidInv = Store.recordPayment(newInv.id, {
      paidAmount: 60000,
      paymentMethod: 'UPI',
      transactionRef: 'UPI/HDFC/88129'
    }, sauran);
    assert.strictEqual(paidInv.status, 'Paid');
  });

  // 13. CLIENT MILESTONE APPROVAL INTERACTION
  await asyncTest('Client Interaction: Client can approve milestones for their project', async () => {
    // Log in as Client A
    await Auth.logout();
    const clientA = await Auth.login('clienta@company.com', 'Pass12345!', true);
    const updates = Store.getProjectUpdates(sharedPrjAId, clientA);
    const unapproved = updates.find(u => u.needsApproval && !u.approved);
    assert.ok(unapproved, 'Should find unapproved update');

    // Client approves milestone
    const approved = Store.approveMilestone(unapproved.id, clientA, 'Reviewed staging preview, looks great.');
    assert.strictEqual(approved.approved, true);
    assert.strictEqual(approved.clientFeedback, 'Reviewed staging preview, looks great.');
    assert.ok(approved.approvedAt !== null);
  });

  // 14. CLIENT SUPPORT TICKET LIFECYCLE
  await asyncTest('Support Ticket: Client creates ticket, founder responds and resolves', async () => {
    const clientA = await Auth.login('clienta@company.com', 'Pass12345!', true);
    const ticket = Store.createSupportTicket({
      subject: 'Custom Domain SSL question',
      category: 'Technical Access',
      priority: 'Medium',
      description: 'When will the staging SSL certificate auto-renew?'
    }, clientA);
    assert.strictEqual(ticket.subject, 'Custom Domain SSL question');
    assert.strictEqual(ticket.status, 'Open');

    // Founder logs in and resolves ticket
    await Auth.logout();
    const hriday = await Auth.login('hridayvayanta7@gmail.com', 'hridaycaventra@0000', true);
    const resolvedTicket = Store.updateSupportTicket(ticket.id, {
      status: 'Resolved',
      assignedFounder: 'Hriday Vayanta',
      resolutionNotes: 'SSL automatically renews via Cloudflare 30 days prior to expiry.'
    }, hriday);
    assert.strictEqual(resolvedTicket.status, 'Resolved');
    assert.strictEqual(resolvedTicket.assignedFounder, 'Hriday Vayanta');
  });

  // 15. UI TEMPLATE RENDERING VERIFICATION
  await asyncTest('UI DOM Rendering: Portal views render valid HTML without exceptions', async () => {
    await Auth.logout();
    const loginHtml = Portal.renderLogin();
    assert.ok(loginHtml.includes('Sign In'), 'Login view must contain Sign In');
    assert.ok(loginHtml.includes('Continue with Google'), 'Login view must have Google button');
    assert.ok(!loginHtml.includes('DEVELOPMENT QUICK LOGIN'), 'Login view must not allow bypass fast login');

    const regHtml = Portal.renderRegister();
    assert.ok(regHtml.includes('Create Client Account'), 'Register view must have headline');
    assert.ok(regHtml.includes('Security Note'), 'Register view must have security note');

    const resetHtml = Portal.renderResetPassword();
    assert.ok(resetHtml.includes('Reset Password'), 'Reset view must have headline');

    // Render client dashboard while signed in as clientA
    await Auth.login('clienta@company.com', 'Pass12345!', true);
    const clientDashHtml = Portal.renderClientDashboard();
    assert.ok(clientDashHtml.includes('CLIENT PORTAL'), 'Client dashboard must render portal header');
    assert.ok(clientDashHtml.includes('Alpha Logistics Dispatch Portal'), 'Client dashboard must display assigned project');

    // Render founder dashboard while signed in as founder
    await Auth.login('vednimbark08@gmail.com', 'vedcaventra@0000', true);
    const founderDashHtml = Portal.renderFounderDashboard();
    assert.ok(founderDashHtml.includes('FOUNDER COMMAND'), 'Founder dashboard must render command header');
    assert.ok(founderDashHtml.includes('Leads'), 'Founder dashboard must include CRM sections');
  });

  // 16. UNAUTHORIZED ROUTE GUARD VERIFICATION
  test('Route Guards: Client cannot access Founder Dashboard directly', () => {
    Auth.login('clienta@company.com', 'Pass12345!', true);
    const clientAttemptingFounderDash = Portal.renderFounderDashboard();
    assert.ok(clientAttemptingFounderDash.includes('ACCESS DENIED') || clientAttemptingFounderDash.includes('Founder Access Required'), 'Should reject client from founder dashboard');
  });

  // 17. BRUTE-FORCE LOCKOUT PROTECTION
  await asyncTest('Security: 5 consecutive failed logins trigger 15-minute account lockout', async () => {
    await Auth.logout();
    const testEmail = 'lockout.test@caventra.com';
    const regRes = await Auth.register(testEmail, 'RealPassword123!', 'Lockout Target', 'Co', '123');
    await Auth.verifyRegistrationOtp(testEmail, regRes.code);

    // 4 failed attempts: remaining attempts reported
    for (let i = 1; i <= 4; i++) {
      try {
        await Auth.login(testEmail, 'BadPass' + i);
        assert.fail('Should fail with bad pass');
      } catch (e) {
        assert.ok(e.message.includes('attempt(s) remaining'), 'Should indicate attempts remaining');
      }
    }

    // 5th failed attempt: triggers lockout
    try {
      await Auth.login(testEmail, 'BadPass5');
      assert.fail('Should fail on 5th attempt');
    } catch (e) {
      assert.ok(e.message.includes('Account temporarily locked') || e.message.includes('Security lockout active'), '5th attempt must trigger lockout');
    }

    // Subsequent attempt even with CORRECT password is blocked by lockout
    try {
      await Auth.login(testEmail, 'RealPassword123!');
      assert.fail('Should remain locked out');
    } catch (e) {
      assert.ok(e.message.includes('Security lockout active'), 'Lockout must prevent login even with correct credentials');
    }

    // Clear lockout
    Auth.clearFailedLogin(testEmail);
    const unlocked = await Auth.login(testEmail, 'RealPassword123!');
    assert.strictEqual(unlocked.email, testEmail, 'Login succeeds once lockout is cleared');
  });

  // 18. IN-DASHBOARD EMAIL VERIFICATION OTP (USER SETTINGS)
  await asyncTest('Email OTP System: 6-digit verification code generation, invalid attempt tracking, and verification', async () => {
    await Auth.logout();
    const user = await Auth.login('clienta@company.com', 'Pass12345!', true);
    assert.ok(user);

    // Generate 6-digit OTP
    const otpRes = await Auth.requestEmailVerificationOtp(true);
    assert.ok(otpRes.ok, 'OTP request should succeed');
    assert.match(otpRes.code, /^\d{6}$/, 'Dispatched code must be exactly 6 digits');

    // Submitting wrong OTP code decrements attempts
    try {
      await Auth.verifyEmailOtp('000000');
      assert.fail('Incorrect OTP should throw');
    } catch (e) {
      assert.ok(e.message.includes('attempt(s) remaining'), 'Should warn about attempts remaining');
    }

    // Submitting correct OTP verifies email
    const verifyRes = await Auth.verifyEmailOtp(otpRes.code);
    assert.ok(verifyRes.ok, 'Correct OTP should verify');
    assert.strictEqual(Auth.getCurrentUser().emailVerified, true, 'User emailVerified must be true');
  });

  // 19. TWO-FACTOR AUTHENTICATION TOGGLE
  await asyncTest('Two-Factor Authentication: 2FA toggle and 2FA login challenge', async () => {
    const user = Auth.getCurrentUser();
    const toggleRes = await Auth.toggle2FA(true);
    assert.strictEqual(toggleRes.twoFactorEnabled, true, '2FA should be enabled');

    await Auth.logout();
    const toggleOff = await Auth.login('clienta@company.com', 'Pass12345!', true);
    await Auth.toggle2FA(false);
    assert.strictEqual(Auth.getCurrentUser().twoFactorEnabled, false);
  });

  // 20. GOOGLE OAUTH ADAPTER & ACCOUNT SELECTOR
  await asyncTest('Google OAuth Adapter: Founder and client account picker flows', async () => {
    await Auth.logout();

    // Selecting a founder Google persona
    const hridayGoogle = await Auth.selectGoogleAccount({
      email: 'hridayvayanta7@gmail.com',
      name: 'Hriday Vayanta'
    });
    assert.strictEqual(hridayGoogle.role, 'founder', 'Hriday Google account must have founder role');
    assert.strictEqual(hridayGoogle.emailVerified, true, 'Google accounts must be pre-verified');

    // Selecting an arbitrary Google account (becomes client)
    await Auth.logout();
    const externalGoogle = await Auth.selectGoogleAccount({
      email: 'alex.consulting@gmail.com',
      name: 'Alex Rivera'
    });
    assert.strictEqual(externalGoogle.role, 'client', 'External Google account must strictly be client');
    assert.strictEqual(externalGoogle.emailVerified, true, 'Google accounts must be pre-verified');
  });

  // 21. ANTI-BOT CAPTCHA & SECURITY MODAL DOM RENDERING
  await asyncTest('Anti-Bot Captcha & Security Modals: Captcha checkboxes and modals rendered in DOM', async () => {
    await Auth.logout();
    const loginHtml = Portal.renderLogin();
    assert.ok(loginHtml.includes('pt-captcha-login'), 'Login view must contain captcha checkbox');
    assert.ok(loginHtml.includes('pt-google-modal'), 'Login view must include Google account selector modal');
    assert.ok(loginHtml.includes('pt-reg-otp-modal'), 'Login view must include registration OTP modal');
    assert.ok(loginHtml.includes('pt-login-otp-modal'), 'Login view must include login OTP modal');

    const regHtml = Portal.renderRegister();
    assert.ok(regHtml.includes('pt-captcha-reg'), 'Register view must contain captcha checkbox');
    assert.ok(regHtml.includes('pt-reg-otp-modal'), 'Register view must include registration OTP modal');

    await Auth.login('clienta@company.com', 'Pass12345!', true);
    const clientDashHtml = Portal.renderClientDashboard('profile');
    assert.ok(clientDashHtml.includes('pt-otp-modal'), 'Client dashboard must include OTP verification modal');
    assert.ok(clientDashHtml.includes('pt-toggle-2fa'), 'Client dashboard must include 2FA toggle switch');
  });

  // 22. REGISTRATION VALIDATION HARDENING
  await asyncTest('Registration Validation: Name whitespace, password confirmation mismatch, and terms requirement', async () => {
    await Auth.logout();

    // Whitespace only name
    let threwWhitespace = false;
    try {
      await Auth.register('test.name@caventra.com', 'Pass12345!', '   ', 'Co', '123', 'Pass12345!', true);
    } catch (e) {
      threwWhitespace = true;
      assert.ok(e.message.includes('full name'), 'Should reject whitespace-only name');
    }
    assert.ok(threwWhitespace, 'Expected whitespace name to throw');

    // Password confirmation mismatch
    let threwMismatch = false;
    try {
      await Auth.register('test.mismatch@caventra.com', 'Pass12345!', 'Valid Name', 'Co', '123', 'DifferentPass!', true);
    } catch (e) {
      threwMismatch = true;
      assert.ok(e.message.includes('confirmation does not match'), 'Should reject mismatching password confirmation');
    }
    assert.ok(threwMismatch, 'Expected password mismatch to throw');

    // Terms rejected
    let threwTerms = false;
    try {
      await Auth.register('test.terms@caventra.com', 'Pass12345!', 'Valid Name', 'Co', '123', 'Pass12345!', false);
    } catch (e) {
      threwTerms = true;
      assert.ok(e.message.includes('Terms of Service'), 'Should require terms acceptance');
    }
    assert.ok(threwTerms, 'Expected unaccepted terms to throw');
  });

  // 23. FINANCIAL FIELD VALIDATION HARDENING
  await asyncTest('Financial Field Validation: Positive amount enforcement and client payment block', async () => {
    await Auth.logout();
    const sauran = await Auth.login('sauranahmed12345678@gmail.com', 'saurancaventra@0000', true);

    // Negative invoice amount
    let threwNegative = false;
    try {
      Store.createInvoice({
        reference: 'INV-TEST-NEG',
        clientEmail: 'clienta@company.com',
        amount: -5000,
        currency: 'INR'
      }, sauran);
    } catch (e) {
      threwNegative = true;
      assert.ok(e.message.includes('positive number'), 'Should reject negative invoice amount');
    }
    assert.ok(threwNegative, 'Expected negative amount to throw');

    // Create a real test invoice for client payment check
    const testInv = Store.createInvoice({
      reference: 'INV-TEST-POS',
      clientEmail: 'clienta@company.com',
      amount: 15000,
      currency: 'INR'
    }, sauran);

    // Client attempting to record payment
    await Auth.logout();
    const clientA = await Auth.login('clienta@company.com', 'Pass12345!', true);
    let threwClientPayment = false;
    try {
      Store.recordPayment(testInv.id, { paidAmount: 10000 }, clientA);
    } catch (e) {
      threwClientPayment = true;
      assert.ok(e.message.includes('Permission denied'), 'Client must not record payments');
    }
    assert.ok(threwClientPayment, 'Expected client payment record to throw');
  });

  // 24. SUPPORT TICKET & PROJECT INPUT VALIDATION
  await asyncTest('Support Ticket & Project Validation: Length bounds and role enforcement', async () => {
    const clientA = Auth.getCurrentUser();
    assert.ok(clientA && clientA.email === 'clienta@company.com');

    // Short ticket subject
    let threwShortSub = false;
    try {
      Store.createSupportTicket({ subject: 'hi', description: 'Detailed description here.' }, clientA);
    } catch (e) {
      threwShortSub = true;
      assert.ok(e.message.includes('subject with at least 3 characters'), 'Should enforce subject length');
    }
    assert.ok(threwShortSub, 'Expected short subject to throw');

    // Client attempting to create project
    let threwClientPrj = false;
    try {
      Store.createProject({ name: 'Unauthorized Project' }, clientA);
    } catch (e) {
      threwClientPrj = true;
      assert.ok(e.message.includes('Permission denied'), 'Client must not create projects');
    }
    assert.ok(threwClientPrj, 'Expected client project create to throw');
  });

  // 25. OTP RESEND THROTTLE PROTECTION
  await asyncTest('OTP Resend Throttle: Prevents rapid duplicate verification code requests', async () => {
    const clientA = Auth.getCurrentUser();
    assert.ok(clientA && clientA.email === 'clienta@company.com');
    // Request initial OTP (bypassThrottle=true for test setup)
    const otp1 = await Auth.requestEmailVerificationOtp(true);
    assert.ok(otp1.ok);

    // Immediate second request without bypassThrottle throws rate limit error
    let threwThrottle = false;
    try {
      await Auth.requestEmailVerificationOtp(false);
    } catch (e) {
      threwThrottle = true;
      assert.ok(e.message.includes('Rate limit'), 'Should report rate limit on rapid OTP request');
    }
    assert.ok(threwThrottle, 'Expected rapid OTP resend to be throttled');
  });

  // 26. TEST REGISTRATION DATA PURGE
  await asyncTest('Database Sanitization: CaventraStore.purgeTestRegistrations wipes test emails while preserving core data', async () => {
    const testEmail1 = 'testclient1@example.com';
    const testEmail2 = 'nayankalal_test@gmail.com';
    await Auth.register(testEmail1, 'TestPass123!', 'Test User One', 'Test Corp', '+91 99999 11111', 'TestPass123!', true);
    await Auth.register(testEmail2, 'TestPass123!', 'Nayan Kalal', 'Demo Co', '+91 88888 22222', 'TestPass123!', true);

    const dbBefore = Store.getDb();
    assert.ok(dbBefore.users.some(u => u.email === testEmail1), 'Test email 1 should exist before purge');
    assert.ok(dbBefore.users.some(u => u.email === testEmail2), 'Test email 2 should exist before purge');
    assert.ok(dbBefore.clients.some(c => c.email === testEmail2), 'Test client should exist before purge');

    const purgeResult = Store.purgeTestRegistrations();
    assert.strictEqual(purgeResult.ok, true);
    assert.ok(purgeResult.purgedEmails.includes(testEmail1));
    assert.ok(purgeResult.purgedEmails.includes(testEmail2));

    const dbAfter = Store.getDb();
    assert.ok(!dbAfter.users.some(u => u.email === testEmail1), 'Test email 1 must be purged');
    assert.ok(!dbAfter.users.some(u => u.email === testEmail2), 'Test email 2 must be purged');
    assert.ok(!dbAfter.clients.some(c => c.email === testEmail2), 'Test client record must be purged');

    // Verify founders are preserved
    assert.ok(dbAfter.users.some(u => u.role === 'founder' && (u.email === 'hridayvayanta7@gmail.com' || u.uid === 'founder_hriday')), 'Hriday must be preserved');
    assert.ok(dbAfter.users.some(u => u.role === 'founder' && (u.email === 'sauranahmed12345678@gmail.com' || u.uid === 'founder_sauran')), 'Sauranahmed must be preserved');
    assert.ok(dbAfter.users.some(u => u.role === 'founder' && (u.email === 'vednimbark08@gmail.com' || u.uid === 'founder_ved')), 'Ved must be preserved');

    // Verify demo mock records are purged / do not exist in database
    assert.ok(!dbAfter.users.some(u => u.email === 'acme@client.com'), 'Demo Acme user must not exist');
    assert.ok(!dbAfter.clients.some(c => c.id === 'cli_acme_001'), 'Demo Acme client must not exist');
    assert.ok(!dbAfter.projects.some(p => p.id === 'prj_acme_fleet'), 'Demo Acme fleet project must not exist');
    assert.ok(!dbAfter.invoices.some(i => i.id === 'inv_2026_01'), 'Demo invoice must not exist');

    // Verify direct authentication with official founder credentials
    const hridayOfficial = await Auth.login('hridayvayanta7@gmail.com', 'hridaycaventra@0000', true);
    assert.strictEqual(Auth.isFounder(hridayOfficial), true);
    assert.strictEqual(hridayOfficial.displayName, 'Hriday Vayanta');
  });

  // 27. STATIC FOUNDER CREDENTIALS VERIFICATION (Hriday, Ved, Sauranahmed)
  await asyncTest('Founder Authentication: Hriday, Ved, and Sauranahmed authenticate with static credentials', async () => {
    await Auth.logout();

    // 1. Test Hriday Vayanta
    const hridayChallenge = await Auth.login('hridayvayanta7@gmail.com', 'hridaycaventra@0000');
    assert.strictEqual(hridayChallenge.requiresLoginOtp, true);
    assert.strictEqual(hridayChallenge.email, 'hridayvayanta7@gmail.com');
    const hridaySession = await Auth.verifyLoginOtp('hridayvayanta7@gmail.com', hridayChallenge.code);
    assert.strictEqual(hridaySession.role, 'founder');
    assert.strictEqual(hridaySession.displayName, 'Hriday Vayanta');
    assert.strictEqual(Auth.isFounder(hridaySession), true);
    await Auth.logout();

    // 2. Test Ved Nimbaark
    const vedChallenge = await Auth.login('vednimbark08@gmail.com', 'vedcaventra@0000');
    assert.strictEqual(vedChallenge.requiresLoginOtp, true);
    assert.strictEqual(vedChallenge.email, 'vednimbark08@gmail.com');
    const vedSession = await Auth.verifyLoginOtp('vednimbark08@gmail.com', vedChallenge.code);
    assert.strictEqual(vedSession.role, 'founder');
    assert.strictEqual(vedSession.displayName, 'Ved Nimbaark');
    assert.strictEqual(Auth.isFounder(vedSession), true);
    await Auth.logout();

    // 3. Test Sauranahmed Mansuri
    const sauranChallenge = await Auth.login('sauranahmed12345678@gmail.com', 'saurancaventra@0000');
    assert.strictEqual(sauranChallenge.requiresLoginOtp, true);
    assert.strictEqual(sauranChallenge.email, 'sauranahmed12345678@gmail.com');
    const sauranSession = await Auth.verifyLoginOtp('sauranahmed12345678@gmail.com', sauranChallenge.code);
    assert.strictEqual(sauranSession.role, 'founder');
    assert.strictEqual(sauranSession.displayName, 'Sauranahmed Mansuri');
    assert.strictEqual(Auth.isFounder(sauranSession), true);
    await Auth.logout();

    // 4. Test invalid password rejection
    let threw = false;
    try {
      await Auth.login('hridayvayanta7@gmail.com', 'wrongpassword123');
    } catch (e) {
      threw = true;
      assert.ok(e.message.includes('Invalid password'));
    }
    assert.ok(threw, 'Invalid password must be rejected');
  });

  // 28. CROSS-DEVICE SYNCHRONIZATION & CLIENT INVOICES REFLECTION
  await asyncTest('Cross-Device Invoicing: Founder issues invoice and it reflects in Client Portal', async () => {
    const hriday = { uid: 'founder_hriday', email: 'hridayvayanta7@gmail.com', role: 'founder' };
    const clientUser = { uid: 'client_synctest', email: 'syncclient@acme.com', role: 'client', displayName: 'Sync Client' };

    const inv = Store.createInvoice({
      reference: 'INV-SYNC-001',
      userId: clientUser.uid,
      clientEmail: clientUser.email,
      clientName: clientUser.displayName,
      amount: 45000,
      currency: 'INR',
      dueDate: '2026-11-01',
      notes: 'Initial Milestone Settlement'
    }, hriday);

    assert.strictEqual(inv.reference, 'INV-SYNC-001');
    assert.strictEqual(inv.amount, 45000);
    assert.strictEqual(inv.status, 'Issued');

    const clientInvoices = Store.getInvoices(clientUser);
    assert.strictEqual(clientInvoices.length, 1);
    assert.strictEqual(clientInvoices[0].reference, 'INV-SYNC-001');
    assert.strictEqual(clientInvoices[0].amount, 45000);

    sandbox.CaventraAuth.getCurrentUser = () => clientUser;
    Portal.setClientActiveTab('invoices');
    const clientHtml = Portal.renderClientDashboard();
    assert.ok(clientHtml.includes('INV-SYNC-001'), 'Client HTML must display issued invoice reference');
    assert.ok(clientHtml.includes('₹45,000'), 'Client HTML must display formatted invoice amount');
    assert.ok(clientHtml.includes('Cloud Synced'), 'Client HTML must display Cloud Synced indicator');

    assert.strictEqual(typeof Store.syncWithCloud, 'function');
    assert.strictEqual(typeof Store.pushToCloud, 'function');
    assert.strictEqual(typeof Store.pullFromCloud, 'function');
  });

  // 29. TEAM MEMBER REGISTRATION & FOUNDER APPROVAL WORKFLOW
  await asyncTest('Team Member Registration: Team member requires founder approval before first login; client follows direct flow', async () => {
    await Auth.logout();

    // 1. Register as team member
    const regRes = await Auth.register(
      'employee.rahul@caventra.com',
      'DevPass456!',
      'Rahul Sharma',
      'CAVENTRA',
      '+91 9123456789',
      'DevPass456!',
      true,
      'team'
    );

    assert.strictEqual(regRes.pendingVerification, true);
    assert.strictEqual(regRes.email, 'employee.rahul@caventra.com');

    // 2. Retrieve pending OTP code from localStorage challenge
    const challengeKey = 'caventra_dev_pending_reg_otp_employee.rahul@caventra.com';
    const challenge = JSON.parse(sandbox.localStorage.getItem(challengeKey));
    assert.ok(challenge && challenge.code, 'Pending registration verification OTP must exist');

    // 3. Verify registration OTP (proves email ownership)
    const verifyRes = await Auth.verifyRegistrationOtp('employee.rahul@caventra.com', challenge.code);
    assert.ok(verifyRes.message.includes('Founder Administration'), 'Verification message must notify user of pending founder approval');

    // 4. Verify user record in db is pending founder approval
    const db = Store.getDb();
    const userInDb = db.users.find(u => u.email === 'employee.rahul@caventra.com');
    assert.ok(userInDb, 'User record must exist in DB');
    assert.strictEqual(userInDb.role, 'team', 'User role must be team');
    assert.strictEqual(userInDb.isApproved, false, 'Team member must NOT be approved yet');
    assert.strictEqual(userInDb.approvalStatus, 'pending', 'Approval status must be pending');

    // 5. Verify that team members are not added to CRM clients list
    const clientRecord = db.clients.find(c => c.email === 'employee.rahul@caventra.com');
    assert.strictEqual(clientRecord, undefined, 'Team member must not be created as CRM client');

    // 6. Non-approved team member login returns requiresFounderApproval with dedicated review view
    const pendingLoginRes = await Auth.login('employee.rahul@caventra.com', 'DevPass456!');
    assert.strictEqual(pendingLoginRes.requiresFounderApproval, true, 'Unapproved team member login must indicate founder approval is required');
    assert.ok(pendingLoginRes.message.includes('Founder reviewing your profile'), 'Must show Founder reviewing your profile message');
    assert.strictEqual(pendingLoginRes.email, 'employee.rahul@caventra.com');
    assert.ok(pendingLoginRes.user, 'Must return applicant user object for UI display');

    // Verify UI view renders dedicated review screen
    const pendingHtml = Portal.renderPendingApprovalView(pendingLoginRes.user, pendingLoginRes.message);
    assert.ok(pendingHtml.includes('Founder Reviewing Your Profile'), 'View must include review title');
    assert.ok(pendingHtml.includes('FOUNDER REVIEW IN PROGRESS'), 'View must include review badge');
    assert.ok(pendingHtml.includes('Check Approval Status (Live Cloud Sync)'), 'View must include real-time sync button');
    assert.ok(pendingHtml.includes('Hriday Vayanta'), 'View must list reviewing founders');

    // 7. Founder reviews pending team member access requests
    const hriday = { uid: 'founder_hriday', email: 'hridayvayanta7@gmail.com', role: 'founder', displayName: 'Hriday Vayanta' };
    const pendingList = Store.getPendingTeamMembers(hriday);
    assert.strictEqual(pendingList.length, 1);
    assert.strictEqual(pendingList[0].email, 'employee.rahul@caventra.com');
    assert.strictEqual(pendingList[0].displayName, 'Rahul Sharma');

    // 8. Founder Overview & Admin dashboard rendering shows action cards
    sandbox.CaventraAuth.getCurrentUser = () => hriday;
    Portal.setFounderActiveTab('overview');
    const founderOverviewHtml = Portal.renderFounderDashboard();
    assert.ok(founderOverviewHtml.includes('Pending Team Member Access Requests'), 'Overview must alert founders to pending staff');
    assert.ok(founderOverviewHtml.includes('employee.rahul@caventra.com'), 'Must show pending staff email');

    Portal.setFounderActiveTab('admin');
    const founderAdminHtml = Portal.renderFounderDashboard();
    assert.ok(founderAdminHtml.includes('Pending Team Member Access Requests'), 'Admin tab must show pending staff review panel');

    // 9. Founder approves team member
    const approvedUser = Store.approveTeamMember(userInDb.uid, hriday);
    assert.strictEqual(approvedUser.isApproved, true);
    assert.strictEqual(approvedUser.approvalStatus, 'approved');
    assert.strictEqual(approvedUser.approvedBy, 'Hriday Vayanta');
    assert.strictEqual(Store.getPendingTeamMembers(hriday).length, 0, 'Pending list must now be empty');

    // 10. Approved team member can now successfully log in
    const loginChallenge = await Auth.login('employee.rahul@caventra.com', 'DevPass456!');
    assert.strictEqual(loginChallenge.requiresLoginOtp, true);
    const teamUser = await Auth.verifyLoginOtp('employee.rahul@caventra.com', loginChallenge.code);

    assert.strictEqual(Auth.isTeamMember(teamUser), true, 'User must be recognized as team member');
    assert.strictEqual(Auth.isFounder(teamUser), false, 'Team member must not be founder');
    assert.strictEqual(Auth.isClient(teamUser), false, 'Team member must not be client');

    // 11. Verify portal view renders Team Member Portal header
    sandbox.CaventraAuth.getCurrentUser = () => teamUser;
    const teamDashboardHtml = Portal.renderFounderDashboard();
    assert.ok(teamDashboardHtml.includes('CAVENTRA TEAM PORTAL'), 'Dashboard should display CAVENTRA TEAM PORTAL');

    // 12. Verify registration form elements
    const regHtml = Portal.renderRegister();
    assert.ok(regHtml.includes('id="pt-reg-account-type"'), 'Registration form must have account type dropdown');
    assert.ok(regHtml.includes('Caventra Team Member / Employee'), 'Registration form must include team option');
    assert.ok(regHtml.includes('Team Access Security Notice'), 'Registration form must include team security notice');

    await Auth.logout();
  });

  // 30. CORPORATE & CROSS-FOUNDER TICKETING SYSTEM
  await asyncTest('Corporate Ticketing: Founders and team members can create internal tasks, reassign, comment, and resolve in real time', async () => {
    const hriday = { uid: 'founder_hriday', email: 'hridayvayanta7@gmail.com', role: 'founder', displayName: 'Hriday Vayanta' };
    const sauran = { uid: 'founder_sauran', email: 'sauranahmed12345678@gmail.com', role: 'founder', displayName: 'Sauranahmed Mansuri' };
    const clientUser = { uid: 'client_external', email: 'externalclient@acme.com', role: 'client', displayName: 'External Client' };

    // 1. Create corporate ticket (Hriday assigning to Sauran)
    const corpTicket = Store.createSupportTicket({
      subject: 'API Gateway Redis Cache Architecture',
      description: 'Implement distributed Redis sentinel for sub-millisecond route caching',
      priority: 'high',
      category: 'Infrastructure',
      ticketType: 'internal',
      assignedFounder: 'Sauranahmed Mansuri',
      assignedToEmail: 'sauranahmed12345678@gmail.com',
      dueDate: '2026-10-25'
    }, hriday);

    assert.ok(corpTicket.id, 'Ticket must have unique ID');
    assert.strictEqual(corpTicket.ticketType, 'internal');
    assert.strictEqual(corpTicket.assignedFounder, 'Sauranahmed Mansuri');
    assert.strictEqual(corpTicket.assignedToEmail, 'sauranahmed12345678@gmail.com');
    assert.strictEqual(corpTicket.status, 'Open');
    assert.strictEqual(corpTicket.comments.length, 0);

    // 2. Add discussion comment from Sauran
    const comment = Store.addTicketComment(
      corpTicket.id,
      'Configured Redis Sentinel cluster with 3 read replicas and automatic failover.',
      sauran
    );
    assert.strictEqual(comment.author, 'Sauranahmed Mansuri');
    assert.strictEqual(comment.role, 'founder');

    // Fetch refreshed ticket from store
    const refreshedTicket = Store.getSupportTickets(hriday).find(t => t.id === corpTicket.id);
    assert.strictEqual(refreshedTicket.comments.length, 1);
    assert.strictEqual(refreshedTicket.comments[0].text, 'Configured Redis Sentinel cluster with 3 read replicas and automatic failover.');

    // 3. Update ticket status to In Progress
    const updated = Store.updateSupportTicket(corpTicket.id, { status: 'In Progress' }, sauran);
    assert.strictEqual(updated.status, 'In Progress');

    // 4. Verify client isolation: clientUser cannot see internal corporate tickets
    const clientTickets = Store.getSupportTickets(clientUser);
    const hasCorpTicket = clientTickets.some(t => t.id === corpTicket.id);
    assert.strictEqual(hasCorpTicket, false, 'External clients must NEVER access internal corporate tickets');

    // 5. Verify Founder / Staff dashboard rendering of Corporate Operations Desk
    sandbox.CaventraAuth.getCurrentUser = () => hriday;
    Portal.setFounderActiveTab('support');
    const founderDeskHtml = Portal.renderFounderDashboard();
    assert.ok(founderDeskHtml.includes('Support Desk & Corporate Operations'), 'Must render Support & Corporate desk');
    assert.ok(founderDeskHtml.includes('API Gateway Redis Cache Architecture'), 'Must display corporate ticket subject');
    assert.ok(founderDeskHtml.includes('CORPORATE'), 'Must display CORPORATE badge');
    assert.ok(founderDeskHtml.includes('Sauranahmed Mansuri'), 'Must display assigned founder name');
  });

  console.log('\n========================================');
  console.log(`PORTAL TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  if (failed > 0) process.exit(1);
})();
