/**
 * CAVENTRA — Google Apps Script Web App
 * Project Enquiries Backend Integration
 * 
 * Account: caventraofficial@gmail.com
 * Spreadsheet: "CAVENTRA — Project Enquiries"
 * Sheet Tab: "Enquiries"
 */

// Configuration
var SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || '';
var SHEET_NAME = 'Enquiries';
var NOTIFY_EMAIL = 'caventraofficial@gmail.com';
var RATE_LIMIT_SECONDS = 5; // Minimum interval between submissions from the same sender

/**
 * Handle HTTP POST requests from the CAVENTRA website
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for concurrent write operations
  var hasLock = lock.tryLock(10000);
  if (!hasLock) {
    return jsonResponse({
      ok: false,
      error: 'The server is currently busy processing requests. Please retry in a few moments.'
    });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Empty payload received.' });
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ ok: false, error: 'Invalid JSON payload.' });
    }

    // 0. Handle OTP email dispatch for CAVENTRA Client Portal & Founder Authentication
    if (data.action === 'SEND_AUTH_OTP' || data.type === 'LOGIN_OTP' || data.type === 'REGISTRATION_OTP' || data.type === 'EMAIL_VERIFICATION') {
      var recipientEmail = cleanString(data.email, 200);
      var otpCode = cleanString(data.code, 10);
      var otpType = cleanString(data.type || 'LOGIN_OTP', 50);

      if (!recipientEmail || !isValidEmail(recipientEmail)) {
        return jsonResponse({ ok: false, error: 'A valid recipient email is required.' });
      }
      if (!otpCode || !/^\d{6}$/.test(otpCode)) {
        return jsonResponse({ ok: false, error: 'A valid 6-digit OTP code is required.' });
      }

      sendAuthOtpEmail(recipientEmail, otpCode, otpType);
      return jsonResponse({
        ok: true,
        message: 'OTP verification email dispatched to ' + recipientEmail
      });
    }

    // 0b. Handle Corporate Ticket Assignment Notification Email
    // Dispatches notification directly to the assigned team member's email from caventraofficial@gmail.com
    if (data.action === 'SEND_TICKET_NOTIFICATION' || data.type === 'CORPORATE_TICKET_NOTIFICATION') {
      var ticketRecipientEmail = cleanString(data.recipientEmail || data.assignedToEmail || data.email, 200);
      if (!ticketRecipientEmail || !isValidEmail(ticketRecipientEmail)) {
        return jsonResponse({ ok: false, error: 'A valid recipient email address is required.' });
      }

      sendTicketNotificationEmail({
        recipientEmail: ticketRecipientEmail,
        ticketId: cleanString(data.ticketId, 50),
        subject: cleanString(data.subject, 200),
        creatorName: cleanString(data.creatorName || data.clientName || 'Team Member', 120),
        creatorEmail: cleanString(data.creatorEmail || data.clientEmail || '', 200),
        assignedName: cleanString(data.assignedName || data.assignedFounder || 'Team Member', 120),
        category: cleanString(data.category || 'Technical / Backend', 100),
        priority: cleanString(data.priority || 'Medium', 50),
        dueDate: cleanString(data.dueDate || '', 50),
        description: cleanString(data.description, 5000)
      });

      return jsonResponse({
        ok: true,
        message: 'Ticket assignment notification dispatched to ' + ticketRecipientEmail
      });
    }

    // 1. Honeypot anti-spam check
    // The "website" field is hidden from real users. Bots fill it out.
    if (data.website && String(data.website).trim().length > 0) {
      // Silently discard spam without throwing an error
      return jsonResponse({ ok: true, id: 'CV-SPAM-FILTERED', status: 'ignored' });
    }

    // 2. Rate limiting check via CacheService
    var clientIdentifier = (data.email || 'anon').toLowerCase().trim();
    var cache = CacheService.getScriptCache();
    var rateKey = 'rl_' + Utilities.base64Encode(clientIdentifier).substring(0, 32);
    if (cache.get(rateKey)) {
      return jsonResponse({
        ok: false,
        error: 'Too many requests. Please wait a few seconds before trying again.'
      });
    }
    // Set 5-second cooldown
    cache.put(rateKey, '1', RATE_LIMIT_SECONDS);

    // 3. Server-side validation
    var name = cleanString(data.name, 120);
    var email = cleanString(data.email, 200);
    var phone = cleanString(data.phone || data.whatsapp || '', 50);
    var company = cleanString(data.company, 200);
    var type = cleanString(data.type, 100);
    var budget = cleanString(data.budget, 100);
    var timeline = cleanString(data.timeline, 100);
    var message = cleanString(data.message, 5000);
    var leadSource = cleanString(data.leadSource || 'Website (caventraofficial.in)', 150);

    if (!name) {
      return jsonResponse({ ok: false, error: 'Name is required.' });
    }
    if (!email || !isValidEmail(email)) {
      return jsonResponse({ ok: false, error: 'A valid email address is required.' });
    }
    if (!message || message.length < 5) {
      return jsonResponse({ ok: false, error: 'Please enter a project message (at least 5 characters).' });
    }

    // 4. Locate or open target Spreadsheet
    var ss = getSpreadsheet();
    if (!ss) {
      return jsonResponse({
        ok: false,
        error: 'Spreadsheet connection is not properly configured. Please contact Caventra support.'
      });
    }

    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      // Auto-create and format sheet tab if it doesn't exist
      sheet = ss.insertSheet(SHEET_NAME);
      initializeSheetHeaders(sheet);
    }

    // 5. Generate unique enquiry reference
    var now = new Date();
    var enquiryId = generateEnquiryId(now);
    var formattedDate = Utilities.formatDate(now, 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss') + ' IST';

    // 6. Formula injection neutralization (OWASP)
    // Values beginning with =, +, -, @, \t, or \r are prefixed with a single quote (')
    var rowValues = [
      escapeFormula(enquiryId),
      escapeFormula(formattedDate),
      escapeFormula(name),
      escapeFormula(email),
      escapeFormula(phone || '-'),
      escapeFormula(company || '-'),
      escapeFormula(type || 'General Inquiry'),
      escapeFormula(budget || '-'),
      escapeFormula(timeline || '-'),
      escapeFormula(message),
      escapeFormula(leadSource),
      'New' // Initial Status
    ];

    // 7. Append row to spreadsheet
    sheet.appendRow(rowValues);

    // Format new row
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(lastRow, 1, 1, rowValues.length);
    range.setVerticalAlignment('middle');
    range.setWrap(true);

    // 8. Optional email notification to official account
    try {
      sendNotificationEmail(enquiryId, formattedDate, name, email, phone, company, type, budget, timeline, message);
    } catch (mailErr) {
      Logger.log('Notification email failed: ' + mailErr.toString());
    }

    return jsonResponse({
      ok: true,
      id: enquiryId,
      message: 'Your project enquiry was successfully recorded.'
    });

  } catch (err) {
    Logger.log('doPost Error: ' + err.toString());
    return jsonResponse({
      ok: false,
      error: 'An internal error occurred while saving the enquiry. Please try again.'
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle GET requests for health check & diagnostic testing
 */
