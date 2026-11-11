/* BRZ EUA e99 · Soja: China x destinos não-China, curvas de commitment por MY.
   Fonte única: E.dados.soja.s (USDA/FAS). Não modifica números nem séries.
   UNKNOWN fica separado: não é atribuído à China nem ao não-China identificado. */
(function(){
'use strict';
const ID='cnnoncommit',CARD=ID+'|soja',NS='http://www.w3.org/2000/svg';
const NAVY='#1A3A5C',TEAL='#0D9488',HIST_DASH=['7 5','3 4','10 4 2 4','2 5','9 3'];
const fmt=n=>new Intl.NumberFormat('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(n);
const label=y=>String(y)+'/'+String((y+1)%100).padStart(2,'0');
function years(){
  return [...new Set((window.E?.dados?.soja?.s?.MUNDO||[]).map(r=>r[1]))].sort((a,b)=>a-b);
}
function rows(year){
  const s=window.E?.dados?.soja?.s||{};
  const world=(s.MUNDO||[]).filter(r=>r[1]===year);
  const indexed=key=>new Map((s[key]||[]).filter(r=>r[1]===year).map(r=>[r[2],r]));
  const ch=indexed('China'),un=indexed('UNKNOWN');
  return world.map(w=>{
    const c=ch.get(w[2]),u=un.get(w[2]),total=w[3]+w[4];
    if(!c||!u||!(total>0))return {week:w[2],missing:true};
    const china=c[3]+c[4],unknown=u[3]+u[4],other=total-china-unknown;
    if(china<0||unknown<0||other< -0.02||!Number.isFinite(other))return {week:w[2],missing:true};
    return {week:w[2],year,total,china,other:Math.max(0,other),unknown,
      chinaPct:china/total*100,otherPct:Math.max(0,other)/total*100,unknownPct:unknown/total*100};
  }).sort((a,b)=>a.week-b.week);
}
function seriesAt(year,week){return rows(year).find(r=>r.week===week&&!r.missing)||null;}
function defaultConfig(){
 const yy=years(),cur=yy.at(-1),past=yy.filter(y=>y!==cur);
 const w=rows(cur).filter(r=>!r.missing).at(-1)?.week||1;
 return {week:w,mode:'volume',compare:past.length?[past.at(-1)]:[]};
}
function fromSnapshot(saved,base){
 if(!saved||typeof saved.html!=='string')return base;
 const root=document.createElement('div');root.innerHTML=saved.html;
 const title=root.querySelector('.p-card-t'),sub=root.querySelector('.p-card-s');
 const sel=(role)=>root.querySelector('select[data-role="'+role+'"]');
 const readSel=role=>{const s=sel(role);return s?(s.querySelector('option[selected]')?.value||s.value):null;};
 const sameData=saved.sourceDataAtual===window.E.meta.atual;
 const cmp=[...root.querySelectorAll('input[data-compare-year][checked]')].map(x=>+x.dataset.compareYear)
   .filter(y=>years().includes(y)&&y!==years().at(-1));
 return {week:sameData?Math.max(1,Math.min(base.week,Number(readSel('week'))||base.week)):base.week,
     mode:['volume','share'].includes(readSel('metric'))?readSel('metric'):base.mode,
     compare:root.querySelectorAll('input[data-compare-year]').length?cmp:base.compare,
     title:title?.textContent||null,sub:sub?.textContent||null,
     titleStyle:title?.getAttribute('style')||null,subStyle:sub?.getAttribute('style')||null,
     style:saved.style||null};
}
function graphic(config){
 const yy=years(),cur=yy.at(-1);
 const sel=[...new Set([cur,...config.compare])].sort((a,b)=>a-b);
 const selectedYears=sel.filter(y=>y!==cur).concat(cur);
 const all=selectedYears.flatMap(y=>rows(y).filter(p=>!p.missing&&p.week<=config.week));
 const keys=config.mode==='share'?['chinaPct','otherPct']:['china','other'];
 const toValue=(r,k)=>config.mode==='share'?r[k]:r[k]/1000;
 const maxObs=Math.max(0,...all.flatMap(r=>keys.map(k=>toValue(r,k))));
 const niceMax=v=>{const raw=Math.max(v*1.14,3),mag=10**Math.floor(Math.log10(raw)),n=raw/mag;return (n<=1?1:n<=1.5?1.5:n<=2?2:n<=3?3:n<=5?5:10)*mag;};
 const maxVal=config.mode==='share'?100:niceMax(maxObs),maxWeek=Math.max(config.week,9);
 const box={x0:62,x1:835,y0:32,y1:259,maxWeek,maxVal};
 const X=w=>box.x0+(w-1)/(maxWeek-1)*(box.x1-box.x0);
 const Y=v=>box.y1-v/maxVal*(box.y1-box.y0);
 const parts=[],esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 const histDash=['12 6','3 6','12 4 2 4','6 4 1 4','18 5'];
 const fmtAxis=v=>config.mode==='share'?fmt(v)+'%':fmt(v);
 parts.push('<svg data-cnnon-graph="1" viewBox="0 0 900 315" xmlns="'+NS+'" role="img" tabindex="0" aria-label="Compromisso de soja China e não-China até a semana '+config.week+'; passe o mouse ou use as setas do teclado" preserveAspectRatio="xMidYMid meet">');
 parts.push('<rect x="0" y="0" width="900" height="315" rx="10" fill="#fff"/>');
 parts.push('<text x="62" y="17" fill="#64748b" font-size="10" font-weight="600">'+(config.mode==='share'?'Participação no commitment total (%)':'Commitment acumulado (Mi t)')+'</text>');
 const ticks=Array.from({length:5},(_,i)=>maxVal*i/4);
 for(const v of ticks){
   const y=Y(v);
   parts.push('<line x1="'+box.x0+'" y1="'+y.toFixed(2)+'" x2="'+box.x1+'" y2="'+y.toFixed(2)+'" stroke="'+(v===0?'#aebdc9':'#e9eef2')+'" stroke-width="'+(v===0?'1.2':'1')+'"/>');
   parts.push('<text x="'+(box.x0-12)+'" y="'+(y+3).toFixed(2)+'" text-anchor="end" font-size="10.2" fill="#718096">'+fmtAxis(v)+'</text>');
 }
 const step=maxWeek<=12?1:maxWeek<=24?2:maxWeek<=42?5:8;
 const weekTicks=[1];for(let w=1+step;w<=maxWeek;w+=step)weekTicks.push(w);
 if(weekTicks.at(-1)!==maxWeek)weekTicks.push(maxWeek);
 for(const w of weekTicks){
   const x=X(w);
   parts.push('<text x="'+x.toFixed(2)+'" y="278" text-anchor="middle" font-size="10.5" fill="'+(w===config.week?'#193650':'#8392a2')+'" font-weight="'+(w===config.week?'700':'500')+'">'+w+'</text>');
 }
 parts.push('<text x="450" y="302" text-anchor="middle" font-size="10.5" fill="#64748b">Semana do ano comercial (MY)</text>');
 const selectedX=X(config.week);
 parts.push('<line data-cnnon-selected-week="1" x1="'+selectedX.toFixed(2)+'" y1="'+box.y0+'" x2="'+selectedX.toFixed(2)+'" y2="'+box.y1+'" stroke="#92a4b3" stroke-width="1.3" stroke-dasharray="3 6"/>');
 const series=[],legends=[];
 for(const year of selectedYears){
   const historical=year!==cur,idx=yy.filter(y=>y!==cur).indexOf(year),dash=historical?histDash[idx%histDash.length]:'';
   const source=rows(year).filter(p=>!p.missing&&p.week<=config.week);
   for(const [kind,key,color] of [['china',keys[0],NAVY],['other',keys[1],TEAL]]){
     let segments=[],seg=[],lastWeek=null;
     const flush=()=>{if(seg.length>1)segments.push(seg);seg=[]};
     for(const p of source){if(lastWeek!==null&&p.week-lastWeek>1)flush();seg.push(p);lastWeek=p.week;}
     flush();
     const width=historical?2.5:4.2,opacity=historical?0.75:1;
     for(const block of segments){
       const d=block.map((p,i)=>(i?'L':'M')+X(p.week).toFixed(2)+' '+Y(toValue(p,key)).toFixed(2)).join(' ');
       parts.push('<path data-cnnon-series="'+year+'-'+kind+'" d="'+d+'" fill="none" stroke="'+color+'" stroke-width="'+width+'" stroke-opacity="'+opacity+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none"/>');
     }
     if(source.length===1){const p=source[0];parts.push('<circle cx="'+X(p.week).toFixed(2)+'" cy="'+Y(toValue(p,key)).toFixed(2)+'" r="3" fill="'+color+'"/>');}
     const at=source.find(p=>p.week===config.week)||null;
     if(at){
       const v=toValue(at,key),shown=fmt(v)+(config.mode==='share'?'%':' Mi t');
       parts.push('<circle data-cnnon-point="'+year+'-'+kind+'" cx="'+X(at.week).toFixed(2)+'" cy="'+Y(v).toFixed(2)+'" r="'+(historical?'4':'5.6')+'" fill="#fff" stroke="'+color+'" stroke-width="'+(historical?'2':'3')+'"><title>'+esc(label(year)+' · '+(kind==='china'?'China':'Não-China')+' · '+shown)+'</title></circle>');
       if(!historical){
         // Label at the current endpoint, with an opaque backing for readability.
         const text=kind==='china'?'China':'Não-China';
         const wText=(text.length+shown.length)*6.3+22;
         const right=X(at.week)+wText+10<=897,tx=right?X(at.week)+9:X(at.week)-9;
         const baseY=Math.min(box.y1-9,Math.max(box.y0+14,Y(v)+(kind==='china'?-14:20)));
         const rx=right?tx-4:tx-wText+4;
         parts.push('<rect x="'+rx.toFixed(2)+'" y="'+(baseY-12).toFixed(2)+'" width="'+wText.toFixed(2)+'" height="19" rx="6" fill="#fff" fill-opacity=".94" stroke="#edf1f4"/>');
         parts.push('<text data-cnnon-endlabel="'+kind+'" x="'+tx.toFixed(2)+'" y="'+(baseY+1).toFixed(2)+'" text-anchor="'+(right?'start':'end')+'" font-size="11" font-weight="800" fill="'+color+'">'+text+' · '+shown+'</text>');
       }
     }
     series.push({year,kind,key,color,dash,now:!historical,points:source});
     legends.push({year,kind,color,dash,now:!historical,missing:!at});
   }
 }
 // Crosshair overlays are updated in place; they never change the underlying data.
 parts.push('<g data-cnnon-hover-layer="1" visibility="hidden" pointer-events="none">');
 parts.push('<line data-cnnon-crosshair-x="1" x1="0" y1="'+box.y0+'" x2="0" y2="'+box.y1+'" stroke="#536779" stroke-width="1.5" stroke-dasharray="4 4"/>');
 parts.push('<line data-cnnon-crosshair-y="1" x1="'+box.x0+'" y1="0" x2="'+box.x1+'" y2="0" stroke="#98a8b5" stroke-width="1" stroke-dasharray="3 6"/>');
 parts.push('<g data-cnnon-hover-markers="1"></g></g></svg>');
 return {svg:parts.join(''),legends,years:selectedYears,at:Object.fromEntries(selectedYears.map(y=>[y,seriesAt(y,config.week)])),
   series,box,X,Y,toValue,
   hoverWeeks:[...new Set(all.map(p=>p.week))].sort((a,b)=>a-b)};
}
function attachHover(chart,graph,config){
 const svg=chart.querySelector('svg[data-cnnon-graph]');if(!svg)return;
 const tip=document.createElement('div');tip.className='cnnon-tooltip';tip.hidden=true;
 tip.setAttribute('role','status');tip.setAttribute('aria-live','off');chart.appendChild(tip);
 const layer=svg.querySelector('[data-cnnon-hover-layer]'),vertical=svg.querySelector('[data-cnnon-crosshair-x]'),
   horizontal=svg.querySelector('[data-cnnon-crosshair-y]'),markers=svg.querySelector('[data-cnnon-hover-markers]');
 const fmtValue=(d,k)=>config.mode==='share'?fmt(d[k+'Pct'])+'%':fmt(d[k]/1000)+' Mi t';
 let activeWeek=null,touchActive=false;
 const close=()=>{tip.hidden=true;layer.setAttribute('visibility','hidden');markers.textContent='';activeWeek=null;};
 const show=(week,axisValue,px,py)=>{
   const sorted=graph.years.filter(y=>y!==years().at(-1)).concat(years().at(-1));
   const at=sorted.map(y=>({year:y,d:seriesAt(y,week)}));
   if(!at.some(x=>x.d)){close();return;}
   activeWeek=week;
   const xx=graph.X(week),yy=Math.max(graph.box.y0,Math.min(graph.box.y1,graph.Y(axisValue)));
   vertical.setAttribute('x1',xx.toFixed(2));vertical.setAttribute('x2',xx.toFixed(2));
   horizontal.setAttribute('y1',yy.toFixed(2));horizontal.setAttribute('y2',yy.toFixed(2));
   layer.setAttribute('visibility','visible');markers.textContent='';
   for(const ser of graph.series){
     const pt=ser.points.find(p=>p.week===week);if(!pt)continue;
     const circ=document.createElementNS(NS,'circle');
     circ.setAttribute('cx',String(graph.X(week)));circ.setAttribute('cy',String(graph.Y(graph.toValue(pt,ser.key))));
     circ.setAttribute('r',ser.now?'6.5':'5.5');circ.setAttribute('fill','#fff');
     circ.setAttribute('stroke',ser.color);circ.setAttribute('stroke-width',ser.now?'3.2':'2.2');
     markers.appendChild(circ);
   }
   const contents=at.map(({year,d})=>{
     if(!d)return '<div class="cnnon-tt-row missing"><b>MY '+label(year)+'</b><span>sem observação completa</span></div>';
     const selected=year===years().at(-1);
     return '<div class="cnnon-tt-row'+(selected?' current':'')+'"><div class="cnnon-tt-year">MY '+label(year)+(selected?' <small>Atual</small>':'')+'</div>'+
       '<div class="cnnon-tt-item"><i class="navy"></i><span>China</span><b>'+fmtValue(d,'china')+'</b><small>'+fmt(d.chinaPct)+'%</small></div>'+
       '<div class="cnnon-tt-item"><i class="teal"></i><span>Não-China</span><b>'+fmtValue(d,'other')+'</b><small>'+fmt(d.otherPct)+'%</small></div>'+
       '<div class="cnnon-tt-low">UNKNOWN '+fmt(d.unknown/1000)+' Mi t · Total '+fmt(d.total/1000)+' Mi t</div></div>';
   }).join('');
   tip.innerHTML='<div class="cnnon-tt-head"><b>Semana '+week+'</b><span>Commitment acumulado</span></div><div class="cnnon-tt-content">'+contents+'</div>';
   tip.hidden=false;
   const rect=chart.getBoundingClientRect(),width=tip.offsetWidth,height=tip.offsetHeight;
   const left=Math.max(6,Math.min(rect.width-width-6,px+17));
   const top=Math.max(5,Math.min(rect.height-height-5,py+12));
   tip.style.left=Math.max(6,left)+'px';tip.style.top=Math.max(5,top)+'px';
 };
 const hover=(event,down=false)=>{
   const point=svg.createSVGPoint();point.x=event.clientX;point.y=event.clientY;
   const matrix=svg.getScreenCTM();if(!matrix)return;
   const p=point.matrixTransform(matrix.inverse());
   if(p.x<graph.box.x0-12||p.x>graph.box.x1+12||p.y<graph.box.y0-10||p.y>graph.box.y1+12){
     if(!touchActive)close();return;
   }
   const raw=Math.max(1,Math.min(graph.box.maxWeek,1+(p.x-graph.box.x0)/(graph.box.x1-graph.box.x0)*(graph.box.maxWeek-1)));
   if(!graph.hoverWeeks.length)return;
   const target=graph.hoverWeeks.reduce((a,b)=>Math.abs(b-raw)<Math.abs(a-raw)?b:a,graph.hoverWeeks[0]);
   const rect=chart.getBoundingClientRect();
   show(target,Math.max(0,Math.min(graph.box.maxVal,(graph.box.y1-p.y)/(graph.box.y1-graph.box.y0)*graph.box.maxVal)),
     event.clientX-rect.left,event.clientY-rect.top);
   if(down&&event.pointerType==='touch')touchActive=true;
 };
 svg.addEventListener('pointerenter',e=>{touchActive=e.pointerType==='touch';hover(e);});
 svg.addEventListener('pointermove',e=>hover(e));
 svg.addEventListener('pointerdown',e=>hover(e,true));
 svg.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')close();});
 svg.addEventListener('keydown',e=>{
   if(e.key==='Escape'){close();svg.blur();return;}
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
   e.preventDefault();
   if(!graph.hoverWeeks.length)return;
   const w=activeWeek??Math.min(config.week,graph.hoverWeeks.at(-1));
   const idx=graph.hoverWeeks.indexOf(w);
   const next=e.key==='Home'?graph.hoverWeeks[0]:e.key==='End'?graph.hoverWeeks.at(-1):
     graph.hoverWeeks[Math.max(0,Math.min(graph.hoverWeeks.length-1,idx+(e.key==='ArrowRight'?1:-1)))];
   const shown=graph.series.find(ser=>ser.now&&ser.kind==='china')?.points.find(p=>p.week===next);
   const value=shown?graph.toValue(shown,config.mode==='share'?'chinaPct':'china'):graph.box.maxVal/2;
   const rect=svg.getBoundingClientRect(),chartRect=chart.getBoundingClientRect();
   show(next,value,rect.left-chartRect.left+Math.min(650,graph.X(next)/900*rect.width),
     rect.top-chartRect.top+60);
 });
 chart.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')close();});
 chart.dataset.cnnonHover='ready';
 return {close};
}

function build(com,c,saved){
 const base=defaultConfig(),config=fromSnapshot(saved,base);
 const el=document.createElement('div');
 el.className='p-card cnnon-card';el.dataset.card=CARD;el.style.gridColumn='1 / -1';
 el.style.minWidth='0';el.style.height='auto';el.style.minHeight='555px';
 if(config.style){el.style.cssText=config.style;el.style.gridColumn='1 / -1';el.style.height='auto';el.style.minHeight='555px';}
 el.innerHTML='<div class="p-card-h"><div><div class="p-card-t etext">'+c.t+'</div><div class="p-card-s etext">'+c.s+'</div></div><div class="cardtools"><div class="selrow" data-cnnon-controls="1" style="display:flex;align-items:center;flex-wrap:wrap;gap:6px"></div><div class="pal"></div></div></div><div class="china-year-controls"><strong>Comparar MY</strong></div><div class="chart cnnon-chart" title="Passe o mouse sobre as linhas para consultar qualquer semana"></div><div class="china-metrics" style="padding:2px 15px 9px"></div><div class="lg china-legend" style="display:flex;flex-wrap:wrap;column-gap:16px;row-gap:5px;padding:2px 14px 12px;font-size:11px"></div><div class="foot"><span class="etext">Fonte: USDA/FAS ESR · China / Não-China identificado / UNKNOWN</span><span class="etext">Mi t · Share</span></div>';
 const title=el.querySelector('.p-card-t'),sub=el.querySelector('.p-card-s');
 if(config.title&&config.title!==c.t)title.textContent=config.title;
 if(config.sub&&config.sub!==c.s)sub.textContent=config.sub;
 if(config.titleStyle)title.setAttribute('style',config.titleStyle);
 if(config.subStyle)sub.setAttribute('style',config.subStyle);
 const controls=el.querySelector('[data-cnnon-controls]'),yearbar=el.querySelector('.china-year-controls');
 const wk=document.createElement('select');wk.dataset.role='week';wk.className='selp';wk.title='Exibir compromisso acumulado até a semana escolhida';wk.style.maxWidth='108px';
 for(let week=1;week<=53;week++){const opt=document.createElement('option');opt.value=week;opt.textContent='Sem. '+week;wk.appendChild(opt);}
 wk.value=String(config.week);controls.appendChild(wk);
 const mode=document.createElement('select');mode.dataset.role='metric';mode.className='selp';mode.title='Alternar entre volume e participação';mode.style.maxWidth='144px';
 for(const [v,t] of [['volume','Volume (Mi t)'],['share','Share (%)']]){const opt=document.createElement('option');opt.value=v;opt.textContent=t;mode.appendChild(opt);}
 mode.value=config.mode;controls.appendChild(mode);
 const lastYear=years().at(-1);
 for(const y of years().filter(y=>y!==lastYear)){
  const lab=document.createElement('label');lab.style.cssText='display:inline-flex;gap:4px;align-items:center;cursor:pointer;white-space:nowrap';
  const cb=document.createElement('input');cb.type='checkbox';cb.dataset.compareYear=String(y);cb.checked=config.compare.includes(y);
  if(cb.checked)cb.setAttribute('checked','');
  lab.appendChild(cb);lab.appendChild(document.createTextNode(label(y)));yearbar.appendChild(lab);
 }
 const quickLast=document.createElement('button');quickLast.type='button';quickLast.className='cnnon-quick';quickLast.dataset.cnnonPreset='last';quickLast.textContent='Atual + anterior';quickLast.title='Manter apenas as safras atual e anterior';
 const quickClear=document.createElement('button');quickClear.type='button';quickClear.className='cnnon-quick';quickClear.dataset.cnnonPreset='clear';quickClear.textContent='Limpar anos';quickClear.title='Exibir apenas o MY vigente';
 yearbar.append(quickLast,quickClear);
 const pal=el.querySelector('.pal');
 const reset=document.createElement('button');reset.className='mini rst';reset.style.display='inline-block';reset.textContent='↺';reset.title='Reiniciar comparação e filtros';
 const png=document.createElement('button');png.className='mini png';png.textContent='⤓';png.title='Exportar gráfico PNG';
 pal.append(reset,png);
 const sync=()=>{
   for(const select of [wk,mode])for(const o of select.options){if(o.value===select.value)o.setAttribute('selected','');else o.removeAttribute('selected');}
   for(const cb of yearbar.querySelectorAll('input')){if(cb.checked)cb.setAttribute('checked','');else cb.removeAttribute('checked');}
 };
 const draw=()=>{
  const graph=graphic(config);
  const chart=el.querySelector('.chart');chart.innerHTML=graph.svg;
  const lg=el.querySelector('.china-legend');lg.innerHTML='';
  for(const l of graph.legends){
   const sp=document.createElement('span');sp.className='cnnon-legend-entry'+(l.now?' current':'');
   sp.title=(l.now?'Safra atual — linha sólida':'Histórico — traço '+(l.dash||'contínuo'));
   sp.innerHTML='<svg width="42" height="11" viewBox="0 0 42 11" aria-hidden="true"><line x1="1" y1="5.5" x2="41" y2="5.5" stroke="'+l.color+'" stroke-width="'+(l.now?'4':'2.8')+'"'+(l.dash?' stroke-dasharray="'+l.dash+'"':'')+' stroke-linecap="round" /></svg><b>'+label(l.year)+' · '+(l.kind==='china'?'China':'Não-China')+'</b>'+(l.missing?' <span class="cnnon-no-read">s/d</span>':'');
   lg.appendChild(sp);
  }
  const metrics=el.querySelector('.china-metrics'),current=graph.at[lastYear];
  const prev=graph.at[lastYear-1]||null;
  const pctDelta=(k)=>current&&prev?(current[k+'Pct']-prev[k+'Pct']):null;
  const volDelta=(k)=>current&&prev?(current[k]-prev[k])/1000:null;
  const signed=(v,suffix,precision=1)=>v==null?'s/d':(v>0?'+':'')+new Intl.NumberFormat('pt-BR',{minimumFractionDigits:precision,maximumFractionDigits:precision}).format(v)+suffix;
  const metric=(key,name,color)=>{
    const value=current?(config.mode==='share'?fmt(current[key+'Pct'])+'%':fmt(current[key]/1000)+' Mi t'):'s/d';
    const delta=config.mode==='share'?signed(pctDelta(key),' p.p.'):signed(volDelta(key),' Mi t');
    const changed=(config.mode==='share'?pctDelta(key):volDelta(key));
    return '<div class="cnnon-kpi"><div class="cnnon-kpi-head"><i style="background:'+color+'"></i>'+name+'</div><b>'+value+'</b><small>vs '+label(lastYear-1)+': <span class="'+(changed==null?'':changed>=0?'positive':'negative')+'">'+delta+'</span></small></div>';
  };
  const remaining=current?'<div class="cnnon-kpi"><div class="cnnon-kpi-head"><i style="background:#a5b3bf"></i>UNKNOWN</div><b>'+fmt(current.unknown/1000)+' Mi t</b><small>'+fmt(current.unknownPct)+'% do commitment</small></div>':'';
  metrics.innerHTML='<div class="cnnon-kpi-heading"><strong>Semana '+config.week+' · MY '+label(lastYear)+'</strong><span>'+(config.mode==='share'?'Participação no total · evolução em pontos percentuais':'Commitment acumulado · evolução em Mi t')+'</span></div>'+
   '<div class="cnnon-kpis">'+metric('china','China',NAVY)+metric('other','Não-China',TEAL)+remaining+'</div>'+
   '<p class="cnnon-footnote">Não-China = MUNDO − China − UNKNOWN. Share (%) considera o commitment MUNDO, inclusive UNKNOWN. Lacunas históricas não são interpoladas.</p>';
  sync();
  if(typeof window.wmFix==='function')window.wmFix(el);
  if(window.BRZFIT)window.BRZFIT(el);
  attachHover(chart,graph,config);
 };
 wk.onchange=()=>{config.week=Number(wk.value);draw();};
 mode.onchange=()=>{config.mode=mode.value;draw();};
 yearbar.onchange=()=>{config.compare=[...yearbar.querySelectorAll('input:checked')].map(x=>Number(x.dataset.compareYear));draw();};
 const quickPreset=which=>{
   const latest=years().at(-1);
   config.compare=which==='last'?[latest-1].filter(y=>years().includes(y)):[];
   yearbar.querySelectorAll('input[data-compare-year]').forEach(cb=>{cb.checked=config.compare.includes(Number(cb.dataset.compareYear));});
   draw();
 };
 quickLast.onclick=()=>quickPreset('last');
 quickClear.onclick=()=>quickPreset('clear');
 reset.onclick=()=>{const d=defaultConfig();config.week=d.week;config.mode=d.mode;config.compare=d.compare;wk.value=String(config.week);mode.value=config.mode;yearbar.querySelectorAll('input').forEach(cb=>cb.checked=config.compare.includes(Number(cb.dataset.compareYear)));draw();};
 png.onclick=()=>{if(typeof window.baixar==='function')window.baixar(el,'soja_china_nao_china_semana_'+config.week,920,490);};
 el._getWeek=()=>config.week;el._getMode=()=>config.mode;el._draw=draw;
 el._syncControls=()=>{config.week=Number(wk.value);config.mode=mode.value;config.compare=[...yearbar.querySelectorAll('input:checked')].map(x=>Number(x.dataset.compareYear));draw();};
 el._rebuild=()=>{const newer=build(com,c,null);el.replaceWith(newer);};
 draw();return el;
}
window.BRZChinaNonChina={build,revive:(el,com,c)=>{const sv={html:el.innerHTML,style:el.getAttribute('style'),sourceDataAtual:window.E.meta.atual};const newer=build(com,c,sv);el.replaceWith(newer);return newer;},rows,seriesAt,graphic,defaultConfig};
})();