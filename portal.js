/**
 * CAVENTRA — Client Portal & Founder Dashboard Engine
 * LOCAL DEVELOPMENT & TESTING ONLY.
 * Integrates with CaventraAuth and CaventraStore.
 */

(function (global) {
  'use strict';

  // Active dashboard tab state
  let clientActiveTab = 'overview';
  let founderActiveTab = 'overview';
  let activeModal = null;

  // Helper escape
  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function fmtDate(d) {
    if (!d) return '—';
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return d;
    }
  }

  function fmtCurrency(amt, cur) {
    const num = Math.round(Number(amt) || 0);
    const c = (cur || 'INR').toUpperCase();
    if (c === 'INR') return '₹' + num.toLocaleString('en-IN');
    return '$' + num.toLocaleString('en-US');
  }

  // --- Security Modals ---
  function renderGoogleModal() {
    return `
      <div id="pt-google-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog" style="max-width:460px;padding:26px 28px;text-align:center">
          <div style="display:flex;justify-content:center;margin-bottom:12px">
            <svg width="34" height="34" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/></svg>
          </div>
          <h3 style="font-family:var(--hd);font-size:20px;margin-bottom:6px">Google Authentication</h3>
          <p style="font-size:13px;color:var(--tx-sub);margin-bottom:18px">Official OAuth 2.0 Security Gateway (caventra-dev)</p>

          <div class="pt-notice-box" style="text-align:left;margin-bottom:16px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span>Google Sign-In requires authentic identity verification. Enter your Google email address below to receive a secure 6-digit OTP verification challenge to your email inbox. No account access is granted without email verification.</span>
          </div>

          <form id="pt-form-custom-google" style="text-align:left;background:var(--bg2);padding:16px;border-radius:8px;border:1px solid var(--line)">
            <label style="display:block;margin-bottom:10px">
              <span style="font-size:12px;color:var(--tx-sub)">Your Full Name *</span>
              <input type="text" name="googleName" placeholder="e.g. Vikram Patel" required style="width:100%;margin-top:4px">
            </label>
            <label style="display:block;margin-bottom:14px">
              <span style="font-size:12px;color:var(--tx-sub)">Google Account Email (@gmail.com) *</span>
              <input type="email" name="googleEmail" placeholder="your.name@gmail.com" required style="width:100%;margin-top:4px">
            </label>
            <button class="btn solid sm w-full" type="submit">Send Verification Code to My Email</button>
          </form>

          <div style="font-size:11px;color:var(--mut);line-height:1.4;margin:16px 0 14px;text-align:left">
            Security policy: A 6-digit OTP code will be dispatched to verify your ownership of this email address before login is granted.
          </div>

          <button class="btn sm w-full" data-pt-action="close-modal" type="button">Cancel</button>
        </div>
      </div>
    `;
  }

  function renderRegistrationOtpModal() {
    return `
      <div id="pt-reg-otp-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog" style="max-width:440px;padding:26px 28px;text-align:center">
          <div style="display:flex;justify-content:center;margin-bottom:12px">
            <div style="width:48px;height:48px;border-radius:50%;background:rgba(52,168,83,0.15);border:1.5px solid #34A853;display:flex;align-items:center;justify-content:center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34A853" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
          </div>
          <h3 style="font-family:var(--hd);font-size:20px;margin-bottom:6px">Verify Email Address</h3>
          <p style="font-size:13px;color:var(--tx-sub);margin-bottom:10px">We dispatched a 6-digit code to <strong id="pt-reg-otp-recipient">your email</strong></p>

          <div class="pt-notice-box" style="text-align:left;margin:12px 0 10px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span>Mandatory Verification: Enter the 6-digit verification code dispatched to your email to verify and activate your client account. (Code valid for 5 minutes)</span>
          </div>

          <div style="display:flex;align-items:flex-start;gap:8px;background:rgba(212,175,55,0.08);border:1px dashed rgba(212,175,55,0.35);border-radius:6px;padding:8px 12px;font-size:12px;color:var(--tx);margin-bottom:14px;text-align:left">
            <span style="font-size:14px;line-height:1">📁</span>
            <span><strong>Check Spam Folder:</strong> If you don't see the email in your primary inbox, please check your <strong>Spam</strong> or <strong>Junk</strong> folder and mark CAVENTRA as "Not Spam".</span>
          </div>

          <form id="pt-form-reg-otp" style="margin-top:14px">
            <div class="pt-otp-inputs">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="reg-otp-0" autofocus>
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="reg-otp-1">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="reg-otp-2">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="reg-otp-3">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="reg-otp-4">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="reg-otp-5">
            </div>
            <div style="display:flex;gap:10px;margin-top:16px">
              <button class="btn sm" type="button" data-pt-action="resend-reg-otp" id="pt-btn-resend-reg-otp">Resend Code</button>
              <button class="btn solid sm" style="flex:1" type="submit" id="pt-btn-verify-reg-otp">Verify &amp; Activate</button>
            </div>
            <button class="btn sm w-full" style="margin-top:10px" data-pt-action="close-modal" type="button">Cancel</button>
          </form>
        </div>
      </div>
    `;
  }

  function renderLoginOtpModal() {
    return `
      <div id="pt-login-otp-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog" style="max-width:440px;padding:26px 28px;text-align:center">
          <div style="display:flex;justify-content:center;margin-bottom:12px">
            <div style="width:48px;height:48px;border-radius:50%;background:rgba(201,184,160,0.15);border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
          </div>
          <h3 style="font-family:var(--hd);font-size:20px;margin-bottom:6px">Sign-In Security Verification</h3>
          <p style="font-size:13px;color:var(--tx-sub);margin-bottom:10px">A fresh 6-digit security code was dispatched to <strong id="pt-login-otp-recipient">your email</strong></p>

          <div class="pt-notice-box" style="text-align:left;margin:12px 0 10px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>Two-Step Verification: CAVENTRA accounts require 6-digit OTP verification on every login. Enter the code sent to your email to complete sign-in.</span>
          </div>

          <div style="display:flex;align-items:flex-start;gap:8px;background:rgba(212,175,55,0.08);border:1px dashed rgba(212,175,55,0.35);border-radius:6px;padding:8px 12px;font-size:12px;color:var(--tx);margin-bottom:14px;text-align:left">
            <span style="font-size:14px;line-height:1">📁</span>
            <span><strong>Check Spam Folder:</strong> If you don't see the email in your primary inbox, please check your <strong>Spam</strong> or <strong>Junk</strong> folder and mark CAVENTRA as "Not Spam".</span>
          </div>

          <form id="pt-form-login-otp" style="margin-top:14px">
            <div class="pt-otp-inputs">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="login-otp-0" autofocus>
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="login-otp-1">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="login-otp-2">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="login-otp-3">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="login-otp-4">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="login-otp-5">
            </div>
            <div style="display:flex;gap:10px;margin-top:16px">
              <button class="btn sm" type="button" data-pt-action="resend-login-otp" id="pt-btn-resend-login-otp">Resend Code</button>
              <button class="btn solid sm" style="flex:1" type="submit" id="pt-btn-verify-login-otp">Verify &amp; Sign In</button>
            </div>
            <button class="btn sm w-full" style="margin-top:10px" data-pt-action="close-modal" type="button">Cancel</button>
          </form>
        </div>
      </div>
    `;
  }

  function renderTwoFactorModal() {
    return `
      <div id="pt-2fa-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog" style="max-width:440px;padding:26px 28px;text-align:center">
          <div style="display:flex;justify-content:center;margin-bottom:12px">
            <div style="width:48px;height:48px;border-radius:50%;background:rgba(201,184,160,0.15);border:1.5px solid var(--gold);display:flex;align-items:center;justify-content:center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
          </div>
          <h3 style="font-family:var(--hd);font-size:20px;margin-bottom:6px">Two-Factor Security Verification</h3>
          <p style="font-size:13px;color:var(--tx-sub);margin-bottom:10px">A 6-digit security code was dispatched to <strong id="pt-2fa-email-display">your email</strong></p>

          <div class="pt-notice-box" style="text-align:left;margin:12px 0 10px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>A 6-digit 2FA security code has been dispatched to your email. Please check your inbox and enter the 6 digits below to complete sign-in.</span>
          </div>

          <div style="display:flex;align-items:flex-start;gap:8px;background:rgba(212,175,55,0.08);border:1px dashed rgba(212,175,55,0.35);border-radius:6px;padding:8px 12px;font-size:12px;color:var(--tx);margin-bottom:14px;text-align:left">
            <span style="font-size:14px;line-height:1">📁</span>
            <span><strong>Check Spam Folder:</strong> If the 2FA email does not appear in your primary inbox, please make sure to check your <strong>Spam</strong> or <strong>Junk</strong> folder.</span>
          </div>

          <form id="pt-form-2fa" style="margin-top:14px">
            <div class="pt-otp-inputs">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="twofa-0" autofocus>
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="twofa-1">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="twofa-2">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="twofa-3">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="twofa-4">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="twofa-5">
            </div>
            <button class="btn solid sm w-full" type="submit" id="pt-btn-confirm-2fa">Verify & Sign In</button>
            <button class="btn sm w-full" style="margin-top:8px" data-pt-action="close-modal" type="button">Cancel</button>
          </form>
        </div>
      </div>
    `;
  }

  function renderEmailOtpModal() {
    return `
      <div id="pt-otp-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog" style="max-width:440px;padding:26px 28px;text-align:center">
          <div style="display:flex;justify-content:center;margin-bottom:12px">
            <div style="width:48px;height:48px;border-radius:50%;background:rgba(52,168,83,0.15);border:1.5px solid #7ee787;display:flex;align-items:center;justify-content:center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7ee787" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
          </div>
          <h3 style="font-family:var(--hd);font-size:20px;margin-bottom:6px">Verify Email Address</h3>
          <p style="font-size:13px;color:var(--tx-sub);margin-bottom:10px">We sent a 6-digit verification code to <strong id="pt-otp-recipient">your email</strong></p>

          <div class="pt-notice-box" style="text-align:left;margin:12px 0 10px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span>A 6-digit verification code has been dispatched to your email inbox. Please open your email, find the code from CAVENTRA, and enter it below. (Code valid for 10 minutes)</span>
          </div>

          <div style="display:flex;align-items:flex-start;gap:8px;background:rgba(212,175,55,0.08);border:1px dashed rgba(212,175,55,0.35);border-radius:6px;padding:8px 12px;font-size:12px;color:var(--tx);margin-bottom:14px;text-align:left">
            <span style="font-size:14px;line-height:1">📁</span>
            <span><strong>Check Spam Folder:</strong> If you don't see the email in your primary inbox, please check your <strong>Spam</strong> or <strong>Junk</strong> folder.</span>
          </div>

          <form id="pt-form-otp" style="margin-top:14px">
            <div class="pt-otp-inputs">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="otp-0" autofocus>
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="otp-1">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="otp-2">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="otp-3">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="otp-4">
              <input type="text" inputmode="numeric" maxlength="1" class="pt-otp-digit" id="otp-5">
            </div>
            <div style="display:flex;gap:10px;margin-top:16px">
              <button class="btn sm" type="button" data-pt-action="resend-otp" id="pt-btn-resend-otp">Resend Code</button>
              <button class="btn solid sm" style="flex:1" type="submit" id="pt-btn-verify-otp">Verify Code</button>
            </div>
            <button class="btn sm w-full" style="margin-top:10px" data-pt-action="close-modal" type="button">Cancel</button>
          </form>
        </div>
      </div>
    `;
  }

  // 1b. PENDING APPROVAL VIEW (Team Member Under Review by Founders)
  function renderPendingApprovalView(user, customMsg) {
    const u = user || {
      displayName: 'Team Member',
      email: 'team@caventra.com',
      role: 'team',
      title: 'Team Member',
      company: 'CAVENTRA'
    };

    return `
      <section class="pt-auth-wrap">
        <div class="wrap pt-auth-card" style="max-width:540px;text-align:center;padding:36px 28px">
          <div style="display:flex;justify-content:center;margin-bottom:16px">
            <div style="width:68px;height:68px;border-radius:50%;background:rgba(212,175,55,0.12);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:30px">
              ⏳
            </div>
          </div>

          <span class="pt-badge-pill" style="border-color:var(--gold);color:var(--gold);margin-bottom:14px;padding:3px 12px">
            <span class="dot" style="background:var(--gold)"></span> FOUNDER REVIEW IN PROGRESS
          </span>

          <h2 style="font-family:var(--hd);font-size:26px;margin:8px 0 10px;color:var(--tx)">
            Founder Reviewing Your Profile
          </h2>

          <p style="color:var(--tx-sub);font-size:14px;line-height:1.6;margin-bottom:24px">
            ${esc(customMsg || `Welcome to the team, ${u.displayName}! Your email is verified and your profile is currently under review by Founder Administration. Once approved, you will be able to log in to the Caventra Team Portal.`)}
          </p>

          <!-- Applicant Information Card -->
          <div style="background:var(--bg2);border:1px solid var(--line);border-radius:8px;padding:16px 20px;text-align:left;margin-bottom:20px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span style="font-size:12px;color:var(--tx-sub);font-weight:600">APPLICANT PROFILE</span>
              <span class="pt-status-pill pt-status-warn" style="font-size:11px">⏳ Pending Founder Approval</span>
            </div>
            <div style="font-size:15px;font-weight:600;color:var(--tx);margin-bottom:2px">${esc(u.displayName || 'Team Member')}</div>
            <div style="font-size:13px;color:var(--tx-sub);margin-bottom:8px">${esc(u.email)}</div>
            <div style="font-size:12px;color:var(--gold);padding-top:8px;border-top:1px solid var(--line)">
              Requested Role: <strong>Caventra Team Member / Employee</strong> · ${fmtDate(u.createdAt || new Date())}
            </div>
          </div>

          <!-- Reviewing Leadership Banner -->
          <div style="background:rgba(212,175,55,0.04);border:1px dashed rgba(212,175,55,0.3);border-radius:8px;padding:14px 18px;text-align:left;margin-bottom:24px">
            <div style="font-size:11px;font-weight:700;color:var(--gold);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">Reviewing Founder Administration:</div>
            <div style="font-size:12px;color:var(--tx);line-height:1.6">
              <div>• <strong>Hriday Vayanta</strong> — Head of Growth</div>
              <div>• <strong>Sauranahmed Mansuri</strong> — Head of Technology</div>
              <div>• <strong>Ved Nimbaark</strong> — Head of Design</div>
            </div>
          </div>

          <!-- Real-Time Actions -->
          <div style="display:flex;flex-direction:column;gap:10px">
            <button class="btn solid w-full" id="pt-btn-check-approval" data-email="${esc(u.email)}" type="button" style="background:var(--gold);color:#0f1316;font-weight:700">
              ↻ Check Approval Status (Live Cloud Sync)
            </button>
            <div id="pt-check-status-msg" style="font-size:12px;color:var(--tx-sub);min-height:18px;margin-top:2px"></div>
            <a class="btn w-full" href="/login/" style="margin-top:4px">Back to Sign In</a>
          </div>
        </div>
      </section>
    `;
  }

  // 1. LOGIN VIEW
  function renderLogin(msg) {
    const user = global.CaventraAuth ? global.CaventraAuth.getCurrentUser() : null;
    if (user) {
      // Already logged in -> redirect appropriately
      const isStaff = global.CaventraAuth.isFounder(user) || global.CaventraAuth.isTeamMember(user);
      const target = isStaff ? '/founder-dashboard/' : '/client-dashboard/';
      return `
        <div class="wrap pt-page" style="padding:100px 16px;text-align:center;max-width:640px;margin:0 auto">
          <div class="pt-badge-pill" style="margin-bottom:20px"><span class="dot"></span> ACTIVE SESSION</div>
          <h2 style="font-size:32px;margin-bottom:14px">Already Authenticated</h2>
          <p style="color:var(--tx-sub);margin-bottom:28px">You are signed in as <strong>${esc(user.email)}</strong> (${esc(user.role)}).</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <a class="btn solid" href="${target}">Go to ${isStaff ? 'Operations / Founder Portal' : 'Client Dashboard'}</a>
            <button class="btn" data-pt-action="logout" type="button">Sign Out</button>
          </div>
        </div>
      `;
    }

    return `
      <section class="pt-auth-wrap">
        <div class="wrap pt-auth-card">
          <div class="pt-auth-header">
            <span class="pt-badge-pill"><span class="dot"></span> CAVENTRA PORTAL</span>
            <h2>Sign In</h2>
            <p>Access your project progress, client milestones, and direct communication.</p>
          </div>

          ${msg ? `<div class="pt-alert ${msg.type === 'error' ? 'pt-alert-err' : 'pt-alert-ok'}">${esc(msg.text)}</div>` : ''}

          <form id="pt-form-login" class="pt-form">
            <label>
              <span>Work Email</span>
              <input type="email" name="email" required placeholder="client@company.com" autocomplete="email" value="${esc((typeof localStorage !== 'undefined' ? localStorage.getItem('caventra_remembered_email') : '') || '')}" autofocus>
            </label>

            <label>
              <div style="display:flex;justify-content:space-between">
                <span>Password</span>
                <a href="/reset-password/" style="font-size:12px;color:var(--gold);text-decoration:none">Forgot password?</a>
              </div>
              <input type="password" name="password" required placeholder="••••••••" autocomplete="current-password">
            </label>

            <div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0 12px">
              <label class="pt-checkbox-label" style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--tx-sub);cursor:pointer;user-select:none">
                <input type="checkbox" id="pt-login-remember" name="rememberMe" ${(typeof localStorage !== 'undefined' && localStorage.getItem('caventra_remember_login') === 'false') ? '' : 'checked'} style="cursor:pointer">
                <span>Remember me</span>
              </label>
            </div>

            <div class="pt-captcha-card" id="pt-captcha-card-login">
              <label class="pt-captcha-label">
                <input type="checkbox" id="pt-captcha-login">
                <span class="pt-captcha-text">I am human (Verify anti-bot challenge)</span>
              </label>
              <div class="pt-captcha-brand">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>CAVENTRA DEFENSE</span>
              </div>
            </div>

            <button type="submit" class="btn solid w-full" id="pt-btn-login">Sign In</button>
          </form>

          <div class="pt-divider"><span>OR CONTINUE WITH</span></div>

          <div style="display:flex;flex-direction:column;gap:10px">
            <button class="btn pt-btn-google" type="button" data-pt-action="open-google-modal">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/></svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div class="pt-auth-footer">
            <span>Don't have an account?</span>
            <a href="/register/">Register as a Client</a>
          </div>
        </div>
        ${renderGoogleModal()}
        ${renderTwoFactorModal()}
        ${renderRegistrationOtpModal()}
        ${renderLoginOtpModal()}
      </section>
    `;
  }

  // 2. REGISTER VIEW
  function renderRegister(msg) {
    return `
      <section class="pt-auth-wrap">
        <div class="wrap pt-auth-card" style="max-width:540px">
          <div class="pt-auth-header">
            <span class="pt-badge-pill"><span class="dot"></span> CAVENTRA CLIENT PORTAL</span>
            <h2>Create Client Account</h2>
            <p>Register to view your project architecture, milestone sign-offs, and proposals.</p>
          </div>

          ${msg ? `<div class="pt-alert ${msg.type === 'error' ? 'pt-alert-err' : 'pt-alert-ok'}">${esc(msg.text)}</div>` : ''}

          <form id="pt-form-register" class="pt-form">
            <label>
              <span>I am registering as *</span>
              <select name="accountType" id="pt-reg-account-type" required style="font-weight:600;color:var(--tx);background:var(--bg2);">
                <option value="client" selected>Client / Organization (View Projects, Milestones & Invoices)</option>
                <option value="team">Caventra Team Member / Employee (Corporate Tasks, Projects & Tickets)</option>
              </select>
            </label>

            <div id="pt-team-security-notice" class="pt-notice-box" style="display:none;background:rgba(212,175,55,0.08);border-color:rgba(212,175,55,0.3);color:var(--tx);margin:8px 0 14px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span><strong>Team Access Security Notice:</strong> After email verification via OTP, your profile request will be submitted to Founder Administration. A founding partner (Hriday, Sauranahmed, or Ved) must approve your account before your first sign-in.</span>
            </div>

            <label>
              <span>Full Name (Letters only) *</span>
              <input type="text" name="name" required placeholder="e.g. Vikram Patel" autocomplete="name" pattern="[A-Za-z\s.'-]{2,}" title="Letters only, no numbers allowed" oninput="this.value=this.value.replace(/[0-9]/g,'')">
            </label>

            <label>
              <span>Work Email *</span>
              <input type="email" name="email" required placeholder="name@company.com" autocomplete="email">
            </label>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Company / Project Name</span>
                <input type="text" name="company" placeholder="e.g. Acme Tech" autocomplete="organization">
              </label>

              <label>
                <span>Phone Number</span>
                <input type="tel" name="phone" placeholder="+91 98765 43210" autocomplete="tel">
              </label>
            </div>

            <label>
              <span>Password (8+ characters) *</span>
              <input type="password" name="password" required minlength="8" placeholder="••••••••" autocomplete="new-password">
            </label>

            <label>
              <span>Confirm Password *</span>
              <input type="password" name="confirmPassword" required minlength="8" placeholder="••••••••" autocomplete="new-password">
            </label>

            <div class="pt-terms-card" style="margin:10px 0;">
              <label class="pt-checkbox-label" style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--tx-sub);cursor:pointer;">
                <input type="checkbox" name="terms" id="pt-terms-reg" required style="margin-top:2px;">
                <span>I agree to CAVENTRA's <a href="/terms/" target="_blank" style="color:var(--accent);text-decoration:underline;">Terms of Service</a> and <a href="/privacy/" target="_blank" style="color:var(--accent);text-decoration:underline;">Privacy Policy</a>.</span>
              </label>
            </div>

            <div class="pt-notice-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Security Note: Registration provides verified Client role privileges. Founder dashboards require explicit internal authorization.</span>
            </div>

            <div class="pt-captcha-card" id="pt-captcha-card-reg">
              <label class="pt-captcha-label">
                <input type="checkbox" id="pt-captcha-reg">
                <span class="pt-captcha-text">I am human (Verify anti-bot challenge)</span>
              </label>
              <div class="pt-captcha-brand">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>CAVENTRA DEFENSE</span>
              </div>
            </div>

            <button type="submit" class="btn solid w-full" id="pt-btn-register">Create Client Account</button>
          </form>

          <div class="pt-divider"><span>OR REGISTER WITH</span></div>

          <div style="display:flex;flex-direction:column;gap:10px">
            <button class="btn pt-btn-google" type="button" data-pt-action="open-google-modal">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/></svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div class="pt-auth-footer">
            <span>Already have an account?</span>
            <a href="/login/">Sign In</a>
          </div>
        </div>
        ${renderGoogleModal()}
        ${renderTwoFactorModal()}
        ${renderRegistrationOtpModal()}
        ${renderLoginOtpModal()}
      </section>
    `;
  }

  // 3. RESET PASSWORD VIEW
  function renderResetPassword(msg) {
    return `
      <section class="pt-auth-wrap">
        <div class="wrap pt-auth-card" style="max-width:480px">
          <div class="pt-auth-header">
            <span class="pt-badge-pill"><span class="dot"></span> RECOVERY</span>
            <h2>Reset Password</h2>
            <p>Enter your registered account email and we'll dispatch a secure recovery link.</p>
          </div>

          ${msg ? `<div class="pt-alert ${msg.type === 'error' ? 'pt-alert-err' : 'pt-alert-ok'}">${esc(msg.text)}</div>` : ''}

          <form id="pt-form-reset" class="pt-form">
            <label>
              <span>Account Email</span>
              <input type="email" name="email" required placeholder="client@company.com" autocomplete="email">
            </label>

            <button type="submit" class="btn solid w-full">Send Recovery Link</button>
          </form>

          <div class="pt-auth-footer">
            <a href="/login/">Back to Sign In</a>
          </div>
        </div>
      </section>
    `;
  }

  // 4. CLIENT DASHBOARD VIEW
  function renderClientDashboard(forceTab) {
    if (forceTab) clientActiveTab = forceTab;
    const user = global.CaventraAuth ? global.CaventraAuth.getCurrentUser() : null;
    if (!user) {
      return renderLogin({ type: 'error', text: 'Authentication required. Please sign in to access your Client Dashboard.' });
    }

    const isFounder = global.CaventraAuth.isFounder(user);
    const store = global.CaventraStore;
    const projects = store.getProjects(user);
    const updates = projects.length > 0 ? store.getProjectUpdates(projects[0].id, user) : [];
    const tickets = store.getSupportTickets(user);
    const invoices = store.getInvoices(user);

    // Overview Stats
    const activeProjectsCount = projects.filter(p => p.status !== 'Launched').length;
    const pendingApprovalsCount = updates.filter(u => u.needsApproval && !u.approved).length;
    const openTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

    return `
      <div class="pt-dash-container">
        <!-- Top Nav / Header Banner -->
        <header class="pt-dash-header">
          <div class="wrap pt-dash-header-wrap">
            <div class="pt-dash-brand">
              <span class="pt-badge-pill"><span class="dot"></span> CLIENT PORTAL</span>
              <h1>Welcome, ${esc(user.displayName)}</h1>
              <p>${esc(user.company || 'Client Account')} · ${esc(user.email)}</p>
            </div>

            <div class="pt-header-actions">
              <span class="pt-badge-pill" style="border-color:rgba(52,168,83,0.3);color:#34A853" title="Real-time Cloud Firestore synchronization"><span class="dot" style="background:#34A853"></span> Cloud Synced</span>
              <button class="btn sm" data-pt-action="manual-sync" type="button" title="Synchronize with Cloud Firestore" style="padding:6px 10px;font-size:12px">↻ Sync</button>
              ${!user.emailVerified ? `
                <button class="btn sm pt-btn-warn" data-pt-action="request-email-otp" type="button" title="Verify your email with a 6-digit OTP code">
                  ⚠️ Verify Email (OTP)
                </button>
              ` : `
                <span class="pt-verified-tag">✓ Verified</span>
              `}
              ${isFounder ? `
                <a class="btn sm" href="/founder-dashboard/" style="background:var(--bg3);border-color:var(--gold)">Founder View</a>
              ` : ''}
              <button class="btn sm" data-pt-action="logout" type="button">Sign Out</button>
            </div>
          </div>

          <!-- Tab Bar -->
          <div class="wrap pt-tabs-wrap">
            <nav class="pt-nav-tabs">
              <button class="pt-tab-btn ${clientActiveTab === 'overview' ? 'active' : ''}" data-pt-tab="overview">Overview</button>
              <button class="pt-tab-btn ${clientActiveTab === 'projects' ? 'active' : ''}" data-pt-tab="projects">My Projects (${projects.length})</button>
              <button class="pt-tab-btn ${clientActiveTab === 'updates' ? 'active' : ''}" data-pt-tab="updates">Updates & Approvals ${pendingApprovalsCount ? `<span class="pt-counter-badge">${pendingApprovalsCount}</span>` : ''}</button>
              <button class="pt-tab-btn ${clientActiveTab === 'invoices' ? 'active' : ''}" data-pt-tab="invoices">Invoices & Billing (${invoices.length})</button>
              <button class="pt-tab-btn ${clientActiveTab === 'documents' ? 'active' : ''}" data-pt-tab="documents">Documents</button>
              <button class="pt-tab-btn ${clientActiveTab === 'support' ? 'active' : ''}" data-pt-tab="support">Support (${openTicketsCount})</button>
              <button class="pt-tab-btn ${clientActiveTab === 'profile' ? 'active' : ''}" data-pt-tab="profile">Profile & Security</button>
            </nav>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="wrap pt-dash-content">
          ${renderClientTabContent(clientActiveTab, user, projects, updates, tickets, invoices)}
        </main>
        ${renderEmailOtpModal()}
        <div id="pt-client-payment-modal" class="pt-modal" style="display:none">
          <div class="pt-modal-dialog" style="max-width:480px">
            <div class="pt-modal-head">
              <h3>CAVENTRA Official Settlement Instructions</h3>
              <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
            </div>
            <div style="padding:16px 0;font-size:13px;line-height:1.6">
              <div class="pt-notice-box" style="margin-bottom:16px">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span>Payments can be settled directly via Bank NEFT / RTGS / IMPS or Official UPI. Once transferred, submit your transaction reference below or notify your assigned founding engineer.</span>
              </div>
              <div class="pt-meta-list" style="background:var(--bg2);padding:14px;border-radius:8px;border:1px solid var(--line);margin-bottom:16px">
                <div class="pt-meta-row"><span>Account Name</span><strong>CAVENTRA INNOVATIONS</strong></div>
                <div class="pt-meta-row"><span>Bank</span><strong>HDFC Bank / State Bank of India</strong></div>
                <div class="pt-meta-row"><span>Official UPI ID</span><strong>caventraofficial@upi</strong></div>
                <div class="pt-meta-row"><span>Support Hotline</span><strong>+91 88667 90989</strong></div>
              </div>
              <form id="pt-form-notify-payment" class="pt-form">
                <input type="hidden" name="reference" id="pt-pay-modal-ref" value="">
                <label>
                  <span>Transaction ID / UTR / Reference Code *</span>
                  <input type="text" name="transactionRef" placeholder="e.g. UTR1234567890" required>
                </label>
                <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:14px">
                  <button class="btn" type="button" data-pt-action="close-modal">Close</button>
                  <button class="btn solid" type="submit">Submit Reference</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        ${renderTicketThreadModal(false)}
      </div>
    `;
  }

  function renderClientTabContent(tab, user, projects, updates, tickets, invoices) {
    const isFounder = global.CaventraAuth && global.CaventraAuth.isFounder(user);
    if (tab === 'overview') {
      const pendingApprovals = updates.filter(u => u.needsApproval && !u.approved);
      return `
        <div class="pt-tab-pane">
          <!-- Metric Cards -->
          <div class="pt-stats-grid">
            <div class="pt-stat-card">
              <div class="pt-stat-label">Active Projects</div>
              <div class="pt-stat-value">${projects.length}</div>
              <div class="pt-stat-sub">Bespoke engineered solutions</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Pending Approvals</div>
              <div class="pt-stat-value ${pendingApprovals.length ? 'pt-tx-gold' : ''}">${pendingApprovals.length}</div>
              <div class="pt-stat-sub">${pendingApprovals.length ? 'Action required on milestones' : 'All deliverables approved'}</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Invoices & Billing</div>
              <div class="pt-stat-value">${invoices.length}</div>
              <div class="pt-stat-sub">${invoices.some(i => i.status !== 'Paid') ? 'Statements pending' : 'All accounts settled'}</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Support Tickets</div>
              <div class="pt-stat-value">${tickets.filter(t => t.status !== 'Resolved').length}</div>
              <div class="pt-stat-sub">Active support inquiries</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Assigned Founder</div>
              <div class="pt-stat-value" style="font-size:18px;margin-top:8px">${esc(projects[0]?.assignedContact || 'Hriday Vayanta (Growth)')}</div>
              <div class="pt-stat-sub">Direct technical contact</div>
            </div>
          </div>

          <!-- Pending Actions Banner -->
          ${pendingApprovals.length > 0 ? `
            <div class="pt-action-card">
              <div class="pt-action-icon">⚡</div>
              <div class="pt-action-body">
                <h3>Milestone Sign-Off Pending: ${esc(pendingApprovals[0].title)}</h3>
                <p>${esc(pendingApprovals[0].notes)}</p>
              </div>
              <button class="btn solid sm" data-pt-tab="updates">Review & Approve</button>
            </div>
          ` : ''}

          <!-- Active Project Highlights -->
          <div class="pt-panel">
            <div class="pt-panel-head">
              <h2>Current Project Status</h2>
              <button class="btn sm" data-pt-tab="projects">View Full Timeline</button>
            </div>
            ${projects.length === 0 ? `
              <div class="pt-empty-state">
                <h3>No Projects Assigned Yet</h3>
                <p>Your CAVENTRA team is initializing your repository and scope. Your assigned founding engineer will link your project during onboarding.</p>
                <a class="btn sm" href="/contact/">Contact Us</a>
              </div>
            ` : `
              <div class="pt-project-card">
                <div class="pt-prj-header">
                  <div>
                    <h3>${esc(projects[0].name)}</h3>
                    <p class="pt-prj-desc">${esc(projects[0].description)}</p>
                  </div>
                  <span class="pt-status-pill pt-status-dev">${esc(projects[0].status)}</span>
                </div>

                <!-- Progress Bar -->
                <div class="pt-prog-wrapper">
                  <div class="pt-prog-labels">
                    <span>Overall Engineering Progress</span>
                    <strong>${projects[0].progress}%</strong>
                  </div>
                  <div class="pt-progress-bar">
                    <div class="pt-progress-fill" style="width: ${projects[0].progress}%"></div>
                  </div>
                </div>

                <div class="pt-prj-meta-grid">
                  <div>
                    <small>Start Date</small>
                    <strong>${fmtDate(projects[0].startDate)}</strong>
                  </div>
                  <div>
                    <small>Target Delivery</small>
                    <strong>${fmtDate(projects[0].estimatedCompletion)}</strong>
                  </div>
                  <div>
                    <small>Primary Contact</small>
                    <strong>${esc(projects[0].assignedContact)}</strong>
                  </div>
                </div>
              </div>
            `}
          </div>
        </div>
      `;
    }

    if (tab === 'projects') {
      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <h2>My Assigned Projects</h2>
          </div>
          ${projects.length === 0 ? `
            <div class="pt-empty-state">
              <h3>No Assigned Projects</h3>
              <p>You currently do not have any projects linked to this client account.</p>
            </div>
          ` : projects.map(p => `
            <div class="pt-panel" style="margin-bottom:24px">
              <div class="pt-prj-header">
                <div>
                  <h3>${esc(p.name)}</h3>
                  <p class="pt-prj-desc">${esc(p.description)}</p>
                </div>
                <span class="pt-status-pill pt-status-dev">${esc(p.status)}</span>
              </div>

              <div class="pt-prog-wrapper">
                <div class="pt-prog-labels">
                  <span>Milestone Completion</span>
                  <strong>${p.progress}%</strong>
                </div>
                <div class="pt-progress-bar">
                  <div class="pt-progress-fill" style="width: ${p.progress}%"></div>
                </div>
              </div>

              <!-- Milestones Checklist -->
              <h4 style="margin:20px 0 12px;font-size:15px;color:var(--gold)">Engineering Milestones</h4>
              <div class="pt-milestone-list">
                ${(p.milestones || []).map(m => `
                  <div class="pt-milestone-item ${m.status === 'Completed' ? 'is-done' : ''}">
                    <span class="pt-milestone-check">${m.status === 'Completed' ? '✓' : '○'}</span>
                    <span class="pt-milestone-name">${esc(m.name)}</span>
                    <span class="pt-milestone-status">${esc(m.status)}</span>
                    <span class="pt-milestone-date">${fmtDate(m.targetDate)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'updates') {
      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <h2>Project Updates & Milestone Sign-Offs</h2>
          </div>
          ${updates.length === 0 ? `
            <div class="pt-empty-state">
              <h3>No Updates Available</h3>
              <p>Your team will post engineering updates and milestone deliverables here.</p>
            </div>
          ` : updates.map(u => `
            <div class="pt-update-card ${u.needsApproval && !u.approved ? 'needs-action' : ''}">
              <div class="pt-upd-head">
                <div>
                  <span class="pt-badge-pill"><span class="dot"></span> ${esc(u.authorRole)}</span>
                  <h3>${esc(u.title)}</h3>
                  <small>Posted by ${esc(u.author)} · ${fmtDate(u.createdAt)}</small>
                </div>
                <div>
                  ${u.approved ? `
                    <span class="pt-status-pill pt-status-ok">✓ Milestone Approved</span>
                  ` : u.needsApproval ? `
                    <span class="pt-status-pill pt-status-warn">Pending Sign-off</span>
                  ` : ''}
                </div>
              </div>

              <div class="pt-upd-body">
                <p>${esc(u.notes)}</p>
              </div>

              ${u.needsApproval && !u.approved ? `
                <div class="pt-approval-box">
                  <label style="margin-bottom:8px">
                    <span style="font-size:12px;color:var(--tx-sub)">Feedback / Approval Notes (Optional)</span>
                    <input type="text" id="feedback-${esc(u.id)}" placeholder="e.g. Design reviewed and approved for development." style="padding:8px 12px;font-size:13px">
                  </label>
                  <button class="btn solid sm" data-pt-action="approve-milestone" data-upd-id="${esc(u.id)}">
                    Approve Milestone & Deliverables
                  </button>
                </div>
              ` : u.approved && u.clientFeedback ? `
                <div class="pt-feedback-note">
                  <strong>Client Sign-off:</strong> "${esc(u.clientFeedback)}" <small>(${fmtDate(u.approvedAt)})</small>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }

    if (tab === 'invoices') {
      const totalInv = invoices.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
      const totalPaid = invoices.reduce((acc, i) => acc + (Number(i.paidAmount) || 0), 0);
      const pendingDue = Math.max(0, totalInv - totalPaid);

      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <div>
              <h2>Invoices & Billing Statements</h2>
              <p style="font-size:13px;color:var(--tx-sub);margin-top:4px">Official billing statements, payment receipts, and settlement records issued by CAVENTRA.</p>
            </div>
            <button class="btn sm" data-pt-action="manual-sync" type="button" title="Synchronize with Cloud Firestore">↻ Sync Invoices</button>
          </div>

          <!-- Financial Snapshot -->
          <div class="pt-stats-grid" style="margin-bottom:24px">
            <div class="pt-stat-card">
              <div class="pt-stat-label">Total Invoiced</div>
              <div class="pt-stat-value">${fmtCurrency(totalInv, 'INR')}</div>
              <div class="pt-stat-sub">Official statements issued</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Paid to Date</div>
              <div class="pt-stat-value" style="color:#34A853">${fmtCurrency(totalPaid, 'INR')}</div>
              <div class="pt-stat-sub">Settled and verified</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Pending Due</div>
              <div class="pt-stat-value ${pendingDue > 0 ? 'pt-tx-gold' : ''}">${fmtCurrency(pendingDue, 'INR')}</div>
              <div class="pt-stat-sub">${pendingDue > 0 ? 'Awaiting settlement' : 'All accounts settled'}</div>
            </div>
          </div>

          ${invoices.length === 0 ? `
            <div class="pt-empty-state">
              <h3>No Invoices Issued Yet</h3>
              <p>When your CAVENTRA team issues milestone statements or project invoices, they will reflect here instantly with settlement instructions and digital receipts.</p>
            </div>
          ` : `
            <div class="pt-table-wrap">
              <table class="pt-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Settlement Info</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoices.map(inv => `
                    <tr>
                      <td>
                        <strong>${esc(inv.reference)}</strong>
                        <div style="font-size:11px;color:var(--tx-sub)">Issued ${fmtDate(inv.issuedDate || inv.createdAt)}</div>
                      </td>
                      <td>
                        <strong>${esc(inv.projectName || inv.description || 'Engineering Milestone')}</strong>
                        ${inv.notes ? `<div style="font-size:12px;color:var(--tx-sub);margin-top:2px">${esc(inv.notes)}</div>` : ''}
                      </td>
                      <td>
                        <strong style="font-size:15px">${fmtCurrency(inv.amount, inv.currency)}</strong>
                      </td>
                      <td>${fmtDate(inv.dueDate)}</td>
                      <td>
                        <span class="pt-status-pill ${inv.status === 'Paid' ? 'pt-status-ok' : (inv.status === 'Partially Paid' ? 'pt-status-warn' : 'pt-status-dev')}">
                          ${esc(inv.status)}
                        </span>
                      </td>
                      <td>
                        ${inv.status === 'Paid' ? `
                          <div style="font-size:12px;color:#34A853">
                            ✓ Paid in full (${fmtDate(inv.paymentDate)})
                            ${inv.transactionRef ? `<div style="font-size:11px;color:var(--mut)">Ref: ${esc(inv.transactionRef)}</div>` : ''}
                          </div>
                        ` : `
                          <div style="display:flex;gap:6px;align-items:center">
                            <span style="font-size:12px;color:var(--gold)">Pending ₹${Number(inv.amount - (inv.paidAmount || 0)).toLocaleString('en-IN')}</span>
                            <button class="btn solid sm" style="padding:4px 10px;font-size:11px" data-pt-action="view-payment-instructions" data-inv-ref="${esc(inv.reference)}" data-inv-amt="${esc(inv.amount)}">Pay / Settle</button>
                          </div>
                        `}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    }

    if (tab === 'documents') {
      const store = global.CaventraStore;
      const docs = store.getDb().documents || [];
      const userDocs = docs.filter(d => d.userId === user.uid || isFounder);
      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <h2>Project Deliverables & Documents</h2>
          </div>
          ${userDocs.length === 0 ? `
            <div class="pt-empty-state">
              <h3>No Documents Shared Yet</h3>
              <p>Project proposals, specifications, and architecture briefs will be attached here upon contract execution.</p>
            </div>
          ` : `
            <div class="pt-table-wrap">
              <table class="pt-table">
                <thead>
                  <tr>
                    <th>Document Title</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${userDocs.map(d => `
                    <tr>
                      <td><strong>${esc(d.title)}</strong></td>
                      <td>${esc(d.type)}</td>
                      <td>${esc(d.size)}</td>
                      <td>${fmtDate(d.date)}</td>
                      <td><a class="btn sm" href="#" onclick="alert('Document download simulated in dev environment.');return false">Download</a></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    }

    if (tab === 'support') {
      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <h2>Support & Engineering Inquiries</h2>
            <button class="btn solid sm" data-pt-action="open-ticket-modal">Submit Support Request</button>
          </div>

          <!-- Open Ticket Modal Container (hidden by default) -->
          <div id="pt-ticket-modal" class="pt-modal" style="display:none">
            <div class="pt-modal-dialog">
              <div class="pt-modal-head">
                <h3>Submit Support Request</h3>
                <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
              </div>
              <form id="pt-form-ticket" class="pt-form">
                <label>
                  <span>Subject *</span>
                  <input type="text" name="subject" required placeholder="e.g. Domain DNS configuration assistance">
                </label>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                  <label>
                    <span>Category</span>
                    <select name="category">
                      <option value="Technical Access">Technical Access</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Billing">Billing & Milestones</option>
                    </select>
                  </label>
                  <label>
                    <span>Priority</span>
                    <select name="priority">
                      <option value="Low">Low</option>
                      <option value="Medium" selected>Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>Description *</span>
                  <textarea name="description" rows="4" required placeholder="Describe your request or question in detail..."></textarea>
                </label>
                <div style="display:flex;justify-content:flex-end;gap:10px">
                  <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
                  <button class="btn solid" type="submit">Submit Request</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Tickets Table -->
          ${tickets.length === 0 ? `
            <div class="pt-empty-state">
              <h3>No Support Tickets</h3>
              <p>Need assistance or have questions for your development team? Submit a support request above.</p>
            </div>
          ` : `
            <div class="pt-table-wrap">
              <table class="pt-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Resolution Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${tickets.map(t => `
                    <tr>
                      <td>
                        <strong>${esc(t.subject)}</strong>
                        <div style="font-size:12px;color:var(--tx-sub);margin-top:4px">${esc(t.description)}</div>
                      </td>
                      <td>${esc(t.category)}</td>
                      <td><span class="pt-prio pt-prio-${esc(t.priority.toLowerCase())}">${esc(t.priority)}</span></td>
                      <td><span class="pt-status-pill pt-status-${esc(t.status.toLowerCase().replace(/\s+/g,'-'))}">${esc(t.status)}</span></td>
                      <td>${fmtDate(t.createdAt)}</td>
                      <td>
                        ${t.resolutionNotes ? `<span style="color:var(--gold)">${esc(t.resolutionNotes)}</span>` : '<span style="color:var(--tx-sub)">Pending review</span>'}
                      </td>
                      <td>
                        <button class="btn sm" data-pt-action="open-ticket-thread" data-tkt-id="${esc(t.id)}">Discussion (${(t.comments || []).length})</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;
    }

    if (tab === 'profile') {
      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <h2>Personal Profile & Security</h2>
          </div>

          <div class="pt-profile-grid">
            <div class="pt-panel">
              <h3>Profile Details</h3>
              <form id="pt-form-profile" class="pt-form" style="margin-top:16px">
                <label>
                  <span>Display Name</span>
                  <input type="text" name="displayName" value="${esc(user.displayName)}">
                </label>
                <label>
                  <span>Company / Organization</span>
                  <input type="text" name="company" value="${esc(user.company || '')}">
                </label>
                <label>
                  <span>Phone Number</span>
                  <input type="tel" name="phone" value="${esc(user.phone || '')}">
                </label>
                <label>
                  <span>Account Email (Read-Only)</span>
                  <input type="email" value="${esc(user.email)}" disabled style="opacity:0.6">
                </label>
                <button class="btn solid sm" type="submit">Save Changes</button>
              </form>
            </div>

            <div class="pt-panel">
              <h3>Account Status & Security</h3>
              <div class="pt-meta-list" style="margin-top:16px">
                <div class="pt-meta-row">
                  <span>Assigned Role</span>
                  <strong>${esc(user.role.toUpperCase())}</strong>
                </div>
                <div class="pt-meta-row">
                  <span>Email Verification</span>
                  <strong>${user.emailVerified ? '✓ Verified' : '<button class="btn sm pt-btn-warn" data-pt-action="request-email-otp" type="button" style="padding:4px 10px;font-size:11px">⚠️ Verify via OTP</button>'}</strong>
                </div>
                <div class="pt-meta-row" style="align-items:center">
                  <div>
                    <span>Two-Factor Authentication (2FA)</span>
                    <div style="font-size:11px;color:var(--tx-sub)">Require 6-digit OTP on login</div>
                  </div>
                  <label class="pt-switch">
                    <input type="checkbox" id="pt-toggle-2fa" ${user.twoFactorEnabled ? 'checked' : ''}>
                    <span class="pt-switch-slider"></span>
                  </label>
                </div>
                <div class="pt-meta-row">
                  <span>Member Since</span>
                  <strong>${fmtDate(user.createdAt)}</strong>
                </div>
                <div class="pt-meta-row">
                  <span>Development Project</span>
                  <strong>caventra-dev</strong>
                </div>
              </div>

              <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--line)">
                <button class="btn w-full" data-pt-action="logout" type="button">Sign Out Securely</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  function renderTicketThreadModal(isStaff) {
    return `
      <!-- Ticket Discussion Thread Modal -->
      <div id="pt-ticket-thread-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog" style="max-width:680px">
          <div class="pt-modal-head">
            <div>
              <h3 id="pt-thread-title">Ticket Discussion</h3>
              <div id="pt-thread-meta" style="font-size:12px;color:var(--tx-sub);margin-top:2px"></div>
            </div>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <div style="padding:16px 20px;max-height:68vh;overflow-y:auto">
            <div style="background:var(--bg2);padding:14px;border-radius:6px;border:1px solid var(--line);margin-bottom:16px">
              <div style="font-size:11px;font-weight:600;color:var(--tx-sub);margin-bottom:4px">ISSUE DESCRIPTION & CONTEXT:</div>
              <div id="pt-thread-desc" style="font-size:13px;white-space:pre-wrap;color:var(--tx)"></div>
            </div>

            <div style="font-size:12px;font-weight:600;margin-bottom:8px;color:var(--tx-sub)">ACTIVITY & COMMENTS THREAD:</div>
            <div id="pt-thread-comments-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px"></div>

            <form id="pt-form-ticket-reply" class="pt-form">
              <input type="hidden" name="ticketId" id="pt-thread-ticket-id">
              <label>
                <span>Add Comment / Status Update *</span>
                <textarea name="comment" rows="3" required placeholder="Type your comment, update, or testing results..."></textarea>
              </label>
              <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
                ${isStaff ? `
                  <button class="btn sm" type="button" id="pt-btn-quick-resolve" data-pt-action="quick-resolve-ticket" style="border-color:var(--gold);color:var(--gold)">Mark as Resolved</button>
                ` : `<div></div>`}
                <div style="display:flex;gap:10px;margin-left:auto">
                  <button class="btn" type="button" data-pt-action="close-modal">Close</button>
                  <button class="btn solid" type="submit">Post Comment</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  function renderFounderModals(users, projects, invoices, tickets, clients = []) {
    const clientUsers = (users || []).filter(u => u.role === 'client');
    const invoiceCount = (invoices || []).length;
    const projectList = projects || [];
    const clientList = clients || [];

    // Unified client accounts list combining registered user accounts & CRM clients
    const clientOptionMap = new Map();
    clientUsers.forEach(u => {
      if (u.email) {
        clientOptionMap.set(u.email.toLowerCase(), {
          email: u.email,
          userId: u.uid,
          clientId: '',
          label: `${u.displayName || u.email} (${u.email}) [User Account]`
        });
      }
    });
    clientList.forEach(c => {
      const em = (c.email || '').toLowerCase();
      if (em) {
        if (!clientOptionMap.has(em)) {
          clientOptionMap.set(em, {
            email: c.email,
            userId: c.userId || '',
            clientId: c.id,
            label: `${c.companyName || c.contactName} (${c.email}) [CRM Client]`
          });
        } else {
          const entry = clientOptionMap.get(em);
          if (!entry.clientId) entry.clientId = c.id;
        }
      }
    });
    const clientOptionsArray = Array.from(clientOptionMap.values());

    const internalTeam = (users || []).filter(u => u.role === 'founder' || u.role === 'team' || u.role === 'employee');
    const coreFounders = [
      { displayName: 'Hriday Vayanta', title: 'Head of Growth', email: 'hridayvayanta7@gmail.com' },
      { displayName: 'Sauranahmed Mansuri', title: 'Head of Technology', email: 'sauran.caventra@gmail.com' },
      { displayName: 'Ved Nimbaark', title: 'Head of Design', email: 'vednimbark08@gmail.com' }
    ];
    coreFounders.forEach(cf => {
      if (!internalTeam.some(u => u.email && u.email.toLowerCase() === cf.email.toLowerCase())) {
        internalTeam.push(cf);
      }
    });

    return `
      <!-- Create Lead Modal -->
      <div id="pt-lead-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog">
          <div class="pt-modal-head">
            <h3>Create New Sales Lead</h3>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <form id="pt-form-create-lead" class="pt-form">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Company Name *</span>
                <input type="text" name="companyName" required placeholder="Acme Technologies">
              </label>
              <label>
                <span>Contact Name (Letters only) *</span>
                <input type="text" name="contactName" required placeholder="Rohan Sharma" pattern="[A-Za-z\\s.'-]{2,}" title="Letters only, no numbers allowed" oninput="this.value=this.value.replace(/[0-9]/g,'')">
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Email Address *</span>
                <input type="email" name="email" required placeholder="contact@acme.com">
              </label>
              <label>
                <span>Phone Number</span>
                <input type="tel" name="phone" placeholder="+91 98765 00000">
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
              <label>
                <span>Enquiry Source</span>
                <select name="source">
                  <option value="Website Estimator">Website Estimator</option>
                  <option value="Start a Project Form">Start a Project Form</option>
                  <option value="Referral">Referral</option>
                  <option value="Direct Outreach">Direct Outreach</option>
                </select>
              </label>
              <label>
                <span>Sales Stage</span>
                <select name="stage">
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </label>
              <label>
                <span>Assigned Owner</span>
                <select name="owner">
                  <option value="Hriday Vayanta">Hriday Vayanta (Growth)</option>
                  <option value="Sauranahmed Mansuri">Sauranahmed Mansuri (Tech)</option>
                  <option value="Ved Nimbaark">Ved Nimbaark (Design)</option>
                </select>
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Estimated Budget</span>
                <input type="text" name="budget" placeholder="e.g. ₹1,50,000">
              </label>
              <label>
                <span>Follow-up Date</span>
                <input type="date" name="followUpDate">
              </label>
            </div>
            <label>
              <span>Internal Notes</span>
              <textarea name="notes" rows="3" placeholder="Project requirements, scope considerations, notes..."></textarea>
            </label>
            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
              <button class="btn solid" type="submit">Create Lead</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Lead Modal -->
      <div id="pt-edit-lead-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog">
          <div class="pt-modal-head">
            <h3>Edit Sales Lead</h3>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <form id="pt-form-edit-lead" class="pt-form">
            <input type="hidden" name="leadId">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Company Name *</span>
                <input type="text" name="companyName" required placeholder="Acme Technologies">
              </label>
              <label>
                <span>Contact Name (Letters only) *</span>
                <input type="text" name="contactName" required placeholder="Rohan Sharma" pattern="[A-Za-z\\s.'-]{2,}" title="Letters only, no numbers allowed" oninput="this.value=this.value.replace(/[0-9]/g,'')">
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Email Address *</span>
                <input type="email" name="email" required placeholder="contact@acme.com">
              </label>
              <label>
                <span>Phone Number</span>
                <input type="tel" name="phone" placeholder="+91 98765 00000">
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
              <label>
                <span>Enquiry Source</span>
                <select name="source">
                  <option value="Website Estimator">Website Estimator</option>
                  <option value="Start a Project Form">Start a Project Form</option>
                  <option value="Referral">Referral</option>
                  <option value="Direct Outreach">Direct Outreach</option>
                </select>
              </label>
              <label>
                <span>Sales Stage</span>
                <select name="stage">
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </label>
              <label>
                <span>Assigned Owner</span>
                <select name="owner">
                  <option value="Hriday Vayanta">Hriday Vayanta (Growth)</option>
                  <option value="Sauranahmed Mansuri">Sauranahmed Mansuri (Tech)</option>
                  <option value="Ved Nimbaark">Ved Nimbaark (Design)</option>
                </select>
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Estimated Budget</span>
                <input type="text" name="budget" placeholder="e.g. ₹1,50,000">
              </label>
              <label>
                <span>Follow-up Date</span>
                <input type="date" name="followUpDate">
              </label>
            </div>
            <label>
              <span>Internal Notes</span>
              <textarea name="notes" rows="3" placeholder="Project requirements, scope considerations, notes..."></textarea>
            </label>
            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
              <button class="btn solid" type="submit">Update Lead</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Create Client Modal -->
      <div id="pt-client-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog">
          <div class="pt-modal-head">
            <h3>Add New Client Record</h3>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <form id="pt-form-create-client" class="pt-form">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Company Name *</span>
                <input type="text" name="companyName" required placeholder="Zenith Retail Ltd">
              </label>
              <label>
                <span>Contact Name (Letters only) *</span>
                <input type="text" name="contactName" required placeholder="Ananya Sharma" pattern="[A-Za-z\\s.'-]{2,}" title="Letters only, no numbers allowed" oninput="this.value=this.value.replace(/[0-9]/g,'')">
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Email Address *</span>
                <input type="email" name="email" required placeholder="ananya@zenith.com">
              </label>
              <label>
                <span>Phone Number</span>
                <input type="tel" name="phone" placeholder="+91 98220 00000">
              </label>
            </div>
            <label>
              <span>Link to Authenticated User</span>
              <select name="userId">
                <option value="">None (Stand-alone record)</option>
                ${clientUsers.map(u => `
                  <option value="${esc(u.uid)}">${esc(u.displayName)} (${esc(u.email)})</option>
                `).join('')}
              </select>
            </label>
            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
              <button class="btn solid" type="submit">Save Client</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Client Modal -->
      <div id="pt-edit-client-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog">
          <div class="pt-modal-head">
            <h3>Manage Client Record</h3>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <form id="pt-form-edit-client" class="pt-form">
            <input type="hidden" name="clientId">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Company Name *</span>
                <input type="text" name="companyName" required placeholder="Zenith Retail Ltd">
              </label>
              <label>
                <span>Contact Name (Letters only) *</span>
                <input type="text" name="contactName" required placeholder="Ananya Sharma" pattern="[A-Za-z\\s.'-]{2,}" title="Letters only, no numbers allowed" oninput="this.value=this.value.replace(/[0-9]/g,'')">
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Email Address *</span>
                <input type="email" name="email" required placeholder="ananya@zenith.com">
              </label>
              <label>
                <span>Phone Number</span>
                <input type="tel" name="phone" placeholder="+91 98220 00000">
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Status</span>
                <select name="status">
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
              <label>
                <span>Assigned Founder</span>
                <select name="assignedFounder">
                  <option value="Hriday Vayanta">Hriday Vayanta</option>
                  <option value="Sauranahmed Mansuri">Sauranahmed Mansuri</option>
                  <option value="Ved Nimbaark">Ved Nimbaark</option>
                </select>
              </label>
            </div>
            <label>
              <span>Link to Authenticated User</span>
              <select name="userId">
                <option value="">None (Stand-alone record)</option>
                ${clientUsers.map(u => `
                  <option value="${esc(u.uid)}">${esc(u.displayName)} (${esc(u.email)})</option>
                `).join('')}
              </select>
            </label>
            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
              <button class="btn solid" type="submit">Update Client</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Create Project Modal -->
      <div id="pt-project-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog">
          <div class="pt-modal-head">
            <h3>Create New Client Project</h3>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <form id="pt-form-create-project" class="pt-form">
            <label>
              <span>Project Title *</span>
              <input type="text" name="name" required placeholder="e.g. Apex Health Cloud Portal">
            </label>
            <label>
              <span>Assign to Client Account *</span>
              <select name="clientSelect" required id="pt-prj-client-select">
                ${clientOptionsArray.map(co => `
                  <option value="${esc(co.email)}" data-uid="${esc(co.userId || '')}" data-cid="${esc(co.clientId || '')}">${esc(co.label)}</option>
                `).join('')}
                <option value="__custom__" ${clientOptionsArray.length === 0 ? 'selected' : ''}>+ Enter Client Email Directly...</option>
              </select>
            </label>
            <div id="pt-prj-custom-email-group" style="${clientOptionsArray.length > 0 ? 'display:none;' : ''}margin-top:8px">
              <label>
                <span>Client Email Address *</span>
                <input type="email" name="customEmail" placeholder="client@company.com" ${clientOptionsArray.length === 0 ? 'required' : ''}>
              </label>
            </div>
            <label>
              <span>Assigned Contact / Team Lead</span>
              <select name="assignedContact">
                <option value="Hriday Vayanta (Growth)">Hriday Vayanta (Growth)</option>
                <option value="Sauranahmed Mansuri (Tech)">Sauranahmed Mansuri (Tech)</option>
                <option value="Ved Nimbaark (Design)">Ved Nimbaark (Design)</option>
              </select>
            </label>
            <label>
              <span>Project Overview & Scope</span>
              <textarea name="description" rows="3" placeholder="Full-stack web engineering, API integrations, and SLA deliverables..."></textarea>
            </label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Delivery Stage</span>
                <select name="status">
                  <option value="Discovery">Discovery</option>
                  <option value="In Development" selected>In Development</option>
                  <option value="Client Review">Client Review</option>
                  <option value="Launched">Launched</option>
                </select>
              </label>
              <label>
                <span>Estimated Completion Date</span>
                <input type="date" name="estimatedCompletion">
              </label>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
              <button class="btn solid" type="submit">Create Project</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Project Modal -->
      <div id="pt-edit-project-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog">
          <div class="pt-modal-head">
            <h3>Edit Project Details</h3>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <form id="pt-form-edit-project" class="pt-form">
            <input type="hidden" name="projectId">
            <label>
              <span>Project Title *</span>
              <input type="text" name="name" required placeholder="e.g. Apex Health Cloud Portal">
            </label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Client Email *</span>
                <input type="email" name="clientEmail" required placeholder="client@company.com">
              </label>
              <label>
                <span>Assigned Contact</span>
                <input type="text" name="assignedContact" placeholder="Hriday Vayanta (Growth)">
              </label>
            </div>
            <label>
              <span>Project Overview & Scope</span>
              <textarea name="description" rows="3" placeholder="Full-stack engineering deliverables..."></textarea>
            </label>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
              <label>
                <span>Delivery Stage</span>
                <select name="status">
                  <option value="Discovery">Discovery</option>
                  <option value="In Development">In Development</option>
                  <option value="Client Review">Client Review</option>
                  <option value="Launched">Launched</option>
                </select>
              </label>
              <label>
                <span>Progress (%)</span>
                <input type="number" name="progress" min="0" max="100" placeholder="0">
              </label>
              <label>
                <span>Target Delivery</span>
                <input type="date" name="estimatedCompletion">
              </label>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
              <button class="btn solid" type="submit">Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Post Project Update Modal -->
      <div id="pt-update-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog">
          <div class="pt-modal-head">
            <h3>Post Client Progress Update</h3>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <form id="pt-form-post-update" class="pt-form">
            <label>
              <span>Target Project *</span>
              <select name="projectId" required>
                ${projectList.map(p => `
                  <option value="${esc(p.id)}">${esc(p.name)} (${esc(p.clientEmail || 'Client')})</option>
                `).join('') || '<option value="" disabled selected>No active projects to update</option>'}
              </select>
            </label>
            <label>
              <span>Update Title *</span>
              <input type="text" name="title" required placeholder="e.g. Sprint 3 Deployed to Staging">
            </label>
            <label>
              <span>Update Notes for Client *</span>
              <textarea name="notes" rows="4" required placeholder="Summary of changes delivered, testing instructions, and next steps..."></textarea>
            </label>
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
              <input type="checkbox" name="needsApproval" value="true">
              <span>Requires Milestone Sign-off from Client</span>
            </label>
            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
              <button class="btn solid" type="submit">Publish Update</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Create Invoice Modal -->
      <div id="pt-invoice-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog">
          <div class="pt-modal-head">
            <h3>Issue Client Invoice</h3>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <form id="pt-form-create-invoice" class="pt-form">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Invoice Reference *</span>
                <input type="text" name="reference" required value="INV-2026-00${invoiceCount + 1}">
              </label>
              <label>
                <span>Select Client *</span>
                <select name="clientSelect" required id="pt-inv-client-select">
                  ${clientOptionsArray.map(co => `
                    <option value="${esc(co.email)}" data-uid="${esc(co.userId || '')}">${esc(co.label)}</option>
                  `).join('') || '<option value="" disabled selected>No client accounts registered yet</option>'}
                </select>
              </label>
            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:12px">
              <label>
                <span>Amount *</span>
                <input type="number" name="amount" required placeholder="85000">
              </label>
              <label>
                <span>Currency</span>
                <select name="currency">
                  <option value="INR" selected>INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </label>
              <label>
                <span>Due Date</span>
                <input type="date" name="dueDate">
              </label>
            </div>
            <label>
              <span>Description / Scope *</span>
              <input type="text" name="description" required placeholder="Milestone 2 — Architecture & Frontend Engineering">
            </label>
            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
              <button class="btn solid" type="submit">Issue Invoice</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Record Payment Modal -->
      <div id="pt-payment-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog">
          <div class="pt-modal-head">
            <h3>Record Manual Payment Verification</h3>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <form id="pt-form-record-payment" class="pt-form">
            <input type="hidden" name="invoiceId" id="pt-pay-inv-id">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Paid Amount *</span>
                <input type="number" name="paidAmount" id="pt-pay-amount" required>
              </label>
              <label>
                <span>Payment Date *</span>
                <input type="date" name="paymentDate" required value="${new Date().toISOString().slice(0, 10)}">
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Payment Method</span>
                <select name="paymentMethod">
                  <option value="Bank Transfer (IMPS/NEFT)">Bank Transfer (IMPS/NEFT)</option>
                  <option value="UPI">UPI Transfer</option>
                  <option value="Wire (International)">Wire Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </label>
              <label>
                <span>Transaction Reference</span>
                <input type="text" name="transactionRef" placeholder="e.g. IMPS/AXIS/918237">
              </label>
            </div>
            <label>
              <span>Verification Notes</span>
              <textarea name="notes" rows="2" placeholder="Bank ledger confirmation notes..."></textarea>
            </label>
            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
              <button class="btn solid" type="submit">Confirm Payment</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Raise Corporate Ticket Modal -->
      <div id="pt-corp-ticket-modal" class="pt-modal" style="display:none">
        <div class="pt-modal-dialog" style="max-width:580px">
          <div class="pt-modal-head">
            <div>
              <h3>Raise Corporate Ticket / Task</h3>
              <p style="font-size:12px;color:var(--tx-sub);margin-top:2px">Assign a corporate task or technical blocker to another founder or team member.</p>
            </div>
            <button class="pt-modal-close" data-pt-action="close-modal">&times;</button>
          </div>
          <form id="pt-form-corp-ticket" class="pt-form">
            <label>
              <span>Task / Ticket Subject *</span>
              <input type="text" name="subject" required placeholder="e.g. Implement Webhook listener for payment gateway">
            </label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Assign To Team Member *</span>
                <select name="assignedFounder" id="pt-corp-assignee-select" required>
                  <option value="" disabled selected>Select Assignee...</option>
                  ${internalTeam.map(tm => `
                    <option value="${esc(tm.displayName)}" data-email="${esc(tm.email)}">${esc(tm.displayName)} (${esc(tm.title || tm.role || 'Team')})</option>
                  `).join('')}
                </select>
              </label>
              <label>
                <span>Assignee Email (Receives Task Alert) *</span>
                <input type="email" name="assignedToEmail" id="pt-corp-assignee-email" required placeholder="assignee@company.com">
              </label>
            </div>
            <div style="font-size:12px;color:var(--gold);margin:-6px 0 12px;display:flex;align-items:center;gap:6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>Automated notification will be sent directly to this email from <strong>caventraofficial@gmail.com</strong>.</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Department / Category *</span>
                <select name="category" required>
                  <option value="Technical / Backend" selected>Technical / Backend</option>
                  <option value="Frontend / UI">Frontend / UI</option>
                  <option value="Design / UX">Design / UX</option>
                  <option value="Client Milestone Delivery">Client Milestone Delivery</option>
                  <option value="Infrastructure / DevOps">Infrastructure / DevOps</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                  <option value="Executive / Operations">Executive / Operations</option>
                  <option value="Bug / Critical Blocker">Bug / Critical Blocker</option>
                </select>
              </label>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <label>
                <span>Priority *</span>
                <select name="priority" required>
                  <option value="Medium" selected>Medium Priority</option>
                  <option value="Low">Low Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent / Critical Blocker</option>
                </select>
              </label>
              <label>
                <span>Target Due Date</span>
                <input type="date" name="dueDate">
              </label>
            </div>
            <label>
              <span>Detailed Requirements & Acceptance Criteria *</span>
              <textarea name="description" rows="4" required placeholder="Context, files to touch, steps to reproduce, or milestone deliverables..."></textarea>
            </label>
            <div style="display:flex;justify-content:flex-end;gap:10px">
              <button class="btn" type="button" data-pt-action="close-modal">Cancel</button>
              <button class="btn solid" type="submit">Publish Corporate Ticket</button>
            </div>
          </form>
        </div>
      </div>

      ${renderTicketThreadModal(true)}
    `;
  }

  // 5. FOUNDER DASHBOARD VIEW
  function renderFounderDashboard() {
    const user = global.CaventraAuth ? global.CaventraAuth.getCurrentUser() : null;
    if (!user) {
      return renderLogin({ type: 'error', text: 'Authentication required. Founder sign-in required.' });
    }

    const isFounder = global.CaventraAuth.isFounder(user);
    const isTeam = global.CaventraAuth.isTeamMember(user);
    if (!isFounder && !isTeam) {
      return `
        <div class="wrap pt-page" style="padding:100px 16px;text-align:center;max-width:640px;margin:0 auto">
          <div class="pt-badge-pill" style="margin-bottom:20px;background:rgba(234,67,53,0.15);color:#EA4335"><span class="dot" style="background:#EA4335"></span> ACCESS DENIED</div>
          <h2 style="font-size:32px;margin-bottom:14px">Internal Access Required</h2>
          <p style="color:var(--tx-sub);margin-bottom:28px">Your authenticated account (<strong>${esc(user.email)}</strong>) holds the <strong>${esc(user.role)}</strong> role. Administrative dashboards are restricted to authorized CAVENTRA team members.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <a class="btn solid" href="/client-dashboard/">Go to Client Dashboard</a>
            <button class="btn" data-pt-action="logout" type="button">Sign Out</button>
          </div>
        </div>
      `;
    }

    const store = global.CaventraStore;
    const leads = store.getLeads(user);
    const clients = store.getClients(user);
    const projects = store.getProjects(user);
    const invoices = store.getInvoices(user);
    const tickets = store.getSupportTickets(user);
    const users = store.getUsers(user);
    const logs = isFounder ? store.getActivityLogs(user) : [];
    const pendingTeamMembers = (isFounder && store.getPendingTeamMembers) ? store.getPendingTeamMembers(user) : [];

    // High Level Metrics
    const totalInvoiced = invoices.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
    const totalReceived = invoices.reduce((acc, i) => acc + (Number(i.paidAmount) || 0), 0);
    const pendingBalance = totalInvoiced - totalReceived;
    const pendingApprovalsCount = store.getDb().projectUpdates?.filter(u => u.needsApproval && !u.approved).length || 0;

    return `
      <div class="pt-dash-container">
        <!-- Founder / Team Command Header -->
        <header class="pt-dash-header pt-founder-header">
          <div class="wrap pt-dash-header-wrap">
            <div class="pt-dash-brand">
              <span class="pt-badge-pill" style="border-color:${isFounder ? 'var(--gold)' : 'var(--accent)'};color:${isFounder ? 'var(--gold)' : 'var(--accent)'}"><span class="dot" style="background:${isFounder ? 'var(--gold)' : 'var(--accent)'}"></span> ${isFounder ? 'FOUNDER COMMAND' : 'CAVENTRA TEAM PORTAL'}</span>
              <h1>${esc(user.displayName)}</h1>
              <p>${esc(user.title || (isFounder ? 'Founder' : 'Team Member'))} · CAVENTRA Corporate Suite</p>
            </div>

            <div class="pt-header-actions">
              <span class="pt-badge-pill" style="border-color:rgba(212,175,55,0.4);color:var(--gold)" title="Real-time Cloud Firestore synchronization"><span class="dot" style="background:var(--gold)"></span> Cloud Synced</span>
              <button class="btn sm" data-pt-action="manual-sync" type="button" title="Synchronize with Cloud Firestore" style="padding:6px 10px;font-size:12px">↻ Sync</button>
              <a class="btn sm" href="/client-dashboard/" style="background:var(--bg3)">View Client Portal</a>
              <button class="btn sm" data-pt-action="logout" type="button">Sign Out</button>
            </div>
          </div>

          <!-- Founder / Team Tab Bar -->
          <div class="wrap pt-tabs-wrap">
            <nav class="pt-nav-tabs">
              <button class="pt-tab-btn ${founderActiveTab === 'overview' ? 'active' : ''}" data-pt-ftab="overview">Overview</button>
              <button class="pt-tab-btn ${founderActiveTab === 'leads' ? 'active' : ''}" data-pt-ftab="leads">Leads (${leads.length})</button>
              <button class="pt-tab-btn ${founderActiveTab === 'clients' ? 'active' : ''}" data-pt-ftab="clients">Clients (${clients.length})</button>
              <button class="pt-tab-btn ${founderActiveTab === 'projects' ? 'active' : ''}" data-pt-ftab="projects">Projects (${projects.length})</button>
              <button class="pt-tab-btn ${founderActiveTab === 'invoices' ? 'active' : ''}" data-pt-ftab="invoices">Invoices & Payments</button>
              <button class="pt-tab-btn ${founderActiveTab === 'support' ? 'active' : ''}" data-pt-ftab="support">Tickets & Operations (${tickets.filter(t => t.status !== 'Resolved').length})</button>
              <button class="pt-tab-btn ${founderActiveTab === 'admin' ? 'active' : ''}" data-pt-ftab="admin">Administration (${users.length})${pendingTeamMembers.length > 0 ? ` <span class="pt-badge-pill" style="background:#ea4335;color:#fff;border-color:#ea4335;padding:1px 6px;font-size:10px;margin-left:4px">${pendingTeamMembers.length}</span>` : ''}</button>
            </nav>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="wrap pt-dash-content">
          ${renderFounderTabContent(founderActiveTab, user, leads, clients, projects, invoices, tickets, users, logs, totalInvoiced, totalReceived, pendingBalance, pendingApprovalsCount, pendingTeamMembers)}
        </main>
        ${renderFounderModals(users, projects, invoices, tickets, clients)}
      </div>
    `;
  }

  function renderFounderTabContent(tab, user, leads, clients, projects, invoices, tickets, users, logs, totalInvoiced, totalReceived, pendingBalance, pendingApprovalsCount, pendingTeamMembers = []) {
    const store = global.CaventraStore;

    if (tab === 'overview') {
      return `
        <div class="pt-tab-pane">
          <!-- Pending Team Member Approvals (Founder Administration) -->
          ${pendingTeamMembers.length > 0 ? `
            <div class="pt-action-card" style="border-color:var(--gold);background:rgba(212,175,55,0.08);margin-bottom:24px">
              <div class="pt-action-icon" style="background:rgba(212,175,55,0.2);color:var(--gold)">🛡️</div>
              <div class="pt-action-body">
                <div style="font-size:11px;font-weight:700;color:var(--gold);letter-spacing:1px;text-transform:uppercase">Action Required · Founder Administration</div>
                <h3 style="margin:4px 0 6px">Pending Team Member Access Requests (${pendingTeamMembers.length})</h3>
                <p style="color:var(--tx-sub);font-size:13px">The following candidate(s) verified their email and requested internal Caventra Team access. Approving grants access to the internal operations portal:</p>
                <div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">
                  ${pendingTeamMembers.map(ptm => `
                    <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg2);padding:10px 14px;border-radius:6px;border:1px solid var(--line);flex-wrap:wrap;gap:10px">
                      <div>
                        <strong>${esc(ptm.displayName)}</strong> · <span style="color:var(--tx-sub);font-size:12px">${esc(ptm.email)}</span> ${ptm.phone ? `· <span style="color:var(--mut);font-size:12px">${esc(ptm.phone)}</span>` : ''}
                        <div style="font-size:11px;color:var(--gold);margin-top:2px">Requested: ${esc(ptm.title || 'Team Member')} · ${fmtDate(ptm.createdAt)}</div>
                      </div>
                      <div style="display:flex;gap:8px">
                        <button class="btn sm solid" data-pt-action="approve-team-member" data-uid="${esc(ptm.uid)}" style="background:#238636;border-color:#2ea043;color:#fff">✓ Approve Access</button>
                        <button class="btn sm" data-pt-action="reject-team-member" data-uid="${esc(ptm.uid)}" style="color:#f85149;border-color:rgba(248,81,73,0.4)">✕ Reject</button>
                        <button class="btn sm" data-pt-action="remove-user" data-uid="${esc(ptm.uid)}" data-name="${esc(ptm.displayName || ptm.email)}" style="color:#f85149;border-color:rgba(248,81,73,0.4)" title="Remove Application">🗑 Remove</button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Founder Executive Stats Grid -->
          <div class="pt-stats-grid pt-founder-stats">
            <div class="pt-stat-card">
              <div class="pt-stat-label">Active Leads</div>
              <div class="pt-stat-value">${leads.length}</div>
              <div class="pt-stat-sub">Sales Pipeline Enquiries</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Active Clients</div>
              <div class="pt-stat-value">${clients.length}</div>
              <div class="pt-stat-sub">Engaged Organizations</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Live Projects</div>
              <div class="pt-stat-value">${projects.length}</div>
              <div class="pt-stat-sub">In active delivery</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Pending Approvals</div>
              <div class="pt-stat-value ${pendingApprovalsCount ? 'pt-tx-gold' : ''}">${pendingApprovalsCount}</div>
              <div class="pt-stat-sub">Milestones awaiting client sign-off</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Total Invoiced</div>
              <div class="pt-stat-value">${fmtCurrency(totalInvoiced, 'INR')}</div>
              <div class="pt-stat-sub">Issued contract billings</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Collected Revenue</div>
              <div class="pt-stat-value pt-tx-ok">${fmtCurrency(totalReceived, 'INR')}</div>
              <div class="pt-stat-sub">Verified payments credited</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Outstanding Balance</div>
              <div class="pt-stat-value ${pendingBalance > 0 ? 'pt-tx-warn' : ''}">${fmtCurrency(pendingBalance, 'INR')}</div>
              <div class="pt-stat-sub">Pending milestone receipts</div>
            </div>
          </div>

          <!-- Quick Action Bar -->
          <div class="pt-quick-actions-bar">
            <span>QUICK FOUNDER ACTIONS:</span>
            <button class="btn solid sm" data-pt-action="open-create-lead">＋ New Lead</button>
            <button class="btn solid sm" data-pt-action="open-create-project">＋ New Project</button>
            <button class="btn solid sm" data-pt-action="open-create-invoice">＋ Issue Invoice</button>
            <button class="btn solid sm" data-pt-action="open-corp-ticket" style="background:#1d2939;border-color:var(--accent)">＋ Corporate Ticket</button>
          </div>

          <!-- Two Column View: Recent Activity & Leads Spotlight -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px">
            <div class="pt-panel">
              <div class="pt-panel-head">
                <h3>Recent Leads Pipeline</h3>
                <button class="btn sm" data-pt-ftab="leads">All Leads</button>
              </div>
              <div class="pt-mini-list">
                ${leads.slice(0, 5).map(l => `
                  <div class="pt-mini-item">
                    <div>
                      <strong>${esc(l.companyName)}</strong>
                      <div style="font-size:12px;color:var(--tx-sub)">${esc(l.contactName)} · ${esc(l.source)}</div>
                    </div>
                    <span class="pt-status-pill pt-status-lead">${esc(l.stage)}</span>
                  </div>
                `).join('') || '<div style="padding:16px 0;text-align:center;color:var(--tx-sub);font-size:13px">No sales leads in pipeline yet. Click "＋ New Lead" above to create one.</div>'}
              </div>
            </div>

            <div class="pt-panel">
              <div class="pt-panel-head">
                <h3>Executive Activity Log</h3>
                <button class="btn sm" data-pt-ftab="admin">Full Log</button>
              </div>
              <div class="pt-mini-list">
                ${logs.slice(0, 5).map(log => `
                  <div class="pt-mini-item">
                    <div>
                      <strong style="font-size:13px">${esc(log.action)}</strong>
                      <div style="font-size:12px;color:var(--tx-sub)">${esc(log.details)}</div>
                    </div>
                    <small style="color:var(--mut)">${fmtDate(log.timestamp)}</small>
                  </div>
                `).join('') || '<div style="padding:16px 0;text-align:center;color:var(--tx-sub);font-size:13px">No activity logs recorded yet. System events will appear here.</div>'}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (tab === 'leads') {
      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <h2>Lead Pipeline & CRM Inquiries</h2>
            <button class="btn solid sm" data-pt-action="open-create-lead">＋ Add New Lead</button>
          </div>

          <!-- Leads Table -->
          <div class="pt-table-wrap">
            <table class="pt-table">
              <thead>
                <tr>
                  <th>Company & Contact</th>
                  <th>Source</th>
                  <th>Stage</th>
                  <th>Budget</th>
                  <th>Owner</th>
                  <th>Follow-up</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${leads.map(l => `
                  <tr>
                    <td>
                      <strong>${esc(l.companyName)}</strong>
                      <div style="font-size:12px;color:var(--tx-sub)">${esc(l.contactName)} · ${esc(l.email)} ${l.phone ? `· ${esc(l.phone)}` : ''}</div>
                      ${l.notes ? `<div style="font-size:11px;color:var(--gold);margin-top:2px">Note: ${esc(l.notes)}</div>` : ''}
                    </td>
                    <td>${esc(l.source)}</td>
                    <td>
                      <select class="pt-stage-select" data-pt-action="change-lead-stage" data-lead-id="${esc(l.id)}">
                        ${['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'].map(st => `
                          <option value="${st}" ${l.stage === st ? 'selected' : ''}>${st}</option>
                        `).join('')}
                      </select>
                    </td>
                    <td>${esc(l.budget || '—')}</td>
                    <td>${esc(l.owner)}</td>
                    <td>${fmtDate(l.followUpDate)}</td>
                    <td>
                      <div style="display:flex;gap:6px">
                        <button class="btn sm" data-pt-action="edit-lead" data-lead-id="${esc(l.id)}">Edit</button>
                        <button class="btn sm pt-btn-danger" data-pt-action="delete-lead" data-lead-id="${esc(l.id)}" data-name="${esc(l.companyName || l.contactName)}">Delete</button>
                      </div>
                    </td>
                  </tr>
                `).join('') || '<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--tx-sub);font-size:13px">No sales leads in pipeline yet. Click <strong>＋ Add New Lead</strong> above to record an inquiry.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'clients') {
      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <h2>Client Accounts & User Association</h2>
            <button class="btn solid sm" data-pt-action="open-create-client">＋ Add Client Record</button>
          </div>

          <!-- Clients Table -->
          <div class="pt-table-wrap">
            <table class="pt-table">
              <thead>
                <tr>
                  <th>Client Company</th>
                  <th>Primary Contact</th>
                  <th>Associated Account</th>
                  <th>Assigned Founder</th>
                  <th>Status</th>
                  <th>Projects</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${clients.map(c => {
                  const assignedProjects = projects.filter(p => p.clientId === c.id || p.userId === c.userId || (p.clientEmail && p.clientEmail.toLowerCase() === c.email.toLowerCase()));
                  const matchedUser = users.find(u => u.uid === c.userId || u.email.toLowerCase() === c.email.toLowerCase());
                  return `
                    <tr>
                      <td><strong>${esc(c.companyName)}</strong></td>
                      <td>
                        ${esc(c.contactName)}
                        <div style="font-size:12px;color:var(--tx-sub)">${esc(c.email)} ${c.phone ? `· ${esc(c.phone)}` : ''}</div>
                      </td>
                      <td>
                        ${matchedUser ? `
                          <span class="pt-status-pill pt-status-ok">Linked: ${esc(matchedUser.email)}</span>
                        ` : `
                          <span class="pt-status-pill pt-status-warn">Unlinked Account</span>
                        `}
                      </td>
                      <td>${esc(c.assignedFounder || 'Unassigned')}</td>
                      <td><span class="pt-status-pill pt-status-ok">${esc(c.status)}</span></td>
                      <td>${assignedProjects.length} active</td>
                      <td>
                        <div style="display:flex;gap:6px">
                          <button class="btn sm" data-pt-action="manage-client-access" data-client-id="${esc(c.id)}">Manage</button>
                          <button class="btn sm pt-btn-danger" data-pt-action="delete-client" data-client-id="${esc(c.id)}" data-name="${esc(c.companyName || c.contactName)}">Delete</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('') || '<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--tx-sub);font-size:13px">No client organizations registered yet. Clients will appear here when registered.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'projects') {
      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <h2>Project Management & Client Milestones</h2>
            <div style="display:flex;gap:10px">
              <button class="btn sm" data-pt-action="open-post-update">Post Client Update</button>
              <button class="btn solid sm" data-pt-action="open-create-project">＋ Create New Project</button>
            </div>
          </div>

          <!-- Projects Table -->
          <div class="pt-table-wrap">
            <table class="pt-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client Account</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Target Launch</th>
                  <th>Assigned Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${projects.map(p => `
                  <tr>
                    <td>
                      <strong>${esc(p.name)}</strong>
                      <div style="font-size:12px;color:var(--tx-sub)">${esc(p.description)}</div>
                    </td>
                    <td>${esc(p.clientEmail || p.userId)}</td>
                    <td><span class="pt-status-pill pt-status-dev">${esc(p.status)}</span></td>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px">
                        <div class="pt-progress-bar" style="width:100px;height:6px">
                          <div class="pt-progress-fill" style="width:${p.progress}%"></div>
                        </div>
                        <span style="font-size:12px">${p.progress}%</span>
                      </div>
                    </td>
                    <td>${fmtDate(p.estimatedCompletion)}</td>
                    <td>${esc(p.assignedContact)}</td>
                    <td>
                      <div style="display:flex;gap:6px">
                        <button class="btn sm" data-pt-action="edit-project" data-prj-id="${esc(p.id)}">Edit</button>
                        <button class="btn sm" data-pt-action="update-progress" data-prj-id="${esc(p.id)}">Update %</button>
                        <button class="btn sm pt-btn-danger" data-pt-action="delete-project" data-prj-id="${esc(p.id)}" data-name="${esc(p.name)}">Delete</button>
                      </div>
                    </td>
                  </tr>
                `).join('') || '<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--tx-sub);font-size:13px">No client projects active yet. Click <strong>＋ Create New Project</strong> above to launch one.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'invoices') {
      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <h2>Invoice and Manual Payment Tracking</h2>
            <button class="btn solid sm" data-pt-action="open-create-invoice">＋ Issue New Invoice</button>
          </div>

          <!-- Financial Summary Strip -->
          <div class="pt-stats-grid pt-founder-stats" style="margin-bottom:24px">
            <div class="pt-stat-card">
              <div class="pt-stat-label">Total Invoiced</div>
              <div class="pt-stat-value">${fmtCurrency(totalInvoiced, 'INR')}</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Total Received</div>
              <div class="pt-stat-value pt-tx-ok">${fmtCurrency(totalReceived, 'INR')}</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Outstanding Balance</div>
              <div class="pt-stat-value ${pendingBalance > 0 ? 'pt-tx-warn' : ''}">${fmtCurrency(pendingBalance, 'INR')}</div>
            </div>
          </div>

          <!-- Invoices Table -->
          <div class="pt-table-wrap">
            <table class="pt-table">
              <thead>
                <tr>
                  <th>Invoice Ref</th>
                  <th>Client Account</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${invoices.map(inv => `
                  <tr>
                    <td><strong>${esc(inv.reference)}</strong></td>
                    <td>${esc(inv.clientEmail || inv.clientName || 'Client')}</td>
                    <td>${esc(inv.description)}</td>
                    <td>${fmtCurrency(inv.amount, inv.currency)}</td>
                    <td>${fmtCurrency(inv.paidAmount, inv.currency)}</td>
                    <td><span class="pt-status-pill pt-status-${esc(inv.status.toLowerCase().replace(/\s+/g,'-'))}">${esc(inv.status)}</span></td>
                    <td>${fmtDate(inv.dueDate)}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:6px">
                        ${inv.status !== 'Paid' ? `
                          <button class="btn sm solid" data-pt-action="open-record-payment" data-inv-id="${esc(inv.id)}" data-amount="${esc(inv.amount - (inv.paidAmount || 0))}">Record Payment</button>
                        ` : `
                          <span style="font-size:12px;color:var(--gold)">✓ Verified</span>
                        `}
                        <button class="btn sm pt-btn-danger" data-pt-action="delete-invoice" data-inv-id="${esc(inv.id)}" data-ref="${esc(inv.reference)}">Delete</button>
                      </div>
                    </td>
                  </tr>
                `).join('') || '<tr><td colspan="8" style="text-align:center;padding:28px;color:var(--tx-sub);font-size:13px">No invoices issued yet. Click <strong>＋ Issue New Invoice</strong> above to create a billing invoice.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'support') {
      const internalTickets = tickets.filter(t => t.ticketType === 'internal');
      const clientTickets = tickets.filter(t => t.ticketType !== 'internal');
      const myTickets = tickets.filter(t => (t.assignedFounder && t.assignedFounder.toLowerCase().includes(user.displayName.toLowerCase())) || (t.assignedToEmail && t.assignedToEmail.toLowerCase() === user.email.toLowerCase()));
      const urgentCount = tickets.filter(t => (t.priority === 'Urgent' || t.priority === 'High') && t.status !== 'Resolved').length;

      const internalTeamList = (users || []).filter(u => u.role === 'founder' || u.role === 'team' || u.role === 'employee');
      const coreFounders = [
        { displayName: 'Hriday Vayanta', title: 'Head of Growth', email: 'hridayvayanta7@gmail.com' },
        { displayName: 'Sauranahmed Mansuri', title: 'Head of Technology', email: 'sauran.caventra@gmail.com' },
        { displayName: 'Ved Nimbaark', title: 'Head of Design', email: 'vednimbark08@gmail.com' }
      ];
      coreFounders.forEach(cf => {
        if (!internalTeamList.some(u => u.email && u.email.toLowerCase() === cf.email.toLowerCase())) {
          internalTeamList.push(cf);
        }
      });

      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <div>
              <h2>Support Desk & Corporate Operations</h2>
              <p style="color:var(--tx-sub);font-size:13px;margin-top:4px">Unified management for client service requests and internal founder-to-founder corporate tasks.</p>
            </div>
            <div style="display:flex;gap:10px">
              <button class="btn solid sm" data-pt-action="open-corp-ticket" style="background:var(--accent);border-color:var(--accent)">＋ Raise Corporate Ticket</button>
            </div>
          </div>

          <!-- Ticket Stats Strip -->
          <div class="pt-stats-grid pt-founder-stats" style="margin-bottom:24px">
            <div class="pt-stat-card">
              <div class="pt-stat-label">Total Active</div>
              <div class="pt-stat-value">${tickets.filter(t => t.status !== 'Resolved').length}</div>
              <div class="pt-stat-sub">Across team & clients</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Client Inquiries</div>
              <div class="pt-stat-value pt-tx-ok">${clientTickets.filter(t => t.status !== 'Resolved').length}</div>
              <div class="pt-stat-sub">External support requests</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Corporate Tasks</div>
              <div class="pt-stat-value pt-tx-gold">${internalTickets.filter(t => t.status !== 'Resolved').length}</div>
              <div class="pt-stat-sub">Internal founder/team tasks</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Assigned to You</div>
              <div class="pt-stat-value">${myTickets.filter(t => t.status !== 'Resolved').length}</div>
              <div class="pt-stat-sub">Requires your action</div>
            </div>
            <div class="pt-stat-card">
              <div class="pt-stat-label">Critical / Urgent</div>
              <div class="pt-stat-value ${urgentCount > 0 ? 'pt-tx-warn' : ''}">${urgentCount}</div>
              <div class="pt-stat-sub">High priority blockers</div>
            </div>
          </div>

          <!-- Unified Tickets Table -->
          <div class="pt-table-wrap">
            <table class="pt-table">
              <thead>
                <tr>
                  <th>Scope</th>
                  <th>Ticket Subject</th>
                  <th>Raised By</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${tickets.map(t => {
                  const isInternal = t.ticketType === 'internal';
                  return `
                    <tr>
                      <td>
                        <span class="pt-status-pill ${isInternal ? 'pt-status-founder' : 'pt-status-client'}" style="font-size:10px;padding:3px 8px">
                          ${isInternal ? 'CORPORATE' : 'CLIENT'}
                        </span>
                      </td>
                      <td>
                        <strong>${esc(t.subject)}</strong>
                        <div style="font-size:12px;color:var(--tx-sub);margin-top:2px;max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                          ${esc(t.description)}
                        </div>
                      </td>
                      <td>
                        <div style="font-size:13px;font-weight:600">${esc(t.clientName || 'User')}</div>
                        <div style="font-size:11px;color:var(--tx-sub)">${esc(t.clientEmail || '')}</div>
                      </td>
                      <td>${esc(t.category)}</td>
                      <td><span class="pt-prio pt-prio-${esc((t.priority || 'medium').toLowerCase())}">${esc(t.priority || 'Medium')}</span></td>
                      <td>
                        <select class="pt-stage-select" data-pt-action="change-ticket-status" data-tkt-id="${esc(t.id)}">
                          ${['Open', 'In Progress', 'Awaiting Client', 'Resolved'].map(st => `
                            <option value="${st}" ${t.status === st ? 'selected' : ''}>${st}</option>
                          `).join('')}
                        </select>
                      </td>
                      <td>
                        <select class="pt-stage-select" data-pt-action="change-ticket-assignee" data-tkt-id="${esc(t.id)}">
                          <option value="Unassigned" ${!t.assignedFounder || t.assignedFounder === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
                          ${internalTeamList.map(tm => `
                            <option value="${esc(tm.displayName)}" data-email="${esc(tm.email)}" ${t.assignedFounder === tm.displayName ? 'selected' : ''}>${esc(tm.displayName)}</option>
                          `).join('')}
                        </select>
                      </td>
                      <td>${fmtDate(t.createdAt)}</td>
                      <td>
                        <div style="display:flex;gap:6px">
                          <button class="btn sm" data-pt-action="open-ticket-thread" data-tkt-id="${esc(t.id)}" style="display:flex;align-items:center;gap:4px">
                            <span>Discussion</span>
                            <span class="pt-badge-pill" style="padding:1px 6px;font-size:10px">${(t.comments || []).length}</span>
                          </button>
                          <button class="btn sm pt-btn-danger" data-pt-action="delete-ticket" data-tkt-id="${esc(t.id)}" data-name="${esc(t.subject)}">Delete</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('') || '<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--tx-sub);font-size:13px">No tickets or corporate tasks recorded yet. Click <strong>＋ Raise Corporate Ticket</strong> above to assign a task.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    if (tab === 'admin') {
      return `
        <div class="pt-tab-pane">
          <div class="pt-panel-head">
            <h2>Role-Based Access Control (RBAC) & Users</h2>
          </div>

          <!-- Pending Team Member Requests Panel -->
          ${pendingTeamMembers.length > 0 ? `
            <div class="pt-panel" style="margin-bottom:24px;border-color:var(--gold);background:rgba(212,175,55,0.05)">
              <div class="pt-panel-head">
                <div>
                  <h3 style="color:var(--gold)">🛡️ Pending Team Member Access Requests (${pendingTeamMembers.length})</h3>
                  <p style="color:var(--tx-sub);font-size:13px;margin-top:2px">These staff members verified their email and requested internal Caventra access. Founder approval is required for their first sign-in.</p>
                </div>
              </div>
              <div class="pt-table-wrap" style="margin-top:12px">
                <table class="pt-table">
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Work Email</th>
                      <th>Contact</th>
                      <th>Requested Role</th>
                      <th>Date Requested</th>
                      <th>Founder Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${pendingTeamMembers.map(ptm => `
                      <tr>
                        <td><strong>${esc(ptm.displayName)}</strong></td>
                        <td>${esc(ptm.email)}</td>
                        <td>${esc(ptm.phone || '—')}</td>
                        <td><span class="pt-badge-pill" style="border-color:var(--gold);color:var(--gold)">Team Member</span></td>
                        <td>${fmtDate(ptm.createdAt)}</td>
                        <td>
                          <div style="display:flex;gap:6px">
                            <button class="btn sm solid" data-pt-action="approve-team-member" data-uid="${esc(ptm.uid)}" style="background:#238636;border-color:#2ea043;color:#fff;font-size:12px">✓ Approve Access</button>
                            <button class="btn sm" data-pt-action="reject-team-member" data-uid="${esc(ptm.uid)}" style="color:#f85149;border-color:rgba(248,81,73,0.4);font-size:12px">✕ Reject</button>
                            <button class="btn sm" data-pt-action="remove-user" data-uid="${esc(ptm.uid)}" data-name="${esc(ptm.displayName || ptm.email)}" style="color:#f85149;border-color:rgba(248,81,73,0.4);font-size:12px" title="Remove Application">🗑 Remove</button>
                          </div>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <div class="pt-panel" style="margin-bottom:24px">
            <h3>Registered User Accounts</h3>
            <p style="color:var(--tx-sub);font-size:13px;margin-bottom:16px">Public signups default strictly to <strong>client</strong>. Staff signups require Founder approval before first sign-in.</p>
            <div class="pt-table-wrap">
              <table class="pt-table">
                <thead>
                  <tr>
                    <th>Display Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Approval Status</th>
                    <th>Company</th>
                    <th>Verified</th>
                    <th>Joined</th>
                    <th>Privilege Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map(u => `
                    <tr>
                      <td><strong>${esc(u.displayName)}</strong></td>
                      <td>${esc(u.email)}</td>
                      <td>
                        <span class="pt-status-pill ${u.role === 'founder' ? 'pt-status-founder' : (u.role === 'team' || u.role === 'employee' ? 'pt-status-dev' : 'pt-status-client')}">
                          ${esc(u.role.toUpperCase())}
                        </span>
                      </td>
                      <td>
                        ${(u.role === 'team' || u.role === 'employee') ? `
                          ${u.approvalStatus === 'approved' ? `
                            <span class="pt-status-pill pt-status-ok" style="font-size:11px">✓ Approved</span>
                          ` : u.approvalStatus === 'rejected' ? `
                            <div style="display:flex;align-items:center;gap:4px">
                              <span class="pt-status-pill pt-status-warn" style="color:#f85149;font-size:11px">✕ Declined</span>
                              <button class="btn sm solid" data-pt-action="approve-team-member" data-uid="${esc(u.uid)}" style="padding:2px 6px;font-size:10px;background:#238636;border-color:#2ea043;color:#fff">Re-Approve</button>
                            </div>
                          ` : `
                            <div style="display:flex;align-items:center;gap:4px">
                              <span class="pt-status-pill pt-status-warn" style="font-size:11px">⏳ Pending</span>
                              <button class="btn sm solid" data-pt-action="approve-team-member" data-uid="${esc(u.uid)}" style="padding:2px 6px;font-size:10px;background:#238636;border-color:#2ea043;color:#fff">Approve</button>
                              <button class="btn sm" data-pt-action="reject-team-member" data-uid="${esc(u.uid)}" style="padding:2px 6px;font-size:10px;color:#f85149">Reject</button>
                            </div>
                          `}
                        ` : `
                          <span class="pt-status-pill ${u.role === 'founder' ? 'pt-status-founder' : 'pt-status-client'}" style="font-size:11px">
                            ${u.role === 'founder' ? 'Founder' : 'Verified'}
                          </span>
                        `}
                      </td>
                      <td>${esc(u.company || '—')}</td>
                      <td>${u.emailVerified ? '✓ Verified' : '⚠️ Pending'}</td>
                      <td>${fmtDate(u.createdAt)}</td>
                      <td>
                        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                          ${u.email === user.email ? `
                            <span style="font-size:12px;color:var(--mut)">Current User</span>
                          ` : global.CaventraAuth.isFounder(u) ? `
                            <span class="pt-status-pill pt-status-founder" style="font-size:11px">Protected Founder</span>
                          ` : `
                            <button class="btn sm" data-pt-action="promote-role" data-uid="${esc(u.uid)}" data-name="${esc(u.displayName || u.email)}" data-current-role="${esc(u.role)}" style="font-size:11px;padding:4px 10px;border-color:var(--gold);color:var(--gold)">
                              Promote Role
                            </button>
                            <button class="btn sm" data-pt-action="remove-user" data-uid="${esc(u.uid)}" data-name="${esc(u.displayName || u.email)}" style="color:#f85149;border-color:rgba(248,81,73,0.5);font-size:11px;padding:4px 10px" title="Remove Employee">
                              ${(u.role === 'team' || u.role === 'employee') ? 'Remove Employee' : 'Remove Account'}
                            </button>
                          `}
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Activity Log -->
          <div class="pt-panel">
            <h3>Immutable System Audit Log</h3>
            <div class="pt-table-wrap" style="margin-top:14px">
              <table class="pt-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Performed By</th>
                    <th>Details</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  ${logs.map(log => `
                    <tr>
                      <td><code>${esc(log.action)}</code></td>
                      <td>${esc(log.performedBy)}</td>
                      <td>${esc(log.details)}</td>
                      <td>${fmtDate(log.timestamp)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  // 6. PORTAL GATEWAY / ROUTER
  function renderPortalGateway() {
    const user = global.CaventraAuth ? global.CaventraAuth.getCurrentUser() : null;
    if (!user) {
      return renderLogin();
    }
    if (global.CaventraAuth.isFounder(user) || global.CaventraAuth.isTeamMember(user)) {
      return renderFounderDashboard();
    }
    return renderClientDashboard();
  }

  // --- Event Binding Controller ---
  function bindEvents(root) {
    if (!root) return;

    // Helper: 6-Digit Auto-advance and Backspace Handler
    function setupOtpDigitInputs(inputIds) {
      inputIds.forEach(function (id, index) {
        const input = root.querySelector('#' + id);
        if (!input) return;
        input.oninput = function (e) {
          const val = e.target.value;
          if (val.length >= 1) {
            e.target.value = val.slice(-1);
            if (index < inputIds.length - 1) {
              const next = root.querySelector('#' + inputIds[index + 1]);
              if (next) next.focus();
            }
          }
        };
        input.onkeydown = function (e) {
          if (e.key === 'Backspace' && !e.target.value && index > 0) {
            const prev = root.querySelector('#' + inputIds[index - 1]);
            if (prev) {
              prev.focus();
              prev.value = '';
            }
          }
        };
        input.onpaste = function (e) {
          e.preventDefault();
          const clipboard = e.clipboardData || (typeof window !== 'undefined' ? window.clipboardData : null);
          const pasted = clipboard ? clipboard.getData('text').trim() : '';
          if (/^\d{6}$/.test(pasted)) {
            inputIds.forEach(function (iid, idx) {
              const el = root.querySelector('#' + iid);
              if (el) el.value = pasted[idx] || '';
            });
            const last = root.querySelector('#' + inputIds[inputIds.length - 1]);
            if (last) last.focus();
          }
        };
      });
    }

    const otpDigitIds = ['otp-0', 'otp-1', 'otp-2', 'otp-3', 'otp-4', 'otp-5'];
    setupOtpDigitInputs(otpDigitIds);

    const twofaDigitIds = ['twofa-0', 'twofa-1', 'twofa-2', 'twofa-3', 'twofa-4', 'twofa-5'];
    setupOtpDigitInputs(twofaDigitIds);

    const regOtpDigitIds = ['reg-otp-0', 'reg-otp-1', 'reg-otp-2', 'reg-otp-3', 'reg-otp-4', 'reg-otp-5'];
    setupOtpDigitInputs(regOtpDigitIds);

    const loginOtpDigitIds = ['login-otp-0', 'login-otp-1', 'login-otp-2', 'login-otp-3', 'login-otp-4', 'login-otp-5'];
    setupOtpDigitInputs(loginOtpDigitIds);

    // Active challenge email state
    let currentPendingRegEmail = '';
    let currentPendingLoginEmail = '';
    let cooldownIntervals = {};

    function startCooldownTimer(btnId, durationSec) {
      const btn = root.querySelector('#' + btnId);
      if (!btn) return;
      if (cooldownIntervals[btnId]) clearInterval(cooldownIntervals[btnId]);
      btn.disabled = true;
      let sec = durationSec || 60;
      btn.textContent = `Resend (${sec}s)`;
      cooldownIntervals[btnId] = setInterval(function () {
        sec--;
        if (sec <= 0) {
          clearInterval(cooldownIntervals[btnId]);
          delete cooldownIntervals[btnId];
          btn.disabled = false;
          btn.textContent = 'Resend Code';
        } else {
          btn.textContent = `Resend (${sec}s)`;
        }
      }, 1000);
    }

    // Captcha interactive change listeners
    const captchaLogin = root.querySelector('#pt-captcha-login');
    if (captchaLogin) {
      captchaLogin.onchange = function () {
        const card = root.querySelector('#pt-captcha-card-login');
        if (card) {
          card.classList.toggle('is-verified', captchaLogin.checked);
        }
      };
    }

    const captchaReg = root.querySelector('#pt-captcha-reg');
    if (captchaReg) {
      captchaReg.onchange = function () {
        const card = root.querySelector('#pt-captcha-card-reg');
        if (card) {
          card.classList.toggle('is-verified', captchaReg.checked);
        }
      };
    }

    // Login Form
    const loginForm = root.querySelector('#pt-form-login');
    if (loginForm) {
      loginForm.onsubmit = async function (e) {
        e.preventDefault();
        const captcha = loginForm.querySelector('#pt-captcha-login');
        if (captcha && !captcha.checked) {
          alert('Security Challenge Required: Please complete the anti-bot verification challenge to proceed.');
          return;
        }

        const email = (loginForm.email.value || '').trim().toLowerCase();
        const password = loginForm.password.value;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          alert('Please enter a valid email address.');
          return;
        }
        if (!password) {
          alert('Please enter your account password.');
          return;
        }

        const rememberMeInput = loginForm.querySelector('#pt-login-remember');
        if (typeof localStorage !== 'undefined') {
          if (rememberMeInput && rememberMeInput.checked) {
            localStorage.setItem('caventra_remembered_email', email);
            localStorage.setItem('caventra_remember_login', 'true');
          } else {
            localStorage.removeItem('caventra_remembered_email');
            localStorage.setItem('caventra_remember_login', 'false');
          }
        }

        const submitBtn = loginForm.querySelector('#pt-btn-login');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Authenticating...';
        }

        try {
          const res = await global.CaventraAuth.login(email, password);

          // Case 1: Account unverified -> Must complete email verification first (Flowchart C13 -> C22)
          if (res && res.requiresEmailVerification) {
            currentPendingRegEmail = res.email;
            const modal = root.querySelector('#pt-reg-otp-modal');
            const rec = root.querySelector('#pt-reg-otp-recipient');
            if (rec) rec.textContent = res.email;
            regOtpDigitIds.forEach(function (id) {
              const el = root.querySelector('#' + id);
              if (el) { el.value = ''; el.classList.remove('error'); }
            });
            if (modal) modal.style.display = 'flex';
            const r0 = root.querySelector('#reg-otp-0');
            if (r0) r0.focus();
            startCooldownTimer('pt-btn-resend-reg-otp', 60);
            alert(res.message);
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Sign In';
            }
            return;
          }

          // Case 2: 2FA challenge (if user specifically enabled legacy 2FA flag)
          if (res && res.requires2FA) {
            const modal = root.querySelector('#pt-2fa-modal');
            const emailDisp = root.querySelector('#pt-2fa-email-display');
            if (emailDisp) emailDisp.textContent = res.email;
            twofaDigitIds.forEach(function (id) {
              const el = root.querySelector('#' + id);
              if (el) { el.value = ''; el.classList.remove('error'); }
            });
            if (modal) modal.style.display = 'flex';
            const f0 = root.querySelector('#twofa-0');
            if (f0) f0.focus();
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Sign In';
            }
            return;
          }

          // Case 3: Mandatory Login OTP (Flowchart Step D11 -> D13)
          if (res && res.requiresLoginOtp) {
            currentPendingLoginEmail = res.email;
            const modal = root.querySelector('#pt-login-otp-modal');
            const rec = root.querySelector('#pt-login-otp-recipient');
            if (rec) rec.textContent = res.email;
            loginOtpDigitIds.forEach(function (id) {
              const el = root.querySelector('#' + id);
              if (el) { el.value = ''; el.classList.remove('error'); }
            });
            if (modal) modal.style.display = 'flex';
            const l0 = root.querySelector('#login-otp-0');
            if (l0) l0.focus();
            startCooldownTimer('pt-btn-resend-login-otp', 60);
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Sign In';
            }
            return;
          }

          // Case 4: Pending Founder Approval for Team Member
          if (res && res.requiresFounderApproval) {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Sign In';
            }
            const container = root.querySelector('.pt-auth-wrap');
            if (container) {
              container.outerHTML = renderPendingApprovalView(res.user, res.message);
            } else {
              root.innerHTML = renderPendingApprovalView(res.user, res.message);
            }
            bindEvents(root);
            return;
          }

          // Fallback if session returned directly
          if (global.CaventraAuth.isFounder(res) || global.CaventraAuth.isTeamMember(res)) {
            window.location.hash = '#/founder-dashboard';
          } else {
            window.location.hash = '#/client-dashboard';
          }
          if (typeof render === 'function') render();
        } catch (err) {
          alert(err.message);
          if (typeof render === 'function') {
            render({ type: 'error', text: err.message });
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
          }
        }
      };
    }

    // Login OTP Verification Form (Flowchart D14 -> D22)
    const loginOtpForm = root.querySelector('#pt-form-login-otp');
    if (loginOtpForm) {
      loginOtpForm.onsubmit = async function (e) {
        e.preventDefault();
        const code = loginOtpDigitIds.map(function (id) {
          const el = root.querySelector('#' + id);
          return el ? el.value : '';
        }).join('');
        if (code.length < 6) {
          alert('Please enter all 6 digits of your sign-in verification code.');
          return;
        }
        const confirmBtn = loginOtpForm.querySelector('#pt-btn-verify-login-otp');
        if (confirmBtn) confirmBtn.disabled = true;

        try {
          const user = await global.CaventraAuth.verifyLoginOtp(currentPendingLoginEmail, code);
          const modal = root.querySelector('#pt-login-otp-modal');
          if (modal) modal.style.display = 'none';
          if (global.CaventraAuth.isFounder(user) || global.CaventraAuth.isTeamMember(user)) {
            window.location.hash = '#/founder-dashboard';
          } else {
            window.location.hash = '#/client-dashboard';
          }
          if (typeof render === 'function') render();
        } catch (err) {
          alert(err.message);
          if (confirmBtn) confirmBtn.disabled = false;
          loginOtpDigitIds.forEach(function (id) {
            const el = root.querySelector('#' + id);
            if (el) el.classList.add('error');
          });
        }
      };
    }

    // Registration OTP Verification Form (Flowchart C14 -> C22)
    const regOtpForm = root.querySelector('#pt-form-reg-otp');
    if (regOtpForm) {
      regOtpForm.onsubmit = async function (e) {
        e.preventDefault();
        const code = regOtpDigitIds.map(function (id) {
          const el = root.querySelector('#' + id);
          return el ? el.value : '';
        }).join('');
        if (code.length < 6) {
          alert('Please enter all 6 digits of your registration verification code.');
          return;
        }
        const verifyBtn = regOtpForm.querySelector('#pt-btn-verify-reg-otp');
        if (verifyBtn) verifyBtn.disabled = true;

        try {
          const verifyRes = await global.CaventraAuth.verifyRegistrationOtp(currentPendingRegEmail, code);
          const modal = root.querySelector('#pt-reg-otp-modal');
          if (modal) modal.style.display = 'none';

          if (verifyRes && verifyRes.isTeam) {
            const user = verifyRes.user || { email: currentPendingRegEmail, displayName: currentPendingRegEmail, role: 'team' };
            const container = root.querySelector('.pt-auth-wrap');
            if (container) {
              container.outerHTML = renderPendingApprovalView(user, verifyRes.message);
            } else {
              root.innerHTML = renderPendingApprovalView(user, verifyRes.message);
            }
            bindEvents(root);
            return;
          }

          // Redirect to Sign-In Page (Flowchart C21 -> C22)
          window.location.hash = '#/login';
          if (typeof render === 'function') {
            render({ type: 'ok', text: verifyRes.message || 'Registration complete and email verified! Please sign in with your credentials.' });
          }
        } catch (err) {
          alert(err.message);
          if (verifyBtn) verifyBtn.disabled = false;
          regOtpDigitIds.forEach(function (id) {
            const el = root.querySelector('#' + id);
            if (el) el.classList.add('error');
          });
        }
      };
    }

    // 2FA Verification Form (Legacy support)
    const twofaForm = root.querySelector('#pt-form-2fa');
    if (twofaForm) {
      twofaForm.onsubmit = async function (e) {
        e.preventDefault();
        const code = twofaDigitIds.map(function (id) {
          const el = root.querySelector('#' + id);
          return el ? el.value : '';
        }).join('');
        if (code.length < 6) {
          alert('Please enter all 6 digits of your 2FA verification code.');
          return;
        }
        const confirmBtn = twofaForm.querySelector('#pt-btn-confirm-2fa');
        if (confirmBtn) confirmBtn.disabled = true;

        try {
          const user = await global.CaventraAuth.verifyLogin2FA(code);
          const modal = root.querySelector('#pt-2fa-modal');
          if (modal) modal.style.display = 'none';
          if (global.CaventraAuth.isFounder(user) || global.CaventraAuth.isTeamMember(user)) {
            window.location.hash = '#/founder-dashboard';
          } else {
            window.location.hash = '#/client-dashboard';
          }
          if (typeof render === 'function') render();
        } catch (err) {
          alert(err.message);
          if (confirmBtn) confirmBtn.disabled = false;
          twofaDigitIds.forEach(function (id) {
            const el = root.querySelector('#' + id);
            if (el) el.classList.add('error');
          });
        }
      };
    }

    // Email OTP Verification Form (Dashboard verification button)
    const otpForm = root.querySelector('#pt-form-otp');
    if (otpForm) {
      otpForm.onsubmit = async function (e) {
        e.preventDefault();
        const code = otpDigitIds.map(function (id) {
          const el = root.querySelector('#' + id);
          return el ? el.value : '';
        }).join('');
        if (code.length < 6) {
          alert('Please enter the full 6-digit verification code.');
          return;
        }
        const verifyBtn = otpForm.querySelector('#pt-btn-verify-otp');
        if (verifyBtn) verifyBtn.disabled = true;

        try {
          const res = await global.CaventraAuth.verifyEmailOtp(code);
          alert(res.message);
          const modal = root.querySelector('#pt-otp-modal');
          if (modal) modal.style.display = 'none';
          if (typeof render === 'function') render(true);
        } catch (err) {
          alert(err.message);
          if (verifyBtn) verifyBtn.disabled = false;
          otpDigitIds.forEach(function (id) {
            const el = root.querySelector('#' + id);
            if (el) el.classList.add('error');
          });
        }
      };
    }

    // 2FA Profile Switch
    const toggle2fa = root.querySelector('#pt-toggle-2fa');
    if (toggle2fa) {
      toggle2fa.onchange = async function () {
        try {
          const enabled = toggle2fa.checked;
          await global.CaventraAuth.toggle2FA(enabled);
          alert('Two-Factor Authentication (2FA) is now ' + (enabled ? 'ENABLED' : 'DISABLED') + '.');
        } catch (err) {
          alert(err.message);
          toggle2fa.checked = !toggle2fa.checked;
        }
      };
    }

    // Custom Google Account Form
    const customGoogleForm = root.querySelector('#pt-form-custom-google');
    if (customGoogleForm) {
      customGoogleForm.onsubmit = async function (e) {
        e.preventDefault();
        const name = (customGoogleForm.googleName.value || '').trim();
        const email = (customGoogleForm.googleEmail.value || '').trim();
        if (!email.includes('@')) {
          alert('Please enter a valid Google email address.');
          return;
        }
        try {
          const user = await global.CaventraAuth.selectGoogleAccount({
            name: name,
            email: email,
            company: 'Google Verified User'
          });
          const modal = root.querySelector('#pt-google-modal');
          if (modal) modal.style.display = 'none';
          if (global.CaventraAuth.isFounder(user) || global.CaventraAuth.isTeamMember(user)) {
            window.location.hash = '#/founder-dashboard';
          } else {
            window.location.hash = '#/client-dashboard';
          }
          if (typeof render === 'function') render();
        } catch (err) {
          alert(err.message);
        }
      };
    }

    // Register Form (Flowchart C1 -> C13)
    const regForm = root.querySelector('#pt-form-register');
    if (regForm) {
      regForm.onsubmit = async function (e) {
        e.preventDefault();
        const captcha = regForm.querySelector('#pt-captcha-reg');
        if (captcha && !captcha.checked) {
          alert('Security Challenge Required: Please complete the anti-bot verification challenge to proceed.');
          return;
        }

        const terms = regForm.querySelector('#pt-terms-reg');
        if (terms && !terms.checked) {
          alert('Agreement Required: Please review and accept the Terms of Service and Privacy Policy to continue.');
          return;
        }

        const name = (regForm.name.value || '').trim();
        const email = (regForm.email.value || '').trim().toLowerCase();
        const company = (regForm.company.value || '').trim();
        const phone = (regForm.phone.value || '').trim();
        const password = regForm.password.value;
        const confirmPassword = regForm.confirmPassword ? regForm.confirmPassword.value : '';

        if (!name || name.length < 2) {
          alert('Please enter your full name (minimum 2 characters).');
          return;
        }

        if (/\d/.test(name) || !/^[A-Za-z\s.'-]+$/.test(name)) {
          alert('Full Name can only contain letters, spaces, hyphens, and apostrophes. Numbers are not permitted.');
          return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          alert('Please enter a valid work email address.');
          return;
        }

        if (global.CaventraAuth && global.CaventraAuth.isDemoEmail && global.CaventraAuth.isDemoEmail(email)) {
          alert('Registration with demo, disposable, or test email addresses is not permitted. Please provide a legitimate corporate or personal email.');
          return;
        }

        if (password.length < 8) {
          alert('Password must be at least 8 characters in length.');
          return;
        }

        if (password !== confirmPassword) {
          alert('Password confirmation does not match. Please re-enter your password.');
          return;
        }

        const submitBtn = regForm.querySelector('#pt-btn-register');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Creating Account...';
        }

        try {
          const accountType = (regForm.querySelector('[name="accountType"]') || {}).value || 'client';
          const res = await global.CaventraAuth.register(email, password, name, company, phone, confirmPassword, true, accountType);
          // Mandatory email verification gate (Flowchart C8 -> C13)
          if (res && res.pendingVerification) {
            currentPendingRegEmail = res.email;
            const modal = root.querySelector('#pt-reg-otp-modal');
            const rec = root.querySelector('#pt-reg-otp-recipient');
            if (rec) rec.textContent = res.email;
            regOtpDigitIds.forEach(function (id) {
              const el = root.querySelector('#' + id);
              if (el) { el.value = ''; el.classList.remove('error'); }
            });
            if (modal) modal.style.display = 'flex';
            const r0 = root.querySelector('#reg-otp-0');
            if (r0) r0.focus();
            startCooldownTimer('pt-btn-resend-reg-otp', 60);
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Create Client Account';
            }
            return;
          }

          // Fallback redirect to login
          window.location.hash = '#/login';
          if (typeof render === 'function') render({ type: 'ok', text: 'Registration complete! Please sign in.' });
        } catch (err) {
          alert(err.message);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Client Account';
          }
        }
      };
    }

    // Reset Password Form
    const resetForm = root.querySelector('#pt-form-reset');
    if (resetForm) {
      resetForm.onsubmit = async function (e) {
        e.preventDefault();
        const email = resetForm.email.value;
        try {
          const res = await global.CaventraAuth.sendPasswordReset(email);
          alert(res.message);
          window.location.hash = '#/login';
          if (typeof render === 'function') render();
        } catch (err) {
          alert(err.message);
        }
      };
    }

    // Profile Form
    const profileForm = root.querySelector('#pt-form-profile');
    if (profileForm) {
      profileForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        if (!user) return;
        const displayName = profileForm.displayName.value;
        const company = profileForm.company.value;
        const phone = profileForm.phone.value;

        global.CaventraStore.updateUserProfile(user.uid, { displayName, company, phone }, user);
        alert('Profile details saved successfully.');
        if (typeof render === 'function') render(true);
      };
    }

    // Ticket Form
    const ticketForm = root.querySelector('#pt-form-ticket');
    if (ticketForm) {
      ticketForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        if (!user) return;
        const subject = ticketForm.subject.value;
        const category = ticketForm.category.value;
        const priority = ticketForm.priority.value;
        const description = ticketForm.description.value;

        global.CaventraStore.createSupportTicket({ subject, category, priority, description }, user);
        alert('Support ticket submitted to engineering team.');
        const modal = root.querySelector('#pt-ticket-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Create Lead Form (Founder)
    const createLeadForm = root.querySelector('#pt-form-create-lead');
    if (createLeadForm) {
      createLeadForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        const f = Object.fromEntries(new FormData(createLeadForm));

        if (f.contactName && (/\d/.test(f.contactName) || !/^[A-Za-z\s.'-]+$/.test(f.contactName))) {
          alert('Contact Name can only contain letters, spaces, hyphens, and apostrophes. Numbers are not permitted.');
          return;
        }

        if (f.email && global.CaventraAuth && global.CaventraAuth.isDemoEmail && global.CaventraAuth.isDemoEmail(f.email)) {
          alert('Demo or disposable email addresses are not permitted. Please use a legitimate corporate or personal email.');
          return;
        }

        global.CaventraStore.createLead(f, user);
        alert('New lead added to pipeline.');
        const modal = root.querySelector('#pt-lead-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Edit Lead Form (Founder)
    const editLeadForm = root.querySelector('#pt-form-edit-lead');
    if (editLeadForm) {
      editLeadForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        const f = Object.fromEntries(new FormData(editLeadForm));

        if (f.contactName && (/\d/.test(f.contactName) || !/^[A-Za-z\s.'-]+$/.test(f.contactName))) {
          alert('Contact Name can only contain letters, spaces, hyphens, and apostrophes. Numbers are not permitted.');
          return;
        }

        if (f.email && global.CaventraAuth && global.CaventraAuth.isDemoEmail && global.CaventraAuth.isDemoEmail(f.email)) {
          alert('Demo or disposable email addresses are not permitted. Please use a legitimate corporate or personal email.');
          return;
        }

        global.CaventraStore.updateLead(f.leadId, f, user);
        alert('Lead details updated successfully.');
        const modal = root.querySelector('#pt-edit-lead-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Create Client Form (Founder)
    const createClientForm = root.querySelector('#pt-form-create-client');
    if (createClientForm) {
      createClientForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        const f = Object.fromEntries(new FormData(createClientForm));

        if (f.contactName && (/\d/.test(f.contactName) || !/^[A-Za-z\s.'-]+$/.test(f.contactName))) {
          alert('Contact Name can only contain letters, spaces, hyphens, and apostrophes. Numbers are not permitted.');
          return;
        }

        if (f.email && global.CaventraAuth && global.CaventraAuth.isDemoEmail && global.CaventraAuth.isDemoEmail(f.email)) {
          alert('Demo or disposable email addresses are not permitted. Please use a legitimate corporate or personal email.');
          return;
        }

        global.CaventraStore.createClient(f, user);
        alert('Client record created.');
        const modal = root.querySelector('#pt-client-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Edit Client Form (Founder)
    const editClientForm = root.querySelector('#pt-form-edit-client');
    if (editClientForm) {
      editClientForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        const f = Object.fromEntries(new FormData(editClientForm));

        if (f.contactName && (/\d/.test(f.contactName) || !/^[A-Za-z\s.'-]+$/.test(f.contactName))) {
          alert('Contact Name can only contain letters, spaces, hyphens, and apostrophes. Numbers are not permitted.');
          return;
        }

        if (f.email && global.CaventraAuth && global.CaventraAuth.isDemoEmail && global.CaventraAuth.isDemoEmail(f.email)) {
          alert('Demo or disposable email addresses are not permitted. Please use a legitimate corporate or personal email.');
          return;
        }

        global.CaventraStore.updateClient(f.clientId, f, user);
        alert('Client details updated successfully.');
        const modal = root.querySelector('#pt-edit-client-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Create Project Form (Founder)
    const createPrjForm = root.querySelector('#pt-form-create-project');
    if (createPrjForm) {
      createPrjForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        const f = Object.fromEntries(new FormData(createPrjForm));

        let clientEmail = '';
        let userId = '';
        let clientId = '';

        if (f.clientSelect === '__custom__' || !f.clientSelect) {
          clientEmail = (f.customEmail || '').trim().toLowerCase();
        } else {
          clientEmail = f.clientSelect.trim().toLowerCase();
          const sel = createPrjForm.querySelector('#pt-prj-client-select');
          const opt = sel ? sel.selectedOptions[0] : null;
          if (opt) {
            userId = opt.dataset.uid || '';
            clientId = opt.dataset.cid || '';
          }
        }

        if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
          alert('Please select a valid client or enter a valid client email address.');
          return;
        }

        if (global.CaventraAuth && global.CaventraAuth.isDemoEmail && global.CaventraAuth.isDemoEmail(clientEmail)) {
          alert('Demo or disposable email addresses are not permitted.');
          return;
        }

        const allUsers = global.CaventraStore.getUsers(user) || [];
        const matchedUser = allUsers.find(u => (u.email || '').toLowerCase() === clientEmail);
        if (matchedUser) {
          userId = matchedUser.uid;
        }

        const allClients = global.CaventraStore.getClients(user) || [];
        const matchedClient = allClients.find(c => (c.email || '').toLowerCase() === clientEmail);
        if (matchedClient) {
          clientId = matchedClient.id;
          if (!userId && matchedClient.userId) userId = matchedClient.userId;
        }

        const projectPayload = {
          name: f.name.trim(),
          description: f.description ? f.description.trim() : '',
          status: f.status || 'In Development',
          estimatedCompletion: f.estimatedCompletion || '',
          clientEmail: clientEmail,
          userId: userId || '',
          clientId: clientId || '',
          assignedContact: f.assignedContact || (user.displayName + ' (' + (user.title || user.role || 'Team') + ')')
        };

        global.CaventraStore.createProject(projectPayload, user);
        alert('New project assigned to client.');
        const modal = root.querySelector('#pt-project-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Edit Project Form (Founder)
    const editPrjForm = root.querySelector('#pt-form-edit-project');
    if (editPrjForm) {
      editPrjForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        const f = Object.fromEntries(new FormData(editPrjForm));
        const email = (f.clientEmail || '').trim().toLowerCase();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          alert('Please enter a valid client email address.');
          return;
        }

        if (global.CaventraAuth && global.CaventraAuth.isDemoEmail && global.CaventraAuth.isDemoEmail(email)) {
          alert('Demo or disposable email addresses are not permitted.');
          return;
        }

        const updates = {
          name: f.name.trim(),
          clientEmail: email,
          assignedContact: f.assignedContact ? f.assignedContact.trim() : '',
          description: f.description ? f.description.trim() : '',
          status: f.status,
          progress: Math.max(0, Math.min(100, parseInt(f.progress, 10) || 0)),
          estimatedCompletion: f.estimatedCompletion || ''
        };

        global.CaventraStore.updateProject(f.projectId, updates, user);
        alert('Project details updated successfully.');
        const modal = root.querySelector('#pt-edit-project-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Post Update Form (Founder)
    const postUpdForm = root.querySelector('#pt-form-post-update');
    if (postUpdForm) {
      postUpdForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        const f = Object.fromEntries(new FormData(postUpdForm));
        f.needsApproval = postUpdForm.needsApproval.checked;
        const prj = global.CaventraStore.getProjects(user).find(p => p.id === f.projectId);
        if (prj) {
          f.userId = prj.userId;
          f.clientEmail = prj.clientEmail;
        }
        global.CaventraStore.addProjectUpdate(f, user);
        alert('Progress update published to client portal.');
        const modal = root.querySelector('#pt-update-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Create Invoice Form (Founder)
    const createInvForm = root.querySelector('#pt-form-create-invoice');
    if (createInvForm) {
      createInvForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        const f = Object.fromEntries(new FormData(createInvForm));
        const selectedValue = (f.clientSelect || f.userId || '').trim();
        const allUsers = global.CaventraStore.getUsers(user) || [];
        const clientUser = allUsers.find(u => u.uid === selectedValue || (u.email && u.email.toLowerCase() === selectedValue.toLowerCase()));
        if (clientUser) {
          f.userId = clientUser.uid;
          f.clientEmail = clientUser.email;
          f.clientName = clientUser.displayName;
        } else {
          const allClients = global.CaventraStore.getClients(user) || [];
          const clientRec = allClients.find(c => c.id === selectedValue || (c.email && c.email.toLowerCase() === selectedValue.toLowerCase()));
          if (clientRec) {
            f.userId = clientRec.userId || '';
            f.clientEmail = clientRec.email;
            f.clientName = clientRec.companyName || clientRec.contactName;
          } else {
            f.clientEmail = selectedValue;
            f.clientName = selectedValue;
          }
        }
        global.CaventraStore.createInvoice(f, user);
        alert('Invoice issued.');
        const modal = root.querySelector('#pt-invoice-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Record Payment Form (Founder)
    const recordPayForm = root.querySelector('#pt-form-record-payment');
    if (recordPayForm) {
      recordPayForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        const f = Object.fromEntries(new FormData(recordPayForm));
        global.CaventraStore.recordPayment(f.invoiceId, f, user);
        alert('Payment verified and recorded.');
        const modal = root.querySelector('#pt-payment-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Client Notify Payment Form
    const notifyPayForm = root.querySelector('#pt-form-notify-payment');
    if (notifyPayForm) {
      notifyPayForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        const f = Object.fromEntries(new FormData(notifyPayForm));
        alert('Payment reference (' + (f.transactionRef || '') + ') submitted. Your founding engineer will verify and update invoice status.');
        const modal = root.querySelector('#pt-client-payment-modal');
        if (modal) modal.style.display = 'none';
        if (user && f.transactionRef) {
          global.CaventraStore.createSupportTicket({
            subject: 'Payment Submitted: ' + (f.reference || 'Invoice Settlement'),
            category: 'Billing',
            priority: 'High',
            description: 'Client reported settlement for ' + (f.reference || 'invoice') + ' with transaction reference / UTR: ' + f.transactionRef
          }, user);
        }
        if (typeof render === 'function') render(true);
      };
    }

    // Corporate Ticket Form (Founder & Team)
    const corpTicketForm = root.querySelector('#pt-form-corp-ticket');
    if (corpTicketForm) {
      const sel = corpTicketForm.querySelector('#pt-corp-assignee-select') || corpTicketForm.querySelector('[name="assignedFounder"]');
      const emailInput = corpTicketForm.querySelector('#pt-corp-assignee-email') || corpTicketForm.querySelector('[name="assignedToEmail"]');
      if (sel && emailInput) {
        sel.addEventListener('change', function () {
          const opt = sel.options[sel.selectedIndex];
          if (opt && opt.getAttribute('data-email')) {
            emailInput.value = opt.getAttribute('data-email');
          }
        });
      }

      corpTicketForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        if (!user) return;
        const f = Object.fromEntries(new FormData(corpTicketForm));
        if (sel) {
          const selectedOpt = sel.options[sel.selectedIndex];
          if (selectedOpt && selectedOpt.hasAttribute('data-email') && !f.assignedToEmail) {
            f.assignedToEmail = selectedOpt.getAttribute('data-email');
          }
        }
        f.ticketType = 'internal';
        global.CaventraStore.createSupportTicket(f, user);
        alert('Corporate ticket published. Assignment notification dispatched from caventraofficial@gmail.com to ' + (f.assignedToEmail || f.assignedFounder) + '.');
        const modal = root.querySelector('#pt-corp-ticket-modal');
        if (modal) modal.style.display = 'none';
        if (typeof render === 'function') render(true);
      };
    }

    // Ticket Discussion Reply Form
    const ticketReplyForm = root.querySelector('#pt-form-ticket-reply');
    if (ticketReplyForm) {
      ticketReplyForm.onsubmit = function (e) {
        e.preventDefault();
        const user = global.CaventraAuth.getCurrentUser();
        if (!user) return;
        const ticketId = ticketReplyForm.ticketId.value;
        const comment = (ticketReplyForm.comment.value || '').trim();
        if (!comment) return;

        global.CaventraStore.addTicketComment(ticketId, comment, user);
        ticketReplyForm.comment.value = '';

        // Refresh thread inside modal
        const tickets = global.CaventraStore.getSupportTickets(user);
        const ticket = tickets.find(t => t.id === ticketId);
        const commentsList = root.querySelector('#pt-thread-comments-list');
        if (ticket && commentsList) {
          commentsList.innerHTML = (ticket.comments || []).map(c => `
            <div style="background:var(--bg2);padding:10px 14px;border-radius:6px;border:1px solid var(--line)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <div>
                  <strong style="font-size:13px">${esc(c.author)}</strong>
                  <span class="pt-status-pill ${c.role === 'founder' ? 'pt-status-founder' : 'pt-status-client'}" style="font-size:10px;padding:2px 6px;margin-left:6px">${esc((c.role || 'user').toUpperCase())}</span>
                </div>
                <span style="font-size:11px;color:var(--tx-sub)">${fmtDate(c.timestamp)}</span>
              </div>
              <div style="font-size:13px;white-space:pre-wrap;color:var(--tx)">${esc(c.text)}</div>
            </div>
          `).join('');
        }

        if (typeof render === 'function') render(true);
      };
    }

    // Generic Action Click Handler
    root.onclick = async function (e) {
      const btn = e.target.closest('[data-pt-action], [data-pt-tab], [data-pt-ftab], [data-pt-quick], [data-pt-gacc], #pt-btn-toggle-custom-google');
      if (!btn) return;

      // Google Account Picker Selection
      if (btn.hasAttribute('data-pt-gacc')) {
        const persona = btn.getAttribute('data-pt-gacc');
        await global.CaventraAuth.loginWithGoogle(persona);
        const modal = root.querySelector('#pt-google-modal');
        if (modal) modal.style.display = 'none';
        const user = global.CaventraAuth.getCurrentUser();
        if (global.CaventraAuth.isFounder(user) || global.CaventraAuth.isTeamMember(user)) {
          window.location.hash = '#/founder-dashboard';
        } else {
          window.location.hash = '#/client-dashboard';
        }
        if (typeof render === 'function') render();
        return;
      }

      // Toggle Custom Google Account Form
      if (btn.id === 'pt-btn-toggle-custom-google' || btn.closest('#pt-btn-toggle-custom-google')) {
        const form = root.querySelector('#pt-form-custom-google');
        if (form) {
          form.style.display = (form.style.display === 'none' || !form.style.display) ? 'block' : 'none';
        }
        return;
      }

      // Check Approval Status (Live Cloud Sync) for team member awaiting founder review
      if (btn.id === 'pt-btn-check-approval' || btn.closest('#pt-btn-check-approval')) {
        const checkBtn = btn.id === 'pt-btn-check-approval' ? btn : btn.closest('#pt-btn-check-approval');
        const email = checkBtn.getAttribute('data-email') || '';
        const msgEl = root.querySelector('#pt-check-status-msg');
        checkBtn.disabled = true;
        checkBtn.textContent = 'Checking Cloud Status...';
        if (msgEl) {
          msgEl.style.color = 'var(--tx-sub)';
          msgEl.textContent = 'Querying live Cloud Firestore status...';
        }

        try {
          if (global.CaventraStore && typeof global.CaventraStore.syncWithCloud === 'function') {
            await global.CaventraStore.syncWithCloud();
          }
          const db = (global.CaventraStore && typeof global.CaventraStore.getDb === 'function')
            ? global.CaventraStore.getDb()
            : { users: [] };
          const users = db.users || [];
          const matched = users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());

          if (matched && matched.isApproved && matched.approvalStatus === 'approved') {
            if (msgEl) {
              msgEl.style.color = '#38bdf8';
              msgEl.textContent = '🎉 Your profile has been approved by Founder Administration! Redirecting to sign in...';
            }
            setTimeout(function () {
              window.location.hash = '#/login';
              if (typeof render === 'function') {
                render({ type: 'ok', text: 'Profile approved by leadership! Please sign in with your credentials.' });
              }
            }, 1200);
            return;
          }

          if (matched && matched.approvalStatus === 'rejected') {
            if (msgEl) {
              msgEl.style.color = '#f87171';
              msgEl.textContent = 'Your application was declined by Founder Administration.';
            }
            checkBtn.disabled = false;
            checkBtn.textContent = '↻ Check Approval Status (Live Cloud Sync)';
            return;
          }

          if (msgEl) {
            msgEl.style.color = 'var(--gold)';
            msgEl.textContent = 'Founder review still in progress by Hriday, Sauranahmed, and Ved. (Checked: ' + new Date().toLocaleTimeString() + ')';
          }
          checkBtn.disabled = false;
          checkBtn.textContent = '↻ Check Approval Status (Live Cloud Sync)';
        } catch (err) {
          if (msgEl) {
            msgEl.style.color = 'var(--gold)';
            msgEl.textContent = 'Founder review still in progress. (Checked: ' + new Date().toLocaleTimeString() + ')';
          }
          checkBtn.disabled = false;
          checkBtn.textContent = '↻ Check Approval Status (Live Cloud Sync)';
        }
        return;
      }

      // Tab switcher - Client
      if (btn.hasAttribute('data-pt-tab')) {
        clientActiveTab = btn.getAttribute('data-pt-tab');
        if (typeof render === 'function') render(true);
        if (global.CaventraStore && typeof global.CaventraStore.syncWithCloud === 'function') {
          global.CaventraStore.syncWithCloud().then(function (res) {
            if (res && res.updated && typeof render === 'function') render(true);
          }).catch(function () {});
        }
        return;
      }

      // Tab switcher - Founder
      if (btn.hasAttribute('data-pt-ftab')) {
        founderActiveTab = btn.getAttribute('data-pt-ftab');
        if (typeof render === 'function') render(true);
        if (global.CaventraStore && typeof global.CaventraStore.syncWithCloud === 'function') {
          global.CaventraStore.syncWithCloud().then(function (res) {
            if (res && res.updated && typeof render === 'function') render(true);
          }).catch(function () {});
        }
        return;
      }

      // Quick Persona Login
      if (btn.hasAttribute('data-pt-quick')) {
        const persona = btn.getAttribute('data-pt-quick');
        await global.CaventraAuth.loginWithGoogle(persona);
        const user = global.CaventraAuth.getCurrentUser();
        if (global.CaventraAuth.isFounder(user) || global.CaventraAuth.isTeamMember(user)) {
          window.location.hash = '#/founder-dashboard';
        } else {
          window.location.hash = '#/client-dashboard';
        }
        if (typeof render === 'function') render();
        return;
      }

      const action = btn.getAttribute('data-pt-action');

      if (action === 'manual-sync') {
        const syncBtns = root.querySelectorAll('[data-pt-action="manual-sync"]');
        syncBtns.forEach(function (b) { b.textContent = 'Syncing...'; b.disabled = true; });
        if (global.CaventraStore && typeof global.CaventraStore.syncWithCloud === 'function') {
          global.CaventraStore.syncWithCloud().then(function (res) {
            syncBtns.forEach(function (b) { b.textContent = '✓ Synced'; });
            setTimeout(function () {
              syncBtns.forEach(function (b) { b.textContent = '↻ Sync'; b.disabled = false; });
            }, 1200);
            if (typeof render === 'function') render(true);
          }).catch(function () {
            syncBtns.forEach(function (b) { b.textContent = '↻ Sync'; b.disabled = false; });
          });
        }
        return;
      }

      if (action === 'view-payment-instructions') {
        const invRef = btn.getAttribute('data-inv-ref') || '';
        const modal = root.querySelector('#pt-client-payment-modal');
        const refInput = root.querySelector('#pt-pay-modal-ref');
        if (refInput) refInput.value = invRef;
        if (modal) modal.style.display = 'flex';
        return;
      }

      if (action === 'logout') {
        await global.CaventraAuth.logout();
        window.location.hash = '#/login';
        if (typeof render === 'function') render();
        return;
      }

      if (action === 'open-google-modal') {
        const modal = root.querySelector('#pt-google-modal');
        if (modal) modal.style.display = 'flex';
        return;
      }

      if (action === 'google-login') {
        const modal = root.querySelector('#pt-google-modal');
        if (modal) {
          modal.style.display = 'flex';
        } else {
          await global.CaventraAuth.loginWithGoogle();
          window.location.hash = '#/client-dashboard';
          if (typeof render === 'function') render();
        }
        return;
      }

      if (action === 'request-email-otp') {
        try {
          const res = await global.CaventraAuth.requestEmailVerificationOtp();
          const modal = root.querySelector('#pt-otp-modal');
          const recipient = root.querySelector('#pt-otp-recipient');
          const codeDisplay = root.querySelector('#pt-otp-code-display');
          if (recipient) recipient.textContent = res.email;
          if (codeDisplay) codeDisplay.textContent = res.code;
          otpDigitIds.forEach(function (id) {
            const el = root.querySelector('#' + id);
            if (el) { el.value = ''; el.classList.remove('error'); }
          });
          if (modal) modal.style.display = 'flex';
          const otp0 = root.querySelector('#otp-0');
          if (otp0) otp0.focus();
        } catch (err) {
          alert(err.message);
        }
        return;
      }

      if (action === 'resend-reg-otp') {
        if (!currentPendingRegEmail) {
          alert('No pending registration email found.');
          return;
        }
        try {
          const res = await global.CaventraAuth.resendRegistrationOtp(currentPendingRegEmail);
          startCooldownTimer('pt-btn-resend-reg-otp', 60);
          alert(res.message);
        } catch (err) {
          alert(err.message);
        }
        return;
      }

      if (action === 'resend-login-otp') {
        if (!currentPendingLoginEmail) {
          alert('No pending sign-in email found.');
          return;
        }
        try {
          const res = await global.CaventraAuth.resendLoginOtp(currentPendingLoginEmail);
          startCooldownTimer('pt-btn-resend-login-otp', 60);
          alert(res.message);
        } catch (err) {
          alert(err.message);
        }
        return;
      }

      if (action === 'resend-otp') {
        try {
          const res = await global.CaventraAuth.requestEmailVerificationOtp();
          const codeDisplay = root.querySelector('#pt-otp-code-display');
          if (codeDisplay) codeDisplay.textContent = res.code;
          alert('A new 6-digit verification code has been dispatched to your email. Please check your inbox and spam folder.');
        } catch (err) {
          alert(err.message);
        }
        return;
      }

      if (action === 'resend-verification') {
        const res = await global.CaventraAuth.sendEmailVerification();
        alert(res.message);
        if (typeof render === 'function') render(true);
        return;
      }

      if (action === 'approve-milestone') {
        const updId = btn.getAttribute('data-upd-id');
        const feedbackEl = root.querySelector('#feedback-' + updId);
        const feedback = feedbackEl ? feedbackEl.value : '';
        const user = global.CaventraAuth.getCurrentUser();
        global.CaventraStore.approveMilestone(updId, user, feedback);
        alert('Milestone sign-off recorded. The engineering team has been notified.');
        if (typeof render === 'function') render(true);
        return;
      }

      if (action === 'open-ticket-modal') {
        const m = root.querySelector('#pt-ticket-modal');
        if (m) m.style.display = 'flex';
        return;
      }

      if (action === 'open-corp-ticket') {
        const m = root.querySelector('#pt-corp-ticket-modal');
        if (m) m.style.display = 'flex';
        return;
      }

      if (action === 'open-create-lead') {
        const m = root.querySelector('#pt-lead-modal');
        if (m) m.style.display = 'flex';
        return;
      }

      if (action === 'open-create-client') {
        const m = root.querySelector('#pt-client-modal');
        if (m) m.style.display = 'flex';
        return;
      }

      if (action === 'open-create-project') {
        const m = root.querySelector('#pt-project-modal');
        if (m) m.style.display = 'flex';
        return;
      }

      if (action === 'open-post-update') {
        const m = root.querySelector('#pt-update-modal');
        if (m) m.style.display = 'flex';
        return;
      }

      if (action === 'open-create-invoice') {
        const m = root.querySelector('#pt-invoice-modal');
        if (m) m.style.display = 'flex';
        return;
      }

      if (action === 'open-record-payment') {
        const invId = btn.getAttribute('data-inv-id');
        const amount = btn.getAttribute('data-amount');
        const modal = root.querySelector('#pt-payment-modal');
        const invIdInput = root.querySelector('#pt-pay-inv-id');
        const amountInput = root.querySelector('#pt-pay-amount');
        if (invIdInput) invIdInput.value = invId;
        if (amountInput) amountInput.value = amount;
        if (modal) modal.style.display = 'flex';
        return;
      }

      if (action === 'close-modal') {
        const modals = root.querySelectorAll('.pt-modal');
        modals.forEach(m => m.style.display = 'none');
        return;
      }

      if (action === 'promote-role' || action === 'toggle-role') {
        const uid = btn.getAttribute('data-uid');
        const name = btn.getAttribute('data-name') || 'this user';
        const currentRole = btn.getAttribute('data-current-role') || 'team';
        const user = global.CaventraAuth.getCurrentUser();

        const selection = prompt(
          `Promote / Change Role for ${name} (Current: ${currentRole.toUpperCase()}):\n\n` +
          `1. Promote to Founder (Full Executive Command & Dashboard Access)\n` +
          `2. Caventra Team Member / Employee (Corporate Tasks, Projects & Tickets)\n` +
          `3. Client / Organization (External Portal Only)\n\n` +
          `Enter 1, 2, or 3:`,
          currentRole === 'team' ? '1' : '2'
        );

        if (!selection) return;
        const val = selection.trim().toLowerCase();
        let newRole = '';
        if (val === '1' || val === 'founder') newRole = 'founder';
        else if (val === '2' || val === 'team' || val === 'employee') newRole = 'team';
        else if (val === '3' || val === 'client') newRole = 'client';
        else {
          alert('Invalid role selection. Please choose 1, 2, or 3.');
          return;
        }

        try {
          btn.disabled = true;
          global.CaventraStore.updateUserRole(uid, newRole, user);
          alert(`✓ Successfully updated role for ${name} to ${newRole.toUpperCase()}.`);
          if (typeof render === 'function') render(true);
        } catch (err) {
          btn.disabled = false;
          alert('Error updating role: ' + (err.message || err));
        }
        return;
      }

      if (action === 'approve-team-member') {
        const uid = btn.getAttribute('data-uid');
        const user = global.CaventraAuth.getCurrentUser();
        try {
          btn.disabled = true;
          const target = global.CaventraStore.approveTeamMember(uid, user);
          alert('✓ Approved ' + (target.displayName || target.email) + ' as a Caventra Team Member. They can now log in immediately.');
          if (typeof render === 'function') render(true);
        } catch (err) {
          btn.disabled = false;
          alert('Error approving team member: ' + (err.message || err));
        }
        return;
      }

      if (action === 'reject-team-member') {
        const uid = btn.getAttribute('data-uid');
        const user = global.CaventraAuth.getCurrentUser();
        if (confirm('Are you sure you want to decline this team member registration request?')) {
          try {
            btn.disabled = true;
            btn.textContent = 'Declining...';
            const rejected = global.CaventraStore.rejectTeamMember(uid, user);
            alert('✓ Team member registration request declined for ' + (rejected.displayName || rejected.email) + '.');
            if (typeof render === 'function') render(true);
          } catch (err) {
            btn.disabled = false;
            btn.textContent = '✕ Reject';
            alert('Error declining request: ' + (err.message || err));
          }
        }
        return;
      }

      if (action === 'remove-user') {
        const uid = btn.getAttribute('data-uid');
        const name = btn.getAttribute('data-name') || 'this user';
        const user = global.CaventraAuth.getCurrentUser();
        if (confirm(`Are you sure you want to permanently remove ${name}? This will delete their account and revoke all portal access.`)) {
          try {
            btn.disabled = true;
            btn.textContent = 'Removing...';
            const removed = global.CaventraStore.removeUser(uid, user);
            alert(`✓ User account for ${removed.displayName || removed.email} was removed successfully.`);
            if (typeof render === 'function') render(true);
          } catch (err) {
            btn.disabled = false;
            btn.textContent = '🗑 Remove';
            alert('Error removing user: ' + (err.message || err));
          }
        }
        return;
      }

      if (action === 'update-progress') {
        const prjId = btn.getAttribute('data-prj-id');
        const newProg = prompt('Enter new progress percentage (0 - 100):', '75');
        if (newProg !== null) {
          const num = Math.min(100, Math.max(0, parseInt(newProg, 10) || 0));
          const user = global.CaventraAuth.getCurrentUser();
          global.CaventraStore.updateProject(prjId, { progress: num }, user);
          if (typeof render === 'function') render(true);
        }
        return;
      }

      if (action === 'respond-ticket') {
        const tktId = btn.getAttribute('data-tkt-id');
        const note = prompt('Enter resolution note / client response:');
        if (note) {
          const user = global.CaventraAuth.getCurrentUser();
          global.CaventraStore.updateSupportTicket(tktId, { resolutionNotes: note, status: 'Resolved' }, user);
          if (typeof render === 'function') render(true);
        }
        return;
      }

      if (action === 'open-ticket-thread') {
        const tktId = btn.getAttribute('data-tkt-id');
        const user = global.CaventraAuth.getCurrentUser();
        if (!user || !tktId) return;
        const tickets = global.CaventraStore.getSupportTickets(user);
        const ticket = tickets.find(t => t.id === tktId);
        if (!ticket) return;

        const modal = root.querySelector('#pt-ticket-thread-modal');
        if (!modal) return;

        const titleEl = modal.querySelector('#pt-thread-title');
        const metaEl = modal.querySelector('#pt-thread-meta');
        const descEl = modal.querySelector('#pt-thread-desc');
        const idInput = modal.querySelector('#pt-thread-ticket-id');
        const commentsList = modal.querySelector('#pt-thread-comments-list');
        const quickResolveBtn = modal.querySelector('#pt-btn-quick-resolve');

        if (titleEl) titleEl.textContent = ticket.subject;
        if (metaEl) {
          metaEl.textContent = `Scope: ${(ticket.ticketType || 'client').toUpperCase()} • Raised by: ${ticket.clientName || ticket.clientEmail} • Priority: ${ticket.priority} • Status: ${ticket.status} • Assigned: ${ticket.assignedFounder || 'Unassigned'}`;
        }
        if (descEl) descEl.textContent = ticket.description;
        if (idInput) idInput.value = ticket.id;
        if (quickResolveBtn) {
          quickResolveBtn.setAttribute('data-tkt-id', ticket.id);
          quickResolveBtn.style.display = ticket.status === 'Resolved' ? 'none' : 'inline-block';
        }

        if (commentsList) {
          const comments = ticket.comments || [];
          if (comments.length === 0) {
            commentsList.innerHTML = '<div style="padding:14px;text-align:center;color:var(--tx-sub);font-size:12px;background:var(--bg2);border-radius:6px">No comments yet. Start the conversation below.</div>';
          } else {
            commentsList.innerHTML = comments.map(c => `
              <div style="background:var(--bg2);padding:10px 14px;border-radius:6px;border:1px solid var(--line)">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                  <div>
                    <strong style="font-size:13px">${esc(c.author)}</strong>
                    <span class="pt-status-pill ${c.role === 'founder' ? 'pt-status-founder' : 'pt-status-client'}" style="font-size:10px;padding:2px 6px;margin-left:6px">${esc((c.role || 'user').toUpperCase())}</span>
                  </div>
                  <span style="font-size:11px;color:var(--tx-sub)">${fmtDate(c.timestamp)}</span>
                </div>
                <div style="font-size:13px;white-space:pre-wrap;color:var(--tx)">${esc(c.text)}</div>
              </div>
            `).join('');
          }
        }

        modal.style.display = 'flex';
        return;
      }

      if (action === 'quick-resolve-ticket') {
        const tktId = btn.getAttribute('data-tkt-id');
        const note = prompt('Enter resolution summary / closing notes:');
        if (note !== null) {
          const user = global.CaventraAuth.getCurrentUser();
          global.CaventraStore.updateSupportTicket(tktId, { resolutionNotes: note || 'Resolved by engineering', status: 'Resolved' }, user);
          alert('Ticket marked as Resolved and synchronized to Cloud Firestore.');
          const modal = root.querySelector('#pt-ticket-thread-modal');
          if (modal) modal.style.display = 'none';
          if (typeof render === 'function') render(true);
        }
        return;
      }

      // Edit Sales Lead
      if (action === 'edit-lead') {
        const leadId = btn.getAttribute('data-lead-id');
        const user = global.CaventraAuth.getCurrentUser();
        if (!user || !leadId) return;
        const leads = global.CaventraStore.getLeads(user) || [];
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;
        const modal = root.querySelector('#pt-edit-lead-modal');
        if (!modal) return;
        const form = modal.querySelector('#pt-form-edit-lead');
        if (form) {
          form.leadId.value = lead.id || '';
          if (form.companyName) form.companyName.value = lead.companyName || '';
          if (form.contactName) form.contactName.value = lead.contactName || '';
          if (form.email) form.email.value = lead.email || '';
          if (form.phone) form.phone.value = lead.phone || '';
          if (form.source) form.source.value = lead.source || 'Direct Outreach';
          if (form.stage) form.stage.value = lead.stage || 'New';
          if (form.owner) form.owner.value = lead.owner || 'Hriday Vayanta';
          if (form.budget) form.budget.value = lead.budget || '';
          if (form.followUpDate) form.followUpDate.value = lead.followUpDate || '';
          if (form.notes) form.notes.value = lead.notes || '';
        }
        modal.style.display = 'flex';
        return;
      }

      // Delete Sales Lead
      if (action === 'delete-lead') {
        const leadId = btn.getAttribute('data-lead-id');
        const name = btn.getAttribute('data-name') || 'this lead';
        const user = global.CaventraAuth.getCurrentUser();
        if (confirm(`Are you sure you want to permanently delete lead "${name}"?`)) {
          try {
            global.CaventraStore.deleteLead(leadId, user);
            alert(`✓ Lead "${name}" deleted successfully.`);
            if (typeof render === 'function') render(true);
          } catch (err) {
            alert('Error deleting lead: ' + (err.message || err));
          }
        }
        return;
      }

      // Edit Project
      if (action === 'edit-project') {
        const prjId = btn.getAttribute('data-prj-id');
        const user = global.CaventraAuth.getCurrentUser();
        if (!user || !prjId) return;
        const projects = global.CaventraStore.getProjects(user) || [];
        const prj = projects.find(p => p.id === prjId);
        if (!prj) return;
        const modal = root.querySelector('#pt-edit-project-modal');
        if (!modal) return;
        const form = modal.querySelector('#pt-form-edit-project');
        if (form) {
          form.projectId.value = prj.id || '';
          if (form.name) form.name.value = prj.name || '';
          if (form.clientEmail) form.clientEmail.value = prj.clientEmail || '';
          if (form.assignedContact) form.assignedContact.value = prj.assignedContact || '';
          if (form.description) form.description.value = prj.description || '';
          if (form.status) form.status.value = prj.status || 'In Development';
          if (form.progress) form.progress.value = prj.progress != null ? prj.progress : 0;
          if (form.estimatedCompletion) form.estimatedCompletion.value = prj.estimatedCompletion || '';
        }
        modal.style.display = 'flex';
        return;
      }

      // Delete Project
      if (action === 'delete-project') {
        const prjId = btn.getAttribute('data-prj-id');
        const name = btn.getAttribute('data-name') || 'this project';
        const user = global.CaventraAuth.getCurrentUser();
        if (confirm(`Are you sure you want to permanently delete project "${name}"? This will also remove associated milestones and client updates.`)) {
          try {
            global.CaventraStore.deleteProject(prjId, user);
            alert(`✓ Project "${name}" deleted successfully.`);
            if (typeof render === 'function') render(true);
          } catch (err) {
            alert('Error deleting project: ' + (err.message || err));
          }
        }
        return;
      }

      // Manage / Edit Client Record
      if (action === 'manage-client-access') {
        const clientId = btn.getAttribute('data-client-id');
        const user = global.CaventraAuth.getCurrentUser();
        if (!user || !clientId) return;
        const clients = global.CaventraStore.getClients(user) || [];
        const client = clients.find(c => c.id === clientId);
        if (!client) return;
        const modal = root.querySelector('#pt-edit-client-modal');
        if (!modal) return;
        const form = modal.querySelector('#pt-form-edit-client');
        if (form) {
          form.clientId.value = client.id || '';
          if (form.companyName) form.companyName.value = client.companyName || '';
          if (form.contactName) form.contactName.value = client.contactName || '';
          if (form.email) form.email.value = client.email || '';
          if (form.phone) form.phone.value = client.phone || '';
          if (form.status) form.status.value = client.status || 'active';
          if (form.assignedFounder) form.assignedFounder.value = client.assignedFounder || 'Hriday Vayanta';
          if (form.userId) form.userId.value = client.userId || '';
        }
        modal.style.display = 'flex';
        return;
      }

      // Delete Client Record
      if (action === 'delete-client') {
        const clientId = btn.getAttribute('data-client-id');
        const name = btn.getAttribute('data-name') || 'this client record';
        const user = global.CaventraAuth.getCurrentUser();
        if (confirm(`Are you sure you want to delete client record "${name}"?`)) {
          try {
            global.CaventraStore.deleteClient(clientId, user);
            alert(`✓ Client record "${name}" deleted successfully.`);
            if (typeof render === 'function') render(true);
          } catch (err) {
            alert('Error deleting client record: ' + (err.message || err));
          }
        }
        return;
      }

      // Delete Invoice
      if (action === 'delete-invoice') {
        const invId = btn.getAttribute('data-inv-id');
        const ref = btn.getAttribute('data-ref') || 'this invoice';
        const user = global.CaventraAuth.getCurrentUser();
        if (confirm(`Are you sure you want to delete invoice ${ref}?`)) {
          try {
            global.CaventraStore.deleteInvoice(invId, user);
            alert(`✓ Invoice ${ref} deleted.`);
            if (typeof render === 'function') render(true);
          } catch (err) {
            alert('Error deleting invoice: ' + (err.message || err));
          }
        }
        return;
      }

      // Delete Support Ticket
      if (action === 'delete-ticket') {
        const tktId = btn.getAttribute('data-tkt-id');
        const name = btn.getAttribute('data-name') || 'this ticket';
        const user = global.CaventraAuth.getCurrentUser();
        if (confirm(`Are you sure you want to delete ticket "${name}"?`)) {
          try {
            global.CaventraStore.deleteSupportTicket(tktId, user);
            alert(`✓ Ticket "${name}" deleted.`);
            if (typeof render === 'function') render(true);
          } catch (err) {
            alert('Error deleting ticket: ' + (err.message || err));
          }
        }
        return;
      }
    };

    // Stage dropdown and selection changes
    root.onchange = function (e) {
      const select = e.target;
      if (select.id === 'pt-prj-client-select') {
        const customWrap = root.querySelector('#pt-prj-custom-email-group');
        const customInput = customWrap ? customWrap.querySelector('input') : null;
        if (customWrap) {
          const isCustom = select.value === '__custom__';
          customWrap.style.display = isCustom ? 'block' : 'none';
          if (customInput) customInput.required = isCustom;
        }
        return;
      }
      if (select.getAttribute('data-pt-action') === 'change-lead-stage') {
        const leadId = select.getAttribute('data-lead-id');
        const newStage = select.value;
        const user = global.CaventraAuth.getCurrentUser();
        global.CaventraStore.updateLead(leadId, { stage: newStage }, user);
        return;
      }

      if (select.getAttribute('data-pt-action') === 'change-ticket-status') {
        const tktId = select.getAttribute('data-tkt-id');
        const newStatus = select.value;
        const user = global.CaventraAuth.getCurrentUser();
        global.CaventraStore.updateSupportTicket(tktId, { status: newStatus }, user);
        return;
      }

      if (select.getAttribute('data-pt-action') === 'change-ticket-assignee') {
        const tktId = select.getAttribute('data-tkt-id');
        const newAssignee = select.value;
        const opt = select.options[select.selectedIndex];
        const assignedEmail = opt && opt.getAttribute('data-email') ? opt.getAttribute('data-email') : '';
        const user = global.CaventraAuth.getCurrentUser();
        global.CaventraStore.updateSupportTicket(tktId, { assignedFounder: newAssignee, assignedToEmail: assignedEmail }, user);
        return;
      }

      if (select.id === 'pt-reg-account-type') {
        const isTeam = select.value === 'team';
        const orgLbl = root.querySelector('#pt-lbl-org');
        if (orgLbl) orgLbl.textContent = isTeam ? 'Department / Team Specialization' : 'Company / Project Name';
        const submitBtn = root.querySelector('#pt-btn-register');
        if (submitBtn) submitBtn.textContent = isTeam ? 'Register as Team Member' : 'Create Client Account';
        const notice = root.querySelector('#pt-team-security-notice');
        if (notice) notice.style.display = isTeam ? 'flex' : 'none';
        return;
      }
    };

    // Automatic Cloud Firestore background synchronization
    if (typeof window !== 'undefined' && !window.__caventra_sync_bound) {
      window.__caventra_sync_bound = true;
      window.addEventListener('caventra-cloud-sync', function (e) {
        if (e.detail && e.detail.updated && typeof render === 'function') {
          render(true);
        }
      });
      window.addEventListener('focus', function () {
        if (global.CaventraStore && typeof global.CaventraStore.syncWithCloud === 'function') {
          global.CaventraStore.syncWithCloud().then(function (res) {
            if (res && res.updated && typeof render === 'function') render(true);
          }).catch(function () {});
        }
      });
      if (typeof setInterval === 'function') {
        setInterval(function () {
          if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
            if (global.CaventraStore && typeof global.CaventraStore.syncWithCloud === 'function') {
              global.CaventraStore.syncWithCloud().then(function (res) {
                if (res && res.updated && typeof render === 'function') render(true);
              }).catch(function () {});
            }
          }
        }, 20000);
      }
    }
  }

  // Export
  global.CaventraPortal = {
    renderLogin: renderLogin,
    renderRegister: renderRegister,
    renderResetPassword: renderResetPassword,
    renderPendingApprovalView: renderPendingApprovalView,
    renderClientDashboard: renderClientDashboard,
    renderFounderDashboard: renderFounderDashboard,
    renderPortalGateway: renderPortalGateway,
    setClientActiveTab: function (t) { clientActiveTab = t; },
    setFounderActiveTab: function (t) { founderActiveTab = t; },
    bindEvents: bindEvents
  };

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