function doGet(e) {
  var ss = getSpreadsheet();
  var isConnected = !!ss;
  var sheet = isConnected ? ss.getSheetByName(SHEET_NAME) : null;
  var totalRows = sheet ? Math.max(0, sheet.getLastRow() - 1) : 0;

  return jsonResponse({
    status: 'online',
    service: 'CAVENTRA Project Enquiries API',
    spreadsheetConnected: isConnected,
    sheetName: SHEET_NAME,
    totalEnquiries: totalRows,
    timestamp: Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss') + ' IST'
  });
}

/**
 * Formula injection prevention (OWASP recommendation)
 * Prefix strings starting with =, +, -, @, \t, or \r with a single quote
 */
function escapeFormula(val) {
  if (val === null || val === undefined) return '';
  var strVal = String(val);
  if (/^[=+\-@\t\r]/.test(strVal)) {
    return "'" + strVal;
  }
  return strVal;
}

/**
 * Helper to clean and truncate strings
 */
function cleanString(str, maxLen) {
  if (typeof str !== 'string') return '';
  // Strip control characters
  var clean = str.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  if (maxLen && clean.length > maxLen) {
    clean = clean.substring(0, maxLen);
  }
  return clean;
}

/**
 * Email syntax verification
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Unique Enquiry ID Generator
 * Format: CV-YYYYMMDD-XXXX (e.g. CV-20261014-9X4A)
 */
function generateEnquiryId(date) {
  var ymd = Utilities.formatDate(date, 'Asia/Kolkata', 'yyyyMMdd');
  var chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // base32 without easily confused chars (0/O, 1/I)
  var rand = '';
  for (var i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return 'CV-' + ymd + '-' + rand;
}

/**
 * Locate or retrieve the active Spreadsheet
 */
function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } catch (e) {
      Logger.log('Could not open by ID: ' + e.toString());
    }
  }
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    return null;
  }
}

