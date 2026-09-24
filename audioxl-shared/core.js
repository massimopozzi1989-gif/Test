/* AudioXL shared page chrome for manuals (.page) and decks (.slide).
   Reads <body data-product data-version data-logo>. */
(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const B=document.body.dataset, pad=n=>String(n).padStart(2,'0');
const FOLDER='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
const RADIO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="2"/><path d="M8 8a5.5 5.5 0 0 0 0 8M16 8a5.5 5.5 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/></svg>';
const GEAR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>';
window.AXL={pad,$,$$};

// manual pages
const pages=$$('.page'), total=pages.length;
pages.forEach((p,i)=>{
  p.dataset.pno=i+1;
  if(p.hasAttribute('data-nochrome')) return;
  const ch=p.dataset.ch;
  p.insertAdjacentHTML('afterbegin',`<header class="ptop"><img src="${B.logo}" alt=""><span class="chip">${FOLDER}${p.dataset.chip||p.dataset.title}</span>
    <span class="status">${ch?`Chapter <b>${ch}</b>`:B.product.replace(/^AudioXL /,'AudioXL <b>')+'</b>'}</span><span class="ico">${RADIO}</span><span class="ico">${GEAR}</span></header>`);
  p.insertAdjacentHTML('beforeend',`<footer class="pfoot"><span>${B.product} · User manual · v${B.version}</span><span class="n">${pad(i+1)}<i>/</i>${pad(total)}</span></footer>`);
});
const toc=$('#toc');
if(toc) pages.filter(p=>p.dataset.sub).forEach(p=>toc.insertAdjacentHTML('beforeend',
  `<a style="--acc:var(--${p.dataset.acc})"><span class="n">${p.dataset.ch}</span><span><span class="t">${p.dataset.title}</span><br><span class="s">${p.dataset.sub}</span></span><span></span><span class="p">${pad(p.dataset.pno)}</span></a>`));

// deck slides
const S=$$('.slide'), N=S.length;
S.forEach((s,i)=>{ if(s.hasAttribute('data-nochrome')) return;
  s.insertAdjacentHTML('afterbegin',`<div class="stop"><img src="${B.logo}" alt=""><span class="chip">${FOLDER}${s.dataset.chip}</span><span class="status">${s.dataset.status}</span><span class="ico">${RADIO}</span><span class="ico">${GEAR}</span></div>`);
  s.insertAdjacentHTML('beforeend',`<div class="pno">${pad(i+1)}<i>/</i>${pad(N)}</div>`);
});

// step grid: rows = [[label,color,'1010…'],…]; '2' = accent
AXL.stepGrid=function(el,rows,opt={}){ if(!el) return;
  const lw=opt.labelWidth||78, h=opt.h||15, fs=opt.fs||11;
  el.innerHTML=rows.map(([n,c,pat])=>`<div style="display:grid;grid-template-columns:${lw}px repeat(${pat.length},1fr);gap:${opt.gap||4}px;align-items:center">`+
    `<span class="tag" style="color:var(--${c});font-size:${fs}px;padding:4px 7px">${n}</span>`+
    [...pat].map(b=>`<i style="height:${h}px;border-radius:3px;background:${b!='0'?`var(--${c})`:'#141B28'};border:1px solid ${b!='0'?'transparent':'#1C2432'};opacity:${b=='1'?.6:1}"></i>`).join('')+'</div>').join('');
};
AXL.dice=function(){ $$('.dice').forEach(d=>{const z=getComputedStyle(d).getPropertyValue('--sz').trim()||'16px';
  d.innerHTML=`<svg width="${z}" height="${z}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.4" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></svg>`;d.style.display='inline-flex'});};
})();
