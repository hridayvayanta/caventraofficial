process:()=>head("Our 7-Stage Process","A disciplined engineering methodology from initial discovery to continuous post-launch support.")+wrapS("",`
  <div style="max-width:840px;margin-bottom:48px">
    <p style="font-size:clamp(18px,2.2vw,24px);line-height:1.55;color:var(--tx);font-weight:300">
      Every project at Caventra is engineered through seven transparent stages. We eliminate ambiguity through upfront milestone scoping, clean architecture, and direct collaboration with our engineering team.
    </p>
  </div>
  <div class="process-timeline">
    ${[
      { num: "01", title: "Discovery & Requirements", desc: "We analyze your business model, target audience, core commercial objectives, and technical constraints to establish a focused project brief." },
      { num: "02", title: "Planning & Architecture", desc: "We design data models, URL structures, tech stack choices, milestone deliverables, and upfront transparent pricing." },
      { num: "03", title: "UI/UX Design & Prototyping", desc: "We craft purposeful typography, responsive grid layouts, and interactive wireframes in both dark and light modes for client review." },
      { num: "04", title: "Full-Stack Web Engineering", desc: "We write clean, modular, hand-crafted code with zero fragile page-builders, sub-second load times, and responsive fluid design." },
      { num: "05", title: "Quality Testing & Verification", desc: "Cross-device browser testing, accessibility audits, form submission checks, Core Web Vitals optimization, and client sign-off." },
      { num: "06", title: "Launch & Production Deployment", desc: "Zero-downtime release to global CDN networks, domain/DNS configuration, SSL provisioning, and sitemap registration." },
      { num: "07", title: "Ongoing Support & Scaling", desc: "Post-launch monitoring, proactive software updates, security patches, and continuous iterative improvements as your business expands." }
    ].map(s => `
      <div class="process-step-item">
        <span class="process-step-num">${s.num}</span>
        <h4 class="process-step-title">${esc(s.title)}</h4>
        <p class="process-step-desc">${esc(s.desc)}</p>
      </div>
    `).join('')}
  </div>

  <div style="margin-top:64px">
    <h3 style="font-size:26px;margin-bottom:16px">Our Commitments to You</h3>
    <div class="trust-standards-grid">
      ${[
        { icon: "⚖", title: "100% Client Ownership", desc: "You own all code, designs, and credentials upon project completion. No lock-in or proprietary traps." },
        { icon: "⚡", title: "No Fragile Page-Builders", desc: "We engineer semantic, modern code that won't break on plugin updates or become obsolete." },
        { icon: "🏷", title: "Transparent Fixed Milestones", desc: "Detailed, itemized quotes with fixed milestones. You know exactly what you get and what it costs." },
        { icon: "🛠", title: "Direct Engineer Access", desc: "Collaborate directly with the engineers building your platform. Fast communication, zero bureaucracy." }
      ].map(s => `
        <div class="trust-card">
          <span class="trust-icon">${s.icon}</span>
          <h4>${esc(s.title)}</h4>
          <p>${esc(s.desc)}</p>
        </div>
      `).join('')}
    </div>
  </div>

  <div style="margin-top:64px;padding:52px 32px;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);text-align:center">
    <h3 style="font-size:clamp(26px,4vw,38px);margin-bottom:12px">Ready to start your project?</h3>
    <p style="margin:0 auto 28px;color:var(--mut);max-width:54ch">Schedule an initial discovery consultation or calculate an indicative project estimate.</p>
    <div class="row" style="justify-content:center;gap:12px;flex-wrap:wrap">
      <a class="btn solid" href="/contact/">Schedule Project Discovery ↗</a>
      <a class="btn" href="/estimator/">Launch Cost Estimator</a>
    </div>
  </div>
`,'style="padding-top:20px"'),
technology:()=>head("Technology")+wrapS("",S.techs.length?`<div class="list">${S.techs.map(t=>`<div><h3>${esc(t[0])}</h3><div class="tags">${t[1].split(',').filter(x=>x.trim()).map(x=>`<span>${esc(x.trim())}</span>`).join('')}</div></div>`).join('')}</div>`:empty("Stack details coming soon.","Technologies will be listed here once confirmed."),'style="padding-top:20px"'),
contact:()=>{
  const m=S.contact.email;
  const p=estimatorPrefillData;
  const banner = p ? `
    <div class="contact-estimator-banner">
      <span>✦</span>
      <div style="flex-grow:1">
        <p><strong>Configured via Website Cost Estimator:</strong> Your project scope (<b>${esc(p.websiteType)}</b>), estimated budget (<b>${esc(p.budgetSummary)}</b>), and feature requirements have been pre-filled below.</p>
        <button type="button" id="btn-clear-estimator-prefill" style="background:none;border:none;color:var(--gold2);padding:0;font-size:12px;text-decoration:underline;cursor:pointer;margin-top:4px">Clear estimator details and use blank form</button>
      </div>
    </div>
  ` : '';

  return head("Let's Build Something","Tell us about your project.")+wrapS("",`
    ${banner}
    <form id="cf">
      <input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px">
      <div class="two">
        <label>Your Name *<input name="name" required autocomplete="name" placeholder="Full name (letters only)" pattern="^[A-Za-z\\s.'-]+$" title="Please enter letters only"></label>
        <label>Email Address *<input name="email" type="email" required autocomplete="email" placeholder="you@company.com"></label>
      </div>
      <div class="two">
        <label>Mobile Phone Number *<input name="phone" type="tel" required autocomplete="tel" placeholder="e.g. +91 98765 43210" pattern="[+]?[0-9\\s()\\-]{7,18}" title="Please enter a valid mobile phone number (7 to 15 digits)"></label>
        <label>Company / Organization<input name="company" autocomplete="organization" placeholder="Company or project name"></label>
      </div>
      <div class="two">
        <label>Request type
          <select name="type">
            <option ${p ? 'selected' : ''}>Web Development</option>
            <option>Software Development</option>
            <option>AI Solutions</option>
            <option>UI/UX</option>
            <option>Business Automation</option>
            <option>Data Deletion Request</option>
            <option>Other</option>
          </select>
        </label>
        <label>Budget<input name="budget" value="${esc(p ? p.budgetSummary : '')}" placeholder="e.g. ₹50,000 - ₹1,00,000"></label>
      </div>
      <div class="two">
        <label>Timeline<input name="timeline" value="${esc(p ? (p.timeline || '') : '')}" placeholder="e.g. 4-6 weeks"></label>
      </div>
      <label>Message
        <textarea name="message" required placeholder="Describe your project goals or data deletion request...">${esc(p ? p.messageBody : '')}</textarea>
      </label>
      <label style="display:flex;align-items:flex-start;gap:10px;font-size:13px;cursor:pointer;margin-top:4px">
        <input type="checkbox" name="consent" required style="width:18px;height:18px;accent-color:var(--gold);margin-top:2px;cursor:pointer">
        <span>I confirm that I am at least 18 years of age and consent to Caventra processing my inquiry in accordance with the <a href="/privacy/" style="color:var(--gold);text-decoration:underline">Privacy Policy</a>.</span>
      </label>
      <div style="margin-top:8px">
        <button class="btn solid">${p ? 'Submit Formal Quote Request ↗' : 'Send Message'}</button>
      </div>
    </form>
    ${contactInfo()?`<div style="margin-top:48px">${contactInfo()}</div>`:''}
  `,'style="padding-top:20px"');
},
privacy:()=>head("Privacy Policy","Last updated: October 2026")+wrapS("",`<div class="legal-content"><p>Caventra ("we", "us", or "our") is dedicated to protecting your privacy. This Privacy Policy details how we handle, collect, protect, and process data when you interact with our website and digital studio services.</p><h3>1. Data Controller</h3><p>Caventra is the data controller for information processed through this website. For any inquiries regarding your data, contact us at <a href="mailto:caventraofficial@gmail.com">caventraofficial@gmail.com</a>.</p><h3>2. Information We Collect &amp; Purpose</h3><p>We adhere to strict data minimization. We only collect information that you knowingly submit via our contact form:</p><ul><li><strong>Contact Details:</strong> Your name, email, company, request type, budget, and project brief.</li><li><strong>Purpose:</strong> To review project proposals, provide estimates, and deliver custom digital solutions.</li><li><strong>Zero Tracking SDKs:</strong> We do not track your activity across websites, and we do not use third-party behavioral analytics or advertising trackers.</li></ul><h3>3. Legal Basis for Processing</h3><p>We process personal data based on your explicit consent, pre-contractual discussions, and our legitimate business interest in responding to client inquiries.</p><h3>4. Age Restriction &amp; Protection of Minors</h3><p>Our website and software services are intended strictly for individuals aged 18 and older. We do not knowingly solicit or collect personal information from minors. If personal data of a minor is submitted, we will permanently delete it upon notice.</p><h3>5. Security &amp; Third-Party Audit</h3><p>Our infrastructure undergoes strict security controls, including parameterized database operations, cryptographic session tokens, secure HTTPS transport, and strict Content Security Policies (CSP). We do not embed untrusted third-party SDKs.</p><h3>6. Data Retention &amp; Deletion Option</h3><p>We retain inquiry information only as long as necessary to address your project or satisfy legal requirements.</p><h3>7. Your Rights &amp; Data Deletion Request</h3><p>You have the right to access, correct, or permanently delete your personal information from our systems at any time.</p><p>To request data deletion, select <strong>"Data Deletion Request"</strong> in our <a href="/contact/">Contact Form</a> or email <a href="mailto:caventraofficial@gmail.com?subject=Data%20Deletion%20Request">caventraofficial@gmail.com</a>. We will confirm deletion within 30 days.</p></div>`,'style="padding-top:20px"'),
terms:()=>head("Terms of Service","Last updated: October 2026")+wrapS("",`<div class="legal-content"><p>These Terms of Service govern your access to and use of the website and services provided by Caventra. By browsing our website or initiating a project inquiry, you agree to these Terms.</p><h3>1. Studio Services</h3><p>Caventra provides digital software engineering, AI integrations, UI/UX design, and business automation. Specific project milestones, warranties, and deliverables are governed by individual written client agreements.</p><h3>2. Intellectual Property &amp; Licensing</h3><ul><li><strong>Client Deliverables:</strong> Ownership, licensing, and intellectual property rights for custom code and design deliverables transfer to the client upon full payment as defined in individual service contracts.</li><li><strong>Studio Assets:</strong> The Caventra brand, logo, typography, website design, and proprietary code patterns remain the exclusive intellectual property of Caventra.</li></ul><h3>3. Acceptable Use</h3><p>You agree not to misuse this website, probe vulnerabilities, perform unauthorized scraping, or transmit malicious code.</p><h3>4. Authentic Work &amp; No Unsupported Claims</h3><p>We build genuine, high-standard digital products. Caventra makes no exaggerated or unsupported claims regarding specific commercial turnover or search rankings unless explicitly warranted in a formal contract.</p><h3>5. Limitation of Liability</h3><p>Caventra is provided on an "as is" basis without warranties of uninterrupted uptime. We shall not be liable for indirect or consequential damages arising from site access.</p><h3>6. Governing Law</h3><p>These Terms are governed by and construed under the laws of India.</p></div>`,'style="padding-top:20px"'),
cookies:()=>head("Cookie Policy","Last updated: October 2026")+wrapS("",`<div class="legal-content"><p>This Cookie Policy explains how Caventra uses cookies and local storage.</p><h3>1. Strictly Necessary Cookies Only</h3><p>Caventra follows a privacy-by-design architecture. <strong>We do not use advertising, marketing, or behavioral tracking cookies.</strong></p><ul><li><strong>Admin Authentication:</strong> An encrypted <code>cv_sess</code> cookie is used solely when authorized administrators log into <code>/admin/</code> to verify credentials. It expires after 7 days.</li><li><strong>Local Storage Preference:</strong> A single entry (<code>cv_cookie_consent</code>) is stored in your browser to remember your cookie banner choice.</li></ul><h3>2. Third-Party Auditing</h3><p>No third-party trackers, pixels, or profiling SDKs are present. Fonts are securely loaded from Google Fonts.</p><h3>3. Managing Cookies</h3><p>You may clear or block cookies in your browser settings at any time without impacting public browsing of this site.</p></div>`,'style="padding-top:20px"'),
project:s=>{
  const p=S.projects.find(x=>x.slug===s&&x.published);
  if(!p)return V.notFound("The project you are looking for could not be found or has not been published yet.");
  const f=(p.features||'').split('\n').filter(x=>x.trim());
  const cv=getCover(p);
  const st=getProjectStatus(p);

  return head(esc(p.name),esc(p.short))+wrapS("",
    `<div class="service-breadcrumb"><a href="/">Home</a> / <a href="/work/">Selected Work</a> / <span>${esc(p.name)}</span></div>`+
    (cv?`<img src="${safe(cv)}" alt="${esc(p.name)}" style="width:100%;border:1px solid var(--line);border-radius:12px;margin-bottom:24px;display:block" loading="lazy">`:'')+
    `<div style="display:flex;align-items:center;gap:12px;margin-top:20px;flex-wrap:wrap">
       <span class="project-status-badge ${st.cls}" style="margin-left:0;padding:5px 12px;font-size:12px">${esc(st.label)}</span>
       <span style="font-size:14px;color:var(--mut)">Category: <b>${esc(p.category)}</b></span>
     </div>`+
    `<div class="tags" style="margin-top:20px">${(p.tech||'').split(',').filter(x=>x.trim()).map(t=>`<span>${esc(t.trim())}</span>`).join('')}</div>`+
    sec("Client & Context",p.client)+
    sec("Project Overview",p.overview)+
    sec("The Business Challenge",p.challenge)+
    sec("Engineered Solution",p.solution)+
    (f.length?`<h3 style="margin:48px 0 12px">Key Features &amp; Technical Capabilities</h3><ul style="padding-left:20px;line-height:1.7;color:var(--mut)">${f.map(x=>`<li style="margin-bottom:6px"><span style="color:var(--tx)">${esc(x)}</span></li>`).join('')}</ul>`:'')+
    sec("Tangible Results & Current Status",p.results)+
    (p.gallery||[]).map(g=>`<img src="${safe(g)}" alt="${esc(p.name)} gallery preview" style="margin-top:24px;border:1px solid var(--line)" loading="lazy">`).join('')+
    `<div class="row" style="margin-top:48px;flex-wrap:wrap;gap:12px">
       ${p.live?`<a class="btn solid" href="${safe(p.live)}" target="_blank" rel="noopener">Live Website ↗</a>`:''}
       ${p.github?`<a class="btn" href="${safe(p.github)}" target="_blank" rel="noopener">GitHub ↗</a>`:''}
       ${p.case?`<a class="btn" href="${safe(p.case)}" target="_blank" rel="noopener">Case Study ↗</a>`:''}
       <a class="btn solid" href="/contact/">Discuss a Similar Project ↗</a>
       <a class="btn" href="/services/">Explore Services</a>
     </div>`
  ,'style="padding-top:20px"');
},
notFound:(msg)=>`<section style="min-height:72vh;display:flex;align-items:center;border:0;padding:80px 0"><div class="wrap" style="text-align:center;max-width:700px;margin:0 auto"><p style="font:800 clamp(80px,13vw,150px) var(--hd);line-height:.88;margin:0 0 20px;background:linear-gradient(100deg,#c9b8a0,#f8ecd8 50%,#b79f80);-webkit-background-clip:text;background-clip:text;color:transparent">404</p><h1 style="font-size:clamp(28px,4vw,44px);margin-bottom:16px">Page Not Found</h1><p style="font-size:17px;color:var(--mut);line-height:1.6;margin:0 auto 36px;max-width:48ch">${msg||"The link you followed may be broken, or the page may have been removed or relocated."}</p><div class="row" style="justify-content:center;gap:14px"><a class="btn solid" href="/">Return to Homepage</a><a class="btn" href="/work/">Explore Our Work</a><a class="btn" href="/blog/">Read Insights &amp; Blog</a><a class="btn" href="/contact/">Contact Studio</a></div></div></section>`,