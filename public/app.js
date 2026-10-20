
const RM=false;
// ---- Editable defaults (owner edits live content in #/admin) ----
const D={
 services:[["Web Development","Modern websites and web experiences."],["Software Development","Custom software and digital products built around real business needs."],["AI Solutions","AI-powered applications, automation, intelligent workflows, and custom AI solutions."],["UI/UX & Digital Experiences","Modern, intuitive, and user-focused digital experiences."],["Business Automation","Technology solutions that reduce repetitive work and improve workflows."],["Custom Technology Solutions","Solutions designed around specific business requirements."]],
 process:[["Discover","Understand the problem, idea, and goals."],["Strategize","Plan the right product and technology approach."],["Design","Create the experience and product structure."],["Build","Develop the actual digital solution."],["Refine","Test, improve, and optimize."],["Launch","Deploy and deliver the final product."]],
 about:{
  who:"Caventra is an engineering-focused digital solutions studio. We partner with ambitious companies, growing startups, and founders to architect, design, and engineer powerful digital products that solve concrete commercial challenges.",
  believe:"We believe custom software must be a strategic asset that accelerates business growth and operational velocity, not technical overhead. In an era saturated with fragile templates and surface-level tools, bespoke engineering provides the only defensible competitive advantage. Every product we build is designed for measurable performance, rapid load times, and effortless scalability.",
  approach:"We practice product-first engineering across six disciplined stages: Discovery, Technical Architecture, High-Fidelity UI/UX Design, Scalable Full-Stack Engineering, Rigorous Quality Verification, and Seamless Deployment. By integrating AI automation pipelines with clean architectural standards, we eliminate bloated dependencies and deliver streamlined, resilient systems that scale as your business expands.",
  philosophy:"Precision over complexity. Form follows purpose, elevated by refined aesthetics. We craft interfaces with intentional typography, intuitive user psychology, and hardware-accelerated micro-interactions. A digital product should feel effortless to the end user while remaining secure, rock-solid, and resilient under high traffic.",
  different:"Unlike traditional marketing agencies that outsource technical engineering, or template-reliant shops that lack coding depth, Caventra is an authentic technology partner. You collaborate directly with our founding engineers and architects. We bridge the gap between design sensibility, full-stack software development, and applied artificial intelligence."
},
 desc:"A software and digital solutions studio. We turn ideas into powerful digital products.",
 projects:[
  {
    "name": "Soft Aurora",
    "slug": "soft-aurora",
    "category": "E-Commerce · Web Development · Experiential Brand Platform",
    "short": "An ultra-premium digital boutique and olfactory atelier combining fine fragrances with monolithic stone-carved luminous diffusers, real-time WebGL lighting simulations, and white-glove Cash on Delivery checkout.",
    "tech": "React 19, Vite 6, Tailwind CSS 3, WebGL Shader Engine, HTML5 Canvas 2D, JavaScript (ES6+), Lucide Icons, View Transitions API",
    "client": "Soft Aurora · Luxury Haute Parfumerie & Architectural Spatial Living (SoHo, New York, USA)",
    "overview": "Soft Aurora is an ultra-premium digital boutique and olfactory atelier that combines artisanal fine fragrances with monolithic stone-carved luminous diffusers. The platform delivers an immersive sensory shopping experience using real-time WebGL lighting simulations and a white-glove Cash on Delivery checkout system tailored for luxury collectors and interior architects.\n\nBridging the gap between physical olfactory art and digital commerce, the application transforms spatial interior living into a sensory gallery where patrons can explore fragrance compositions, calibrate light dispersion, and acquire limited-harvest flacons with zero upfront payment friction.",
    "challenge": "High-end artisanal fragrance and sculpted spatial objects depend heavily on in-person sensory fittings that traditional e-commerce templates fail to communicate. Standard storefronts look generic and transactional, lacking the prestige required for three- and four-figure luxury goods. Additionally, high-ticket private clients often abandon purchases when forced through rigid upfront payment gateways without the option to inspect the fragile hand-crafted stone flacons upon arrival.",
    "solution": "Caventra engineered a gallery-grade interactive web experience where real-time fluid lighting and optical physics replicate the physical presence of the diffusers and flacons in space. Introducing verified architectural client reviews and transparent laboratory harvest metrics eliminated all \"template\" feel, while a zero-gateway Cash on Delivery inspection model removed transaction friction—significantly increasing buyer trust and checkout completion for high-value orders.",
    "features": "Interactive 3D Rotary Scent Selector — A tactile rotary dial synchronizing olfactory pyramids, ambient throw radius, and harvest batch registrations in real time\nPhysics-Based Laser Dispersion Showcase — Real-time WebGL optical simulation demonstrating light interaction with the hand-honed Portuguese alabaster cold-vapor diffuser\nProgressive Radial Wave Theme Engine — Seamless 1.35s circular ripple transition between Light Sand and Nocturne Dark modes with zero abrupt color snapping\nBespoke 16-Product Catalog & Slide-Over Bag — Full luxury collection across Extraits, Alabaster Vessels, Beeswax Bougies, and Discovery Coffrets with real-time stock indicators and wax-sealed gift customization\nFrictionless Cash on Delivery Checkout — Doorstep package inspection guarantee with an automated, printable serialized tax invoice and dispatch tracking timeline\nUltra-Responsive Fluid UX — Sub-second interaction response with zero runtime page-builder bloat and optimized canvas rendering across mobile and desktop displays",
    "results": "Transformed high-luxury fragrance retail into an experiential digital atelier. Eliminated cart abandonment by integrating doorstep physical inspection with cash/card handover, achieving elevated patron conversion and establishing Soft Aurora as a benchmark in interactive spatial commerce.",
    "live": "",
    "github": "",
    "cover": "/assets/projects/soft-aurora.png",
    "gallery": [
      "/assets/projects/soft-aurora-scent-selector.png",
      "/assets/projects/soft-aurora-diffuser.png",
      "/assets/projects/soft-aurora-checkout.png"
    ],
    "published": true,
    "featured": true
  }
],techs:[],contact:{email:"caventraofficial@gmail.com",phone:"Hriday Vayanta: 8866790989, Ved Nimbark: 8849186747, Sauranahmed Mansuri: 7990652097",address:""},socials:[["Instagram","https://www.instagram.com/caventra__/"]]};
let S=JSON.parse(JSON.stringify(D)),owner=false,edit=null,INQ=[];const H={'Content-Type':'application/json','X-Requested-With':'caventra'};

// Google Apps Script Web App Endpoint for Project Enquiries (Connected to private sheet owned by caventraofficial@gmail.com)
const GOOGLE_APPS_SCRIPT_URL = (typeof window !== 'undefined' && window.CAVENTRA_CONFIG && window.CAVENTRA_CONFIG.APPS_SCRIPT_URL)
  || 'https://script.google.com/macros/s/AKfycbyVljM0fD4e6Gqc2F_ugBnjGK0ODWnC88WKn2wFyqn2QOT4_GPZuS6Bwu9ltzwPaL19/exec';

function isPlaceholderEndpoint(url) {
  return !url || url.includes('YOUR_DEPLOYMENT_ID_HERE') || !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec/i.test(url);
}

// ---- CAVENTRA Interactive Website Project Cost Estimator State ----
let estimatorState = {
  step: 1,
  currency: 'INR',
  websiteTypeId: 'small-business',
  pageCount: 5,
  selectedFeatureIds: [],
  selectedServiceIds: [],
  complexityId: 'standard'
};

let estimatorPrefillData = null;

function formatMoney(amount, currency) {
  const cfg = (typeof window !== 'undefined' && window.CAVENTRA_ESTIMATOR_CONFIG) || {};
  const sym = (cfg.currencySymbols && cfg.currencySymbols[currency]) || (currency === 'USD' ? '$' : '₹');
  const num = Math.round(Number(amount) || 0);
  const numStr = currency === 'INR' ? num.toLocaleString('en-IN') : num.toLocaleString('en-US');
  return `${sym}${numStr}`;
}

function getEstimatorConfig() {
  if (typeof window !== 'undefined' && window.CAVENTRA_ESTIMATOR_CONFIG) {
    return window.CAVENTRA_ESTIMATOR_CONFIG;
  }
  if (typeof CAVENTRA_ESTIMATOR_CONFIG !== 'undefined') {
    return CAVENTRA_ESTIMATOR_CONFIG;
  }
  return null;
}

function getCurrentEstimate() {
  const cfg = getEstimatorConfig();
  if (typeof window !== 'undefined' && typeof window.calculateEstimate === 'function') {
    return window.calculateEstimate(estimatorState, cfg);
  }
  if (typeof calculateEstimate === 'function') {
    return calculateEstimate(estimatorState, cfg);
  }
  return null;
}

