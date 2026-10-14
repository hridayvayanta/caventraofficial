# CAVENTRA — Google Sheets & Apps Script Setup Guide

This guide explains how to connect CAVENTRA's **Start a Project** contact form directly to a private Google Spreadsheet under CAVENTRA's official Google account: **`caventraofficial@gmail.com`**.

---

## 1. Prerequisites
- Be signed in to Google using the official account: **`caventraofficial@gmail.com`**.
- Do not create the sheet under a personal or secondary account.

---

## 2. Step 1: Create the Private Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com) signed in as `caventraofficial@gmail.com`.
2. Click **Blank spreadsheet**.
3. Name the spreadsheet: **`CAVENTRA — Project Enquiries`**.
4. Rename the default sheet tab (`Sheet1`) at the bottom to **`Enquiries`**.
5. Keep the sharing settings **Restricted / Private** (only authorized CAVENTRA team members). **Do not make it publicly accessible.**

---

## 3. Step 2: Open and Configure Apps Script
1. Inside the spreadsheet, click on the top menu: **Extensions** > **Apps Script**.
2. Rename the project from "Untitled project" to **`CAVENTRA Enquiries Backend`**.
3. Delete any code in the editor (`Code.gs`) and paste the complete contents of [`google-apps-script/Code.gs`](./Code.gs).
4. Click **Save** (disk icon or `Cmd + S` / `Ctrl + S`).

---

## 4. Step 3: Run Initial Setup (One-Time)
1. In the Apps Script toolbar dropdown (next to "Debug"), select the function **`initialSetup`**.
2. Click **Run**.
3. Google will ask for authorization on the first run:
   - Click **Review permissions**.
   - Choose `caventraofficial@gmail.com`.
   - Click **Advanced** > **Go to CAVENTRA Enquiries Backend (unsafe)**.
   - Click **Allow**.
4. Switch back to your Google Spreadsheet tab: you will see the 12 formatted headers in Caventra brand styling with frozen row 1:
   - **Enquiry ID**
   - **Submission Date**
   - **Full Name**
   - **Email**
   - **Phone or WhatsApp**
   - **Company Name**
   - **Requested Service**
   - **Budget**
   - **Timeline**
   - **Project Requirements**
   - **Lead Source**
   - **Status** (starts as "New")

---

## 5. Step 4: Deploy as a Web App
1. At the top right of the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in the deployment configuration:
   - **Description**: `CAVENTRA Project Enquiries API v1`
   - **Execute as**: **Me (caventraofficial@gmail.com)** *(Important: allows the script to write to your private sheet)*
   - **Who has access**: **Anyone** *(Important: allows anonymous visitors from the static website to submit enquiries without logging into Google)*
4. Click **Deploy**.
5. Copy the generated **Web App URL**. It will look like:
   `https://script.google.com/macros/s/AKfycbx.../exec`

---

## 6. Step 5: Connect Endpoint in CAVENTRA App
Update `GOOGLE_APPS_SCRIPT_URL` in `app.js` and `public/app.js`:
```javascript
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxYOUR_DEPLOYMENT_ID/exec';
```
Save the files. The website will now automatically route all enquiries to your private Google Sheet!

---

## 7. Security Features Included
- **Zero Credentials Exposed**: The spreadsheet ID and service account credentials remain completely private. The frontend only communicates with the public Apps Script webhook endpoint.
- **OWASP Formula Injection Neutralization**: Any cell content beginning with `=`, `+`, `-`, `@`, `\t`, or `\r` is escaped with a leading single quote (`'`), neutralizing potential CSV/spreadsheet formula attacks.
- **Honeypot Anti-Spam**: Invisible field `website` silently traps automated bots without polluting your spreadsheet.
- **Client Rate Limiting**: Script cache cooldown prevents repetitive bot spam from the same sender.
- **Atomic Concurrency Control**: Script lock (`LockService`) guarantees no two simultaneous submissions overwrite or clash.
- **Email Notifications**: Automatically notifies `caventraofficial@gmail.com` instantly whenever a new lead arrives.