/**
 * Initialize headers and styling for the Enquiries sheet
 */
function initializeSheetHeaders(sheet) {
  var headers = [
    'Enquiry ID',
    'Submission Date',
    'Full Name',
    'Email',
    'Phone or WhatsApp',
    'Company Name',
    'Requested Service',
    'Budget',
    'Timeline',
    'Project Requirements',
    'Lead Source',
    'Status'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#161B1F'); // Caventra brand dark
  headerRange.setFontColor('#ECE6DC'); // Caventra brand light
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment('left');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  // Set initial column widths
  sheet.setColumnWidth(1, 140); // Enquiry ID
  sheet.setColumnWidth(2, 170); // Submission Date
  sheet.setColumnWidth(3, 160); // Full Name
  sheet.setColumnWidth(4, 200); // Email
  sheet.setColumnWidth(5, 140); // Phone or WhatsApp
  sheet.setColumnWidth(6, 160); // Company Name
  sheet.setColumnWidth(7, 180); // Requested Service
  sheet.setColumnWidth(8, 120); // Budget
  sheet.setColumnWidth(9, 120); // Timeline
  sheet.setColumnWidth(10, 320); // Project Requirements
  sheet.setColumnWidth(11, 180); // Lead Source
  sheet.setColumnWidth(12, 100); // Status
}

/**
 * Manual setup utility function
 * Run this once inside the Apps Script Editor to initialize the spreadsheet
 */
function initialSetup() {
  var ss = getSpreadsheet();
  if (!ss) {
    throw new Error('Please open this script container-bound to the "CAVENTRA — Project Enquiries" spreadsheet, or set the SPREADSHEET_ID script property.');
  }
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  initializeSheetHeaders(sheet);
  Logger.log('Headers and formatting successfully initialized on sheet: ' + SHEET_NAME);
}

/**
 * Email dispatch to official CAVENTRA inbox (caventraofficial@gmail.com)
 */
function sendNotificationEmail(id, date, name, email, phone, company, type, budget, timeline, message) {
  var subject = '⚡ New Project Inquiry [' + id + '] — ' + name + ' (' + type + ')';

  var textBody = 'New Project Inquiry Received on CAVENTRA:\n\n' +
    'Enquiry ID: ' + id + '\n' +
    'Date: ' + date + '\n\n' +
    'Client Name: ' + name + '\n' +
    'Client Email: ' + email + '\n' +
    'Phone / WhatsApp: ' + (phone || 'Not provided') + '\n' +
    'Company: ' + (company || 'Not provided') + '\n' +
    'Service Requested: ' + type + '\n' +
    'Budget: ' + (budget || 'Not specified') + '\n' +
    'Timeline: ' + (timeline || 'Not specified') + '\n\n' +
    'Project Brief:\n' + message + '\n\n' +
    'Reply directly to this email to contact the client.\n\n' +
    'CAVENTRA Automated Notification';

  var cleanPhoneDigits = String(phone || '').replace(/\D/g, '');
  var whatsappUrl = cleanPhoneDigits ? 'https://wa.me/' + cleanPhoneDigits : '';

  var htmlBody = '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px 28px;background:#0d1117;color:#f0f6fc;border-radius:12px;border:1px solid #30363d;">' +
    '<div style="text-align:center;margin-bottom:24px;border-bottom:1px solid #21262d;padding-bottom:16px;">' +
    '<h1 style="color:#c9b8a0;margin:0;font-size:24px;letter-spacing:2px;font-weight:700;">CAVENTRA</h1>' +
    '<p style="color:#8b949e;font-size:12px;margin:6px 0 0;letter-spacing:1px;text-transform:uppercase;">New Project Inquiry &bull; Reference ' + id + '</p>' +
    '</div>' +
    '<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">' +
    '<tr><td style="padding:10px 12px;color:#8b949e;border-bottom:1px solid #21262d;width:35%;">Client Name</td><td style="padding:10px 12px;color:#f0f6fc;font-weight:600;border-bottom:1px solid #21262d;">' + name + '</td></tr>' +
    '<tr><td style="padding:10px 12px;color:#8b949e;border-bottom:1px solid #21262d;">Client Email</td><td style="padding:10px 12px;color:#58a6ff;border-bottom:1px solid #21262d;"><a href="mailto:' + email + '" style="color:#58a6ff;text-decoration:none;">' + email + '</a></td></tr>' +
    '<tr><td style="padding:10px 12px;color:#8b949e;border-bottom:1px solid #21262d;">Phone / WhatsApp</td><td style="padding:10px 12px;color:#f0f6fc;border-bottom:1px solid #21262d;">' + (whatsappUrl ? '<a href="' + whatsappUrl + '" style="color:#3fb950;text-decoration:none;">' + phone + ' ↗</a>' : (phone || 'Not provided')) + '</td></tr>' +
    '<tr><td style="padding:10px 12px;color:#8b949e;border-bottom:1px solid #21262d;">Company</td><td style="padding:10px 12px;color:#f0f6fc;border-bottom:1px solid #21262d;">' + (company || 'Not provided') + '</td></tr>' +
    '<tr><td style="padding:10px 12px;color:#8b949e;border-bottom:1px solid #21262d;">Service Requested</td><td style="padding:10px 12px;color:#c9b8a0;font-weight:600;border-bottom:1px solid #21262d;">' + type + '</td></tr>' +
    '<tr><td style="padding:10px 12px;color:#8b949e;border-bottom:1px solid #21262d;">Budget</td><td style="padding:10px 12px;color:#3fb950;font-weight:600;border-bottom:1px solid #21262d;">' + (budget || 'Not specified') + '</td></tr>' +
    '<tr><td style="padding:10px 12px;color:#8b949e;border-bottom:1px solid #21262d;">Timeline</td><td style="padding:10px 12px;color:#f0f6fc;border-bottom:1px solid #21262d;">' + (timeline || 'Not specified') + '</td></tr>' +
    '</table>' +
    '<div style="margin:20px 0;padding:16px;background:#161b22;border-radius:8px;border:1px solid #30363d;">' +
    '<h4 style="margin:0 0 8px;color:#8b949e;font-size:12px;text-transform:uppercase;">Project Brief:</h4>' +
    '<p style="margin:0;color:#f0f6fc;font-size:14px;line-height:1.6;white-space:pre-wrap;">' + message + '</p>' +
    '</div>' +
    '<div style="text-align:center;margin-top:24px;">' +
    '<a href="mailto:' + email + '" style="display:inline-block;padding:10px 20px;background:#c9b8a0;color:#0d1117;font-weight:600;font-size:14px;border-radius:6px;text-decoration:none;margin-right:10px;">Reply to ' + name + ' ↗</a>' +
    (whatsappUrl ? '<a href="' + whatsappUrl + '" style="display:inline-block;padding:10px 20px;background:#238636;color:#ffffff;font-weight:600;font-size:14px;border-radius:6px;text-decoration:none;">WhatsApp Client ↗</a>' : '') +
    '</div>' +
    '<hr style="border:none;border-top:1px solid #21262d;margin:28px 0 16px;"/>' +
    '<p style="color:#6e7681;font-size:11px;margin:0;text-align:center;">CAVENTRA Automated Notification &bull; Submission Time: ' + date + '</p>' +
    '</div>';

  // Attempt GmailApp first, fall back to MailApp
  try {
    GmailApp.sendEmail(NOTIFY_EMAIL, subject, textBody, {
      name: 'CAVENTRA Leads',
      replyTo: email,
      htmlBody: htmlBody
    });
  } catch (gErr) {
    Logger.log('GmailApp failed: ' + gErr.toString() + ' — Trying MailApp fallback...');
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      name: 'CAVENTRA Leads',
      replyTo: email,
      subject: subject,
      body: textBody,
      htmlBody: htmlBody
    });
  }
}

