
function deliveryProcessSection() {
  const steps = [
    { num: "01", title: "Discovery & Requirements", desc: "We discuss your vision, goals, target audience, and project scope." },
    { num: "02", title: "Planning & Architecture", desc: "We plan site structure, wireframe flows, tech stack, and clear milestones." },
    { num: "03", title: "Design & Prototyping", desc: "We craft intentional layouts and responsive prototypes for your review." },
    { num: "04", title: "Full-Stack Engineering", desc: "We write clean, lightweight code without fragile page-builders." },
    { num: "05", title: "Testing & Verification", desc: "We test across phones, tablets, and desktops for speed, forms, and accessibility." },
    { num: "06", title: "Launch & Deployment", desc: "We handle domain configuration, SSL, and zero-downtime global deployment." },
    { num: "07", title: "Ongoing Support & Scaling", desc: "We provide ongoing maintenance, security updates, and performance tuning." }
  ];

  return `
    <section>
      <div class="wrap">
        <div class="section-header-compact">
          <span class="section-kicker">Disciplined Delivery</span>
          <h2 class="section-title">From First Conversation to Scaled Reality</h2>
          <p class="section-subtitle">A clear, simple process from our first call to your live launch.</p>
        </div>
        <div class="process-timeline">
          ${steps.map(s => `
            <div class="process-step-item">
              <span class="process-step-num">${s.num}</span>
              <h3 class="process-step-title">${esc(s.title)}</h3>
              <p class="process-step-desc">${esc(s.desc)}</p>
            </div>
          `).join('')}
        </div>
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
      icon: "⚖",
      title: "100% Client Code & IP Ownership",
      desc: "You own every single line of code, design asset, and account upon completion. No vendor lock-in, ever."
    },
    {
      icon: "⚡",
      title: "No Fragile Page-Builders",
      desc: "Clean, hand-crafted code with zero bloated plugins. Your site loads fast and won't break on updates."
    },
    {
      icon: "🏷",
      title: "Upfront Transparent Quotes",
      desc: "Itemized milestone pricing with clear deliverables. You know exactly what it costs before we start."
    },
    {
      icon: "🛠",
      title: "Direct Engineer Collaboration",
      desc: "Work directly with the developers designing and coding your site, not account middlemen."
    }
  ];

  return `
    <section>
      <div class="wrap">
        <div class="section-header-compact">
          <span class="section-kicker">Accountability &amp; Standards</span>
          <h2 class="section-title">Engineered on Trust &amp; Transparency</h2>
          <p class="section-subtitle">Clear standards we stand by on every project.</p>
        </div>
        <div class="trust-standards-grid">
          ${standards.map(s => `
            <div class="trust-card">
              <span class="trust-icon">${s.icon}</span>
              <h3>${esc(s.title)}</h3>
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
      q: "What services does Caventra provide?",
      a: "Caventra provides end-to-end digital software engineering through four core pillars: BUILD (custom website design and full-stack web applications), MANAGE (routine maintenance, content updates, and Core Web Vitals optimization), SECURE (enterprise HTTP headers, spam defense, and encrypted backups), and HOST (global edge CDN cloud hosting with 99.9% uptime)."
    },
    {
      q: "Do I own my code and website after launch?",
      a: "Yes, 100%. Once final payment is fulfilled, all source code, design assets, and deployment keys transfer directly to you with zero vendor lock-in. You receive full intellectual property ownership, source repositories, production builds, and host account access."
    },
    {
      q: "How does Caventra differ from traditional agencies?",
      a: "We write custom, lightweight code instead of using slow templates like WordPress or Wix. Your site loads faster, looks unique, and doesn't break from third-party plugin conflicts. You collaborate directly with our founding engineers rather than non-technical account managers."
    },
    {
      q: "How long does a typical project take to complete?",
      a: "Standard business websites take 2 to 3 weeks from discovery kickoff to production launch. Custom web applications, interactive portals, and complex e-commerce platforms take 4 to 6 weeks, delivered across seven disciplined milestone stages."
    },
    {
      q: "How much does a custom website cost with Caventra?",
      a: "Custom business websites range from $850 to $2,800 depending on interactive scope, custom animations, and backend requirements. We offer transparent upfront milestone pricing with zero hidden fees. You can calculate an instant estimate using our interactive Website Cost Estimator."
    },
    {
      q: "Can you maintain and support a website you didn't build?",
      a: "Yes. Through our MANAGE service, we audit your existing site, resolve urgent issues, optimize Core Web Vitals, and provide ongoing maintenance, security patching, and managed cloud hosting."
    }
  ];

  return `
    <section>
      <div class="wrap">
        <div class="section-header-compact">
          <span class="section-kicker">Client Questions</span>
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-subtitle">Clear answers to help you evaluate partnering with Caventra.</p>
        </div>
        <div class="faq-wrap">
          ${faqs.map(f => `
            <div class="faq-item">
              <h3 class="faq-q">${esc(f.q)}</h3>
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
      quote: "The transparent pricing, clean dark/light themes, and instant WhatsApp notifications completely streamlined our bridal retail enquiry flow.",
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
          <h2 class="section-title">Built with Precision. Trusted by Founders.</h2>
          <p class="section-subtitle">Real outcomes from businesses that chose clean software engineering over generic templates.</p>
        </div>
        <div class="testimonial-grid">
          ${testimonials.map(t => `
            <div class="testimonial-card">
              <span class="testimonial-badge">${esc(t.badge)}</span>
              <p class="testimonial-quote">“${esc(t.quote)}”</p>
              <div class="testimonial-meta">
                <span class="testimonial-author">${esc(t.author)}</span>
                <span class="testimonial-company">${esc(t.company)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

const V={