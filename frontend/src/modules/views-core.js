home:()=>{
  const heroHighlights = `
    <div class="hero-highlights">
      <div class="hero-highlight-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Bespoke Code (Zero Page-Builders)</span>
      </div>
      <div class="hero-highlight-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>100% Client Code &amp; IP Ownership</span>
      </div>
      <div class="hero-highlight-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Sub-Second Fast Loading</span>
      </div>
      <div class="hero-highlight-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Upfront Transparent Quotes</span>
      </div>
    </div>
  `;

  return `<div class="hero"><canvas id="cv"></canvas><div class="wrap hg">
    <div class="hero-model-pill"><span class="dot"></span> BUILD · MANAGE · SECURE · HOST</div>
    <h1>${spc("Websites & Digital Solutions, Engineered for Growing Businesses.",{4:'o',7:'g'})}</h1>
    <div class="hrow">
      <div>
        <p class="fi" style="margin:0 0 14px">We build, host, secure, and manage custom websites and digital software for businesses. Clean code, sub-second performance, and dedicated ongoing engineering.</p>
        <p class="fi" style="margin:0 0 28px;color:var(--gold2)">We build <b id="rw" style="font-weight:300">software</b></p>
        <div class="row fi" style="gap:12px;flex-wrap:wrap">
          <a class="btn solid" href="/contact/">Start a Project ↗</a>
          <a class="btn" href="/services/">Explore Services</a>
          <a class="btn" href="/estimator/" style="border-style:dashed">Cost Estimator ↗</a>
        </div>
        ${heroHighlights}
      </div>
      <div class="hlw">
        <div class="hlf">
          <img class="hl" src="${getLogo()}" alt="Caventra — Ideas to Impact" width="810" height="445" fetchpriority="high">
          <div class="shine"></div>
        </div>
      </div>
    </div>
  </div></div>
  <div class="tape" aria-hidden="true">
    <div class="t1"><div>${[...S.services,...S.services].map(s=>`<span>${esc(s[0])}</span><span>✦</span>`).join('')}</div></div>
    <div class="t2"><div>${[...S.services,...S.services].map(s=>`<span>${esc(s[0])}</span><span>✦</span>`).join('')}</div></div>
  </div>`
  + signatureModelSection()
  + `<section>
      <div class="wrap">
        <div class="section-header-compact">
          <span class="section-kicker">About Caventra</span>
          <h2 class="section-title" id="about">Engineering-First Digital Studio</h2>
        </div>
        <div class="aeo-answer-block" style="margin-top:28px">
          <p style="font-size:clamp(19px,2.2vw,24px);line-height:1.55;color:var(--tx);font-weight:400;max-width:68ch">
            <strong>Caventra is an engineering-first digital studio based in Ahmedabad, Gujarat, India.</strong> We design, build, host, secure, and manage custom websites and digital software for businesses worldwide with bespoke hand-crafted code, zero page-builders, sub-second page performance, and 100% intellectual property ownership.
          </p>
          <p style="font-size:16px;max-width:64ch;line-height:1.65;margin-top:16px;color:var(--mut)">
            <strong>Custom web development is</strong> the craft of writing lightweight code tailored to business needs. In contrast to generic website builders, our engineering team builds fast web applications that boost conversion and guarantee complete client control.
          </p>
        </div>
      </div>
    </section>`
  + deliveryProcessSection()
  + trustStandardsSection()
  + wrapS("Selected Work &amp; Case Studies", workGrid(pub().filter(p=>p.featured)) + `<p style="margin-top:36px"><a class="btn solid" href="/work/">Explore All Selected Work ↗</a> <a class="btn" href="/contact/">Discuss a Project ↗</a></p>`, '', 'work')
  + homepageTestimonialsSection()
  + homepageFAQSection()
  + `<section class="band"><div class="wrap"><h2>Have an idea worth building?</h2><p style="margin:16px auto 32px;max-width:54ch;font-size:18px;color:var(--mut)">Let's architect and engineer your digital product with clean code and transparent pricing.</p><div class="row" style="justify-content:center;gap:12px;flex-wrap:wrap"><a class="btn solid" href="/contact/">Start a Project ↗</a><a class="btn" href="/estimator/">Launch Cost Estimator</a></div></div></section>`
  + (contactInfo() ? wrapS("Contact", contactInfo(), '', 'contact') : '');
},
services: () => {
  const serviceCards = [
    {
      slug: "web-development",
      route: "/services/web-development/",
      num: "01",
      pillar: "BUILD",
      title: "Website Design & Development",
      desc: "Custom, hand-crafted websites and web applications built with semantic HTML, CSS, and modern JavaScript. Sub-second loading, fluid responsiveness, and zero page-builder bloat.",
      deliverables: ["Custom Frontend Architecture", "Conversion-Optimized UX/UI", "Interactive Estimators & Tools", "Full IP & Code Ownership"]
    },
    {
      slug: "branding",
      route: "/services/branding/",
      num: "02",
      pillar: "DESIGN",
      title: "Branding & Creative Design",
      desc: "Distinctive brand identities, logos, color palettes, and typographic design systems that convey credibility and position your business as an industry authority.",
      deliverables: ["Brand Mark & Logo Suite", "Typographic Design Systems", "Digital UI Design Tokens", "Complete Vector Master Assets"]
    },
    {
      slug: "maintenance",
      route: "/services/maintenance/",
      num: "03",
      pillar: "MANAGE",
      title: "Website Management & Maintenance",
      desc: "Dedicated ongoing technical support, routine software updates, content publishing, and Core Web Vitals performance tuning so your platform never degrades.",
      deliverables: ["Scheduled Dependency Updates", "SLA Content Publishing", "Core Web Vitals Audits", "Priority Bug Troubleshooting"]
    },
    {
      slug: "hosting",
      route: "/services/hosting/",
      num: "04",
      pillar: "HOST",
      title: "Hosting & Deployment",
      desc: "High-uptime cloud infrastructure, global Content Delivery Networks, automated CI/CD deployment pipelines, and zero-downtime releases configured in your name.",
      deliverables: ["Global CDN Edge Caching", "Git-Backed CI/CD Releases", "Automated HTTPS / SSL", "24/7 Uptime Monitoring"]
    },
    {
      slug: "security",
      route: "/services/security/",
      num: "05",
      pillar: "SECURE",
      title: "Website Security & Protection",
      desc: "Hardened server configurations, modern Content Security Policies, input sanitization against injection attacks, and encrypted backup protocols.",
      deliverables: ["Strict HTTP Security Headers", "Bot & Spam Mitigation", "SSL/TLS 1.3 Hardening", "Automated Offsite Backups"]
    }
  ];

  return head("Services & Capabilities", "End-to-end digital engineering: from initial architecture and bespoke design to ongoing management, cloud hosting, and security.") +
    wrapS("", `
      <div class="pillar-grid" style="grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:24px;margin-bottom:48px">
        ${serviceCards.map(s => `
          <a class="pillar-card" href="${s.route}">
            <div class="pillar-card-header">
              <span class="pillar-badge">${s.pillar}</span>
              <span class="pillar-num">${s.num}</span>
            </div>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.desc)}</p>
            <ul class="pillar-deliverables">
              ${s.deliverables.map(d => `<li>${esc(d)}</li>`).join('')}
            </ul>
            <span class="pillar-card-link">Explore Detailed Service Scope ↗</span>
          </a>
        `).join('')}
      </div>

      <div class="service-estimator-callout">
        <div>
          <h3>Estimate Your Website Project Cost</h3>
          <p>Use our interactive estimator to configure your website requirements, select features, and calculate an indicative budget.</p>
        </div>
        <a class="btn solid" href="/estimator/">Launch Cost Estimator ↗</a>
      </div>
    `, 'style="padding-top:20px"');
},
serviceDetail: (slug) => {
  const srv = CAVENTRA_SERVICES_DATA[slug];
  if (!srv) return V.notFound("The requested service page does not exist.");

  const relatedProjects = S.projects.filter(p => p.published && srv.projectSlugs.includes(p.slug));

  return `<div class="service-detail-wrap">
    <div class="service-breadcrumb">
      <a href="/">Home</a> / <a href="/services/">Services</a> / <span>${esc(srv.title)}</span>
    </div>
    <div class="service-hero-header">
      <span class="service-badge">${esc(srv.category)}</span>
      <h1 class="service-hero-title">${sp(srv.title)}</h1>
      <p class="service-hero-lead">${esc(srv.tagline)}</p>
      <div class="service-actions-row">
        <a class="btn solid" href="/contact/">Request a Tailored Quote ↗</a>
        <a class="btn" href="/estimator/">Launch Cost Estimator</a>
        <a class="btn" href="https://wa.me/918866790989" target="_blank" rel="noopener">Chat on WhatsApp</a>
      </div>
    </div>

    <div class="service-block-section">
      <div class="split" style="gap:32px">
        <div>
          <span class="section-kicker">The Problem</span>
          <h3 class="service-block-heading">Common Industry Challenges</h3>
          <p class="service-block-desc">${esc(srv.problem)}</p>
        </div>
        <div>
          <span class="section-kicker">Our Approach</span>
          <h3 class="service-block-heading">How Caventra Solves It</h3>
          <p class="service-block-desc">${esc(srv.solution)}</p>
        </div>
      </div>
    </div>

    <div class="service-block-section">
      <span class="section-kicker">Scope &amp; Deliverables</span>
      <h3 class="service-block-heading">What We Deliver</h3>
      <p class="service-block-desc">Every deliverable is engineered to concrete technical specifications with zero filler or hidden scope.</p>
      <div class="deliverables-grid">
        ${srv.deliverables.map(d => `
          <div class="deliverable-card">
            <h4><span>✦</span> ${esc(d.title)}</h4>
            <p>${esc(d.desc)}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="service-block-section">
      <div class="service-who-card">
        <span class="section-kicker">Target Audience</span>
        <h3 class="service-block-heading">Who This Service Is Engineered For</h3>
        <p class="service-block-desc" style="font-size:16px;line-height:1.65">${esc(srv.whoItsFor || "Growing businesses, professional firms, and founders seeking reliable digital execution.")}</p>
      </div>
    </div>

    <div class="service-block-section">
      <div class="service-pricing-banner">
        <div class="service-pricing-info">
          <span class="section-kicker">Transparent Pricing</span>
          <h3 style="font-size:22px;margin:6px 0 8px">${esc(srv.pricingTier || "Indicative Scope Pricing")}</h3>
          <p style="margin:0;color:var(--mut);font-size:15px">Every project is scoped transparently with zero hidden markups or surprise fees. Calculate an indicative estimate for your required scope or speak directly with an architect.</p>
        </div>
        <div class="service-pricing-cta" style="display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn solid" href="/estimator/">Calculate in Estimator ↗</a>
          <a class="btn" href="https://wa.me/918866790989?text=Hi%20Caventra%20team,%20I'd%20like%20to%20discuss%20${encodeURIComponent(srv.title)}" target="_blank" rel="noopener">WhatsApp Us ↗</a>
        </div>
      </div>
    </div>

    <div class="service-block-section">
      <span class="section-kicker">Workflow &amp; Stages</span>
      <h3 class="service-block-heading">How We Deliver This Service</h3>
      <p class="service-block-desc">Structured, transparent sprints from initial consultation to final delivery.</p>
      <div class="service-workflow-grid">
        ${srv.workflow.map(w => `
          <div class="service-wf-step">
            <span class="service-wf-num">${w.num}</span>
            <h5>${esc(w.title)}</h5>
            <p>${esc(w.desc)}</p>
          </div>
        `).join('')}
      </div>
    </div>

    ${relatedProjects.length ? `
      <div class="service-block-section">
        <span class="section-kicker">Proven Work</span>
        <h3 class="service-block-heading">Related Projects &amp; Implementations</h3>
        <p class="service-block-desc">See how we engineer similar solutions in practice.</p>
        ${workGrid(relatedProjects)}
      </div>
    ` : ''}

    <div class="service-block-section">
      <span class="section-kicker">Frequently Asked Questions</span>
      <h3 class="service-block-heading">Got Questions About ${esc(srv.title)}?</h3>
      <div class="faq-wrap">
        ${srv.faqs.map(f => `
          <div class="faq-item">
            <div class="faq-q">${esc(f.q)}</div>
            <p class="faq-a">${esc(f.a)}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="margin-top:64px;padding:52px 32px;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);text-align:center">
      <h3 style="font-size:clamp(26px,4vw,38px);margin-bottom:12px">Ready to discuss your project?</h3>
      <p style="margin:0 auto 28px;color:var(--mut);max-width:54ch">Get a transparent, itemized proposal for ${esc(srv.title.toLowerCase())} tailored directly to your commercial goals.</p>
      <div class="row" style="justify-content:center;gap:12px;flex-wrap:wrap">
        <a class="btn solid" href="/contact/">Request Formal Quote ↗</a>
        <a class="btn" href="/estimator/">Launch Cost Estimator</a>
        <a class="btn" href="/services/">All Services</a>
      </div>
    </div>
  </div>`;
},
estimator: () => {
  const cfg = getEstimatorConfig();
  if (!cfg) {
    return head("Website Cost Estimator") + wrapS("", empty("Configuration Loading", "The estimator configuration is initializing. Please refresh if this persists."), 'style="padding-top:20px"');
  }

  const est = getCurrentEstimate();
  const cur = estimatorState.currency;
  const currentStep = estimatorState.step;

  const stepMeta = [
    { num: 1, name: "Type", title: "Select Website Architecture", desc: "Choose the foundational category that best aligns with your product goals." },
    { num: 2, name: "Pages", title: "Determine Scope & Page Count", desc: "Select an estimated number of distinct page layouts or screens for your website." },
    { num: 3, name: "Features", title: "Select Technical Capabilities", desc: "Choose functionality and integrations required for your platform." },
    { num: 4, name: "Services", title: "Additional Services & Polish", desc: "Add design, copywriting, cloud setup, maintenance, and interaction depth." },
    { num: 5, name: "Review", title: "Estimate Summary & Formal Quote", desc: "Review your indicative investment range and request confirmed project scoping." }
  ];

  const currentMeta = stepMeta[currentStep - 1] || stepMeta[0];

  let stepHtml = '';

  if (currentStep === 1) {
    stepHtml = `
      <div class="type-grid">
        ${cfg.websiteTypes.map(t => {
          const isSel = estimatorState.websiteTypeId === t.id;
          const p = t.pricing[cur] || t.pricing.INR;
          return `
            <div class="type-card ${isSel ? 'selected' : ''}" data-est-type="${esc(t.id)}" tabindex="0" role="button" aria-pressed="${isSel}">
              <div>
                <span class="type-badge">${esc(t.badge)}</span>
                <h3>${esc(t.title)}</h3>
                <p>${esc(t.description)}</p>
              </div>
              <div class="type-price-hint">
                <span>Base (${t.defaultPages} ${t.defaultPages === 1 ? 'page' : 'pages'})</span>
                <strong>from ${formatMoney(p.baseMin, cur)}</strong>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else if (currentStep === 2) {
    const type = est.websiteType;
    const typePricing = type.pricing[cur] || type.pricing.INR;
    stepHtml = `
      <div class="page-controls-wrap">
        <div>
          <label style="font-size:13px;color:var(--mut);margin-bottom:10px;display:block">Common Page Presets</label>
          <div class="presets-group">
            ${cfg.pageRules.presets.map(pr => `
              <div class="preset-chip ${estimatorState.pageCount === pr.value ? 'active' : ''}" data-est-preset="${pr.value}" tabindex="0" role="button">
                <b>${esc(pr.label)}</b>
                <span>${esc(pr.desc)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="custom-stepper-box">
          <label style="font-size:13px;color:var(--mut);display:block;margin-bottom:8px">Fine-Tune Exact Page Count</label>
          <div class="stepper-ui">
            <button class="stepper-btn" data-est-stepper="-1" type="button" aria-label="Decrease page count" ${estimatorState.pageCount <= 1 ? 'disabled' : ''}>−</button>
            <span class="stepper-count">${estimatorState.pageCount}</span>
            <button class="stepper-btn" data-est-stepper="1" type="button" aria-label="Increase page count" ${estimatorState.pageCount >= cfg.pageRules.maxStandardPages ? 'disabled' : ''}>+</button>
          </div>
          <p class="stepper-explanation">
            <b>${esc(type.title)}</b> includes <b>${est.includedPages}</b> page${est.includedPages > 1 ? 's' : ''} in its base package.<br>
            ${est.extraPages > 0 
              ? `<span style="color:var(--gold2)">+${est.extraPages} extra page${est.extraPages > 1 ? 's' : ''} × ${formatMoney(typePricing.extraPageRate, cur)} = ${formatMoney(est.extraPagesCost, cur)}</span>` 
              : `All ${estimatorState.pageCount} page${estimatorState.pageCount > 1 ? 's are' : ' is'} covered under the base package rate.`}
          </p>
        </div>
      </div>
    `;
  } else if (currentStep === 3) {
    stepHtml = `
      <div class="feature-list-group">
        ${cfg.features.map(feat => {
          const isIncluded = (feat.includedByDefaultIn || []).includes(estimatorState.websiteTypeId);
          const isChecked = isIncluded || estimatorState.selectedFeatureIds.includes(feat.id);
          const fPrice = feat.pricing[cur] || { min: 0, max: 0 };
          return `
            <div class="feature-check-card ${isChecked ? 'checked' : ''} ${isIncluded ? 'included-locked' : ''}" 
                 data-est-feat="${esc(feat.id)}" 
                 tabindex="${isIncluded ? '-1' : '0'}" 
                 role="checkbox" 
                 aria-checked="${isChecked}" 
                 aria-disabled="${isIncluded}">
              <div class="custom-checkbox" aria-hidden="true">${isChecked ? '✓' : ''}</div>
              <div class="feature-card-content">
                <div class="feature-card-header">
                  <h4>${esc(feat.title)}</h4>
                  <span class="feature-rate-tag">
                    ${isIncluded ? 'Included in Base' : `+${formatMoney(fPrice.min, cur)} – ${formatMoney(fPrice.max, cur)}`}
                  </span>
                </div>
                <p>${esc(feat.description)}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else if (currentStep === 4) {
    stepHtml = `
      <div class="feature-list-group">
        ${cfg.additionalServices.map(srv => {
          const isChecked = estimatorState.selectedServiceIds.includes(srv.id);
          const sPrice = srv.pricing[cur] || { min: 0, max: 0 };
          const isRec = srv.type === 'recurring';
          return `
            <div class="feature-check-card ${isChecked ? 'checked' : ''}" 
                 data-est-srv="${esc(srv.id)}" 
                 tabindex="0" 
                 role="checkbox" 
                 aria-checked="${isChecked}">
              <div class="custom-checkbox" aria-hidden="true">${isChecked ? '✓' : ''}</div>
              <div class="feature-card-content">
                <div class="feature-card-header">
                  <h4>${esc(srv.title)} ${isRec ? '<span style="font-size:11px;font-weight:400;color:var(--gold2);text-transform:uppercase;letter-spacing:.05em;margin-left:6px;border:1px solid var(--gold2);padding:1px 6px;border-radius:4px">Monthly</span>' : ''}</h4>
                  <span class="feature-rate-tag">
                    +${formatMoney(sPrice.min, cur)} – ${formatMoney(sPrice.max, cur)}${isRec ? ' / mo' : ''}
                  </span>
                </div>
                <p>${esc(srv.description)}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="complexity-box">
        <label style="font-size:14px;color:var(--tx);font-weight:600;display:block">Execution &amp; Interaction Polish</label>
        <p style="font-size:13px;color:var(--mut);margin:4px 0 0">Choose the depth of micro-interactions and motion fidelity for your build.</p>
        <div class="complexity-radios">
          ${cfg.complexityLevels.map(c => {
            const isSel = estimatorState.complexityId === c.id;
            return `
              <div class="complexity-option ${isSel ? 'selected' : ''}" data-est-complexity="${esc(c.id)}" tabindex="0" role="radio" aria-checked="${isSel}">
                <b>${esc(c.label)} ${c.multiplier > 1 ? `(${c.multiplier}x)` : ''}</b>
                <span>${esc(c.desc)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (currentStep === 5) {
    const type = est.websiteType;
    const typePricing = type.pricing[cur] || type.pricing.INR;
    const summary = buildEstimatorScopeSummary(est);

    const waText = encodeURIComponent(
      `Hi CAVENTRA team, I generated an indicative website estimate on your website:\n` +
      `• Website Type: ${summary.websiteType}\n` +
      `• Estimated Pages: ${summary.pageCount}\n` +
      `• Features: ${summary.features}\n` +
      `• Additional Services: ${summary.services}\n` +
      `• Execution Polish: ${summary.complexity}\n` +
      `• Indicative Budget: ${summary.budgetSummary}\n\n` +
      `I would like to discuss this and request a formal quote.`
    );

    const mailSubject = encodeURIComponent(`Formal Quote Request — ${summary.websiteType}`);
    const mailBody = encodeURIComponent(
      `Hello CAVENTRA Engineering Team,\n\n` +
      `I have configured an indicative project scope via the CAVENTRA Website Cost Estimator:\n\n` +
      `• Website Type: ${summary.websiteType}\n` +
      `• Page Count: ${summary.pageCount}\n` +
      `• Technical Features: ${summary.features}\n` +
      `• Additional Services: ${summary.services}\n` +
      `• Execution Polish: ${summary.complexity}\n` +
      `• Indicative Budget: ${summary.budgetSummary}\n\n` +
      `Please review this scope and let me know the next steps for a confirmed formal quote.\n\n` +
      `Best regards,\n[Your Name]\n[Your Phone/Company]`
    );

    stepHtml = `
      <div class="review-summary-sheet">
        <h3 style="font-size:20px;margin-bottom:20px;letter-spacing:-.01em">Configured Project Scope</h3>
        
        <div class="review-row">
          <div>
            <span class="review-label">Architecture</span>
            <span class="review-sublabel">${esc(type.title)} (${est.includedPages} pages included in base)</span>
          </div>
          <span class="review-cost">${formatMoney(typePricing.baseMin, cur)} – ${formatMoney(typePricing.baseMax, cur)}</span>
        </div>

        <div class="review-row">
          <div>
            <span class="review-label">Total Pages</span>
            <span class="review-sublabel">${est.totalPages} page${est.totalPages > 1 ? 's' : ''} ${est.extraPages > 0 ? `(${est.extraPages} extra pages @ ${formatMoney(typePricing.extraPageRate, cur)}/ea)` : '(within base package)'}</span>
          </div>
          <span class="review-cost">${est.extraPagesCost > 0 ? `+${formatMoney(est.extraPagesCost, cur)}` : 'Included'}</span>
        </div>

        <div class="review-row">
          <div>
            <span class="review-label">Selected Features</span>
            <span class="review-sublabel">
              ${est.selectedFeatures.length 
                ? est.selectedFeatures.map(f => `${esc(f.title)}${f.included ? ' (Included in base)' : ''}`).join('<br>')
                : 'No optional features selected'}
            </span>
          </div>
          <span class="review-cost">
            ${est.selectedFeatures.some(f => !f.included) ? 'Included in Total' : 'Included'}
          </span>
        </div>

        <div class="review-row">
          <div>
            <span class="review-label">Additional Services</span>
            <span class="review-sublabel">
              ${est.selectedServices.length 
                ? est.selectedServices.map(s => `${esc(s.title)}${s.type === 'recurring' ? ' [Recurring monthly]' : ''}`).join('<br>')
                : 'No add-on services selected'}
            </span>
          </div>
          <span class="review-cost">
            ${est.selectedServices.length ? 'Included in Total' : 'None'}
          </span>
        </div>

        <div class="review-row">
          <div>
            <span class="review-label">Execution &amp; Polish</span>
            <span class="review-sublabel">${esc(est.complexity.label)} (${est.complexity.multiplier}x multiplier)</span>
          </div>
          <span class="review-cost">${est.complexity.multiplier > 1.0 ? `${est.complexity.multiplier}x applied` : 'Standard (1.0x)'}</span>
        </div>
      </div>

      <div class="review-total-banner">
        <div class="total-title">Indicative One-Time Development Investment</div>
        <div class="total-amount">${formatMoney(est.oneTimeDevMin, cur)} – ${formatMoney(est.oneTimeDevMax, cur)}</div>
        ${est.recurringMax > 0 ? `
          <div class="recurring-note">
            + ${formatMoney(est.recurringMin, cur)} – ${formatMoney(est.recurringMax, cur)} / month for ongoing technical maintenance
          </div>
        ` : ''}
      </div>

      <div class="review-disclaimer-box">
        <p><strong>Note:</strong> ${esc(est.disclaimer)}</p>
      </div>

      <div class="row" style="justify-content:center;gap:14px;margin-top:28px;flex-wrap:wrap">
        <button class="btn solid" id="btn-request-formal-quote" type="button" style="font-size:15px;padding:15px 32px">Request a Formal Quote ↗</button>
        <button class="btn" id="btn-edit-selections" type="button">Edit Selections</button>
        <button class="btn sm" id="btn-reset-estimator" type="button" style="opacity:0.7">Reset</button>
      </div>

      <div class="direct-channels-row">
        <span style="font-size:13px;color:var(--mut)">Or connect directly:</span>
        <a class="direct-channel-btn" href="https://wa.me/918866790989?text=${waText}" target="_blank" rel="noopener">
          WhatsApp Quote Request ↗
        </a>
        <a class="direct-channel-btn" href="mailto:caventraofficial@gmail.com?subject=${mailSubject}&body=${mailBody}">
          Email Scope Details ↗
        </a>
      </div>
    `;
  }

  return head("Website Cost Estimator", "Configure your project scope and calculate a transparent, indicative investment range.") + wrapS("", `
    <div class="estimator-wrap">
      <div class="estimator-header-row">
        <div class="estimator-title-group">
          <div class="estimator-status-pill">${esc(est.statusNote || 'Indicative Planning Rates')}</div>
        </div>
        <div class="estimator-currency-selector" role="group" aria-label="Select Currency">
          <button class="cur-btn ${cur === 'INR' ? 'active' : ''}" data-est-cur="INR" type="button">INR (₹)</button>
          <button class="cur-btn ${cur === 'USD' ? 'active' : ''}" data-est-cur="USD" type="button">USD ($)</button>
        </div>
      </div>

      <ol class="estimator-progress" aria-label="Estimator Progress">
        ${stepMeta.map(s => {
          const isActive = s.num === currentStep;
          const isDone = s.num < currentStep;
          return `
            <li>
              <button class="step-btn ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}" data-est-goto="${s.num}" type="button">
                <span class="step-num">Step 0${s.num}</span>
                <span class="step-name">${esc(s.name)}</span>
              </button>
            </li>
          `;
        }).join('')}
      </ol>

      <div class="estimator-card-panel">
        <div class="panel-header-desc">
          <h2>${esc(currentMeta.title)}</h2>
          <p>${esc(currentMeta.desc)}</p>
        </div>

        ${stepHtml}

        ${currentStep < 5 ? `
          <div class="estimator-actions">
            ${currentStep > 1 ? `
              <button class="btn" data-est-nav="back" type="button">← Previous Step</button>
            ` : `<span></span>`}
            <div class="right-actions">
              <button class="btn solid" data-est-nav="next" type="button">Continue to Step 0${currentStep + 1} →</button>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `, 'style="padding-top:20px"');
},
work:()=>{
  const allProjects = pub();
  const cats = ['All', 'Web Development', 'Custom Software & ERP', 'AI Solutions', 'E-Commerce'];
  const filtered = workFilter === 'All' ? allProjects : allProjects.filter(p => {
    if (workFilter === 'Web Development') return p.category.includes('Web Development') || p.category.includes('Front-End');
    if (workFilter === 'Custom Software & ERP') return p.category.includes('ERP') || p.category.includes('CRM') || p.category.includes('Business Software');
    if (workFilter === 'AI Solutions') return p.category.includes('AI') || p.category.includes('ConTech');
    if (workFilter === 'E-Commerce') return p.category.includes('E-Commerce') || p.category.includes('Retail');
    return true;
  });

  return head("Selected Work & Case Studies", "Authentic digital products, enterprise business applications, and web platforms engineered by Caventra.") +
    wrapS("", `
      <div class="work-filter-wrap">
        ${cats.map(c => `<button class="work-filter-btn ${workFilter === c ? 'active' : ''}" data-wcat="${esc(c)}">${esc(c)}</button>`).join('')}
      </div>
      ${workGrid(filtered)}
      <div style="margin-top:64px;padding:48px 32px;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);text-align:center">
        <h3 style="font-size:26px;margin-bottom:12px">Need a bespoke solution engineered for your business?</h3>
        <p style="margin:0 auto 28px;color:var(--mut);max-width:54ch">We architect, design, and deliver custom web platforms with clean code and transparent pricing.</p>
        <div class="row" style="justify-content:center;gap:12px">
          <a class="btn solid" href="/contact/">Start a Project ↗</a>
          <a class="btn" href="/estimator/">Launch Cost Estimator</a>
        </div>
      </div>
    `, 'style="padding-top:20px"');
},
about:()=>{
  const a=S.about;
  return head("About Caventra","Engineering ideas into high-impact digital reality.")+wrapS("",`
    <div style="max-width:840px;margin-bottom:60px">
      <p style="font-size:clamp(20px,2.5vw,28px);line-height:1.45;color:var(--tx);font-weight:300">${esc(a.who)}</p>
    </div>
    <div class="split" style="margin-bottom:64px">
      <div>
        <h2 style="font-size:clamp(28px,3.8vw,44px);color:var(--gold2);line-height:1.15">Our Core Pillars</h2>
        <p style="margin-top:16px;color:var(--mut)">How we think, engineer, and deliver software that makes a commercial difference.</p>
      </div>
      <div>
        ${sec("What We Believe",a.believe)}
        ${sec("Our Engineering Approach",a.approach)}
        ${sec("Our Product & Design Philosophy",a.philosophy)}
        ${sec("What Makes Caventra Different",a.different)}
      </div>
    </div>
    <div style="margin-top:64px;border-top:1px solid var(--line);padding-top:64px">
      <h2 style="margin-bottom:14px">Capabilities &amp; Services Spectrum</h2>
      <p style="margin-bottom:40px;font-size:17px">Every capability is engineered in-house to solve real commercial objectives.</p>
      <div class="bento">
        <div class="bc" style="grid-column:span 3">
          <b>01</b><i>↗</i>
          <div><h3>Web Engineering</h3><p>Fast, responsive web applications engineered with clean code, zero bloat, and resilient architectures.</p></div>
        </div>
        <div class="bc" style="grid-column:span 3">
          <b>02</b><i>↗</i>
          <div><h3>Bespoke Software</h3><p>Custom software systems, business portals, and secure cloud platforms built around real workflows.</p></div>
        </div>
        <div class="bc" style="grid-column:span 3">
          <b>03</b><i>↗</i>
          <div><h3>Applied AI Solutions</h3><p>Automated intelligence pipelines, LLM-powered applications, and custom AI tooling that eliminate manual friction.</p></div>
        </div>
        <div class="bc" style="grid-column:span 3">
          <b>04</b><i>↗</i>
          <div><h3>UI/UX Architecture</h3><p>Intuitive digital product experiences designed with conversion psychology, accessibility, and modern design systems.</p></div>
        </div>
        <div class="bc" style="grid-column:span 3">
          <b>05</b><i>↗</i>
          <div><h3>Business Automation</h3><p>API integrations, webhooks, and automated background data pipelines that reduce operational overhead.</p></div>
        </div>
        <div class="bc" style="grid-column:span 3">
          <b>06</b><i>↗</i>
          <div><h3>Cloud &amp; Security</h3><p>Scalable databases, high-availability deployments, and robust security protocols protecting your data.</p></div>
        </div>
      </div>
    <div style="margin-top:64px;border-top:1px solid var(--line);padding-top:64px">
      <h2 style="margin-bottom:14px">Leadership Team</h2>
      <p style="margin-bottom:40px;font-size:17px;color:var(--mut)">Caventra is leadership-driven. You collaborate directly with the engineers, designers, and growth partners building your platform. <a href="/founders/" style="color:var(--gold);text-decoration:underline;margin-left:8px">Meet our 3 founders ↗</a></p>
      <div class="founders-grid">
        <div class="founder-card">
          <div class="founder-photo-wrap">
            <img class="founder-photo" src="/assets/founders/hriday-vayanta.webp" alt="Hriday Vayanta — Head of Growth" width="320" height="320" loading="lazy">
          </div>
          <h3>Hriday Vayanta</h3>
          <span class="founder-role">Head of Growth</span>
          <p class="founder-bio">Leads commercial growth, client partnerships, digital advertising, marketing campaigns, social media management, and recruitment operations at Caventra.</p>
          <span class="founder-focus">Growth &amp; Sales · Marketing &amp; Ads · Talent &amp; Operations</span>
          <div class="founder-contact-meta">
            <div class="meta-row">
              <span class="meta-label">Email:</span>
              <a class="meta-val meta-email" href="mailto:hridayvayanta7@gmail.com" title="Email Hriday Vayanta">hridayvayanta7@gmail.com</a>
            </div>
            <div class="meta-row">
              <span class="meta-label">Direct:</span>
              <a class="meta-val" href="tel:+918866790989" title="Call Hriday Vayanta">+91 88667 90989</a>
            </div>
          </div>
          <div class="founder-actions">
            <a class="btn sm" href="https://wa.me/918866790989" target="_blank" rel="noopener">WhatsApp ↗</a>
            <a class="btn sm" href="mailto:hridayvayanta7@gmail.com" title="Email Hriday Vayanta">Email Hriday ↗</a>
          </div>
        </div>
        <div class="founder-card">
          <div class="founder-photo-wrap">
            <img class="founder-photo" src="/assets/founders/ved-nimbark.webp" alt="Ved Nimbark — Head of Design" width="320" height="320" loading="lazy">
          </div>
          <h3>Ved Nimbark</h3>
          <span class="founder-role">Head of Design</span>
          <p class="founder-bio">Directs visual brand identities, accessible design systems, fluid typographic hierarchies, and high-conversion user interfaces.</p>
          <span class="founder-focus">Design Systems · Accessibility · UI/UX</span>
          <div class="founder-contact-meta">
            <div class="meta-row">
              <span class="meta-label">Email:</span>
              <a class="meta-val meta-email" href="mailto:vednimbark08@gmail.com" title="Email Ved Nimbark">vednimbark08@gmail.com</a>
            </div>
            <div class="meta-row">
              <span class="meta-label">Direct:</span>
              <a class="meta-val" href="tel:+918849186747" title="Call Ved Nimbark">+91 88491 86747</a>
            </div>
          </div>
          <div class="founder-actions">
            <a class="btn sm" href="https://wa.me/918849186747" target="_blank" rel="noopener">WhatsApp ↗</a>
            <a class="btn sm" href="mailto:vednimbark08@gmail.com" title="Email Ved Nimbark">Email Ved ↗</a>
          </div>
        </div>
        <div class="founder-card">
          <div class="founder-photo-wrap">
            <img class="founder-photo" src="/assets/founders/sauranahmed-mansuri.webp" alt="Sauranahmed Mansuri — Head of Technology" width="320" height="320" loading="lazy">
          </div>
          <h3>Sauranahmed Mansuri</h3>
          <span class="founder-role">Head of Technology</span>
          <p class="founder-bio">Architects the end-to-end technical ecosystem at Caventra, engineering frontend and backend systems, database infrastructures, and cloud deployment pipelines.</p>
          <span class="founder-focus">Full-Stack · Cloud &amp; DevOps · System Architecture</span>
          <div class="founder-contact-meta">
            <div class="meta-row">
              <span class="meta-label">Email:</span>
              <a class="meta-val meta-email" href="mailto:sauran.caventra@gmail.com" title="Email Sauranahmed Mansuri">sauran.caventra@gmail.com</a>
            </div>
            <div class="meta-row">
              <span class="meta-label">Direct:</span>
              <a class="meta-val" href="tel:+917990652097" title="Call Sauranahmed Mansuri">+91 79906 52097</a>
            </div>
          </div>
          <div class="founder-actions">
            <a class="btn sm" href="https://wa.me/917990652097" target="_blank" rel="noopener">WhatsApp ↗</a>
            <a class="btn sm" href="mailto:sauran.caventra@gmail.com" title="Email Sauranahmed Mansuri">Email Sauran ↗</a>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:72px;padding:52px 32px;border:1px solid var(--gold);border-radius:var(--r);background:radial-gradient(ellipse at 50% 0%,rgba(201,184,160,.12),transparent 75%) var(--bg2);text-align:center">
      <h2 style="font-size:clamp(28px,4.5vw,52px);margin-bottom:14px">Have an idea worth building?</h2>
      <p style="margin:0 auto 32px;font-size:17px;max-width:54ch">Let's discuss your project goals, technical requirements, and timeline directly with our team.</p>
      <div class="row" style="justify-content:center;gap:12px;flex-wrap:wrap">
        <a class="btn solid" href="/contact/">Start a Project ↗</a>
        <a class="btn" href="https://wa.me/918866790989" target="_blank" rel="noopener">Chat on WhatsApp</a>
        <a class="btn" href="/estimator/">Cost Estimator</a>
      </div>
    </div>
  `,'style="padding-top:20px"')
},
founders:()=>{
  return head("Founders of Caventra","Caventra was founded by three founders: Hriday Vayanta, Ved Nimbark, and Sauranahmed Mansuri.")+wrapS("",`
    <div class="service-breadcrumb"><a href="/">Home</a> <span>/</span> <span>Founders</span></div>
    
    <div style="background:var(--bg2);border:1px solid var(--line);border-left:4px solid var(--gold);border-radius:var(--r);padding:28px 32px;margin-bottom:48px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--gold);background:rgba(201,184,160,.12);padding:4px 10px;border-radius:999px">Leadership Overview</span>
        <span style="font-size:13px;color:var(--mut)">Official Founding Team</span>
      </div>
      <p style="font-size:clamp(17px,2.2vw,20px);line-height:1.6;color:var(--tx);margin:0 0 14px">
        <strong>Caventra</strong> is a bespoke web engineering and digital solutions studio founded by <strong>three founders</strong>: <strong>Hriday Vayanta</strong> (Head of Growth), <strong>Ved Nimbark</strong> (Head of Design), and <strong>Sauranahmed Mansuri</strong> (Head of Technology).
      </p>
      <p style="font-size:15px;line-height:1.65;color:var(--mut);margin:0">
        Headquartered in Ahmedabad, Gujarat, India and partnering with businesses across India, North America, and globally, Caventra operates as a founder-led studio where clients collaborate directly with the three founders on growth, design, and full-stack software development.
      </p>
    </div>

    <div>
      <h2 style="font-size:clamp(24px,3.5vw,36px);margin-bottom:12px">Meet the 3 Founders</h2>
      <p style="margin-bottom:36px;color:var(--mut);font-size:16px">Our three founders lead the strategic pillars of every digital product we engineer.</p>
      <div class="founders-grid">
        <div class="founder-card">
          <div class="founder-photo-wrap">
            <img class="founder-photo" src="/assets/founders/hriday-vayanta.webp" alt="Hriday Vayanta — Founder &amp; Head of Growth at Caventra" width="320" height="320" loading="eager">
          </div>
          <h3>Hriday Vayanta</h3>
          <span class="founder-role">Founder &amp; Head of Growth</span>
          <p class="founder-bio">Leads commercial growth, client partnerships, digital advertising, marketing campaigns, social media management, and recruitment operations at Caventra. He works directly with founders and business leaders to scale brand visibility and conversion performance.</p>
          <span class="founder-focus">Growth &amp; Sales · Marketing &amp; Ads · Talent &amp; Operations</span>
          <div class="founder-contact-meta">
            <div class="meta-row">
              <span class="meta-label">Email:</span>
              <a class="meta-val meta-email" href="mailto:hridayvayanta7@gmail.com" title="Email Hriday Vayanta">hridayvayanta7@gmail.com</a>
            </div>
            <div class="meta-row">
              <span class="meta-label">Direct:</span>
              <a class="meta-val" href="tel:+918866790989" title="Call Hriday Vayanta">+91 88667 90989</a>
            </div>
          </div>
          <div class="founder-actions">
            <a class="btn sm" href="https://wa.me/918866790989" target="_blank" rel="noopener">WhatsApp ↗</a>
            <a class="btn sm" href="mailto:hridayvayanta7@gmail.com" title="Email Hriday Vayanta">Email Hriday ↗</a>
          </div>
        </div>

        <div class="founder-card">
          <div class="founder-photo-wrap">
            <img class="founder-photo" src="/assets/founders/ved-nimbark.webp" alt="Ved Nimbark — Founder &amp; Head of Design at Caventra" width="320" height="320" loading="eager">
          </div>
          <h3>Ved Nimbark</h3>
          <span class="founder-role">Founder &amp; Head of Design</span>
          <p class="founder-bio">Directs visual brand identities, accessible design systems, fluid typographic hierarchies, and high-conversion user interfaces. He ensures every Caventra client receives a distinctive, high-polish visual experience crafted without generic templates.</p>
          <span class="founder-focus">Design Systems · Accessibility · UI/UX</span>
          <div class="founder-contact-meta">
            <div class="meta-row">
              <span class="meta-label">Email:</span>
              <a class="meta-val meta-email" href="mailto:vednimbark08@gmail.com" title="Email Ved Nimbark">vednimbark08@gmail.com</a>
            </div>
            <div class="meta-row">
              <span class="meta-label">Direct:</span>
              <a class="meta-val" href="tel:+918849186747" title="Call Ved Nimbark">+91 88491 86747</a>
            </div>
          </div>
          <div class="founder-actions">
            <a class="btn sm" href="https://wa.me/918849186747" target="_blank" rel="noopener">WhatsApp ↗</a>
            <a class="btn sm" href="mailto:vednimbark08@gmail.com" title="Email Ved Nimbark">Email Ved ↗</a>
          </div>
        </div>

        <div class="founder-card">
          <div class="founder-photo-wrap">
            <img class="founder-photo" src="/assets/founders/sauranahmed-mansuri.webp" alt="Sauranahmed Mansuri — Founder &amp; Head of Technology at Caventra" width="320" height="320" loading="eager">
          </div>
          <h3>Sauranahmed Mansuri</h3>
          <span class="founder-role">Founder &amp; Head of Technology</span>
          <p class="founder-bio">Architects the end-to-end technical ecosystem at Caventra, engineering frontend and backend systems, database infrastructures, and cloud deployment pipelines. He specializes in sub-second page performance, robust API architectures, and bulletproof security.</p>
          <span class="founder-focus">Full-Stack · Cloud &amp; DevOps · System Architecture</span>
          <div class="founder-contact-meta">
            <div class="meta-row">
              <span class="meta-label">Email:</span>
              <a class="meta-val meta-email" href="mailto:sauran.caventra@gmail.com" title="Email Sauranahmed Mansuri">sauran.caventra@gmail.com</a>
            </div>
            <div class="meta-row">
              <span class="meta-label">Direct:</span>
              <a class="meta-val" href="tel:+917990652097" title="Call Sauranahmed Mansuri">+91 79906 52097</a>
            </div>
          </div>
          <div class="founder-actions">
            <a class="btn sm" href="https://wa.me/917990652097" target="_blank" rel="noopener">WhatsApp ↗</a>
            <a class="btn sm" href="mailto:sauran.caventra@gmail.com" title="Email Sauran ↗">Email Sauran ↗</a>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top:72px;border-top:1px solid var(--line);padding-top:56px">
      <h2 style="font-size:clamp(24px,3.5vw,36px);margin-bottom:14px">Why Caventra Operates as a Founder-Led Studio</h2>
      <p style="margin-bottom:32px;color:var(--mut);font-size:16px;max-width:70ch">Traditional agencies hand client deliverables down to junior sub-contractors and account managers. At Caventra, our 3 founders remain hands-on across every project from inception to launch.</p>
      <div class="bento">
        <div class="bc" style="grid-column:span 3">
          <b>01</b><i>↗</i>
          <div>
            <h3>Direct Founder Access</h3>
            <p>No intermediaries or account managers. You collaborate directly with the three founders architecting your software and visual design.</p>
          </div>
        </div>
        <div class="bc" style="grid-column:span 3">
          <b>02</b><i>↗</i>
          <div>
            <h3>Tri-Pillar Synergy</h3>
            <p>Growth, design, and full-stack engineering work in complete alignment from day one, eliminating costly rewrites and miscommunications.</p>
          </div>
        </div>
        <div class="bc" style="grid-column:span 3">
          <b>03</b><i>↗</i>
          <div>
            <h3>100% IP &amp; Code Ownership</h3>
            <p>Every line of code and design component is built bespoke in-house and transferred with complete intellectual property ownership to your business.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="founders-faq-section" style="margin-top:72px;border-top:1px solid var(--line);padding-top:56px">
      <h2 style="font-size:clamp(24px,3.5vw,36px);margin-bottom:14px">Frequently Asked Questions About Caventra's Founders</h2>
      <p style="margin-bottom:28px;color:var(--mut);font-size:16px">Key factual details verified for clients, search engines, and Google AI Overviews.</p>
      <div class="faq-wrap" style="margin-top:0">
        <div class="faq-item">
          <div class="faq-q">How many founders does Caventra have?</div>
          <p class="faq-a">Caventra has exactly <strong>three founders</strong>: <strong>Hriday Vayanta</strong> (Head of Growth), <strong>Ved Nimbark</strong> (Head of Design), and <strong>Sauranahmed Mansuri</strong> (Head of Technology).</p>
        </div>
        <div class="faq-item">
          <div class="faq-q">Who are the founders of Caventra?</div>
          <p class="faq-a">The three founders of Caventra are:
            <br>1. <strong>Hriday Vayanta</strong> — Founder &amp; Head of Growth (Email: <a href="mailto:caventraofficial@gmail.com" style="color:var(--gold)">caventraofficial@gmail.com</a>)
            <br>2. <strong>Ved Nimbark</strong> — Founder &amp; Head of Design (Email: <a href="mailto:vednimbark08@gmail.com" style="color:var(--gold)">vednimbark08@gmail.com</a>)
            <br>3. <strong>Sauranahmed Mansuri</strong> — Founder &amp; Head of Technology (Email: <a href="mailto:sauran.caventra@gmail.com" style="color:var(--gold)">sauran.caventra@gmail.com</a>)
          </p>
        </div>
        <div class="faq-item">
          <div class="faq-q">What roles do the founders lead at Caventra?</div>
          <p class="faq-a">Hriday Vayanta leads client growth, partnerships, digital marketing, and operations. Ved Nimbark directs brand identities, typography, and UI/UX design systems. Sauranahmed Mansuri architects full-stack web software, databases, security, and cloud infrastructure.</p>
        </div>
        <div class="faq-item">
          <div class="faq-q">Where is Caventra located?</div>
          <p class="faq-a">Caventra is headquartered in <strong>Ahmedabad, Gujarat, India</strong>, delivering custom software, web design, and digital engineering worldwide.</p>
        </div>
      </div>
    </div>

    <div style="margin-top:72px;padding:52px 32px;border:1px solid var(--gold);border-radius:var(--r);background:radial-gradient(ellipse at 50% 0%,rgba(201,184,160,.12),transparent 75%) var(--bg2);text-align:center">
      <h2 style="font-size:clamp(28px,4.5vw,52px);margin-bottom:14px">Work directly with Caventra's founders</h2>
      <p style="margin:0 auto 32px;font-size:17px;max-width:54ch">Discuss your project goals, technical requirements, and timeline directly with our founding leadership.</p>
      <div class="row" style="justify-content:center;gap:12px;flex-wrap:wrap">
        <a class="btn solid" href="/contact/">Start a Project ↗</a>
        <a class="btn" href="https://wa.me/918866790989" target="_blank" rel="noopener">Chat on WhatsApp</a>
        <a class="btn" href="/estimator/">Cost Estimator</a>
      </div>
    </div>
  `,'style="padding-top:20px"')
},