/**
 * Diagnostic test function: Run this inside the Apps Script editor to trigger authorization and test email delivery
 */
function testSendNotificationEmail() {
  sendNotificationEmail(
    'TEST-DIAGNOSTIC',
    Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss') + ' IST',
    'Caventra Diagnostic Test',
    'caventraofficial@gmail.com',
    '8866790989',
    'Caventra Technologies',
    'Custom Web Engineering',
    '₹75,000',
    '3 weeks',
    'This is an automated diagnostic test to confirm that inquiry notifications are landing directly into caventraofficial@gmail.com.'
  );
  Logger.log('Diagnostic test email dispatched to: ' + NOTIFY_EMAIL);
}

/**
 * Dispatch 6-digit security OTP email to client or founder
 */
function sendAuthOtpEmail(toEmail, otpCode, type) {
  var subject = 'CAVENTRA — Sign-In Verification Code';
  var heading = 'Here is your 6-digit sign-in verification code:';
  if (type === 'REGISTRATION_OTP') {
    subject = 'CAVENTRA — Verify Your Client Account';
    heading = 'Here is your 6-digit registration verification code:';
  } else if (type === 'EMAIL_VERIFICATION') {
    subject = 'CAVENTRA — Email Verification Code';
    heading = 'Here is your 6-digit email verification code:';
  }

  var textBody = 'Hello,\n\n' +
    'Your CAVENTRA security verification code is: ' + otpCode + '\n\n' +
    'This 6-digit code is valid for 5 minutes. If you did not request this verification, please contact security@caventraofficial.in immediately.\n\n' +
    'Best regards,\n' +
    'CAVENTRA Digital Solutions\n' +
    'Ahmedabad, Gujarat, India\n' +
    'https://caventraofficial.in';

  var htmlBody = '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;max-width:520px;margin:0 auto;padding:32px 28px;background:#0d1117;color:#f0f6fc;border-radius:12px;border:1px solid #30363d;">' +
    '<div style="text-align:center;margin-bottom:20px;">' +
    '<h1 style="color:#c9b8a0;margin:0;font-size:22px;letter-spacing:2px;font-weight:700;">CAVENTRA</h1>' +
    '<p style="color:#8b949e;font-size:12px;margin:4px 0 0;letter-spacing:1px;text-transform:uppercase;">Security &amp; Client Access</p>' +
    '</div>' +
    '<p style="font-size:15px;line-height:1.5;color:#e6edf3;margin:20px 0 10px;">' + heading + '</p>' +
    '<div style="font-size:36px;font-weight:800;letter-spacing:10px;padding:20px;background:#161b22;border-radius:8px;text-align:center;color:#3fb950;margin:24px 0;border:1.5px solid #30363d;font-family:Consolas,monaco,monospace;">' + otpCode + '</div>' +
    '<p style="color:#8b949e;font-size:13px;line-height:1.5;">This 6-digit code is valid for <strong>5 minutes</strong>. If you did not request this verification code, please ignore this email or contact us immediately.</p>' +
    '<hr style="border:none;border-top:1px solid #30363d;margin:28px 0 20px;"/>' +
    '<p style="color:#8b949e;font-size:11px;margin:0;text-align:center;">CAVENTRA Digital Solutions &bull; Ahmedabad, Gujarat, India &bull; <a href="https://caventraofficial.in" style="color:#c9b8a0;text-decoration:none;">caventraofficial.in</a></p>' +
    '</div>';

  MailApp.sendEmail({
    to: toEmail,
    name: 'CAVENTRA Security',
    subject: subject,
    body: textBody,
    htmlBody: htmlBody
  });
}

