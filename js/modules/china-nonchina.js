/* BRZ EUA e101 · Soja: China x destinos não-China, curvas de commitment por MY.
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
 const all=sel.flatMap(y=>rows(y).filter(p=>!p.missing&&p.week<=config.week));
 const keys=config.mode==='share'?['chinaPct','otherPct']:['china','other'];
 const ymax=config.mode==='share'?100:Math.max(5,Math.ceil(Math.max(0,...all.flatMap(r=>keys.map(k=>r[k]/1000)))/5)*5);
 const toValue=(r,k)=>config.mode==='share'?r[k]:r[k]/1000;
 const maxY=config.mode==='share'?100:ymax;
 const box={x0:58,x1:841,y0:36,y1:244,maxWeek:53,maxVal:maxY};
 const X=w=>box.x0+(w-1)/52*(box.x1-box.x0), Y=v=>box.y1-v/maxY*(box.y1-box.y0), parts=[],series=[];
 const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 parts.push('<svg data-cnnon-graph="1" viewBox="0 0 900 288" width="100%" xmlns="'+NS+'" role="img" tabindex="0" aria-label="Curvas de commitment soja China e destinos não-China, em '+(config.mode==='share'?'percentual':'milhões de toneladas')+' até a semana '+config.week+'" style="display:block;background:#fff;border-radius:4px">');
 // Graphic grid with reference axis.
 const yTicks=config.mode==='share'?[0,25,50,75,100]:[0,.25,.5,.75,1].map(q=>q*maxY);
 yTicks.forEach(v=>parts.push('<line x1="58" y1="'+Y(v).toFixed(1)+'" x2="841" y2="'+Y(v).toFixed(1)+'" stroke="#e6ebef" stroke-width="1"/><text x="49" y="'+(Y(v)+3).toFixed(1)+'" font-size="11" fill="#6b7280" text-anchor="end">'+fmt(v)+(config.mode==='share'?'%':'')+'</text>'));
 [1,5,9,13,17,21,25,29,33,37,41,45,49,53].forEach(w=>parts.push('<text x="'+X(w).toFixed(1)+'" y="269" font-size="10" text-anchor="middle" fill="#6b7280">'+w+'</text>'));
 parts.push('<text x="450" y="286" text-anchor="middle" font-size="10" fill="#6b7280">Semana do MY (set–ago)</text>');
 parts.push('<line data-cnnon-selected-week="1" x1="'+X(config.week).toFixed(1)+'" y1="29" x2="'+X(config.week).toFixed(1)+'" y2="244" stroke="#64748b" stroke-dasharray="2 4" stroke-width="1"/>');
 const legends=[];
 const sorted=sel.filter(y=>y!==cur).concat(cur);
 for(const year of sorted){
  const historical=year!==cur,index=yy.indexOf(year),dash=historical?HIST_DASH[index%HIST_DASH.length]:'';
  const r=rows(year).filter(p=>!p.missing&&p.week<=config.week);
  for(const [kind,key,color] of [['china',keys[0],NAVY],['other',keys[1],TEAL]]){
    let segments=[],seg=[],lastWeek=null;
    const flush=()=>{if(seg.length>1)segments.push(seg);seg=[]};
    for(const p of r){if(lastWeek!==null&&p.week-lastWeek>1)flush();seg.push(p);lastWeek=p.week;}
    flush();
    for(const block of segments){
      const path=block.map((p,i)=>(i?'L':'M')+X(p.week).toFixed(1)+' '+Y(toValue(p,key)).toFixed(1)).join(' ');
      parts.push('<path data-cnnon-series="'+year+'-'+kind+'" d="'+path+'" fill="none" stroke="'+color+'" stroke-width="'+(historical?'2.1':'3.4')+'" stroke-opacity="'+(historical?'0.72':'1')+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' stroke-linecap="round" stroke-linejoin="round"/>');
    }
    if(r.length===1){const p=r[0];parts.push('<circle cx="'+X(p.week).toFixed(1)+'" cy="'+Y(toValue(p,key)).toFixed(1)+'" r="2.7" fill="'+color+'"/>');}
    // Week X is a point of comparison; never replace missing data by zero.
    const selected=r.find(p=>p.week===config.week);
    if(selected){
      const v=toValue(selected,key),shown=fmt(v)+(config.mode==='share'?'%':' Mi t');
      parts.push('<circle data-cnnon-point="'+year+'-'+kind+'" cx="'+X(config.week).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="'+(historical?'3.5':'5')+'" fill="'+color+'" fill-opacity="'+(historical?'0.75':'1')+'" stroke="#fff" stroke-width="1.4"><title>'+escape(label(year)+' · '+(kind==='china'?'China':'Não-China')+' · '+shown)+'</title></circle>');
      if(!historical)parts.push('<text data-cnnon-endlabel="'+kind+'" x="'+Math.min(864,X(config.week)+8).toFixed(1)+'" y="'+(Y(v)+(kind==='china'?-11:15)).toFixed(1)+'" font-size="12" font-weight="700" fill="'+color+'">'+shown+'</text>');
    }
    series.push({year,kind,key,color,dash,now:!historical,points:r});
    legends.push({year,kind,color,dash,now:!historical,missing:!selected});
  }
 }
 parts.push('<g data-cnnon-hover-layer="1" visibility="hidden" pointer-events="none"><line data-cnnon-crosshair-x="1" x1="0" y1="'+box.y0+'" x2="0" y2="'+box.y1+'" stroke="#536779" stroke-width="1.1" stroke-dasharray="4 4"/><line data-cnnon-crosshair-y="1" x1="'+box.x0+'" y1="0" x2="'+box.x1+'" y2="0" stroke="#a6b4bf" stroke-width="1" stroke-dasharray="3 6"/><g data-cnnon-hover-markers="1"></g></g>');
 parts.push('</svg>');
 return {svg:parts.join(''),legends,years:sorted,at:Object.fromEntries(sorted.map(y=>[y,seriesAt(y,config.week)])),
  series,box,X,Y,toValue,hoverWeeks:[...new Set(all.map(p=>p.week))].sort((a,b)=>a-b)};
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
 el.style.minWidth='0';el.style.height='auto';el.style.minHeight='455px';
 if(config.style){el.style.cssText=config.style;el.style.gridColumn='1 / -1';el.style.height='auto';el.style.minHeight='455px';}
 el.innerHTML='<div class="p-card-h"><div><div class="p-card-t etext">'+c.t+'</div><div class="p-card-s etext">'+c.s+'</div></div><div class="cardtools"><div class="selrow" data-cnnon-controls="1" style="display:flex;align-items:center;flex-wrap:wrap;gap:6px"></div><div class="pal"></div></div></div><div class="china-year-controls" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px 15px 1px;font-size:11px"><strong>Comparar MY:</strong></div><div class="chart cnnon-chart" title="Passe o mouse ou use as setas sobre o gráfico" style="padding:4px 8px 0;min-height:240px"></div><div class="china-metrics" style="padding:2px 15px 9px"></div><div class="lg china-legend" style="display:flex;flex-wrap:wrap;column-gap:16px;row-gap:5px;padding:2px 14px 12px;font-size:11px"></div><div class="foot"><span class="etext">Fonte: USDA/FAS ESR · China / Não-China identificado / UNKNOWN</span><span class="etext">Mi t · Share</span></div>';
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
 const preset=(kind)=>{const latest=years().at(-1);config.compare=kind==='last'?[latest-1].filter(y=>years().includes(y)):[];yearbar.querySelectorAll('input[data-compare-year]').forEach(cb=>{cb.checked=config.compare.includes(Number(cb.dataset.compareYear));});draw();};
 for(const [kind,txt] of [['last','Atual + anterior'],['clear','Limpar anos']]){const b=document.createElement('button');b.type='button';b.className='cnnon-quick';b.dataset.cnnonPreset=kind;b.textContent=txt;b.title=kind==='last'?'Comparar somente as duas últimas safras':'Mostrar somente a safra atual';b.onclick=()=>preset(kind);yearbar.appendChild(b);}
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
  el.querySelector('.chart').innerHTML=graph.svg;
  const lg=el.querySelector('.china-legend');lg.innerHTML='';
  for(const l of graph.legends){
   const sp=document.createElement('span');sp.style.cssText='display:inline-flex;gap:5px;align-items:center;color:#344054';
   sp.innerHTML='<svg width="24" height="9" viewBox="0 0 24 9"><line x1="1" y1="4.5" x2="23" y2="4.5" stroke="'+l.color+'" stroke-width="'+(l.now?'3':'2')+'"'+(l.dash?' stroke-dasharray="'+l.dash+'"':'')+' /></svg><b>'+label(l.year)+' '+(l.kind==='china'?'China':'Não-China')+'</b>'+(l.missing?' <span style="opacity:.5">—</span>':'');
   lg.appendChild(sp);
  }
  const metrics=el.querySelector('.china-metrics'),current=graph.at[lastYear];
  const line=(y,d)=>{
   if(!d)return '<span style="color:#64748b">'+label(y)+': sem leitura completa na sem. '+config.week+'</span>';
   const value=(k)=>fmt(config.mode==='share'?d[k+'Pct']:d[k]/1000)+(config.mode==='share'?'%':' Mi t');
   return '<b>'+label(y)+'</b> · China <b style="color:'+NAVY+'">'+value('china')+'</b> · Não-China <b style="color:'+TEAL+'">'+value('other')+'</b> · UNKNOWN '+fmt(d.unknown/1000)+' Mi t';
  };
  metrics.innerHTML='<div style="font-size:12px;line-height:1.6">'+line(lastYear,current)+'</div><div style="font-size:10px;color:#667085;margin-top:3px">Não-China = MUNDO − China − UNKNOWN. Share (%) = respectivo destino ÷ commitment MUNDO. UNKNOWN é mantido fora das duas linhas; lacunas no histórico não são preenchidas.</div>';
  sync();
  if(typeof window.wmFix==='function')window.wmFix(el);
  if(window.BRZFIT)window.BRZFIT(el);
  attachHover(el.querySelector('.cnnon-chart'),graph,config);
 };
 wk.onchange=()=>{config.week=Number(wk.value);draw();};
 mode.onchange=()=>{config.mode=mode.value;draw();};
 yearbar.onchange=()=>{config.compare=[...yearbar.querySelectorAll('input:checked')].map(x=>Number(x.dataset.compareYear));draw();};
 reset.onclick=()=>{const d=defaultConfig();config.week=d.week;config.mode=d.mode;config.compare=d.compare;wk.value=String(config.week);mode.value=config.mode;yearbar.querySelectorAll('input').forEach(cb=>cb.checked=config.compare.includes(Number(cb.dataset.compareYear)));draw();};
 png.onclick=()=>{if(typeof window.baixar==='function')window.baixar(el,'soja_china_nao_china_semana_'+config.week,920,490);};
 el._getWeek=()=>config.week;el._getMode=()=>config.mode;el._draw=draw;
 el._syncControls=()=>{config.week=Number(wk.value);config.mode=mode.value;config.compare=[...yearbar.querySelectorAll('input:checked')].map(x=>Number(x.dataset.compareYear));draw();};
 el._rebuild=()=>{const newer=build(com,c,null);el.replaceWith(newer);};
 draw();return el;
}

/* e101: design e99 restaurado; ferramentas da e100 mantidas. */
const cssId='brz-cnnon-e101-style';
if(!document.getElementById(cssId)){
 const style=document.createElement('style');style.id=cssId;
 style.textContent="\n.cnnon-card{overflow:visible}\n.cnnon-card .china-year-controls{display:flex;gap:7px;align-items:center;flex-wrap:wrap;padding:5px 15px 2px;font-size:11px}\n.cnnon-quick{background:transparent;border:1px solid #d6e0e7;border-radius:5px;padding:3px 7px;font-size:10px;font-weight:600;color:#475d70;cursor:pointer}\n.cnnon-quick:hover{background:#f1f6f6}\n.cnnon-chart{position:relative;overflow:visible;min-height:245px!important}\n.cnnon-chart svg[data-cnnon-graph]{display:block;width:100%;max-width:875px;margin:0 auto;height:auto;max-height:280px;cursor:crosshair;touch-action:pan-y}\n.cnnon-chart svg[data-cnnon-graph]:focus-visible{outline:2px solid #0D9488;outline-offset:1px}\n.cnnon-tooltip{position:absolute;z-index:50;pointer-events:none;width:min(315px,calc(100% - 16px));background:rgba(255,255,255,.99);border:1px solid #cbd9e3;border-radius:8px;box-shadow:0 8px 26px rgba(14,40,59,.16);font-size:11px;color:#223c50;overflow:hidden;max-height:340px}\n.cnnon-tooltip[hidden]{display:none!important}\n.cnnon-tt-head{background:#eff4f7;padding:8px 10px;display:flex;justify-content:space-between;gap:8px;border-bottom:1px solid #dee8ed}\n.cnnon-tt-head b{font-size:12px;color:#183c56}.cnnon-tt-head span{font-size:9px;color:#61788b;font-weight:700}\n.cnnon-tt-content{max-height:280px;overflow-y:auto}\n.cnnon-tt-row{padding:8px 10px;border-top:1px solid #e9eef1}.cnnon-tt-row:first-child{border-top:none}\n.cnnon-tt-row.current{background:#f5faf9}.cnnon-tt-year{display:flex;align-items:center;gap:7px;color:#233b4e;font-weight:800;margin-bottom:5px}\n.cnnon-tt-year small{border-radius:12px;background:#d7f0eb;color:#0a7269;font-size:9px;padding:2px 6px}\n.cnnon-tt-item{display:grid;grid-template-columns:7px 62px 1fr auto;align-items:center;gap:7px;margin-top:3px;font-size:10.5px}\n.cnnon-tt-item i{width:7px;height:7px;border-radius:100%}.cnnon-tt-item i.navy{background:#1A3A5C}.cnnon-tt-item i.teal{background:#0D9488}\n.cnnon-tt-item b{font-weight:800;text-align:right;white-space:nowrap}.cnnon-tt-item small{font-size:9.5px;text-align:right;color:#657d8f;width:42px}\n.cnnon-tt-low{font-size:9px;color:#708294;margin-top:6px}.cnnon-tt-row.missing{display:flex;justify-content:space-between;color:#8696a2}\n@media(max-width:720px){\n.cnnon-chart{overflow-x:auto!important;overflow-y:hidden!important;min-height:225px!important}\n.cnnon-chart svg[data-cnnon-graph]{min-width:650px;width:650px!important;height:210px;max-height:210px}\n.cnnon-tooltip{position:sticky;left:6px!important;top:auto!important;bottom:4px;max-width:calc(100% - 12px);max-height:245px}\n.cnnon-tt-content{max-height:196px}\n}";
 document.head.appendChild(style);
}
window.BRZChinaNonChina={build,revive:(el,com,c)=>{const sv={html:el.innerHTML,style:el.getAttribute('style'),sourceDataAtual:window.E.meta.atual};const newer=build(com,c,sv);el.replaceWith(newer);return newer;},rows,seriesAt,graphic,defaultConfig};
})();