
function deliveryProcessSection() {
  const steps = [
    { num: "01", title: "Discovery & Requirements", desc: "We discuss your vision, goals, target audience, and project scope. Our team defines core requirements and success metrics to ensure your new website delivers real commercial growth." },
    { num: "02", title: "Planning & Architecture", desc: "We plan site structure, wireframe flows, tech stack, and clear milestones. You receive an upfront architecture blueprint and an itemized fixed quote before any coding begins." },
    { num: "03", title: "Design & Prototyping", desc: "We craft intentional layouts and responsive prototypes for your review. Our interactive designs look sharp in both dark and light modes across phones, tablets, and desktop viewports." },
    { num: "04", title: "Full-Stack Engineering", desc: "We write clean, lightweight code without fragile page-builders. Every component is engineered by hand for fast loading, semantic markup, and reliable cross-browser stability." },
    { num: "05", title: "Testing & Verification", desc: "We test across phones, tablets, and desktops for speed, forms, and accessibility. Rigorous quality assurance guarantees high Core Web Vitals scores and smooth user journeys." },
    { num: "06", title: "Launch & Deployment", desc: "We handle domain configuration, SSL, and zero-downtime global deployment. Your website launches seamlessly on high-speed cloud edge networks with automated security certificates." },
    { num: "07", title: "Ongoing Support & Scaling", desc: "We provide ongoing maintenance, security updates, and performance tuning. Our engineering team monitors your live site continuously so it remains fast, protected, and up to date." }
  ];

  return `
    <section>
      <div class="wrap">
        <div class="section-header-compact">
          <span class="section-kicker">Disciplined Delivery</span>
          <h2 class="section-title" id="process">How We Deliver Custom Websites: Seven-Stage Process</h2>
          <p class="section-subtitle">Our disciplined seven-stage delivery process guides your custom website project smoothly from initial strategic discovery all the way to high-speed global cloud deployment.</p>
        </div>
        <ol class="process-timeline" style="list-style:none;padding:0;margin:0">
          ${steps.map(s => `
            <li class="process-step-item">
              <span class="process-step-num">${s.num}</span>
              <h3 class="process-step-title" id="step-${s.num}">${esc(s.title)}</h3>
              <p class="process-step-desc">${esc(s.desc)}</p>
            </li>
          `).join('')}
        </ol>
        <div style="margin-top:32px;display:flex;gap:12px;flex-wrap:wrap">
          <a class="btn solid" href="/contact/">Discuss Your Project Scope ↗</a>
          <a class="btn" href="/estimator/">Calculate Indicative Budget</a>
        </div>
      </div>
    </section>
  `;
}