/**
 * Dispatch corporate ticket assignment email to the assigned team member
 * Sent from caventraofficial@gmail.com directly to the person for whom the ticket is raised
 */
function sendTicketNotificationEmail(t) {
  var priorityColor = '#58a6ff';
  if (t.priority === 'Urgent') priorityColor = '#f85149';
  else if (t.priority === 'High') priorityColor = '#d29922';
  else if (t.priority === 'Low') priorityColor = '#8b949e';

  var subject = '[CAVENTRA TASK] ' + t.subject + ' (Assigned to you)';
  var textBody = 'Hello ' + t.assignedName + ',\n\n' +
    'A corporate ticket has been assigned to you by ' + t.creatorName + (t.creatorEmail ? ' (' + t.creatorEmail + ')' : '') + '.\n\n' +
    'Ticket Details:\n' +
    '-----------------------------------------\n' +
    'Subject: ' + t.subject + '\n' +
    'Ticket ID: ' + (t.ticketId || 'N/A') + '\n' +
    'Category: ' + t.category + '\n' +
    'Priority: ' + t.priority + '\n' +
    'Due Date: ' + (t.dueDate || 'Immediate / Not specified') + '\n\n' +
    'Requirements & Scope:\n' +
    t.description + '\n' +
    '-----------------------------------------\n\n' +
    'Log in to the Founder / Corporate Suite to update status or reply:\n' +
    'https://caventraofficial.in/founder-dashboard/\n\n' +
    'Best regards,\n' +
    'CAVENTRA Corporate Operations Desk\n' +
    'caventraofficial@gmail.com';

  var htmlBody = '<div style="font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;max-width:580px;margin:0 auto;padding:32px 28px;background:#0d1117;color:#f0f6fc;border-radius:12px;border:1px solid #30363d;">' +
    '<div style="border-bottom:1px solid #30363d;padding-bottom:16px;margin-bottom:20px;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        '<div>' +
          '<h1 style="color:#c9b8a0;margin:0;font-size:20px;letter-spacing:1.5px;font-weight:700;">CAVENTRA</h1>' +
          '<p style="color:#8b949e;font-size:11px;margin:3px 0 0;letter-spacing:1px;text-transform:uppercase;">Corporate Operations &amp; Task Assignment</p>' +
        '</div>' +
        '<span style="display:inline-block;padding:4px 10px;font-size:11px;font-weight:600;border-radius:999px;background:rgba(210,153,34,0.15);color:#d29922;border:1px solid rgba(210,153,34,0.4);">' + escapeHtml(t.category || 'Internal Task') + '</span>' +
      '</div>' +
    '</div>' +
    '<h2 style="font-size:18px;color:#ffffff;margin:0 0 16px;line-height:1.4;">' + escapeHtml(t.subject) + '</h2>' +
    '<p style="font-size:14px;color:#8b949e;line-height:1.5;margin:0 0 16px;">' +
      'Hi <strong style="color:#f0f6fc;">' + escapeHtml(t.assignedName) + '</strong>, a corporate ticket was raised and assigned to you by <strong style="color:#58a6ff;">' + escapeHtml(t.creatorName) + '</strong>' + (t.creatorEmail ? ' (&lt;' + escapeHtml(t.creatorEmail) + '&gt;)' : '') + '.' +
    '</p>' +
    '<table style="width:100%;border-collapse:collapse;margin:16px 0;background:#161b22;border-radius:8px;border:1px solid #30363d;font-size:13px;">' +
      '<tr><td style="padding:10px 14px;color:#8b949e;border-bottom:1px solid #21262d;width:30%;">Priority</td><td style="padding:10px 14px;color:' + priorityColor + ';font-weight:600;border-bottom:1px solid #21262d;">' + escapeHtml(t.priority) + '</td></tr>' +
      '<tr><td style="padding:10px 14px;color:#8b949e;border-bottom:1px solid #21262d;">Department</td><td style="padding:10px 14px;color:#e6edf3;border-bottom:1px solid #21262d;">' + escapeHtml(t.category) + '</td></tr>' +
      '<tr><td style="padding:10px 14px;color:#8b949e;border-bottom:1px solid #21262d;">Due Date</td><td style="padding:10px 14px;color:#e6edf3;border-bottom:1px solid #21262d;">' + (t.dueDate ? escapeHtml(t.dueDate) : '<span style="color:#8b949e;">Immediate / Flexible</span>') + '</td></tr>' +
      '<tr><td style="padding:10px 14px;color:#8b949e;">Ticket Reference</td><td style="padding:10px 14px;color:#8b949e;font-family:monospace;">' + escapeHtml(t.ticketId || 'Internal') + '</td></tr>' +
    '</table>' +
    '<div style="margin:20px 0;">' +
      '<p style="font-size:12px;font-weight:600;color:#8b949e;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px;">Requirements &amp; Scope</p>' +
      '<div style="background:#161b22;padding:16px;border-radius:8px;border:1px solid #30363d;color:#e6edf3;font-size:13px;line-height:1.6;white-space:pre-wrap;">' + escapeHtml(t.description) + '</div>' +
    '</div>' +
    '<div style="text-align:center;margin:28px 0 16px;">' +
      '<a href="https://caventraofficial.in/founder-dashboard/" style="display:inline-block;padding:12px 28px;background:#c9b8a0;color:#0d1117;font-weight:600;font-size:13px;letter-spacing:0.5px;text-decoration:none;border-radius:999px;">Open Founder / Corporate Desk &rarr;</a>' +
    '</div>' +
    '<hr style="border:none;border-top:1px solid #30363d;margin:24px 0 16px;"/>' +
    '<p style="color:#8b949e;font-size:11px;margin:0;text-align:center;">This automated assignment notice was generated by CAVENTRA Corporate Suite &bull; <a href="mailto:caventraofficial@gmail.com" style="color:#8b949e;">caventraofficial@gmail.com</a></p>' +
    '</div>';

  MailApp.sendEmail({
    to: t.recipientEmail,
    name: 'CAVENTRA Corporate Operations',
    subject: subject,
    body: textBody,
    htmlBody: htmlBody
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Standard JSON response helper with proper Content-Type
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
