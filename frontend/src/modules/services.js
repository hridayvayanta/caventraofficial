// ---- CAVENTRA Dedicated Services Catalog ----
const CAVENTRA_SERVICES_DATA = {
  "web-development": {
    slug: "web-development",
    title: "Website Design & Development",
    headline: "Fast, Custom Websites Built to Grow Your Business",
    tagline: "Hand-crafted code, modern responsive design, and sub-second load speeds with zero template bloat.",
    category: "Core Service · BUILD",
    problem: "Generic templates and bloated page-builders look unprofessional, load slowly, and break on updates, costing you high-intent clients.",
    solution: "We build custom, lightweight websites tailored to your business goals — engineered for speed, clear navigation, and higher conversions.",
    deliverables: [
      { title: "Custom Frontend Code", desc: "Clean, hand-crafted HTML5, CSS3, and JavaScript with zero plugin clutter." },
      { title: "Responsive UX & UI", desc: "Intuitive, modern layouts tailored for mobile phones, tablets, and desktops." },
      { title: "Fast Sub-Second Loading", desc: "Sub-second initial render optimized for Google Core Web Vitals and SEO." },
      { title: "Interactive Tools & Webhooks", desc: "Custom estimators, contact pipelines, and instant lead capture routing." },
      { title: "Cross-Device Testing", desc: "Rigorous testing on iOS Safari, Android Chrome, and desktop viewports." },
      { title: "100% Code & Asset Ownership", desc: "Full intellectual property, source files, and credentials delivered to you." }
    ],
    workflow: [
      { num: "01", title: "Discovery", desc: "We understand your business model, target audience, and feature requirements." },
      { num: "02", title: "Design", desc: "We craft clean, interactive prototypes for desktop and mobile screens." },
      { num: "03", title: "Development", desc: "We write clean, lightweight code and connect custom features." },
      { num: "04", title: "Launch", desc: "We audit speed, verify forms, configure DNS, and deploy live." }
    ],
    projectSlugs: ["soft-aurora", "gloss-atelier"],
    whoItsFor: "Growing SMEs, founders, service businesses, and e-commerce brands looking to eliminate slow page-builders and invest in a fast, bespoke digital platform that converts.",
    pricingTier: "Bespoke projects starting from ₹25,000 / $450",
    faqs: [
      { q: "Do you use WordPress, Wix, or page-builders?", a: "No. We hand-craft custom code. This makes your site significantly faster, more secure, and completely free of plugin subscriptions." },
      { q: "Do I own the website and source code after launch?", a: "Yes, 100%. All source code, design files, and deployment accounts belong entirely to you with zero vendor lock-in." },
      { q: "How long does a website project take?", a: "A standard business website takes 2 to 3 weeks. Custom web apps and complex platforms take 4 to 6 weeks." },
      { q: "Can you connect forms to WhatsApp or Google Sheets?", a: "Yes. We build instant notification pipelines so you receive client inquiries directly without friction." }
    ]
  },
  "branding": {
    slug: "branding",
    title: "Branding & Creative Design",
    headline: "Distinctive Visual Identities for Modern Brands",
    tagline: "Logos, typographic systems, color palettes, and digital guidelines that build authority and trust.",
    category: "Visual Identity · DESIGN",
    problem: "Inconsistent fonts, outdated logos, and generic stock styling make companies look amateur and lose customer trust.",
    solution: "We craft intentional brand identities that project credibility, authority, and modern polish across all touchpoints.",
    deliverables: [
      { title: "Logo & Mark Suite", desc: "Primary logo, horizontal/vertical lockups, mobile icons, and favicons." },
      { title: "Typographic & Color System", desc: "Curated font pairings and accessible palettes for dark and light media." },
      { title: "Digital UI Guidelines", desc: "Button styles, card components, and visual rules for your web presence." },
      { title: "Brand Style Guide", desc: "A clear reference manual detailing spacing, clear space, and logo usage." },
      { title: "Marketing Collateral", desc: "High-resolution vector assets, social banners, and pitch presentation slides." },
      { title: "Master Vector Files", desc: "Full export suite (SVG, PDF, EPS, PNG) ready for digital and print." }
    ],
    workflow: [
      { num: "01", title: "Research", desc: "We analyze your competitive space, audience, and core values." },
      { num: "02", title: "Concepts", desc: "We explore distinct logo directions, typography, and visual tones." },
      { num: "03", title: "Refinement", desc: "We test chosen designs across dark and light formats and lock in colors." },
      { num: "04", title: "Delivery", desc: "We export production-ready vector assets and your brand style guide." }
    ],
    projectSlugs: ["soft-aurora", "gloss-atelier"],
    whoItsFor: "Modern startups, established firms undergoing a rebrand, and companies requiring an authoritative visual identity, logo suite, typographic system, and UI guidelines.",
    pricingTier: "Brand packages starting from ₹20,000 / $350",
    faqs: [
      { q: "What files and formats do I receive?", a: "You get full vector files (SVG, PDF, EPS) and web-optimized transparent PNGs for both dark and light modes, plus font packages." },
      { q: "Can you refresh an existing brand?", a: "Yes. We modernize outdated logos and typography while preserving established brand equity." },
      { q: "How does branding connect with web development?", a: "Our designs map directly into CSS tokens and components, ensuring a cohesive website build with zero handover friction." }
    ]
  },
  "maintenance": {
    slug: "maintenance",
    title: "Website Management & Maintenance",
    headline: "Proactive Website Care So You Can Focus on Business",
    tagline: "Ongoing maintenance, fast content updates, security patches, and performance oversight under guaranteed SLAs.",
    category: "Ongoing Support · MANAGE",
    problem: "Websites left unmanaged slow down, develop broken links, and become vulnerable to security breaches.",
    solution: "We act as your dedicated web team — updating code, adding new content, monitoring uptime, and fixing issues immediately.",
    deliverables: [
      { title: "Scheduled Code Updates", desc: "Regular maintenance of libraries, frameworks, security patches, and APIs." },
      { title: "Fast Content Publishing", desc: "Quick updates to text, images, case studies, team profiles, and pricing." },
      { title: "Continuous Speed Checks", desc: "Monthly Core Web Vitals audits to keep your site loading under one second." },
      { title: "Form & Lead Health Checks", desc: "Regular verification to ensure inquiry forms and webhooks deliver reliably." },
      { title: "Emergency Bug Fixes", desc: "Priority technical support with rapid turnaround for unexpected defects." },
      { title: "Monthly Summary Reports", desc: "Clear reports on uptime, resolved requests, and optimization recommendations." }
    ],
    workflow: [
      { num: "01", title: "Audit", desc: "We review existing code, hosting settings, and forms to set a healthy baseline." },
      { num: "02", title: "SLA Setup", desc: "We define clear response times for standard tasks and priority emergency fixes." },
      { num: "03", title: "Routine Care", desc: "We apply scheduled updates, run security scans, and monitor uptime." },
      { num: "04", title: "On-Demand Tasks", desc: "We implement new features, pages, and content updates as your business grows." }
    ],
    projectSlugs: ["soft-aurora", "gloss-atelier"],
    whoItsFor: "Business owners who want peace of mind knowing their website is continuously monitored, updated with fresh content within 24–48 hours, patched, and running smoothly.",
    pricingTier: "Care plans starting from ₹4,500/month / $85/month",
    faqs: [
      { q: "Can you maintain a site built by someone else?", a: "Yes. We audit your codebase, resolve urgent issues, and take over ongoing maintenance and updates." },
      { q: "How fast do you handle content updates?", a: "Standard content updates are completed within 24 to 48 hours. Urgent bug fixes receive immediate priority response." },
      { q: "Are contracts locked in long-term?", a: "No. We offer flexible month-to-month arrangements with zero lock-in." }
    ]
  },
  "hosting": {
    slug: "hosting",
    title: "Hosting & Deployment",
    headline: "Fast, Reliable Cloud Hosting with 99.9% Uptime",
    tagline: "Global edge CDNs, automated SSL certificates, and daily backups configured for high availability.",
    category: "Infrastructure · HOST",
    problem: "Cheap shared hosts are slow, crash during traffic surges, lack backups, and cause downtime during updates.",
    solution: "We deploy your website to high-speed cloud networks with global CDN caching, automated SSL, and zero-downtime releases.",
    deliverables: [
      { title: "Global CDN Edge Caching", desc: "Delivers assets from edge servers nearest to your visitors worldwide." },
      { title: "Automated CI/CD Deployment", desc: "Instant, seamless updates pushed directly from version control with zero downtime." },
      { title: "Automated SSL Certificates", desc: "Enforced HTTPS encryption with auto-renewing certificates." },
      { title: "DNS & Domain Setup", desc: "Proper configuration of records (A, CNAME, SPF, DKIM) for web and email." },
      { title: "24/7 Uptime Monitoring", desc: "Automated alerts notify our team instantly if any anomaly occurs." },
      { title: "Account in Your Name", desc: "All hosting and domains configured in your ownership with zero hostage tactics." }
    ],
    workflow: [
      { num: "01", title: "DNS Setup", desc: "We configure domain routing, nameservers, and edge caching rules." },
      { num: "02", title: "Deployment", desc: "We push clean code to global edge networks for sub-second delivery." },
      { num: "03", title: "SSL & Security", desc: "We enforce modern HTTPS encryption and DDoS protection." },
      { num: "04", title: "Monitoring", desc: "We activate automated health checks to ensure continuous 99.9% uptime." }
    ],
    projectSlugs: ["soft-aurora", "gloss-atelier"],
    whoItsFor: "Organizations seeking guaranteed 99.9% uptime, global CDN edge caching, automated SSL encryption, and direct client account ownership without slow shared server headaches.",
    pricingTier: "Cloud edge hosting starting from ₹1,500/month / $30/month",
    faqs: [
      { q: "Do I own the hosting account?", a: "Yes, 100%. We set up hosting under your company credentials so you maintain full control and ownership." },
      { q: "What uptime can I expect?", a: "Our configurations target 99.9% uptime backed by multi-region cloud edge networks." },
      { q: "Can you migrate an existing website to a faster host?", a: "Yes. We migrate your site smoothly with zero downtime and no email disruption." }
    ]
  },
  "security": {
    slug: "security",
    title: "Website Security & Protection",
    headline: "Complete Protection for Your Website and Customer Data",
    tagline: "Defensive headers, spam-free forms, TLS 1.3 encryption, and automated backups to protect your business.",
    category: "Protection · SECURE",
    problem: "Automated bots flood contact forms, insecure servers leak data, and missing backups risk permanent data loss.",
    solution: "We implement defensive headers, invisible bot traps, encrypted transport, and automated backups to keep your assets safe.",
    deliverables: [
      { title: "Hardened Security Headers", desc: "Modern CSP and HSTS headers prevent clickjacking, MIME attacks, and data interception." },
      { title: "Input Validation & Sanitization", desc: "Protects forms against script injection, SQL risks, and spreadsheet formula attacks." },
      { title: "TLS 1.3 Encryption", desc: "Industry-standard SSL encryption for all data sent between visitors and your site." },
      { title: "Automated Offsite Backups", desc: "Regular encrypted backups of code, settings, and inquiry records." },
      { title: "Bot & Spam Mitigation", desc: "Invisible bot traps stop automated spam without frustrating human clients." },
      { title: "Vulnerability Assessments", desc: "Audits that identify outdated libraries, open endpoints, and data leakage risks." }
    ],
    workflow: [
      { num: "01", title: "Security Audit", desc: "We scan endpoints, forms, and scripts for potential vulnerabilities." },
      { num: "02", title: "Header Hardening", desc: "We apply Content Security Policy, HSTS, and modern cipher suites." },
      { num: "03", title: "Bot Protection", desc: "We install invisible honeypots on contact forms to stop spam cold." },
      { num: "04", title: "Backup Setup", desc: "We set up automated backup schedules and verify restore procedures." }
    ],
    projectSlugs: ["soft-aurora", "gloss-atelier"],
    whoItsFor: "Websites and web applications handling client inquiries, customer data, or payments that need hardened CSP headers, invisible bot mitigation, and defenses against spam and injection.",
    pricingTier: "Security hardening starting from ₹15,000 / $280",
    faqs: [
      { q: "Do static or simple websites need security?", a: "Yes. Form submissions, customer inquiries, and domain reputation require protection from automated spam and hijacking." },
      { q: "Do you use annoying CAPTCHAs?", a: "No. We use invisible bot traps that block spam without asking visitors to solve image puzzles." },
      { q: "Will security features slow down my site?", a: "No. Clean headers and modern TLS 1.3 actually make page loads faster and more efficient." }
    ]
  }
};

