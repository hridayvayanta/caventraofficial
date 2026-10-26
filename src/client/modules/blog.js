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