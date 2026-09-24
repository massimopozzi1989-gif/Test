(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const FOLDER='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
const RADIO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="2"/><path d="M8 8a5.5 5.5 0 0 0 0 8M16 8a5.5 5.5 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/></svg>';
const GEAR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
const pages=$$('.page'), total=pages.length, pad=n=>String(n).padStart(2,'0');

let acc='orange';
pages.forEach((p,i)=>{
  if(p.dataset.acc) acc=p.dataset.acc;
  p.dataset.pno=i+1;
  if(p.hasAttribute('data-nochrome')) return;
  const ch=p.dataset.ch;
  p.insertAdjacentHTML('afterbegin',
   `<header class="ptop"><img src="img/logo.png" alt=""><span class="chip">${FOLDER}${p.dataset.chip||p.dataset.title}</span>
    <span class="status">${ch?`Chapter <b>${ch}</b>`:'AudioXL <b>SEQ</b>'}</span>
    <span class="ico">${RADIO}</span><span class="ico">${GEAR}</span></header>`);
  p.insertAdjacentHTML('beforeend',`<footer class="pfoot"><span>AudioXL SEQ · User manual · v1.0.5</span><span class="n">${pad(i+1)}<i>/</i>${pad(total)}</span></footer>`);
});

// contents
const toc=$('#toc');
pages.filter(p=>p.dataset.sub).forEach(p=>{
  toc.insertAdjacentHTML('beforeend',`<a style="--acc:var(--${p.dataset.acc})"><span class="n">${p.dataset.ch}</span>
   <span><span class="t">${p.dataset.title}</span><br><span class="s">${p.dataset.sub}</span></span><span></span><span class="p">${pad(p.dataset.pno)}</span></a>`);
});

// decorative lane grids (cover / back)
function laneGrid(el){ if(!el) return;
  const L=[['GATE','var(--red)','1000100010001010'],['PITCH A','var(--cyan)','0110010100100110'],['CHORD','var(--purple)','1000000010000000'],['VELOCITY','var(--green)','1111111111111111'],['CC 1','var(--amber)','0010010001001001']];
  el.innerHTML=L.map(([n,c,pat])=>`<div style="display:grid;grid-template-columns:78px repeat(16,1fr);gap:4px;align-items:center"><span class="tag" style="color:${c};font-size:11px;padding:4px 7px">${n}</span>${[...pat].map(b=>`<i style="height:15px;border-radius:3px;background:${b=='1'?c:'#141B28'};border:1px solid ${b=='1'?'transparent':'#1C2432'};opacity:${b=='1'?.92:1}"></i>`).join('')}</div>`).join('');
}
laneGrid($('#coverGrid')); laneGrid($('#backGrid'));

// swing demo
const sw=$('#swingDemo');
[[50,'Straight'],[66.6,'Triplet feel'],[75,'Maximum']].forEach(([v,n])=>{
  let bars='';
  for(let k=0;k<4;k++){const x=k*25; bars+=`<i style="left:${x}%;background:var(--ink)"></i><i style="left:${x+25*v/100}%;background:var(--red)"></i>`;}
  sw.insertAdjacentHTML('beforeend',`<div><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font:800 26px/1 var(--display);color:var(--ink)">${v}<small style="font-size:14px;color:var(--muted)"> %</small></span><span class="lab">${n}</span></div>
   <div style="position:relative;height:30px;margin-top:10px;border-radius:6px;background:#0A0E15;border:1px solid var(--line)">${bars.replace(/<i /g,'<i class="sw" ')}</div></div>`);
});
$$('.sw').forEach(e=>Object.assign(e.style,{position:'absolute',top:'5px',bottom:'5px',width:'4px',borderRadius:'2px',marginLeft:'4px'}));

// voicing spans
const vo=$('#voicing');
[['Closed',11,'var(--purple)'],['Open',23,'var(--cyan)'],['Wide',35,'var(--pink)']].forEach(([n,s,c])=>{
  vo.insertAdjacentHTML('beforeend',`<div style="display:grid;grid-template-columns:70px 1fr 110px;gap:12px;align-items:center">
   <span style="font:800 17px/1 var(--display);text-transform:uppercase;color:var(--ink)">${n}</span>
   <div style="height:14px;border-radius:4px;background:#0A0E15;border:1px solid var(--line);overflow:hidden"><div style="height:100%;width:${s/36*100}%;background:${c};border-radius:3px"></div></div>
   <span style="font:700 11px/1 var(--mono);color:${c};text-align:right">${s} semitones</span></div>`);
});

// scene map
const sm=$('#sceneMap');
[['1-4','Basic','var(--cyan)',[2,2,3,3]],['5-8','Development','var(--green)',[4,4,5,5]],['9-12','Energy','var(--orange)',[6,6,7,7]],['13-16','Break','var(--red)',[2,1,2,1]]].forEach(([r,n,c,e],gi)=>{
  let pads='';e.forEach((h,k)=>pads+=`<div style="flex:1;display:flex;flex-direction:column;gap:5px;align-items:center"><div style="height:44px;width:100%;display:flex;align-items:flex-end;background:#0A0E15;border:1px solid var(--line);border-radius:5px;padding:3px"><div style="width:100%;height:${h/7*100}%;background:${c};border-radius:2px;opacity:.9"></div></div><span style="font:700 10px/1 var(--mono);color:var(--muted)">${gi*4+k+1}</span></div>`);
  sm.insertAdjacentHTML('beforeend',`<div class="panel" style="padding:12px"><div class="lab" style="color:${c}">${r}</div><div style="font:800 19px/1.1 var(--display);text-transform:uppercase;color:var(--ink);margin:4px 0 10px">${n}</div><div style="display:flex;gap:5px">${pads}</div></div>`);
});
sm.insertAdjacentHTML('afterend',`<p style="margin-top:-8px"><b class="c-red">13-16, the break</b>, is the only level that takes away instead of adding — which is where you come back in.</p>`);

// keys
const names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const ks=$('#keys');
for(let i=0;i<16;i++){const nm=names[i%12]+(i<12?'-2':'-1');const blk=nm.includes('#');
  ks.insertAdjacentHTML('beforeend',`<div style="display:flex;flex-direction:column;gap:6px;align-items:center">
   <div style="height:70px;width:100%;border-radius:4px;background:${blk?'#1A2230':'#D9DEE7'};border:1px solid var(--line2);display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;font:800 14px/1 var(--display);color:${blk?'var(--purple)':'#0B0F17'}">${i+1}</div>
   <span style="font:500 8.5px/1 var(--mono);color:var(--muted)">${nm}</span></div>`);}

// polymeter demo
const pd=$('#polyDemo');
const lanes=[['GATE',16,'var(--red)'],['PITCH A',7,'var(--cyan)'],['CHORD',5,'var(--purple)']];
let html='<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px"><span class="lab">Polymeter · 32 steps · lengths 16, 7, 5</span><span style="font:800 20px/1 var(--display);color:var(--ink)">cycle = 16×7×5 = <span class="c-orange">560 steps</span></span></div>';
lanes.forEach(([n,L,c])=>{
  let cells='';for(let s=0;s<32;s++){const idx=s%L;const start=idx==0;cells+=`<div style="height:20px;border-radius:3px;background:${start?c:'#141B28'};border:1px solid ${start?'transparent':'#1C2432'};font:700 8px/20px var(--mono);text-align:center;color:${start?'#07090E':'var(--muted)'}">${idx+1}</div>`;}
  html+=`<div style="display:grid;grid-template-columns:92px 1fr;gap:10px;align-items:center;margin-bottom:5px"><span class="tag" style="color:${c};font-size:12px">${n} ${L}</span><div style="display:grid;grid-template-columns:repeat(32,1fr);gap:2px">${cells}</div></div>`;
});
pd.innerHTML=html;

// chord types
const ch=$('#chords');
[['1','single'],['5','power'],['8','octave'],['3','triad'],['s2','sus2'],['s4','sus4'],['6','sixth'],['7','seventh'],['9','ninth'],['11','eleventh']].forEach(([s,n])=>{
  ch.insertAdjacentHTML('beforeend',`<div style="border:1px solid var(--line2);background:#0A0E15;border-radius:8px;padding:10px 4px;text-align:center"><div style="font:800 24px/1 var(--display);color:var(--purple)">${s}</div><div style="font:500 8.5px/1 var(--mono);color:var(--muted);margin-top:6px;text-transform:uppercase;letter-spacing:.08em">${n}</div></div>`);
});

// directions
const dirs=$('#dirs');
[['Fwd','forward',[1,2,3,4,5,6,1,2,3,4]],['Bwd','backward',[6,5,4,3,2,1,6,5,4,3]],['Pend','pendulum, endpoints not repeated',[1,2,3,4,5,6,5,4,3,2]],['BiDir','pendulum, endpoints repeated',[1,2,3,4,5,6,6,5,4,3]],['Rnd','random (example)',[3,3,5,1,6,2,2,4,1,5]],['RndNR','random, never twice in a row (example)',[3,5,1,6,2,4,1,5,3,6]]].forEach(([n,d,seq])=>{
  const cells=seq.map(v=>`<div style="height:22px;border-radius:3px;background:rgba(226,179,71,${.15+v*.13});font:700 10px/22px var(--mono);text-align:center;color:${v>3?'#07090E':'var(--ink)'}">${v}</div>`).join('');
  dirs.insertAdjacentHTML('beforeend',`<div><div style="display:flex;gap:8px;align-items:baseline;margin-bottom:6px"><span style="font:800 16px/1 var(--display);color:var(--amber);text-transform:uppercase">${n}</span><span style="font-size:9.5px;color:var(--muted)">${d}</span></div><div style="display:grid;grid-template-columns:repeat(10,1fr);gap:3px">${cells}</div></div>`);
});

// fence vs gravity (illustrative)
const gv=$('#gravity');
const A=[0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1], B=[3,3,3,3,4,4,5,5,6,7,8,9,10,11,12,13];
const hist=(arr,c)=>{const m=Math.max(...arr);return `<div style="display:flex;gap:3px;align-items:flex-end;height:90px;border-bottom:1px solid var(--line2)">${arr.map(v=>`<div style="flex:1;height:${v/m*100}%;background:${c};border-radius:2px 2px 0 0;min-height:${v?2:0}px"></div>`).join('')}</div><div style="display:flex;justify-content:space-between;font:500 9px/1 var(--mono);color:var(--dim);margin-top:5px"><span>0</span><span>64</span><span>127</span></div>`};
gv.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:26px">
 <div><div class="lab" style="margin-bottom:6px">Fence only · MIN 90 · MAX 127</div><div style="font:800 18px/1.1 var(--display);text-transform:uppercase;color:var(--ink);margin-bottom:12px">Always high, <span class="c-muted">never closes</span></div>${hist(A,'var(--muted)')}</div>
 <div><div class="lab" style="margin-bottom:6px">Full range · OFFSET +70</div><div style="font:800 18px/1.1 var(--display);text-transform:uppercase;color:var(--ink);margin-bottom:12px">High 71 % · <span class="c-cyan">and it still drops</span></div>${hist(B,'var(--cyan)')}</div></div>
 <div style="font-size:9px;color:var(--dim);margin-top:12px">Distributions drawn for illustration.</div>`;

// latency
const la=$('#latency');
la.innerHTML='<div class="lab" style="margin-bottom:12px">1 buffer of delay in Live · at 48 kHz</div>'+
 [[64,1.3],[128,2.7],[256,5.3],[512,10.7]].map(([b,ms])=>`<div style="display:grid;grid-template-columns:44px 1fr 56px;gap:10px;align-items:center;margin-bottom:9px"><span style="font:700 10.5px/1 var(--mono);color:var(--soft)">${b}</span><div style="height:12px;border-radius:3px;background:#0A0E15;border:1px solid var(--line)"><div style="height:100%;width:${ms/10.7*100}%;background:var(--cyan);border-radius:2px"></div></div><span style="font:700 11px/1 var(--mono);color:var(--ink);text-align:right">${ms} ms</span></div>`).join('')+
 '<div style="font-size:9.5px;color:var(--muted);margin-top:4px">Block size in samples → delay. The sequencer itself is sample-accurate at any size.</div>';
})();
