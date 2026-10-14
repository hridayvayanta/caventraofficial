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
 * Optional email dispatch to CAVENTRA inbox
 */
function sendNotificationEmail(id, date, name, email, phone, company, type, budget, timeline, message) {
  var subject = 'New Project Enquiry [' + id + '] — ' + name;
  var body = 'New Project Enquiry received on CAVENTRA:\n\n' +
    'Enquiry ID: ' + id + '\n' +
    'Date: ' + date + '\n\n' +
    'Client: ' + name + '\n' +
    'Email: ' + email + '\n' +
    'Phone/WhatsApp: ' + (phone || 'Not provided') + '\n' +
    'Company: ' + (company || 'Not provided') + '\n\n' +
    'Service Requested: ' + type + '\n' +
    'Budget: ' + (budget || 'Not specified') + '\n' +
    'Timeline: ' + (timeline || 'Not specified') + '\n\n' +
    'Project Brief:\n' + message + '\n\n' +
    '---\n' +
    'CAVENTRA Automated Inquiries Notification';

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: email,
    subject: subject,
    body: body
  });
}

/**
 * Standard JSON response helper with proper Content-Type
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