function buildEstimatorScopeSummary(estimate) {
  const featTitles = (estimate.selectedFeatures || []).map(f => f.title + (f.included ? ' (Included in base)' : ''));
  const srvTitles = (estimate.selectedServices || []).map(s => s.title + (s.type === 'recurring' ? ' [Recurring monthly]' : ''));
  const baseRange = `${formatMoney(estimate.oneTimeDevMin, estimate.currency)} – ${formatMoney(estimate.oneTimeDevMax, estimate.currency)}`;
  const recurringStr = estimate.recurringMax > 0
    ? ` + ${formatMoney(estimate.recurringMin, estimate.currency)} – ${formatMoney(estimate.recurringMax, estimate.currency)} / month`
    : '';

  return {
    websiteType: estimate.websiteType.title,
    pageCount: estimate.totalPages,
    features: featTitles.length ? featTitles.join(', ') : 'None selected',
    services: srvTitles.length ? srvTitles.join(', ') : 'None selected',
    complexity: estimate.complexity.label,
    budgetSummary: `${baseRange}${recurringStr}`,
    currency: estimate.currency,
    disclaimer: estimate.disclaimer
  };
}

async function submitProjectEnquiry(formData) {
  const endpoint = (typeof window !== 'undefined' && window.CAVENTRA_CONFIG && window.CAVENTRA_CONFIG.APPS_SCRIPT_URL)
    || GOOGLE_APPS_SCRIPT_URL;

  const payload = {
    name: (formData.name || '').trim(),
    email: (formData.email || '').trim(),
    phone: (formData.phone || '').trim(),
    company: (formData.company || '').trim(),
    type: (formData.type || '').trim(),
    budget: (formData.budget || '').trim(),
    timeline: (formData.timeline || '').trim(),
    message: (formData.message || '').trim(),
    website: (formData.website || '').trim(),
    leadSource: (estimatorPrefillData ? 'Website Cost Estimator' : 'Website Contact Form (caventraofficial.in)'),
    timestamp: new Date().toISOString()
  };

  // Seamlessly sync inquiry into the Founder Portal CRM leads pipeline
  if (typeof CaventraStore !== 'undefined' && typeof CaventraStore.recordPublicLead === 'function') {
    try {
      CaventraStore.recordPublicLead(payload);
    } catch (portalSyncErr) {
      console.warn('[Caventra] Portal lead sync notice:', portalSyncErr);
    }
  }

  // Non-blocking background dispatch to local Node /api/contact if available
  if (typeof fetch !== 'undefined') {
    try {
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'caventra' },
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (localApiErr) {}
  }

  // Testable integration layer if endpoint is a placeholder
  if (isPlaceholderEndpoint(endpoint)) {
    console.info('[CAVENTRA Enquiry] Test mock integration layer active (Placeholder endpoint detected).');
    await new Promise(r => setTimeout(r, 650));

    // Support testing error/failure scenarios (email === "fail@test.com" or window.__SIMULATE_SUBMIT_ERROR = true)
    if ((typeof window !== 'undefined' && window.__SIMULATE_SUBMIT_ERROR) || payload.email === 'fail@test.com') {
      return {
        ok: false,
        error: 'Unable to connect to Google Sheets backend (Simulated test failure).',
        isMock: true
      };
    }

    const testId = 'CV-TEST-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    return {
      ok: true,
      id: testId,
      message: 'Project enquiry simulated in test mode.',
      isMock: true
    };
  }

  // Real production submission to Google Apps Script Web App
  // Note: Using text/plain;charset=utf-8 avoids CORS OPTIONS preflight failures on Google Apps Script 302 redirects
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload),
      signal: timer.signal
    });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error('Server returned HTTP ' + res.status);
    }

    const data = await res.json().catch(() => null);
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response structure received from endpoint');
    }

    if (data.ok) {
      return {
        ok: true,
        id: data.id || ('CV-' + Date.now().toString(36).toUpperCase()),
        message: data.message || 'Saved successfully',
        isMock: false
      };
    } else {
      return {
        ok: false,
        error: data.error || 'The server could not save the enquiry. Please try again.',
        isMock: false
      };
    }
  } catch (err) {
    clearTimeout(timer);
    let msg = 'Could not connect to the enquiry service. Please check your internet connection.';
    if (err.name === 'AbortError') {
      msg = 'Submission timed out. Please check your connection and retry.';
    } else if (err.message) {
      msg = err.message;
    }
    return {
      ok: false,
      error: msg,
      isMock: false
    };
  }
}

function renderContactSuccess(container, f, result) {
  const isMock = !!result.isMock;
  const refId = result.id || ('CV-' + Date.now().toString(36).toUpperCase());

  container.innerHTML = `
    <div class="project-success">
      <div class="success-icon-wrap" aria-hidden="true">
        <svg class="success-checkmark" viewBox="0 0 52 52">
          <circle class="success-circle" cx="26" cy="26" r="24" fill="none"/>
          <path class="success-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
      </div>
      <h3 class="success-heading">Your project has been submitted. One of our representatives will call you soon!</h3>
      <p class="success-sub">Thank you, <b>${esc(f.name)}</b>. We have received your project details and our engineering team is reviewing your requirements.</p>
      <div class="success-meta">
        <div class="meta-item"><span class="meta-label">Enquiry Ref</span><span class="meta-val ref-id">${esc(refId)}</span></div>
        <div class="meta-item"><span class="meta-label">Client Name</span><span class="meta-val">${esc(f.name)}</span></div>
        <div class="meta-item"><span class="meta-label">Contact Email</span><span class="meta-val">${esc(f.email)}</span></div>
        ${f.phone ? `<div class="meta-item"><span class="meta-label">Mobile Phone</span><span class="meta-val">${esc(f.phone)}</span></div>` : ''}
        ${f.company ? `<div class="meta-item"><span class="meta-label">Company</span><span class="meta-val">${esc(f.company)}</span></div>` : ''}
        ${f.type ? `<div class="meta-item"><span class="meta-label">Service</span><span class="meta-val">${esc(f.type)}</span></div>` : ''}
        ${f.budget ? `<div class="meta-item"><span class="meta-label">Budget</span><span class="meta-val">${esc(f.budget)}</span></div>` : ''}
        ${f.timeline ? `<div class="meta-item"><span class="meta-label">Timeline</span><span class="meta-val">${esc(f.timeline)}</span></div>` : ''}
        ${isMock ? `<div class="meta-item mock-tag"><span class="meta-label">Integration</span><span class="meta-val" style="color:var(--gold2);font-size:12px">Test Mode (Local Mock Verification)</span></div>` : ''}
      </div>
      <div class="success-actions row" style="justify-content:center;margin-top:28px;gap:12px">
        <a class="btn solid" href="/">Back to Home</a>
        <button class="btn" type="button" id="btn-submit-another">Submit Another Project</button>
      </div>
    </div>
  `;

  estimatorPrefillData = null;
  const anotherBtn = container.querySelector('#btn-submit-another');
  if (anotherBtn) {
    anotherBtn.onclick = () => {
      estimatorPrefillData = null;
      render();
    };
  }

  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const $=s=>document.querySelector(s),app=$('#app');
const getTheme=()=>document.documentElement.getAttribute('data-theme')||'light';
const getLogo=()=>(getTheme()==='light'?'/assets/logo-light.png':'/assets/logo.png');
const getNavLogo=()=>(getTheme()==='light'?'/assets/logo-nav-light.png':'/assets/logo-nav.png');
const ORIG=getLogo();$('#sp').src=getLogo();$('#fl').src=getLogo();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^(https?:\/\/|\/_blob\/|\/assets\/|\/uploads\/|mailto:|data:image)/.test(u||'')?esc(u):'#';
const pub=()=>S.projects.filter(p=>p.published);
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'project';
const empty=(t,m)=>`<div class="empty"><h3>${t}</h3><p>${m}</p></div>`;
const sp=t=>t.split(' ').map((w,i)=>`<span class="w"><span style="--i:${i}">${w}</span></span>`).join(' ');
const cta=`<a class="btn solid" href="/contact/">Start a Project ↗</a>`;
const head=(h,p)=>`<section style="border:0;padding-bottom:40px"><div class="wrap"><h1 style="font-size:clamp(38px,6vw,76px)">${sp(h)}</h1>${p?`<p style="margin-top:24px;font-size:18px">${p}</p>`:''}</div></section>`;
const SP=[4,2,2,2,2,6];const svc=()=>`<div class="bento">${S.services.map((s,i)=>`<div class="bc" style="grid-column:span ${SP[i]||2}"><b>${String(i+1).padStart(2,'0')}</b><i>↗</i><div><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></div></div>`).join('')}</div>`;
const spc=(t,m)=>t.split(' ').map((w,i)=>`<span class="w"><span class="${m[i]||''}" style="--i:${i}">${w}</span></span>`).join(' ');
const bigp=t=>`<p class="big">${t.split(' ').map(w=>`<span>${esc(w)}</span>`).join(' ')}</p>`;
function lit(){document.querySelectorAll('.big').forEach(el=>{const s=el.querySelectorAll('span'),r=el.getBoundingClientRect(),pr=typeof RM!=='undefined'&&RM?1:Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(innerHeight*.45+r.height*.6)));s.forEach((x,i)=>x.classList.toggle('on',i<pr*s.length+.5))})}
const prc=()=>`<div class="steps">${S.process.map((s,i)=>`<div><b>${String(i+1).padStart(2,'0')}</b><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></div>`).join('')}</div>`;
const getCover=p=>((p.cover&&/^(https?:|\/_blob\/|\/assets\/|\/uploads\/|data:image)/.test(p.cover))?p.cover:((D.projects.find(x=>x.slug===p.slug||x.name===p.name)||{}).cover||''));
const getProjectStatus=(p)=>{
  if(p.slug==='soft-aurora')return{label:'Client Production Boutique',cls:'production'};
  if(p.slug==='the-wheel-master')return{label:'Client Production ERP',cls:'production'};
  if(p.slug==='plinth')return{label:'In Active Development',cls:'active-dev'};
  if(p.slug==='genresume')return{label:'Production Web App',cls:'production'};
  if(p.slug==='personal-portfolio-website')return{label:'Developer Showcase',cls:'concept'};
  return{label:'Concept Prototype',cls:'concept'};
};
const card=p=>{
  const cv=getCover(p);
  const st=getProjectStatus(p);
  return `<a class="card" href="/work/${esc(p.slug)}/">
    <div class="im" style="background-image:url('${esc(cv)}');background-size:cover;background-position:center">
      <div style="background-image:url('${esc(cv)}');background-size:cover;background-position:center"></div>
    </div>
    <div class="cb">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <small>${esc(p.category)}</small>
        <span class="project-status-badge ${st.cls}">${esc(st.label)}</span>
      </div>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.short)}</p>
      <div class="tags">${(p.tech||'').split(',').filter(x=>x.trim()).slice(0,4).map(t=>`<span>${esc(t.trim())}</span>`).join('')}</div>
      <span class="btn sm">View Project ↗</span>
    </div>
  </a>`;
};
const workGrid=l=>l.length?`<div class="grid">${l.map(card).join('')}</div>`:empty("Building what comes next.","New work will appear here as it is completed.");
const wrapS=(h,b,x='')=>`<section ${x}><div class="wrap">${h?`<h2 style="margin-bottom:48px">${h}</h2>`:''}${b}</div></section>`;
const contactInfo=()=>{const c=S.contact,r=[],B='target="_blank" rel="noopener"';
 if(c.email)r.push(`<span class="nm">${esc(c.email)}</span><a class="btn sm solid" href="mailto:${esc(c.email)}">Email</a><a class="btn sm" href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(c.email)}" ${B}>Gmail ↗</a><button class="btn sm" type="button" data-cp="${esc(c.email)}">Copy</button>`);
 if(c.phone)c.phone.split(/[,\n]+/).map(x=>x.trim()).filter(Boolean).forEach(n=>{const p=n.includes(":")?n.split(":"):n.includes("|")?n.split("|"):[n,n];const label=p[0].trim(),num=(p[1]||p[0]).trim();const d=num.replace(/[^\d+]/g,""),w=d[0]==="+"?d.slice(1):"91"+d;r.push(`<span class="nm">${esc(label)}</span><a class="btn sm solid" href="https://wa.me/${w}" ${B}>WhatsApp</a><button class="btn sm" type="button" data-cp="${esc(num)}">Copy</button>`);});
 if(c.address)r.push(`<span class="nm">${esc(c.address)}</span>`);
 S.socials.forEach(x=>r.push(`<span class="nm">${esc(x[0])}</span><a class="btn sm solid" href="${safe(x[1])}" ${B}>Open ↗</a>`));
 return r.length?`<div class="cl">${r.map(x=>`<div class="crow">${x}</div>`).join('')}</div>`:''};
