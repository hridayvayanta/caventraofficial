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
    timeline: estimate.websiteType.timeline || '',
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
const getTheme=()=>document.documentElement.getAttribute('data-theme')||'dark';
const getLogo=()=>(getTheme()==='light'?'/assets/logo-light.webp':'/assets/logo.webp');
const getNavLogo=()=>(getTheme()==='light'?'/assets/logo-nav-light.webp':'/assets/logo-nav.webp');
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