function trustStandardsSection() {
  const standards = [
    {
      id: "ownership",
      icon: "⚖",
      title: "100% Client Code & IP Ownership",
      desc: "You own every single line of code, design asset, and account upon completion. No vendor lock-in, ever. We deliver complete Git source repositories and production keys directly to your team."
    },
    {
      id: "performance",
      icon: "⚡",
      title: "No Fragile Page-Builders",
      desc: "Clean, hand-crafted code with zero bloated plugins. Your site loads fast and won't break on updates. We use semantic modern code that search engines love and understand easily."
    },
    {
      id: "pricing",
      icon: "🏷",
      title: "Upfront Transparent Quotes",
      desc: "Itemized milestone pricing with clear deliverables. You know exactly what it costs before we start. We guarantee honest estimates with zero hidden charges or surprise agency markups."
    },
    {
      id: "collaboration",
      icon: "🛠",
      title: "Direct Engineer Collaboration",
      desc: "Work directly with the developers designing and coding your site, not account middlemen. You get faster answers, better technical decisions, and smooth project delivery from start to finish."
    }
  ];

  return `
    <section>
      <div class="wrap">
        <div class="section-header-compact">
          <span class="section-kicker">Accountability &amp; Standards</span>
          <h2 class="section-title" id="standards">Engineered on Trust &amp; Transparency</h2>
          <p class="section-subtitle">We hold our software studio to rigorous engineering standards, guaranteeing total code ownership, lightning-fast site speed, transparent pricing, and direct collaboration with our builders.</p>
        </div>
        <div class="trust-standards-grid">
          ${standards.map(s => `
            <div class="trust-card">
              <span class="trust-icon">${s.icon}</span>
              <h3 id="standard-${s.id}">${esc(s.title)}</h3>
              <p>${esc(s.desc)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function homepageFAQSection() {
  const faqs = [
    {
      id: "services",
      q: "What services does Caventra provide?",
      a: "Caventra builds, hosts, protects, and manages fast custom websites and digital software for growing businesses. Our four core services cover complete website design and development, reliable cloud hosting with continuous uptime, proactive site security, and monthly care to keep your site fast, fresh, and bug-free at all times."
    },
    {
      id: "ownership",
      q: "Do I own my code and website after launch?",
      a: "Yes, you own 100 percent of your code and digital assets. When your project is complete and paid for, we transfer full intellectual property ownership directly to you. That includes all source code files, design files, live hosting keys, and site accounts with zero vendor lock-in or recurring platform fees."
    },
    {
      id: "different",
      q: "How does Caventra differ from traditional agencies?",
      a: "Caventra writes clean custom code from scratch rather than relying on slow templates like WordPress or Wix. Your site loads faster, looks truly unique, and will not break from plugin conflicts. You also work directly with our founding engineers who build your product, not non-technical sales reps or middle managers."
    },
    {
      id: "timeline",
      q: "How long does a typical project take to complete?",
      a: "A standard custom business website takes two to three weeks from kickoff to launch. More complex web apps, member portals, and online store platforms take four to six weeks. We work through seven clear stages with live weekly preview links so you always see exactly what is being built."
    },
    {
      id: "cost",
      q: "How much does a custom website cost with Caventra?",
      a: "Custom business websites range from 850 to 2,800 dollars depending on your page count, custom features, and backend requirements. We provide upfront itemized pricing with clear milestones and no hidden fees. You can configure your project requirements and receive an instant estimate with our free Cost Estimator tool."
    },
    {
      id: "maintenance",
      q: "Can you maintain and support a website you did not build?",
      a: "Yes, we can manage, host, and speed up websites built by others. Through our website management service, our engineers review your existing site code, fix urgent bugs, improve load speed, set up daily backups, and install security protections so your site stays fast, safe, and up to date."
    }
  ];

  return `
    <section>
      <div class="wrap">
        <div class="section-header-compact">
          <span class="section-kicker">Client Questions</span>
          <h2 class="section-title" id="faq">Frequently Asked Questions</h2>
          <p class="section-subtitle">Read straightforward answers to common questions about our custom web engineering, intellectual property ownership, delivery timelines, pricing, and ongoing website management services.</p>
        </div>
        <form id="agent-faq-search" action="/contact/" method="get" toolname="searchFAQ" tooldescription="Search questions regarding custom web engineering, delivery timelines, pricing tiers, and IP ownership" toolparamdescription="Natural language question about Caventra services and processes" style="display:none"></form>
        <div class="faq-wrap">
          ${faqs.map(f => `
            <div class="faq-item">
              <h3 class="faq-q" id="faq-${f.id}">${esc(f.q)}</h3>
              <p class="faq-a">${esc(f.a)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function homepageTestimonialsSection() {
  const testimonials = [
    {
      quote: "Caventra engineered The Wheel Master ERP from scratch. Our sales team went from juggling messy spreadsheets to managing every order in real-time. Sub-second speed and zero downtime.",
      author: "Operations Director",
      company: "The Wheel Master",
      badge: "Client Production ERP"
    },
    {
      quote: "Their 100% code ownership model is rare. No monthly plugin fees, no hidden agency lock-in, just clean code that loads instantly and ranks on Google.",
      author: "Lead Product Engineer",
      company: "GenResume",
      badge: "Production Web App"
    },
    {
      quote: "The transparent pricing, clean dark and light themes, and instant WhatsApp notifications completely streamlined our bridal retail customer enquiry workflow and boosted conversions.",
      author: "Creative Director",
      company: "Divine Bridal Accessories",
      badge: "E-Commerce Showcase"
    }
  ];

  return `
    <section class="testimonials-section">
      <div class="wrap">
        <div class="section-header-compact">
          <span class="section-kicker">Client Feedback</span>
          <h2 class="section-title" id="testimonials">Built with Precision. Trusted by Founders.</h2>
          <p class="section-subtitle">Explore genuine outcomes from commercial founders and growing companies that chose clean, hand-crafted software engineering over generic templates and bloated website page-builders.</p>
        </div>
        <div class="testimonial-grid">
          ${testimonials.map(t => `
            <article class="testimonial-card">
              <span class="testimonial-badge">${esc(t.badge)}</span>
              <p class="testimonial-quote">“${esc(t.quote)}”</p>
              <div class="testimonial-meta">
                <span class="testimonial-author">${esc(t.author)}</span>
                <span class="testimonial-company">${esc(t.company)}</span>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function comparisonTableSection() {
  return `
    <section>
      <div class="wrap">
        <div class="section-header-compact">
          <span class="section-kicker">Technical Evaluation</span>
          <h2 class="section-title" id="comparison">Architectural Comparison: Custom Engineering vs Templates</h2>
          <p class="section-subtitle">Compare the key technical, financial, and operational differences between hand-crafted software engineering, fragile WordPress page-builders, and closed DIY proprietary platform builders.</p>
        </div>
        <div style="overflow-x:auto;margin-top:28px">
          <table class="data-comparison-table" style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
            <caption class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0">Custom Web Development vs WordPress vs DIY Builders Comparison</caption>
            <thead>
              <tr style="border-bottom:2px solid var(--bdr);background:var(--s1)">
                <th style="padding:14px 16px;font-weight:700">Engineering Metric</th>
                <th style="padding:14px 16px;font-weight:700;color:var(--tx)">Caventra Custom Engineering</th>
                <th style="padding:14px 16px;font-weight:600;color:var(--mut)">WordPress &amp; Elementor</th>
                <th style="padding:14px 16px;font-weight:600;color:var(--mut)">DIY Builders (Wix / Squarespace)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid var(--bdr)">
                <td style="padding:12px 16px;font-weight:600">Page Load Time</td>
                <td style="padding:12px 16px;color:var(--tx)">Sub-second (&lt; 0.8s)</td>
                <td style="padding:12px 16px;color:var(--mut)">3.5s to 7.0s (plugin bloat)</td>
                <td style="padding:12px 16px;color:var(--mut)">2.5s to 5.0s (script overhead)</td>
              </tr>
              <tr style="border-bottom:1px solid var(--bdr)">
                <td style="padding:12px 16px;font-weight:600">Source Code Ownership</td>
                <td style="padding:12px 16px;color:var(--tx)">100% Client-Owned Git Repo</td>
                <td style="padding:12px 16px;color:var(--mut)">Theme &amp; plugin vendor lock-in</td>
                <td style="padding:12px 16px;color:var(--mut)">Proprietary platform locked</td>
              </tr>
              <tr style="border-bottom:1px solid var(--bdr)">
                <td style="padding:12px 16px;font-weight:600">Core Web Vitals</td>
                <td style="padding:12px 16px;color:var(--tx)">95 to 100 Green Score</td>
                <td style="padding:12px 16px;color:var(--mut)">Fails LCP &amp; CLS frequently</td>
                <td style="padding:12px 16px;color:var(--mut)">Limited control / average</td>
              </tr>
              <tr style="border-bottom:1px solid var(--bdr)">
                <td style="padding:12px 16px;font-weight:600">Security Architecture</td>
                <td style="padding:12px 16px;color:var(--tx)">Zero third-party attack surface</td>
                <td style="padding:12px 16px;color:var(--mut)">Frequent CVE plugin vulnerabilities</td>
                <td style="padding:12px 16px;color:var(--mut)">Closed black box</td>
              </tr>
              <tr style="border-bottom:1px solid var(--bdr)">
                <td style="padding:12px 16px;font-weight:600">Recurring Software Fees</td>
                <td style="padding:12px 16px;color:var(--tx)">$0 recurring plugin licenses</td>
                <td style="padding:12px 16px;color:var(--mut)">Expensive annual plugin fees</td>
                <td style="padding:12px 16px;color:var(--mut)">Mandatory monthly platform rent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

const V={