function signatureModelSection() {
  const pillars = [
    {
      num: "01",
      badge: "BUILD",
      title: "Design & Development",
      desc: "Custom websites and web apps built from scratch with clean code, modern design, and sub-second load times.",
      deliverables: ["Custom Websites & Web Apps", "Sub-Second Fast Loading", "100% Code & Asset Ownership", "Zero Page-Builder Bloat"],
      route: "/services/web-development/",
      linkText: "Explore Web Development ↗"
    },
    {
      num: "02",
      badge: "MANAGE",
      title: "Management & Care",
      desc: "Ongoing maintenance, fast content updates, and proactive oversight so your website stays modern and bug-free.",
      deliverables: ["Routine Updates & Backups", "Fast Turnaround for Updates", "Core Web Vitals Audits", "Direct Engineer Support"],
      route: "/services/maintenance/",
      linkText: "Explore Management ↗"
    },
    {
      num: "03",
      badge: "SECURE",
      title: "Security & Protection",
      desc: "Defensive headers, spam-free forms, and encrypted backups to keep your business and customer data protected.",
      deliverables: ["Strict Security Headers", "Invisible Bot & Spam Traps", "TLS 1.3 SSL Encryption", "Automated Daily Backups"],
      route: "/services/security/",
      linkText: "Explore Security ↗"
    },
    {
      num: "04",
      badge: "HOST",
      title: "Hosting & Deployment",
      desc: "Managed cloud hosting with global edge CDN delivery, automatic SSL, and guaranteed 99.9% uptime.",
      deliverables: ["Global Edge CDN Delivery", "Zero-Downtime Releases", "Automated HTTPS / SSL", "24/7 Uptime Monitoring"],
      route: "/services/hosting/",
      linkText: "Explore Hosting ↗"
    }
  ];

  return `
    <section class="signature-model-section">
      <div class="wrap">
        <div class="section-header-compact">
          <span class="section-kicker">Core Service Model</span>
          <h2 class="section-title">BUILD. MANAGE. SECURE. HOST.</h2>
          <p class="section-subtitle">Everything your digital presence needs — from custom code to reliable cloud hosting.</p>
        </div>
        <div class="pillar-grid">
          ${pillars.map(p => `
            <a class="pillar-card" href="${p.route}">
              <div class="pillar-card-header">
                <span class="pillar-badge">${p.badge}</span>
                <span class="pillar-num">${p.num}</span>
              </div>
              <h3>${esc(p.title)}</h3>
              <p>${esc(p.desc)}</p>
              <ul class="pillar-deliverables">
                ${p.deliverables.map(d => `<li>${esc(d)}</li>`).join('')}
              </ul>
              <span class="pillar-card-link">${esc(p.linkText)}</span>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}