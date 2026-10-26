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
        timeline: summary.timeline || (est.websiteType && est.websiteType.timeline) || '',
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
