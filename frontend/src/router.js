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
  // Hydration guard: preserve pre-rendered static HTML for search crawlers and initial load
  if (app && app.innerHTML && app.innerHTML.trim().length > 100) {
    if (r === 'blog' && s) {
      const art = (typeof getB === 'function' ? getB() : []).find(x => x.slug === s);
      if (!art && app.querySelector('.article-wrap')) {
        fx();
        return;
      }
    } else if (r === 'work' && s) {
      const prj = (S.projects || []).find(x => x.slug === s && x.published);
      if (!prj && app.querySelector('.service-breadcrumb')) {
        fx();
        return;
      }
    }
  }
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