const sec=(t,v)=>v?`<h3 style="margin:48px 0 12px">${t}</h3><p>${esc(v).replace(/\n/g,'<br>')}</p>`:'';

const getB = () => (typeof window !== 'undefined' && window.BLOGS && window.BLOGS.length) ? window.BLOGS : [];
let blogPage = 1, blogFilter = 'All', blogQuery = '', blogShowAll = false, workFilter = 'All';

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
    projectSlugs: ["the-wheel-master", "genresume", "divine-bridal-accessories"],
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
    projectSlugs: ["divine-bridal-accessories", "ironforge-fitness-store"],
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
    projectSlugs: ["the-wheel-master", "crm-platform"],
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
    projectSlugs: ["plinth", "the-wheel-master"],
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
    projectSlugs: ["the-wheel-master", "crm-platform"],
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
              <h4 class="process-step-title">${esc(s.title)}</h4>
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
              <h4>${esc(s.title)}</h4>
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
      q: "Do I own my code and website after launch?",
      a: "Yes, 100%. Once final payment is fulfilled, all source code, design assets, and deployment keys transfer directly to you."
    },
    {
      q: "How does Caventra differ from traditional agencies?",
      a: "We write custom, lightweight code instead of using slow templates like WordPress or Wix. Your site loads faster, looks unique, and doesn't break."
    },
    {
      q: "How long does a typical project take to complete?",
      a: "Standard business websites take 2 to 3 weeks. Custom web apps and complex platforms take 4 to 6 weeks."
    },
    {
      q: "Can you maintain and support a website you didn't build?",
      a: "Yes. Through our MANAGE service, we audit your existing site, resolve urgent issues, and provide regular maintenance and hosting."
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
              <div class="faq-q">${esc(f.q)}</div>
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
  + wrapS("", bigp(S.about.who) + `<p style="font-size:18px;max-width:58ch;line-height:1.6;margin-top:16px">Technology, design, AI, and business thinking, combined into practical, scalable digital solutions. We are a technology partner, not a marketing agency.</p>`)
  + deliveryProcessSection()
  + trustStandardsSection()
  + wrapS("Selected Work &amp; Case Studies", workGrid(pub().filter(p=>p.featured)) + `<p style="margin-top:36px"><a class="btn solid" href="/work/">Explore All Selected Work ↗</a> <a class="btn" href="/contact/">Discuss a Project ↗</a></p>`)
  + homepageTestimonialsSection()
  + homepageFAQSection()
  + wrapS("Latest Insights &amp; Engineering", `
    <p style="margin-bottom:32px;font-size:18px">Technical perspectives on custom software engineering, applied AI, and digital product design.</p>
    <div class="blog-grid" style="margin:0">
      ${getB().slice(0,3).map(b=>`
        <a class="b-card" href="/blog/${esc(b.slug)}/" style="grid-column:span 4">
          <div>
            <div class="meta"><span>${esc(b.category)}</span><span class="dot-sep"></span><span>${esc(b.readTime)}</span></div>
            <h3 style="font-size:20px">${esc(b.title)}</h3>
            <p style="font-size:15px;line-height:1.55">${esc(b.summary)}</p>
          </div>
          <div class="ftr"><span class="tag">${esc(b.author)}</span><span class="read-link">Read ↗</span></div>
        </a>
      `).join('')}
    </div>
    <p style="margin-top:36px"><a class="btn" href="/blog/">Explore All Articles ↗</a></p>
  `)
  + `<section class="band"><div class="wrap"><h2>Have an idea worth building?</h2><p style="margin:16px auto 32px;max-width:54ch;font-size:18px;color:var(--mut)">Let's architect and engineer your digital product with clean code and transparent pricing.</p><div class="row" style="justify-content:center;gap:12px;flex-wrap:wrap"><a class="btn solid" href="/contact/">Start a Project ↗</a><a class="btn" href="/estimator/">Launch Cost Estimator</a></div></div></section>`
  + (contactInfo() ? wrapS("Contact", contactInfo()) : '');
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
            <img class="founder-photo" src="/assets/founders/hriday-vayanta.jpg" alt="Hriday Vayanta — Head of Growth" width="320" height="320" loading="lazy">
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
            <img class="founder-photo" src="/assets/founders/ved-nimbark.jpg" alt="Ved Nimbark — Head of Design" width="320" height="320" loading="lazy">
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
            <img class="founder-photo" src="/assets/founders/sauranahmed-mansuri.jpg" alt="Sauranahmed Mansuri — Head of Technology" width="320" height="320" loading="lazy">
          </div>
          <h3>Sauranahmed Mansuri</h3>
          <span class="founder-role">Head of Technology</span>
          <p class="founder-bio">Architects the end-to-end technical ecosystem at Caventra, engineering frontend and backend systems, database infrastructures, and cloud deployment pipelines.</p>
          <span class="founder-focus">Full-Stack · Cloud &amp; DevOps · System Architecture</span>
          <div class="founder-contact-meta">
            <div class="meta-row">
              <span class="meta-label">Email:</span>
              <a class="meta-val meta-email" href="mailto:sauranahmed12345678@gmail.com" title="Email Sauranahmed Mansuri">sauranahmed12345678@gmail.com</a>
            </div>
            <div class="meta-row">
              <span class="meta-label">Direct:</span>
              <a class="meta-val" href="tel:+917990652097" title="Call Sauranahmed Mansuri">+91 79906 52097</a>
            </div>
          </div>
          <div class="founder-actions">
            <a class="btn sm" href="https://wa.me/917990652097" target="_blank" rel="noopener">WhatsApp ↗</a>
            <a class="btn sm" href="mailto:sauranahmed12345678@gmail.com" title="Email Sauranahmed Mansuri">Email Sauran ↗</a>
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
            <img class="founder-photo" src="/assets/founders/hriday-vayanta.jpg" alt="Hriday Vayanta — Founder &amp; Head of Growth at Caventra" width="320" height="320" loading="eager">
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
            <img class="founder-photo" src="/assets/founders/ved-nimbark.jpg" alt="Ved Nimbark — Founder &amp; Head of Design at Caventra" width="320" height="320" loading="eager">
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
            <img class="founder-photo" src="/assets/founders/sauranahmed-mansuri.jpg" alt="Sauranahmed Mansuri — Founder &amp; Head of Technology at Caventra" width="320" height="320" loading="eager">
          </div>
          <h3>Sauranahmed Mansuri</h3>
          <span class="founder-role">Founder &amp; Head of Technology</span>
          <p class="founder-bio">Architects the end-to-end technical ecosystem at Caventra, engineering frontend and backend systems, database infrastructures, and cloud deployment pipelines. He specializes in sub-second page performance, robust API architectures, and bulletproof security.</p>
          <span class="founder-focus">Full-Stack · Cloud &amp; DevOps · System Architecture</span>
          <div class="founder-contact-meta">
            <div class="meta-row">
              <span class="meta-label">Email:</span>
              <a class="meta-val meta-email" href="mailto:sauranahmed12345678@gmail.com" title="Email Sauranahmed Mansuri">sauranahmed12345678@gmail.com</a>
            </div>
            <div class="meta-row">
              <span class="meta-label">Direct:</span>
              <a class="meta-val" href="tel:+917990652097" title="Call Sauranahmed Mansuri">+91 79906 52097</a>
            </div>
          </div>
          <div class="founder-actions">
            <a class="btn sm" href="https://wa.me/917990652097" target="_blank" rel="noopener">WhatsApp ↗</a>
            <a class="btn sm" href="mailto:sauranahmed12345678@gmail.com" title="Email Sauran ↗">Email Sauran ↗</a>
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
            <br>3. <strong>Sauranahmed Mansuri</strong> — Founder &amp; Head of Technology (Email: <a href="mailto:sauranahmed12345678@gmail.com" style="color:var(--gold)">sauranahmed12345678@gmail.com</a>)
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
blog:()=>{
  const list = getB();
  const uniqueCats = ['All', ...new Set(list.map(x=>x.category))];
  const cats = uniqueCats.map(name => ({
    name,
    count: name === 'All' ? list.length : list.filter(x=>x.category === name).length
  }));
  
  const filtered = list.filter(b => {
    const matchCat = (blogFilter === 'All') || (b.category === blogFilter);
    const q = blogQuery.toLowerCase().trim();
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q) || (b.location && b.location.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  const pageSize = 24;
  const visible = blogShowAll ? filtered : filtered.slice(0, blogPage * pageSize);
  const hasMore = !blogShowAll && visible.length < filtered.length;

  return head("Knowledge &amp; Engineering Insights","Practical guides on website pricing, cloud hosting, security audits, and modern web architecture.") + wrapS("",`
    <div style="margin-bottom:36px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:18px">
      <div class="blog-filter" style="margin:0">
        ${cats.map(c=>`<button class="${blogFilter===c.name?'active':''}" data-bcat="${esc(c.name)}">${esc(c.name)} (${c.count})</button>`).join('')}
      </div>
      <div>
        <input id="b-search" placeholder="Search by topic or keyword..." value="${esc(blogQuery)}" style="border-radius:999px;padding:10px 22px;font-size:14px;background:var(--bg2);border:1px solid var(--line);color:var(--tx);min-width:280px">
      </div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px">
      <p id="b-count" style="color:var(--mut);font-size:14px;margin:0">Showing ${visible.length} of ${filtered.length} articles</p>
      <div id="b-top-showall-wrap">
        ${!blogShowAll && filtered.length > pageSize ? `<button class="btn sm b-showall-btn" id="b-showall-top">Show All (${filtered.length})</button>` : ''}
      </div>
    </div>
    <div class="blog-grid" id="bg-grid">
      ${visible.map((b,i)=>`
        <a class="b-card" href="/blog/${esc(b.slug)}/">
          <div>
            <div class="meta">
              <span>${esc(b.category)}</span>
              <span class="dot-sep"></span>
              <span>${esc(b.readTime)}</span>
              ${b.location && b.location !== 'Global' ? `<span class="dot-sep"></span><span style="color:var(--gold2)">📍 ${esc(b.location)}</span>` : ''}
            </div>
            <h3>${esc(b.title)}</h3>
            <p>${esc(b.summary)}</p>
          </div>
          <div class="ftr">
            <span class="tag">${esc(b.author)}</span>
            <span class="read-link">Read Article ↗</span>
          </div>
        </a>
      `).join('')}
    </div>
    <div id="b-pagination" class="row" style="justify-content:center;margin-top:48px;gap:14px">
      ${hasMore ? `
        <button class="btn solid" id="b-more">Load More</button>
        <button class="btn b-showall-btn" id="b-showall">Show All ${filtered.length} Articles</button>
      ` : ''}
    </div>
  `,'style="padding-top:20px"');
},
article:s=>{
  const list = getB();
  const b = list.find(x=>x.slug===s);
  if(!b)return V.notFound("The requested insight article could not be found.");
  
  // Suggest 2 related articles
  const related = list.filter(x=>x.slug !== b.slug && (x.category === b.category || x.author === b.author)).slice(0, 2);

  return `<section style="border:0;padding-bottom:32px"><div class="wrap"><div class="article-wrap">
    <a class="btn sm" href="/blog/" style="margin-bottom:32px;display:inline-flex;align-items:center;gap:6px">← All Insights &amp; Articles</a>
    <div class="article-meta">
      <span>${esc(b.category)}</span>
      <span>·</span>
      <span>${esc(b.date)}</span>
      <span>·</span>
      <span>${esc(b.readTime)}</span>
      ${b.location && b.location !== 'Global' ? `<span>·</span><span style="color:var(--gold2)">📍 ${esc(b.location)}</span>` : ''}
    </div>
    <h1 style="font-size:clamp(32px,5.2vw,64px);line-height:1.08;margin-bottom:24px">${sp(b.title)}</h1>
    <p style="font-size:20px;color:var(--gold2);line-height:1.55;margin-bottom:48px">${esc(b.summary)}</p>
    <div class="article-author">
      <div class="av">${esc(b.author.charAt(0))}</div>
      <div>
        <b>${esc(b.author)}</b>
        <p>${esc(b.authorRole)} at Caventra</p>
      </div>
    </div>
    <div class="article-body">
      ${b.content}
    </div>
    ${related.length ? `
      <div style="margin-top:64px;border-top:1px solid var(--line);padding-top:48px">
        <h3 style="font-size:22px;margin-bottom:24px;color:var(--gold2)">Related Articles</h3>
        <div class="blog-grid" style="margin:0">
          ${related.map(r=>`
            <a class="b-card" href="/blog/${esc(r.slug)}/" style="grid-column:span 6">
              <div>
                <div class="meta"><span>${esc(r.category)}</span></div>
                <h3 style="font-size:20px">${esc(r.title)}</h3>
                <p style="font-size:14px">${esc(r.summary)}</p>
              </div>
              <div class="ftr"><span class="read-link">Read ↗</span></div>
            </a>
          `).join('')}
        </div>
      </div>
    ` : ''}
    <div class="article-cta">
      <h3>Have an idea worth building?</h3>
      <p>Caventra turns digital concepts into scalable software products. Let's discuss your project.</p>
      <div class="row" style="justify-content:center">${cta}<a class="btn" href="/blog/">Explore All Articles</a></div>
    </div>
  </div></div></section>`;
},
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
        <label>Your Name *<input name="name" required autocomplete="name" placeholder="Full name (letters only)" pattern="^[A-Za-z\s.'-]+$" title="Please enter letters only"></label>
        <label>Email Address *<input name="email" type="email" required autocomplete="email" placeholder="you@company.com"></label>
      </div>
      <div class="two">
        <label>Mobile Phone Number *<input name="phone" type="tel" required autocomplete="tel" placeholder="e.g. +91 98765 43210" pattern="[+]?[0-9\s\-()]{7,18}" title="Please enter a valid mobile phone number (7 to 15 digits)"></label>
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
        <label>Timeline<input name="timeline" placeholder="e.g. 4-6 weeks"></label>
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
admin:()=>{if(!owner)return head("Admin","Sign in to manage Caventra content.")+wrapS("",`<form id="lf" style="max-width:420px"><label>Admin password<input type="password" id="lp" autocomplete="current-password" required></label><div><button class="btn solid">Sign in</button></div><p id="lm"></p></form>`,'style="padding-top:20px"');
 const e=edit,P=S.projects,I=(k,l,t='input')=>`<label>${l}<${t} data-k="${k}">${t==='textarea'?esc(e[k]||''):''}</${t}></label>`.replace('<input data-k','<input data-k').replace(`</input>`,'').replace(`data-k="${k}">`,t==='input'?`data-k="${k}" value="${esc(e[k]||'')}">`:`data-k="${k}">`);
 return head("Admin")+wrapS("",`<div class="adm"><div class="ro" style="border:0;padding:0"><h3>Inquiries (${INQ.length})</h3><button class="btn sm" data-a="logout">Sign out</button></div>${INQ.map(q=>`<div class="ro" style="align-items:flex-start"><span><b>${esc(q.name)}</b> · <a href="mailto:${esc(q.email)}">${esc(q.email)}</a>${q.company?' · '+esc(q.company):''}<br><small>${esc(q.type)} ${q.budget?'· '+esc(q.budget):''} ${q.timeline?'· '+esc(q.timeline):''} · ${new Date(q.created_at).toLocaleString()}</small><br>${esc(q.message)}</span><button class="btn sm" data-a="delq" data-i="${q.id}">Delete</button></div>`).join('')||'<p>No inquiries yet.</p>'}</div><div class="adm"><h3>Projects</h3><p>Nothing is published until you add it here.</p>${P.map((p,i)=>`<div class="ro"><span>${esc(p.name)} ${p.published?'':'(draft)'} ${p.featured?'★':''}</span><span class="row"><button class="btn sm" data-a="pub" data-i="${i}">${p.published?'Unpublish':'Publish'}</button><button class="btn sm" data-a="feat" data-i="${i}">${p.featured?'Unfeature':'Feature'}</button><button class="btn sm" data-a="up" data-i="${i}">Up</button><button class="btn sm" data-a="dn" data-i="${i}">Down</button><button class="btn sm" data-a="ed" data-i="${i}">Edit</button><button class="btn sm" data-a="del" data-i="${i}">Delete</button></span></div>`).join('')}<p style="margin-top:20px"><button class="btn solid sm" data-a="new">Add project</button></p></div>`
 +(e?`<div class="adm"><h3>${e.name?'Edit':'New'} project</h3><form id="pf" style="max-width:none">${I('name','Name')}${I('category','Category')}${I('short','Short description')}${I('tech','Technologies (comma separated)')}${I('client','Client')}${I('overview','Overview','textarea')}${I('challenge','Challenge','textarea')}${I('solution','Solution','textarea')}${I('features','Features (one per line)','textarea')}${I('results','Results','textarea')}${I('live','Live URL')}${I('github','GitHub URL')}${I('case','Case study URL')}<label>Cover image<input type="file" id="pcv" accept="image/*"></label><label>Gallery images<input type="file" id="gl" accept="image/*" multiple></label><p>${e.cover?'Cover set. ':''}${(e.gallery||[]).length} gallery image(s).</p><div class="row"><button class="btn solid" data-a="savep" type="button">Save project</button><button class="btn" data-a="cancel" type="button">Cancel</button></div></form></div>`:'')
  +`<div class="adm"><h3>Site content</h3><form id="sf" style="max-width:none"><label>Footer description<textarea data-s="desc">${esc(S.desc)}</textarea></label><label>Who we are<textarea data-s="about.who">${esc(S.about.who)}</textarea></label><label>What we believe<textarea data-s="about.believe">${esc(S.about.believe)}</textarea></label><label>Our approach<textarea data-s="about.approach">${esc(S.about.approach)}</textarea></label><label>Our philosophy<textarea data-s="about.philosophy">${esc(S.about.philosophy)}</textarea></label><label>What makes Caventra different<textarea data-s="about.different">${esc(S.about.different)}</textarea></label><label>Contact email<input data-s="contact.email" value="${esc(S.contact.email)}"></label><label>Phone numbers (separate with commas)<input data-s="contact.phone" value="${esc(S.contact.phone)}"></label><label>Address<input data-s="contact.address" value="${esc(S.contact.address)}"></label><label>Social links (one per line: Name | URL)<textarea data-s="socials">${esc(S.socials.map(x=>x[0]+' | '+x[1]).join('\n'))}</textarea></label><label>Technologies (one per line: Category | A, B, C)<textarea data-s="techs">${esc(S.techs.map(x=>x[0]+' | '+x[1]).join('\n'))}</textarea></label><div><button class="btn solid" data-a="saves" type="button">Save site content</button></div></form></div>`);
 },
 portal:()=>(typeof window!=='undefined'&&window.CaventraPortal)?window.CaventraPortal.renderPortalGateway():'<section class="wrap pt-page" style="padding:100px 0;text-align:center"><h2>Loading Portal...</h2></section>',
 login:()=>(typeof window!=='undefined'&&window.CaventraPortal)?window.CaventraPortal.renderLogin():'<section class="wrap pt-page" style="padding:100px 0;text-align:center"><h2>Loading Sign In...</h2></section>',
 register:()=>(typeof window!=='undefined'&&window.CaventraPortal)?window.CaventraPortal.renderRegister():'<section class="wrap pt-page" style="padding:100px 0;text-align:center"><h2>Loading Registration...</h2></section>',
 'reset-password':()=>(typeof window!=='undefined'&&window.CaventraPortal)?window.CaventraPortal.renderResetPassword():'<section class="wrap pt-page" style="padding:100px 0;text-align:center"><h2>Loading Password Recovery...</h2></section>',
 'client-dashboard':()=>(typeof window!=='undefined'&&window.CaventraPortal)?window.CaventraPortal.renderClientDashboard():'<section class="wrap pt-page" style="padding:100px 0;text-align:center"><h2>Loading Client Dashboard...</h2></section>',
 'founder-dashboard':()=>(typeof window!=='undefined'&&window.CaventraPortal)?window.CaventraPortal.renderFounderDashboard():'<section class="wrap pt-page" style="padding:100px 0;text-align:center"><h2>Loading Founder Dashboard...</h2></section>'
};
const kv=t=>t.split('\n').map(l=>l.split('|').map(x=>x.trim())).filter(a=>a[0]&&a[1]);
async function save(){try{const r=await fetch('/api/admin/site',{method:'PUT',headers:H,body:JSON.stringify(S)});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||r.status);if(j.site){const keep=S;S=Object.assign(JSON.parse(JSON.stringify(D)),j.site)}return true}catch(x){alert('Could not save: '+x.message);return false}}
function getRouteParts() {
  if (typeof location === 'undefined') return ['', ''];
  if (location.hash && location.hash !== '#/' && location.hash !== '#') {
    const h = location.hash.replace(/^#\/?/, '').replace(/\/$/, '');
    const [r, s] = h.split('/');
    return [r || '', s || ''];
  }
  const p = (location.pathname || '/').replace(/^\/+/, '').replace(/\/+$/, '').replace(/^index\.html$/, '');
  if (!p) return ['', ''];
  const [r, s] = p.split('/');
  return [r || '', s || ''];
}
function render(keepScroll = false){const [r,s]=getRouteParts();
 let v=r===''?V.home():r==='services'&&s?V.serviceDetail(s):r==='services'?V.services():r==='work'&&s?V.project(s):r==='work'?V.work():r==='blog'&&s?V.article(s):r==='blog'?V.blog():r==='estimator'?V.estimator():r==='404'?V.notFound():V[r]?V[r]():V.notFound();
 const prevY = (typeof window !== 'undefined' && keepScroll) ? window.scrollY : 0;
 app.innerHTML=v;
 if (typeof window !== 'undefined') {
   if (!keepScroll) window.scrollTo(0, 0);
   else window.scrollTo(0, prevY);
 }
 fx();
 if (typeof window !== 'undefined' && window.CaventraPortal && typeof window.CaventraPortal.bindEvents === 'function') {
   window.CaventraPortal.bindEvents(app);
 }
 const lk = $('#lk');
 if (lk) lk.classList.remove('open');
 document.querySelectorAll('.links a').forEach(a=>{const h=(a.getAttribute('href')||'').replace(/^#\/?/,'').replace(/^\//,'').replace(/\/$/,'');a.classList.toggle('on',(r===''&&h==='')||(r!==''&&h===r));});
 $('#fdesc').textContent=S.desc;const so=S.socials.map(x=>`<a href="${safe(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>`).join('');$('#fsoc').innerHTML=so;

 const titles = {
   '': 'Custom Websites & Web Applications for SMBs | Caventra',
   'services': 'Website Design, Hosting & Security Services | Caventra',
   'services/web-development': 'Custom Web Development & Engineering | Caventra',
   'services/branding': 'Brand Identity & Digital Design | Caventra',
   'services/maintenance': 'Website Management & Maintenance Plans | Caventra',
   'services/hosting': 'High-Performance Cloud Hosting & Infrastructure | Caventra',
   'services/security': 'Website Security, Hardening & Protection | Caventra',
   'work': 'Selected Work & Case Studies | Caventra',
   'process': 'Our 7-Stage Engineering Process | Caventra',
   'about': 'About Caventra — Leadership & Engineering Philosophy',
   'founders': 'Founders of Caventra — Leadership Team',
   'blog': 'Insights & Engineering Blog | Caventra',
   'estimator': 'Website Project Cost Estimator | Caventra',
   'contact': 'Start a Project | Caventra',
   'privacy': 'Privacy Policy | Caventra',
   'terms': 'Terms of Service | Caventra',
   'cookies': 'Cookie Policy | Caventra',
   'portal': 'Client Portal & Founder Command | Caventra',
   'login': 'Sign In — Client Portal | Caventra',
   'register': 'Create Client Account | Caventra',
   'reset-password': 'Reset Password — Client Portal | Caventra',
   'client-dashboard': 'Client Dashboard | Caventra',
   'founder-dashboard': 'Founder Command Dashboard | Caventra'
 };
 const fullRoute = s ? `${r}/${s}` : r;
 if (r === 'blog' && s) {
   const art = (typeof getB === 'function' ? getB() : []).find(x => x.slug === s);
   document.title = art ? `${art.title} | Caventra` : 'Article — CAVENTRA';
 } else if (r === 'work' && s) {
   const prj = (S.projects || []).find(x => x.slug === s);
   document.title = prj ? `${prj.name} Case Study | Caventra` : 'Project — CAVENTRA';
 } else {
   document.title = titles[fullRoute] || 'CAVENTRA — Ideas to Impact';
 }
 const canEl = document.querySelector('link[rel="canonical"]');
 if (canEl) {
   canEl.setAttribute('href', `https://caventraofficial.in/${fullRoute ? fullRoute + '/' : ''}`);
 }
 const lf=$('#lf');if(lf)lf.onsubmit=doLogin;
 const cf=$('#cf');
 if(cf){
  let isSubmitting = false;
  cf.onsubmit = async e => {
    e.preventDefault();
    if (isSubmitting) return;

    const existingAlert = cf.querySelector('#cf-alert');
    if (existingAlert) existingAlert.remove();

    if (!cf.checkValidity()) {
      cf.reportValidity();
      return;
    }

    const f = Object.fromEntries(new FormData(cf));

    // Form field validations
    const nameVal = (f.name || '').trim();
    if (!nameVal || !/^[A-Za-z\s.'-]+$/.test(nameVal)) {
      const nameInput = cf.querySelector('input[name="name"]');
      if (nameInput) {
        nameInput.setCustomValidity('Please enter letters only (no numbers or special symbols).');
        nameInput.reportValidity();
        nameInput.oninput = () => nameInput.setCustomValidity('');
      }
      return;
    }

    const emailVal = (f.email || '').trim().toLowerCase();
    if (typeof CaventraAuth !== 'undefined' && CaventraAuth.isDemoEmail && CaventraAuth.isDemoEmail(emailVal)) {
      const emailInput = cf.querySelector('input[name="email"]');
      if (emailInput) {
        emailInput.setCustomValidity('Demo or disposable email addresses are not permitted. Please use your official business or personal email.');
        emailInput.reportValidity();
        emailInput.oninput = () => emailInput.setCustomValidity('');
      }
      return;
    }

    const phoneDigits = (f.phone || '').replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 7 || phoneDigits.length > 15) {
      const phoneInput = cf.querySelector('input[name="phone"]');
      if (phoneInput) {
        phoneInput.setCustomValidity('Please enter a valid mobile phone number (7 to 15 digits).');
        phoneInput.reportValidity();
        phoneInput.oninput = () => phoneInput.setCustomValidity('');
      }
      return;
    }

    const bt = cf.querySelector('button');

    isSubmitting = true;
    if (bt) {
      bt.disabled = true;
      bt.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> Submitting your project...';
    }

    try {
      const result = await submitProjectEnquiry(f);
      if (result && result.ok) {
        isSubmitting = false;
        renderContactSuccess(cf, f, result);
        return;
      }
      throw new Error(result && result.error ? result.error : 'Submission could not be confirmed.');
    } catch (err) {
      isSubmitting = false;
      if (bt) {
        bt.disabled = false;
        bt.innerHTML = 'Retry Submission';
      }
      const alertDiv = document.createElement('div');
      alertDiv.id = 'cf-alert';
      alertDiv.className = 'form-alert error';
      alertDiv.setAttribute('role', 'alert');
      alertDiv.innerHTML = `
        <span class="form-alert-icon" aria-hidden="true">⚠️</span>
        <div class="form-alert-content">
          <b>Submission could not be confirmed</b>
          <p>${esc(err.message || 'We could not save your project enquiry right now.')} Your information has been preserved below. Please click Retry Submission or check your connection.</p>
        </div>
      `;
      const btnContainer = bt ? bt.closest('div') : cf.lastElementChild;
      if (btnContainer) {
        cf.insertBefore(alertDiv, btnContainer);
      } else {
        cf.appendChild(alertDiv);
      }
      alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };
 }
}
document.addEventListener('click',async ev=>{
  // 1. Blog & Work filters and pagination
  const bcat = ev.target && ev.target.closest && ev.target.closest('[data-bcat]');
  if (bcat) {
    blogFilter = bcat.dataset.bcat;
    blogPage = 1;
    blogShowAll = false;
    render(true);
    return;
  }

  const wcat = ev.target && ev.target.closest && ev.target.closest('[data-wcat]');
  if (wcat) {
    workFilter = wcat.dataset.wcat;
    render(true);
    return;
  }

  const more = ev.target && ev.target.closest && ev.target.closest('#b-more');
  if (more) {
    blogPage++;
    render(true);
    return;
  }

  const showall = ev.target && ev.target.closest && ev.target.closest('#b-showall, #b-showall-top, .b-showall-btn');
  if (showall) {
    blogShowAll = true;
    render(true);
    return;
  }

  // 2. Admin actions requiring [data-a]
  const t = ev.target && ev.target.closest && ev.target.closest('[data-a]');
  if (!t) return;
  const a = t.dataset.a, i = +t.dataset.i, P = S.projects;
  if(a==='logout'){await fetch('/api/admin/logout',{method:'POST',headers:H});owner=false;render();return}if(a==='delq'){if(!confirm('Delete this inquiry?'))return;await fetch('/api/admin/inquiries/'+t.dataset.i,{method:'DELETE',headers:H});INQ=INQ.filter(q=>q.id!=t.dataset.i);render();return}
  if(a==='new'){edit={published:false,gallery:[]};}
  else if(a==='ed'){edit=JSON.parse(JSON.stringify(P[i]));edit._i=i}
  else if(a==='cancel')edit=null;
  else if(a==='pub')P[i].published=!P[i].published;
  else if(a==='feat')P[i].featured=!P[i].featured;
  else if(a==='up'&&i>0)[P[i-1],P[i]]=[P[i],P[i-1]];
  else if(a==='dn'&&i<P.length-1)[P[i+1],P[i]]=[P[i],P[i+1]];
  else if(a==='del'){if(!confirm('Delete this project?'))return;P.splice(i,1)}
  else if(a==='savep'){document.querySelectorAll('#pf [data-k]').forEach(x=>edit[x.dataset.k]=x.value);
   if(!edit.name){alert('Add a project name first.');return}
   try{const up=async f=>{const r=await fetch('/api/admin/upload?name='+encodeURIComponent(f.name),{method:'POST',headers:{'Content-Type':f.type,'X-Requested-With':'caventra'},body:f});const j=await r.json();if(!r.ok)throw new Error(j.error);return j.url};const c=$('#pcv').files[0];if(c)edit.cover=await up(c);for(const f of $('#gl').files)edit.gallery.push(await up(f))}catch(x){alert('Image upload failed: '+(x.message||x.code));return}
   edit.slug=slug(edit.name);const j=edit._i;delete edit._i;if(j!=null)P[j]=edit;else P.push(edit);edit=null}
  else if(a==='saves'){document.querySelectorAll('#sf [data-s]').forEach(x=>{const k=x.dataset.s;if(k==='socials')S.socials=kv(x.value);else if(k==='techs')S.techs=kv(x.value);else if(k.includes('.')){const[a1,b1]=k.split('.');S[a1][b1]=x.value}else S[k]=x.value})}
  else return;
  if(!['new','ed','cancel'].includes(a))await save();render()});

// Interactive Website Project Cost Estimator event delegation
document.addEventListener('click', ev => {
  // Clear prefill button
  if (ev.target && ev.target.id === 'btn-clear-estimator-prefill') {
    estimatorPrefillData = null;
    render();
    return;
  }

  // Request Formal Quote from Estimator Review
  const quoteBtn = ev.target.closest('#btn-request-formal-quote');
  if (quoteBtn) {
    const est = getCurrentEstimate();
    if (est) {
      const summary = buildEstimatorScopeSummary(est);
      const msg = `[Website Project Cost Estimator Scope]
• Architecture: ${summary.websiteType}
• Total Pages: ${summary.pageCount}
• Technical Features: ${summary.features}
• Additional Services: ${summary.services}
• Polish & Execution: ${summary.complexity}
• Indicative Budget: ${summary.budgetSummary}

Project Notes & Goals:
(Please describe any specific preferences, reference links, or target deadlines)`;

      estimatorPrefillData = {
        websiteType: summary.websiteType,
        budgetSummary: summary.budgetSummary,
        messageBody: msg
      };
      location.hash = '#/contact';
    }
    return;
  }

  // Edit selections (back to Step 1)
  const editBtn = ev.target.closest('#btn-edit-selections');
  if (editBtn) {
    estimatorState.step = 1;
    render();
    return;
  }

  // Reset estimator
  const resetBtn = ev.target.closest('#btn-reset-estimator');
  if (resetBtn) {
    estimatorState = {
      step: 1,
      currency: 'INR',
      websiteTypeId: 'small-business',
      pageCount: 5,
      selectedFeatureIds: [],
      selectedServiceIds: [],
      complexityId: 'standard'
    };
    render();
    return;
  }

  // Stepper nav (Next / Previous)
  const navBtn = ev.target.closest('[data-est-nav]');
  if (navBtn) {
    const dir = navBtn.dataset.estNav;
    if (dir === 'next') {
      estimatorState.step = Math.min(5, estimatorState.step + 1);
    } else if (dir === 'back') {
      estimatorState.step = Math.max(1, estimatorState.step - 1);
    }
    render();
    return;
  }

  // Step goto (Progress bar buttons)
  const gotoBtn = ev.target.closest('[data-est-goto]');
  if (gotoBtn) {
    estimatorState.step = parseInt(gotoBtn.dataset.estGoto, 10);
    render();
    return;
  }

  // Currency switcher
  const curBtn = ev.target.closest('[data-est-cur]');
  if (curBtn) {
    estimatorState.currency = curBtn.dataset.estCur;
    render();
    return;
  }

  // Step 1: Website type card
  const typeCard = ev.target.closest('[data-est-type]');
  if (typeCard) {
    const typeId = typeCard.dataset.estType;
    estimatorState.websiteTypeId = typeId;
    const cfg = getEstimatorConfig();
    const t = cfg && cfg.websiteTypes.find(x => x.id === typeId);
    if (t) {
      estimatorState.pageCount = t.defaultPages;
    }
    render();
    return;
  }

  // Step 2: Page count preset chip
  const presetChip = ev.target.closest('[data-est-preset]');
  if (presetChip) {
    estimatorState.pageCount = parseInt(presetChip.dataset.estPreset, 10);
    render();
    return;
  }

  // Step 2: Custom stepper button
  const stepperBtn = ev.target.closest('[data-est-stepper]');
  if (stepperBtn) {
    const delta = parseInt(stepperBtn.dataset.estStepper, 10);
    const nextVal = estimatorState.pageCount + delta;
    const cfg = getEstimatorConfig();
    const maxPages = (cfg && cfg.pageRules && cfg.pageRules.maxStandardPages) || 40;
    if (nextVal >= 1 && nextVal <= maxPages) {
      estimatorState.pageCount = nextVal;
      render();
    }
    return;
  }

  // Step 3: Feature check card
  const featCard = ev.target.closest('[data-est-feat]');
  if (featCard) {
    const featId = featCard.dataset.estFeat;
    const cfg = getEstimatorConfig();
    const feat = cfg && cfg.features.find(x => x.id === featId);
    const isIncluded = feat && (feat.includedByDefaultIn || []).includes(estimatorState.websiteTypeId);
    if (!isIncluded) {
      const idx = estimatorState.selectedFeatureIds.indexOf(featId);
      if (idx !== -1) {
        estimatorState.selectedFeatureIds.splice(idx, 1);
      } else {
        estimatorState.selectedFeatureIds.push(featId);
      }
      render();
    }
    return;
  }

  // Step 4: Service check card
  const srvCard = ev.target.closest('[data-est-srv]');
  if (srvCard) {
    const srvId = srvCard.dataset.estSrv;
    const idx = estimatorState.selectedServiceIds.indexOf(srvId);
    if (idx !== -1) {
      estimatorState.selectedServiceIds.splice(idx, 1);
    } else {
      estimatorState.selectedServiceIds.push(srvId);
    }
    render();
    return;
  }

  // Step 4: Complexity option
  const compOpt = ev.target.closest('[data-est-complexity]');
  if (compOpt) {
    estimatorState.complexityId = compOpt.dataset.estComplexity;
    render();
    return;
  }
});

// Keyboard accessibility for cards & chips
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    const t = e.target;
    if (t && t.matches && t.matches('[data-est-type], [data-est-preset], [data-est-feat]:not(.included-locked), [data-est-srv], [data-est-complexity]')) {
      e.preventDefault();
      t.click();
    }
  }
});

const bg=$('#bg'),lk=$('#lk');if(bg&&lk){bg.onclick=()=>{const o=lk.classList.toggle('open');bg.setAttribute('aria-expanded',o?'true':'false');};lk.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{lk.classList.remove('open');bg.setAttribute('aria-expanded','false');}));document.addEventListener('click',e=>{if(lk.classList.contains('open')&&!lk.contains(e.target)&&e.target!==bg){lk.classList.remove('open');bg.setAttribute('aria-expanded','false');}});window.addEventListener('keydown',e=>{if(e.key==='Escape'&&lk.classList.contains('open')){lk.classList.remove('open');bg.setAttribute('aria-expanded','false');}});}
$('#yr').textContent=new Date().getFullYear();
const ckb=$('#ckb'),ckAcc=$('#ck-acc'),ckDec=$('#ck-dec');
if(ckb&&!localStorage.getItem('cv_cookie_consent')){ckb.classList.remove('hide');setTimeout(()=>ckb.classList.add('show'),700);if(ckAcc)ckAcc.onclick=()=>{localStorage.setItem('cv_cookie_consent','accepted');ckb.classList.remove('show');setTimeout(()=>ckb.classList.add('hide'),400);};if(ckDec)ckDec.onclick=()=>{localStorage.setItem('cv_cookie_consent','essential');ckb.classList.remove('show');setTimeout(()=>ckb.classList.add('hide'),400);};}
let first=true,busy=false,tt;const cur=$('#cur');cur.innerHTML='<img src="'+getLogo()+'" alt="" aria-hidden="true">';
function scr(el){const t=el.textContent,G='ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+<>/',n=t.length;let f=0;const id=setInterval(()=>{f++;el.textContent=t.split('').map((c,i)=>c===' '||i<f*n/18?c:G[Math.random()*G.length|0]).join('');if(f>=18){clearInterval(id);el.textContent=t}},38)}
function nav(){if(first||RM){first=false;render();return}if(busy)return;busy=true;cur.className='cin';setTimeout(()=>{render();cur.className='cout';setTimeout(()=>{cur.className='';busy=false},540)},520)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);if(e.target.tagName==='H2'&&!e.target.children.length)scr(e.target)}}),{threshold:.12});
let raf;function fx(){[['section:not(.band) h2','dn'],['.list>div','lf'],['.steps>div','rt'],['.card,.bc','zm'],['.split>*','x'],['.empty,.adm,form,section .wrap>p','']].forEach(([s,c])=>app.querySelectorAll(s).forEach((e,i)=>{e.classList.add('rv');if(c==='x')e.classList.add(i%2?'rt':'lf');else if(c)e.classList.add(c);e.style.setProperty('--d',(i%4)*.08+'s');RM?e.classList.add('in'):io.observe(e)}));
 document.querySelectorAll('.shine').forEach(s=>{s.style.webkitMaskImage=s.style.maskImage='url('+getLogo()+')'});lit();app.querySelectorAll('section').forEach(e=>RM?e.classList.add('in'):io.observe(e));
 window.addEventListener('cv-theme-changed',()=>{const l=getLogo(),nl=getNavLogo(),ci=$('#cur img');if(ci)ci.src=l;const sp=$('#sp');if(sp)sp.src=l;const fl=$('#fl');if(fl)fl.src=l;document.querySelectorAll('.hl').forEach(img=>{img.src=l;});document.querySelectorAll('nav .mk').forEach(img=>{img.src=nl;});document.querySelectorAll('.shine').forEach(s=>{s.style.webkitMaskImage=s.style.maskImage='url('+l+')';});});
 clearTimeout(tt);const rw=$('#rw');if(rw&&!RM){let i=0,j=0,d=1;const tick=()=>{const t=S.services[i][0];j+=d;rw.textContent=t.slice(0,j);let ms=75;if(d==1&&j==t.length){d=-1;ms=1500}else if(d==-1&&j==0){d=1;i=(i+1)%S.services.length;ms=350}else if(d==-1)ms=35;tt=setTimeout(tick,ms)};tick()}
 
 cancelAnimationFrame(raf);const c=$('#cv');if(!c||RM)return;const x=c.getContext('2d');let w,hh,P=[];const rs=()=>{w=c.width=c.offsetWidth;hh=c.height=c.offsetHeight;P=Array.from({length:Math.min(64,w/18|0)},()=>({x:Math.random()*w,y:Math.random()*hh,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}))};rs();onresize=rs;
 const f=()=>{x.clearRect(0,0,w,hh);const isL=getTheme()==='light';const dc=isL?'rgba(147,116,62,.65)':'rgba(201,184,160,.7)';const lc=isL?'rgba(147,116,62,':'rgba(201,184,160,';for(const p of P){p.x=(p.x+p.vx+w)%w;p.y=(p.y+p.vy+hh)%hh;x.fillStyle=dc;x.fillRect(p.x,p.y,1.6,1.6)}
  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const d=Math.hypot(P[i].x-P[j].x,P[i].y-P[j].y);if(d<130){x.strokeStyle=lc+.2*(1-d/130)+')';x.beginPath();x.moveTo(P[i].x,P[i].y);x.lineTo(P[j].x,P[j].y);x.stroke()}}raf=requestAnimationFrame(f)};f()}
document.body.style.setProperty('--h','1.9s');setTimeout(()=>document.body.style.setProperty('--h','0s'),3200);
addEventListener('scroll',()=>{$('#pb').style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100||0)+'%'},{passive:true});
if(matchMedia('(pointer:fine)').matches&&!RM)addEventListener('mousemove',e=>{const g=$('#cg');g.style.opacity=1;g.style.transform=`translate(${e.clientX}px,${e.clientY}px)`});
addEventListener('scroll',()=>{lit();const l=document.querySelector('.hlw');if(l&&!RM)l.style.translate='0 '+Math.min(scrollY*.12,120)+'px'},{passive:true});
if(matchMedia('(pointer:fine)').matches&&!RM)addEventListener('mousemove',e=>{const c=e.target.closest&&e.target.closest('.card');document.querySelectorAll('.card .im').forEach(x=>{if(!c||!c.contains(x)){x.style.setProperty('--rx','0deg');x.style.setProperty('--ry','0deg')}});if(c){const im=c.querySelector('.im'),r=im.getBoundingClientRect();im.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*10+'deg');im.style.setProperty('--rx',-((e.clientY-r.top)/r.height-.5)*10+'deg')}
 const b=e.target.closest&&e.target.closest('.btn');document.querySelectorAll('.btn').forEach(x=>{if(x!==b)x.style.transform=''});if(b){const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.28}px)`}});
if(matchMedia('(pointer:fine)').matches&&!RM){const d=document.createElement('div');d.id='cd';document.body.appendChild(d);addEventListener('mousemove',e=>{d.style.opacity=1;d.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;d.classList.toggle('h',!!(e.target.closest&&e.target.closest('a,button,.card,.bc')))})}
addEventListener('pointerdown',e=>{const r=document.createElement('span');r.className='rp';r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';document.body.appendChild(r);setTimeout(()=>r.remove(),800)});
let lY=scrollY,sk=0,tg=0;addEventListener('scroll',()=>{tg=Math.max(-14,Math.min(14,(scrollY-lY)*.6));lY=scrollY},{passive:true});
(function loop(){sk+=(tg-sk)*.12;tg*=.9;document.querySelectorAll('.tape>div').forEach(e=>e.style.setProperty('--sk',sk+'deg'));requestAnimationFrame(loop)})();
if(matchMedia('(pointer:fine)').matches)addEventListener('mousemove',e=>{const w=document.querySelector('.hlw');if(w){w.style.setProperty('--ty',(e.clientX/innerWidth-.5)*16+'deg');w.style.setProperty('--tx',-(e.clientY/innerHeight-.5)*12+'deg')}const b=e.target.closest&&e.target.closest('.bc');if(b){const r=b.getBoundingClientRect();b.style.setProperty('--mx',e.clientX-r.left+'px');b.style.setProperty('--my',e.clientY-r.top+'px')}});
addEventListener('click',async e=>{const t=e.target.closest('[data-cp]');if(!t)return;const v=t.dataset.cp;let ok=false;try{await navigator.clipboard.writeText(v);ok=true}catch(x){try{const a=document.createElement('textarea');a.value=v;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();ok=document.execCommand('copy');a.remove()}catch(y){}}const o=t.textContent;t.textContent=ok?'Copied ✓':'Copy failed';setTimeout(()=>t.textContent=o,1500)});
document.addEventListener('input', e => {
  if (e.target && e.target.id === 'b-search') {
    blogQuery = e.target.value;
    blogPage = 1;
    blogShowAll = false;
    const list = getB();
    const filtered = list.filter(b => {
      const matchCat = (blogFilter === 'All') || (b.category === blogFilter);
      const q = blogQuery.toLowerCase().trim();
      return matchCat && (!q || b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q) || (b.location && b.location.toLowerCase().includes(q)));
    });
    const pageSize = 24;
    const visible = filtered.slice(0, blogPage * pageSize);
    const hasMore = visible.length < filtered.length;

    const countEl = document.getElementById('b-count');
    if (countEl) countEl.textContent = `Showing ${visible.length} of ${filtered.length} articles`;

    const topWrap = document.getElementById('b-top-showall-wrap');
    if (topWrap) topWrap.innerHTML = (!blogShowAll && filtered.length > pageSize) ? `<button class="btn sm b-showall-btn" id="b-showall-top">Show All (${filtered.length})</button>` : '';

    const grid = document.getElementById('bg-grid');
    if (grid) {
      if (visible.length === 0) {
        grid.innerHTML = `<div class="empty" style="grid-column:1/-1;padding:48px 24px;text-align:center"><h3 style="font-size:20px;margin-bottom:8px">No matching articles found</h3><p style="color:var(--mut);font-size:14px">Try searching for other topics like "pricing", "hosting", "security", or "SEO".</p></div>`;
      } else {
        grid.innerHTML = visible.map(b => `
          <a class="b-card" href="/blog/${esc(b.slug)}/">
            <div>
              <div class="meta">
                <span>${esc(b.category)}</span>
                <span class="dot-sep"></span>
                <span>${esc(b.readTime)}</span>
                ${b.location && b.location !== 'Global' ? `<span class="dot-sep"></span><span style="color:var(--gold2)">📍 ${esc(b.location)}</span>` : ''}
              </div>
              <h3>${esc(b.title)}</h3>
              <p>${esc(b.summary)}</p>
            </div>
            <div class="ftr">
              <span class="tag">${esc(b.author)}</span>
              <span class="read-link">Read Article ↗</span>
            </div>
          </a>
        `).join('');
      }
    }

    const pagEl = document.getElementById('b-pagination');
    if (pagEl) {
      pagEl.innerHTML = hasMore ? `
        <button class="btn solid" id="b-more">Load More</button>
        <button class="btn b-showall-btn" id="b-showall">Show All ${filtered.length} Articles</button>
      ` : '';
    }
  }
});

addEventListener('hashchange',nav);
if(typeof window!=='undefined'){
  if(location.hash&&location.hash.startsWith('#/')){
    const clean=location.hash.replace(/^#\/?/,'').replace(/\/$/,'');
    const target=clean?`/${clean}/`:'/';
    if(window.history&&window.history.replaceState){try{history.replaceState(null,'',target+location.search)}catch(_){}}
  }
  addEventListener('popstate',nav);
  document.addEventListener('click', e => {
    const a = e.target && e.target.closest && e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank' || a.hasAttribute('download')) return;
    if (href.startsWith('/') || href.startsWith('#/')) {
      let targetUrl = href;
      if (href.startsWith('#/')) {
        const clean = href.replace(/^#\/?/, '').replace(/\/$/, '');
        targetUrl = clean ? `/${clean}/` : '/';
      }
      if (targetUrl.endsWith('.xml') || targetUrl.endsWith('.txt') || targetUrl.endsWith('.png') || targetUrl.endsWith('.ico')) return;
      if (window.history && window.history.pushState) {
        try {
          history.pushState(null, '', targetUrl);
          nav();
          e.preventDefault();
        } catch (_) {}
      }
    }
  });
}
render();
const norm=()=>{if(!S.socials||!S.socials.length)S.socials=D.socials.slice();S.contact=Object.assign({},D.contact,Object.fromEntries(Object.entries(S.contact||{}).filter(([k,v])=>v)));if(Array.isArray(S.projects)){S.projects.forEach(p=>{if(!p.cover||!p.cover.trim()){const m=D.projects.find(x=>x.slug===p.slug||x.name===p.name);if(m&&m.cover)p.cover=m.cover;}});}};
async function loadAdmin(){const r=await fetch('/api/admin/site');if(r.ok){S=Object.assign(JSON.parse(JSON.stringify(D)),await r.json());norm()}const q=await fetch('/api/admin/inquiries');if(q.ok)INQ=await q.json()}
async function doLogin(e){e.preventDefault();const m=$('#lm');try{const r=await fetch('/api/admin/login',{method:'POST',headers:H,body:JSON.stringify({password:$('#lp').value})});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'Login failed');owner=true;await loadAdmin();render()}catch(x){m.textContent=x.message}}
(async()=>{try{const r=await fetch('/api/site');if(r.ok){S=Object.assign(JSON.parse(JSON.stringify(D)),await r.json());norm()}const m=await (await fetch('/api/admin/me')).json();if(m.admin){owner=true;await loadAdmin()}}catch(x){}render()})();
